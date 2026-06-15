import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  // ── Security: Verify Xendit webhook token ────────────────────────────
  const webhookToken = req.headers.get('x-callback-token')
  const expectedToken = Deno.env.get('XENDIT_WEBHOOK_TOKEN')

  if (!expectedToken) {
    console.error('XENDIT_WEBHOOK_TOKEN not configured')
    return new Response('Webhook not configured', { status: 503 })
  }

  if (webhookToken !== expectedToken) {
    console.warn('Invalid webhook token received')
    return new Response('Unauthorized', { status: 401 })
  }

  let payload: Record<string, unknown>
  try {
    payload = await req.json()
  } catch {
    return new Response('Invalid JSON payload', { status: 400 })
  }

  const externalId     = payload.external_id as string | undefined
  const status         = payload.status as string | undefined
  const xenditPayId    = payload.id as string | undefined
  const paymentMethod  = payload.payment_method as string | undefined

  // Only process CYA audits
  if (!externalId?.startsWith('cya-')) {
    return new Response('Ignored — not a CYA audit', { status: 200 })
  }

  if (!status || !xenditPayId) {
    console.warn('Webhook missing required fields:', { externalId, status, xenditPayId })
    return new Response('Missing required fields', { status: 400 })
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  )

  // Map Xendit status → our payment status
  const paymentStatus =
    status === 'PAID'    ? 'paid'    :
    status === 'EXPIRED' ? 'expired' :
    status === 'FAILED'  ? 'failed'  : null

  if (!paymentStatus) {
    // Unknown status — log and acknowledge (Xendit expects 200)
    console.log(`Unhandled Xendit status '${status}' for ${externalId}`)
    return new Response('Acknowledged', { status: 200 })
  }

  // ── Update payment record ────────────────────────────────────────────
  const { data: payment, error: paymentError } = await supabase
    .from('payments')
    .update({
      status:            paymentStatus,
      xendit_payment_id: xenditPayId,
      payment_method:    paymentMethod ?? null,
      webhook_payload:   payload,
    })
    .eq('xendit_external_id', externalId)
    .select('audit_id')
    .single()

  if (paymentError || !payment) {
    console.error('Failed to update payment record:', paymentError)
    // Return 200 to Xendit so it doesn't retry — we'll handle manually
    return new Response('Payment record not found', { status: 200 })
  }

  const auditId = payment.audit_id

  // ── Handle non-paid outcomes ─────────────────────────────────────────
  if (paymentStatus !== 'paid') {
    const failureReason =
      paymentStatus === 'expired' ? 'Pembayaran kadaluarsa' : 'Pembayaran gagal'

    await supabase
      .from('audits')
      .update({ status: 'failed', failure_reason: failureReason })
      .eq('id', auditId)

    return new Response('OK', { status: 200 })
  }

  // ── Payment confirmed: update audit and trigger run-audit ─────────────
  await supabase
    .from('audits')
    .update({ status: 'payment_verified' })
    .eq('id', auditId)

  // Fire-and-forget run-audit (webhook must respond quickly)
  // Supabase Edge Function invocation is async — failure here won't affect webhook ACK
  try {
    const runAuditUrl = `${Deno.env.get('SUPABASE_URL')}/functions/v1/run-audit`
    const triggerRes = await fetch(runAuditUrl, {
      method:  'POST',
      headers: {
        Authorization:  `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ audit_id: auditId }),
    })

    if (!triggerRes.ok) {
      const errText = await triggerRes.text()
      console.error(`run-audit trigger failed for audit ${auditId}:`, errText)
      // Do NOT mark as failed here — run-audit handles its own failure states
    }
  } catch (err) {
    console.error('Failed to trigger run-audit:', err)
    // run-audit can be triggered manually if this fails
  }

  return new Response('OK', { status: 200 })
})
