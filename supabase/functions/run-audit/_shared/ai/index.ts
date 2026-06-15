import type { AIProvider } from './provider.ts'
import { OpenRouterProvider } from './providers/openrouter.ts'

export function createAIProvider(): AIProvider {
  const apiKey = Deno.env.get('OPENROUTER_API_KEY')
  const model  = Deno.env.get('OPENROUTER_MODEL') ?? 'openai/gpt-4.1-mini'

  if (!apiKey) throw new Error('OPENROUTER_API_KEY tidak dikonfigurasi')

  return new OpenRouterProvider(apiKey, model)
}

export type { AIProvider }
export type { AuditInput, AuditResult, AIResponse, AIUsage } from './types.ts'
