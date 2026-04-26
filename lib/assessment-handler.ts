import { supabase } from './supabase'
import { claudeMessageWithRetry, parseJsonResponse } from './claude'
import { sendEmail, sendIntakeEmail } from './resend'
import { appendIntakeRow, appendAssessmentRow } from './google-sheets'
import { sanitizeReportHtml } from './sanitize'
import { promptGradeAndReport } from './prompts/grade-and-report'
import { CURRICULUM_PHASES } from './question-handler'
import type { AgeGroup, Question, Answer, SubmitResult, QaReviewItem } from '@/types'

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

const ALL_SUB_CATEGORIES = [
  'one_pitch_focus', 'pressure_handling', 'resilience', 'self_talk', 'confidence',
  'situational_awareness', 'pitch_recognition', 'defensive_positioning', 'base_running', 'game_strategy',
]

function computePhaseScores(subScores: Record<string, number>): Record<string, number> {
  const phaseScores: Record<string, number> = {}
  for (const phase of CURRICULUM_PHASES) {
    const scores = phase.subCategories
      .filter((s) => s in subScores)
      .map((s) => subScores[s])
    if (scores.length > 0) {
      phaseScores[phase.label] = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
    }
  }
  return phaseScores
}

const ARCHETYPE_DESCRIPTIONS: Record<string, string> = {
  'The Field General':
    'You have both the mental strength and baseball knowledge to lead on the field. You command situations with confidence and intelligence.',
  'The Mental Warrior':
    'Your mental game is elite. Channel that inner strength into sharpening your baseball IQ and you will be unstoppable.',
  'The Cerebral Player':
    'You read the game like a coach. Build the mental resilience to match your baseball IQ and watch your performance explode.',
  'The Rising Competitor':
    'Every great player starts here. You have the drive — the SMILE Zone will give you the tools to develop both your mental game and baseball intelligence.',
  'The Grinder':
    'Consistently solid in everything you do. You show up, work hard, and keep growing. The next breakthrough is just around the corner.',
}

export interface SubmitInput {
  first_name: string
  email: string
  age_group: AgeGroup
  session_id: string
  question_ids: string[]
  answers: Record<string, Answer>
}

