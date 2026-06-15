import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { nanoid } from 'https://esm.sh/nanoid@5'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const VALID_EXPERIENCE_LEVELS = ['Fresh Graduate', 'Junior', 'Mid-Level', 'Senior'] as const
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  )

  let auditId: string | null = null

  try {
    // ── Step 1: Parse and validate input ────────────────────────────────
    let formData: FormData
    try {
      formData = await req.formData()
    } catch {
      return json({ error: 'Request tidak valid. Gunakan multipart/form-data.' }, 400)
    }

    const targetRole      = (formData.get('target_role') as string)?.trim()
    const experienceLevel = (formData.get('experience_level') as string)?.trim()
    const cvFile          = formData.get('cv_file') as File | null

    if (!targetRole)      return json({ error: 'target_role wajib diisi.' }, 400)
    if (!experienceLevel) return json({ error: 'experience_level wajib diisi.' }, 400)
    if (!cvFile)          return json({ error: 'cv_file wajib diupload.' }, 400)

    if (!VALID_EXPERIENCE_LEVELS.includes(experienceLevel as never)) {
      return json({ error: `experience_level tidak valid. Pilih salah satu: ${VALID_EXPERIENCE_LEVELS.join(', ')}` }, 400)
    }

    if (cvFile.type !== 'application/pdf') {
      return json({ error: 'File harus berformat PDF.' }, 400)
    }

    if (cvFile.size > MAX_FILE_SIZE) {
      return json({ error: 'Ukuran file maksimal 5MB.' }, 400)
    }

    if (cvFile.size < 1000) {
      return json({ error: 'File PDF terlalu kecil. Pastikan CV tidak kosong.' }, 400)
    }

    // ── Step 2: Upload CV to storage ─────────────────────────────────────
    const publicId    = nanoid(8)
    const storagePath = `cvs/${publicId}/${cvFile.name}`

    const { error: uploadError } = await supabase.storage
      .from('cv-files')
      .upload(storagePath, cvFile, { contentType: 'application/pdf', upsert: false })

    if (uploadError) {
      console.error('Storage upload failed:', uploadError)
      return json({ error: 'Gagal mengupload CV. Coba lagi.' }, 500)
    }

    // ── Step 3: Create audit record ──────────────────────────────────────
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

    if (insertError || !audit) {
      // Clean up orphaned storage file
      await supabase.storage.from('cv-files').remove([storagePath])
      console.error('Audit insert failed:', insertError)
      return json({ error: 'Gagal membuat audit. Coba lagi.' }, 500)
    }

    auditId = audit.id

    // ── Step 4: Create payment record ───────────────────────────────────
    const xenditExternalId = `cya-${publicId}`

    const { error: paymentInsertError } = await supabase
      .from('payments')
      .insert({
        audit_id:           auditId,
        xendit_external_id: xenditExternalId,
        amount:             1000,
        currency:           'IDR',
        status:             'pending',
      })

    if (paymentInsertError) {
      await supabase.from('audits').update({ status: 'failed', failure_reason: 'Gagal membuat record pembayaran' }).eq('id', auditId)
      await supabase.storage.from('cv-files').remove([storagePath])
      return json({ error: 'Gagal menyiapkan pembayaran. Coba lagi.' }, 500)
    }

    // Update audit to payment_pending
    await supabase
      .from('audits')
      .update({ status: 'payment_pending' })
      .eq('id', auditId)

    // ── Step 5: Create Xendit invoice ────────────────────────────────────
    const xenditKey = Deno.env.get('XENDIT_SECRET_KEY')
    if (!xenditKey) {
      await supabase.from('audits').update({ status: 'failed', failure_reason: 'Konfigurasi pembayaran tidak tersedia' }).eq('id', auditId)
      return json({ error: 'Sistem pembayaran belum dikonfigurasi.' }, 503)
    }

    let xenditData: { id: string; invoice_url: string }
    try {
      const xenditRes = await fetch('https://api.xendit.co/v2/invoices', {
        method:  'POST',
        headers: {
          Authorization:  `Basic ${btoa(xenditKey + ':')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          external_id:          xenditExternalId,
          amount:               1000,
          currency:             'IDR',
          description:          `Audit CV — ${targetRole}`,
          success_redirect_url: `${Deno.env.get('APP_URL')}/result/${publicId}`,
          failure_redirect_url: `${Deno.env.get('APP_URL')}/audit`,
          invoice_duration:     86400, // 24 hours
        }),
      })

      if (!xenditRes.ok) {
        const errBody = await xenditRes.text()
        throw new Error(`Xendit ${xenditRes.status}: ${errBody}`)
      }
      xenditData = await xenditRes.json()
    } catch (xenditErr) {
      const reason = `Gagal membuat link pembayaran: ${xenditErr instanceof Error ? xenditErr.message : String(xenditErr)}`
      await supabase.from('audits').update({ status: 'failed', failure_reason: reason }).eq('id', auditId)
      console.error(reason)
      return json({ error: 'Gagal membuat link pembayaran. Coba lagi.' }, 502)
    }

    // Store Xendit payment ID
    await supabase
      .from('payments')
      .update({ xendit_payment_id: xenditData.id })
      .eq('xendit_external_id', xenditExternalId)

    return json({ public_id: publicId, payment_url: xenditData.invoice_url })

  } catch (err) {
    console.error('create-audit unhandled error:', err)
    if (auditId) {
      try {
        await supabase.from('audits')
          .update({ status: 'failed', failure_reason: `Unexpected error: ${err instanceof Error ? err.message : String(err)}` })
          .eq('id', auditId)
      } catch {}
    }
    return json({ error: 'Terjadi kesalahan. Coba lagi.' }, 500)
  }
})
