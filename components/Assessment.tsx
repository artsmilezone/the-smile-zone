'use client'

import { useReducer, useEffect, useCallback, useState } from 'react'
import type { AssessmentState, Phase, AgeGroup, Question, Answer, SubmitResult } from '@/types'
import { BYPASS_EMAILS } from '@/lib/bypass-emails'
import AgeSelect from './AgeSelect'
import QuestionCard from './QuestionCard'
import LoadingScreen from './LoadingScreen'
import ReportView from './ReportView'
import RetakeBlocked from './RetakeBlocked'
import ErrorScreen from './ErrorScreen'

const RETAKE_DAYS = 30
const LS_RETAKE_KEY  = 'smz_retake_until'
const LS_PROGRESS_KEY = 'smz_progress'
const LS_EMAIL_KEY   = 'smz_last_email'

function generateSessionId(): string {
  return 'smz_' + crypto.randomUUID()
}

type Action =
  | { type: 'SET_PHASE'; phase: Phase }
  | { type: 'SET_AGE_GROUP'; ageGroup: AgeGroup }
  | { type: 'SET_USER_INFO'; firstName: string; email: string }
  | { type: 'SET_QUESTIONS'; questions: Question[] }
  | { type: 'SET_ANSWER'; questionId: string; answer: Answer }
  | { type: 'SET_CURRENT_Q'; index: number }
  | { type: 'SET_LOCKED'; locked: boolean }
  | { type: 'RESTORE'; saved: Partial<AssessmentState> }

function reducer(state: AssessmentState, action: Action): AssessmentState {
  switch (action.type) {
    case 'SET_PHASE':
      return { ...state, phase: action.phase }
    case 'SET_AGE_GROUP':
      return { ...state, ageGroup: action.ageGroup, phase: 'AGE_SELECTED' }
    case 'SET_USER_INFO':
      return { ...state, firstName: action.firstName, email: action.email }
    case 'SET_QUESTIONS':
      return { ...state, questions: action.questions, currentQ: 0, phase: 'ANSWERING' }
    case 'SET_ANSWER':
      return { ...state, answers: { ...state.answers, [action.questionId]: action.answer } }
    case 'SET_CURRENT_Q':
      return { ...state, currentQ: action.index }
    case 'SET_LOCKED':
      return { ...state, locked: action.locked }
    case 'RESTORE':
      return { ...state, ...action.saved }
    default:
      return state
  }
}

const initialState: AssessmentState = {
  phase:     'IDLE',
  ageGroup:  null,
  firstName: '',
  email:     '',
  questions: [],
  answers:   {},
  currentQ:  0,
  sessionId: generateSessionId(),
  locked:    false,
}

