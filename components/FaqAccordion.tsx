'use client'
import { useState } from 'react'

interface FaqItem {
  q: string
  a: string
}

export default function FaqAccordion({ items, light = false }: { items: FaqItem[]; light?: boolean }) {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <div className="flex flex-col gap-3">
      {items.map(({ q, a }, i) => (
        <div
          key={q}
          className="rounded-2xl overflow-hidden smz-card-hover"
          style={{
            background: open === i
              ? 'rgba(59,159,224,0.06)'
              : light ? '#FFFFFF' : 'rgba(255,255,255,0.03)',
            border: open === i
              ? '1px solid rgba(59,159,224,0.28)'
              : light ? '1px solid rgba(59,159,224,0.16)' : '1px solid rgba(255,255,255,0.07)',
            boxShadow: light && open !== i ? '0 2px 8px rgba(13,27,46,0.06)' : undefined,
            transition: 'background 0.2s ease, border-color 0.2s ease',
          }}
        >
          <button
            onClick={() => setOpen(open === i ? null : i)}
            aria-expanded={open === i}
            className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 cursor-pointer"
          >
            <span
              className="font-bold"
              style={{ fontSize: '0.9375rem', color: light ? '#0d1b2e' : '#ffffff' }}
            >
              {q}
            </span>
            <span
              className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center"
              style={{
                background: open === i
                  ? 'rgba(59,159,224,0.20)'
                  : light ? 'rgba(13,27,46,0.07)' : 'rgba(255,255,255,0.08)',
                transition: 'background 0.2s ease',
              }}
              aria-hidden="true"
            >
              <svg
                viewBox="0 0 16 16"
                fill="none"
                className="w-3.5 h-3.5"
                style={{
                  stroke: open === i ? '#9DD8F5' : light ? 'rgba(13,27,46,0.45)' : 'rgba(255,255,255,0.5)',
                  transition: 'transform 0.2s ease, stroke 0.2s ease',
                  transform: open === i ? 'rotate(180deg)' : 'none',
                }}
              >
                <path d="M3 6l5 5 5-5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </button>
          <div
            style={{
              maxHeight: open === i ? '200px' : '0',
              overflow: 'hidden',
              transition: 'max-height 0.28s ease',
            }}
          >
            <p className="px-5 pb-4 text-sm leading-relaxed" style={{ color: light ? '#4B6280' : 'rgba(255,255,255,0.55)' }}>
              {a}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
