'use client'

import { useEffect, useState } from 'react'

interface Props {
  mmScore: number
  biqScore: number
  phaseScores?: Record<string, number>
}


function ScoreRing({
  score,
  label,
  color,
  trackColor,
  delay = 0,
}: {
  score: number
  label: string
  color: string
  trackColor: string
  delay?: number
}) {
  const [animated, setAnimated] = useState(false)
  const size = 118
  const strokeWidth = 9
  const r = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * r
  const offset = circumference - (score / 100) * circumference

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), delay)
    return () => clearTimeout(t)
  }, [delay])

  return (
    <div className="flex flex-col items-center gap-2.5">
      <div className="relative">
        <svg
          width={size}
          height={size}
          style={{ transform: 'rotate(-90deg)' }}
          aria-hidden="true"
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={trackColor}
            strokeWidth={strokeWidth}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={animated ? offset : circumference}
            style={{
              transition: `stroke-dashoffset 1.1s cubic-bezier(0.34, 1.1, 0.64, 1) ${delay}ms`,
            }}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="font-bebas leading-none"
            style={{ fontSize: '2.6rem', color }}
          >
            {score}
          </span>
        </div>
      </div>

      <p
        className="text-center font-bold uppercase leading-tight"
        style={{ fontSize: '0.625rem', letterSpacing: '0.12em', color: 'var(--smz-label-2)' }}
      >
        {label}
      </p>
    </div>
  )
}


export default function ScoreDisplay({ mmScore, biqScore }: Props) {
  return (
    <div className="flex justify-center gap-10 py-7 px-6">
      <ScoreRing
        score={mmScore}
        label={'Mental\nMindset'}
        color="#3B9FE0"
        trackColor="rgba(59,159,224,0.12)"
        delay={100}
      />
      <ScoreRing
        score={biqScore}
        label={'Baseball\nIQ'}
        color="#10b981"
        trackColor="rgba(16,185,129,0.10)"
        delay={250}
      />
    </div>
  )
}
