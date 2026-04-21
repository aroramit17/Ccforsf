import { sql } from '@vercel/postgres'

// POST /api/waitlist  { name, email, role }
// Writes to Vercel Postgres (Neon under the hood).
// Requires POSTGRES_URL env var — auto-injected when a Postgres
// store is linked to the project in the Vercel dashboard.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

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
    try { body = JSON.parse(body) } catch { return res.status(400).json({ error: 'invalid json' }) }
  }

  const name = (body?.name || '').trim().slice(0, 200)
  const email = (body?.email || '').trim().toLowerCase().slice(0, 320)
  const role = (body?.role || '').trim().slice(0, 200) || null

  if (!name) return res.status(400).json({ error: 'name required' })
  if (!EMAIL_RE.test(email)) return res.status(400).json({ error: 'valid email required' })

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
    console.error('[waitlist] insert failed', err)
    return res.status(500).json({ error: 'server error' })
  }
}
