'use client'

import Image from 'next/image'

interface Props {
  message?: string
}

export default function LoadingScreen({ message = 'Loading…' }: Props) {
  return (
    <div className="smz-card p-12 flex flex-col items-center justify-center min-h-[300px] smz-fade-in">
      <Image
        src="/smz-logo-text.png"
        alt="The S.M.I.L.E. Zone"
        width={160}
        height={80}
        priority
        className="mb-7 opacity-90"
      />

      {/* Animated dots spinner */}
      <div className="flex items-center gap-2 mb-5" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="smz-dot"
            style={{ animationDelay: `${i * 0.18}s` }}
          />
        ))}
      </div>

      <p
        className="font-semibold text-center max-w-xs"
        style={{ fontSize: '1rem', color: 'var(--smz-label)' }}
      >
        {message}
      </p>
      <p
        className="text-center mt-2"
        style={{ fontSize: '0.8125rem', color: 'var(--smz-label-3)' }}
      >
        Please don&apos;t close this tab.
      </p>
    </div>
  )
}
