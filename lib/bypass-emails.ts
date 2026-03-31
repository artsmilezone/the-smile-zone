/**
 * Email addresses that bypass the 30-day assessment retake restriction.
 * Checked client-side (Assessment.tsx) and server-side (api/submit, api/check-retake).
 * Update this single file to add or remove bypass addresses.
 */
export const BYPASS_EMAILS = new Set([
  'art.zavalajr@gmail.com',
  'arturo@golegacyforward.com',
  'art@the-smile-zone.com',
  'jay@the-smile-zone.com',
  'edgar@the-smile-zone.com',
  'jayjackson87@gmail.com',
  'tony.zavala813@gmail.com',
])
