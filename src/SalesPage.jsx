import { useState, useEffect, useRef } from "react";
import SEO from "./components/SEO.jsx";

const FAQS = [
  { q: "Do I need to know how to code?", a: "No. The whole course assumes zero coding background. Claude Code writes the code. You describe what you want in plain English." },
  { q: "What do I need to get started?", a: "A Claude subscription (Pro is $20/month — Claude Max is highly recommended for longer agent runs) and a Salesforce org that supports Salesforce DX (Enterprise, Unlimited, or Developer edition). The course walks you through everything." },
  { q: "How is this different from Agentforce?", a: "Agentforce is a Salesforce product that costs $125-$550/user/month plus implementation. Claude Code runs on a $20/month Claude Pro plan from Anthropic (Max is highly recommended) and connects directly to your org. No Salesforce add-on license needed." },
  { q: "How long do I have access?", a: "Lifetime. Watch it once, come back anytime. All future updates are included." },
  { q: "What if I don't like it?", a: "Go through the course and if you didn't find value or didn't level up your Salesforce admin skills, email me within 30 days for a full refund. No questions asked." },
  { q: "Is this safe for my production org?", a: "Great question — security is the #1 concern for admins, and it should be. In this course we work in a Salesforce sandbox, not production. Claude Code respects Salesforce's existing security model — it uses the same API permissions your user already has. And when you're ready to push changes to production, you still follow the same rigorous deployment process (change sets, CI/CD, whatever your org uses). Nothing bypasses your existing safeguards." },
  { q: "Is this affiliated with Salesforce or Anthropic?", a: "No. This is an independent course. Salesforce and Claude are trademarks of their respective companies." },
];

