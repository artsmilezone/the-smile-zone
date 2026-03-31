'use client'

import { useEffect, useRef } from 'react'
import { drawRadarChart } from '@/lib/radar-chart'

interface Props {
  labels: string[]
  values: number[]
}

export default function RadarChart({ labels, values }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return
    drawRadarChart(canvasRef.current, { labels, values })
  }, [labels, values])

  return (
    <canvas
      ref={canvasRef}
      width={420}
      height={420}
      className="w-full max-w-[420px] mx-auto block"
      aria-label="Skill radar chart"
    />
  )
}
