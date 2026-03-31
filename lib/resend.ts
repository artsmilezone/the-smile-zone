import { Resend } from 'resend'
import { generateRadarSvg } from './radar-chart-svg'
import fs from 'fs'
import path from 'path'

function getLogoDataUri(): string {
  try {
    const logoPath = path.join(process.cwd(), 'public', 'smz-logo-text.png')
    const data = fs.readFileSync(logoPath).toString('base64')
    return `data:image/png;base64,${data}`
  } catch {
    return ''
  }
}

const FROM = 'SMILE Zone <noreply@info.the-smile-zone.com>'
const BCC = ['info@the-smile-zone.com', 'art@the-smile-zone.com']

let _resend: Resend | null = null

function getClient(): Resend {
  if (!_resend) {
    if (!process.env.RESEND_API_KEY) {
      throw new Error('Missing RESEND_API_KEY environment variable.')
    }
    _resend = new Resend(process.env.RESEND_API_KEY)
  }
  return _resend
}

export async function sendIntakeEmail(firstName: string, toEmail: string): Promise<void> {
  const client = getClient()
  const logoDataUri = getLogoDataUri()

  const { error } = await client.emails.send({
    from:    FROM,
    to:      [toEmail],
    bcc:     BCC,
    subject: `Let's Talk, ${firstName}!`,
    html:    buildIntakeEmailHtml(firstName, logoDataUri),
  })

  if (error) throw new Error(`Resend error: ${error.message}`)
}

