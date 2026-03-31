import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Server-only — never import this file in components or client code.

let _supabase: SupabaseClient | null = null

export function getSupabase(): SupabaseClient {
  if (!_supabase) {
    const url = process.env.SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_KEY
    if (!url || !key) {
      throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_KEY environment variables.')
    }
    _supabase = createClient(url, key, { auth: { persistSession: false } })
  }
  return _supabase
}

// Convenience proxy so callers can use `supabase.from(...)` directly
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const client = getSupabase()
    const value = (client as unknown as Record<string | symbol, unknown>)[prop]
    if (typeof value === 'function') return value.bind(client)
    return value
  },
})
