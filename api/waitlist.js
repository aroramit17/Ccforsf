import { sql } from '@vercel/postgres'
import { promises as dns } from 'node:dns'

// POST /api/waitlist  { name, email, role }
// Validates, blocks disposable-email services, checks the domain has MX
// records, then writes to Vercel Postgres (Neon).
//
// Requires POSTGRES_URL env var — auto-injected when a Postgres store is
// linked to the project in the Vercel dashboard (Storage → Create Database).

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Hand-curated inline list. Covers the high-volume throwaway services so
// we avoid depending on an npm package (which, as JSON-backed ESM, can
// silently fail to load at cold-start in Vercel's serverless runtime).
// Update this list in-repo when a new spam domain starts showing up.
const DISPOSABLE_DOMAINS = new Set([
  // yopmail + variants
  'yopmail.com', 'yopmail.net', 'yopmail.fr',
  // mailinator + aliases
  'mailinator.com', 'mailinator.net', 'mailinator.org', 'mailinator2.com',
  'binkmail.com', 'bobmail.info', 'chammy.info', 'devnullmail.com',
  'letthemeatspam.com', 'mailinater.com', 'mailinator.us', 'notmailinator.com',
  'reallymymail.com', 'sogetthis.com', 'spambooger.com', 'streetwisemail.com',
  'suremail.info', 'thisisnotmyrealemail.com', 'tradermail.info', 'veryrealemail.com',
  'zippymail.info',
  // guerrillamail family
  'guerrillamail.com', 'guerrillamail.net', 'guerrillamail.org', 'guerrillamail.biz',
  'guerrillamail.de', 'guerrillamailblock.com', 'sharklasers.com', 'spam4.me',
  'grr.la', 'pokemail.net',
  // 10minutemail family
  '10minutemail.com', '10minutemail.net', '10minutemail.org', '10minutemail.co.uk',
  '10minutemail.de', '10minutemail.us', '20minutemail.com', '30minutemail.com',
  // tempmail family
  'tempmail.com', 'tempmail.net', 'tempmail.org', 'tempmail.io', 'tempmail.plus',
  'tempmail.us.com', 'temp-mail.org', 'temp-mail.io', 'temp-mail.com',
  'tempmailo.com', 'tempmailer.com', 'tempmailer.de',
  // other well-known throwaway services
  'dispostable.com', 'fakeinbox.com', 'fake-mail.ml', 'fakemail.net',
  'maildrop.cc', 'trashmail.com', 'trashmail.net', 'trashmail.de',
  'trashmail.io', 'trashmail.me', 'trashmail.ws',
  'throwawaymail.com', 'throwaway.email',
  'getnada.com', 'nada.email', 'nada.ltd', 'inboxkitten.com',
  'emailondeck.com', 'mintemail.com', 'mt2014.com', 'mt2015.com',
  'spambox.us', 'spam.la', 'spamgourmet.com', 'spamex.com',
  'jetable.org', 'jetable.fr.nf', 'jetable.net',
  'mohmal.com', 'mailcatch.com', 'mailnesia.com', 'mailnull.com',
  'anonbox.net', 'deadaddress.com', 'dropmail.me',
  'mytemp.email', 'burnermail.io', 'burnermails.com',
  'fakemailgenerator.com', 'disposable.site',
  'emailfake.com', 'emailfake.ml', 'mailfake.com',
  'tempinbox.com', 'tempail.com', 'disposableinbox.com',
  'mvrht.com', 'mvrht.net', 'mailbox80.com', 'mailbox52.ga',
  'vinbox.com', 'snapmail.cc', 'moakt.com', 'moakt.cc', 'moakt.ws',
  'byebyemail.com', 'tmpeml.com', 'tmpmail.net', 'tmpmail.org',
])

async function hasMx(domain) {
  try {
    const records = await dns.resolveMx(domain)
    return Array.isArray(records) && records.length > 0
  } catch {
    return false
  }
}

export default async function handler(req, res) {
  // Top-level try/catch so any unexpected throw still returns JSON instead
  // of Vercel's default HTML 500 page (which the modal can't parse).
  try {
    if (req.method === 'OPTIONS') {
      res.setHeader('Access-Control-Allow-Origin', '*')
      res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
      return res.status(204).end()
    }
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed.' })
    }

    let body = req.body
    if (typeof body === 'string') {
      try { body = JSON.parse(body) } catch { return res.status(400).json({ error: 'Invalid JSON body.' }) }
    }

    const name = (body?.name || '').trim().slice(0, 200)
    const email = (body?.email || '').trim().toLowerCase().slice(0, 320)
    const role = (body?.role || '').trim().slice(0, 200) || null

    if (!name) return res.status(400).json({ error: 'Name is required.' })
    if (!EMAIL_RE.test(email)) return res.status(400).json({ error: 'Enter a valid email address.' })

    const domain = email.split('@')[1]
    if (DISPOSABLE_DOMAINS.has(domain)) {
      return res.status(400).json({ error: 'Disposable email services aren\u2019t allowed. Please use a work or personal email.' })
    }

    const mxOk = await hasMx(domain)
    if (!mxOk) {
      return res.status(400).json({ error: `We couldn\u2019t find mail servers for ${domain}. Double-check the address?` })
    }

    if (!process.env.POSTGRES_URL && !process.env.POSTGRES_PRISMA_URL && !process.env.DATABASE_URL) {
      console.error('[waitlist] no Postgres env vars set — link a database in Vercel Storage')
      return res.status(503).json({
        error: 'Waitlist database isn\u2019t wired up yet. The site owner needs to link a Postgres database in Vercel Storage.',
        code: 'db_not_configured',
      })
    }

    try {
      await sql`
        CREATE TABLE IF NOT EXISTS waitlist (
          id          SERIAL PRIMARY KEY,
          name        TEXT NOT NULL,
          email       TEXT NOT NULL UNIQUE,
          role        TEXT,
          created_at  TIMESTAMPTZ DEFAULT NOW()
        )
      `
      await sql`
        INSERT INTO waitlist (name, email, role)
        VALUES (${name}, ${email}, ${role})
        ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name, role = EXCLUDED.role
      `
      return res.status(200).json({ ok: true })
    } catch (err) {
      console.error('[waitlist] db write failed', err)
      const isProd = process.env.VERCEL_ENV === 'production'
      return res.status(500).json({
        error: isProd
          ? 'Something went wrong saving your info. Try again in a minute?'
          : `DB error: ${err?.message || 'unknown'}`,
      })
    }
  } catch (err) {
    // Catch-all for any throw outside the DB block (validation crashes,
    // unexpected runtime issues, etc.). Always return JSON.
    console.error('[waitlist] unexpected handler error', err)
    const isProd = process.env.VERCEL_ENV === 'production'
    return res.status(500).json({
      error: isProd
        ? 'Unexpected server error. Please try again.'
        : `Handler error: ${err?.message || 'unknown'}`,
    })
  }
}
