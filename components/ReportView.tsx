'use client'

import type { AgeGroup, SubmitResult } from '@/types'
import ScoreDisplay from './ScoreDisplay'
import ShareCard from './ShareCard'

function formatAgeGroup(ag: AgeGroup): string {
  if (ag === '13u')    return '13 & Under'
  if (ag === '14-17')  return '14 – 17'
  if (ag === '18plus') return '18 +'
  return ag
}

interface Props {
  data: SubmitResult
}

export default function ReportView({ data }: Props) {
  const firstNameMatch = data.report_html.match(/<h[12][^>]*>Hey ([^!<]+)!?/)
  const firstName = firstNameMatch ? firstNameMatch[1].trim() : 'You'

  return (
    <div className="space-y-4 smz-fade-in">

      {/* Logo */}
      <div className="flex justify-center pt-2 pb-1">
        <img src="/smz-logo-text.png" alt="SMILE Zone" className="h-20 w-auto" />
      </div>

      {/* Email failure notice — top of page */}
      {data.email_note && (
        <div className="rounded-2xl px-4 py-3 flex gap-3 items-start smz-no-print" style={{ background: 'rgba(196,30,58,0.05)', border: '1.5px solid rgba(196,30,58,0.2)' }}>
          <span className="font-black text-base leading-snug shrink-0" style={{ color: '#C41E3A' }}>!</span>
          <p className="text-sm leading-snug" style={{ color: '#8B0000' }}>{data.email_note}</p>
        </div>
      )}

      {/* Archetype banner — scorebook lines, Bebas display */}
      <div className="rounded-2xl bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0d2347] text-white shadow-xl relative overflow-hidden">
        <div className="smz-stripe-bg absolute inset-0 pointer-events-none" />
        <div className="relative px-8 py-8 text-center">
          <p className="text-[9px] uppercase tracking-[0.25em] text-[#9DD8F5] font-bold mb-3">
            SMILE Zone · Player Archetype
          </p>
          <span
            className="inline-block mb-3 px-3 py-1 rounded-full font-bold uppercase tracking-widest"
            style={{ fontSize: '0.6rem', background: 'rgba(59,159,224,0.15)', color: '#9DD8F5', border: '1px solid rgba(59,159,224,0.28)' }}
          >
            Ages {formatAgeGroup(data.age_group)}
          </span>
          <h2 className="font-bebas text-5xl sm:text-6xl tracking-wide leading-none mb-3">
            {data.archetype}
          </h2>
          <div className="flex items-center justify-center gap-4 mt-4">
            <span className="flex-1 h-px bg-white/15 max-w-[60px]" />
            <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-semibold">
              Mental Performance Assessment
            </span>
            <span className="flex-1 h-px bg-white/15 max-w-[60px]" />
          </div>
        </div>
      </div>

      {/* Stats card */}
      <div className="smz-card overflow-hidden">
        <div className="px-6 pt-1 pb-0 border-b" style={{ borderColor: 'rgba(60,60,67,0.08)' }}>
          <p className="text-center pt-3 pb-2 font-bold uppercase" style={{ fontSize: '0.625rem', letterSpacing: '0.14em', color: 'var(--smz-label-3)' }}>
            Performance Stats
          </p>
        </div>
        <ScoreDisplay mmScore={data.mm_score} biqScore={data.biq_score} />
      </div>

      {/* Report body — editorial sports styling */}
      {/* HTML is sanitized server-side by DOMPurify (lib/sanitize.ts)
          before being stored in Supabase and returned from /api/submit.
          Content originates from our server (Claude output run through DOMPurify),
          never from user input directly, so rendering is safe. */}
      <div className="smz-card overflow-hidden smz-print-card">
        <div className="bg-[#1a1a2e] px-6 py-3 flex items-center justify-between smz-no-print">
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/60">
            Your Full Report
          </p>
          <button
            onClick={() => window.print()}
            className="text-[11px] text-white/50 hover:text-white/90 transition-colors font-semibold"
          >
            Print / Save PDF
          </button>
        </div>
        <div className="px-6 py-7 sm:px-8">
          <ReportBody html={data.report_html} />
        </div>
      </div>

      {/* CTA + share */}
      <div className="flex flex-col gap-3 smz-no-print">
        <div className="bg-white rounded-2xl shadow-md p-5">
          <ShareCard
            firstName={firstName}
            archetype={data.archetype}
            mmScore={data.mm_score}
            biqScore={data.biq_score}
          />
        </div>
      </div>

      {/* Join CTA */}
      <div
        className="rounded-2xl text-center px-6 py-8 smz-no-print"
        style={{
          background: 'linear-gradient(135deg, #1a1a2e 0%, #0d2347 100%)',
          border: '1px solid rgba(59,159,224,0.25)',
        }}
      >
        <p
          className="text-xs font-bold uppercase tracking-widest mb-2"
          style={{ color: '#9DD8F5' }}
        >
          Ready to level up?
        </p>
        <h3
          className="font-bebas text-3xl text-white mb-1"
          style={{ letterSpacing: '0.06em' }}
        >
          Join The S.M.I.L.E. Zone
        </h3>
        <p className="text-sm mb-5" style={{ color: 'rgba(255,255,255,0.6)' }}>
          48-week program · 4 phases · mental performance
        </p>
        <a
          href="https://the-smile-zone.mn.co"
          className="inline-block px-8 py-3 rounded-full font-bold text-base text-white"
          style={{ background: '#3B9FE0' }}
        >
          Join the Community →
        </a>
      </div>

      <RetakeBanner />
    </div>
  )
}

// Isolated component for server-sanitized HTML rendering.
// The html prop is guaranteed to be DOMPurify-cleaned before this component receives it.
function ReportBody({ html }: { html: string }) {
  const props = {
    className: 'smz-report',
    dangerouslySetInnerHTML: { __html: html },
  }
  return <div {...props} />
}


function RetakeBanner() {
  const retakeDate = (() => {
    try {
      const raw = localStorage.getItem('smz_retake_until')
      if (!raw) return null
      const until = new Date(raw)
      if (isNaN(until.getTime())) return null
      return until.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    } catch {
      return null
    }
  })()

  if (!retakeDate) return null

  return (
    <div className="rounded-2xl px-6 py-4 text-center text-sm smz-no-print" style={{ background: 'var(--smz-blue-tint)', border: '1.5px solid rgba(59,159,224,0.3)', color: 'var(--smz-blue)' }}>
      You can retake this assessment on <strong>{retakeDate}</strong>.
    </div>
  )
}