const HOMEPAGE_JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Course",
      "@id": "https://ccforsf.com/#course",
      "name": "Claude Code for Salesforce Admins",
      "description": "A hands-on mini-course that teaches Salesforce Admins how to use Claude Code to build Flows, custom fields, validation rules, and Apex — without clicking through Setup or writing code by hand.",
      "url": "https://ccforsf.com/",
      "inLanguage": "en",
      "provider": { "@id": "https://ccforsf.com/#org" },
      "instructor": { "@id": "https://ccforsf.com/#amit" },
      "offers": {
        "@type": "Offer",
        "price": "97",
        "priceCurrency": "USD",
        "category": "OneTimePurchase",
        "availability": "https://schema.org/InStock",
        "url": "https://ccforsf.com/#pricing",
      },
      "hasCourseInstance": {
        "@type": "CourseInstance",
        "courseMode": "Online",
        "courseWorkload": "PT2H",
        "inLanguage": "en",
      },
    },
    {
      "@type": "Organization",
      "@id": "https://ccforsf.com/#org",
      "name": "AI with Amit",
      "url": "https://ccforsf.com",
      "logo": "https://ccforsf.com/favicon.svg",
    },
    {
      "@type": "Person",
      "@id": "https://ccforsf.com/#amit",
      "name": "Amit",
      "jobTitle": "GTM Engineer, 8x Salesforce Certified",
      "image": "https://ccforsf.com/amit-headshot.png",
      "description": "Creator of AI with Amit. Builds AI-native tools for Salesforce Admins.",
    },
    {
      "@type": "FAQPage",
      "@id": "https://ccforsf.com/#faq",
      "mainEntity": FAQS.map(({ q, a }) => ({
        "@type": "Question",
        "name": q,
        "acceptedAnswer": { "@type": "Answer", "text": a },
      })),
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

function H2({ children, center, light, className }) {
  return <h2 className={className} style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: "clamp(26px, 5vw, 42px)", fontWeight: 800, color: light ? COLORS.textPrimary : COLORS.textPrimary, lineHeight: 1.15, marginBottom: 16, textAlign: center ? "center" : "left", letterSpacing: -0.5 }}>{children}</h2>;
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
      /* Touch-friendly slider — bigger thumb + track on coarse pointers (mobile) */
      @media (hover: none) and (pointer: coarse) {
        input[type="range"].roi-slider { height: 10px; border-radius: 5px; }
        input[type="range"].roi-slider::-webkit-slider-thumb { width: 28px; height: 28px; box-shadow: 0 0 0 4px rgba(218,119,86,0.22); }
        input[type="range"].roi-slider::-moz-range-thumb { width: 28px; height: 28px; }
      }
      @keyframes gradientShift { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
      .gradient-headline {
        background: linear-gradient(90deg, #FFFFFF 0%, ${COLORS.orange} 35%, ${COLORS.sfBlue} 65%, #FFFFFF 100%);
        background-size: 300% 100%;
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        color: transparent;
        animation: gradientShift 7s ease infinite;
      }
      .feat-tabs { display:grid; grid-template-columns:1fr; gap:20px; }
      @media (min-width: 920px) { .feat-tabs { grid-template-columns: minmax(320px, 0.9fr) 1.1fr; gap:28px; } }
      .feat-row { transition: background 0.25s, border-color 0.25s, transform 0.2s; cursor: pointer; }
      .feat-row:hover { transform: translateX(4px); }
      @keyframes carouselSlide { from { opacity: 0; transform: translateX(12px); } to { opacity: 1; transform: translateX(0); } }
      @keyframes pulseGlow { 0%,100% { box-shadow: 0 0 0 0 rgba(218,119,86,0.4); } 50% { box-shadow: 0 0 0 14px rgba(218,119,86,0); } }
      @keyframes unlockIn { from { opacity: 0; transform: translateY(10px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
      html { scroll-behavior: smooth; }
      section[id] { scroll-margin-top: 110px; }
      @keyframes menuOpen { from { opacity: 0; transform: translateY(-8px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
      .fit-grid { display:grid; grid-template-columns:1fr; gap:20px; }
      @media (min-width: 820px) { .fit-grid { grid-template-columns: 1.45fr 1fr; gap:28px; align-items:start; } }
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
          <a href="#top" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 15, fontWeight: 700, letterSpacing: 0.5, textDecoration: "none" }}>
            <span style={{ color: COLORS.orange }}>cc</span>
            <span style={{ color: "rgba(255,255,255,0.25)" }}>_</span>
            <span style={{ color: "rgba(255,255,255,0.5)" }}>for</span>
            <span style={{ color: "rgba(255,255,255,0.25)" }}>_</span>
            <span style={{ color: COLORS.sfBlue }}>sf</span>
            <span style={{ color: "rgba(255,255,255,0.18)" }}>__c</span>
          </a>
          <HamburgerMenu />
        </div>
      </nav>

      {/* ── HERO ── */}
      <section id="top" style={{ padding: showUrgency ? "140px 20px 56px" : "110px 20px 56px", position: "relative", overflow: "hidden" }}>
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
              <div style={{ animation: "fadeUp 0.5s ease both", display: "inline-flex", alignItems: "center", gap: 8, background: COLORS.surface2, border: `1px solid ${COLORS.border}`, borderRadius: 100, padding: "8px 18px", marginBottom: 20 }}>
                <span style={{ color: COLORS.green, fontSize: 8, animation: "blink 1.4s infinite" }}>●</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: COLORS.textSecondary }}>CLAUDE CODE for SALESFORCE</span>
              </div>

              <h1 style={{ animation: "fadeUp 0.6s ease both", animationDelay: "0.1s", fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: "clamp(32px, 5.4vw, 52px)", fontWeight: 800, color: "#FFFFFF", lineHeight: 1.05, marginBottom: 20, letterSpacing: -1 }}>
                What if your next Flow
                <br />
                <span style={{ color: COLORS.orange }}>was one prompt away?</span>
              </h1>

              <p style={{ animation: "fadeUp 0.6s ease both", animationDelay: "0.2s", fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(15px, 2vw, 18px)", color: COLORS.textSecondary, lineHeight: 1.55, maxWidth: 480, marginBottom: 28 }}>
                Claude Code × Salesforce. Ship Flows, fields, and Apex <strong style={{ color: COLORS.textPrimary }}>10× faster</strong> — straight from your terminal.
              </p>

              {/* primary CTA */}
              <div style={{ animation: "fadeUp 0.6s ease both", animationDelay: "0.3s", marginBottom: 18, width: "100%", maxWidth: 440 }}>
                <CTAButton large full>Get Instant Access — $97</CTAButton>
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
              <HeroVideo />
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
      <Section id="problem" style={{ background: "radial-gradient(ellipse 80% 70% at 10% 10%, rgba(218,119,86,0.22), transparent 55%), radial-gradient(ellipse 60% 60% at 92% 95%, rgba(1,118,211,0.16), transparent 55%), #0a0a0a" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <SectionLabel>The Problem</SectionLabel>
          <H2 center>You know Salesforce. You just can't move fast enough.</H2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
          {[
            { icon: "🖱️", title: "15 clicks. One field.", desc: "Create the field. Add it to the layout. Update the permission set. Assign the profile. Test in sandbox. Push to prod. You wanted a picklist. You got an afternoon." },
            { icon: "⏳", title: "Stuck in Jira ticket purgatory", desc: "You know the business logic cold. But you're writing tickets, pinging devs, and waiting two weeks for a change you could describe in two sentences." },
            { icon: "🔀", title: "Staring at the Flow canvas", desc: "You know what it should do. But elements, loops, and decision trees turn a 10-minute idea into a 3-hour build — plus the debugging when something breaks in UAT." },
            { icon: "🔍", title: "Googling validation syntax", desc: "ISPICKVAL or TEXT? AND or &&? You know the logic. You're losing 20 minutes every time to syntax you'll forget again next week." },
            { icon: "📈", title: "Your backlog is getting worse", desc: "Leadership keeps asking what's taking so long. Every sprint ends with more added than shipped. The AI-fluent admin next door is shipping twice as fast." },
            { icon: "🤖", title: "AI already changed the job", desc: "Agentforce. Einstein Copilot. Anthropic MCP. Admins who can talk to their org in plain English are about to leap past the ones still hunting through Setup menus." },
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
      <Section style={{ background: "radial-gradient(ellipse 85% 60% at 50% 20%, rgba(1,118,211,0.25), transparent 55%), linear-gradient(180deg, #0d1320 0%, #0a0a0f 100%)" }}>
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

      {/* ── BEFORE / AFTER ── */}
      <Section style={{ background: "linear-gradient(135deg, rgba(239,68,68,0.20) 0%, #151319 38%, #151319 62%, rgba(34,197,94,0.18) 100%)" }}>
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

      {/* ── WHAT YOU GET (interactive tabs) ── */}
      <Section id="whats-included" style={{ background: COLORS.bg }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <SectionLabel>What You Get</SectionLabel>
          <H2 center>Everything you need to start using Claude Code with Salesforce.</H2>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14.5, color: COLORS.textMuted, marginTop: 8 }}>Click a module on the left. Watch it run.</p>
        </div>
        <FeatureShowcase />
      </Section>

      {/* ── SOCIAL PROOF ── */}
      <Section id="reviews" style={{ background: COLORS.surface }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <SectionLabel>Early Reactions</SectionLabel>
          <H2 center>What people are saying.</H2>
        </div>
        <TestimonialCarousel items={[
          { name: "Sarah K.", role: "Salesforce Admin · Series B SaaS", quote: "I built a lead routing flow in 10 minutes that would have taken me an entire afternoon. I keep looking for the catch.", accent: "#DA7756" },
          { name: "Marcus T.", role: "Sr. Admin · Healthcare", quote: "I've been an admin for 6 years and never touched a terminal. Did the setup and had my first flow deployed before lunch.", accent: "#8B5CF6" },
          { name: "Priya R.", role: "RevOps Lead · FinTech", quote: "Showed my VP the before and after. We cancelled the Agentforce eval the same week.", accent: "#0176D3" },
        ]} />
      </Section>

      {/* ── BONUSES (single bundle card) ── */}
      <Section style={{ background: "radial-gradient(ellipse 85% 55% at 50% -10%, rgba(218,119,86,0.30), transparent 55%), linear-gradient(180deg, #131320 0%, #0a0a0a 100%)" }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <SectionLabel>Bonuses</SectionLabel>
          <H2 center>Included free when you enroll today.</H2>
        </div>
        <BonusBundle items={[
          { icon: "📄", title: "CLAUDE.md Starter Template", desc: "The exact config file I use to connect Claude Code to my Salesforce org. Copy, paste, go.", value: 29 },
          { icon: "💬", title: "Prompt Library", desc: "20+ tested prompts for Flows, fields, validation rules, Apex, and more. Ready to use.", value: 49 },
          { icon: "🤝", title: "Private Community Access", desc: "A members-only Slack where admins share prompts, debug live, and trade what's working. Lifetime seat.", value: 299 },
        ]} />
      </Section>

      {/* ── THE MATH ── */}
      <Section style={{ background: "linear-gradient(135deg, rgba(218,119,86,0.22) 0%, #151319 35%, #151319 65%, rgba(1,118,211,0.22) 100%)" }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <SectionLabel>The Math</SectionLabel>
          <H2 center className="gradient-headline">You're already paying more than this in wasted time.</H2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
          <div style={{ background: COLORS.surface2, borderRadius: 12, padding: 28, border: `1px solid ${COLORS.border}` }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 700, color: COLORS.textMuted, letterSpacing: 1.5, marginBottom: 20 }}>THE OLD WAY</div>
            {[["Agentforce license", "$125-$550/mo"], ["Extra SF license needed?", "Yes"], ["Implementation partner", "$50K-$150K"], ["Time to first automation", "8-12 weeks"], ["Who owns it?", "IT + vendor"]].map(([k, v], i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${COLORS.border}`, alignItems: "center" }}>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: COLORS.textMuted }}>{k}</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "clamp(12.5px, 3vw, 13px)", fontWeight: 600, color: "#EF4444" }}>{v}</span>
              </div>
            ))}
          </div>
          <div style={{ background: COLORS.surface2, borderRadius: 12, padding: 28, border: `2px solid ${COLORS.borderHover}`, boxShadow: `0 8px 40px rgba(218,119,86,0.06)` }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 700, color: COLORS.orange, letterSpacing: 1.5, marginBottom: 20 }}>WITH CLAUDE CODE</div>
            {[["Claude subscription", "$20/mo (Pro) · Max recommended"], ["Extra SF license needed?", "None. Zero. Nada."], ["This course", "$97 once"], ["Time to first automation", "Under an hour"], ["Who owns it?", "You"]].map(([k, v], i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${COLORS.border}` }}>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: COLORS.textPrimary }}>{k}</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "clamp(12.5px, 3vw, 13px)", fontWeight: 700, color: COLORS.orange }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── WHO THIS IS FOR ── */}
      <Section style={{ background: COLORS.surface }}>
        <div className="fit-grid">
          {/* left: perfect fit — larger, green-tinted */}
          <div style={{
            background: "linear-gradient(180deg, rgba(34,197,94,0.08), rgba(34,197,94,0.02) 60%, transparent)",
            border: `1px solid rgba(34,197,94,0.22)`,
            borderRadius: 16,
            padding: "28px 30px",
            boxShadow: "0 8px 28px rgba(34,197,94,0.06)",
          }}>
            <SectionLabel>Perfect For</SectionLabel>
            <H2>This is for you if…</H2>
            <div style={{ marginTop: 14 }}>
              <CheckItem>You're a Salesforce admin who knows the platform but wants to move faster</CheckItem>
              <CheckItem>You've heard about Claude Code but have no idea where to start</CheckItem>
              <CheckItem>You're tired of filing tickets and waiting for devs to build what you already know how to spec</CheckItem>
              <CheckItem>You've never opened a terminal and that's fine</CheckItem>
              <CheckItem>You want to be the person on your team who figured this out first</CheckItem>
            </div>
          </div>

          {/* right: not for you — narrower, muted */}
          <div style={{
            background: COLORS.surface2,
            border: `1px solid ${COLORS.border}`,
            borderRadius: 16,
            padding: "22px 24px",
            alignSelf: "start",
          }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600, letterSpacing: 2, color: "#EF4444", textTransform: "uppercase", marginBottom: 10 }}>Not a fit</div>
            <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: "clamp(20px, 3vw, 26px)", fontWeight: 800, color: COLORS.textPrimary, lineHeight: 1.2, letterSpacing: -0.3, marginBottom: 14 }}>Probably not for you if…</h3>
            {["You're already a Salesforce developer using VS Code daily", "You're looking for cert prep (this is practical, not exam study)", "You want a course about Agentforce or Einstein (this is a third-party tool)"].map((t, i) => (
              <div key={i} style={{ display: "flex", gap: 10, marginBottom: 12, alignItems: "flex-start" }}>
                <span style={{ color: "#EF4444", fontSize: 14, fontWeight: 800, marginTop: 1, lineHeight: 1.5 }}>✗</span>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13.5, lineHeight: 1.55, color: COLORS.textSecondary }}>{t}</span>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── GUARANTEE ── */}
      <Section style={{ background: "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(34,197,94,0.20), transparent 55%), #0a0a0a" }}>
        <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center", background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 16, padding: "40px 32px" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🛡️</div>
          <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 24, fontWeight: 800, color: COLORS.textPrimary, marginBottom: 12 }}>30-Day Risk-Free Guarantee</h3>
          <SubText center>Go through the whole course. Try the prompts in your own org. If you didn't find value or didn't level up your Salesforce admin skills, email me within 30 days and I'll refund every penny. No questions. No hoops. I'd rather you try it risk-free than wonder "what if."</SubText>
        </div>
      </Section>

      {/* ── PRICING CARD ── */}
      <Section id="pricing" style={{ background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(218,119,86,0.32), transparent 55%), radial-gradient(ellipse 70% 50% at 50% 100%, rgba(1,118,211,0.22), transparent 55%), #0d0d1a" }}>
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

              {/* near-CTA micro testimonial */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: COLORS.surface2, border: `1px solid ${COLORS.border}`, borderRadius: 10, marginBottom: 14 }}>
                <div style={{ display: "flex" }}>
                  {["#DA7756", "#8B5CF6", "#0176D3"].map((bg, i) => (
                    <div key={i} style={{ width: 26, height: 26, borderRadius: "50%", background: `linear-gradient(135deg, ${bg}, ${COLORS.surface3})`, border: `2px solid ${COLORS.surface2}`, marginLeft: i === 0 ? 0 : -8, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 11, fontWeight: 800 }}>
                      {["S", "M", "P"][i]}
                    </div>
                  ))}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                    {[...Array(5)].map((_, s) => (<span key={s} style={{ color: COLORS.gold, fontSize: 12 }}>★</span>))}
                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11.5, fontWeight: 700, color: COLORS.textSecondary, marginLeft: 4 }}>5.0 from early access</span>
                  </div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11.5, color: COLORS.textMuted, fontStyle: "italic" }}>"Built a routing flow in 10 minutes." — Sarah K., Admin</div>
                </div>
              </div>

              {/* "Safe for your org" trust block — pulled out of FAQ */}
              <div style={{ background: `rgba(34,197,94,0.06)`, border: `1px solid rgba(34,197,94,0.22)`, borderRadius: 10, padding: "12px 14px", marginBottom: 18, display: "flex", gap: 10, alignItems: "flex-start" }}>
                <svg width="18" height="20" viewBox="0 0 20 22" fill="none" aria-hidden="true" style={{ flexShrink: 0, marginTop: 2 }}>
                  <path d="M10 1L2 4v6c0 5 3.5 9.5 8 11 4.5-1.5 8-6 8-11V4l-8-3z" stroke={COLORS.green} strokeWidth="1.6" fill="rgba(34,197,94,0.08)" strokeLinejoin="round" />
                  <path d="M6.5 10.5l2.5 2.5 4.5-5" stroke={COLORS.green} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                </svg>
                <div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 700, color: COLORS.green, marginBottom: 4 }}>Safe for your org</div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12.5, color: COLORS.textSecondary, lineHeight: 1.5 }}>
                    Course works in a <strong style={{ color: COLORS.textPrimary }}>sandbox</strong>, respects your existing <strong style={{ color: COLORS.textPrimary }}>permission sets + security model</strong>, and never bypasses your deployment process. Nothing hits production without you.
                  </div>
                </div>
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
            </div>
          </div>
        </div>
      </Section>

      {/* ── ROI CALCULATOR ── */}
      <Section style={{ background: COLORS.bg }}>
        <ROICalculator />
      </Section>

      {/* ── FAQ ── */}
      <Section id="faq" style={{ background: COLORS.bg }} maxWidth={680}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <SectionLabel>FAQ</SectionLabel>
          <H2 center>Frequently asked questions.</H2>
        </div>
        {FAQS.map((item) => <FAQItem key={item.q} q={item.q} a={item.a} />)}
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
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: "relative",
        background: hover
          ? `radial-gradient(circle at top left, rgba(218,119,86,0.18) 0%, rgba(218,119,86,0.06) 40%, ${COLORS.surface} 90%)`
          : `radial-gradient(circle at top left, rgba(218,119,86,0.10) 0%, rgba(218,119,86,0.02) 35%, ${COLORS.surface} 85%)`,
        border: `1px solid ${hover ? COLORS.borderHover : COLORS.border}`,
        borderRadius: 12,
        padding: 24,
        transition: "all 0.35s ease",
        transform: hover ? "translateY(-3px)" : "translateY(0)",
        boxShadow: hover
          ? "0 16px 44px rgba(218,119,86,0.18), 0 0 0 1px rgba(218,119,86,0.15) inset"
          : "0 6px 18px rgba(218,119,86,0.06), 0 0 0 1px rgba(218,119,86,0.05) inset",
        overflow: "hidden",
      }}
    >
      {/* soft orange glow pocket */}
      <div aria-hidden style={{ position: "absolute", top: -60, right: -60, width: 180, height: 180, background: `radial-gradient(circle, rgba(218,119,86,${hover ? 0.22 : 0.12}) 0%, transparent 65%)`, borderRadius: "50%", filter: "blur(20px)", pointerEvents: "none", transition: "background 0.35s ease" }} />
      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ fontSize: 28, marginBottom: 14 }}>{icon}</div>
        <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 17, fontWeight: 700, color: COLORS.textPrimary, marginBottom: 8 }}>{title}</h3>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: COLORS.textSecondary, lineHeight: 1.6, margin: 0 }}>{desc}</p>
      </div>
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

