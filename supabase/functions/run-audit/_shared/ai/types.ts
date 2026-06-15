export interface AuditInput {
  target_role: string
  experience_level: string
  cv_text: string
}

export interface AuditResult {
  first_impression: string
  strengths: string[]
  weaknesses: string[]
  missing_opportunities: string[]
  ats_review: {
    rating: 'Excellent' | 'Good' | 'Needs Improvement'
    reason: string
  }
  recruiter_verdict: {
    verdict: 'Interview' | 'Consider' | 'Reject'
    reason: string
  }
  action_plan: {
    high_priority: string[]
    medium_priority: string[]
    low_priority: string[]
  }
}

export interface AIUsage {
  model: string
  duration_ms: number
  prompt_tokens: number
  completion_tokens: number
  estimated_cost: number  // USD
}

export interface AIResponse {
  result: AuditResult
  usage: AIUsage
}
