import sanitizeHtml from 'sanitize-html'

/**
 * Sanitize Claude-generated HTML before storing to Supabase or returning to the client.
 * Uses sanitize-html (pure Node.js, no jsdom) to avoid ESM compatibility issues in Vercel.
 */
export function sanitizeReportHtml(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: ['h1', 'h2', 'h3', 'h4', 'p', 'ul', 'ol', 'li', 'strong', 'em', 'b', 'i', 'br', 'a', 'div', 'span'],
    allowedAttributes: {
      '*': ['class', 'title'],
      'a': ['href'],
    },
  })
}
