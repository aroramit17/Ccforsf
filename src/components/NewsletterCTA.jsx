import { useState } from 'react'

const COLORS = {
  orange: '#DA7756',
  orangeHover: '#C4613F',
  surface2: '#FAF6EC',
  inputBg: '#FFFFFF',
  textPrimary: '#1A1815',
  textSecondary: '#5A5348',
  border: 'rgba(26,24,21,0.18)',
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
      <style>{`
        .ccsf-newsletter-input {
          flex: 1 1 220px;
          padding: 12px 14px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          background: ${COLORS.inputBg};
          border: 1px solid ${COLORS.border};
          border-radius: 8px;
          color: ${COLORS.textPrimary};
          outline: none;
        }
        .ccsf-newsletter-input::placeholder { color: ${COLORS.textSecondary}; opacity: 0.7; }
        .ccsf-newsletter-input:focus-visible {
          border-color: ${COLORS.orange};
          box-shadow: 0 0 0 3px rgba(218,119,86,0.35);
        }
        .ccsf-newsletter-btn:focus-visible {
          outline: 3px solid rgba(218,119,86,0.55);
          outline-offset: 2px;
        }
        .ccsf-newsletter-label {
          position: absolute;
          width: 1px; height: 1px;
          padding: 0; margin: -1px; overflow: hidden;
          clip: rect(0,0,0,0); white-space: nowrap; border: 0;
        }
      `}</style>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600, letterSpacing: 2.5, color: COLORS.orange, textTransform: 'uppercase', marginBottom: 10 }}>
        Newsletter
      </div>
      <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 22, fontWeight: 800, color: COLORS.textPrimary, lineHeight: 1.2, marginBottom: 8, letterSpacing: -0.3 }}>
        Get new posts in your inbox.
      </h3>
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14.5, color: COLORS.textSecondary, lineHeight: 1.6, marginBottom: 18 }}>
        One short email when a new tutorial drops. Unsubscribe anytime.
      </p>
      <form onSubmit={onSubmit} style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }} aria-label="Subscribe to the CC for SF newsletter">
        <label htmlFor="ccsf-newsletter-email" className="ccsf-newsletter-label">Email address</label>
        <input
          id="ccsf-newsletter-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@company.com"
          aria-label="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="ccsf-newsletter-input"
        />
        <button
          type="submit"
          className="ccsf-newsletter-btn"
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
