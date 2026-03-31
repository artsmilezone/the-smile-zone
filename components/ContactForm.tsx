'use client'

import { useState } from 'react'

interface Props {
  onSubmit: (firstName: string, email: string) => void
  onBack: () => void
  error: string | null
  locked: boolean
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function ContactForm({ onSubmit, onBack, error, locked }: Props) {
  const [firstName, setFirstName] = useState('')
  const [email, setEmail]         = useState('')
  const [nameError, setNameError] = useState('')
  const [emailError, setEmailError] = useState('')

  const validate = () => {
    let valid = true
    if (!firstName.trim()) {
      setNameError('Please enter your first name.')
      valid = false
    } else { setNameError('') }
    if (!EMAIL_REGEX.test(email.trim())) {
      setEmailError('Please enter a valid email address.')
      valid = false
    } else { setEmailError('') }
    return valid
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (locked) return
    if (!validate()) return
    onSubmit(firstName.trim(), email.trim())
  }

  return (
    <div className="smz-card p-8 smz-fade-in">

      <h2
        className="font-bebas leading-none mb-1"
        style={{ fontSize: '2.25rem', letterSpacing: '0.06em', color: 'var(--smz-label)' }}
      >
        Your Report Is Ready
      </h2>
      <p
        className="mb-7"
        style={{ fontSize: '0.9375rem', color: 'var(--smz-label-2)', lineHeight: 1.55 }}
      >
        Enter your details and we&apos;ll send your personalized archetype report.
      </p>

      <form onSubmit={handleSubmit} noValidate className="space-y-5">

        {/* First name */}
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
            disabled={locked}
            className="smz-input disabled:opacity-50"
          />
          {nameError && (
            <p className="mt-1.5 font-medium" style={{ fontSize: '0.8125rem', color: '#C41E3A' }}>
              {nameError}
            </p>
          )}
        </div>

        {/* Email */}
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
              } else { setEmailError('') }
            }}
            placeholder="you@example.com"
            disabled={locked}
            className="smz-input disabled:opacity-50"
          />
          {emailError && (
            <p className="mt-1.5 font-medium" style={{ fontSize: '0.8125rem', color: '#C41E3A' }}>
              {emailError}
            </p>
          )}
        </div>

        <p style={{ fontSize: '0.8125rem', color: 'var(--smz-label-3)' }}>
          Your report will be emailed to you. We respect your privacy.
        </p>

        {error && (
          <div
            className="rounded-xl px-4 py-3 font-medium"
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

        {/* Baseball stitch separator */}
        <div className="smz-stitch-line" />

        <div className="flex gap-2.5 pt-1">
          <button
            type="button"
            onClick={onBack}
            disabled={locked}
            className="smz-btn-ghost disabled:opacity-40"
          >
            ← Back
          </button>
          <button
            type="submit"
            disabled={locked}
            className="smz-btn-primary flex-1"
            style={{ width: 'auto' }}
          >
            {locked ? 'Generating your report…' : 'Get My Results →'}
          </button>
        </div>
      </form>
    </div>
  )
}
