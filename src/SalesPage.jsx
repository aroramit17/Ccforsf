import { useState, useEffect, useRef } from "react";

const COLORS = {
  orange: "#DA7756",
  orangeHover: "#C4613F",
  orangeGlow: "rgba(218,119,86,0.3)",
  sfBlue: "#0176D3",
  green: "#22C55E",
  gold: "#FFB347",
  bg: "#0a0a0a",
  surface: "#111111",
  surface2: "#1a1a1a",
  surface3: "#222222",
  textPrimary: "#f0f0f0",
  textSecondary: "#a0a0a0",
  textMuted: "#666666",
  border: "rgba(255,255,255,0.08)",
  borderHover: "rgba(218,119,86,0.4)",
};

/* ── hooks ── */
function useInView(threshold = 0.12) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.unobserve(el); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

/* ── reusable atoms ── */
function Section({ children, id, style = {}, maxWidth = 900 }) {
  const [ref, visible] = useInView(0.06);
  return (
    <section ref={ref} id={id} style={{ padding: "80px 20px", transition: "opacity 0.7s ease, transform 0.7s ease", opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(30px)", position: "relative", ...style }}>
      <div style={{ maxWidth, margin: "0 auto" }}>{children}</div>
    </section>
  );
}

function SectionLabel({ children }) {
  return <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600, letterSpacing: 2.5, color: COLORS.orange, textTransform: "uppercase", marginBottom: 10 }}>{children}</div>;
}

function H2({ children, center, light }) {
  return <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: "clamp(26px, 5vw, 42px)", fontWeight: 800, color: light ? COLORS.textPrimary : COLORS.textPrimary, lineHeight: 1.15, marginBottom: 16, textAlign: center ? "center" : "left", letterSpacing: -0.5 }}>{children}</h2>;
}

function SubText({ children, center }) {
  return <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, lineHeight: 1.7, color: COLORS.textSecondary, marginBottom: 16, textAlign: center ? "center" : "left" }}>{children}</p>;
}

function CTAButton({ children, large, full, onClick }) {
  const [hover, setHover] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, padding: large ? "18px 44px" : "14px 32px", width: full ? "100%" : "auto", background: hover ? COLORS.orangeHover : COLORS.orange, color: "#fff", border: "none", borderRadius: 8, fontSize: large ? 17 : 15, fontWeight: 800, fontFamily: "'DM Sans', sans-serif", cursor: "pointer", transition: "all 0.25s ease", transform: hover ? "translateY(-2px)" : "translateY(0)", boxShadow: hover ? `0 8px 32px ${COLORS.orangeGlow}` : `0 4px 16px rgba(218,119,86,0.2)`, letterSpacing: 0.3 }}>
      {children} <span style={{ fontSize: large ? 20 : 17 }}>→</span>
    </button>
  );
}

function CheckItem({ children }) {
  return (
    <div style={{ display: "flex", gap: 12, marginBottom: 14, alignItems: "flex-start" }}>
      <span style={{ color: COLORS.green, fontSize: 15, fontWeight: 700, marginTop: 1 }}>✓</span>
      <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, lineHeight: 1.6, color: COLORS.textPrimary }}>{children}</span>
    </div>
  );
}

function Stars() {
  return <div style={{ display: "flex", gap: 2, marginBottom: 10 }}>{[...Array(5)].map((_, i) => <span key={i} style={{ color: COLORS.gold, fontSize: 13 }}>★</span>)}</div>;
}

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: `1px solid ${COLORS.border}`, cursor: "pointer" }} onClick={() => setOpen(!open)}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 0" }}>
        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15.5, fontWeight: 600, color: COLORS.textPrimary, paddingRight: 16 }}>{q}</span>
        <span style={{ fontSize: 18, color: COLORS.orange, fontWeight: 400, transition: "transform 0.3s", transform: open ? "rotate(180deg)" : "rotate(0)", flexShrink: 0 }}>▾</span>
      </div>
      <div style={{ maxHeight: open ? 400 : 0, overflow: "hidden", transition: "max-height 0.3s ease" }}>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14.5, color: COLORS.textSecondary, lineHeight: 1.7, margin: "0 0 18px", paddingRight: 40 }}>{a}</p>
      </div>
    </div>
  );
}

/* ── keyframes injected via style tag ── */
function GlobalStyles() {
  return (
    <style>{`
      @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
      @keyframes marquee { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
      @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
      @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
      * { margin:0; padding:0; box-sizing:border-box; }
      body { background:${COLORS.bg}; }
      ::selection { background:${COLORS.orange}; color:#fff; }
    `}</style>
  );
}

