import { useEffect, useRef, useState } from 'react'

const COLORS = {
  orange: '#DA7756',
  orangeHover: '#C4613F',
  green: '#22C55E',
  bg: '#F6F2EA',
  surface: '#FFFFFF',
  surface2: '#FAF6EC',
  textPrimary: '#1A1815',
  textSecondary: '#5A5348',
  textMuted: '#8A8272',
  border: 'rgba(26,24,21,0.09)',
}

const EVENT = 'ccforsf:openWaitlist'

export function openWaitlist() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(EVENT))
  }
}

export default function WaitlistModal() {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('')
  const [status, setStatus] = useState('idle') // idle | submitting | success | error
  const [errMsg, setErrMsg] = useState('')
  const firstFieldRef = useRef(null)

  useEffect(() => {
    const handler = () => {
      setOpen(true)
      setStatus('idle')
      setErrMsg('')
    }
    window.addEventListener(EVENT, handler)
    return () => window.removeEventListener(EVENT, handler)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    const t = setTimeout(() => firstFieldRef.current?.focus(), 40)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      clearTimeout(t)
    }
  }, [open])

  if (!open) return null

  const close = () => setOpen(false)
  const onSubmit = async (e) => {
    e.preventDefault()
    if (status === 'submitting') return
    setStatus('submitting')
    setErrMsg('')
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, role }),
      })
      let data = null
      try { data = await res.json() } catch { /* non-JSON response */ }
      if (!res.ok) {
        if (data?.error) throw new Error(data.error)
        throw new Error(`Unexpected server response (HTTP ${res.status}). Please try again or email support@ccforsf.com.`)
      }
      setStatus('success')
    } catch (err) {
      setStatus('error')
      setErrMsg(err.message || 'Network error. Check your connection and try again.')
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="waitlist-title"
      onClick={close}
      style={{
        position: 'fixed', inset: 0, zIndex: 500,
        background: 'rgba(5,5,8,0.78)',
        backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px',
        animation: 'waitlistFadeIn 0.2s ease both',
      }}
    >
      <style>{`
        @keyframes waitlistFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes waitlistPop { from { opacity: 0; transform: translateY(10px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
        .waitlist-input { width: 100%; padding: 12px 14px; font-family: 'DM Sans', sans-serif; font-size: 14.5px; background: #0a0a0a; border: 1px solid ${COLORS.border}; border-radius: 8px; color: ${COLORS.textPrimary}; outline: none; transition: border-color 0.15s; }
        .waitlist-input:focus { border-color: ${COLORS.orange}; }
        .waitlist-input::placeholder { color: ${COLORS.textMuted}; }
      `}</style>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 440,
          background: COLORS.surface,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 16,
          padding: '28px 28px 24px',
          boxShadow: '0 40px 100px rgba(0,0,0,0.6), 0 0 0 1px rgba(218,119,86,0.15)',
          animation: 'waitlistPop 0.24s cubic-bezier(0.2, 0.8, 0.2, 1) both',
          position: 'relative',
        }}
      >
        <button
          onClick={close}
          aria-label="Close"
          style={{
            position: 'absolute', top: 14, right: 14,
            width: 32, height: 32,
            background: 'transparent', border: 'none', color: COLORS.textMuted,
            fontSize: 22, lineHeight: 1, cursor: 'pointer', borderRadius: 6,
          }}
        >×</button>

        {status !== 'success' ? (
          <>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 700, letterSpacing: 2.5, color: COLORS.orange, textTransform: 'uppercase', marginBottom: 10 }}>
              Early Access
            </div>
            <h2 id="waitlist-title" style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 26, fontWeight: 800, color: COLORS.textPrimary, lineHeight: 1.15, marginBottom: 8, letterSpacing: -0.4 }}>
              Join the waitlist.
            </h2>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14.5, color: COLORS.textSecondary, lineHeight: 1.55, marginBottom: 20 }}>
              CC for SF opens to the first cohort soon. Drop your info and you'll get the enrollment link before public launch.
            </p>

            <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label htmlFor="wl-name" style={{ display: 'block', fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600, color: COLORS.textSecondary, marginBottom: 6, letterSpacing: 0.3 }}>Full name</label>
                <input ref={firstFieldRef} id="wl-name" className="waitlist-input" type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Amit Arora" />
              </div>
              <div>
                <label htmlFor="wl-email" style={{ display: 'block', fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600, color: COLORS.textSecondary, marginBottom: 6, letterSpacing: 0.3 }}>Email</label>
                <input id="wl-email" className="waitlist-input" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" />
              </div>
              <div>
                <label htmlFor="wl-role" style={{ display: 'block', fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600, color: COLORS.textSecondary, marginBottom: 6, letterSpacing: 0.3 }}>Current role</label>
                <input id="wl-role" className="waitlist-input" type="text" value={role} onChange={(e) => setRole(e.target.value)} placeholder="Salesforce Admin at Acme" />
              </div>

              {status === 'error' && (
                <div style={{ padding: '10px 12px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: '#FCA5A5' }}>
                  {errMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={status === 'submitting'}
                style={{
                  marginTop: 6,
                  padding: '14px 20px',
                  background: status === 'submitting' ? COLORS.orangeHover : COLORS.orange,
                  color: '#fff',
                  border: 'none',
                  borderRadius: 8,
                  fontSize: 15,
                  fontWeight: 800,
                  fontFamily: "'DM Sans', sans-serif",
                  cursor: status === 'submitting' ? 'wait' : 'pointer',
                  letterSpacing: 0.3,
                  transition: 'background 0.2s',
                  opacity: status === 'submitting' ? 0.8 : 1,
                }}
              >
                {status === 'submitting' ? 'Submitting…' : 'Join waitlist →'}
              </button>

              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11.5, color: COLORS.textMuted, textAlign: 'center', margin: '6px 0 0', lineHeight: 1.5 }}>
                One email at launch. No newsletter spam. Unsubscribe anytime.
              </p>
            </form>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '12px 0 6px' }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px', color: COLORS.green, fontSize: 28, fontWeight: 800 }}>✓</div>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 24, fontWeight: 800, color: COLORS.textPrimary, marginBottom: 10, letterSpacing: -0.3 }}>You're on the list.</h2>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14.5, color: COLORS.textSecondary, lineHeight: 1.6, marginBottom: 22 }}>
              We'll send the enrollment link to <strong style={{ color: COLORS.textPrimary }}>{email}</strong> before public launch.
            </p>
            <button
              onClick={close}
              style={{ padding: '10px 22px', background: 'transparent', border: `1px solid ${COLORS.border}`, color: COLORS.textSecondary, borderRadius: 8, fontSize: 14, fontWeight: 600, fontFamily: "'DM Sans', sans-serif", cursor: 'pointer' }}
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