function buildIntakeEmailHtml(firstName: string, logoDataUri: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Your SMILE Zone Report Is Being Prepared</title>
<style>
  body { font-family: Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 0; }
  .wrapper { max-width: 600px; margin: 0 auto; background: #ffffff; }
  .header { background: #1a1a2e; color: #ffffff; padding: 32px 24px; text-align: center; }
  .body { padding: 32px 24px; color: #333333; line-height: 1.6; }
  .footer { background: #1a1a2e; color: #a0a8d0; text-align: center; padding: 24px; font-size: 12px; }
  .footer a { color: #a0a8d0; }
</style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      ${logoDataUri ? `<img src="${logoDataUri}" alt="SMILE Zone" style="height:72px;width:auto;margin:0 auto 16px;display:block;" />` : ''}
      <h1 style="margin:0;font-size:22px;">Assessment Received, ${firstName}!</h1>
    </div>
    <div class="body">
      <p>Thanks for completing the SMILE Zone Baseball Assessment.</p>
      <p>We're analyzing your answers and generating your personalized <strong>Player Archetype Report</strong>. You'll receive your full results — including your Mental Mindset score, Baseball IQ score, and custom development recommendations — in a separate email shortly.</p>
      <p>Stay tuned!</p>
      <p style="color:#666;font-size:13px;">Questions? Reply to this email or visit <a href="https://www.the-smile-zone.com" style="color:#3B9FE0;">the-smile-zone.com</a>.</p>
    </div>
    <div class="footer">
      <p>You received this email because you completed the SMILE Zone Baseball Assessment.</p>
      <p><a href="https://www.the-smile-zone.com">www.the-smile-zone.com</a></p>
    </div>
  </div>
</body>
</html>`
}

const CONTACT_EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function sendContactEmail(name: string, fromEmail: string, message: string): Promise<void> {
  // Validate email strictly before using it in a header to prevent injection
  const safeReplyTo = CONTACT_EMAIL_REGEX.test(fromEmail.trim()) ? fromEmail.trim() : ''
  if (!safeReplyTo) throw new Error('Invalid sender email address.')

  const client = getClient()

  const { error } = await client.emails.send({
    from:    FROM,
    to:      ['smileyj@the-smile-zone.com', 'art@the-smile-zone.com'],
    replyTo: safeReplyTo,
    subject: `Let's Talk — Message from ${name}`,
    html: `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><style>
body{font-family:Arial,sans-serif;background:#f5f5f5;margin:0;padding:0}
.wrapper{max-width:600px;margin:0 auto;background:#fff}
.header{background:#1a1a2e;color:#fff;padding:24px;text-align:center}
.body{padding:32px 24px;color:#333;line-height:1.6}
.field{margin-bottom:16px}
.label{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#999;margin-bottom:4px}
.value{font-size:15px;color:#1a1a2e}
.message-box{background:#f8f9ff;border-left:4px solid #3B9FE0;padding:16px;border-radius:4px;white-space:pre-wrap}
</style></head><body>
<div class="wrapper">
  <div class="header"><h1 style="margin:0;font-size:20px">New Contact Form Message</h1></div>
  <div class="body">
    <div class="field"><div class="label">Name</div><div class="value">${name}</div></div>
    <div class="field"><div class="label">Email</div><div class="value"><a href="mailto:${fromEmail}" style="color:#3B9FE0">${fromEmail}</a></div></div>
    <div class="field"><div class="label">Message</div><div class="message-box">${message.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div></div>
    <p style="margin-top:24px;font-size:13px;color:#666">Reply directly to this email to respond to ${name}.</p>
  </div>
</div></body></html>`,
  })

  if (error) throw new Error(`Resend error: ${error.message}`)

  // Send confirmation copy to the sender
  const safeMessage = message.replace(/</g, '&lt;').replace(/>/g, '&gt;')
  const safeName = name.replace(/</g, '&lt;').replace(/>/g, '&gt;')
  await client.emails.send({
    from:    FROM,
    to:      [safeReplyTo],
    subject: `We received your message, ${safeName}!`,
    html: `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<style>
body{font-family:Arial,sans-serif;background:#f5f5f5;margin:0;padding:0}
.wrapper{max-width:600px;margin:0 auto;background:#fff}
.header{background:#1a1a2e;color:#fff;padding:32px 24px;text-align:center}
.body{padding:32px 24px;color:#333;line-height:1.6}
.message-box{background:#f8f9ff;border-left:4px solid #3B9FE0;padding:16px;border-radius:4px;white-space:pre-wrap;font-size:14px;color:#444}
.footer{background:#1a1a2e;color:#a0a8d0;text-align:center;padding:24px;font-size:12px}
.footer a{color:#a0a8d0}
</style></head><body>
<div class="wrapper">
  <div class="header">
    <h1 style="margin:0;font-size:22px;">We Got Your Message!</h1>
    <p style="margin:8px 0 0;color:#a0a8d0;font-size:14px;">Thanks for reaching out, ${safeName}.</p>
  </div>
  <div class="body">
    <p>We've received your message and will get back to you shortly. Here's a copy of what you sent:</p>
    <div class="message-box">${safeMessage}</div>
    <p style="margin-top:24px;font-size:13px;color:#666;">Questions? Reply to this email or visit <a href="https://www.the-smile-zone.com" style="color:#3B9FE0;">the-smile-zone.com</a>.</p>
  </div>
  <div class="footer">
    <p>You received this because you submitted the SMILE Zone contact form.</p>
    <p><a href="https://www.the-smile-zone.com">www.the-smile-zone.com</a></p>
  </div>
</div>
</body></html>`,
  })
}

export async function sendEmail(
  firstName: string,
  toEmail: string,
  reportHtml: string,
  archetype: string,
  mmScore: number,
  biqScore: number,
  subScores: Record<string, number> = {},
  phaseScores: Record<string, number> = {},
  ageGroup: string = '',
): Promise<void> {
  const client = getClient()
  const subject = `Your SMILE Zone Baseball Assessment — ${archetype}`
  const logoDataUri = getLogoDataUri()
  const html = buildEmailHtml(firstName, reportHtml, archetype, mmScore, biqScore, subScores, phaseScores, logoDataUri, ageGroup)

  const { error } = await client.emails.send({
    from:    FROM,
    to:      [toEmail],
    bcc:     BCC,
    subject,
    html,
  })

  if (error) {
    throw new Error(`Resend error: ${error.message}`)
  }
}

function scoreRingCell(score: number, color: string, trackColor: string, label: string): string {
  const size = 120
  const sw = 10
  const r = (size - sw) / 2
  const circ = 2 * Math.PI * r
  const offset = (circ - (score / 100) * circ).toFixed(1)
  const circStr = circ.toFixed(1)
  return `<td style="text-align:center;padding:8px 20px;vertical-align:top;">
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="${trackColor}" stroke-width="${sw}"/>
      <g transform="rotate(-90,${size / 2},${size / 2})">
        <circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="${color}" stroke-width="${sw}" stroke-dasharray="${circStr}" stroke-dashoffset="${offset}" stroke-linecap="round"/>
      </g>
      <text x="${size / 2}" y="${size / 2 + 13}" text-anchor="middle" font-family="Arial,sans-serif" font-size="30" font-weight="bold" fill="${color}">${score}</text>
    </svg>
    <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#666;margin-top:4px;">${label}</div>
  </td>`
}

function buildEmailHtml(
  firstName: string,
  reportHtml: string,
  archetype: string,
  mmScore: number,
  biqScore: number,
  subScores: Record<string, number> = {},
  phaseScores: Record<string, number> = {},
  logoDataUri: string = '',
  ageGroup: string = '',
): string {
  // Use 4-dimension phase scores for chart if available, else fall back to sub_scores
  const chartData = Object.keys(phaseScores).length >= 3 ? phaseScores : subScores
  const labels = Object.keys(chartData)
  const values = Object.values(chartData)
  const hasChart = labels.length >= 3
  const chartSvg = hasChart ? generateRadarSvg(labels, values) : ''

  const ageLabel = ageGroup === '13u' ? '13 & Under' : ageGroup === '14-17' ? '14 – 17' : ageGroup === '18plus' ? '18 +' : ageGroup


  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Your SMILE Zone Baseball Assessment</title>
<style>
  body { font-family: Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 0; }
  .wrapper { max-width: 600px; margin: 0 auto; background: #ffffff; }
  .header { background: #1a1a2e; color: #ffffff; padding: 32px 24px; text-align: center; }
  .header h1 { margin: 0; font-size: 24px; }
  .header p { margin: 8px 0 0; color: #a0a8d0; font-size: 14px; }
  .archetype-banner { background: #e8f0fe; border-left: 4px solid #1a1a2e; padding: 16px 24px; margin: 24px; border-radius: 4px; }
  .archetype-banner h2 { margin: 0; color: #1a1a2e; font-size: 20px; }
  .body { padding: 24px; color: #333333; line-height: 1.6; }
  .body h2 { color: #1a1a2e; }
  .body h3 { color: #3B9FE0; }
  .footer { background: #1a1a2e; color: #a0a8d0; text-align: center; padding: 24px; font-size: 12px; }
  .footer a { color: #a0a8d0; }
</style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      ${logoDataUri ? `<img src="${logoDataUri}" alt="SMILE Zone" style="height:72px;width:auto;margin:0 auto 16px;display:block;" />` : ''}
      <h1>SMILE Zone Baseball Assessment</h1>
      <p>Your personalized results are here, ${firstName}!</p>
    </div>

    <!-- Score rings -->
    <div style="background:#f8faff;padding:20px 24px 4px;text-align:center;border-bottom:1px solid #e8eaf0;">
      <p style="margin:0 0 8px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#999;">Performance Stats</p>
      <table cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;">
        <tr>
          ${scoreRingCell(mmScore, '#3B9FE0', 'rgba(59,159,224,0.15)', 'Mental Mindset')}
          ${scoreRingCell(biqScore, '#10b981', 'rgba(16,185,129,0.12)', 'Baseball IQ')}
        </tr>
      </table>
    </div>


    <div class="archetype-banner">
      <h2>You are: ${archetype}</h2>
      ${ageLabel ? `<p style="margin:6px 0 0;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#666;">Ages ${ageLabel}</p>` : ''}
    </div>

    ${hasChart ? `
    <div style="text-align:center;padding:8px 24px 0;">
      <p style="margin:0 0 4px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#999;">Skill Breakdown</p>
      ${chartSvg}
    </div>` : ''}

    <div class="body">
      ${reportHtml}
    </div>

    <!-- Join CTA -->
    <div style="background:linear-gradient(135deg,#1a1a2e 0%,#0d2347 100%);padding:36px 24px;text-align:center;">
      <p style="margin:0 0 6px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:3px;color:#9DD8F5;">Ready to level up?</p>
      <h2 style="margin:0 0 6px;font-size:26px;font-weight:900;color:#ffffff;letter-spacing:2px;">Join The S.M.I.L.E. Zone</h2>
      <p style="margin:0 0 20px;font-size:13px;color:rgba(255,255,255,0.6);">48-week program &middot; 4 phases &middot; mental performance</p>
      <a href="https://www.the-smile-zone.com/community" style="display:inline-block;background:#3B9FE0;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:100px;font-size:15px;font-weight:700;">Join the Community &rarr;</a>
    </div>

    <div class="footer">
      <p>You received this email because you completed the SMILE Zone Baseball Assessment.</p>
      <p><a href="https://www.the-smile-zone.com">www.the-smile-zone.com</a></p>
    </div>
  </div>
</body>
</html>`
}