/* ══════════════════════════ MAIN PAGE ══════════════════════════ */
export default function SalesPage() {
  const [scrollY, setScrollY] = useState(0);
  const [showUrgency, setShowUrgency] = useState(true);

  useEffect(() => {
    const h = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <div style={{ background: COLORS.bg, minHeight: "100vh", overflowX: "hidden", color: COLORS.textPrimary }}>
      <GlobalStyles />
      <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;600;700;800&family=DM+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet" />

      {/* ── URGENCY BAR ── */}
      {showUrgency && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 200, background: COLORS.orange, padding: "10px 20px", display: "flex", justifyContent: "center", alignItems: "center", gap: 8 }}>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 700, color: "#fff", textAlign: "center" }}>
            Launch pricing: <span style={{ textDecoration: "line-through", opacity: 0.7 }}>$197</span> → <strong>$97</strong> — one-time, lifetime access. Price goes up soon.
          </span>
          <button onClick={() => setShowUrgency(false)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.7)", cursor: "pointer", fontSize: 16, marginLeft: 12, padding: "0 4px" }}>×</button>
        </div>
      )}

      {/* ── NAV ── */}
      <nav style={{ position: "fixed", top: showUrgency ? 37 : 0, left: 0, right: 0, zIndex: 150, padding: "0 20px", background: scrollY > 50 ? "rgba(10,10,10,0.92)" : "transparent", backdropFilter: scrollY > 50 ? "blur(16px)" : "none", transition: "all 0.4s ease", borderBottom: scrollY > 50 ? `1px solid ${COLORS.border}` : "none" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", height: 56 }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 15, fontWeight: 700, letterSpacing: 0.5 }}>
            <span style={{ color: COLORS.orange }}>cc</span>
            <span style={{ color: "rgba(255,255,255,0.25)" }}>_</span>
            <span style={{ color: "rgba(255,255,255,0.5)" }}>for</span>
            <span style={{ color: "rgba(255,255,255,0.25)" }}>_</span>
            <span style={{ color: COLORS.sfBlue }}>sf</span>
            <span style={{ color: "rgba(255,255,255,0.18)" }}>__c</span>
          </div>
          <CTAButton>Get Access</CTAButton>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ padding: showUrgency ? "140px 20px 56px" : "110px 20px 56px", position: "relative", overflow: "hidden" }}>
        {/* noise texture */}
        <div style={{ position: "absolute", inset: 0, opacity: 0.03, backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")", backgroundSize: "128px 128px" }} />
        {/* glow orbs */}
        <div style={{ position: "absolute", top: "10%", left: "50%", transform: "translateX(-50%)", width: 600, height: 600, background: `radial-gradient(circle, rgba(218,119,86,0.12) 0%, transparent 65%)`, borderRadius: "50%", filter: "blur(60px)" }} />
        <div style={{ position: "absolute", top: "40%", right: "-10%", width: 300, height: 300, background: `radial-gradient(circle, rgba(1,118,211,0.1) 0%, transparent 70%)`, borderRadius: "50%", filter: "blur(50px)" }} />

        <div style={{ maxWidth: 760, margin: "0 auto", position: "relative", zIndex: 2, textAlign: "center" }}>
          {/* blinking badge */}
          <div style={{ animation: "fadeUp 0.5s ease both", display: "inline-flex", alignItems: "center", gap: 8, background: COLORS.surface2, border: `1px solid ${COLORS.border}`, borderRadius: 100, padding: "8px 18px", marginBottom: 24 }}>
            <span style={{ color: COLORS.green, fontSize: 8, animation: "blink 1.4s infinite" }}>●</span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: COLORS.textSecondary }}>CLAUDE CODE x SALESFORCE</span>
          </div>

          <h1 style={{ animation: "fadeUp 0.6s ease both", animationDelay: "0.1s", fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: "clamp(34px, 6.5vw, 58px)", fontWeight: 800, color: "#FFFFFF", lineHeight: 1.08, marginBottom: 24, letterSpacing: -1 }}>
            Build complex Flows 10x faster
            <br />
            <span style={{ color: COLORS.orange }}>without touching a single button.</span>
          </h1>

          <p style={{ animation: "fadeUp 0.6s ease both", animationDelay: "0.2s", fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(16px, 2.5vw, 19px)", color: COLORS.textSecondary, lineHeight: 1.6, maxWidth: 520, margin: "0 auto 16px" }}>
            Stop clicking. Start prompting.
          </p>
          <p style={{ animation: "fadeUp 0.6s ease both", animationDelay: "0.3s", fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(14px, 2vw, 16px)", color: COLORS.textMuted, lineHeight: 1.6, maxWidth: 500, margin: "0 auto 28px" }}>
            Side hustle. More time with family. Both. Learn to use Claude Code to build Flows, create fields, write Apex, and deploy it all from your terminal. No coding needed.
          </p>

          {/* social proof badge */}
          <div style={{ animation: "fadeUp 0.6s ease both", animationDelay: "0.35s", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 32 }}>
            <div style={{ display: "flex", gap: 2 }}>{[...Array(5)].map((_, i) => <span key={i} style={{ color: COLORS.gold, fontSize: 15 }}>★</span>)}</div>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600, color: COLORS.textSecondary }}>Join 50+ Salesforce Admins</span>
          </div>

          {/* pricing + CTA */}
          <div style={{ animation: "fadeUp 0.6s ease both", animationDelay: "0.4s", marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 20 }}>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 20, color: COLORS.textMuted, textDecoration: "line-through" }}>$197</span>
              <span style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 44, fontWeight: 800, color: "#fff", letterSpacing: -2 }}>$97</span>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 700, color: COLORS.green, background: `rgba(34,197,94,0.12)`, padding: "4px 10px", borderRadius: 100 }}>SAVE 50%</span>
            </div>
            <div style={{ maxWidth: 400, margin: "0 auto" }}>
              <CTAButton large full>Get Instant Access - $97</CTAButton>
            </div>
          </div>

          {/* trust row */}
          <div style={{ animation: "fadeUp 0.6s ease both", animationDelay: "0.5s", display: "flex", justifyContent: "center", gap: 24, flexWrap: "wrap" }}>
            {["∞ Lifetime Access", "Video Modules", "7-Day Guarantee"].map((t, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ color: COLORS.green, fontSize: 12 }}>✓</span>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: COLORS.textMuted }}>{t}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS STRIP ── */}
      <div style={{ borderTop: `1px solid ${COLORS.border}`, borderBottom: `1px solid ${COLORS.border}`, padding: "0 20px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(3, 1fr)" }}>
          {[
            ["$17/mo", "Claude Code cost"],
            ["5 min", "To deploy your first Flow"],
            ["0 lines", "Of code you need to write"],
          ].map(([num, label], i) => (
            <div key={i} style={{ padding: "28px 20px", textAlign: "center", borderRight: i < 2 ? `1px solid ${COLORS.border}` : "none" }}>
              <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 28, fontWeight: 800, color: COLORS.orange, marginBottom: 4 }}>{num}</div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: COLORS.textMuted }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── TOOLS MARQUEE ── */}
      <div style={{ padding: "40px 0", overflow: "hidden", position: "relative" }}>
        {/* fade edges */}
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 80, background: `linear-gradient(90deg, ${COLORS.bg}, transparent)`, zIndex: 2 }} />
        <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 80, background: `linear-gradient(270deg, ${COLORS.bg}, transparent)`, zIndex: 2 }} />
        <div style={{ display: "flex", animation: "marquee 30s linear infinite", width: "max-content" }}>
          {[...Array(2)].map((_, setIdx) => (
            <div key={setIdx} style={{ display: "flex", gap: 12, paddingRight: 12 }}>
              {["Flows", "Apex Triggers", "Validation Rules", "Custom Fields", "Permission Sets", "Page Layouts", "LWC", "SOQL Queries", "Quick Actions", "Record-Triggered Flows", "Screen Flows", "Approval Processes"].map((tool, i) => (
                <div key={i} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: COLORS.textMuted, background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "10px 20px", whiteSpace: "nowrap", display: "flex", alignItems: "center", height: 42 }}>
                  {tool}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ── PROBLEM (2×2 grid) ── */}
      <Section style={{ background: COLORS.bg }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <SectionLabel>The Problem</SectionLabel>
          <H2 center>You know Salesforce. You just can't move fast enough.</H2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
          {[
            { icon: "🖱️", title: "Death by clicks", desc: "Creating a custom field means 15 clicks. Then the page layout. Then the permission set. Then the profile. For one field." },
            { icon: "⏳", title: "Waiting on developers", desc: "You know the business logic better than anyone. But you're filing Jira tickets and waiting two weeks for someone else to build it." },
            { icon: "🔍", title: "Googling syntax", desc: "You know exactly what the validation rule should do. But you're still searching for the right formula, testing in sandbox, hoping nothing breaks." },
            { icon: "📋", title: "Backlog is growing", desc: "Leadership keeps asking what's taking so long. The admin who figured out AI tools is shipping twice as fast. You can feel the gap widening." },
          ].map((item, i) => (
            <ProblemCard key={i} {...item} />
          ))}
        </div>
      </Section>

      {/* ── AGITATE ── */}
      <Section style={{ background: COLORS.surface }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <SectionLabel>Sound Familiar?</SectionLabel>
          <H2>I used to be scared of Flows.</H2>
          <SubText>Real talk. Flows terrified me. The canvas, the decision elements, the loops. I'd stare at it for 20 minutes and still not know where to start.</SubText>
          <SubText>Then LLMs came along and I thought okay, this changes everything. And it did help. I could ask ChatGPT how to build a flow and get step-by-step directions.</SubText>
          <SubText>But here's the thing nobody talks about. Reading those directions, building it click by click, troubleshooting when something broke... that still took hours. I was getting the right answers. I just couldn't move fast enough to implement them.</SubText>
          <div style={{ background: COLORS.surface2, borderRadius: 12, padding: "24px 28px", borderLeft: `3px solid ${COLORS.orange}`, marginTop: 28 }}>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, lineHeight: 1.7, color: COLORS.textPrimary, margin: 0, fontWeight: 500 }}>
              Now I just tell Claude to build the flow. It goes into my org, creates it, and deploys it. All I do is go check that it works. What used to take me an afternoon takes 5 minutes.
            </p>
          </div>
        </div>
      </Section>

      {/* ── INSTRUCTOR (A Note From Amit) ── */}
      <Section style={{ background: COLORS.bg }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <div style={{ display: "flex", gap: 28, alignItems: "flex-start", flexWrap: "wrap" }}>
            <div style={{ width: 88, height: 88, borderRadius: 16, background: `linear-gradient(135deg, ${COLORS.sfBlue}, ${COLORS.orange})`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span style={{ fontSize: 36, color: "#fff", fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800 }}>A</span>
            </div>
            <div style={{ flex: 1, minWidth: 240 }}>
              <SectionLabel>A Note From Amit</SectionLabel>
              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 24, fontWeight: 700, color: COLORS.textPrimary, marginBottom: 4 }}>Amit</h3>
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: COLORS.orange, marginBottom: 6 }}>8x Salesforce Certified · GTM Engineer · AI Tools Builder</p>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: `rgba(1,118,211,0.1)`, border: `1px solid rgba(1,118,211,0.2)`, borderRadius: 100, padding: "4px 12px", marginBottom: 16 }}>
                <span style={{ fontSize: 10, color: COLORS.sfBlue }}>●</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: COLORS.sfBlue, fontWeight: 600 }}>8x Salesforce Certifications</span>
              </div>
              <SubText>I've spent years in the Salesforce ecosystem doing RevOps, sales operations, and CRM architecture. I was the admin who was scared of Flows. When Claude Code came out, everything changed. I went from filing Jira tickets and waiting two weeks to just... building the thing myself. This course is everything I wish someone had shown me on day one.</SubText>
            </div>
          </div>
        </div>
      </Section>

      {/* ── DEMO ── */}
      <Section style={{ background: COLORS.surface }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <SectionLabel>See It In Action</SectionLabel>
          <H2 center>One prompt. Deployed to your org.</H2>
        </div>

        {/* video embed */}
        <div style={{ position: "relative", borderRadius: 12, overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.4)", border: `1px solid ${COLORS.border}`, background: "#1E1E2E", aspectRatio: "16/9", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          {/* Replace the src below with your Loom or video embed URL */}
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
            <div style={{ width: 72, height: 72, borderRadius: "50%", background: COLORS.orange, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 8px 32px ${COLORS.orangeGlow}` }}>
              <span style={{ fontSize: 28, color: "#fff", marginLeft: 4 }}>▶</span>
            </div>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 600, color: COLORS.textSecondary }}>Watch: Full Flow built in under 5 minutes</span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: COLORS.textMuted }}>0:60 · Real Salesforce org demo</span>
          </div>
        </div>

        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: COLORS.textMuted, textAlign: "center", marginTop: 24 }}>
          One prompt. A screen flow, LWC wrapper, and quick action — deployed to a real org. No clicks.
        </p>

        <div style={{ textAlign: "center", marginTop: 28 }}>
          <CTAButton large>I Want This - $97</CTAButton>
        </div>
      </Section>

      {/* ── BEFORE / AFTER ── */}
      <Section style={{ background: COLORS.surface }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <SectionLabel>What Changes</SectionLabel>
          <H2 center>Things you'll stop doing.</H2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
          <div style={{ background: COLORS.surface2, borderRadius: 12, padding: 28, border: `1px solid ${COLORS.border}` }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 700, color: COLORS.textMuted, letterSpacing: 1.5, marginBottom: 20 }}>BEFORE</div>
            {["15 clicks to create one field", "Manually updating permission sets", "Googling validation rule syntax", "Waiting 2 weeks for a developer", "Building flows click by click", "Reading docs and hoping it works"].map((t, i) => (
              <div key={i} style={{ display: "flex", gap: 10, marginBottom: 12, alignItems: "center" }}>
                <span style={{ color: "#EF4444", fontSize: 16, fontWeight: 800 }}>✗</span>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: COLORS.textMuted, lineHeight: 1.5 }}>{t}</span>
              </div>
            ))}
          </div>
          <div style={{ background: COLORS.surface2, borderRadius: 12, padding: 28, border: `2px solid ${COLORS.borderHover}`, boxShadow: `0 8px 40px rgba(218,119,86,0.06)` }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 700, color: COLORS.orange, letterSpacing: 1.5, marginBottom: 20 }}>AFTER</div>
            {[
              '"Create a picklist field on Contact called Lead Source Detail"',
              '"Add it to the Sales Console page layout and the SDR permission set"',
              '"Write a validation rule that requires it when Status is Qualified"',
              '"Build me a flow that assigns leads by region"',
              '"Deploy all of it to my org"',
              "Go grab coffee. Come back. Check that it works.",
            ].map((t, i) => (
              <div key={i} style={{ display: "flex", gap: 10, marginBottom: 12, alignItems: "center" }}>
                <span style={{ color: "#22C55E", fontSize: 16, fontWeight: 800 }}>✓</span>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: COLORS.textPrimary, lineHeight: 1.5 }}>{t}</span>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── WHAT YOU GET ── */}
      <Section style={{ background: COLORS.bg }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <SectionLabel>What You Get</SectionLabel>
          <H2 center>Everything you need to start using Claude Code with Salesforce.</H2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 16 }}>
          {[
            { icon: "⚡", title: "Zero to connected in minutes", desc: "Install Claude Code and connect it to your Salesforce org. Even if you've never opened a terminal." },
            { icon: "🏗️", title: "Fields, layouts, permissions", desc: "Create custom fields, add them to page layouts, and update permission sets with a single prompt." },
            { icon: "🔄", title: "Flows from plain English", desc: "Describe what the flow should do. Claude builds it and deploys it directly to your org." },
            { icon: "📝", title: "Validation rules & Apex", desc: "Write validation rules and Apex triggers without knowing the syntax. Describe the logic, get working code." },
            { icon: "🐛", title: "When AI gets it wrong", desc: "It will. Here's the process to debug and get Claude back on track when it misfires." },
            { icon: "📋", title: "Real prompts you can steal", desc: "Copy-paste prompts from my actual Salesforce org. Adapt them to yours and start shipping." },
          ].map((item, i) => (
            <BenefitCard key={i} {...item} />
          ))}
        </div>
      </Section>

      {/* ── SOCIAL PROOF ── */}
      <Section style={{ background: COLORS.surface }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <SectionLabel>Early Reactions</SectionLabel>
          <H2 center>What people are saying.</H2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
          {[
            { name: "Sarah K.", role: "Salesforce Admin, Series B SaaS", quote: "I built a lead routing flow in 10 minutes that would have taken me an entire afternoon. I keep looking for the catch." },
            { name: "Marcus T.", role: "Sr. Admin, Healthcare", quote: "I've been an admin for 6 years and never touched a terminal. Did the setup and had my first flow deployed before lunch." },
            { name: "Priya R.", role: "RevOps Lead, FinTech", quote: "Showed my VP the before and after. We cancelled the Agentforce eval the same week." },
          ].map((t, i) => (
            <TestimonialCard key={i} {...t} />
          ))}
        </div>
      </Section>

      {/* ── BONUSES ── */}
      <Section style={{ background: COLORS.bg }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <SectionLabel>Bonuses</SectionLabel>
          <H2 center>Included free when you enroll today.</H2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
          {[
            { icon: "📄", title: "CLAUDE.md Starter Template", desc: "The exact config file I use to connect Claude Code to my Salesforce org. Copy, paste, go.", value: "Value: $29" },
            { icon: "💬", title: "Prompt Library", desc: "20+ tested prompts for Flows, fields, validation rules, Apex, and more. Ready to use.", value: "Value: $49" },
            { icon: "🔄", title: "All Future Updates", desc: "New modules, new prompts, new techniques. Every update is free. Forever.", value: "Value: Priceless" },
          ].map((bonus, i) => (
            <BonusCard key={i} {...bonus} />
          ))}
        </div>
      </Section>

      {/* ── THE MATH ── */}
      <Section style={{ background: COLORS.surface }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <SectionLabel>The Math</SectionLabel>
          <H2 center>You're already paying more than this in wasted time.</H2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
          <div style={{ background: COLORS.surface2, borderRadius: 12, padding: 28, border: `1px solid ${COLORS.border}` }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 700, color: COLORS.textMuted, letterSpacing: 1.5, marginBottom: 20 }}>THE OLD WAY</div>
            {[["Agentforce license", "$125-$550/mo"], ["Extra SF license needed?", "Yes"], ["Implementation partner", "$50K-$150K"], ["Time to first automation", "8-12 weeks"], ["Who owns it?", "IT + vendor"]].map(([k, v], i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${COLORS.border}`, alignItems: "center" }}>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: COLORS.textMuted }}>{k}</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 600, color: "#EF4444" }}>{v}</span>
              </div>
            ))}
          </div>
          <div style={{ background: COLORS.surface2, borderRadius: 12, padding: 28, border: `2px solid ${COLORS.borderHover}`, boxShadow: `0 8px 40px rgba(218,119,86,0.06)` }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 700, color: COLORS.orange, letterSpacing: 1.5, marginBottom: 20 }}>WITH CLAUDE CODE</div>
            {[["Claude subscription", "$17/mo"], ["Extra SF license needed?", "None. Zero. Nada."], ["This course", "$97 once"], ["Time to first automation", "Under an hour"], ["Who owns it?", "You"]].map(([k, v], i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${COLORS.border}` }}>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: COLORS.textPrimary }}>{k}</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 700, color: COLORS.orange }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── WHO THIS IS FOR ── */}
      <Section style={{ background: COLORS.surface }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 28 }}>
          <div>
            <SectionLabel>Perfect For</SectionLabel>
            <H2>This is for you if...</H2>
            <div style={{ marginTop: 8 }}>
              <CheckItem>You're a Salesforce admin who knows the platform but wants to move faster</CheckItem>
              <CheckItem>You've heard about Claude Code but have no idea where to start</CheckItem>
              <CheckItem>You're tired of filing tickets and waiting for devs to build what you already know how to spec</CheckItem>
              <CheckItem>You've never opened a terminal and that's fine</CheckItem>
              <CheckItem>You want to be the person on your team who figured this out first</CheckItem>
            </div>
          </div>
          <div>
            <SectionLabel>&nbsp;</SectionLabel>
            <H2>Probably not for you if...</H2>
            <div style={{ marginTop: 8 }}>
              {["You're already a Salesforce developer using VS Code daily", "You're looking for cert prep (this is practical, not exam study)", "You want a course about Agentforce or Einstein (this is a third-party tool)"].map((t, i) => (
                <div key={i} style={{ display: "flex", gap: 12, marginBottom: 14, alignItems: "flex-start" }}>
                  <span style={{ color: COLORS.textMuted, fontSize: 15, marginTop: 1 }}>✗</span>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, lineHeight: 1.6, color: COLORS.textMuted }}>{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ── GUARANTEE ── */}
      <Section style={{ background: COLORS.bg }}>
        <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center", background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 16, padding: "40px 32px" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🛡️</div>
          <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 24, fontWeight: 800, color: COLORS.textPrimary, marginBottom: 12 }}>7-Day Money-Back Guarantee</h3>
          <SubText center>Try the whole course. If it's not for you, email me within 7 days and I'll refund every penny. No questions. No hoops. I'd rather you try it risk-free than wonder "what if."</SubText>
        </div>
      </Section>

      {/* ── PRICING CARD ── */}
      <Section style={{ background: COLORS.surface }} id="pricing">
        <div style={{ maxWidth: 500, margin: "0 auto" }}>
          <div style={{ background: COLORS.surface2, borderRadius: 16, overflow: "hidden", border: `2px solid ${COLORS.orange}`, position: "relative" }}>
            {/* orange glow */}
            <div style={{ position: "absolute", top: "-30%", left: "50%", transform: "translateX(-50%)", width: 400, height: 400, background: `radial-gradient(circle, rgba(218,119,86,0.08) 0%, transparent 60%)`, borderRadius: "50%", filter: "blur(60px)", pointerEvents: "none" }} />

            {/* header */}
            <div style={{ background: COLORS.orange, padding: "16px 28px", textAlign: "center" }}>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 800, color: "#fff", letterSpacing: 0.5 }}>FULL COURSE ACCESS</span>
            </div>

            <div style={{ padding: "36px 32px 32px", position: "relative" }}>
              {/* price */}
              <div style={{ textAlign: "center", marginBottom: 28 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 8 }}>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 22, color: COLORS.textMuted, textDecoration: "line-through" }}>$197</span>
                  <span style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 52, fontWeight: 800, color: "#fff", letterSpacing: -3 }}>$97</span>
                </div>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: COLORS.textMuted }}>One-time payment · Lifetime access</span>
              </div>

              {/* features */}
              <div style={{ marginBottom: 28 }}>
                {[
                  "Full video course library",
                  "CLAUDE.md starter template",
                  "20+ copy-paste prompts",
                  "Real Salesforce org demos",
                  "Debugging & troubleshooting module",
                  "All future updates included",
                  "7-day money-back guarantee",
                ].map((f, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, padding: "10px 0", borderBottom: `1px solid ${COLORS.border}`, alignItems: "center" }}>
                    <span style={{ color: COLORS.green, fontSize: 14, fontWeight: 700 }}>✓</span>
                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14.5, color: COLORS.textPrimary }}>{f}</span>
                  </div>
                ))}
              </div>

              <CTAButton large full>ENROLL NOW - $97</CTAButton>

              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: COLORS.textMuted, textAlign: "center", marginTop: 14 }}>
                Secure checkout · Instant access
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* ── FAQ ── */}
      <Section style={{ background: COLORS.bg }} maxWidth={680}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <SectionLabel>FAQ</SectionLabel>
          <H2 center>Common questions.</H2>
        </div>
        <FAQItem q="Do I need to know how to code?" a="No. The whole course assumes zero coding background. Claude Code writes the code. You describe what you want in plain English." />
        <FAQItem q="What do I need to get started?" a="A Claude Pro subscription ($17/month) and a Salesforce org that supports Salesforce DX (Enterprise, Unlimited, or Developer edition). The course walks you through everything." />
        <FAQItem q="How is this different from Agentforce?" a="Agentforce is a Salesforce product that costs $125-$550/user/month plus implementation. Claude Code is a $17/month AI tool from Anthropic that connects to your org. No Salesforce add-on license needed." />
        <FAQItem q="How long do I have access?" a="Lifetime. Watch it once, come back anytime. All future updates are included." />
        <FAQItem q="What if I don't like it?" a="Full refund within 7 days. No questions asked." />
        <FAQItem q="Is this safe for my production org?" a="Great question — security is the #1 concern for admins, and it should be. In this course we work in a Salesforce sandbox, not production. Claude Code respects Salesforce's existing security model — it uses the same API permissions your user already has. And when you're ready to push changes to production, you still follow the same rigorous deployment process (change sets, CI/CD, whatever your org uses). Nothing bypasses your existing safeguards." />
        <FAQItem q="Is this affiliated with Salesforce or Anthropic?" a="No. This is an independent course. Salesforce and Claude are trademarks of their respective companies." />
      </Section>

      {/* ── FINAL CTA ── */}
      <section style={{ padding: "80px 20px", position: "relative", overflow: "hidden", textAlign: "center", background: COLORS.surface }}>
        <div style={{ position: "absolute", top: "30%", left: "50%", transform: "translateX(-50%)", width: 500, height: 500, background: `radial-gradient(circle, rgba(218,119,86,0.1) 0%, transparent 60%)`, borderRadius: "50%", filter: "blur(80px)" }} />
        <div style={{ maxWidth: 600, margin: "0 auto", position: "relative", zIndex: 2 }}>
          <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: "clamp(26px, 5vw, 42px)", fontWeight: 800, color: "#FFFFFF", lineHeight: 1.12, marginBottom: 16, letterSpacing: -0.5 }}>
            Stop clicking.<br />Start prompting.
          </h2>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 17, color: COLORS.textSecondary, lineHeight: 1.6, marginBottom: 32 }}>
            $97 one-time. Lifetime access. 7-day money-back guarantee.
          </p>
          <CTAButton large>Get Instant Access - $97</CTAButton>
        </div>
      </section>

      {/* ── FOOTER ── */}
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
            {["Terms", "Privacy", "Refund Policy"].map((t, i) => (
              <span key={i} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.2)", cursor: "pointer" }}>{t}</span>
            ))}
          </div>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.12)" }}>© 2026 AI with Amit</span>
        </div>
      </footer>
    </div>
  );
}

/* ══════════════════════════ SUB-COMPONENTS ══════════════════════════ */

function ProblemCard({ icon, title, desc }) {
  const [hover, setHover] = useState(false);
  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} style={{ background: COLORS.surface, border: `1px solid ${hover ? COLORS.borderHover : COLORS.border}`, borderRadius: 12, padding: 24, transition: "all 0.3s ease", transform: hover ? "translateY(-3px)" : "translateY(0)" }}>
      <div style={{ fontSize: 28, marginBottom: 14 }}>{icon}</div>
      <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 17, fontWeight: 700, color: COLORS.textPrimary, marginBottom: 8 }}>{title}</h3>
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: COLORS.textSecondary, lineHeight: 1.6, margin: 0 }}>{desc}</p>
    </div>
  );
}

function BenefitCard({ icon, title, desc }) {
  const [hover, setHover] = useState(false);
  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} style={{ display: "flex", gap: 16, padding: 20, background: COLORS.surface, border: `1px solid ${hover ? COLORS.borderHover : COLORS.border}`, borderRadius: 12, transition: "all 0.3s ease", transform: hover ? "translateY(-2px)" : "translateY(0)" }}>
      <div style={{ fontSize: 24, flexShrink: 0, marginTop: 2 }}>{icon}</div>
      <div>
        <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 16, fontWeight: 700, color: COLORS.textPrimary, marginBottom: 6 }}>{title}</h3>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: COLORS.textSecondary, lineHeight: 1.6, margin: 0 }}>{desc}</p>
      </div>
    </div>
  );
}

function BonusCard({ icon, title, desc, value }) {
  const [hover, setHover] = useState(false);
  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} style={{ background: COLORS.surface, border: `1px solid ${hover ? COLORS.borderHover : COLORS.border}`, borderRadius: 12, padding: 24, transition: "all 0.3s ease", transform: hover ? "translateY(-3px)" : "translateY(0)", display: "flex", flexDirection: "column" }}>
      <div style={{ fontSize: 32, marginBottom: 14 }}>{icon}</div>
      <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 16, fontWeight: 700, color: COLORS.textPrimary, marginBottom: 8 }}>{title}</h3>
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: COLORS.textSecondary, lineHeight: 1.6, margin: 0, flex: 1 }}>{desc}</p>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: COLORS.orange, marginTop: 14, fontWeight: 600 }}>{value}</div>
    </div>
  );
}

function TestimonialCard({ name, role, quote }) {
  const [hover, setHover] = useState(false);
  const gradients = { S: `linear-gradient(135deg, ${COLORS.orange}, #E8956A)`, M: `linear-gradient(135deg, #7C3AED, #A78BFA)`, P: `linear-gradient(135deg, ${COLORS.sfBlue}, #38BDF8)` };
  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} style={{ background: COLORS.surface2, border: `1px solid ${hover ? COLORS.borderHover : COLORS.border}`, borderRadius: 12, padding: 24, transition: "all 0.3s ease", transform: hover ? "translateY(-3px)" : "translateY(0)", display: "flex", flexDirection: "column", gap: 16 }}>
      <Stars />
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14.5, lineHeight: 1.7, color: COLORS.textSecondary, margin: 0, fontStyle: "italic", flex: 1 }}>"{quote}"</p>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 38, height: 38, borderRadius: "50%", background: gradients[name[0]] || gradients.S, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 15, fontWeight: 700, color: "#fff" }}>{name[0]}</span>
        </div>
        <div>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600, color: COLORS.textPrimary }}>{name}</div>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: COLORS.textMuted }}>{role}</div>
        </div>
      </div>
    </div>
  );
}