export async function submitAssessment(data: SubmitInput): Promise<SubmitResult> {
  const firstName = data.first_name
  const email = data.email
  const ageGroup = data.age_group
  const sessionId = data.session_id || crypto.randomUUID()

  // 0. Capture intake lead immediately — non-blocking, never fail the main flow
  void Promise.allSettled([
    appendIntakeRow(firstName, email, ageGroup).catch((err) =>
      console.error('SMILEZONE [assessment] Google Sheets intake row failed:', err),
    ),
    sendIntakeEmail(firstName, email).catch((err) =>
      console.error('SMILEZONE [assessment] Intake email failed:', err),
    ),
  ])

  // 1. Sanitize question IDs and answers
  const questionIds = sanitizeQuestionIds(data.question_ids)
  const answers = sanitizeAnswers(data.answers)

  if (questionIds.length === 0) {
    throw new Error('No valid question IDs provided.')
  }

  // 2. Re-fetch questions from DB by ID — never trust client question data
  const questions = await fetchQuestionsByIds(questionIds)

  if (Object.keys(answers).length < 12) {
    throw new Error('All 12 questions must be answered.')
  }

  // 3. Grade objective questions using DB-sourced correct_answers
  const scores = gradeObjective(questions, answers)

  // 3a. Identify sub-categories not covered by this assessment
  const untestedAreas = ALL_SUB_CATEGORIES.filter((s) => !(s in scores.sub_scores))

  // 4. Assign archetype deterministically — not delegated to Claude
  const archetype = assignArchetype(scores.mm_score, scores.biq_score)

  // 5. Build Q&A pairs for Claude context
  const qaPairs = buildQaPairs(questions, answers)

  // 5a. Build Q&A review for email
  const qaReview = buildQaReview(questions, answers)

  // 6. Call Claude for written-answer grading + HTML report generation
  let claudeResult: ClaudeReportResult
  try {
    claudeResult = await generateReport(firstName, ageGroup, scores, archetype, qaPairs, untestedAreas)
  } catch (err) {
    console.error('SMILEZONE [assessment] Claude report failed — using fallback:', err)
    claudeResult = fallbackReport(firstName, scores, archetype)
  }

  const reportHtml = claudeResult.report_html
  const subScores = claudeResult.sub_scores ?? scores.sub_scores
  const phaseScores = computePhaseScores(subScores)

  // 7. Clamp Claude score adjustments to ±10 (prompt injection guard)
  const mmBase = scores.mm_score
  const biqBase = scores.biq_score
  const mmFinal =
    claudeResult.mm_score_final !== undefined
      ? Math.max(mmBase - 10, Math.min(mmBase + 10, Math.round(claudeResult.mm_score_final)))
      : mmBase
  const biqFinal =
    claudeResult.biq_score_final !== undefined
      ? Math.max(biqBase - 10, Math.min(biqBase + 10, Math.round(claudeResult.biq_score_final)))
      : biqBase

  // 8. Sanitize HTML before storing or returning
  const reportHtmlSafe = sanitizeReportHtml(reportHtml)

  // 9. Store to Supabase
  let assessmentId: string | null = null
  const { data: insertData, error: insertError } = await supabase
    .from('assessments')
    .insert({
      player_first_name:    firstName,
      player_email:         email,
      age_group:            ageGroup,
      session_id:           sessionId,
      questions_json:       questions,
      answers_json:         answers,
      mental_mindset_score: mmFinal,
      baseball_iq_score:    biqFinal,
      sub_scores:           subScores,
      archetype:            archetype,
      report_html:          reportHtmlSafe,
      email_sent:           false,
    })
    .select('id')
    .single()

  if (insertError) {
    console.error('SMILEZONE [assessment] Supabase INSERT failed:', insertError.message)
  } else {
    assessmentId = insertData?.id ?? null
  }

  // 10. Send results email via Resend + log assessment row to Google Sheets
  let emailNote = ''
  try {
    await sendEmail(firstName, email, reportHtmlSafe, archetype, mmFinal, biqFinal, subScores, phaseScores, ageGroup, qaReview)
    // PATCH email_sent = true
    if (assessmentId) {
      const { error: patchError } = await supabase
        .from('assessments')
        .update({ email_sent: true })
        .eq('id', assessmentId)
      if (patchError) {
        console.error('SMILEZONE [assessment] PATCH email_sent failed:', patchError.message)
      }
    }
  } catch (err) {
    console.error('SMILEZONE [assessment] Email send failed:', err)
    emailNote = 'Your report is shown below. Email delivery may be delayed.'
  }

  // 11. Log assessment complete row to Google Sheets — non-blocking
  appendAssessmentRow(firstName, email, ageGroup, mmFinal, biqFinal, archetype).catch((err) =>
    console.error('SMILEZONE [assessment] Google Sheets assessment row failed:', err),
  )

  return {
    success:      true,
    report_html:  reportHtmlSafe,
    archetype,
    mm_score:     mmFinal,
    biq_score:    biqFinal,
    sub_scores:   subScores,
    phase_scores: phaseScores,
    age_group:    ageGroup,
    email_note:   emailNote || undefined,
  }
}

// ── Grading ─────────────────────────────────────────────────────────────────

function gradeObjective(
  questions: Question[],
  answers: Record<string, Answer>,
): { mm_score: number; biq_score: number; sub_scores: Record<string, number> } {
  let mmPoints = 0, mmTotal = 0
  let biqPoints = 0, biqTotal = 0
  const subRaw: Record<string, { earned: number; possible: number }> = {}

  for (const q of questions) {
    const qId = q.id
    const qType = q.question_type
    const category = (q as Question & { category?: string }).category ?? 'mental_mindset'
    const subCat = q.sub_category ?? category
    const correct = q.correct_answer
    const answer = answers[qId]

    if (qType === 'written') continue

    let isCorrect = false
    if (qType === 'multiple_choice' || qType === 'fill_blank') {
      isCorrect =
        correct !== null &&
        String(answer ?? '').trim().toLowerCase() === String(correct).trim().toLowerCase()
    } else if (qType === 'multi_select') {
      const parsedCorrect = parseIfString(correct as string | string[] | null)
      const parsedAnswer  = parseIfString((answer ?? null) as string | string[] | null)
      if (Array.isArray(parsedCorrect) && Array.isArray(parsedAnswer)) {
        const ansSorted = [...parsedAnswer].map((v) => String(v).toUpperCase()).sort()
        const correctSorted = [...parsedCorrect].map((v) => String(v).toUpperCase()).sort()
        isCorrect = JSON.stringify(ansSorted) === JSON.stringify(correctSorted)
      }
    }

    const points = isCorrect ? 10 : 0

    if (category === 'mental_mindset') {
      mmPoints += points
      mmTotal += 10
    } else {
      biqPoints += points
      biqTotal += 10
    }

    if (!subRaw[subCat]) subRaw[subCat] = { earned: 0, possible: 0 }
    subRaw[subCat].earned += points
    subRaw[subCat].possible += 10
  }

  const mmScore = mmTotal > 0 ? Math.round((mmPoints / mmTotal) * 100) : 50
  const biqScore = biqTotal > 0 ? Math.round((biqPoints / biqTotal) * 100) : 50

  const subScores: Record<string, number> = {}
  for (const [sub, data] of Object.entries(subRaw)) {
    subScores[sub] = data.possible > 0 ? Math.round((data.earned / data.possible) * 100) : 50
  }

  return { mm_score: mmScore, biq_score: biqScore, sub_scores: subScores }
}

