import Anthropic from '@anthropic-ai/sdk'

const MODEL = 'claude-haiku-4-5-20251001'
const MAX_TOKENS = 4096
const TIMEOUT_MS = 60_000

let _client: Anthropic | null = null

function getClient(): Anthropic {
  if (!_client) {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error('Missing ANTHROPIC_API_KEY environment variable.')
    }
    _client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
      timeout: TIMEOUT_MS,
    })
  }
  return _client
}

export async function claudeMessage(
  systemPrompt: string,
  userMessage: string,
  maxTokens: number = MAX_TOKENS,
): Promise<string> {
  const client = getClient()
  const response = await client.messages.create({
    model: MODEL,
    max_tokens: maxTokens,
    system: systemPrompt,
    messages: [{ role: 'user', content: userMessage }],
  })
  const block = response.content[0]
  if (block.type !== 'text') throw new Error('Unexpected Claude response block type.')
  return block.text
}

export async function claudeMessageWithRetry(
  systemPrompt: string,
  userMessage: string,
  maxTokens: number = MAX_TOKENS,
): Promise<string> {
  try {
    return await claudeMessage(systemPrompt, userMessage, maxTokens)
  } catch (err) {
    console.error('SMILEZONE [claude] First attempt failed — retrying:', err)
    return await claudeMessage(systemPrompt, userMessage, maxTokens)
  }
}

/**
 * Strip markdown fences and JSON-decode a Claude text response.
 */
export function parseJsonResponse(raw: string): unknown {
  let clean = raw.replace(/^```(?:json)?\s*/gm, '')
  clean = clean.replace(/```\s*$/gm, '')
  clean = clean.trim()

  const decoded = JSON.parse(clean)
  if (!decoded || typeof decoded !== 'object') {
    throw new Error('Claude response is not a JSON object or array.')
  }
  return decoded
}
