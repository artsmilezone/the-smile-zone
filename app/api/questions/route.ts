import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit } from '@/lib/rate-limiter'
import { getQuestions } from '@/lib/question-handler'
import type { AgeGroup } from '@/types'

export const maxDuration = 60

const VALID_AGE_GROUPS: AgeGroup[] = ['13u', '14-17', '18plus']

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const ageGroup = searchParams.get('age_group') as AgeGroup | null

  if (!ageGroup || !VALID_AGE_GROUPS.includes(ageGroup)) {
    return NextResponse.json(
      { error: 'Invalid or missing age_group. Must be one of: 13u, 14-17, 18plus' },
      { status: 400 },
    )
  }

  const allowed = await checkRateLimit(request, 'get_questions')
  if (!allowed) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. Please try again later.' },
      { status: 429 },
    )
  }

  try {
    const questions = await getQuestions(ageGroup)
    return NextResponse.json({ questions })
  } catch (err) {
    console.error('SMILEZONE [questions route] Error:', err)
    return NextResponse.json(
      { error: 'Failed to load questions. Please try again.' },
      { status: 500 },
    )
  }
}
