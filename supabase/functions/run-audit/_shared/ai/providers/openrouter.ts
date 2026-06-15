import type { AIProvider } from '../provider.ts'
import type { AuditInput, AuditResult, AIResponse } from '../types.ts'
import { SYSTEM_PROMPT } from '../system-prompt.ts'
import { extractJSON, validateAuditResult } from '../utils.ts'

// Approximate pricing per 1M tokens in USD.
// Update as OpenRouter pricing changes. Used only for cost estimation logging.
const MODEL_PRICING: Record<string, { input: number; output: number }> = {
  'openai/gpt-4.1-mini':           { input: 0.40,  output: 1.60  },
  'openai/gpt-4.1':                { input: 2.00,  output: 8.00  },
  'openai/gpt-4o-mini':            { input: 0.15,  output: 0.60  },
  'openai/gpt-4o':                 { input: 2.50,  output: 10.00 },
  'anthropic/claude-sonnet-4':     { input: 3.00,  output: 15.00 },
  'anthropic/claude-haiku-4':      { input: 0.80,  output: 4.00  },
  'qwen/qwen-2.5-72b-instruct':    { input: 0.23,  output: 0.40  },
  'deepseek/deepseek-chat':        { input: 0.14,  output: 0.28  },
  'google/gemini-flash-1.5':       { input: 0.075, output: 0.30  },
  'google/gemini-2.0-flash-001':   { input: 0.10,  output: 0.40  },
}

function estimateCost(model: string, promptTokens: number, completionTokens: number): number {
  const pricing = MODEL_PRICING[model] ?? { input: 0, output: 0 }
  return parseFloat(
    ((promptTokens * pricing.input + completionTokens * pricing.output) / 1_000_000).toFixed(8)
  )
}

export class OpenRouterProvider implements AIProvider {
  private apiKey: string
  private model: string

  constructor(apiKey: string, model: string) {
    this.apiKey = apiKey
    this.model  = model
  }

  async generateAudit(input: AuditInput): Promise<AIResponse> {
    const startTime = Date.now()

    const requestBody = {
      model:      this.model,
      max_tokens: 2048,
      temperature: 0.4,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user',   content: JSON.stringify(input) },
      ],
      // response_format forces JSON output on models that support it (GPT-4.1, etc.)
      // Models that don't support it will ignore this field; extractJSON() handles fallback.
      response_format: { type: 'json_object' },
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method:  'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type':  'application/json',
        'HTTP-Referer':  'https://cya.legacyasphere.id',
        'X-Title':       'Cya CV Auditor',
      },
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      const errText = await response.text()
      throw new Error(`OpenRouter ${response.status}: ${errText}`)
    }

    const data = await response.json()
    const durationMs = Date.now() - startTime

    const rawContent = data.choices?.[0]?.message?.content
    if (!rawContent) {
      throw new Error('OpenRouter mengembalikan konten kosong')
    }

    const parsed = extractJSON(rawContent)
    validateAuditResult(parsed)

    const promptTokens     = data.usage?.prompt_tokens     ?? 0
    const completionTokens = data.usage?.completion_tokens ?? 0

    console.log(`[run-audit] model=${this.model} duration=${durationMs}ms tokens=${promptTokens}+${completionTokens}`)

    return {
      result: parsed as unknown as AuditResult,
      usage: {
        model:             this.model,
        duration_ms:       durationMs,
        prompt_tokens:     promptTokens,
        completion_tokens: completionTokens,
        estimated_cost:    estimateCost(this.model, promptTokens, completionTokens),
      },
    }
  }
}
