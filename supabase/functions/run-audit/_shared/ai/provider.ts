import type { AuditInput, AIResponse } from './types.ts'

export interface AIProvider {
  generateAudit(input: AuditInput): Promise<AIResponse>
}