export default function Assessment() {
  const [state, dispatch] = useReducer(reducer, initialState)
  const [reportData, setReportData] = useState<SubmitResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loadingMsg, setLoadingMsg] = useState('Checking eligibility…')
  const [retakeDateFromServer, setRetakeDateFromServer] = useState<string | null>(null)

  // Restore in-progress session on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_PROGRESS_KEY)
      if (!raw) return
      const saved = JSON.parse(raw)
      if (!saved?.questions?.length) return

      // Before offering to restore, check if the saved email is retake-locked.
      // Bypass emails are always allowed. Non-bypass emails are blocked if their
      // retake lock is still active — no point restoring only to hit a 429 at submit.
      const savedEmail = (saved.email || '').toLowerCase()
      if (savedEmail && !BYPASS_EMAILS.has(savedEmail)) {
        const lockRaw = localStorage.getItem(LS_RETAKE_KEY)
        if (lockRaw) {
          const until = new Date(lockRaw)
          if (!isNaN(until.getTime()) && new Date() < until) {
            localStorage.removeItem(LS_PROGRESS_KEY)
            setRetakeDateFromServer(
              until.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
            )
            dispatch({ type: 'SET_PHASE', phase: 'RETAKE' })
            return
          }
        }
      }

      if (confirm('You have an assessment in progress. Continue where you left off?')) {
        dispatch({
          type: 'RESTORE',
          saved: {
            ageGroup:  saved.ageGroup,
            firstName: saved.firstName || '',
            email:     saved.email     || '',
            questions: saved.questions,
            answers:   saved.answers || {},
            currentQ:  saved.currentQ || 0,
            sessionId: saved.sessionId || generateSessionId(),
            phase:     'ANSWERING',
          },
        })
      } else {
        localStorage.removeItem(LS_PROGRESS_KEY)
      }
    } catch {}
  }, [])

  // Persist progress when answering
  useEffect(() => {
    if (state.phase !== 'ANSWERING') return
    try {
      localStorage.setItem(
        LS_PROGRESS_KEY,
        JSON.stringify({
          ageGroup:  state.ageGroup,
          firstName: state.firstName,
          email:     state.email,
          questions: state.questions,
          answers:   state.answers,
          currentQ:  state.currentQ,
          sessionId: state.sessionId,
        }),
      )
    } catch {}
  }, [state.phase, state.answers, state.currentQ, state.ageGroup, state.questions, state.sessionId, state.firstName, state.email])

  // Warn before leaving mid-assessment
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (state.phase === 'ANSWERING') {
        e.preventDefault()
      }
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [state.phase])

  const loadQuestions = useCallback(async () => {
    if (!state.ageGroup) return
    dispatch({ type: 'SET_PHASE', phase: 'QS_LOADING' })
    setLoadingMsg('Loading your questions…')
    setError(null)

    try {
      const res = await fetch(`/api/questions?age_group=${state.ageGroup}`)
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Failed to load questions.')
      dispatch({ type: 'SET_QUESTIONS', questions: json.questions })
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unable to load assessment. Please try again.'
      setError(msg)
      dispatch({ type: 'SET_PHASE', phase: 'AGE_SELECTED' })
    }
  }, [state.ageGroup])

  // Called when user clicks "Begin Assessment" on the AgeSelect screen
  const handleStart = useCallback(
    async (firstName: string, email: string) => {
      if (!state.ageGroup) return
      dispatch({ type: 'SET_USER_INFO', firstName, email })
      dispatch({ type: 'SET_PHASE', phase: 'QS_LOADING' })
      setLoadingMsg('Checking eligibility…')
      setError(null)

      // Server-side retake check (bypass list skips this)
      if (!BYPASS_EMAILS.has(email.toLowerCase())) {
        try {
          const res = await fetch('/api/check-retake', {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ email }),
          })
          if (res.status === 429) {
            const json = await res.json()
            // Store server-provided date so RetakeBlocked can display it
            if (json.retake_date) {
              setRetakeDateFromServer(
                new Date(json.retake_date).toLocaleDateString('en-US', {
                  month: 'long', day: 'numeric', year: 'numeric',
                }),
              )
              try { localStorage.setItem(LS_RETAKE_KEY, json.retake_date) } catch {}
            }
            try { localStorage.setItem(LS_EMAIL_KEY, email.toLowerCase()) } catch {}
            dispatch({ type: 'SET_PHASE', phase: 'RETAKE' })
            return
          }
          // Non-429 non-OK: allow through (submit will double-check)
        } catch {
          // Network error during check — allow through, submit will enforce
        }
      }

      // Eligibility passed — load questions
      setLoadingMsg('Loading your questions…')
      try {
        const res = await fetch(`/api/questions?age_group=${state.ageGroup}`)
        const json = await res.json()
        if (!res.ok) throw new Error(json.error || 'Failed to load questions.')
        dispatch({ type: 'SET_QUESTIONS', questions: json.questions })
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Unable to load assessment. Please try again.'
        setError(msg)
        dispatch({ type: 'SET_PHASE', phase: 'AGE_SELECTED' })
      }
    },
    [state.ageGroup],
  )

  // Called after the last question — submits the completed assessment
  const handleSubmit = useCallback(async () => {
    if (state.locked) return
    dispatch({ type: 'SET_LOCKED', locked: true })
    dispatch({ type: 'SET_PHASE', phase: 'SUBMITTING' })
    setLoadingMsg('Generating your personalized report… this takes about 15–20 seconds.')
    setError(null)

    const questionIds = state.questions.map((q) => q.id)

    try {
      const res = await fetch('/api/submit', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          first_name:   state.firstName,
          email:        state.email,
          age_group:    state.ageGroup,
          session_id:   state.sessionId,
          question_ids: questionIds,
          answers:      state.answers,
        }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Submission failed.')

      try { localStorage.removeItem(LS_PROGRESS_KEY) } catch {}
      try { localStorage.setItem(LS_EMAIL_KEY, state.email.toLowerCase()) } catch {}
      if (!BYPASS_EMAILS.has(state.email.toLowerCase())) {
        const until = new Date()
        until.setDate(until.getDate() + RETAKE_DAYS)
        try { localStorage.setItem(LS_RETAKE_KEY, until.toISOString()) } catch {}
      }

      setReportData(json)
      dispatch({ type: 'SET_PHASE', phase: 'REPORT_SHOWN' })
    } catch (err) {
      dispatch({ type: 'SET_LOCKED', locked: false })
      dispatch({ type: 'SET_PHASE', phase: 'ANSWERING' })
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    }
  }, [state.locked, state.questions, state.ageGroup, state.sessionId, state.answers, state.firstName, state.email])

  // ── Render ────────────────────────────────────────────────────────────────

  if (state.phase === 'RETAKE') {
    return <RetakeBlocked retakeDate={retakeDateFromServer} />
  }

  if (state.phase === 'REPORT_SHOWN' && reportData) {
    return <ReportView data={reportData} />
  }

  if (state.phase === 'SUBMITTING' || state.phase === 'QS_LOADING') {
    return <LoadingScreen message={loadingMsg} />
  }

  if (state.phase === 'ANSWERING') {
    const currentQuestion = state.questions[state.currentQ]
    if (!currentQuestion) {
      return <ErrorScreen message="Question not found." onRetry={loadQuestions} />
    }
    const isLastQuestion = state.currentQ === state.questions.length - 1
    return (
      <>
        <QuestionCard
          key={state.currentQ}
          question={currentQuestion}
          index={state.currentQ}
          total={state.questions.length}
          answer={state.answers[currentQuestion.id]}
          onAnswer={(answer) =>
            dispatch({ type: 'SET_ANSWER', questionId: currentQuestion.id, answer })
          }
          onNext={() => {
            if (!isLastQuestion) {
              dispatch({ type: 'SET_CURRENT_Q', index: state.currentQ + 1 })
            } else {
              handleSubmit()
            }
          }}
          onPrev={() => {
            if (state.currentQ > 0) {
              dispatch({ type: 'SET_CURRENT_Q', index: state.currentQ - 1 })
            }
          }}
        />
        {error && isLastQuestion && (
          <p className="mt-4 text-center text-red-600 text-sm">{error}</p>
        )}
      </>
    )
  }

  // IDLE or AGE_SELECTED
  return (
    <AgeSelect
      selected={state.ageGroup}
      onSelect={(ag) => dispatch({ type: 'SET_AGE_GROUP', ageGroup: ag })}
      onStart={handleStart}
      error={error}
    />
  )
}
