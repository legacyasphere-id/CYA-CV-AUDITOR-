import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { nanoid } from 'https://esm.sh/nanoid@5'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const VALID_EXPERIENCE_LEVELS = ['Fresh Graduate', 'Junior', 'Mid-Level', 'Senior'] as const
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const AUDIT_PRICE_IDR = 10_000

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
      await supabase.storage.from('cv-files').remove([storagePath])
      console.error('Audit insert failed:', insertError)
      return json({ error: 'Gagal membuat audit. Coba lagi.' }, 500)
    }

    auditId = audit.id

    // ── Step 4: Create payment record ───────────────────────────────────
    const orderId = `cya-${publicId}`

    const { error: paymentInsertError } = await supabase
      .from('payments')
      .insert({
        audit_id:           auditId,
        xendit_external_id: orderId, // reused as order_id
        amount:             AUDIT_PRICE_IDR,
        currency:           'IDR',
        status:             'pending',
      })

    if (paymentInsertError) {
      await supabase.from('audits').update({ status: 'failed', failure_reason: 'Gagal membuat record pembayaran' }).eq('id', auditId)
      await supabase.storage.from('cv-files').remove([storagePath])
      return json({ error: 'Gagal menyiapkan pembayaran. Coba lagi.' }, 500)
    }

    await supabase.from('audits').update({ status: 'payment_pending' }).eq('id', auditId)

    // ── Step 5: Create Midtrans Snap transaction ─────────────────────────
    const midtransServerKey = Deno.env.get('MIDTRANS_SERVER_KEY')
    if (!midtransServerKey) {
      await supabase.from('audits').update({ status: 'failed', failure_reason: 'Konfigurasi pembayaran tidak tersedia' }).eq('id', auditId)
      return json({ error: 'Sistem pembayaran belum dikonfigurasi.' }, 503)
    }

    const isProduction = Deno.env.get('MIDTRANS_IS_PRODUCTION') === 'true'
    const snapBaseUrl  = isProduction
      ? 'https://app.midtrans.com/snap/v1/transactions'
      : 'https://app.sandbox.midtrans.com/snap/v1/transactions'

    let snapData: { token: string; redirect_url: string }
    try {
      const snapRes = await fetch(snapBaseUrl, {
        method:  'POST',
        headers: {
          Authorization:  `Basic ${btoa(midtransServerKey + ':')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transaction_details: {
            order_id:     orderId,
            gross_amount: AUDIT_PRICE_IDR,
          },
          item_details: [{
            id:       'audit-cv',
            price:    AUDIT_PRICE_IDR,
            quantity: 1,
            name:     `Audit CV — ${targetRole}`,
          }],
          credit_card: { secure: true },
          callbacks: {
            finish: `${Deno.env.get('APP_URL')}/result/${publicId}`,
          },
        }),
      })

      if (!snapRes.ok) {
        const errBody = await snapRes.text()
        throw new Error(`Midtrans ${snapRes.status}: ${errBody}`)
      }
      snapData = await snapRes.json()
    } catch (snapErr) {
      const reason = `Gagal membuat sesi pembayaran: ${snapErr instanceof Error ? snapErr.message : String(snapErr)}`
      await supabase.from('audits').update({ status: 'failed', failure_reason: reason }).eq('id', auditId)
      console.error(reason)
      return json({ error: 'Gagal membuat sesi pembayaran. Coba lagi.' }, 502)
    }

    return json({
      public_id:    publicId,
      snap_token:   snapData.token,
      payment_url:  snapData.redirect_url,
    })

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
