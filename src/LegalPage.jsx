const COLORS = {
  orange: "#DA7756",
  sfBlue: "#0176D3",
  bg: "#F6F2EA",
  surface: "#FFFFFF",
  surface2: "#FAF6EC",
  textPrimary: "#1A1815",
  textSecondary: "#5A5348",
  textMuted: "#8A8272",
  border: "rgba(26,24,21,0.09)",
};

export default function LegalPage({ title, lastUpdated, children }) {
  return (
    <div style={{ background: COLORS.bg, minHeight: "100vh", color: COLORS.textPrimary, fontFamily: "'DM Sans', sans-serif" }}>
      <nav style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(10,10,10,0.92)", backdropFilter: "blur(16px)", borderBottom: `1px solid ${COLORS.border}`, padding: "0 20px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", height: 56 }}>
          <a href="/" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 15, fontWeight: 700, letterSpacing: 0.5, textDecoration: "none" }}>
            <span style={{ color: COLORS.orange }}>cc</span>
            <span style={{ color: "rgba(255,255,255,0.25)" }}>_</span>
            <span style={{ color: "rgba(255,255,255,0.5)" }}>for</span>
            <span style={{ color: "rgba(255,255,255,0.25)" }}>_</span>
            <span style={{ color: COLORS.sfBlue }}>sf</span>
            <span style={{ color: "rgba(255,255,255,0.18)" }}>__c</span>
          </a>
          <a href="/" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: COLORS.textSecondary, textDecoration: "none" }}>← Back to home</a>
        </div>
      </nav>

      <main style={{ maxWidth: 760, margin: "0 auto", padding: "64px 20px 96px" }}>
        <h1 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: "clamp(32px, 5vw, 44px)", fontWeight: 800, color: "#fff", lineHeight: 1.15, letterSpacing: -0.5, marginBottom: 12 }}>{title}</h1>
        {lastUpdated && (
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: COLORS.textMuted, marginBottom: 48 }}>Last updated: {lastUpdated}</p>
        )}

        <div className="legal-content" style={{ fontSize: 15.5, lineHeight: 1.75, color: COLORS.textSecondary }}>
          {children}
        </div>
      </main>

      <footer style={{ background: COLORS.bg, padding: "32px 20px", borderTop: `1px solid ${COLORS.border}` }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 700 }}>
            <span style={{ color: COLORS.orange }}>cc</span>
            <span style={{ color: "rgba(255,255,255,0.2)" }}>_</span>
            <span style={{ color: "rgba(255,255,255,0.35)" }}>for</span>
            <span style={{ color: "rgba(255,255,255,0.2)" }}>_</span>
            <span style={{ color: COLORS.sfBlue }}>sf</span>
            <span style={{ color: "rgba(255,255,255,0.12)" }}>__c</span>
          </div>
          <div style={{ display: "flex", gap: 20 }}>
            <a href="/terms" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>Terms</a>
            <a href="/privacy" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>Privacy</a>
            <a href="/refund" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>Refund</a>
          </div>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.25)" }}>© 2026 CC for SF</span>
        </div>
      </footer>

      <style>{`
        .legal-content h2 {
          font-family: 'Bricolage Grotesque', sans-serif;
          font-size: 22px;
          font-weight: 700;
          color: ${COLORS.textPrimary};
          margin-top: 48px;
          margin-bottom: 16px;
          letter-spacing: -0.3px;
        }
        .legal-content h3 {
          font-family: 'Bricolage Grotesque', sans-serif;
          font-size: 17px;
          font-weight: 700;
          color: ${COLORS.textPrimary};
          margin-top: 28px;
          margin-bottom: 10px;
        }
        .legal-content p { margin: 0 0 18px; }
        .legal-content ul { margin: 0 0 18px; padding-left: 22px; }
        .legal-content li { margin-bottom: 8px; }
        .legal-content strong { color: ${COLORS.textPrimary}; font-weight: 600; }
        .legal-content a { color: ${COLORS.orange}; text-decoration: underline; }
        .legal-content hr { border: none; border-top: 1px solid ${COLORS.border}; margin: 40px 0; }
      `}</style>
    </div>
  );
}
