import { createHash } from 'crypto'
import { supabase } from './supabase'
import { claudeMessageWithRetry, parseJsonResponse } from './claude'
import { promptGenerateQuestions } from './prompts/generate-questions'
import type { AgeGroup, Question } from '@/types'

const BANK_THRESHOLD = 10
const QUESTIONS_PER_PHASE = 3

export const CURRICULUM_PHASES = [
  {
    key: 'foundation',
    label: 'Phase 1: Foundation (Weeks 1–12)',
    subCategories: [
      'know_your_why',
      'positive_self_talk',
      'growth_mindset',
      'one_pitch_focus',
      'routine_confidence',
      'gratitude_reset',
      'visualize_success',
      'mistake_recovery',
      'body_awareness',
      'beyond_the_stats',
      'team_leadership',
      'finish_strong',
    ] as string[],
    category: 'mental_mindset',
  },
  {
    key: 'mental_resilience',
    label: 'Phase 2: Mental Resilience (Weeks 13–24)',
    subCategories: [
      'pressure_is_privilege',
      'no_comparison_zone',
      'accountability',
      'preparation_matters',
      'integrity',
      'self_talk_reset',
      'celebrate_effort',
      'compete_vs_perform',
      'focused_bullpens',
      'progress_check_in',
      'mental_toughness',
      'reflection_rebuild',
    ] as string[],
    category: 'mental_mindset',
  },
  {
    key: 'leadership_identity',
    label: 'Phase 3: Leadership Identity (Weeks 25–36)',
    subCategories: [
      'ownership_leadership',
      'leading_by_example',
      'finding_your_voice',
      'teach_to_master',
      'consistency_trust',
      'leading_through_struggles',
      'team_before_me',
      'culture_builders',
      'owning_your_energy',
      'mentor_mode',
      'leadership_review',
      'pass_the_torch',
    ] as string[],
    category: 'baseball_iq',
  },
  {
    key: 'legacy_growth',
    label: 'Phase 4: Legacy & Long-Term Growth (Weeks 37–48)',
    subCategories: [
      'who_are_you_becoming',
      'building_positive_influence',
      'intentional_effort',
      'own_your_impact',
      'handling_pressure',
      'giving_back',
      'building_resilience',
      'keeping_perspective',
      'team_culture',
      'power_of_consistency',
      'vision_for_future',
      'final_reflection',
    ] as string[],
    category: 'baseball_iq',
  },
] as const

export async function getQuestions(ageGroup: AgeGroup): Promise<Question[]> {
  const results: Question[][] = []

  for (const phase of CURRICULUM_PHASES) {
    const qs = await getPhaseQuestions(ageGroup, phase)
    results.push(qs)
  }

  const combined = results.flat()
  // Shuffle so phases are interleaved
  for (let i = combined.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[combined[i], combined[j]] = [combined[j], combined[i]]
  }
  return combined
}

async function getPhaseQuestions(
  ageGroup: AgeGroup,
  phase: (typeof CURRICULUM_PHASES)[number],
): Promise<Question[]> {
  const { count, error: countErr } = await supabase
    .from('questions')
    .select('*', { count: 'exact', head: true })
    .eq('age_group', ageGroup)
    .in('sub_category', phase.subCategories)

  if (countErr) {
    console.error('SMILEZONE [question_handler] count failed:', countErr.message)
    throw new Error(countErr.message)
  }

  const currentCount = count ?? 0

  if (currentCount < BANK_THRESHOLD) {
    const generateCount = Math.max(BANK_THRESHOLD - currentCount, QUESTIONS_PER_PHASE)
    if (currentCount >= QUESTIONS_PER_PHASE) {
      // Bank has enough to serve now — replenish in background without blocking
      generateAndStore(ageGroup, phase.category, generateCount, [...phase.subCategories]).catch((err) =>
        console.warn('SMILEZONE [question_handler] Background generation failed:', err),
      )
    } else {
      // Truly empty bank — must wait before we can serve
      try {
        await generateAndStore(ageGroup, phase.category, generateCount, [...phase.subCategories])
      } catch (err) {
        console.error('SMILEZONE [question_handler] Blocking generation failed:', err)
        throw err
      }
    }
  }

  return fetchRandomBySubCategories(ageGroup, phase.subCategories, QUESTIONS_PER_PHASE)
}