function BonusBundle({ items }) {
  const total = items.reduce((s, it) => s + it.value, 0);
  const [ref, visible] = useInView(0.15);

  return (
    <div ref={ref} style={{ maxWidth: 820, margin: "0 auto", position: "relative" }}>
      {/* pulsing FREE sticker */}
      <div style={{
        position: "absolute",
        top: -26,
        right: -6,
        width: 108,
        height: 108,
        borderRadius: "50%",
        background: `linear-gradient(135deg, ${COLORS.orange}, #C4613F)`,
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Bricolage Grotesque', sans-serif",
        fontWeight: 800,
        zIndex: 2,
        transform: "rotate(-8deg)",
        boxShadow: "0 12px 32px rgba(218,119,86,0.35)",
        animation: "pulseGlow 2.4s ease-in-out infinite",
      }}>
        <div style={{ fontSize: 12, opacity: 0.9, letterSpacing: 1.5, marginBottom: 2 }}>BUNDLE</div>
        <div style={{ fontSize: 24, lineHeight: 1 }}>${total}</div>
        <div style={{ fontSize: 12, opacity: 0.9, letterSpacing: 1.5, marginTop: 2 }}>FREE</div>
      </div>

      <div style={{
        background: "linear-gradient(180deg, #15151D, #0d0d13)",
        border: `1px solid ${COLORS.border}`,
        borderRadius: 20,
        padding: "36px 36px 28px",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* orange corner glow */}
        <div style={{ position: "absolute", top: "-50%", right: "-20%", width: 400, height: 400, background: "radial-gradient(circle, rgba(218,119,86,0.12) 0%, transparent 65%)", borderRadius: "50%", filter: "blur(40px)", pointerEvents: "none" }} />

        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 700, color: COLORS.orange, letterSpacing: 2, marginBottom: 20, textTransform: "uppercase" }}>
            <span style={{ color: COLORS.green }}>●</span>  Your enrollment unlocks
          </div>

          {items.map((it, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 20,
                padding: "22px 0",
                borderBottom: i < items.length - 1 ? `1px dashed ${COLORS.border}` : "none",
                opacity: visible ? 1 : 0,
                animation: visible ? `unlockIn 0.6s ease ${i * 0.15}s both` : "none",
              }}
            >
              <div style={{
                flexShrink: 0,
                width: 52,
                height: 52,
                borderRadius: 12,
                background: COLORS.surface2,
                border: `1px solid ${COLORS.border}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 24,
              }}>{it.icon}</div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 4, flexWrap: "wrap" }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: COLORS.textMuted }}>0{i + 1}</span>
                  <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 17, fontWeight: 700, color: "#fff", margin: 0 }}>{it.title}</h3>
                </div>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: COLORS.textSecondary, lineHeight: 1.5, margin: 0 }}>{it.desc}</p>
              </div>

              <div style={{
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}>
                <span style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 20, fontWeight: 800, color: COLORS.orange, letterSpacing: -0.5 }}>
                  ${it.value}
                </span>
                <span style={{ fontSize: 12, color: COLORS.green, fontFamily: "'JetBrains Mono', monospace", letterSpacing: 0.3 }}>✓ incl.</span>
              </div>
            </div>
          ))}

          {/* total strip */}
          <div style={{
            marginTop: 20,
            padding: "16px 20px",
            background: `linear-gradient(90deg, rgba(218,119,86,0.18), rgba(218,119,86,0.05))`,
            border: `1px solid ${COLORS.borderHover}`,
            borderRadius: 12,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
          }}>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600, color: COLORS.textPrimary, letterSpacing: 0.3 }}>
              Total bundle value
            </span>
            <span style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
              <span style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 28, fontWeight: 800, color: COLORS.textMuted, textDecoration: "line-through", letterSpacing: -0.5 }}>${total}</span>
              <span style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 32, fontWeight: 800, color: COLORS.orange, letterSpacing: -0.5 }}>FREE</span>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: COLORS.textSecondary }}>with enrollment</span>
            </span>
          </div>
        </div>
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

function TestimonialCarousel({ items }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setI((n) => (n + 1) % items.length), 7000);
    return () => clearInterval(id);
  }, [paused, items.length]);

  const prev = () => { setI((n) => (n - 1 + items.length) % items.length); setPaused(true); };
  const next = () => { setI((n) => (n + 1) % items.length); setPaused(true); };
  const pick = (n) => { setI(n); setPaused(true); };

  const t = items[i];

  return (
    <div style={{ maxWidth: 820, margin: "0 auto", position: "relative" }}>
      <div
        key={i}
        style={{
          background: COLORS.surface2,
          border: `1px solid ${COLORS.border}`,
          borderLeft: `4px solid ${t.accent}`,
          borderRadius: 16,
          padding: "40px 44px",
          animation: "carouselSlide 0.5s ease",
          position: "relative",
        }}
      >
        {/* big quote mark */}
        <div style={{ position: "absolute", top: 18, right: 28, fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 96, lineHeight: 1, color: t.accent, opacity: 0.18, fontWeight: 800 }}>"</div>
        <div style={{ display: "flex", gap: 2, marginBottom: 18 }}>
          {[...Array(5)].map((_, s) => (<span key={s} style={{ color: COLORS.gold, fontSize: 16 }}>★</span>))}
        </div>
        <blockquote style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: "clamp(18px, 2.4vw, 24px)", lineHeight: 1.45, color: "#fff", margin: 0, marginBottom: 24, fontWeight: 500, letterSpacing: -0.3 }}>
          "{t.quote}"
        </blockquote>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 48, height: 48, borderRadius: "50%", background: `linear-gradient(135deg, ${t.accent}, ${COLORS.surface3})`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, fontSize: 18, flexShrink: 0 }}>{t.name.charAt(0)}</div>
          <div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 700, color: COLORS.textPrimary }}>{t.name}</div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: COLORS.textMuted, marginTop: 2 }}>{t.role}</div>
          </div>
        </div>
      </div>

      {/* controls */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 20, marginTop: 22 }}>
        <button onClick={prev} aria-label="Previous testimonial" style={{ width: 40, height: 40, borderRadius: "50%", border: `1px solid ${COLORS.border}`, background: COLORS.surface, color: COLORS.textSecondary, cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}>←</button>
        <div style={{ display: "flex", gap: 6 }}>
          {items.map((_, n) => (
            <button
              key={n}
              onClick={() => pick(n)}
              aria-label={`Go to testimonial ${n + 1}`}
              style={{ width: n === i ? 28 : 8, height: 8, padding: 0, borderRadius: 4, border: "none", background: n === i ? COLORS.orange : "rgba(255,255,255,0.15)", cursor: "pointer", transition: "width 0.3s, background 0.3s" }}
            />
          ))}
        </div>
        <button onClick={next} aria-label="Next testimonial" style={{ width: 40, height: 40, borderRadius: "50%", border: `1px solid ${COLORS.border}`, background: COLORS.surface, color: COLORS.textSecondary, cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}>→</button>
      </div>
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

/* ── Hamburger menu (smooth-scrolls to page sections) ── */
function HamburgerMenu() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const links = [
    { label: "Watch demo", href: "#top" },
    { label: "The problem", href: "#problem" },
    { label: "What's included", href: "#whats-included" },
    { label: "Reviews", href: "#reviews" },
    { label: "Pricing", href: "#pricing" },
    { label: "FAQ", href: "#faq" },
  ];

  const onLink = () => setOpen(false);

  return (
    <div ref={menuRef} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        style={{
          width: 40,
          height: 40,
          border: `1px solid ${COLORS.border}`,
          background: open ? COLORS.surface2 : "rgba(255,255,255,0.03)",
          borderRadius: 8,
          cursor: "pointer",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 4,
          transition: "background 0.2s, border-color 0.2s",
        }}
      >
        <span style={{
          width: 18, height: 2, background: COLORS.textPrimary, borderRadius: 1,
          transition: "transform 0.25s, opacity 0.25s",
          transform: open ? "translateY(6px) rotate(45deg)" : "none",
        }} />
        <span style={{
          width: 18, height: 2, background: COLORS.textPrimary, borderRadius: 1,
          transition: "opacity 0.2s",
          opacity: open ? 0 : 1,
        }} />
        <span style={{
          width: 18, height: 2, background: COLORS.textPrimary, borderRadius: 1,
          transition: "transform 0.25s",
          transform: open ? "translateY(-6px) rotate(-45deg)" : "none",
        }} />
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 12px)",
            right: 0,
            minWidth: 240,
            background: "rgba(14,14,18,0.96)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: `1px solid ${COLORS.border}`,
            borderRadius: 12,
            padding: 8,
            boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
            animation: "menuOpen 0.22s cubic-bezier(0.4, 0, 0.2, 1)",
            transformOrigin: "top right",
          }}
        >
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={onLink}
              style={{
                display: "block",
                padding: "10px 14px",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 14.5,
                fontWeight: 500,
                color: COLORS.textSecondary,
                textDecoration: "none",
                borderRadius: 8,
                transition: "background 0.15s, color 0.15s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(218,119,86,0.08)"; e.currentTarget.style.color = COLORS.textPrimary; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = COLORS.textSecondary; }}
            >
              {l.label}
            </a>
          ))}
          <div style={{ height: 1, background: COLORS.border, margin: "8px 6px" }} />
          <a
            href="#pricing"
            onClick={onLink}
            style={{
              display: "block",
              margin: "4px 4px 2px",
              padding: "12px 14px",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 14.5,
              fontWeight: 800,
              color: "#fff",
              background: COLORS.orange,
              textAlign: "center",
              textDecoration: "none",
              borderRadius: 8,
              letterSpacing: 0.3,
              boxShadow: "0 4px 16px rgba(218,119,86,0.3)",
            }}
          >
            Get Access <span style={{ marginLeft: 4 }}>→</span>
          </a>
        </div>
      )}
    </div>
  );
}

/* ── Feature showcase (interactive tabs) ── */
const FEATURES = [
  {
    icon: "⚡",
    title: "Zero to connected in minutes",
    desc: "Install Claude Code and connect it to your Salesforce org. No terminal experience required.",
    scene: [
      { t: "$ npm i -g @anthropic-ai/claude-code", c: "#6B7280" },
      { t: "$ claude", c: "#A5D6FF" },
      { t: "→ Connecting to dev-org.__c", c: "#a0a0a0" },
      { t: "✓ Authenticated via sfdx", c: "#22C55E" },
      { t: "✓ 47 objects loaded", c: "#22C55E" },
      { t: "Ready ▌", c: "#E2E8F0", blink: true },
    ],
  },
  {
    icon: "🏗️",
    title: "Fields, layouts, permissions",
    desc: "Create custom fields, add them to page layouts, and update permission sets with a single prompt.",
    scene: [
      { t: "> Add Lead_Source_Detail__c", c: "#DA7756" },
      { t: "  picklist to Contact", c: "#A5D6FF" },
      { t: "Creating field…", c: "#a0a0a0" },
      { t: "✓ Field created", c: "#22C55E" },
      { t: "✓ Added to Sales Console layout", c: "#22C55E" },
      { t: "✓ SDR permission set updated", c: "#22C55E" },
    ],
  },
  {
    icon: "🔄",
    title: "Flows from plain English",
    desc: "Describe what the flow should do. Claude builds it and deploys it directly to your org.",
    scene: [
      { t: "> Build a flow that routes", c: "#DA7756" },
      { t: "  leads by region to owners", c: "#A5D6FF" },
      { t: "Generating Record-Triggered Flow…", c: "#a0a0a0" },
      { t: "  → Decision: Region", c: "#666666" },
      { t: "  → 4 assignment branches", c: "#666666" },
      { t: "✓ Deployed to dev-org", c: "#22C55E" },
    ],
  },
  {
    icon: "📝",
    title: "Validation rules & Apex",
    desc: "Write validation rules and Apex triggers without knowing the syntax. Describe the logic, get working code.",
    scene: [
      { t: "> Require CloseDate when", c: "#DA7756" },
      { t: "  Stage = Closed Won", c: "#A5D6FF" },
      { t: "Writing validation rule…", c: "#a0a0a0" },
      { t: "AND(", c: "#E2E8F0" },
      { t: '  ISPICKVAL(Stage,"Closed Won"),', c: "#E2E8F0" },
      { t: "  ISBLANK(CloseDate))", c: "#E2E8F0" },
      { t: "✓ Deployed", c: "#22C55E" },
    ],
  },
  {
    icon: "🐛",
    title: "When AI gets it wrong",
    desc: "It will. Here's the process to debug and get Claude back on track when it misfires.",
    scene: [
      { t: "$ deploy Account_Status__c trigger", c: "#6B7280" },
      { t: "✗ Unknown field 'Status'", c: "#EF4444" },
      { t: "> That's the custom one —", c: "#DA7756" },
      { t: "  use Status__c", c: "#A5D6FF" },
      { t: "Retrying with corrected API name…", c: "#a0a0a0" },
      { t: "✓ Deployed, 4/4 tests passing", c: "#22C55E" },
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
      { t: "…20+ more in the prompt library", c: "#DA7756" },
    ],
  },
];

function FeatureShowcase() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setActive((i) => (i + 1) % FEATURES.length), 6000);
    return () => clearInterval(id);
  }, [paused]);

  const handlePick = (i) => {
    setActive(i);
    setPaused(true);
  };

  const feat = FEATURES[active];

  return (
    <div className="feat-tabs">
      {/* LEFT: tab list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {FEATURES.map((f, i) => {
          const on = i === active;
          return (
            <button
              key={i}
              className="feat-row"
              onClick={() => handlePick(i)}
              style={{
                display: "flex",
                gap: 14,
                alignItems: "flex-start",
                padding: "16px 18px",
                background: on ? "linear-gradient(90deg, rgba(218,119,86,0.14), rgba(218,119,86,0.04))" : COLORS.surface,
                border: `1px solid ${on ? COLORS.borderHover : COLORS.border}`,
                borderLeft: `3px solid ${on ? COLORS.orange : "transparent"}`,
                borderRadius: 10,
                textAlign: "left",
                cursor: "pointer",
                color: COLORS.textPrimary,
                fontFamily: "inherit",
              }}
            >
              <span style={{ fontSize: 22, flexShrink: 0, marginTop: 1, filter: on ? "none" : "grayscale(0.3)", transition: "filter 0.2s" }}>{f.icon}</span>
              <span style={{ flex: 1 }}>
                <span style={{ display: "block", fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 15.5, fontWeight: 700, color: on ? "#fff" : COLORS.textPrimary, marginBottom: 4 }}>{f.title}</span>
                <span style={{ display: "block", fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: on ? COLORS.textSecondary : COLORS.textMuted, lineHeight: 1.5 }}>{f.desc}</span>
              </span>
              <span style={{ flexShrink: 0, fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: on ? COLORS.orange : "rgba(255,255,255,0.15)", marginTop: 2 }}>{String(i + 1).padStart(2, "0")}</span>
            </button>
          );
        })}
      </div>

      {/* RIGHT: live terminal demo */}
      <div style={{ height: "fit-content", alignSelf: "start" }}>
        <div style={{ width: "100%", background: "#0E0E14", borderRadius: 14, overflow: "hidden", boxShadow: "0 30px 80px rgba(0,0,0,0.45)", border: `1px solid ${COLORS.border}` }}>
          <div style={{ padding: "11px 16px", background: "rgba(255,255,255,0.02)", display: "flex", gap: 7, alignItems: "center", borderBottom: `1px solid ${COLORS.border}` }}>
            <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#FF5F57" }} />
            <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#FEBC2E" }} />
            <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#28C840" }} />
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11.5, color: "rgba(255,255,255,0.4)", marginLeft: 12 }}>amit@dev-org — {feat.title.toLowerCase().replace(/[^a-z]+/g, "-").slice(0, 24)}</span>
          </div>
          <div key={active} style={{ padding: "22px 24px", fontFamily: "'JetBrains Mono', monospace", fontSize: "clamp(13px, 3.2vw, 13.5px)", lineHeight: 1.85, minHeight: 260 }}>
            {feat.scene.map((ln, i) => (
              <div key={i} style={{
                opacity: 0,
                color: ln.c || COLORS.textSecondary,
                whiteSpace: "pre-wrap",
                animation: `sceneReveal 5.5s ${i * 0.45}s infinite`,
              }}>
                {ln.t}
                {ln.blink && <span style={{ animation: "caretBlink 1s infinite", marginLeft: 2 }}>│</span>}
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", gap: 6, justifyContent: "center", marginTop: 16 }}>
          {FEATURES.map((_, i) => (
            <button
              key={i}
              onClick={() => handlePick(i)}
              aria-label={`Show feature ${i + 1}`}
              style={{
                width: i === active ? 24 : 8,
                height: 8,
                padding: 0,
                borderRadius: 4,
                border: "none",
                background: i === active ? COLORS.orange : "rgba(255,255,255,0.15)",
                cursor: "pointer",
                transition: "width 0.3s, background 0.3s",
              }}
            />
          ))}
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
          <div>
            <RoiSlider label="Your annual salary" value={salary} onChange={setSalary} min={40000} max={300000} step={5000} display={money(salary)} hint="US admin median is ~$110k–$140k per Salesforce Ben." />
            <RoiSlider label="Hours saved per week" value={hoursPerWeek} onChange={setHoursPerWeek} min={1} max={20} step={1} display={`${hoursPerWeek} hrs`} hint="Most students hit 5–10 within the first month." />
            <RoiSlider label="Weeks worked per year" value={weeksPerYear} onChange={setWeeksPerYear} min={40} max={52} step={1} display={`${weeksPerYear} weeks`} hint="Accounts for PTO, holidays, sick days." />
          </div>
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
      <input type="range" className="roi-slider" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} />
      {hint && (<div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11.5, color: COLORS.textMuted, marginTop: 6, lineHeight: 1.5 }}>{hint}</div>)}
    </div>
  );
}

function MetricRow({ label, value, big, highlight }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "8px 0" }}>
      <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: highlight ? COLORS.textPrimary : COLORS.textSecondary, fontWeight: highlight ? 600 : 400 }}>{label}</span>
      <span style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: highlight ? 22 : (big ? 26 : 16), fontWeight: highlight || big ? 800 : 700, color: highlight ? COLORS.orange : (big ? "#fff" : COLORS.textPrimary), letterSpacing: big || highlight ? -0.5 : 0 }}>{value}</span>
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

/* ── hero video (clickable thumbnail — wire to Loom/Wistia src when ready) ── */
function HeroVideo() {
  return (
    <div style={{ width: "100%", maxWidth: 560 }}>
      <a
        href="#demo"
        aria-label="Watch full demo"
        style={{
          display: "block",
          position: "relative",
          borderRadius: 14,
          overflow: "hidden",
          boxShadow: "0 30px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(218,119,86,0.1)",
          border: `1px solid ${COLORS.border}`,
          aspectRatio: "16 / 9",
          background: "linear-gradient(135deg, #1E1E2E 0%, #0E0E14 100%)",
          textDecoration: "none",
          cursor: "pointer",
        }}
      >
        {/* subtle grid overlay */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(rgba(218,119,86,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(218,119,86,0.04) 1px, transparent 1px)`, backgroundSize: "40px 40px" }} />
        {/* glow */}
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 320, height: 320, background: `radial-gradient(circle, rgba(218,119,86,0.22) 0%, transparent 70%)`, borderRadius: "50%", filter: "blur(30px)" }} />

        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, padding: 20 }}>
          <div style={{
            width: 82,
            height: 82,
            borderRadius: "50%",
            background: COLORS.orange,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: `0 12px 40px ${COLORS.orangeGlow}`,
            animation: "pulseGlow 2.4s ease-in-out infinite",
          }}>
            <svg width="28" height="32" viewBox="0 0 28 32" fill="#fff" aria-hidden="true" style={{ marginLeft: 4 }}>
              <path d="M26 14.268L2 .536v30.928L26 17.732a2 2 0 0 0 0-3.464z" />
            </svg>
          </div>
          <div style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
            <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: "clamp(16px, 2vw, 19px)", fontWeight: 700, color: "#fff", marginBottom: 6 }}>
              Watch: Full Flow built in under 5 minutes
            </div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11.5, color: COLORS.textSecondary, letterSpacing: 0.5 }}>
              0:60 · Real Salesforce org demo
            </div>
          </div>
        </div>
      </a>
    </div>
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
      <div style={{ padding: "20px 24px", fontFamily: "'JetBrains Mono', monospace", fontSize: "clamp(13px, 3.2vw, 13.5px)", lineHeight: 1.9 }}>
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
