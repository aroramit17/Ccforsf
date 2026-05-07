const COLORS = {
  orange: '#DA7756',
  sfBlue: '#0176D3',
  bg: '#F6F2EA',
  textPrimary: '#1A1815',
  textSecondary: '#5A5348',
  border: 'rgba(26,24,21,0.09)',
}

function BrandMark() {
  return (
    <a
      href="/"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 12,
        letterSpacing: '0.06em',
        color: COLORS.textPrimary,
        textDecoration: 'none',
      }}
    >
      <span
        aria-hidden="true"
        style={{
          width: 22,
          height: 22,
          border: `1.5px solid ${COLORS.textPrimary}`,
          display: 'grid',
          placeItems: 'center',
          fontFamily: "'Bricolage Grotesque', serif",
          fontStyle: 'italic',
          fontSize: 13,
          fontWeight: 500,
          letterSpacing: 0,
          color: COLORS.textPrimary,
        }}
      >
        CC
      </span>
      <span>
        CC&nbsp;<span style={{ color: 'rgba(26,24,21,0.4)' }}>/</span>&nbsp;SF
      </span>
    </a>
  )
}

export default function BlogLayout({ children }) {
  return (
    <div style={{ background: COLORS.bg, minHeight: '100vh', color: COLORS.textPrimary }}>
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, padding: '0 20px', background: 'rgba(246,242,234,0.92)', backdropFilter: 'blur(16px)', borderBottom: `1px solid ${COLORS.border}` }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 56 }}>
          <BrandMark />
          <div style={{ display: 'flex', gap: 22, alignItems: 'center' }}>
            <a href="/blog" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600, color: COLORS.textSecondary, textDecoration: 'none' }}>Blog</a>
            <a href="/about" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600, color: COLORS.textSecondary, textDecoration: 'none' }}>About</a>
            <a href="/#pricing" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 800, color: '#fff', background: COLORS.orange, padding: '8px 16px', borderRadius: 8, textDecoration: 'none', letterSpacing: 0.3 }}>Get the course →</a>
          </div>
        </div>
      </nav>

      <main>{children}</main>

      <footer style={{ background: COLORS.bg, padding: '32px 20px', borderTop: `1px solid ${COLORS.border}`, marginTop: 80 }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <BrandMark />
          <div style={{ display: 'flex', gap: 20 }}>
            {[
              { label: 'Blog', href: '/blog' },
              { label: 'About', href: '/about' },
              { label: 'Terms', href: '/terms' },
              { label: 'Privacy', href: '/privacy' },
              { label: 'Refund Policy', href: '/refund' },
            ].map((item) => (
              <a key={item.href} href={item.href} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: 'rgba(26,24,21,0.5)', textDecoration: 'none' }}>{item.label}</a>
            ))}
          </div>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: 'rgba(26,24,21,0.35)' }}>© 2026 CC for SF</span>
        </div>
      </footer>
    </div>
  )
}
