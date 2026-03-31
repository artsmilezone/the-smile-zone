import { NextRequest, NextResponse } from 'next/server'
import { sendContactEmail } from '@/lib/resend'
import { appendContactRow } from '@/lib/google-sheets'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: NextRequest) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }

  const data = body as Record<string, unknown>
  const name    = typeof data.name    === 'string' ? data.name.trim()    : ''
  const email   = typeof data.email   === 'string' ? data.email.trim()   : ''
  const message = typeof data.message === 'string' ? data.message.trim() : ''

  if (!name || !email || !message) {
    return NextResponse.json({ error: 'All fields are required.' }, { status: 400 })
  }
  if (!EMAIL_REGEX.test(email)) {
    return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 })
  }

  // Send notification + log to sheet — both non-blocking on errors
  await Promise.allSettled([
    sendContactEmail(name, email, message).catch((err) =>
      console.error('SMILEZONE [contact] Email failed:', err),
    ),
    appendContactRow(name, email, message).catch((err) =>
      console.error('SMILEZONE [contact] Sheets row failed:', err),
    ),
  ])

  return NextResponse.json({ success: true })
}
