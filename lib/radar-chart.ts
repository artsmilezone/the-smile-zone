export interface RadarData {
  labels: string[]
  values: number[]
}

/**
 * Port of radar-chart.js — pure Canvas draw logic.
 * Called from RadarChart.tsx via useRef.
 */
export function drawRadarChart(canvas: HTMLCanvasElement, data: RadarData): void {
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const size = Math.min(canvas.width, canvas.height)
  const cx = canvas.width / 2
  const cy = canvas.height / 2
  const n = data.labels.length
  // Smaller radius when fewer dimensions to give labels more room
  const radiusFactor = n <= 4 ? 0.48 : 0.58
  const radius = (size / 2) * radiusFactor
  const angle = (2 * Math.PI) / n

  ctx.clearRect(0, 0, canvas.width, canvas.height)

  const levels = 5
  const levelValues = [20, 40, 60, 80, 100]

  // Grid circles
  for (let l = 1; l <= levels; l++) {
    const r = (radius / levels) * l
    ctx.beginPath()
    ctx.strokeStyle = 'rgba(59,159,224,0.18)'
    ctx.lineWidth = 1
    for (let i = 0; i < n; i++) {
      const a = angle * i - Math.PI / 2
      const x = cx + r * Math.cos(a)
      const y = cy + r * Math.sin(a)
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
    }
    ctx.closePath()
    ctx.stroke()
  }

  // Spokes
  for (let i = 0; i < n; i++) {
    const a = angle * i - Math.PI / 2
    ctx.beginPath()
    ctx.strokeStyle = 'rgba(59,159,224,0.25)'
    ctx.lineWidth = 1
    ctx.moveTo(cx, cy)
    ctx.lineTo(cx + radius * Math.cos(a), cy + radius * Math.sin(a))
    ctx.stroke()
  }

  // Score interval labels — placed along the top spoke (12 o'clock)
  ctx.font = '10px Arial, sans-serif'
  ctx.fillStyle = 'rgba(59,159,224,0.65)'
  ctx.textAlign = 'center'
  for (let l = 1; l <= levels; l++) {
    const r = (radius / levels) * l
    // Position label just to the right of the 12-o'clock axis
    const labelX = cx + 14
    const labelY = cy - r + 4
    ctx.fillText(String(levelValues[l - 1]), labelX, labelY)
  }

  // Data polygon — filled + stroked
  ctx.beginPath()
  data.values.forEach((v, i) => {
    const a = angle * i - Math.PI / 2
    const r = (v / 100) * radius
    const x = cx + r * Math.cos(a)
    const y = cy + r * Math.sin(a)
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
  })
  ctx.closePath()
  ctx.fillStyle = 'rgba(59,159,224,0.12)'
  ctx.fill()
  ctx.strokeStyle = '#1D7BBF'
  ctx.lineWidth = 2.5
  ctx.stroke()

  // Data point dots
  data.values.forEach((v, i) => {
    const a = angle * i - Math.PI / 2
    const r = (v / 100) * radius
    ctx.beginPath()
    ctx.arc(cx + r * Math.cos(a), cy + r * Math.sin(a), 4, 0, 2 * Math.PI)
    ctx.fillStyle = '#3B9FE0'
    ctx.fill()
  })

  // Dimension labels with multi-line wrapping for long text
  const labelOffset = n <= 4 ? 28 : 20
  const labelFont = n <= 4 ? 'bold 12px Arial, sans-serif' : 'bold 11px Arial, sans-serif'
  const maxLabelWidth = n <= 4 ? 90 : 72

  ctx.fillStyle = '#1a1a2e'
  ctx.font = labelFont

  data.labels.forEach((label, i) => {
    const a = angle * i - Math.PI / 2
    const r = radius + labelOffset
    const x = cx + r * Math.cos(a)
    const y = cy + r * Math.sin(a)

    const cosA = Math.cos(a)
    const align: CanvasTextAlign =
      Math.abs(cosA) < 0.15 ? 'center' : cosA > 0 ? 'left' : 'right'
    ctx.textAlign = align

    // Word-wrap the label to fit within maxLabelWidth
    const words = label.split(' ')
    const lines: string[] = []
    let current = ''
    for (const word of words) {
      const test = current ? `${current} ${word}` : word
      if (ctx.measureText(test).width <= maxLabelWidth) {
        current = test
      } else {
        if (current) lines.push(current)
        current = word
      }
    }
    if (current) lines.push(current)

    const lineH = 14
    const totalH = lines.length * lineH
    // Center the block vertically around y
    const startY = y - (totalH - lineH) / 2
    lines.forEach((line, li) => {
      ctx.fillText(line, x, startY + li * lineH)
    })

    // Score value near the data point
    const vr = (data.values[i] / 100) * radius
    const vx = cx + (vr + 13) * Math.cos(a)
    const vy = cy + (vr + 13) * Math.sin(a)
    ctx.textAlign = 'center'
    ctx.fillStyle = '#3B9FE0'
    ctx.font = 'bold 11px Arial, sans-serif'
    ctx.fillText(String(data.values[i]), vx, vy)
    ctx.fillStyle = '#1a1a2e'
    ctx.font = labelFont
  })
}
