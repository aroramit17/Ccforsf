import { useState, useEffect, useRef } from "react";
import SEO from "./components/SEO.jsx";

const HOMEPAGE_JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Course",
      "name": "Claude Code for Salesforce Admins",
      "description": "A hands-on mini-course that teaches Salesforce Admins how to use Claude Code to build Flows, custom fields, validation rules, and Apex — without clicking through Setup or writing code by hand.",
      "provider": {
        "@type": "Organization",
        "name": "AI with Amit",
        "url": "https://ccforsf.com",
      },
      "offers": {
        "@type": "Offer",
        "price": "97",
        "priceCurrency": "USD",
        "category": "OneTimePurchase",
        "availability": "https://schema.org/InStock",
      },
      "hasCourseInstance": {
        "@type": "CourseInstance",
        "courseMode": "Online",
        "courseWorkload": "PT2H",
      },
    },
    {
      "@type": "Organization",
      "name": "AI with Amit",
      "url": "https://ccforsf.com",
      "logo": "https://ccforsf.com/favicon.svg",
    },
    {
      "@type": "Person",
      "name": "Amit",
      "jobTitle": "GTM Engineer, 8x Salesforce Certified",
      "image": "https://ccforsf.com/amit-headshot.png",
      "description": "Creator of AI with Amit. Builds AI-native tools for Salesforce Admins.",
    },
  ],
};

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
      @keyframes sceneReveal {
        0% { opacity: 0; transform: translateY(4px); }
        10% { opacity: 1; transform: translateY(0); }
        88% { opacity: 1; transform: translateY(0); }
        97%, 100% { opacity: 0; transform: translateY(-2px); }
      }
      @keyframes caretBlink { 0%,50%{opacity:1} 51%,100%{opacity:0} }
      * { margin:0; padding:0; box-sizing:border-box; }
      body { background:${COLORS.bg}; }
      ::selection { background:${COLORS.orange}; color:#fff; }
      .hero-grid { display:grid; grid-template-columns:1fr; gap:48px; align-items:center; }
      .hero-left { text-align:center; display:flex; flex-direction:column; align-items:center; }
      .hero-right { display:flex; justify-content:center; }
      @media (min-width: 960px) {
        .hero-grid { grid-template-columns: 1.05fr 1fr; gap:56px; }
        .hero-left { text-align:left; align-items:flex-start; }
        .hero-right { justify-content:flex-end; }
      }
      .roi-grid { display:grid; grid-template-columns:1fr; gap:20px; }
      @media (min-width: 800px) { .roi-grid { grid-template-columns: 1fr 1fr; gap:28px; } }
      input[type="range"].roi-slider {
        -webkit-appearance: none; appearance: none;
        width: 100%; height: 6px; border-radius: 3px;
        background: rgba(255,255,255,0.08); outline: none; cursor: pointer;
      }
      input[type="range"].roi-slider::-webkit-slider-thumb {
        -webkit-appearance: none; appearance: none;
        width: 20px; height: 20px; border-radius: 50%;
        background: ${COLORS.orange}; cursor: pointer;
        box-shadow: 0 0 0 4px rgba(218,119,86,0.18);
        transition: box-shadow 0.2s, transform 0.1s;
      }
      input[type="range"].roi-slider::-webkit-slider-thumb:hover { box-shadow: 0 0 0 8px rgba(218,119,86,0.28); transform: scale(1.08); }
      input[type="range"].roi-slider::-moz-range-thumb {
        width: 20px; height: 20px; border-radius: 50%;
        background: ${COLORS.orange}; cursor: pointer; border: none;
        box-shadow: 0 0 0 4px rgba(218,119,86,0.18);
      }
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
      <SEO
        title="CC for SF — Claude Code for Salesforce Admins"
        description="The hands-on mini-course that teaches Salesforce Admins to build Flows, fields, and Apex with Claude Code in minutes. $97 one-time, 30-day guarantee."
        path="/"
        jsonLd={HOMEPAGE_JSON_LD}
      />
      <GlobalStyles />

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

        <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 2 }}>
          <div className="hero-grid">
            {/* LEFT: copy + CTA */}
            <div className="hero-left">
              {/* badge */}
              <div style={{ animation: "fadeUp 0.5s ease both", display: "inline-flex", alignItems: "center", gap: 8, background: COLORS.surface2, border: `1px solid ${COLORS.border}`, borderRadius: 100, padding: "8px 18px", marginBottom: 24 }}>
                <span style={{ color: COLORS.green, fontSize: 8, animation: "blink 1.4s infinite" }}>●</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: COLORS.textSecondary }}>CLAUDE CODE x SALESFORCE</span>
              </div>

              <h1 style={{ animation: "fadeUp 0.6s ease both", animationDelay: "0.1s", fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: "clamp(32px, 5.4vw, 52px)", fontWeight: 800, color: "#FFFFFF", lineHeight: 1.05, marginBottom: 20, letterSpacing: -1 }}>
                What if your next Flow
                <br />
                <span style={{ color: COLORS.orange }}>was one prompt away?</span>
              </h1>

              <p style={{ animation: "fadeUp 0.6s ease both", animationDelay: "0.2s", fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(15px, 2vw, 18px)", color: COLORS.textSecondary, lineHeight: 1.55, maxWidth: 480, marginBottom: 28 }}>
                Claude Code × Salesforce. Ship Flows, fields, and Apex <strong style={{ color: COLORS.textPrimary }}>10× faster</strong> — straight from your terminal.
              </p>

              {/* pricing + CTA */}
              <div style={{ animation: "fadeUp 0.6s ease both", animationDelay: "0.3s", marginBottom: 18, width: "100%", maxWidth: 440 }}>
                <div className="hero-price-row" style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, justifyContent: "inherit" }}>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 20, color: COLORS.textMuted, textDecoration: "line-through" }}>$197</span>
                  <span style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 44, fontWeight: 800, color: "#fff", letterSpacing: -2 }}>$97</span>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 700, color: COLORS.green, background: `rgba(34,197,94,0.12)`, padding: "4px 10px", borderRadius: 100 }}>SAVE 50%</span>
                </div>
                <CTAButton large full>Get Instant Access - $97</CTAButton>
              </div>

              {/* trust row */}
              <div style={{ animation: "fadeUp 0.6s ease both", animationDelay: "0.4s", display: "flex", gap: 20, flexWrap: "wrap", justifyContent: "inherit" }}>
                {["∞ Lifetime Access", "Video Modules", "30-Day Guarantee"].map((t, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ color: COLORS.green, fontSize: 12 }}>✓</span>
                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: COLORS.textMuted }}>{t}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT: animated terminal */}
            <div className="hero-right" style={{ animation: "fadeUp 0.7s ease 0.3s both" }}>
              <HeroTerminal />
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS STRIP ── */}
      <div style={{ borderTop: `1px solid ${COLORS.border}`, borderBottom: `1px solid ${COLORS.border}`, padding: "0 20px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(3, 1fr)" }}>
          {[
            ["$20/mo", "Claude Code cost"],
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

      {/* ── PROBLEM (3×2 grid) ── */}
      <Section style={{ background: COLORS.bg }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <SectionLabel>The Problem</SectionLabel>
          <H2 center>You know Salesforce. You just can't move fast enough.</H2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
          {[
            { icon: "🖱️", title: "15 clicks. One field.", desc: "Create the field. Add it to the layout. Update the permission set. Assign the profile. Test it in sandbox. Push to prod. You wanted a picklist. You got an afternoon." },
            { icon: "⏳", title: "Stuck in Jira ticket purgatory", desc: "You know the business logic cold. But you're writing tickets, pinging devs, and waiting two weeks for a change you could describe in two sentences." },
            { icon: "🔀", title: "Staring at the Flow canvas", desc: "You know what it should do. But the elements, loops, and decision trees turn a 10-minute idea into a 3-hour build — plus the debugging when something breaks in UAT." },
            { icon: "🔍", title: "Googling validation syntax", desc: "ISPICKVAL or TEXT? AND or &&? You know the logic. You're just losing 20 minutes every time to syntax that you'll forget again next week." },
            { icon: "📈", title: "Your backlog is getting worse", desc: "Leadership keeps asking what's taking so long. Every sprint ends with more work added than shipped. And the AI-fluent admin on the team next door is shipping twice as fast." },
            { icon: "🤖", title: "AI already changed the job", desc: "Agentforce. Einstein Copilot. Anthropic MCP. The admins who can talk to their org in plain English are about to leap past the ones still hunting through Setup menus." },
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

      {/* ── HEADLESS FUTURE (Benioff proof) ── */}
      <Section style={{ background: COLORS.bg }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <SectionLabel>The future is headless</SectionLabel>
          <H2 center>If you can't run Salesforce from a terminal, you're already behind.</H2>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, lineHeight: 1.65, color: COLORS.textSecondary, maxWidth: 640, margin: "12px auto 0" }}>
            Benioff made it official: <strong style={{ color: COLORS.textPrimary }}>Salesforce Headless 360</strong> exposes every object, workflow, and agent as an API, MCP, and CLI. The browser is no longer the interface. Admins who can't prompt their org are about to get lapped — this course is how you get ahead of it.
          </p>
        </div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <BenioffTweet />
        </div>
      </Section>

      {/* ── INSTRUCTOR (A Note From Amit) ── */}
      <Section style={{ background: COLORS.bg }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <div style={{ display: "flex", gap: 28, alignItems: "flex-start", flexWrap: "wrap" }}>
            <div style={{ width: 88, height: 88, borderRadius: 16, overflow: "hidden", flexShrink: 0, border: `2px solid ${COLORS.border}` }}>
              <img src="amit-headshot.png" alt="Amit" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
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
            {
              icon: "⚡",
              title: "Zero to connected in minutes",
              desc: "Install Claude Code and connect it to your Salesforce org. Even if you've never opened a terminal.",
              scene: [
                { t: "$ npm i -g @anthropic-ai/claude-code", c: "#6B7280" },
                { t: "$ claude", c: "#A5D6FF" },
                { t: "→ Connecting to dev-org.__c", c: COLORS.textSecondary },
                { t: "✓ Authenticated via sfdx", c: COLORS.green },
                { t: "✓ 47 objects loaded", c: COLORS.green },
                { t: "Ready ▌", c: "#E2E8F0", blink: true },
              ],
            },
            {
              icon: "🏗️",
              title: "Fields, layouts, permissions",
              desc: "Create custom fields, add them to page layouts, and update permission sets with a single prompt.",
              scene: [
                { t: "> Add Lead_Source_Detail__c", c: COLORS.orange },
                { t: "  picklist to Contact", c: "#A5D6FF" },
                { t: "Creating field…", c: COLORS.textSecondary },
                { t: "✓ Field created", c: COLORS.green },
                { t: "✓ Added to Sales Console layout", c: COLORS.green },
                { t: "✓ SDR permission set updated", c: COLORS.green },
              ],
            },
            {
              icon: "🔄",
              title: "Flows from plain English",
              desc: "Describe what the flow should do. Claude builds it and deploys it directly to your org.",
              scene: [
                { t: "> Build a flow that routes", c: COLORS.orange },
                { t: "  leads by region to owners", c: "#A5D6FF" },
                { t: "Generating Record-Triggered Flow…", c: COLORS.textSecondary },
                { t: "  → Decision: Region", c: COLORS.textMuted },
                { t: "  → 4 assignment branches", c: COLORS.textMuted },
                { t: "✓ Deployed to dev-org", c: COLORS.green },
              ],
            },
            {
              icon: "📝",
              title: "Validation rules & Apex",
              desc: "Write validation rules and Apex triggers without knowing the syntax. Describe the logic, get working code.",
              scene: [
                { t: "> Require CloseDate when", c: COLORS.orange },
                { t: "  Stage = Closed Won", c: "#A5D6FF" },
                { t: "Writing validation rule…", c: COLORS.textSecondary },
                { t: "AND(", c: "#E2E8F0" },
                { t: "  ISPICKVAL(Stage,\"Closed Won\"),", c: "#E2E8F0" },
                { t: "  ISBLANK(CloseDate))", c: "#E2E8F0" },
                { t: "✓ Deployed", c: COLORS.green },
              ],
            },
            {
              icon: "🐛",
              title: "When AI gets it wrong",
              desc: "It will. Here's the process to debug and get Claude back on track when it misfires.",
              scene: [
                { t: "$ deploy Account_Status__c trigger", c: "#6B7280" },
                { t: "✗ Unknown field 'Status'", c: "#EF4444" },
                { t: "> That's the custom one —", c: COLORS.orange },
                { t: "  use Status__c", c: "#A5D6FF" },
                { t: "Retrying with corrected API name…", c: COLORS.textSecondary },
                { t: "✓ Deployed, 4/4 tests passing", c: COLORS.green },
              ],
            },
            {
              icon: "📋",
              title: "Real prompts you can steal",
              desc: "Copy-paste prompts from my actual Salesforce org. Adapt them to yours and start shipping.",
              scene: [
                { t: "[01] Create picklist on Contact…", c: "#A5D6FF" },
                { t: "[02] Build lead routing flow…", c: "#A5D6FF" },
                { t: "[03] Validation: require close date…", c: "#A5D6FF" },
                { t: "[04] Trigger: sync Account → Opp…", c: "#A5D6FF" },
                { t: "[05] Flow: escalate stale cases…", c: "#A5D6FF" },
                { t: "…20+ more in the prompt library", c: COLORS.orange },
              ],
            },
          ].map((item, i) => (
            <FlipCard key={i} {...item} />
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
            { icon: "🤝", title: "Private Community Access", desc: "A members-only Slack where admins share prompts, debug live, and trade what's working. Lifetime seat.", value: "Value: $299/yr" },
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
            {[["Claude subscription", "$20/mo (Pro) · Max recommended"], ["Extra SF license needed?", "None. Zero. Nada."], ["This course", "$97 once"], ["Time to first automation", "Under an hour"], ["Who owns it?", "You"]].map(([k, v], i) => (
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
          <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 24, fontWeight: 800, color: COLORS.textPrimary, marginBottom: 12 }}>30-Day Risk-Free Guarantee</h3>
          <SubText center>Go through the whole course. Try the prompts in your own org. If you didn't find value or didn't level up your Salesforce admin skills, email me within 30 days and I'll refund every penny. No questions. No hoops. I'd rather you try it risk-free than wonder "what if."</SubText>
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
              <div style={{ textAlign: "center", marginBottom: 20 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 8 }}>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 22, color: COLORS.textMuted, textDecoration: "line-through" }}>$197</span>
                  <span style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 52, fontWeight: 800, color: "#fff", letterSpacing: -3 }}>$97</span>
                </div>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: COLORS.textMuted }}>One-time payment · Lifetime access</span>
              </div>

              {/* employer reimbursement blurb */}
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10, background: `rgba(34,197,94,0.08)`, border: `1px solid rgba(34,197,94,0.2)`, borderRadius: 10, padding: "12px 14px", marginBottom: 24 }}>
                <span style={{ fontSize: 16, lineHeight: "22px" }}>💼</span>
                <div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 700, color: COLORS.green, marginBottom: 2 }}>Most companies cover this</div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12.5, color: COLORS.textSecondary, lineHeight: 1.5 }}>Most employers offer an education or training stipend that covers the cost of this course. Ask your manager — receipt provided.</div>
                </div>
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
                  "30-day money-back guarantee",
                ].map((f, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, padding: "10px 0", borderBottom: `1px solid ${COLORS.border}`, alignItems: "center" }}>
                    <span style={{ color: COLORS.green, fontSize: 14, fontWeight: 700 }}>✓</span>
                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14.5, color: COLORS.textPrimary }}>{f}</span>
                  </div>
                ))}
              </div>

              <CTAButton large full>ENROLL NOW - $97</CTAButton>

              {/* Secure checkout trust row */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 16 }}>
                <LockIcon />
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11.5, fontWeight: 600, color: COLORS.textSecondary, letterSpacing: 0.3 }}>Secure checkout · SSL encrypted</span>
              </div>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
                <CardVisa />
                <CardMastercard />
                <CardAmex />
                <CardDiscover />
                <CardApplePay />
              </div>

              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: COLORS.textMuted, textAlign: "center", marginTop: 12 }}>
                Instant access · Powered by Thrivecart
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* ── ROI CALCULATOR ── */}
      <Section style={{ background: COLORS.bg }}>
        <ROICalculator />
      </Section>

      {/* ── FAQ ── */}
      <Section style={{ background: COLORS.bg }} maxWidth={680}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <SectionLabel>FAQ</SectionLabel>
          <H2 center>Frequently asked questions.</H2>
        </div>
        <FAQItem q="Do I need to know how to code?" a="No. The whole course assumes zero coding background. Claude Code writes the code. You describe what you want in plain English." />
        <FAQItem q="What do I need to get started?" a="A Claude subscription (Pro is $20/month — Claude Max is highly recommended for longer agent runs) and a Salesforce org that supports Salesforce DX (Enterprise, Unlimited, or Developer edition). The course walks you through everything." />
        <FAQItem q="How is this different from Agentforce?" a="Agentforce is a Salesforce product that costs $125-$550/user/month plus implementation. Claude Code runs on a $20/month Claude Pro plan from Anthropic (Max is highly recommended) and connects directly to your org. No Salesforce add-on license needed." />
        <FAQItem q="How long do I have access?" a="Lifetime. Watch it once, come back anytime. All future updates are included." />
        <FAQItem q="What if I don't like it?" a="Go through the course and if you didn't find value or didn't level up your Salesforce admin skills, email me within 30 days for a full refund. No questions asked." />
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
            $97 one-time. Lifetime access. 30-day money-back guarantee.
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
            {[
              { label: "Terms", href: "/terms" },
              { label: "Privacy", href: "/privacy" },
              { label: "Refund Policy", href: "/refund" },
            ].map((item, i) => (
              <a key={i} href={item.href} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>{item.label}</a>
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

function FlipCard({ icon, title, desc, scene }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <div
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
      onClick={() => setFlipped(f => !f)}
      style={{ perspective: 1200, cursor: "pointer", minHeight: 180 }}
    >
      <div style={{
        position: "relative",
        width: "100%",
        minHeight: 180,
        transformStyle: "preserve-3d",
        WebkitTransformStyle: "preserve-3d",
        transition: "transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)",
        transform: flipped ? "rotateY(180deg)" : "rotateY(0)",
      }}>
        {/* FRONT */}
        <div style={{
          position: "absolute",
          inset: 0,
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
          display: "flex",
          gap: 16,
          padding: 20,
          background: COLORS.surface,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 12,
        }}>
          <div style={{ fontSize: 24, flexShrink: 0, marginTop: 2 }}>{icon}</div>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 16, fontWeight: 700, color: COLORS.textPrimary, marginBottom: 6 }}>{title}</h3>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: COLORS.textSecondary, lineHeight: 1.6, margin: 0 }}>{desc}</p>
          </div>
          <div style={{ position: "absolute", bottom: 10, right: 14, fontSize: 9.5, color: COLORS.textMuted, fontFamily: "'JetBrains Mono', monospace", letterSpacing: 1.2 }}>HOVER ↻</div>
        </div>
        {/* BACK */}
        <div style={{
          position: "absolute",
          inset: 0,
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
          transform: "rotateY(180deg)",
          background: COLORS.surface,
          border: `1px solid ${COLORS.borderHover}`,
          borderRadius: 12,
          overflow: "hidden",
        }}>
          <Scene lines={scene} />
        </div>
      </div>
    </div>
  );
}

