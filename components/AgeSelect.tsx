'use client'

import { useState } from 'react'
import type { AgeGroup } from '@/types'

const AGE_GROUPS: { value: AgeGroup; label: string; sub: string }[] = [
  { value: '13u',    label: '13 & Under', sub: 'Youth'          },
  { value: '14-17',  label: '14 – 17',    sub: 'High School'    },
  { value: '18plus', label: '18 +',       sub: 'College / Pro'  },
]

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

interface Props {
  selected: AgeGroup | null
  onSelect: (ag: AgeGroup) => void
  onStart: (firstName: string, email: string) => void
  error?: string | null
}

export default function AgeSelect({ selected, onSelect, onStart, error }: Props) {
  const [firstName, setFirstName] = useState('')
  const [email, setEmail]         = useState('')
  const [nameError, setNameError]   = useState('')
  const [emailError, setEmailError] = useState('')

  const handleStart = () => {
    let valid = true
    if (!firstName.trim()) {
      setNameError('Please enter your first name.')
      valid = false
    } else {
      setNameError('')
    }
    if (!EMAIL_REGEX.test(email.trim())) {
      setEmailError('Please enter a valid email address.')
      valid = false
    } else {
      setEmailError('')
    }
    if (!selected || !valid) return
    onStart(firstName.trim(), email.trim())
  }

  return (
    <div className="smz-card p-8 smz-fade-in">

      {/* Heading */}
      <h2
        className="font-bebas text-center leading-none mb-1"
        style={{ fontSize: '2.25rem', letterSpacing: '0.06em', color: 'var(--smz-label)' }}
      >
        Select Your Age Group
      </h2>
      <p
        className="text-center mb-8"
        style={{ fontSize: '0.9375rem', color: 'var(--smz-label-2)', lineHeight: 1.55 }}
      >
        12 questions · 4 curriculum phases · personalized report
      </p>

      {/* Age group cards */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {AGE_GROUPS.map((ag, i) => {
          const isSelected = selected === ag.value
          return (
            <button
              key={ag.value}
              onClick={() => onSelect(ag.value)}
              aria-pressed={isSelected}
              className={[
                'relative flex flex-col items-center justify-center py-6 rounded-2xl border transition-all cursor-pointer',
                'focus:outline-none active:scale-[0.96]',
                `smz-fade-in smz-stagger-${i + 1}`,
                isSelected
                  ? 'border-[#3B9FE0] bg-[#E8F4FD]'
                  : 'border-[rgba(60,60,67,0.12)] bg-white hover:border-[#3B9FE0] hover:bg-[rgba(59,159,224,0.06)]',
              ].join(' ')}
              style={{
                boxShadow: isSelected
                  ? '0 0 0 1px #3B9FE0, 0 4px 16px rgba(59,159,224,0.20)'
                  : 'var(--smz-shadow-xs)',
              }}
            >
              {/* Checkmark */}
              {isSelected && (
                <span className="absolute top-2.5 right-2.5">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <circle cx="8" cy="8" r="8" fill="#3B9FE0" />
                    <path d="M4.5 8l2.5 2.5 4.5-4.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              )}

              <span
                className="font-bebas tracking-wide leading-none"
                style={{
                  fontSize: '1.75rem',
                  color: isSelected ? '#3B9FE0' : 'var(--smz-label)',
                }}
              >
                {ag.label}
              </span>
              <span
                className="mt-1 font-semibold leading-none"
                style={{
                  fontSize: '0.6rem',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: isSelected ? 'rgba(59,159,224,0.75)' : 'var(--smz-label-3)',
                }}
              >
                {ag.sub}
              </span>
            </button>
          )
        })}
      </div>

      {/* Baseball stitch separator */}
      <div className="smz-stitch-line mb-8" />

      {/* Player info */}
      <div className="space-y-4 mb-6">
        <div>
          <label
            htmlFor="smz-first-name"
            className="block font-semibold mb-1.5"
            style={{ fontSize: '0.8125rem', color: 'var(--smz-label)', letterSpacing: '0.01em' }}
          >
            First Name
          </label>
          <input
            id="smz-first-name"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Your first name"
            className="smz-input"
          />
          {nameError && (
            <p className="mt-1.5 font-medium" style={{ fontSize: '0.8125rem', color: '#C41E3A' }}>
              {nameError}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="smz-email"
            className="block font-semibold mb-1.5"
            style={{ fontSize: '0.8125rem', color: 'var(--smz-label)', letterSpacing: '0.01em' }}
          >
            Email Address
          </label>
          <input
            id="smz-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => {
              if (email && !EMAIL_REGEX.test(email.trim())) {
                setEmailError('Please enter a valid email address.')
              } else {
                setEmailError('')
              }
            }}
            placeholder="you@example.com"
            className="smz-input"
          />
          {emailError && (
            <p className="mt-1.5 font-medium" style={{ fontSize: '0.8125rem', color: '#C41E3A' }}>
              {emailError}
            </p>
          )}
        </div>

        <p style={{ fontSize: '0.8125rem', color: 'var(--smz-label-3)' }}>
          Your results will be displayed here and emailed to you. We respect your privacy.
        </p>
      </div>

      {error && (
        <div
          className="rounded-xl px-4 py-3 font-medium mb-4"
          style={{
            background: 'rgba(196,30,58,0.06)',
            border: '1.5px solid rgba(196,30,58,0.25)',
            color: '#C41E3A',
            fontSize: '0.875rem',
          }}
        >
          {error}
        </div>
      )}

      <button
        onClick={handleStart}
        disabled={!selected}
        className="smz-btn-primary"
      >
        {selected ? 'Begin Assessment →' : 'Select an Age Group to Begin'}
      </button>
    </div>
  )
}
