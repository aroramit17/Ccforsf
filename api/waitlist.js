import { sql } from '@vercel/postgres'
import disposableDomains from 'disposable-email-domains'
import { promises as dns } from 'node:dns'

// POST /api/waitlist  { name, email, role }
// Validates, blocks disposable-email services, checks the domain has MX
// records, then writes to Vercel Postgres (Neon).
//
// Requires POSTGRES_URL env var — auto-injected when a Postgres store is
// linked to the project in the Vercel dashboard (Storage → Create Database).
// If POSTGRES_URL is missing we return a 503 with a clear message so the
// setup gap is obvious instead of showing as a generic 500.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const DISPOSABLE = new Set(disposableDomains)

async function hasMx(domain) {
  try {
    const records = await dns.resolveMx(domain)
    return Array.isArray(records) && records.length > 0
  } catch {
    return false
  }
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    return res.status(204).end()
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'method not allowed' })
  }

  let body = req.body
  if (typeof body === 'string') {
    try { body = JSON.parse(body) } catch { return res.status(400).json({ error: 'invalid JSON body' }) }
  }

  const name = (body?.name || '').trim().slice(0, 200)
  const email = (body?.email || '').trim().toLowerCase().slice(0, 320)
  const role = (body?.role || '').trim().slice(0, 200) || null

  if (!name) return res.status(400).json({ error: 'Name is required.' })
  if (!EMAIL_RE.test(email)) return res.status(400).json({ error: 'Enter a valid email address.' })

  const domain = email.split('@')[1]
  if (DISPOSABLE.has(domain)) {
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
    // Surface the error message in preview / development so you can see
    // the actual DB issue. In production, keep it generic.
    const isProd = process.env.VERCEL_ENV === 'production'
    return res.status(500).json({
      error: isProd
        ? 'Something went wrong saving your info. Try again in a minute?'
        : `DB error: ${err?.message || 'unknown'}`,
    })
  }
}
