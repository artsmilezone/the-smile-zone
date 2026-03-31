import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit } from '@/lib/rate-limiter'
import { submitAssessment } from '@/lib/assessment-handler'
import { supabase } from '@/lib/supabase'
import { BYPASS_EMAILS } from '@/lib/bypass-emails'
import type { AgeGroup } from '@/types'

const RETAKE_DAYS = 30

export const maxDuration = 60

const VALID_AGE_GROUPS: AgeGroup[] = ['13u', '14-17', '18plus']
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: NextRequest) {
  const allowed = await checkRateLimit(request, 'submit')
  if (!allowed) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. You may submit up to 50 assessments per 24 hours.' },
      { status: 429 },
    )
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 })
  }

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const data = body as Record<string, unknown>

  // Validate required fields
  const firstName = typeof data.first_name === 'string' ? data.first_name.trim().slice(0, 100) : ''
  const email     = typeof data.email      === 'string' ? data.email.trim()      : ''
  const ageGroup  = data.age_group as AgeGroup | undefined

  if (!firstName) {
    return NextResponse.json({ error: 'first_name is required.' }, { status: 400 })
  }
  if (!email || !EMAIL_REGEX.test(email)) {
    return NextResponse.json({ error: 'A valid email address is required.' }, { status: 400 })
  }
  if (!ageGroup || !VALID_AGE_GROUPS.includes(ageGroup)) {
    return NextResponse.json(
      { error: 'Invalid age_group. Must be one of: 13u, 14-17, 18plus' },
      { status: 400 },
    )
  }

  const questionIds = Array.isArray(data.question_ids) ? data.question_ids : []
  if (questionIds.length === 0) {
    return NextResponse.json({ error: 'question_ids is required.' }, { status: 400 })
  }

  // UUID validation on all incoming question_ids
  const invalidId = questionIds.find((id) => !UUID_REGEX.test(String(id)))
  if (invalidId) {
    return NextResponse.json(
      { error: `Invalid question_id format: ${String(invalidId).slice(0, 40)}` },
      { status: 400 },
    )
  }

  const answers = (data.answers && typeof data.answers === 'object' && !Array.isArray(data.answers))
    ? data.answers as Record<string, unknown>
    : {}

  const sessionId = typeof data.session_id === 'string' ? data.session_id : crypto.randomUUID()

  // Server-side retake enforcement — bypass list skips the DB check
  if (!BYPASS_EMAILS.has(email.toLowerCase())) {
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
      console.error('SMILEZONE [submit] retake check error:', retakeError.message)
    } else if (lastAssessment) {
      const retakeDate = new Date(lastAssessment.created_at)
      retakeDate.setDate(retakeDate.getDate() + RETAKE_DAYS)
      return NextResponse.json(
        { error: `You can retake the assessment on ${retakeDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}.` },
        { status: 429 },
      )
    }
  }

  try {
    const result = await submitAssessment({
      first_name:   firstName,
      email,
      age_group:    ageGroup,
      session_id:   sessionId,
      question_ids: questionIds.map(String),
      answers:      answers as Record<string, string | string[]>,
    })
    return NextResponse.json(result)
  } catch (err) {
    console.error('SMILEZONE [submit route] Error:', err)
    const message = err instanceof Error ? err.message : 'Submission failed. Please try again.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
