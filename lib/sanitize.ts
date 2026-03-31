import DOMPurify from 'isomorphic-dompurify'

const ALLOWED_TAGS = [
  'h1', 'h2', 'h3', 'h4',
  'p',
  'ul', 'ol', 'li',
  'strong', 'em', 'b', 'i',
  'br',
  'a',
  'div',
  'span',
]

const ALLOWED_ATTR = ['href', 'title', 'class']

/**
 * Sanitize Claude-generated HTML before storing to Supabase or returning to the client.
 * Matches the wp_kses allowlist used in the original PHP plugin.
 */
export function sanitizeReportHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    FORCE_BODY: false,
  })
}
