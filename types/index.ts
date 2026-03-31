export type AgeGroup = '13u' | '14-17' | '18plus'

export type QuestionType = 'multiple_choice' | 'multi_select' | 'fill_blank' | 'written'

export interface QuestionOption {
  label: string
  text: string
}

export interface Question {
  id: string
  question_text: string
  question_type: QuestionType
  options: QuestionOption[] | null
  correct_answer: string | string[] | null
  difficulty: 'easy' | 'medium' | 'hard'
  sub_category: string
  category?: string
}

export type Phase =
  | 'IDLE'
  | 'AGE_SELECTED'
  | 'QS_LOADING'
  | 'QS_READY'
  | 'ANSWERING'
  | 'CONTACT_FORM'
  | 'SUBMITTING'
  | 'REPORT_SHOWN'
  | 'RETAKE'

export type Answer = string | string[]

export interface AssessmentState {
  phase: Phase
  ageGroup: AgeGroup | null
  firstName: string
  email: string
  questions: Question[]
  answers: Record<string, Answer>
  currentQ: number
  sessionId: string
  locked: boolean
}

export interface SubmitResult {
  success: boolean
  report_html: string
  archetype: string
  mm_score: number
  biq_score: number
  sub_scores: Record<string, number>
  phase_scores: Record<string, number>
  age_group: AgeGroup
  email_note?: string
}

export interface SubmitPayload {
  first_name: string
  email: string
  age_group: AgeGroup
  session_id: string
  question_ids: string[]
  answers: Record<string, Answer>
}
