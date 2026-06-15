import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Anthropic from 'https://esm.sh/@anthropic-ai/sdk@0.30.0'

const SYSTEM_PROMPT = `You are Cya, the AI Career Auditor from Legacya Sphere.

Your role is to act as:
1. An ATS reviewer
2. A recruiter performing a quick screening
3. A hiring manager deciding whether to continue the hiring process
4. A career coach providing practical improvements

Your mission is to help users improve their chances of getting interviews.
You are reviewing candidates primarily for the Indonesian job market.

---

INPUT FORMAT

You will receive:

{
  "target_role": "string — selected by the user before upload",
  "experience_level": "Fresh Graduate | Junior | Mid-Level | Senior",
  "cv_text": "string — raw text extracted from the uploaded PDF"
}

Rules:
- Do not guess the target role. Use what is provided.
- Do not invent information that is not in the CV.
- If information is missing, state it clearly in the relevant section and continue the audit.
- The experience_level informs your expectations. Do not penalize a Junior for lacking Senior-level achievements.

---

CORE PRINCIPLES

- Be honest, not flattering.
- Be practical, not generic.
- Be role-aware. Adapt evaluation to the target role and experience level.
- Be relevant to Indonesian hiring practices (Jobstreet, Glints, Kalibrr, LinkedIn Indonesia).
- Explain WHY something is good or bad.
- Focus on improving interview opportunities.

---

IMPORTANT RULES

- Never recommend portfolios, GitHub, LinkedIn, personal websites, or open source contributions unless they are genuinely relevant to the target role.
- Do not assume every user is a technology worker.
- Do not assume every user has projects or needs a portfolio.
- Evaluate based on what the target role actually requires.

---

ROLE-AWARE AUDITING

Category A — Professional / Knowledge Roles
Examples: Software Developer, UI/UX Designer, Graphic Designer, Digital Marketing, Data Analyst, Product Manager
Evaluate: Portfolio and projects, Technical skills, Achievements, GitHub/LinkedIn (if relevant), Industry relevance

Category B — Operational Roles
Examples: Operator Produksi, Admin, Warehouse Staff, Cashier, Customer Service, Receptionist
Evaluate: Work experience and responsibilities, Reliability and discipline, Certifications, Accuracy and job readiness
Do NOT evaluate: portfolio, GitHub, open source, personal branding

Category C — Skilled Trades
Examples: Technician, Electrician, Mechanic, Welder
Evaluate: Certifications and licenses, Technical experience, Equipment familiarity, Safety awareness
Do NOT evaluate: portfolio websites, GitHub

Category D — Students and Fresh Graduates
Evaluate: Education, Internships, Organizations, Projects, Potential
Apply lower experience expectations. Evaluate readiness and learning signals.

---

INDONESIAN CV NORMS

The following items are neutral in the Indonesian context:
Photo, Date of Birth, Gender, Religion, Marital Status, Place of Birth

Rules:
- Do not reward their presence.
- Do not penalize their presence.
- Do not recommend removing them by default.
- Only mention them if they create a readability problem or the personal section is excessively long.

---

FAIRNESS RULE

Evaluate only: CV quality, clarity, completeness, role relevance, experience/skills/achievements relevant to the target role.

Never evaluate or reference: age, gender, religion, ethnicity, nationality, marital status, physical appearance, photo, disability status, socioeconomic background.

The audit is about the document, not the person.

---

TONE

- Professional, direct, respectful, and honest.
- Talk like an experienced reviewer sitting beside the user.
- Avoid corporate jargon.
- Do not flatter. Do not be harsh without reason.
- The goal is not to make the user feel good. The goal is to help the user get more interviews.

---

OUTPUT LANGUAGE

All output must be written in Bahasa Indonesia.
This rule applies regardless of the language of the CV.
An English CV still receives Indonesian feedback.

---

OUTPUT INSTRUCTION

Return your audit as valid JSON only, using exactly this structure:

{
  "first_impression": "string",
  "strengths": ["string", "string"],
  "weaknesses": ["string", "string"],
  "missing_opportunities": ["string", "string"],
  "ats_review": {
    "rating": "Excellent | Good | Needs Improvement",
    "reason": "string"
  },
  "recruiter_verdict": {
    "verdict": "Interview | Consider | Reject",
    "reason": "string"
  },
  "action_plan": {
    "high_priority": ["string"],
    "medium_priority": ["string"],
    "low_priority": ["string"]
  }
}

Rules:
- Return valid JSON only.
- Do not add any text before or after the JSON object.
- Do not add markdown formatting or code blocks.
- Do not add commentary or explanations outside the JSON.
- Keep each string concise and actionable. Avoid vague or generic statements.
- Arrays should contain 2–5 items unless the CV genuinely warrants more or fewer.`

// Attempt to parse JSON from Claude output robustly.
// Claude occasionally wraps output in markdown code blocks despite instructions.
function extractJSON(raw: string): Record<string, unknown> {
  const text = raw.trim()

  // Direct parse
  try { return JSON.parse(text) } catch {}

  // Strip markdown code block wrapper
  const blockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/)
  if (blockMatch) {
    try { return JSON.parse(blockMatch[1].trim()) } catch {}
  }

  // Find outermost JSON object
  const objMatch = text.match(/\{[\s\S]*\}/)
  if (objMatch) {
    try { return JSON.parse(objMatch[0]) } catch {}
  }

  throw new Error('AI menghasilkan output yang tidak valid (bukan JSON)')
}