function Scene({ lines }) {
  const perLine = 0.7;
  const hold = 2.2;
  const total = lines.length * perLine + hold;
  return (
    <div style={{
      width: "100%",
      height: "100%",
      minHeight: 180,
      padding: "18px 18px 16px",
      background: "#050508",
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: 11.5,
      lineHeight: 1.7,
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      gap: 3,
    }}>
      <div style={{ fontSize: 9, letterSpacing: 1.5, color: COLORS.orange, marginBottom: 10, textTransform: "uppercase", fontWeight: 700 }}>
        <span style={{ color: COLORS.green }}>●</span> live in your terminal
      </div>
      {lines.map((ln, i) => (
        <div key={i} style={{
          opacity: 0,
          color: ln.c || COLORS.textSecondary,
          whiteSpace: "pre-wrap",
          animation: `sceneReveal ${total}s ${i * perLine}s infinite`,
        }}>
          {ln.t}
          {ln.blink && <span style={{ animation: "caretBlink 1s infinite" }}>│</span>}
        </div>
      ))}
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

/* ── ROI calculator (interactive) ── */
function ROICalculator() {
  const [salary, setSalary] = useState(120000);
  const [hoursPerWeek, setHoursPerWeek] = useState(5);
  const [weeksPerYear, setWeeksPerYear] = useState(50);

  const hourlyRate = salary / (40 * weeksPerYear);
  const hoursSavedPerYear = hoursPerWeek * weeksPerYear;
  const weeklyValue = hourlyRate * hoursPerWeek;
  const monthlyValue = weeklyValue * 4.33;
  const annualValue = hourlyRate * hoursSavedPerYear;
  const COURSE = 97;
  const roi = Math.round(annualValue / COURSE);
  const paybackDays = weeklyValue > 0 ? Math.max(1, Math.ceil((COURSE / weeklyValue) * 7)) : 0;

  const money = (n) => "$" + Math.round(n).toLocaleString();

  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <SectionLabel>ROI Calculator</SectionLabel>
        <H2 center>What 5 hours back per week is actually worth.</H2>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: COLORS.textSecondary, maxWidth: 560, margin: "10px auto 0", lineHeight: 1.55 }}>
          Drag the sliders. Watch the math move. The course pays for itself faster than you'd think.
        </p>
      </div>

      <div style={{ maxWidth: 920, margin: "0 auto", background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 16, padding: 28, boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
        <div className="roi-grid">
          {/* LEFT: inputs */}
          <div>
            <RoiSlider
              label="Your annual salary"
              value={salary}
              onChange={setSalary}
              min={40000}
              max={300000}
              step={5000}
              display={money(salary)}
              hint="US admin median is ~$110k–$140k per Salesforce Ben."
            />
            <RoiSlider
              label="Hours saved per week"
              value={hoursPerWeek}
              onChange={setHoursPerWeek}
              min={1}
              max={20}
              step={1}
              display={`${hoursPerWeek} hrs`}
              hint="Most students hit 5–10 within the first month."
            />
            <RoiSlider
              label="Weeks worked per year"
              value={weeksPerYear}
              onChange={setWeeksPerYear}
              min={40}
              max={52}
              step={1}
              display={`${weeksPerYear} weeks`}
              hint="Accounts for PTO, holidays, sick days."
            />
          </div>

          {/* RIGHT: results */}
          <div style={{ background: COLORS.surface2, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: "20px 22px" }}>
            <MetricRow label="Your hourly rate" value={money(hourlyRate) + "/hr"} />
            <MetricRow label="Hours saved per year" value={hoursSavedPerYear.toLocaleString() + " hrs"} />
            <div style={{ height: 1, background: COLORS.border, margin: "14px 0" }} />
            <MetricRow label="Weekly $ value of saved time" value={money(weeklyValue)} />
            <MetricRow label="Monthly $ value" value={money(monthlyValue)} />
            <MetricRow label="Annual $ value" value={money(annualValue)} big />
            <div style={{ height: 1, background: COLORS.border, margin: "14px 0" }} />
            <MetricRow label="Return on $97 course" value={roi + "×"} highlight />
            <MetricRow label="Course pays for itself in" value={paybackDays + (paybackDays === 1 ? " day" : " days")} highlight />
          </div>
        </div>

        <div style={{ marginTop: 22, padding: "16px 18px", background: `rgba(218,119,86,0.08)`, border: `1px solid rgba(218,119,86,0.22)`, borderRadius: 12 }}>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, lineHeight: 1.6, color: COLORS.textPrimary, margin: 0 }}>
            At <strong>{money(salary)}/yr</strong> and <strong>{hoursPerWeek} hrs/week</strong> saved, you'd pocket <strong style={{ color: COLORS.orange }}>{money(annualValue)}</strong> this year. The course is $97 — that's a <strong style={{ color: COLORS.orange }}>{roi}× return</strong> in year one, paid back in <strong>{paybackDays} {paybackDays === 1 ? "day" : "days"}</strong>.
          </p>
        </div>

        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: COLORS.textMuted, textAlign: "center", marginTop: 14 }}>
          Hourly rate based on 40-hour work weeks. Your mileage varies; the math doesn't.
        </p>
      </div>
    </div>
  );
}

