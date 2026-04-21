const COLORS = {
  orange: '#DA7756',
  sfBlue: '#0176D3',
  bg: '#0a0a0a',
  textPrimary: '#f0f0f0',
  textSecondary: '#a0a0a0',
  border: 'rgba(255,255,255,0.08)',
}

function BrandMark() {
  return (
    <a href="/" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 15, fontWeight: 700, letterSpacing: 0.5, textDecoration: 'none' }}>
      <span style={{ color: COLORS.orange }}>cc</span>
      <span style={{ color: 'rgba(255,255,255,0.25)' }}>_</span>
      <span style={{ color: 'rgba(255,255,255,0.5)' }}>for</span>
      <span style={{ color: 'rgba(255,255,255,0.25)' }}>_</span>
      <span style={{ color: COLORS.sfBlue }}>sf</span>
      <span style={{ color: 'rgba(255,255,255,0.18)' }}>__c</span>
    </a>
  )
}

export default function BlogLayout({ children }) {
  return (
    <div style={{ background: COLORS.bg, minHeight: '100vh', color: COLORS.textPrimary }}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />

      <nav style={{ position: 'sticky', top: 0, zIndex: 100, padding: '0 20px', background: 'rgba(10,10,10,0.92)', backdropFilter: 'blur(16px)', borderBottom: `1px solid ${COLORS.border}` }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 56 }}>
          <BrandMark />
          <div style={{ display: 'flex', gap: 22, alignItems: 'center' }}>
            <a href="/blog" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600, color: COLORS.textSecondary, textDecoration: 'none' }}>Blog</a>
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
              { label: 'Terms', href: '/terms' },
              { label: 'Privacy', href: '/privacy' },
              { label: 'Refund Policy', href: '/refund' },
            ].map((item) => (
              <a key={item.href} href={item.href} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>{item.label}</a>
            ))}
          </div>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: 'rgba(255,255,255,0.12)' }}>© 2026 AI with Amit</span>
        </div>
      </footer>
    </div>
  )
}