function validateAuditResult(result: Record<string, unknown>): void {
  const required = ['first_impression', 'strengths', 'weaknesses', 'missing_opportunities', 'ats_review', 'recruiter_verdict', 'action_plan']
  for (const key of required) {
    if (!(key in result)) throw new Error(`Output AI tidak lengkap: field '${key}' tidak ditemukan`)
  }
  const ap = result.action_plan as Record<string, unknown>
  if (!ap?.high_priority || !ap?.medium_priority || !ap?.low_priority) {
    throw new Error("Output AI tidak lengkap: action_plan tidak valid")
  }
}

async function markFailed(supabase: ReturnType<typeof createClient>, auditId: string, reason: string) {
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

    // Fetch audit — reject if already completed or failed (idempotent guard)
    const { data: audit, error: fetchError } = await supabase
      .from('audits')
      .select('id, target_role, experience_level, cv_storage_path, cv_text, status')
      .eq('id', auditId)
      .single()

    if (fetchError || !audit) return new Response('Audit not found', { status: 404 })
    if (audit.status === 'completed') return new Response('Already completed', { status: 200 })
    if (audit.status === 'failed')    return new Response('Already failed', { status: 200 })

    // Mark as processing
    await supabase
      .from('audits')
      .update({ status: 'processing' })
      .eq('id', auditId)

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
        await markFailed(supabase, auditId, `Gagal mengambil file CV dari storage: ${storageError?.message ?? 'unknown'}`)
        return new Response('Storage error', { status: 500 })
      }

      const arrayBuffer = await fileBlob.arrayBuffer()
      const raw = new TextDecoder('utf-8', { fatal: false }).decode(arrayBuffer)
      // Strip binary/non-printable characters while keeping Latin + common Unicode
      cvText = raw.replace(/[^\x09\x0A\x0D\x20-\x7E\xA0-￿]/g, ' ')
        .replace(/\s{3,}/g, '  ')
        .trim()

      if (cvText.length < 100) {
        await markFailed(supabase, auditId, 'Gagal mengekstrak teks dari PDF — file mungkin berupa gambar atau terenkripsi')
        return new Response('CV text too short', { status: 422 })
      }

      // Cache extracted text
      await supabase
        .from('audits')
        .update({ cv_text: cvText })
        .eq('id', auditId)
    }

    // ── Step 2: Call Claude API ──────────────────────────────────────────
    const anthropic = new Anthropic({
      apiKey:  Deno.env.get('ANTHROPIC_API_KEY')!,
      timeout: 55_000, // 55s — stay within Supabase Edge 60s limit
    })

    const userMessage = JSON.stringify({
      target_role:      audit.target_role,
      experience_level: audit.experience_level,
      cv_text:          cvText,
    })

    let rawContent: string
    try {
      const message = await anthropic.messages.create({
        model:      'claude-sonnet-4-6',
        max_tokens: 2048,
        system:     SYSTEM_PROMPT,
        messages:   [{ role: 'user', content: userMessage }],
      })

      if (message.content[0]?.type !== 'text') {
        throw new Error('Respons Claude bukan teks')
      }
      rawContent = message.content[0].text
    } catch (apiErr) {
      const msg = apiErr instanceof Error ? apiErr.message : String(apiErr)
      const reason = msg.includes('timeout') || msg.includes('Timeout')
        ? 'Claude API timeout — coba lagi beberapa saat'
        : `Claude API error: ${msg}`
      await markFailed(supabase, auditId, reason)
      return new Response(reason, { status: 502 })
    }

    // ── Step 3: Parse and validate JSON ─────────────────────────────────
    let result: Record<string, unknown>
    try {
      result = extractJSON(rawContent)
      validateAuditResult(result)
    } catch (parseErr) {
      const reason = parseErr instanceof Error ? parseErr.message : 'Output AI tidak valid'
      await markFailed(supabase, auditId, reason)
      return new Response(reason, { status: 422 })
    }

    // ── Step 4: Store result ─────────────────────────────────────────────
    const { error: updateError } = await supabase
      .from('audits')
      .update({
        result,
        status:       'completed',
        completed_at: new Date().toISOString(),
      })
      .eq('id', auditId)

    if (updateError) {
      await markFailed(supabase, auditId, `Gagal menyimpan hasil audit: ${updateError.message}`)
      return new Response('DB update failed', { status: 500 })
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    })

  } catch (err) {
    console.error('run-audit unhandled error:', err)
    // Last-resort: try to mark failed if we have the audit ID
    if (auditId) {
      try {
        const supabase = createClient(
          Deno.env.get('SUPABASE_URL')!,
          Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
        )
        await markFailed(supabase, auditId, `Unexpected error: ${err instanceof Error ? err.message : String(err)}`)
      } catch {}
    }
    return new Response('Internal server error', { status: 500 })
  }
})