function RoiSlider({ label, value, onChange, min, max, step, display, hint }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
        <label style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, color: COLORS.textSecondary, letterSpacing: 0.2 }}>{label}</label>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 15, fontWeight: 700, color: COLORS.orange, letterSpacing: 0.3 }}>{display}</span>
      </div>
      <input
        type="range"
        className="roi-slider"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      {hint && (
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11.5, color: COLORS.textMuted, marginTop: 6, lineHeight: 1.5 }}>{hint}</div>
      )}
    </div>
  );
}

function MetricRow({ label, value, big, highlight }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "8px 0" }}>
      <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: highlight ? COLORS.textPrimary : COLORS.textSecondary, fontWeight: highlight ? 600 : 400 }}>{label}</span>
      <span style={{
        fontFamily: "'Bricolage Grotesque', sans-serif",
        fontSize: highlight ? 22 : (big ? 26 : 16),
        fontWeight: highlight || big ? 800 : 700,
        color: highlight ? COLORS.orange : (big ? "#fff" : COLORS.textPrimary),
        letterSpacing: big || highlight ? -0.5 : 0,
      }}>{value}</span>
    </div>
  );
}

/* ── Benioff tweet card (static Twitter-style recreation) ── */
function BenioffTweet() {
  const TWEET_URL = "https://x.com/Benioff/status/2044981547267395620";
  return (
    <a
      href={TWEET_URL}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "block",
        width: "100%",
        maxWidth: 560,
        background: "#15202B",
        border: "1px solid #38444D",
        borderRadius: 16,
        padding: 20,
        textDecoration: "none",
        color: "#E7E9EA",
        fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
      }}
    >
      {/* header: avatar, name, handle, x logo */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 12 }}>
        <div style={{ width: 44, height: 44, borderRadius: "50%", background: "linear-gradient(135deg, #1D9BF0, #0176D3, #0a0a0a)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 800, color: "#fff", letterSpacing: 0.5 }}>MB</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 4, flexWrap: "wrap" }}>
            <span style={{ fontWeight: 700, fontSize: 15, color: "#fff" }}>Marc Benioff</span>
            <VerifiedBadge />
            <span style={{ fontSize: 15, color: "#8B98A5" }}>@Benioff · 19h</span>
          </div>
        </div>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff" aria-hidden="true" style={{ flexShrink: 0 }}>
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      </div>

      {/* tweet body */}
      <div style={{ fontSize: 15, lineHeight: 1.45, color: "#E7E9EA", marginBottom: 14 }}>
        <strong style={{ color: "#fff" }}>Welcome Salesforce Headless 360: No Browser Required!</strong> Our API is the UI. Entire Salesforce &amp; Agentforce &amp; Slack platforms are now exposed as APIs, MCP, &amp; CLI. All AI agents can access data, workflows, and tasks directly in Slack, Voice, or anywhere else with Salesforce Headless… <span style={{ color: "#1D9BF0" }}>Show more</span>
      </div>

      {/* article preview card */}
      <div style={{ border: "1px solid #38444D", borderRadius: 16, overflow: "hidden", marginBottom: 14 }}>
        <div style={{ position: "relative", height: 180, background: "linear-gradient(180deg, #3d5a80 0%, #293241 100%)", overflow: "hidden" }}>
          {/* stylized skyscraper silhouette */}
          <svg viewBox="0 0 560 180" preserveAspectRatio="xMidYMid slice" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} aria-hidden="true">
            <defs>
              <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#98c1d9" />
                <stop offset="100%" stopColor="#3d5a80" />
              </linearGradient>
              <linearGradient id="buildingGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1a2c4c" />
                <stop offset="100%" stopColor="#0a1628" />
              </linearGradient>
            </defs>
            <rect width="560" height="180" fill="url(#skyGrad)" />
            {/* tower (abstracted Salesforce Tower shape) */}
            <polygon points="280,30 360,180 200,180" fill="url(#buildingGrad)" opacity="0.92" />
            <polygon points="280,30 330,180 230,180" fill="#0a1628" opacity="0.5" />
            {/* smaller buildings */}
            <rect x="60" y="130" width="80" height="50" fill="#0a1628" opacity="0.7" />
            <rect x="430" y="110" width="70" height="70" fill="#0a1628" opacity="0.75" />
            <rect x="510" y="140" width="50" height="40" fill="#0a1628" opacity="0.65" />
            {/* window lights */}
            {Array.from({ length: 28 }).map((_, i) => (
              <rect key={i} x={268 + (i % 4) * 5} y={60 + Math.floor(i / 4) * 14} width="2" height="6" fill="#FFD166" opacity={0.6 + (i % 3) * 0.1} />
            ))}
          </svg>
          <div style={{ position: "absolute", bottom: 10, left: 12, right: 12, color: "#fff", fontSize: 13, fontWeight: 600, lineHeight: 1.3, textShadow: "0 1px 6px rgba(0,0,0,0.7)" }}>
            Salesforce launches Headless 360 to turn its entire platform into APIs, MCP, and CLI
          </div>
        </div>
        <div style={{ padding: "10px 14px", fontSize: 13, color: "#8B98A5", background: "#15202B" }}>
          From venturebeat.com
        </div>
      </div>

      {/* engagement row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", color: "#8B98A5", fontSize: 13, paddingTop: 4 }}>
        <TweetStat icon="💬" value="251" />
        <TweetStat icon="🔁" value="881" />
        <TweetStat icon="♥" value="4.1K" />
        <TweetStat icon="📊" value="2.7M" />
        <TweetStat icon="🔖" />
        <TweetStat icon="↗" />
      </div>
    </a>
  );
}

function VerifiedBadge() {
  return (
    <svg width="16" height="16" viewBox="0 0 22 22" aria-hidden="true" style={{ flexShrink: 0 }}>
      <path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z" fill="#1D9BF0"/>
    </svg>
  );
}

function TweetStat({ icon, value }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13 }}>
      <span style={{ opacity: 0.85 }}>{icon}</span>
      {value && <span>{value}</span>}
    </span>
  );
}

/* ── hero terminal (animated cascade) ── */
function HeroTerminal() {
  const lines = [
    { t: "$ claude", c: "#A5D6FF" },
    { t: "", c: "" },
    { t: "> I need a Flow that assigns", c: COLORS.orange },
    { t: "  leads by region to the right", c: "#A5D6FF" },
    { t: "  owner and notifies them in Slack.", c: "#A5D6FF" },
    { t: "", c: "" },
    { t: "Reading dev-org metadata…", c: COLORS.textMuted },
    { t: "Building Record-Triggered Flow…", c: COLORS.textMuted },
    { t: "  → Decision: Region", c: COLORS.textMuted },
    { t: "  → 4 assignment branches", c: COLORS.textMuted },
    { t: "  → Slack notification action", c: COLORS.textMuted },
    { t: "Deploying to dev-org…", c: COLORS.textMuted },
    { t: "", c: "" },
    { t: "✓ Route_Lead_By_Region · Active", c: COLORS.green },
    { t: "✓ 4/4 tests passing", c: COLORS.green },
    { t: "Complete.", c: "#E2E8F0", bold: true, blink: true },
  ];
  const perLine = 0.45;
  const hold = 4;
  const total = lines.length * perLine + hold;

  return (
    <div style={{ width: "100%", maxWidth: 540, background: "#0E0E14", borderRadius: 14, overflow: "hidden", boxShadow: "0 30px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(218,119,86,0.08)", border: `1px solid ${COLORS.border}` }}>
      {/* title bar */}
      <div style={{ padding: "11px 16px", background: "rgba(255,255,255,0.02)", display: "flex", gap: 7, alignItems: "center", borderBottom: `1px solid ${COLORS.border}` }}>
        <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#FF5F57" }} />
        <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#FEBC2E" }} />
        <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#28C840" }} />
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11.5, color: "rgba(255,255,255,0.4)", marginLeft: 12 }}>amit@dev-org — claude</span>
      </div>
      {/* body */}
      <div style={{ padding: "18px 22px 22px", fontFamily: "'JetBrains Mono', monospace", fontSize: 12.5, lineHeight: 1.8, minHeight: 360 }}>
        {lines.map((ln, i) => {
          if (!ln.t) return <div key={i} style={{ height: 8 }} />;
          return (
            <div key={i} style={{
              opacity: 0,
              color: ln.c || COLORS.textSecondary,
              fontWeight: ln.bold ? 700 : 400,
              whiteSpace: "pre-wrap",
              animation: `sceneReveal ${total}s ${i * perLine}s infinite`,
            }}>
              {ln.t}
              {ln.blink && <span style={{ animation: "caretBlink 1s infinite", marginLeft: 2 }}>│</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── trust badges: SSL lock + card brand logos ── */
function LockIcon() {
  return (
    <svg width="12" height="14" viewBox="0 0 14 16" fill="none" aria-hidden="true">
      <rect x="1.5" y="7" width="11" height="8" rx="1.5" stroke={COLORS.green} strokeWidth="1.4" fill="rgba(34,197,94,0.08)" />
      <path d="M4 7V4.5a3 3 0 0 1 6 0V7" stroke={COLORS.green} strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="7" cy="11" r="1" fill={COLORS.green} />
    </svg>
  );
}

function CardVisa() {
  return (
    <svg width="38" height="24" viewBox="0 0 38 24" aria-label="Visa">
      <rect width="38" height="24" rx="4" fill="#fff" />
      <text x="19" y="16" textAnchor="middle" fill="#1A1F71" fontFamily="Helvetica, Arial, sans-serif" fontSize="10" fontWeight="900" fontStyle="italic" letterSpacing="0.5">VISA</text>
    </svg>
  );
}

function CardMastercard() {
  return (
    <svg width="38" height="24" viewBox="0 0 38 24" aria-label="Mastercard">
      <rect width="38" height="24" rx="4" fill="#fff" />
      <circle cx="16" cy="12" r="6" fill="#EB001B" />
      <circle cx="22" cy="12" r="6" fill="#F79E1B" />
      <path d="M19 7.5a6 6 0 0 1 0 9 6 6 0 0 1 0-9z" fill="#FF5F00" />
    </svg>
  );
}

function CardAmex() {
  return (
    <svg width="38" height="24" viewBox="0 0 38 24" aria-label="American Express">
      <rect width="38" height="24" rx="4" fill="#006FCF" />
      <text x="19" y="16" textAnchor="middle" fill="#fff" fontFamily="Helvetica, Arial, sans-serif" fontSize="8.5" fontWeight="900" letterSpacing="0.5">AMEX</text>
    </svg>
  );
}

function CardDiscover() {
  return (
    <svg width="46" height="24" viewBox="0 0 46 24" aria-label="Discover">
      <rect width="46" height="24" rx="4" fill="#fff" />
      <text x="19" y="15.5" textAnchor="middle" fill="#222" fontFamily="Helvetica, Arial, sans-serif" fontSize="6.5" fontWeight="800" letterSpacing="0.2">DISCOVER</text>
      <circle cx="39" cy="12" r="3.5" fill="#FF6000" />
    </svg>
  );
}

function CardApplePay() {
  return (
    <svg width="40" height="24" viewBox="0 0 40 24" aria-label="Apple Pay">
      <rect width="40" height="24" rx="4" fill="#000" stroke="rgba(255,255,255,0.25)" strokeWidth="0.5" />
      <path d="M10.3 9.3c-.3.4-.8.7-1.3.6-.1-.5.2-1 .4-1.3.3-.4.9-.7 1.3-.7.1.5-.1 1-.4 1.4zm.4.7c-.7 0-1.3.4-1.6.4-.4 0-.9-.4-1.5-.4-.8 0-1.5.5-1.9 1.2-.8 1.4-.2 3.5.6 4.6.4.5.9 1.1 1.5 1.1.6 0 .8-.4 1.5-.4.7 0 .9.4 1.5.4.6 0 1-.5 1.4-1 .4-.6.6-1.1.6-1.1-.1 0-1.2-.5-1.2-1.9 0-1.2 1-1.8 1-1.8-.5-.8-1.4-.9-1.9-.9z" fill="#fff" />
      <text x="26" y="16" textAnchor="middle" fill="#fff" fontFamily="Helvetica, Arial, sans-serif" fontSize="8" fontWeight="500">Pay</text>
    </svg>
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
