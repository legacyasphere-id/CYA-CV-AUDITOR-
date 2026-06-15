import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { nanoid } from 'https://esm.sh/nanoid@5'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    )

    const formData = await req.formData()
    const targetRole      = formData.get('target_role') as string
    const experienceLevel = formData.get('experience_level') as string
    const cvFile          = formData.get('cv_file') as File

    if (!targetRole || !experienceLevel || !cvFile) {
      return new Response(JSON.stringify({ error: 'Data tidak lengkap.' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const publicId = nanoid(8)
    const storagePath = `cvs/${publicId}/${cvFile.name}`

    // Upload CV to storage
    const { error: uploadError } = await supabase.storage
      .from('cv-files')
      .upload(storagePath, cvFile, { contentType: 'application/pdf' })

    if (uploadError) throw new Error('Gagal mengupload CV.')

    // Create audit record
    const { data: audit, error: insertError } = await supabase
      .from('audits')
      .insert({
        public_id:        publicId,
        target_role:      targetRole,
        experience_level: experienceLevel,
        cv_filename:      cvFile.name,
        cv_storage_path:  storagePath,
        status:           'uploaded',
      })
      .select('id, public_id')
      .single()

    if (insertError) throw new Error('Gagal membuat audit.')

    // Create payment record
    const { error: paymentInsertError } = await supabase
      .from('payments')
      .insert({
        audit_id:           audit.id,
        xendit_external_id: `cya-${publicId}`,
        amount:             1000,
        currency:           'IDR',
        status:             'pending',
      })

    if (paymentInsertError) throw new Error('Gagal membuat pembayaran.')

    // Update audit status
    await supabase
      .from('audits')
      .update({ status: 'payment_pending' })
      .eq('id', audit.id)

    // Create Xendit invoice
    const xenditRes = await fetch('https://api.xendit.co/v2/invoices', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${btoa(Deno.env.get('XENDIT_SECRET_KEY')! + ':')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        external_id:  `cya-${publicId}`,
        amount:       1000,
        currency:     'IDR',
        description:  `Audit CV — ${targetRole}`,
        success_redirect_url: `${Deno.env.get('APP_URL')}/result/${publicId}`,
        failure_redirect_url: `${Deno.env.get('APP_URL')}/audit`,
      }),
    })

    if (!xenditRes.ok) throw new Error('Gagal membuat link pembayaran.')
    const xenditData = await xenditRes.json()

    // Store Xendit payment ID
    await supabase
      .from('payments')
      .update({ xendit_payment_id: xenditData.id })
      .eq('xendit_external_id', `cya-${publicId}`)

    return new Response(
      JSON.stringify({ public_id: publicId, payment_url: xenditData.invoice_url }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  }
})
