// Attempt to parse JSON from AI output robustly.
// Models occasionally wrap output in markdown code blocks despite explicit instructions.
export function extractJSON(raw: string): Record<string, unknown> {
  const text = raw.trim()

  try { return JSON.parse(text) } catch {}

  const blockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/)
  if (blockMatch) {
    try { return JSON.parse(blockMatch[1].trim()) } catch {}
  }

  const objMatch = text.match(/\{[\s\S]*\}/)
  if (objMatch) {
    try { return JSON.parse(objMatch[0]) } catch {}
  }

  throw new Error('AI menghasilkan output yang tidak valid (bukan JSON)')
}

export function validateAuditResult(result: Record<string, unknown>): void {
  const required = [
    'first_impression',
    'strengths',
    'weaknesses',
    'missing_opportunities',
    'ats_review',
    'recruiter_verdict',
    'action_plan',
  ]

  for (const key of required) {
    if (!(key in result)) {
      throw new Error(`Output AI tidak lengkap: field '${key}' tidak ditemukan`)
    }
  }

  const ap = result.action_plan as Record<string, unknown>
  if (!ap?.high_priority || !ap?.medium_priority || !ap?.low_priority) {
    throw new Error('Output AI tidak lengkap: action_plan tidak valid')
  }
}