function assignArchetype(mm: number, biq: number): string {
  if (mm >= 65 && mm <= 74 && biq >= 65 && biq <= 74) return 'The Grinder'
  if (mm >= 70 && biq >= 70) return 'The Field General'
  if (mm >= 70 && biq < 70) return 'The Mental Warrior'
  if (mm < 70 && biq >= 70) return 'The Cerebral Player'
  return 'The Rising Competitor'
}

// ── Claude report generation ─────────────────────────────────────────────────

interface ClaudeReportResult {
  report_html: string
  sub_scores?: Record<string, number>
  phase_scores?: Record<string, number>
  mm_score_final?: number
  biq_score_final?: number
}

async function generateReport(
  firstName: string,
  ageGroup: AgeGroup,
  scores: { mm_score: number; biq_score: number; sub_scores: Record<string, number> },
  archetype: string,
  qaPairs: { question: Question; answer: Answer }[],
  untestedAreas: string[],
): Promise<ClaudeReportResult> {
  const MAX_RETRIES = 2
  let lastError: Error | null = null

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const prompts = promptGradeAndReport(
        { first_name: firstName, age_group: ageGroup },
        scores,
        archetype,
        qaPairs,
        untestedAreas,
      )

      // Increase token limit on retry to give Claude more room
      const maxTokens = attempt === 1 ? 4096 : 5120
      const raw = await claudeMessageWithRetry(prompts.system, prompts.user, maxTokens)
      const decoded = parseJsonResponse(raw) as unknown as Record<string, unknown>

      if (!decoded.report_html || typeof decoded.report_html !== 'string') {
        throw new Error('Report HTML missing in Claude response.')
      }

      const reportHtml = decoded.report_html as string

      // Validate that all required sections are present
      const requiredMarkers = [
        { section: 'Greeting', marker: 'Hey' },
        { section: 'Your Archetype', marker: 'Archetype' },
        { section: 'Your Strengths', marker: 'Strengths' },
        { section: 'Your Next Level', marker: 'Next Level' },
      ]

      const missingRequired: string[] = []
      for (const { section, marker } of requiredMarkers) {
        if (!reportHtml.includes(marker)) {
          missingRequired.push(section)
        }
      }

      // Check conditional sections (warn but don't fail)
      const isAdult = ageGroup === '18plus'
      const hasUntestedAreas = untestedAreas.length > 0

      if (isAdult && !reportHtml.includes('Coaching')) {
        console.warn('SMILEZONE [assessment] Report missing Coaching Notes (required for 18+)')
      }

      if (hasUntestedAreas && !reportHtml.includes("What's Ahead")) {
        console.warn('SMILEZONE [assessment] Report missing What\'s Ahead (expected for untested areas)')
      }

      // Report is too short to be complete
      if (reportHtml.length < 1500) {
        console.warn('SMILEZONE [assessment] Report appears incomplete (under 1500 chars)')
      }

      if (missingRequired.length > 0) {
        throw new Error(`Report missing required sections: ${missingRequired.join(', ')}`)
      }

      // Validation passed — return result
      return decoded as unknown as ClaudeReportResult
    } catch (err) {
      lastError = err as Error
      console.warn(
        `SMILEZONE [assessment] Report generation attempt ${attempt} failed: ${lastError.message}${
          attempt < MAX_RETRIES ? ' — retrying...' : ''
        }`,
      )

      if (attempt < MAX_RETRIES) {
        // Brief delay before retry to avoid throttling
        await new Promise((resolve) => setTimeout(resolve, 500))
      }
    }
  }

  // All retries exhausted
  throw lastError || new Error('Failed to generate complete report after all retries.')
}

