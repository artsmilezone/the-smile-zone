'use client'

import { useState } from 'react'

type Status = 'idle' | 'submitting' | 'success' | 'error'

export default function ContactFormInline() {
  const [name,    setName]    = useState('')
  const [email,   setEmail]   = useState('')
  const [message, setMessage] = useState('')
  const [status,  setStatus]  = useState<Status>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (status === 'submitting') return
    setStatus('submitting')

    try {
      const res = await fetch('/api/contact', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ name: name.trim(), email: email.trim(), message: message.trim() }),
      })
      if (!res.ok) throw new Error('Request failed')
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div
        className="rounded-xl px-6 py-10 text-center"
        style={{ background: 'rgba(59,159,224,0.08)', border: '1.5px solid rgba(59,159,224,0.25)' }}
      >
        <p className="text-2xl font-bebas tracking-widest mb-2" style={{ color: '#3B9FE0' }}>
          Message Received!
        </p>
        <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.9375rem', lineHeight: 1.6 }}>
          Thanks for reaching out. We&apos;ll be in touch soon.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      <div>
        <label
          htmlFor="contact-name"
          className="block text-xs font-bold uppercase tracking-widest mb-1.5"
          style={{ color: 'rgba(255,255,255,0.5)' }}
        >
          Name
        </label>
        <input
          id="contact-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="Your name"
          disabled={status === 'submitting'}
          className="smz-input w-full disabled:opacity-50"
        />
      </div>

      <div>
        <label
          htmlFor="contact-email"
          className="block text-xs font-bold uppercase tracking-widest mb-1.5"
          style={{ color: 'rgba(255,255,255,0.5)' }}
        >
          Email
        </label>
        <input
          id="contact-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="your@email.com"
          disabled={status === 'submitting'}
          className="smz-input w-full disabled:opacity-50"
        />
      </div>

      <div>
        <label
          htmlFor="contact-message"
          className="block text-xs font-bold uppercase tracking-widest mb-1.5"
          style={{ color: 'rgba(255,255,255,0.5)' }}
        >
          Message
        </label>
        <textarea
          id="contact-message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          rows={4}
          placeholder="How can we help?"
          disabled={status === 'submitting'}
          className="smz-input w-full resize-none disabled:opacity-50"
        />
      </div>

      {status === 'error' && (
        <p className="text-sm font-medium" style={{ color: '#C41E3A' }}>
          Something went wrong. Please try again.
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="smz-btn-primary w-full cursor-pointer disabled:opacity-50"
      >
        {status === 'submitting' ? 'Sending…' : 'Send Message'}
      </button>
    </form>
  )
}