function TerminalBlock({ title, lines }) {
  return (
    <div style={{ background: "#1E1E2E", borderRadius: 12, overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.4)", border: `1px solid ${COLORS.border}` }}>
      <div style={{ padding: "10px 16px", background: "rgba(255,255,255,0.03)", display: "flex", gap: 6, alignItems: "center", borderBottom: `1px solid ${COLORS.border}` }}>
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#FF5F57" }} />
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#FEBC2E" }} />
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#28C840" }} />
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "rgba(255,255,255,0.25)", marginLeft: 10 }}>{title}</span>
      </div>
      <div style={{ padding: "20px 24px", fontFamily: "'JetBrains Mono', monospace", fontSize: 13, lineHeight: 1.9 }}>
        {lines.map((line, i) => {
          if (line.type === "blank") return <br key={i} />;
          if (line.type === "prompt") return <div key={i}><span style={{ color: COLORS.orange }}>❯</span> <span style={{ color: "#A5D6FF" }}>{line.text}</span></div>;
          if (line.type === "prompt-cont") return <div key={i}><span style={{ color: "#A5D6FF" }}>{line.text}</span></div>;
          if (line.type === "muted") return <div key={i} style={{ color: "rgba(255,255,255,0.35)" }}>{line.text}</div>;
          if (line.type === "success") return <div key={i}><span style={{ color: COLORS.green }}>✓</span> <span style={{ color: "#E2E8F0" }}>{line.text}</span></div>;
          if (line.type === "label") return <div key={i}><span style={{ color: "rgba(255,255,255,0.5)" }}>{line.text}</span><span style={{ color: "#E2E8F0" }}>{line.value}</span></div>;
          if (line.type === "step") return <div key={i} style={{ color: "rgba(255,255,255,0.35)", fontSize: 12 }}>{"  "}{line.text}</div>;
          return null;
        })}
      </div>
    </div>
  );
}
