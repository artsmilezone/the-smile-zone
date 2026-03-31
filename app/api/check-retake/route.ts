import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { BYPASS_EMAILS } from '@/lib/bypass-emails'

const RETAKE_DAYS = 30
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: NextRequest) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 })
  }

  const data = body as Record<string, unknown>
  const email = typeof data.email === 'string' ? data.email.trim().toLowerCase() : ''

  if (!email || !EMAIL_REGEX.test(email)) {
    return NextResponse.json({ error: 'A valid email address is required.' }, { status: 400 })
  }

  if (BYPASS_EMAILS.has(email)) {
    return NextResponse.json({ allowed: true })
  }

  const retakeWindow = new Date(Date.now() - RETAKE_DAYS * 24 * 60 * 60 * 1000).toISOString()
  const { data: lastAssessment, error: retakeError } = await supabase
    .from('assessments')
    .select('created_at')
    .eq('player_email', email)
    .gte('created_at', retakeWindow)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (retakeError) {
    console.error('SMILEZONE [check-retake] DB error:', retakeError.message)
    // On DB error allow through — the submit endpoint will double-check
    return NextResponse.json({ allowed: true })
  }

  if (lastAssessment) {
    const retakeDate = new Date(lastAssessment.created_at)
    retakeDate.setDate(retakeDate.getDate() + RETAKE_DAYS)
    return NextResponse.json(
      {
        allowed: false,
        retake_date: retakeDate.toISOString(),
        error: `You can retake the assessment on ${retakeDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}.`,
      },
      { status: 429 },
    )
  }

  return NextResponse.json({ allowed: true })
}
