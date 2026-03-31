'use client'

import { useState } from 'react'

interface Props {
  firstName: string
  archetype: string
  mmScore: number
  biqScore: number
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.arcTo(x + w, y,     x + w, y + r,     r)
  ctx.lineTo(x + w, y + h - r)
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r)
  ctx.lineTo(x + r, y + h)
  ctx.arcTo(x,     y + h, x,     y + h - r, r)
  ctx.lineTo(x,     y + r)
  ctx.arcTo(x,     y,     x + r, y,          r)
  ctx.closePath()
}

export default function ShareCard({ firstName, archetype, mmScore, biqScore }: Props) {
  const [fallback, setFallback] = useState(false)

  const generate = () => {
    const canvas = document.createElement('canvas')
    canvas.width  = 1200
    canvas.height = 630
    const ctx = canvas.getContext('2d')

    if (!ctx) { setFallback(true); return }

    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, 1200, 630)
    grad.addColorStop(0, '#1a1a2e')
    grad.addColorStop(1, '#2d4aa8')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, 1200, 630)

    // Decorative circle
    ctx.beginPath()
    ctx.arc(1050, 580, 300, 0, 2 * Math.PI)
    ctx.strokeStyle = 'rgba(255,255,255,0.07)'
    ctx.lineWidth = 60
    ctx.stroke()

    // Wordmark
    ctx.fillStyle = '#ffffff'
    ctx.font      = 'bold 28px Arial, sans-serif'
    ctx.textAlign = 'left'
    ctx.fillText('SMILE ZONE', 60, 80)
    ctx.fillStyle = 'rgba(255,255,255,0.5)'
    ctx.font      = '18px Arial, sans-serif'
    ctx.fillText('Baseball Assessment', 60, 108)

    // Player name
    ctx.fillStyle = '#ffffff'
    ctx.font      = 'bold 64px Arial, sans-serif'
    ctx.fillText(firstName, 60, 240)

    // Archetype
    ctx.fillStyle = '#a0b4ff'
    ctx.font      = 'bold 32px Arial, sans-serif'
    ctx.fillText(archetype, 60, 290)

    // Score boxes
    const drawScoreBox = (x: number, y: number, label: string, score: number, color: string) => {
      ctx.fillStyle = 'rgba(255,255,255,0.1)'
      roundRect(ctx, x, y, 240, 140, 12)
      ctx.fill()
      ctx.fillStyle = color
      ctx.font      = 'bold 72px Arial, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(String(score), x + 120, y + 92)
      ctx.fillStyle = 'rgba(255,255,255,0.7)'
      ctx.font      = '16px Arial, sans-serif'
      ctx.fillText(label, x + 120, y + 122)
      ctx.textAlign = 'left'
    }

    drawScoreBox(60,  370, 'Mental Mindset', mmScore,  '#7eceff')
    drawScoreBox(320, 370, 'Baseball IQ',    biqScore, '#b4f0a0')

    // CTA
    ctx.fillStyle = 'rgba(255,255,255,0.6)'
    ctx.font      = '20px Arial, sans-serif'
    ctx.textAlign = 'left'
    ctx.fillText('www.the-smile-zone.com', 60, 580)

    // Download
    if (typeof canvas.toBlob === 'function') {
      try {
        canvas.toBlob((blob) => {
          if (!blob) { setFallback(true); return }
          const url  = URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href     = url
          link.download = 'smilezone-assessment.png'
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          URL.revokeObjectURL(url)
        }, 'image/png')
      } catch {
        setFallback(true)
      }
    } else {
      try {
        const url  = canvas.toDataURL('image/png')
        const link = document.createElement('a')
        link.href     = url
        link.download = 'smilezone-assessment.png'
        link.click()
      } catch {
        setFallback(true)
      }
    }
  }

  if (fallback) {
    return (
      <p className="text-sm text-gray-500 text-center">
        To share your results, take a screenshot of this page!
      </p>
    )
  }

  return (
    <button
      onClick={generate}
      className="px-6 py-3 rounded-xl border-2 border-[#2d4aa8] text-[#2d4aa8] font-semibold text-sm hover:bg-blue-50 transition-colors"
    >
      📥 Download Share Card
    </button>
  )
}
