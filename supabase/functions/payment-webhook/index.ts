import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  try {
    // Verify Xendit webhook token
    const webhookToken = req.headers.get('x-callback-token')
    if (webhookToken !== Deno.env.get('XENDIT_WEBHOOK_TOKEN')) {
      return new Response('Unauthorized', { status: 401 })
    }

    const payload = await req.json()
    const { external_id, status, id: xenditPaymentId, payment_method } = payload

    if (!external_id?.startsWith('cya-')) {
      return new Response('Ignored', { status: 200 })
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    )

    const paymentStatus = status === 'PAID' ? 'paid'
      : status === 'EXPIRED' ? 'expired'
      : 'failed'

    // Update payment record
    const { data: payment } = await supabase
      .from('payments')
      .update({
        status:           paymentStatus,
        xendit_payment_id: xenditPaymentId,
        payment_method,
        webhook_payload:  payload,
      })
      .eq('xendit_external_id', external_id)
      .select('audit_id')
      .single()

    if (!payment) return new Response('Payment not found', { status: 404 })

    if (paymentStatus === 'paid') {
      // Update audit to payment_verified
      await supabase
        .from('audits')
        .update({ status: 'payment_verified' })
        .eq('id', payment.audit_id)

      // Trigger run-audit function
      await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/run-audit`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ audit_id: payment.audit_id }),
      })
    }

    return new Response('OK', { status: 200 })
  } catch (err) {
    console.error('Webhook error:', err)
    return new Response('Error', { status: 500 })
  }
})
