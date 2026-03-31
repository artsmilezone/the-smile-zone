'use client'

interface Props {
  retakeDate?: string | null
}

export default function RetakeBlocked({ retakeDate: propDate }: Props) {
  const retakeDate = propDate ?? (() => {
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

  return (
    <div className="bg-white rounded-2xl shadow-md p-8 text-center smz-fade-in">
      <div className="flex justify-center mb-4">
        <svg width="56" height="56" viewBox="0 0 56 56" fill="none" aria-hidden="true">
          <circle cx="28" cy="28" r="26" fill="#1a1a2e" />
          <path d="M28 16v12l8 8" stroke="#7eceff" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </div>

      <h2 className="text-xl font-bold text-[#1a1a2e] mb-2">Assessment Already Completed</h2>
      <p className="text-gray-500 text-sm mb-1">
        You've recently completed the SMILE Zone Assessment.
      </p>
      {retakeDate && (
        <p className="text-gray-500 text-sm mb-6">
          You can retake it on <strong className="text-[#1a1a2e]">{retakeDate}</strong>.
        </p>
      )}

      <a
        href="https://the-smile-zone.mn.co"
        className="inline-block px-6 py-3 rounded-xl bg-[#2d4aa8] text-white font-bold text-sm hover:bg-blue-800 transition-colors"
      >
        Join the SMILE Zone →
      </a>
    </div>
  )
}
