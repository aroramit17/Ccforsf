import { useState } from 'react'

const COLORS = {
  orange: '#DA7756',
  orangeHover: '#C4613F',
  surface2: '#1a1a1a',
  textPrimary: '#f0f0f0',
  textSecondary: '#a0a0a0',
  border: 'rgba(255,255,255,0.08)',
}

export default function NewsletterCTA() {
  const [email, setEmail] = useState('')
  const [hover, setHover] = useState(false)

  // TODO: replace with ESP form action once chosen (ConvertKit / Beehiiv / Loops)
  const onSubmit = (e) => {
    e.preventDefault()
    if (!email) return
    window.location.href = `mailto:support@ccforsf.com?subject=Subscribe%20me&body=${encodeURIComponent(email)}`
  }

  return (
    <div style={{ marginTop: 56, padding: '32px 28px', background: COLORS.surface2, border: `1px solid ${COLORS.border}`, borderRadius: 12 }}>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600, letterSpacing: 2.5, color: COLORS.orange, textTransform: 'uppercase', marginBottom: 10 }}>
        Newsletter
      </div>
      <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 22, fontWeight: 800, color: COLORS.textPrimary, lineHeight: 1.2, marginBottom: 8, letterSpacing: -0.3 }}>
        Get new posts in your inbox.
      </h3>
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14.5, color: COLORS.textSecondary, lineHeight: 1.6, marginBottom: 18 }}>
        One short email when a new tutorial drops. Unsubscribe anytime.
      </p>
      <form onSubmit={onSubmit} style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <input
          type="email"
          required
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            flex: '1 1 220px',
            padding: '12px 14px',
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 14,
            background: '#0a0a0a',
            border: `1px solid ${COLORS.border}`,
            borderRadius: 8,
            color: COLORS.textPrimary,
            outline: 'none',
          }}
        />
        <button
          type="submit"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          style={{
            padding: '12px 22px',
            background: hover ? COLORS.orangeHover : COLORS.orange,
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 800,
            fontFamily: "'DM Sans', sans-serif",
            cursor: 'pointer',
            letterSpacing: 0.3,
            transition: 'background 0.2s',
          }}
        >
          Subscribe
        </button>
      </form>
    </div>
  )
}
