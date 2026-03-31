/**
 * Generates a standalone SVG string of the radar chart.
 * Used for email embedding — no canvas dependency.
 * Matches the canvas design: no fill, stroke-only polygon with dots.
 */
export function generateRadarSvg(
  labels: string[],
  values: number[],
): string {
  const size  = 420
  const cx    = size / 2
  const cy    = size / 2
  const radius = (size / 2) * 0.62
  const n     = labels.length
  const angle = (2 * Math.PI) / n
  const levels = 5

  const pt = (r: number, i: number) => {
    const a = angle * i - Math.PI / 2
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a), a }
  }

  const round = (n: number) => Math.round(n * 10) / 10

  // ── Grid polygons ───────────────────────────────────────────────────────
  let gridPaths = ''
  for (let l = 1; l <= levels; l++) {
    const r = (radius / levels) * l
    const pts = Array.from({ length: n }, (_, i) => pt(r, i))
    const d = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${round(p.x)},${round(p.y)}`).join(' ') + ' Z'
    gridPaths += `<path d="${d}" fill="none" stroke="rgba(59,159,224,0.18)" stroke-width="1"/>\n`
  }

  // ── Spokes ──────────────────────────────────────────────────────────────
  let spokes = ''
  for (let i = 0; i < n; i++) {
    const { x, y } = pt(radius, i)
    spokes += `<line x1="${cx}" y1="${cy}" x2="${round(x)}" y2="${round(y)}" stroke="rgba(59,159,224,0.25)" stroke-width="1"/>\n`
  }

  // ── Data polygon (stroke only, no fill) ─────────────────────────────────
  const dataPts = values.map((v, i) => pt((v / 100) * radius, i))
  const dataD = dataPts.map((p, i) => `${i === 0 ? 'M' : 'L'}${round(p.x)},${round(p.y)}`).join(' ') + ' Z'
  const dataPolygon = `<path d="${dataD}" fill="none" stroke="#1D7BBF" stroke-width="2.5" stroke-linejoin="round"/>\n`

  // ── Dots ─────────────────────────────────────────────────────────────────
  const dots = dataPts.map(p =>
    `<circle cx="${round(p.x)}" cy="${round(p.y)}" r="4.5" fill="#1D7BBF"/>`
  ).join('\n')

  // ── Labels ───────────────────────────────────────────────────────────────
  const labelOffset = radius + 20
  let labelEls = ''
  labels.forEach((label, i) => {
    const { x, y, a } = pt(labelOffset, i)
    const cosA = Math.cos(a)
    const anchor = Math.abs(cosA) < 0.15 ? 'middle' : cosA > 0 ? 'start' : 'end'
    labelEls += `<text x="${round(x)}" y="${round(y + 4)}" text-anchor="${anchor}" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#1a1a2e">${escapeXml(label)}</text>\n`
  })

  // ── Value labels ─────────────────────────────────────────────────────────
  let valueLabelEls = ''
  values.forEach((v, i) => {
    const vr = (v / 100) * radius
    const { x, y } = pt(vr + 14, i)
    valueLabelEls += `<text x="${round(x)}" y="${round(y + 4)}" text-anchor="middle" font-family="Arial, sans-serif" font-size="11" fill="#3B9FE0">${v}</text>\n`
  })

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
<rect width="${size}" height="${size}" fill="white"/>
${gridPaths}${spokes}${dataPolygon}${dots}
${labelEls}${valueLabelEls}</svg>`
}

function escapeXml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}
