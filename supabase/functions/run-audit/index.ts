import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { createAIProvider } from './_shared/ai/index.ts'

async function markFailed(
  supabase: ReturnType<typeof createClient>,
  auditId: string,
  reason: string,
) {
  await supabase
    .from('audits')
    .update({ status: 'failed', failure_reason: reason })
    .eq('id', auditId)
}

serve(async (req) => {
  let auditId: string | null = null

  try {
    const body = await req.json()
    auditId = body.audit_id
    if (!auditId) return new Response('audit_id required', { status: 400 })

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    )

    // ── Fetch audit (idempotent guard) ───────────────────────────────────
    const { data: audit, error: fetchError } = await supabase
      .from('audits')
      .select('id, target_role, experience_level, cv_storage_path, cv_text, status')
      .eq('id', auditId)
      .single()

    if (fetchError || !audit) return new Response('Audit not found', { status: 404 })
    if (audit.status === 'completed') return new Response('Already completed', { status: 200 })
    if (audit.status === 'failed')    return new Response('Already failed',    { status: 200 })

    await supabase.from('audits').update({ status: 'processing' }).eq('id', auditId)

    // ── Step 1: Resolve CV text ──────────────────────────────────────────
    let cvText = audit.cv_text

    if (!cvText) {
      if (!audit.cv_storage_path) {
        await markFailed(supabase, auditId, 'CV storage path tidak ditemukan')
        return new Response('No CV path', { status: 422 })
      }

      const { data: fileBlob, error: storageError } = await supabase.storage
        .from('cv-files')
        .download(audit.cv_storage_path)

      if (storageError || !fileBlob) {
        await markFailed(
          supabase, auditId,
          `Gagal mengambil file CV dari storage: ${storageError?.message ?? 'unknown'}`,
        )
        return new Response('Storage error', { status: 500 })
      }

      const arrayBuffer = await fileBlob.arrayBuffer()
      const raw = new TextDecoder('utf-8', { fatal: false }).decode(arrayBuffer)
      cvText = raw
        .replace(/[^\x09\x0A\x0D\x20-\x7E\xA0-￿]/g, ' ')
        .replace(/\s{3,}/g, '  ')
        .trim()

      if (cvText.length < 100) {
        await markFailed(
          supabase, auditId,
          'Gagal mengekstrak teks dari PDF — file mungkin berupa gambar atau terenkripsi',
        )
        return new Response('CV text too short', { status: 422 })
      }

      await supabase.from('audits').update({ cv_text: cvText }).eq('id', auditId)
    }

    // ── Step 2: Generate audit via AI provider ───────────────────────────
    let provider
    try {
      provider = createAIProvider()
    } catch (configErr) {
      const reason = configErr instanceof Error ? configErr.message : 'AI provider tidak dikonfigurasi'
      await markFailed(supabase, auditId, reason)
      return new Response(reason, { status: 503 })
    }

    let aiResponse
    try {
      // Wrap with a 55s timeout to stay within Supabase Edge's 60s wall-clock limit
      const timeout = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('AI provider timeout setelah 55 detik')), 55_000)
      )
      aiResponse = await Promise.race([
        provider.generateAudit({
          target_role:      audit.target_role,
          experience_level: audit.experience_level,
          cv_text:          cvText,
        }),
        timeout,
      ])
    } catch (aiErr) {
      const msg = aiErr instanceof Error ? aiErr.message : String(aiErr)
      const reason = msg.toLowerCase().includes('timeout')
        ? `AI provider timeout — coba lagi beberapa saat`
        : `AI provider error: ${msg}`
      await markFailed(supabase, auditId, reason)
      return new Response(reason, { status: 502 })
    }

    // ── Step 3: Store result + usage ─────────────────────────────────────
    const { error: updateError } = await supabase
      .from('audits')
      .update({
        result:       aiResponse.result,
        ai_usage:     aiResponse.usage,
        status:       'completed',
        completed_at: new Date().toISOString(),
      })
      .eq('id', auditId)

    if (updateError) {
      await markFailed(supabase, auditId, `Gagal menyimpan hasil audit: ${updateError.message}`)
      return new Response('DB update failed', { status: 500 })
    }

    console.log(
      `[run-audit] completed audit=${auditId} ` +
      `model=${aiResponse.usage.model} ` +
      `tokens=${aiResponse.usage.prompt_tokens}+${aiResponse.usage.completion_tokens} ` +
      `cost_usd=${aiResponse.usage.estimated_cost} ` +
      `duration=${aiResponse.usage.duration_ms}ms`,
    )

    return new Response(JSON.stringify({ success: true, usage: aiResponse.usage }), {
      headers: { 'Content-Type': 'application/json' },
    })

  } catch (err) {
    console.error('run-audit unhandled error:', err)
    if (auditId) {
      try {
        const supabase = createClient(
          Deno.env.get('SUPABASE_URL')!,
          Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
        )
        await markFailed(
          supabase, auditId,
          `Unexpected error: ${err instanceof Error ? err.message : String(err)}`,
        )
      } catch {}
    }
    return new Response('Internal server error', { status: 500 })
  }
})