function fallbackReport(
  firstName: string,
  scores: { mm_score: number; biq_score: number; sub_scores: Record<string, number> },
  archetype: string,
): ClaudeReportResult {
  console.warn('SMILEZONE [assessment] Generating fallback report.')
  const mm = scores.mm_score
  const biq = scores.biq_score
  const archDesc = ARCHETYPE_DESCRIPTIONS[archetype] ?? 'A dedicated baseball player on the rise.'

  const html = `<h2>Hey ${firstName}!</h2>
<p>Thank you for completing the SMILE Zone Baseball Assessment.</p>
<h3>Your Archetype: ${archetype}</h3>
<p>${archDesc}</p>
<h3>Your Scores</h3>
<ul>
  <li><strong>Mental Mindset:</strong> ${mm}/100</li>
  <li><strong>Baseball IQ:</strong> ${biq}/100</li>
</ul>
<p>Based on your scores, the SMILE Zone curriculum has a personalised pathway ready for you. Our AI-powered detailed analysis will be available in your follow-up email.</p>`

  return {
    report_html:     html,
    sub_scores:      scores.sub_scores,
    mm_score_final:  mm,
    biq_score_final: biq,
    phase_scores:    computePhaseScores(scores.sub_scores),
  }
}

// ── Helpers ──────────────────────────────────────────────────────────────────

export function parseIfString(value: string | string[] | null): string | string[] | null {
  if (typeof value === 'string' && value.startsWith('[')) {
    try {
      const parsed = JSON.parse(value)
      return Array.isArray(parsed) ? parsed : value
    } catch {
      return value
    }
  }
  return value
}

async function fetchQuestionsByIds(ids: string[]): Promise<Question[]> {
  const { data, error } = await supabase
    .from('questions')
    .select('id,question_text,question_type,options,correct_answer,difficulty,sub_category,category')
    .in('id', ids)

  if (error) throw new Error(error.message)
  if (!data || data.length === 0) throw new Error('Questions not found for provided IDs.')

  const idMap = new Map((data as Question[]).map((q) => [q.id, q]))
  return ids
    .map((id) => idMap.get(id))
    .filter((q): q is Question => q !== undefined)
}

function sanitizeQuestionIds(raw: unknown): string[] {
  if (!Array.isArray(raw)) return []
  return raw
    .map((id) => String(id).trim())
    .filter((id) => UUID_REGEX.test(id))
}

function sanitizeAnswers(raw: unknown): Record<string, Answer> {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {}
  const result: Record<string, Answer> = {}
  for (const [key, value] of Object.entries(raw as Record<string, unknown>)) {
    const k = key.replace(/[^a-zA-Z0-9_-]/g, '')
    if (Array.isArray(value)) {
      result[k] = value.map((v) => String(v).slice(0, 200))
    } else {
      result[k] = String(value ?? '').slice(0, 2000)
    }
  }
  return result
}

function buildQaPairs(
  questions: Question[],
  answers: Record<string, Answer>,
): { question: Question; answer: Answer }[] {
  return questions.map((q) => ({
    question: q,
    answer:   answers[q.id] ?? '',
  }))
}

function buildQaReview(
  questions: Question[],
  answers: Record<string, Answer>,
): QaReviewItem[] {
  return questions.map((q) => {
    const answer = answers[q.id] ?? ''
    if (q.question_type === 'written') {
      return {
        question_text: q.question_text,
        question_type: q.question_type,
        options: q.options,
        user_answer: answer,
        correct_answer: null,
        is_correct: null,
      }
    }

    let isCorrect = false
    const correct = q.correct_answer
    if (q.question_type === 'multiple_choice' || q.question_type === 'fill_blank') {
      isCorrect =
        correct !== null &&
        String(answer).trim().toLowerCase() === String(correct).trim().toLowerCase()
    } else if (q.question_type === 'multi_select') {
      const parsedCorrect = parseIfString(correct as string | string[] | null)
      const parsedAnswer  = parseIfString((answer ?? null) as string | string[] | null)
      if (Array.isArray(parsedCorrect) && Array.isArray(parsedAnswer)) {
        const ansSorted = [...parsedAnswer].map((v) => String(v).toUpperCase()).sort()
        const correctSorted = [...parsedCorrect].map((v) => String(v).toUpperCase()).sort()
        isCorrect = JSON.stringify(ansSorted) === JSON.stringify(correctSorted)
      }
    }

    return {
      question_text: q.question_text,
      question_type: q.question_type,
      options: q.options,
      user_answer: answer,
      correct_answer: correct,
      is_correct: isCorrect,
    }
  })
}
