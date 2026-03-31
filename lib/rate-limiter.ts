import { NextRequest } from 'next/server'
import { supabase } from './supabase'

const LIMITS: Record<string, number> = {
  submit: 50,
  get_questions: 10,
}

async function hashIp(ip: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(ip)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}

function extractIp(request: NextRequest): string {
  // Vercel always sets X-Forwarded-For
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    const first = forwarded.split(',')[0].trim()
    if (first) return first
  }
  return '0.0.0.0'
}

/**
 * Returns true if the request is allowed, false if rate-limited.
 * Also records the attempt in Supabase.
 */
export async function checkRateLimit(
  request: NextRequest,
  action: string,
): Promise<boolean> {
  const maxPerDay = LIMITS[action] ?? 10
  const ip = extractIp(request)
  const ipHash = await hashIp(ip)

  // Count attempts in last 24 hours
  const { count, error: countError } = await supabase
    .from('rate_limits')
    .select('*', { count: 'exact', head: true })
    .eq('ip_hash', ipHash)
    .eq('action', action)
    .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())

  if (countError) {
    console.error('SMILEZONE [rate_limit] count error — failing closed:', countError.message)
    return false
  }

  if ((count ?? 0) >= maxPerDay) {
    console.warn(`SMILEZONE [rate_limit] Blocked: action=${action} ip_hash=${ipHash.slice(0, 8)}… count=${count}`)
    return false
  }

  // Record this attempt
  const { error: insertError } = await supabase
    .from('rate_limits')
    .insert({ ip_hash: ipHash, action })

  if (insertError) {
    console.error('SMILEZONE [rate_limit] insert error:', insertError.message)
  }

  return true
}
