'use client'

import { useState, useEffect } from 'react'
import type { Question, Answer } from '@/types'

interface Props {
  question: Question
  index: number
  total: number
  answer: Answer | undefined
  onAnswer: (answer: Answer) => void
  onNext: () => void
  onPrev: () => void
}

interface PhaseInfo { label: string; color: string; num: number }

const PHASE_LOOKUP: Record<string, PhaseInfo> = {
  // Phase 1: Foundation
  know_your_why:       { label: 'Foundation',          color: '#3B9FE0', num: 1 },
  positive_self_talk:  { label: 'Foundation',          color: '#3B9FE0', num: 1 },
  growth_mindset:      { label: 'Foundation',          color: '#3B9FE0', num: 1 },
  one_pitch_focus:     { label: 'Foundation',          color: '#3B9FE0', num: 1 },
  routine_confidence:  { label: 'Foundation',          color: '#3B9FE0', num: 1 },
  gratitude_reset:     { label: 'Foundation',          color: '#3B9FE0', num: 1 },
  visualize_success:   { label: 'Foundation',          color: '#3B9FE0', num: 1 },
  mistake_recovery:    { label: 'Foundation',          color: '#3B9FE0', num: 1 },
  body_awareness:      { label: 'Foundation',          color: '#3B9FE0', num: 1 },
  beyond_the_stats:    { label: 'Foundation',          color: '#3B9FE0', num: 1 },
  team_leadership:     { label: 'Foundation',          color: '#3B9FE0', num: 1 },
  finish_strong:       { label: 'Foundation',          color: '#3B9FE0', num: 1 },
  // Phase 2: Mental Resilience
  pressure_is_privilege:   { label: 'Mental Resilience', color: '#8B5CF6', num: 2 },
  no_comparison_zone:      { label: 'Mental Resilience', color: '#8B5CF6', num: 2 },
  accountability:          { label: 'Mental Resilience', color: '#8B5CF6', num: 2 },
  preparation_matters:     { label: 'Mental Resilience', color: '#8B5CF6', num: 2 },
  integrity:               { label: 'Mental Resilience', color: '#8B5CF6', num: 2 },
  self_talk_reset:         { label: 'Mental Resilience', color: '#8B5CF6', num: 2 },
  celebrate_effort:        { label: 'Mental Resilience', color: '#8B5CF6', num: 2 },
  compete_vs_perform:      { label: 'Mental Resilience', color: '#8B5CF6', num: 2 },
  focused_bullpens:        { label: 'Mental Resilience', color: '#8B5CF6', num: 2 },
  progress_check_in:       { label: 'Mental Resilience', color: '#8B5CF6', num: 2 },
  mental_toughness:        { label: 'Mental Resilience', color: '#8B5CF6', num: 2 },
  reflection_rebuild:      { label: 'Mental Resilience', color: '#8B5CF6', num: 2 },
  // Phase 3: Leadership Identity
  ownership_leadership:      { label: 'Leadership Identity', color: '#10b981', num: 3 },
  leading_by_example:        { label: 'Leadership Identity', color: '#10b981', num: 3 },
  finding_your_voice:        { label: 'Leadership Identity', color: '#10b981', num: 3 },
  teach_to_master:           { label: 'Leadership Identity', color: '#10b981', num: 3 },
  consistency_trust:         { label: 'Leadership Identity', color: '#10b981', num: 3 },
  leading_through_struggles: { label: 'Leadership Identity', color: '#10b981', num: 3 },
  team_before_me:            { label: 'Leadership Identity', color: '#10b981', num: 3 },
  culture_builders:          { label: 'Leadership Identity', color: '#10b981', num: 3 },
  owning_your_energy:        { label: 'Leadership Identity', color: '#10b981', num: 3 },
  mentor_mode:               { label: 'Leadership Identity', color: '#10b981', num: 3 },
  leadership_review:         { label: 'Leadership Identity', color: '#10b981', num: 3 },
  pass_the_torch:            { label: 'Leadership Identity', color: '#10b981', num: 3 },
  // Phase 4: Legacy & Growth
  who_are_you_becoming:       { label: 'Legacy & Growth', color: '#f59e0b', num: 4 },
  building_positive_influence:{ label: 'Legacy & Growth', color: '#f59e0b', num: 4 },
  intentional_effort:         { label: 'Legacy & Growth', color: '#f59e0b', num: 4 },
  own_your_impact:            { label: 'Legacy & Growth', color: '#f59e0b', num: 4 },
  handling_pressure:          { label: 'Legacy & Growth', color: '#f59e0b', num: 4 },
  giving_back:                { label: 'Legacy & Growth', color: '#f59e0b', num: 4 },
  building_resilience:        { label: 'Legacy & Growth', color: '#f59e0b', num: 4 },
  keeping_perspective:        { label: 'Legacy & Growth', color: '#f59e0b', num: 4 },
  team_culture:               { label: 'Legacy & Growth', color: '#f59e0b', num: 4 },
  power_of_consistency:       { label: 'Legacy & Growth', color: '#f59e0b', num: 4 },
  vision_for_future:          { label: 'Legacy & Growth', color: '#f59e0b', num: 4 },
  final_reflection:           { label: 'Legacy & Growth', color: '#f59e0b', num: 4 },
}

