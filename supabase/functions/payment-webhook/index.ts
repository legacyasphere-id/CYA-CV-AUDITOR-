import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

async function sha512hex(input: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-512', new TextEncoder().encode(input))
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
}

serve(async (req) => {
  let payload: Record<string, string>
  try {
    payload = await req.json()
  } catch {
    return new Response('Invalid JSON payload', { status: 400 })
  }

  const {
    order_id:           orderId,
    transaction_status: txStatus,
    transaction_id:     txId,
    fraud_status:       fraudStatus,
    status_code:        statusCode,
    gross_amount:       grossAmount,
    payment_type:       paymentType,
    signature_key:      signatureKey,
  } = payload

  // Only process CYA audits
  if (!orderId?.startsWith('cya-')) {
    return new Response('Ignored — not a CYA audit', { status: 200 })
  }

  // ── Security: Verify Midtrans signature ──────────────────────────────
  const serverKey = Deno.env.get('MIDTRANS_SERVER_KEY')
  if (!serverKey) {
    console.error('MIDTRANS_SERVER_KEY not configured')
    return new Response('Webhook not configured', { status: 503 })
  }

  const expectedSig = await sha512hex(orderId + statusCode + grossAmount + serverKey)
  if (signatureKey !== expectedSig) {
    console.warn('Invalid Midtrans signature for order:', orderId)
    return new Response('Unauthorized', { status: 401 })
  }

  // ── Map Midtrans status → payment status ─────────────────────────────
  const isSuccess =
    txStatus === 'settlement' ||
    (txStatus === 'capture' && fraudStatus === 'accept')

  const isFailed  = txStatus === 'cancel' || txStatus === 'deny' || txStatus === 'expire'
  const isPending = txStatus === 'pending'

  if (isPending) {
    // Pending = payment initiated but not confirmed yet — wait for settlement
    console.log(`Payment pending for order ${orderId}`)
    return new Response('OK', { status: 200 })
  }

  if (!isSuccess && !isFailed) {
    console.log(`Unhandled Midtrans status '${txStatus}' for ${orderId}`)
    return new Response('Acknowledged', { status: 200 })
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  )

  const paymentStatus = isSuccess ? 'paid' : txStatus === 'expire' ? 'expired' : 'failed'

  // ── Update payment record ────────────────────────────────────────────
  const { data: payment, error: paymentError } = await supabase
    .from('payments')
    .update({
      status:            paymentStatus,
      xendit_payment_id: txId ?? null,   // reused column for transaction_id
      payment_method:    paymentType ?? null,
      webhook_payload:   payload,
    })
    .eq('xendit_external_id', orderId)   // reused column for order_id
    .select('audit_id')
    .single()

  if (paymentError || !payment) {
    console.error('Failed to update payment record:', paymentError)
    // Return 200 so Midtrans does not retry
    return new Response('Payment record not found', { status: 200 })
  }

  const auditId = payment.audit_id

  // ── Handle non-paid outcomes ─────────────────────────────────────────
  if (!isSuccess) {
    const failureReason =
      txStatus === 'expire' ? 'Pembayaran kadaluarsa' :
      txStatus === 'cancel' ? 'Pembayaran dibatalkan'  : 'Pembayaran ditolak'

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
    }
  } catch (err) {
    console.error('Failed to trigger run-audit:', err)
  }

  return new Response('OK', { status: 200 })
})