async function fetchRandomBySubCategories(
  ageGroup: string,
  subCategories: readonly string[],
  needed: number,
): Promise<Question[]> {
  const { data, error } = await supabase
    .from('questions')
    .select('id,question_text,question_type,options,correct_answer,difficulty,sub_category,category')
    .eq('age_group', ageGroup)
    .in('sub_category', subCategories)

  if (error) throw new Error(error.message)
  if (!data || data.length === 0) throw new Error('No questions found in bank.')

  // Shuffle and slice
  const shuffled = [...data]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled.slice(0, needed) as Question[]
}

async function generateAndStore(
  ageGroup: AgeGroup,
  category: string,
  count: number,
  targetSubCategories: string[],
): Promise<number> {
  // Fetch existing hashes for dedup (scoped to target sub-categories)
  const { data: existing } = await supabase
    .from('questions')
    .select('content_hash')
    .eq('age_group', ageGroup)
    .in('sub_category', targetSubCategories)

  const hashes: string[] = (existing ?? [])
    .map((r: { content_hash: string }) => r.content_hash)
    .filter(Boolean)

  const prompts = promptGenerateQuestions(ageGroup, category, count, hashes, targetSubCategories)

  let raw: string
  try {
    raw = await claudeMessageWithRetry(prompts.system, prompts.user, 4096)
  } catch (err) {
    console.error('SMILEZONE [question_handler] Claude failed:', err)
    throw err
  }

  let questions: unknown[]
  try {
    questions = parseClaudeQuestions(raw)
  } catch {
    // Retry with a stricter prompt
    console.warn('SMILEZONE [question_handler] Claude JSON parse failed — retrying.')
    raw = await claudeMessageWithRetry(
      prompts.system,
      prompts.user + '\n\nIMPORTANT: You must return ONLY a valid JSON array. No other text.',
      4096,
    )
    questions = parseClaudeQuestions(raw)
  }

  if (questions.length < count) {
    console.warn(
      `SMILEZONE [question_handler] Claude returned ${questions.length} questions, needed ${count}.`,
    )
  }

  const currentHashes = new Set(hashes)
  let stored = 0

  for (const q of questions) {
    const question = q as Record<string, unknown>
    const questionText = typeof question.question_text === 'string' ? question.question_text : null
    if (!questionText) continue

    const contentHash = createHash('sha256').update(questionText.toLowerCase().trim()).digest('hex')
    if (currentHashes.has(contentHash)) continue

    const { error: insertErr } = await supabase.from('questions').insert({
      age_group:      ageGroup,
      category:       category,
      question_type:  question.question_type ?? 'multiple_choice',
      question_text:  questionText,
      options:        question.options ?? null,
      correct_answer: question.correct_answer ?? null,
      difficulty:     question.difficulty ?? 'medium',
      sub_category:   question.sub_category ?? targetSubCategories[0],
      content_hash:   contentHash,
    })

    if (insertErr) {
      console.error('SMILEZONE [question_handler] Insert failed:', insertErr.message)
    } else {
      currentHashes.add(contentHash)
      stored++
    }
  }

  return stored
}

function parseClaudeQuestions(raw: string): unknown[] {
  const decoded = parseJsonResponse(raw)
  if (!Array.isArray(decoded)) {
    throw new Error('Claude response is not a JSON array.')
  }

  const valid = decoded.filter((q) => {
    if (typeof q !== 'object' || q === null) return false
    const question = q as Record<string, unknown>
    const hasText = typeof question.question_text === 'string' && question.question_text.trim().length > 0
    const hasType = typeof question.question_type === 'string' && question.question_type.trim().length > 0
    if (!hasText || !hasType) {
      console.warn('SMILEZONE [question_handler] Skipping malformed question:', JSON.stringify(q).slice(0, 100))
      return false
    }
    return true
  })

  if (valid.length === 0) {
    throw new Error('No valid questions in Claude batch.')
  }

  return valid
}