export default function QuestionCard({
  question,
  index,
  total,
  answer,
  onAnswer,
  onNext,
  onPrev,
}: Props) {
  const pct = Math.round(((index + 1) / total) * 100)
  const isLast = index === total - 1
  const hasAnswer = checkHasAnswer(answer, question.question_type)
  const phase = PHASE_LOOKUP[question.sub_category ?? ''] ?? null

  return (
    <div className="smz-card p-6 smz-fade-in">

      {/* Progress + phase badge */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            {phase && (
              <span
                className="inline-flex items-center gap-1.5 font-bold uppercase rounded-full px-2.5 py-0.5"
                style={{
                  fontSize: '0.6rem',
                  letterSpacing: '0.1em',
                  color: phase.color,
                  background: `${phase.color}18`,
                  border: `1px solid ${phase.color}35`,
                }}
              >
                <span
                  className="rounded-full shrink-0"
                  style={{ width: 5, height: 5, background: phase.color }}
                />
                Phase {phase.num} · {phase.label}
              </span>
            )}
          </div>
          <span
            className="font-bold tabular-nums"
            style={{ fontSize: '0.75rem', color: 'var(--smz-label-3)', letterSpacing: '0.04em' }}
          >
            {index + 1} / {total}
          </span>
        </div>
        <div className="smz-progress-track">
          <div className="smz-progress-fill" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {/* Question */}
      <p
        className="mb-6 font-semibold leading-relaxed"
        style={{ fontSize: '1.0625rem', color: 'var(--smz-label)' }}
      >
        {question.question_text}
      </p>

      {/* Input */}
      <div className="mb-6">
        {question.question_type === 'multiple_choice' && (
          <MCOptions question={question} answer={answer} onAnswer={onAnswer} />
        )}
        {question.question_type === 'multi_select' && (
          <MultiSelect question={question} answer={answer} onAnswer={onAnswer} />
        )}
        {question.question_type === 'fill_blank' && (
          <FillBlank answer={answer} onAnswer={onAnswer} />
        )}
        {question.question_type === 'written' && (
          <WrittenAnswer answer={answer} onAnswer={onAnswer} />
        )}
      </div>

      {/* Baseball stitch separator */}
      <div className="smz-stitch-line mb-5" />

      {/* Navigation */}
      <div className="flex gap-2.5">
        {index > 0 && (
          <button onClick={onPrev} className="smz-btn-ghost">
            ← Back
          </button>
        )}
        <button
          onClick={onNext}
          disabled={!hasAnswer}
          className="smz-btn-primary flex-1"
          style={{ width: 'auto', borderRadius: '100px' }}
        >
          {isLast ? 'View My Results →' : 'Next →'}
        </button>
      </div>
    </div>
  )
}

// ── Sub-components ─────────────────────────────────────────────────────────

function MCOptions({
  question,
  answer,
  onAnswer,
}: {
  question: Question
  answer: Answer | undefined
  onAnswer: (a: Answer) => void
}) {
  const selected = typeof answer === 'string' ? answer : null
  return (
    <div className="space-y-2">
      {(question.options ?? []).map((opt) => {
        const isSelected = selected === opt.label
        return (
          <button
            key={opt.label}
            onClick={() => onAnswer(opt.label)}
            className={['smz-option focus:outline-none cursor-pointer', isSelected ? 'smz-option-selected' : ''].join(' ')}
          >
            {/* Letter badge */}
            <span
              className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center font-bold"
              style={{
                fontSize: '0.75rem',
                background: isSelected ? '#2d4aa8' : 'rgba(60,60,67,0.08)',
                color: isSelected ? 'white' : 'var(--smz-label-2)',
                transition: 'background 0.15s, color 0.15s',
              }}
            >
              {opt.label}
            </span>
            <span
              className="text-sm leading-snug"
              style={{ color: isSelected ? 'var(--smz-blue)' : 'var(--smz-label)', fontWeight: isSelected ? 600 : 400 }}
            >
              {opt.text}
            </span>
            {isSelected && (
              <span className="ml-auto shrink-0">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                  <circle cx="9" cy="9" r="9" fill="#2d4aa8" />
                  <path d="M5 9l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

function MultiSelect({
  question,
  answer,
  onAnswer,
}: {
  question: Question
  answer: Answer | undefined
  onAnswer: (a: Answer) => void
}) {
  const selected: string[] = Array.isArray(answer) ? answer : []
  const toggle = (label: string) => {
    const next = selected.includes(label)
      ? selected.filter((v) => v !== label)
      : [...selected, label]
    onAnswer(next)
  }

  return (
    <div>
      <p
        className="mb-2.5 font-medium"
        style={{ fontSize: '0.8125rem', color: 'var(--smz-label-2)' }}
      >
        Select all that apply
      </p>
      <div className="space-y-2">
        {(question.options ?? []).map((opt) => {
          const isSelected = selected.includes(opt.label)
          return (
            <button
              key={opt.label}
              onClick={() => toggle(opt.label)}
              className={['smz-option focus:outline-none cursor-pointer', isSelected ? 'smz-option-selected' : ''].join(' ')}
            >
              {/* Checkbox */}
              <span
                className="shrink-0 w-5 h-5 rounded flex items-center justify-center border-2 transition-all"
                style={{
                  background: isSelected ? '#2d4aa8' : 'transparent',
                  borderColor: isSelected ? '#2d4aa8' : 'rgba(60,60,67,0.25)',
                }}
              >
                {isSelected && (
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                    <path d="M2 5l2.5 2.5L8 2.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </span>
              <span
                className="text-sm leading-snug"
                style={{ color: isSelected ? 'var(--smz-blue)' : 'var(--smz-label)', fontWeight: isSelected ? 600 : 400 }}
              >
                <span
                  className="font-bold mr-1"
                  style={{ color: isSelected ? '#2d4aa8' : 'var(--smz-label-3)' }}
                >
                  {opt.label}.
                </span>
                {opt.text}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function FillBlank({ answer, onAnswer }: { answer: Answer | undefined; onAnswer: (a: Answer) => void }) {
  const value = typeof answer === 'string' ? answer : ''
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onAnswer(e.target.value)}
      placeholder="Type your answer…"
      maxLength={200}
      autoComplete="off"
      className="smz-input"
    />
  )
}

function WrittenAnswer({ answer, onAnswer }: { answer: Answer | undefined; onAnswer: (a: Answer) => void }) {
  const value = typeof answer === 'string' ? answer : ''
  const [count, setCount] = useState(value.length)

  useEffect(() => { setCount(value.length) }, [value])

  return (
    <div>
      <textarea
        value={value}
        onChange={(e) => { onAnswer(e.target.value); setCount(e.target.value.length) }}
        placeholder="Write your answer here…"
        maxLength={2000}
        rows={5}
        className="smz-input resize-none"
        style={{ lineHeight: 1.65 }}
      />
      <p
        className="text-right mt-1.5 font-medium"
        style={{ fontSize: '0.75rem', color: 'var(--smz-label-3)' }}
      >
        {count} / 2000
      </p>
    </div>
  )
}

function checkHasAnswer(answer: Answer | undefined, type: string): boolean {
  if (!answer) return false
  if (type === 'multi_select') return Array.isArray(answer) && answer.length > 0
  return String(answer).trim().length > 0
}
