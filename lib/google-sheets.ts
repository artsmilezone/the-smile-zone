import { google } from 'googleapis'

// Sheet: https://docs.google.com/spreadsheets/d/1O2QdMrjmWGHxLi_65sq6r0nc8TU3rp2C__oyAqMRBPs
// Expected headers (row 1): Timestamp | Trigger | First Name | Email | Age Group | MM Score | BIQ Score | Archetype
const SPREADSHEET_ID = '1O2QdMrjmWGHxLi_65sq6r0nc8TU3rp2C__oyAqMRBPs'
const SHEET_RANGE = 'Sheet1!A:I'

function getAuthClient() {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON
  if (!raw) throw new Error('Missing GOOGLE_SERVICE_ACCOUNT_JSON env var.')
  let creds: Record<string, string>
  try {
    creds = JSON.parse(raw)
  } catch {
    throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON is not valid JSON.')
  }
  return new google.auth.JWT({
    email:  creds.client_email,
    key:    creds.private_key,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  })
}

/**
 * Appends a row when the Let's Talk contact form is submitted.
 * Trigger = "Let's Talk Form"
 */
export async function appendContactRow(
  name: string,
  email: string,
  message: string,
): Promise<void> {
  const auth = getAuthClient()
  const sheets = google.sheets({ version: 'v4', auth })
  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: SHEET_RANGE,
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [[
        new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }),
        "Let's Talk Form",
        name,
        email,
        '', '', '', // age_group, mm_score, biq_score
        '',         // archetype
        message,    // extra column for message
      ]],
    },
  })
}

/**
 * Appends a row when the contact form is submitted (before assessment processing).
 * Trigger = "Intake Form"
 */
export async function appendIntakeRow(
  firstName: string,
  email: string,
  ageGroup: string,
): Promise<void> {
  const auth = getAuthClient()
  const sheets = google.sheets({ version: 'v4', auth })
  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: SHEET_RANGE,
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [[
        new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }),
        'Intake Form',
        firstName,
        email,
        ageGroup,
        '',  // MM Score — not yet calculated
        '',  // BIQ Score — not yet calculated
        '',  // Archetype — not yet determined
      ]],
    },
  })
}

/**
 * Appends a row after the full assessment is processed and results are ready.
 * Trigger = "Assessment Complete"
 */
export async function appendAssessmentRow(
  firstName: string,
  email: string,
  ageGroup: string,
  mmScore: number,
  biqScore: number,
  archetype: string,
): Promise<void> {
  const auth = getAuthClient()
  const sheets = google.sheets({ version: 'v4', auth })
  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: SHEET_RANGE,
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [[
        new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }),
        'Assessment Complete',
        firstName,
        email,
        ageGroup,
        mmScore,
        biqScore,
        archetype,
      ]],
    },
  })
}
