import React, { useState, useEffect, useRef } from "react";
import SEO from "./components/SEO.jsx";
import WaitlistModal, { openWaitlist } from "./components/WaitlistModal.jsx";

const FAQS = [
  { q: "Do I need to know how to code?", a: "No. The whole course assumes zero coding background. Claude Code writes the code. You describe what you want in plain English." },
  { q: "What do I need to get started?", a: "A Claude Max subscription ($100/month — Anthropic moved Claude Code access into the Max plan) and a Salesforce org that supports Salesforce DX (Enterprise, Unlimited, or Developer edition). The course walks you through everything." },
  { q: "How is this different from Agentforce?", a: "Agentforce is a Salesforce product that costs $125-$550/user/month plus implementation. Claude Code runs on the Claude Max plan from Anthropic ($100/month — where Claude Code now lives) and connects directly to your org. No Salesforce add-on license needed." },
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
  // Light theme — cream page, clean white cards, near-black warm text.
  bg: "#F6F2EA",
  surface: "#FFFFFF",
  surface2: "#FAF6EC",
  surface3: "#EFE9DC",
  textPrimary: "#1A1815",
  textSecondary: "#5A5348",
  textMuted: "#8A8272",
  border: "rgba(26,24,21,0.09)",
  borderHover: "rgba(218,119,86,0.45)",
  // Terminal bg kept for the code/terminal UI islands (feature showcase, code display)
  terminalBg: "#0E0E14",
  terminalBorder: "rgba(255,255,255,0.08)",
  terminalText: "#E2E8F0",
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
function Section({ children, id, style = {}, maxWidth = 960 }) {
  const [ref, visible] = useInView(0.06);
  return (
    <section ref={ref} id={id} className="sp-section" style={{ transition: "opacity 0.7s ease, transform 0.7s ease", opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(30px)", position: "relative", ...style }}>
      <div style={{ maxWidth, margin: "0 auto" }}>{children}</div>
    </section>
  );
}

function SectionLabel({ children }) {
  return <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 500, letterSpacing: 2, color: COLORS.textMuted, textTransform: "uppercase", marginBottom: 16 }}>{children}</div>;
}

function H2({ children, center, light, className }) {
  return <h2 className={className} style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: "clamp(32px, 6vw, 58px)", fontWeight: 700, color: COLORS.textPrimary, lineHeight: 1.05, marginBottom: 20, textAlign: center ? "center" : "left", letterSpacing: -1.5 }}>{children}</h2>;
}

function SubText({ children, center }) {
  return <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 17, lineHeight: 1.65, color: COLORS.textSecondary, marginBottom: 18, textAlign: center ? "center" : "left", maxWidth: 640 }}>{children}</p>;
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

      /* Section rhythm inspired by mastra.ai — generous whitespace at scale */
      .sp-section { padding: 88px 20px; }
      @media (min-width: 720px) { .sp-section { padding: 120px 28px; } }
      @media (min-width: 1100px) { .sp-section { padding: 140px 32px; } }
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
        background: rgba(26,24,21,0.12); outline: none; cursor: pointer;
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
      /* Feature showcase — flat modern tabs with line icons */
      .feat-tabs-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-bottom: 20px; }
      @media (min-width: 600px) { .feat-tabs-row { grid-template-columns: repeat(6, 1fr); gap: 10px; } }
      .feat-tab {
        position: relative;
        aspect-ratio: 1 / 0.85;
        background: ${COLORS.surface};
        border: 1px solid ${COLORS.border};
        border-radius: 14px;
        padding: 0;
        cursor: pointer; font-family: inherit;
        color: ${COLORS.textMuted};
        transition: transform 0.25s ease, background 0.2s ease, border-color 0.2s ease, box-shadow 0.25s ease, color 0.2s ease;
      }
      .feat-tab:hover {
        transform: translateY(-2px);
        border-color: rgba(26,24,21,0.18);
        color: ${COLORS.textSecondary};
        box-shadow: 0 8px 20px rgba(26,24,21,0.06);
      }
      .feat-tab.is-active {
        transform: translateY(-2px);
        background: ${COLORS.surface};
        border-color: ${COLORS.orange};
        color: ${COLORS.orange};
        box-shadow: 0 10px 28px rgba(218,119,86,0.22), 0 0 0 1px ${COLORS.orange};
      }
      .feat-tab-inner {
        position: relative;
        width: 100%; height: 100%;
        display: flex; flex-direction: column; align-items: center; justify-content: center;
        gap: 10px; padding: 10px 8px;
      }
      .feat-tab-label {
        font-family: 'JetBrains Mono', monospace;
        font-size: clamp(10px, 1.6vw, 11.5px);
        font-weight: 600; letter-spacing: 1px; text-transform: uppercase;
        color: ${COLORS.textSecondary};
        transition: color 0.2s ease;
        white-space: nowrap;
      }
      .feat-tab.is-active .feat-tab-label { color: ${COLORS.orange}; }
      .feat-tab-icon { display: inline-flex; align-items: center; justify-content: center; transition: transform 0.2s ease; }
      .feat-tab-icon svg { width: clamp(20px, 3vw, 24px); height: clamp(20px, 3vw, 24px); stroke: currentColor; stroke-width: 1.75; fill: none; stroke-linecap: round; stroke-linejoin: round; }
      .feat-tab:hover .feat-tab-icon, .feat-tab.is-active .feat-tab-icon { transform: scale(1.05); }
      .feat-panel { width: 100%; }
      .feat-caption { margin-top: 24px; max-width: 720px; }
      @keyframes carouselSlide { from { opacity: 0; transform: translateX(12px); } to { opacity: 1; transform: translateX(0); } }
      @keyframes pulseGlow { 0%,100% { box-shadow: 0 0 0 0 rgba(218,119,86,0.4); } 50% { box-shadow: 0 0 0 14px rgba(218,119,86,0); } }
      @keyframes unlockIn { from { opacity: 0; transform: translateY(10px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
      html { scroll-behavior: smooth; }
      section[id] { scroll-margin-top: 110px; }
      @keyframes menuOpen { from { opacity: 0; transform: translateY(-8px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
      .fit-grid { display:grid; grid-template-columns:1fr; gap:20px; }
      @media (min-width: 820px) { .fit-grid { grid-template-columns: 1.45fr 1fr; gap:28px; align-items:start; } }

      /* Amit "meet your course instructor" 30/70 split with watermark title */
      .amit-note-grid { display:grid; grid-template-columns:1fr; gap:24px; align-items:start; position: relative; }
      @media (min-width: 720px) { .amit-note-grid { grid-template-columns: minmax(180px, 28%) 1fr; gap:40px; align-items:center; } }
      .amit-note-image { position: relative; z-index: 2; border-radius: 20px; overflow: hidden; border: 2px solid rgba(26,24,21,0.1); box-shadow: 0 20px 50px rgba(26,24,21,0.12); }
      .amit-note-image img { width: 100%; height: auto; aspect-ratio: 1/1; object-fit: cover; display: block; }
      /* Large faded display text floating behind/next to the portrait */
      .instructor-watermark {
        position: absolute;
        font-family: 'Bricolage Grotesque', sans-serif;
        font-weight: 800;
        line-height: 0.88;
        letter-spacing: -3px;
        text-transform: uppercase;
        pointer-events: none;
        user-select: none;
        z-index: 1;
        white-space: nowrap;
      }
      @media (max-width: 719px) {
        .instructor-watermark {
          top: 6%;
          left: 50%;
          transform: translateX(-50%);
          font-size: clamp(40px, 13vw, 72px);
          color: rgba(26,24,21,0.09);
          white-space: normal;
          text-align: center;
          line-height: 0.92;
        }
      }
      @media (min-width: 720px) {
        .instructor-watermark {
          top: 50%;
          left: 20%;
          transform: translateY(-50%);
          font-size: clamp(72px, 11vw, 136px);
          color: rgba(26,24,21,0.08);
        }
      }

      /* Benioff section 50/50 split
         Mobile: portrait stacks ABOVE the text (DOM order has text first for a11y/SEO,
         so we flip with CSS order on narrow screens). */
      .benioff-grid { display:grid; grid-template-columns:1fr; gap:32px; align-items:center; }
      .benioff-grid > :nth-child(2) { order: -1; }
      @media (min-width: 860px) {
        .benioff-grid { grid-template-columns: 1fr 1fr; gap:48px; }
        .benioff-grid > :nth-child(2) { order: 0; }
      }
      .benioff-portrait { position: relative; border-radius: 14px; overflow: hidden; background: radial-gradient(ellipse at 50% 60%, #0a0a0f 0%, #000 85%); aspect-ratio: 16/10; box-shadow: 0 30px 80px rgba(0,0,0,0.55), inset 0 0 0 1px rgba(218,119,86,0.25); }
      .benioff-portrait img { width: 100%; height: 100%; object-fit: cover; object-position: center 22%; filter: url(#benioff-duotone) contrast(1.12) brightness(1.05); mix-blend-mode: screen; -webkit-mask-image: radial-gradient(ellipse 75% 85% at 50% 52%, #000 55%, transparent 92%); mask-image: radial-gradient(ellipse 75% 85% at 50% 52%, #000 55%, transparent 92%); }
      .benioff-portrait::after { content: ""; position: absolute; inset: 0; pointer-events: none; background-image: repeating-linear-gradient(0deg, rgba(0,0,0,0.28) 0, rgba(0,0,0,0.28) 1px, transparent 1px, transparent 3px); mix-blend-mode: multiply; }
      .benioff-portrait::before { content: ""; position: absolute; inset: 0; pointer-events: none; background: radial-gradient(circle at 50% 30%, rgba(218,119,86,0.18) 0%, transparent 55%); }
      .benioff-caption { position: absolute; bottom: 10px; left: 12px; font-family: 'JetBrains Mono', monospace; font-size: 11px; color: rgba(218,119,86,0.85); letter-spacing: 1.2px; text-transform: uppercase; pointer-events: none; }

      /* The Math rows — stack value under label on narrow widths */
      .math-row { display:flex; justify-content:space-between; align-items:center; padding:10px 0; flex-wrap: wrap; gap: 2px; }
      @media (max-width: 520px) {
        .math-row { flex-direction: column; align-items: flex-start; }
        .math-row .math-value { text-align: left !important; }
      }

      /* Pricing card: heavy lifted shadow (no animated border) */
      .pricing-card-wrap { position: relative; border-radius: 18px; box-shadow: 0 30px 70px rgba(26,24,21,0.14), 0 14px 36px rgba(218,119,86,0.22), 0 0 0 1px rgba(218,119,86,0.22); transition: transform 0.3s ease, box-shadow 0.3s ease; }
      .pricing-card-wrap:hover { transform: translateY(-4px); box-shadow: 0 42px 96px rgba(26,24,21,0.18), 0 24px 52px rgba(218,119,86,0.32), 0 0 0 1px rgba(218,119,86,0.38); }
      .pricing-card-inner { background: ${COLORS.surface2}; border: 2px solid ${COLORS.orange}; border-radius: 18px; overflow: hidden; position: relative; }

      /* Animated gradient ring around the ENROLL NOW button */
      @keyframes enrollBorderSpin { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
      @keyframes enrollSheen { 0% { transform: translateX(-120%) skewX(-18deg); } 100% { transform: translateX(260%) skewX(-18deg); } }
      .enroll-cta-wrap { position: relative; border-radius: 12px; padding: 2.5px; background: linear-gradient(120deg, #DA7756 0%, #FFB347 22%, #FFF 42%, #0176D3 62%, #DA7756 82%, #FFB347 100%); background-size: 300% 300%; animation: enrollBorderSpin 4.5s linear infinite; box-shadow: 0 12px 36px rgba(218,119,86,0.35), 0 2px 8px rgba(218,119,86,0.3); }
      .enroll-cta-wrap > * { border-radius: 10px !important; }
      .enroll-cta-wrap .enroll-sheen { position: absolute; top: 0; bottom: 0; width: 40%; background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.35) 50%, transparent 100%); pointer-events: none; animation: enrollSheen 2.8s ease-in-out infinite; border-radius: 10px; }

      /* ROI calculator — pulsing slider thumbs (prominent) */
      @keyframes roiThumbPulse {
        0%, 100% { box-shadow: 0 0 0 5px rgba(218,119,86,0.45), 0 0 0 0 rgba(218,119,86,0.55), 0 0 14px rgba(218,119,86,0.5); }
        50%      { box-shadow: 0 0 0 9px rgba(218,119,86,0.55), 0 0 0 26px rgba(218,119,86,0), 0 0 22px rgba(218,119,86,0.8); }
      }
      input[type="range"].roi-slider::-webkit-slider-thumb { animation: roiThumbPulse 1.6s ease-in-out infinite; }
      input[type="range"].roi-slider::-moz-range-thumb { animation: roiThumbPulse 1.6s ease-in-out infinite; }
      input[type="range"].roi-slider:focus::-webkit-slider-thumb,
      input[type="range"].roi-slider:active::-webkit-slider-thumb { animation-play-state: paused; }
      @keyframes roiHintBlink { 0%, 100% { opacity: 0.4; } 50% { opacity: 1; } }
      .roi-hint-blink { animation: roiHintBlink 1.8s ease-in-out infinite; }

      /* Stats strip — tight on mobile so labels don't wrap awkwardly */
      .stats-strip { max-width: 900px; margin: 0 auto; display: grid; grid-template-columns: repeat(3, 1fr); }
      .stats-cell { padding: 24px 12px; text-align: center; display: flex; flex-direction: column; justify-content: center; gap: 6px; }
      .stats-num { font-size: clamp(20px, 5.5vw, 28px); line-height: 1.1; letter-spacing: -0.5px; }
      .stats-label { font-size: clamp(11px, 2.6vw, 13px); line-height: 1.35; }
      @media (min-width: 640px) { .stats-cell { padding: 28px 20px; } }

      /* Bonus bundle — mobile-friendly row layout */
      .bonus-card { padding: 36px 36px 28px; }
      .bonus-row { display: flex; align-items: flex-start; gap: 20px; padding: 22px 0; }
      .bonus-icon { flex-shrink: 0; width: 52px; height: 52px; border-radius: 10px; background: ${COLORS.surface2}; border: 1px solid ${COLORS.border}; display: flex; align-items: center; justify-content: center; font-family: 'JetBrains Mono', monospace; font-size: 15px; font-weight: 700; color: ${COLORS.orange}; letter-spacing: 1px; }
      .bonus-content { flex: 1; min-width: 0; }
      .bonus-price-col { flex-shrink: 0; display: flex; align-items: center; gap: 10px; }
      .bonus-sticker { position: absolute; top: -26px; right: -6px; width: 108px; height: 108px; border-radius: 50%; background: linear-gradient(135deg, ${COLORS.orange}, #C4613F); color: #fff; display: flex; flex-direction: column; align-items: center; justify-content: center; font-family: 'Bricolage Grotesque', sans-serif; font-weight: 800; z-index: 2; transform: rotate(-8deg); box-shadow: 0 12px 32px rgba(218,119,86,0.35); }
      .bonus-total { margin-top: 20px; padding: 16px 20px; background: linear-gradient(90deg, rgba(218,119,86,0.18), rgba(218,119,86,0.05)); border: 1px solid ${COLORS.borderHover}; border-radius: 12px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; }

      @media (max-width: 640px) {
        .bonus-card { padding: 54px 18px 22px; }
        .bonus-row { flex-wrap: wrap; gap: 12px; padding: 18px 0; }
        .bonus-icon { width: 42px; height: 42px; font-size: 20px; border-radius: 10px; }
        .bonus-content { flex: 1 1 calc(100% - 54px); }
        .bonus-price-col { flex-basis: 100%; justify-content: flex-end; margin-top: 2px; padding-left: 54px; }
        .bonus-sticker { width: 76px; height: 76px; top: -16px; right: 8px; transform: rotate(-6deg); }
        .bonus-sticker .bonus-sticker-amount { font-size: 17px !important; }
        .bonus-sticker .bonus-sticker-label { font-size: 9px !important; }
        .bonus-total { padding: 14px 16px; }
        .bonus-total-right { flex-basis: 100%; text-align: left; }
      }
    `}</style>
  );
}

/* ══════════════════════════ MAIN PAGE ══════════════════════════ */
export default function SalesPage() {
  const [scrollY, setScrollY] = useState(0);

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

      {/* ── NAV ── */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 150, padding: "0 20px", background: scrollY > 50 ? "rgba(246,242,234,0.92)" : "transparent", backdropFilter: scrollY > 50 ? "blur(16px)" : "none", transition: "all 0.4s ease", borderBottom: scrollY > 50 ? `1px solid ${COLORS.border}` : "none" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", height: 56 }}>
          <a href="#top" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 15, fontWeight: 700, letterSpacing: 0.5, textDecoration: "none" }}>
            <span style={{ color: COLORS.orange }}>cc</span>
            <span style={{ color: scrollY > 50 ? "rgba(26,24,21,0.3)" : "rgba(255,255,255,0.4)" }}>_</span>
            <span style={{ color: scrollY > 50 ? "rgba(26,24,21,0.55)" : "rgba(255,255,255,0.7)" }}>for</span>
            <span style={{ color: scrollY > 50 ? "rgba(26,24,21,0.3)" : "rgba(255,255,255,0.4)" }}>_</span>
            <span style={{ color: COLORS.sfBlue }}>sf</span>
            <span style={{ color: scrollY > 50 ? "rgba(26,24,21,0.22)" : "rgba(255,255,255,0.3)" }}>__c</span>
          </a>
          <HamburgerMenu onDark={scrollY <= 50} />
        </div>
      </nav>

      {/* ── HERO ── */}
      <section id="top" style={{ padding: "110px 20px 56px", position: "relative", overflow: "hidden", background: "#000" }}>
        {/* cinematic background video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0, pointerEvents: "none" }}
        >
          <source src="https://res.cloudinary.com/dfonotyfb/video/upload/v1775585556/dds3_1_rqhg7x.mp4" type="video/mp4" />
        </video>
        {/* readability overlay: darken video + subtle orange tint + vignette */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(10,10,10,0.55) 0%, rgba(10,10,10,0.45) 55%, rgba(10,10,10,0.75) 100%)", zIndex: 1, pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "10%", left: "50%", transform: "translateX(-50%)", width: 600, height: 600, background: `radial-gradient(circle, rgba(218,119,86,0.18) 0%, transparent 65%)`, borderRadius: "50%", filter: "blur(60px)", zIndex: 1, pointerEvents: "none" }} />

        <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 2 }}>
          <div className="hero-grid">
            {/* LEFT: copy + CTA */}
            <div className="hero-left">
              {/* quiet pre-headline */}
              <div style={{ animation: "fadeUp 0.5s ease both", marginBottom: 22 }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 500, letterSpacing: 2, color: "rgba(255,255,255,0.65)", textTransform: "uppercase" }}>
                  Claude Code × Salesforce
                </span>
              </div>

              <h1 style={{ animation: "fadeUp 0.6s ease both", animationDelay: "0.1s", fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: "clamp(40px, 7.2vw, 78px)", fontWeight: 700, color: "#FFFFFF", lineHeight: 1.0, marginBottom: 24, letterSpacing: -2.5, textShadow: "0 2px 24px rgba(0,0,0,0.4)" }}>
                What if your next Flow was one prompt away?
              </h1>

              <p style={{ animation: "fadeUp 0.6s ease both", animationDelay: "0.2s", fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(16px, 2vw, 20px)", color: "rgba(255,255,255,0.82)", lineHeight: 1.55, maxWidth: 540, marginBottom: 36, textShadow: "0 1px 12px rgba(0,0,0,0.35)" }}>
                Ship Flows, fields, validation rules, and Apex <strong style={{ color: "#FFFFFF", fontWeight: 600 }}>10× faster</strong>. All from your terminal.
              </p>

              {/* primary CTA */}
              <div style={{ animation: "fadeUp 0.6s ease both", animationDelay: "0.3s", marginBottom: 18, width: "100%", maxWidth: 440 }}>
                <CTAButton large full onClick={openWaitlist}>Join the waitlist</CTAButton>
              </div>

              {/* trust row */}
              <div style={{ animation: "fadeUp 0.6s ease both", animationDelay: "0.4s", display: "flex", gap: 20, flexWrap: "wrap", justifyContent: "inherit" }}>
                {["∞ Lifetime Access", "Video Modules", "30-Day Guarantee"].map((t, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ color: COLORS.green, fontSize: 12 }}>✓</span>
                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.7)" }}>{t}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT: orbit graphic — you/Claude Code in the middle, the work around you */}
            <div className="hero-right" style={{ animation: "fadeUp 0.7s ease 0.3s both" }}>
              <HeroOrbit />
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS STRIP — quiet, no dividers, whitespace separates ── */}
      <div style={{ borderTop: `1px solid ${COLORS.border}`, borderBottom: `1px solid ${COLORS.border}`, padding: "40px 20px" }}>
        <div className="stats-strip">
          {[
            ["Claude Code", "Your only tool"],
            ["5 min", "To your first Flow"],
            ["0 lines", "Of code to write"],
          ].map(([num, label], i) => (
            <div key={i} className="stats-cell">
              <div className="stats-num" style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700, color: COLORS.textPrimary, letterSpacing: -1 }}>{num}</div>
              <div className="stats-label" style={{ fontFamily: "'DM Sans', sans-serif", color: COLORS.textMuted }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── PROBLEM (3×2 grid) ── */}
      <Section id="problem" style={{ background: COLORS.bg }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <H2 center>You know Salesforce. You just can't move fast enough.</H2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
          {[
            { title: "15 clicks. One field.", desc: "Create the field. Add it to the layout. Update the permission set. Assign the profile. Test in sandbox. Push to prod. You wanted a picklist. You got an afternoon." },
            { title: "Stuck in Jira ticket purgatory", desc: "You know the business logic cold. But you're writing tickets, pinging devs, and waiting two weeks for a change you could describe in two sentences." },
            { title: "Staring at the Flow canvas", desc: "You know what it should do. But elements, loops, and decision trees turn a 10-minute idea into a 3-hour build — plus the debugging when something breaks in UAT." },
            { title: "Googling validation syntax", desc: "ISPICKVAL or TEXT? AND or &&? You know the logic. You're losing 20 minutes every time to syntax you'll forget again next week." },
            { title: "Your backlog is getting worse", desc: "Leadership keeps asking what's taking so long. Every sprint ends with more added than shipped. The AI-fluent admin next door is shipping twice as fast." },
            { title: "AI already changed the job", desc: "Agentforce. Einstein Copilot. Anthropic MCP. Admins who can talk to their org in plain English are about to leap past the ones still hunting through Setup menus." },
          ].map((item, i) => (
            <ProblemCard key={i} i={i} {...item} />
          ))}
        </div>
      </Section>

      {/* ── AGITATE — editorial single-column, quote-forward ── */}
      <Section style={{ background: COLORS.surface }} maxWidth={760}>
        <H2>I used to be scared of Flows.</H2>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 18, lineHeight: 1.75, color: COLORS.textSecondary, marginTop: 24 }}>
          <p style={{ marginBottom: 20 }}>Real talk. Flows terrified me. The canvas, the decision elements, the loops. I'd stare at it for 20 minutes and still not know where to start.</p>
          <p style={{ marginBottom: 20 }}>Then LLMs came along and I thought okay, this changes everything. And it did help. I could ask ChatGPT how to build a flow and get step-by-step directions.</p>
          <p style={{ marginBottom: 0 }}>But here's the thing nobody talks about. Reading those directions, building it click by click, troubleshooting when something broke… that still took hours. I was getting the right answers. I just couldn't move fast enough to implement them.</p>
        </div>
        <blockquote style={{ marginTop: 48, paddingLeft: 24, borderLeft: `2px solid ${COLORS.orange}`, fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: "clamp(22px, 3.2vw, 30px)", fontWeight: 600, lineHeight: 1.3, color: COLORS.textPrimary, letterSpacing: -0.5 }}>
          Now I just tell Claude to build the flow. It goes into my org, creates it, and deploys it. All I do is go check that it works. What used to take me an afternoon takes 5 minutes.
        </blockquote>
      </Section>

      {/* ── HEADLESS FUTURE (Benioff proof) — 50/50 split ── */}
      <Section style={{ background: "radial-gradient(ellipse 85% 60% at 50% 20%, rgba(1,118,211,0.08), transparent 55%), linear-gradient(180deg, #EDE7DC 0%, #F6F2EA 100%)" }} maxWidth={1100}>
        {/* inline SVG filter defs used by the portrait (orange duotone) */}
        <svg width="0" height="0" style={{ position: "absolute", pointerEvents: "none" }} aria-hidden="true">
          <defs>
            <filter id="benioff-duotone">
              <feColorMatrix type="matrix" values="0.33 0.5 0.17 0 0  0.33 0.5 0.17 0 0  0.33 0.5 0.17 0 0  0 0 0 1 0" />
              <feComponentTransfer>
                <feFuncR tableValues="0.04 0.95" />
                <feFuncG tableValues="0.02 0.55" />
                <feFuncB tableValues="0.06 0.38" />
              </feComponentTransfer>
            </filter>
          </defs>
        </svg>

        <div className="benioff-grid">
          {/* LEFT: title + explanation */}
          <div>
            <SectionLabel>The future is headless</SectionLabel>
            <H2>Salesforce is going headless.</H2>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16.5, lineHeight: 1.7, color: COLORS.textSecondary, marginTop: 14 }}>
              Benioff just announced <strong style={{ color: COLORS.textPrimary }}>Salesforce Headless 360</strong> — every object, workflow, and Agentforce agent exposed as an API, MCP, and CLI. The browser is no longer the interface. The terminal is.
            </p>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16.5, lineHeight: 1.7, color: COLORS.textSecondary, marginTop: 14 }}>
              Here's what that means: every admin who only knows how to click through Setup is about to get lapped by admins who can prompt their org from the command line. The skill gap is opening right now.
            </p>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16.5, lineHeight: 1.7, color: COLORS.textPrimary, marginTop: 14, fontWeight: 500 }}>
              This course is how you end up on the right side of it — while it's still early.
            </p>
            <div style={{ marginTop: 22, padding: "12px 16px", background: "rgba(1,118,211,0.08)", border: "1px solid rgba(1,118,211,0.25)", borderRadius: 10, display: "inline-block" }}>
              <a href="https://x.com/Benioff/status/2044981547267395620" target="_blank" rel="noopener noreferrer" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: COLORS.sfBlue, textDecoration: "none", letterSpacing: 0.5 }}>
                → Read Benioff's full announcement
              </a>
            </div>
          </div>

          {/* RIGHT: terminal/ASCII Benioff portrait */}
          <div>
            <div className="benioff-portrait">
              <img src="benioff.png" alt="Marc Benioff, CEO of Salesforce, announcing Headless 360" />
              <div className="benioff-caption">marc_benioff.ceo@salesforce</div>
            </div>
          </div>
        </div>
      </Section>

      {/* ── BEFORE / AFTER ── */}
      <Section style={{ background: COLORS.surface }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
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
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14.5, color: COLORS.textMuted, marginTop: 8 }}>Tap a module. Watch it run.</p>
        </div>
        <FeatureShowcase />
      </Section>

      {/* ── SOCIAL PROOF ── */}
      <Section id="reviews" style={{ background: COLORS.surface }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <H2 center>What people are saying.</H2>
        </div>
        <TestimonialCarousel items={[
          { name: "Sarah K.", role: "Salesforce Admin · Series B SaaS", quote: "I built a lead routing flow in 10 minutes that would have taken me an entire afternoon. I keep looking for the catch.", accent: "#DA7756" },
          { name: "Marcus T.", role: "Sr. Admin · Healthcare", quote: "I've been an admin for 6 years and never touched a terminal. Did the setup and had my first flow deployed before lunch.", accent: "#8B5CF6" },
          { name: "Priya R.", role: "RevOps Lead · FinTech", quote: "Showed my VP the before and after. We cancelled the Agentforce eval the same week.", accent: "#0176D3" },
        ]} />
      </Section>

      {/* ── INSTRUCTOR (Meet your course instructor) — 30/70 split with watermark ── */}
      <Section style={{ background: COLORS.bg }} maxWidth={960}>
        <div className="amit-note-grid">
          <div className="instructor-watermark" aria-hidden="true">MEET THE<br />INSTRUCTOR</div>
          <div className="amit-note-image">
            <img src="amit-headshot.png" alt="Amit — 8x Salesforce Certified GTM Engineer and creator of CC for SF" />
          </div>
          <div style={{ position: "relative", zIndex: 2 }}>
            <SectionLabel>Meet your course instructor</SectionLabel>
            <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: "clamp(26px, 4vw, 34px)", fontWeight: 800, color: COLORS.textPrimary, marginBottom: 6, letterSpacing: -0.4 }}>Amit</h3>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12.5, color: COLORS.orange, marginBottom: 10, letterSpacing: 0.3 }}>8× Salesforce Certified · GTM Engineer · AI Tools Builder</p>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: `rgba(1,118,211,0.1)`, border: `1px solid rgba(1,118,211,0.2)`, borderRadius: 100, padding: "4px 12px", marginBottom: 18 }}>
              <span style={{ fontSize: 10, color: COLORS.sfBlue }}>●</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: COLORS.sfBlue, fontWeight: 600 }}>8× Salesforce Certifications</span>
            </div>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16.5, lineHeight: 1.7, color: COLORS.textSecondary, marginBottom: 0 }}>
              I've spent years in the Salesforce ecosystem doing RevOps, sales operations, and CRM architecture. I was the admin who was scared of Flows. When Claude Code came out, everything changed. I went from filing Jira tickets and waiting two weeks to just... building the thing myself. This course is everything I wish someone had shown me on day one.
            </p>
          </div>
        </div>
      </Section>

      {/* ── BONUSES (single bundle card) ── */}
      <Section style={{ background: COLORS.bg }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <SectionLabel>Bonuses</SectionLabel>
          <H2 center>Included free when you enroll today.</H2>
        </div>
        <BonusBundle items={[
          { icon: "📄", title: "CLAUDE.md Starter Template", desc: "The exact config file I use to connect Claude Code to my Salesforce org. Copy, paste, go.", value: 29 },
          { icon: "🛠️", title: "Claude Code Skill Pack for Salesforce", desc: "A pre-built set of slash-command skills for the 10 most common admin tasks — Flow generator, field migrator, validation-rule writer, Apex-test generator, Aura → LWC migrator. Drop them in your project and invoke with one command.", value: 149 },
          { icon: "🤝", title: "Private Community Access", desc: "A members-only Slack where admins share prompts, debug live, and trade what's working. Lifetime seat.", value: 299 },
        ]} />
      </Section>

      {/* ── THE MATH ── */}
      <Section style={{ background: COLORS.surface }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <H2 center>You're already paying more than this in wasted time.</H2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
          <div style={{ background: COLORS.surface2, borderRadius: 12, padding: 28, border: `1px solid ${COLORS.border}` }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 700, color: COLORS.textMuted, letterSpacing: 1.5, marginBottom: 20 }}>THE OLD WAY</div>
            {[["Agentforce license", "$125-$550/mo"], ["Extra SF license needed?", "Yes"], ["Implementation partner", "$50K-$150K"], ["Time to first automation", "8-12 weeks"], ["Who owns it?", "IT + vendor"]].map(([k, v], i) => (
              <div key={i} className="math-row" style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: COLORS.textMuted }}>{k}</span>
                <span className="math-value" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 600, color: "#EF4444", textAlign: "right" }}>{v}</span>
              </div>
            ))}
          </div>
          <div style={{ background: COLORS.surface2, borderRadius: 12, padding: 28, border: `2px solid ${COLORS.borderHover}`, boxShadow: `0 8px 40px rgba(218,119,86,0.06)` }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 700, color: COLORS.orange, letterSpacing: 1.5, marginBottom: 20 }}>WITH CLAUDE CODE</div>
            {[["Claude subscription", "$100/mo · Max plan"], ["Extra SF license needed?", "None. Zero. Nada."], ["This course", "$97 once"], ["Time to first automation", "Under an hour"], ["Who owns it?", "You"]].map(([k, v], i) => (
              <div key={i} className="math-row" style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: COLORS.textPrimary, display: "inline-flex", alignItems: "center" }}>
                  {k}
                  {k === "Claude subscription" && (
                    <InfoTip text="Not just for Salesforce. Claude Code also handles any codebase — writing, research, automation, analysis, and a lot more. One subscription, everywhere." />
                  )}
                </span>
                <span className="math-value" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 700, color: COLORS.orange, textAlign: "right" }}>{v}</span>
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
      <Section style={{ background: COLORS.bg }}>
        <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center", background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 16, padding: "40px 32px" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🛡️</div>
          <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 24, fontWeight: 800, color: COLORS.textPrimary, marginBottom: 12 }}>30-Day Risk-Free Guarantee</h3>
          <SubText center>Go through the whole course. Try the prompts in your own org. If you didn't find value or didn't level up your Salesforce admin skills, email me within 30 days and I'll refund every penny. No questions. No hoops. I'd rather you try it risk-free than wonder "what if."</SubText>
        </div>
      </Section>

      {/* ── PRICING CARD ── */}
      <Section id="pricing" style={{ background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(218,119,86,0.14), transparent 55%), radial-gradient(ellipse 70% 50% at 50% 100%, rgba(1,118,211,0.08), transparent 55%), #F6F2EA" }}>
        <div style={{ maxWidth: 500, margin: "0 auto" }}>
          <div className="pricing-card-wrap">
            <div className="pricing-card-inner">
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
                  <span style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 52, fontWeight: 800, color: COLORS.textPrimary, letterSpacing: -3 }}>$97</span>
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

              <div className="enroll-cta-wrap">
                <div style={{ position: "relative", overflow: "hidden", borderRadius: 10 }}>
                  <CTAButton large full onClick={openWaitlist}>JOIN THE WAITLIST</CTAButton>
                  <span className="enroll-sheen" aria-hidden="true" />
                </div>
              </div>

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
          <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: "clamp(26px, 5vw, 42px)", fontWeight: 800, color: COLORS.textPrimary, lineHeight: 1.12, marginBottom: 16, letterSpacing: -0.5 }}>
            Stop clicking.<br />Start prompting.
          </h2>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 17, color: COLORS.textSecondary, lineHeight: 1.6, marginBottom: 32 }}>
            $97 one-time. Lifetime access. 30-day money-back guarantee.
          </p>
          <CTAButton large onClick={openWaitlist}>Join the waitlist</CTAButton>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: COLORS.bg, padding: "32px 20px", borderTop: `1px solid ${COLORS.border}` }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 700 }}>
            <span style={{ color: COLORS.orange }}>cc</span>
            <span style={{ color: "rgba(26,24,21,0.28)" }}>_</span>
            <span style={{ color: "rgba(26,24,21,0.45)" }}>for</span>
            <span style={{ color: "rgba(26,24,21,0.28)" }}>_</span>
            <span style={{ color: COLORS.sfBlue }}>sf</span>
            <span style={{ color: "rgba(26,24,21,0.18)" }}>__c</span>
          </div>
          <div style={{ display: "flex", gap: 20 }}>
            {[
              { label: "Blog", href: "/blog" },
              { label: "About", href: "/about" },
              { label: "Terms", href: "/terms" },
              { label: "Privacy", href: "/privacy" },
              { label: "Refund Policy", href: "/refund" },
            ].map((item, i) => (
              <a key={i} href={item.href} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "rgba(26,24,21,0.5)", textDecoration: "none" }}>{item.label}</a>
            ))}
          </div>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "rgba(26,24,21,0.35)" }}>© 2026 CC for SF</span>
        </div>
      </footer>

      <WaitlistModal />
    </div>
  );
}

/* ══════════════════════════ SUB-COMPONENTS ══════════════════════════ */

function ProblemCard({ i, title, desc }) {
  return (
    <div
      style={{
        background: COLORS.surface,
        border: `1px solid ${COLORS.border}`,
        borderRadius: 10,
        padding: "28px 24px",
      }}
    >
      <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 10 }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600, color: COLORS.orange, letterSpacing: 1, flexShrink: 0 }}>{String(i + 1).padStart(2, "0")}</span>
        <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 18, fontWeight: 700, color: COLORS.textPrimary, margin: 0, letterSpacing: -0.3, lineHeight: 1.25 }}>{title}</h3>
      </div>
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14.5, color: COLORS.textSecondary, lineHeight: 1.65, margin: 0 }}>{desc}</p>
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
      <div className="bonus-sticker">
        <div className="bonus-sticker-label" style={{ fontSize: 12, opacity: 0.9, letterSpacing: 1.5, marginBottom: 2 }}>BUNDLE</div>
        <div className="bonus-sticker-amount" style={{ fontSize: 24, lineHeight: 1 }}>${total}</div>
        <div className="bonus-sticker-label" style={{ fontSize: 12, opacity: 0.9, letterSpacing: 1.5, marginTop: 2 }}>FREE</div>
      </div>

      <div className="bonus-card" style={{
        background: "linear-gradient(180deg, #FFFFFF, #FAF6EC)",
        border: `1px solid ${COLORS.border}`,
        borderRadius: 20,
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
              className="bonus-row"
              style={{
                borderBottom: i < items.length - 1 ? `1px dashed ${COLORS.border}` : "none",
                opacity: visible ? 1 : 0,
                animation: visible ? `unlockIn 0.6s ease ${i * 0.15}s both` : "none",
              }}
            >
              <div className="bonus-icon">0{i + 1}</div>

              <div className="bonus-content">
                <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: "clamp(15px, 4vw, 17px)", fontWeight: 700, color: COLORS.textPrimary, margin: "0 0 6px", lineHeight: 1.3, letterSpacing: -0.1 }}>
                  {it.title}
                </h3>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: COLORS.textSecondary, lineHeight: 1.5, margin: 0 }}>{it.desc}</p>
              </div>

              <div className="bonus-price-col">
                <span style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 20, fontWeight: 800, color: COLORS.orange, letterSpacing: -0.5 }}>
                  ${it.value}
                </span>
                <span style={{ fontSize: 12, color: COLORS.green, fontFamily: "'JetBrains Mono', monospace", letterSpacing: 0.3 }}>✓ incl.</span>
              </div>
            </div>
          ))}

          {/* total strip — $total struck, FREE WITH ENROLLMENT is the hero */}
          <div className="bonus-total">
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600, color: COLORS.textPrimary, letterSpacing: 0.3 }}>
              Total bundle value
            </span>
            <span className="bonus-total-right" style={{ display: "flex", alignItems: "baseline", gap: 12, flexWrap: "wrap" }}>
              <span style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: "clamp(22px, 5.5vw, 30px)", fontWeight: 800, color: COLORS.textMuted, textDecoration: "line-through", letterSpacing: -0.5 }}>${total}</span>
              <span style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: "clamp(20px, 5.5vw, 28px)", fontWeight: 800, color: COLORS.orange, letterSpacing: -0.3, textTransform: "uppercase" }}>Free with enrollment</span>
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
        <blockquote style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: "clamp(18px, 2.4vw, 24px)", lineHeight: 1.45, color: COLORS.textPrimary, margin: 0, marginBottom: 24, fontWeight: 500, letterSpacing: -0.3 }}>
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
              style={{ width: n === i ? 28 : 8, height: 8, padding: 0, borderRadius: 4, border: "none", background: n === i ? COLORS.orange : "rgba(26,24,21,0.15)", cursor: "pointer", transition: "width 0.3s, background 0.3s" }}
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
function HamburgerMenu({ onDark = false }) {
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
    { label: "Blog", href: "/blog" },
    { label: "About", href: "/about" },
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
          border: `1px solid ${onDark && !open ? "rgba(255,255,255,0.18)" : COLORS.border}`,
          background: open ? COLORS.surface2 : (onDark ? "rgba(255,255,255,0.08)" : "rgba(26,24,21,0.04)"),
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
          width: 18, height: 2, background: onDark && !open ? "#FFFFFF" : COLORS.textPrimary, borderRadius: 1,
          transition: "transform 0.25s, opacity 0.25s, background 0.2s",
          transform: open ? "translateY(6px) rotate(45deg)" : "none",
        }} />
        <span style={{
          width: 18, height: 2, background: onDark && !open ? "#FFFFFF" : COLORS.textPrimary, borderRadius: 1,
          transition: "opacity 0.2s, background 0.2s",
          opacity: open ? 0 : 1,
        }} />
        <span style={{
          width: 18, height: 2, background: onDark && !open ? "#FFFFFF" : COLORS.textPrimary, borderRadius: 1,
          transition: "transform 0.25s, background 0.2s",
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
            background: "rgba(255,252,246,0.97)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: `1px solid ${COLORS.border}`,
            borderRadius: 12,
            padding: 8,
            boxShadow: "0 20px 60px rgba(26,24,21,0.14)",
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
          <button
            onClick={() => { onLink(); openWaitlist(); }}
            style={{
              display: "block",
              width: "calc(100% - 8px)",
              margin: "4px 4px 2px",
              padding: "12px 14px",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 14.5,
              fontWeight: 800,
              color: "#fff",
              background: COLORS.orange,
              textAlign: "center",
              border: "none",
              cursor: "pointer",
              borderRadius: 8,
              letterSpacing: 0.3,
              boxShadow: "0 4px 16px rgba(218,119,86,0.3)",
            }}
          >
            Join the waitlist <span style={{ marginLeft: 4 }}>→</span>
          </button>
        </div>
      )}
    </div>
  );
}

/* ── Feature showcase (interactive tabs) ── */
// Monochrome line icons for the feature tabs. Each is a small SVG keyed by
// FEATURES[i].short. Stroke color is inherited from the button's color so the
// active-state CSS rule tints them orange automatically.
const ICONS = {
  Setup: (
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" /></svg>
  ),
  Fields: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="4" width="18" height="4" rx="1" />
      <rect x="3" y="10" width="18" height="4" rx="1" />
      <rect x="3" y="16" width="18" height="4" rx="1" />
    </svg>
  ),
  Flows: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="5" r="2.5" />
      <circle cx="5" cy="18" r="2.5" />
      <circle cx="19" cy="18" r="2.5" />
      <path d="M10.5 6.7 6.3 16M13.5 6.7l4.2 9.3" />
    </svg>
  ),
  Apex: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M9 4c-3 0-4 2-4 4v2c0 1.5-1 2-2 2 1 0 2 .5 2 2v2c0 2 1 4 4 4" />
      <path d="M15 4c3 0 4 2 4 4v2c0 1.5 1 2 2 2-1 0-2 .5-2 2v2c0 2-1 4-4 4" />
    </svg>
  ),
  Debug: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <ellipse cx="12" cy="13" rx="5" ry="6" />
      <path d="M9 4.5c.4-1 1.6-1.5 3-1.5s2.6.5 3 1.5" />
      <path d="M7 9H4M17 9h3M7 13H3M17 13h4M7 17l-3 2M17 17l3 2" />
    </svg>
  ),
  Prompts: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="4" y="5" width="16" height="14" rx="2" />
      <path d="M8 10l3 2-3 2M13 14h4" />
    </svg>
  ),
};

const FEATURES = [
  {
    icon: "⚡", short: "Setup",
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
    icon: "🏗️", short: "Fields",
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
    icon: "🔄", short: "Flows",
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
    icon: "📝", short: "Apex",
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
    icon: "🐛", short: "Debug",
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
    icon: "📋", short: "Prompts",
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

  const renderTerminal = () => (
    <div className="feat-panel" style={{ background: "#0E0E14", borderRadius: 14, overflow: "hidden", boxShadow: "0 30px 80px rgba(0,0,0,0.45)", border: `1px solid ${COLORS.border}` }}>
      <div style={{ padding: "11px 16px", background: "rgba(255,255,255,0.02)", display: "flex", gap: 7, alignItems: "center", borderBottom: `1px solid ${COLORS.border}` }}>
        <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#FF5F57" }} />
        <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#FEBC2E" }} />
        <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#28C840" }} />
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11.5, color: "rgba(255,255,255,0.4)", marginLeft: 12 }}>amit@dev-org — {feat.title.toLowerCase().replace(/[^a-z]+/g, "-").slice(0, 24)}</span>
      </div>
      <div key={active} style={{ padding: "24px 26px", fontFamily: "'JetBrains Mono', monospace", fontSize: "clamp(13px, 3.2vw, 13.5px)", lineHeight: 1.85, minHeight: 280 }}>
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
  );

  return (
    <div>
      {/* Tab row — flat modern tabs with monochrome line icons */}
      <div className="feat-tabs-row" role="tablist" aria-label="What you get">
        {FEATURES.map((f, i) => {
          const on = i === active;
          return (
            <button
              key={i}
              className={`feat-tab${on ? " is-active" : ""}`}
              onClick={() => handlePick(i)}
              role="tab"
              aria-selected={on}
              aria-pressed={on}
              aria-label={f.title}
            >
              <span className="feat-tab-inner">
                <span className="feat-tab-icon" aria-hidden="true">{ICONS[f.short]}</span>
                <span className="feat-tab-label">{f.short}</span>
              </span>
            </button>
          );
        })}
      </div>

      {/* Content panel (active tab's terminal) */}
      {renderTerminal()}

      {/* Caption beneath the panel */}
      <div key={`cap-${active}`} className="feat-caption" style={{ animation: "carouselSlide 0.45s ease both" }}>
        <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: "clamp(20px, 3.2vw, 26px)", fontWeight: 700, color: COLORS.textPrimary, letterSpacing: -0.3, lineHeight: 1.2, marginBottom: 8 }}>
          {feat.title}
        </h3>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(14.5px, 1.8vw, 16px)", color: COLORS.textSecondary, lineHeight: 1.6, margin: 0 }}>
          {feat.desc}
        </p>
      </div>
    </div>
  );
}

/* ── Small inline (i) tooltip — hover on desktop, tap to toggle on mobile ── */
function InfoTip({ text }) {
  const [open, setOpen] = useState(false);
  return (
    <span style={{ position: "relative", display: "inline-flex", marginLeft: 6, verticalAlign: "middle" }}>
      <button
        type="button"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onClick={(e) => { e.preventDefault(); setOpen((o) => !o); }}
        aria-label="More info"
        style={{
          width: 16, height: 16, borderRadius: "50%",
          border: `1px solid ${COLORS.border}`,
          background: COLORS.surface2,
          color: COLORS.textMuted,
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 10.5, fontWeight: 700,
          lineHeight: 1, padding: 0,
          cursor: "pointer",
          display: "inline-flex", alignItems: "center", justifyContent: "center",
        }}
      >i</button>
      {open && (
        <span
          role="tooltip"
          style={{
            position: "absolute",
            bottom: "calc(100% + 10px)",
            left: "50%",
            transform: "translateX(-50%)",
            width: "max-content",
            maxWidth: 260,
            padding: "10px 12px",
            background: "#1A1815",
            color: "#F6F2EA",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 12.5,
            lineHeight: 1.5,
            fontWeight: 500,
            letterSpacing: 0,
            textTransform: "none",
            borderRadius: 8,
            boxShadow: "0 8px 24px rgba(26,24,21,0.22)",
            zIndex: 20,
            whiteSpace: "normal",
            pointerEvents: "none",
          }}
        >
          {text}
          <span aria-hidden="true" style={{ position: "absolute", bottom: -4, left: "50%", transform: "translateX(-50%) rotate(45deg)", width: 8, height: 8, background: "#1A1815" }} />
        </span>
      )}
    </span>
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
        <SectionLabel>Return on Investment</SectionLabel>
        <H2 center>Return on your investment.</H2>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: COLORS.textSecondary, maxWidth: 560, margin: "10px auto 0", lineHeight: 1.55 }}>
          Drag the sliders. Watch the math move. The course pays for itself faster than you'd think.
        </p>
      </div>

      <div style={{ maxWidth: 920, margin: "0 auto", background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 16, padding: 28, boxShadow: "0 20px 60px rgba(26,24,21,0.08)" }}>
        {/* Calculator-style header bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", background: COLORS.surface3, border: `1px solid ${COLORS.border}`, borderRadius: 10, marginBottom: 22 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: COLORS.green, boxShadow: `0 0 8px ${COLORS.green}` }} />
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 700, color: COLORS.textSecondary, letterSpacing: 2 }}>ROI.CALC</span>
          </div>
          <span className="roi-hint-blink" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: COLORS.orange, letterSpacing: 1 }}>
            ← DRAG TO ADJUST
          </span>
        </div>

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
      <span style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: highlight ? 22 : (big ? 26 : 16), fontWeight: highlight || big ? 800 : 700, color: highlight ? COLORS.orange : COLORS.textPrimary, letterSpacing: big || highlight ? -0.5 : 0 }}>{value}</span>
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
/* ── Hero orbit graphic (mastra-inspired)
 * Central play button = "You, the admin"
 * Claude Code badge = the "head" attached above
 * 8 Salesforce primitives orbit around, connected via dotted bezier paths.
 * Clicking the center still plays the demo video via #demo anchor.
 */
function HeroOrbit() {
  // SVG units. Viewbox is 0 0 600 600.
  const C = 300;
  const R = 232;

  // 8 admin primitives. Colors span the brand palette + tasteful accents.
  const nodes = [
    { angle:   0, label: "SOQL",        color: "#0176D3" }, // top
    { angle:  45, label: "LWC",         color: "#8B5CF6" },
    { angle:  90, label: "Flows",       color: "#DA7756" }, // right
    { angle: 135, label: "Fields",      color: "#22C55E" },
    { angle: 180, label: "Validation",  color: "#FFB347" }, // bottom
    { angle: 225, label: "Apex",        color: "#EF4444" },
    { angle: 270, label: "Permissions", color: "#06B6D4" }, // left
    { angle: 315, label: "Layouts",     color: "#EC4899" },
  ];

  // Bezier from (C, C) to a point on the orbit circle with a perpendicular
  // offset to make it feel organic rather than a straight ray.
  const pathFor = (angleDeg) => {
    const rad = (angleDeg - 90) * Math.PI / 180;
    const ex = C + R * Math.cos(rad);
    const ey = C + R * Math.sin(rad);
    // Perpendicular unit vector (rotated 90° from radial direction)
    const px = -Math.sin(rad);
    const py =  Math.cos(rad);
    // Two control points, offset slightly on opposite sides of the line
    const cp1x = C + (ex - C) * 0.30 + px * 38;
    const cp1y = C + (ey - C) * 0.30 + py * 38;
    const cp2x = C + (ex - C) * 0.70 - px * 32;
    const cp2y = C + (ey - C) * 0.70 - py * 32;
    return { d: `M ${C} ${C} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${ex} ${ey}`, ex, ey };
  };

  return (
    <div className="hero-orbit">
      <style>{`
        @keyframes orbitDash { to { stroke-dashoffset: -40; } }
        .hero-orbit { position: relative; width: 100%; max-width: 560px; aspect-ratio: 1 / 1; margin: 0 auto; }
        .hero-orbit svg { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; }
        .orbit-path { animation: orbitDash 6s linear infinite; }
        .orbit-pill { font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; }
        .orbit-center {
          position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
          display: flex; flex-direction: column; align-items: center; gap: 10px;
          text-decoration: none; z-index: 2;
        }
        .orbit-head {
          background: ${COLORS.orange}; color: #fff;
          padding: 5px 12px; border-radius: 100px;
          font-family: 'JetBrains Mono', monospace; font-size: 10.5px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase;
          white-space: nowrap; box-shadow: 0 6px 18px rgba(218,119,86,0.45);
          position: relative;
        }
        .orbit-head::after {
          content: ""; position: absolute; left: 50%; bottom: -6px; transform: translateX(-50%);
          width: 2px; height: 8px; background: ${COLORS.orange}; opacity: 0.55;
        }
        .orbit-play {
          width: 96px; height: 96px; border-radius: 50%;
          background: ${COLORS.orange};
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 12px 40px rgba(218,119,86,0.4), 0 0 0 10px rgba(218,119,86,0.12), 0 0 0 22px rgba(218,119,86,0.05);
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .orbit-center:hover .orbit-play { transform: scale(1.05); box-shadow: 0 16px 48px rgba(218,119,86,0.55), 0 0 0 10px rgba(218,119,86,0.18), 0 0 0 26px rgba(218,119,86,0.08); }
        .orbit-you {
          font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 500; letter-spacing: 2px; text-transform: uppercase;
          color: ${COLORS.textSecondary}; white-space: nowrap; margin-top: 4px;
        }
      `}</style>

      <svg viewBox="0 0 600 600" aria-hidden="true">
        <defs>
          {/* soft radial halo behind the center */}
          <radialGradient id="orbit-halo" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(218,119,86,0.22)" />
            <stop offset="55%" stopColor="rgba(218,119,86,0.05)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0)" />
          </radialGradient>
        </defs>
        <circle cx={C} cy={C} r={R + 80} fill="url(#orbit-halo)" />

        {nodes.map((n, i) => {
          const { d, ex, ey } = pathFor(n.angle);
          const w = n.label.length > 6 ? 108 : 86;
          const h = 34;
          return (
            <g key={n.label}>
              <path
                className="orbit-path"
                d={d}
                fill="none"
                stroke={n.color}
                strokeOpacity="0.55"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeDasharray="2 7"
                style={{ animationDelay: `${-i * 0.4}s` }}
              />
              <rect
                x={ex - w / 2}
                y={ey - h / 2}
                width={w}
                height={h}
                rx={h / 2}
                fill="#0a0a0a"
                stroke={n.color}
                strokeOpacity="0.75"
                strokeWidth="1.5"
                strokeDasharray="2 5"
              />
              <text
                x={ex}
                y={ey + 1}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={n.color}
                className="orbit-pill"
              >
                {n.label}
              </text>
            </g>
          );
        })}
      </svg>

      <a href="#demo" className="orbit-center" aria-label="Watch full demo — full Flow built in under 5 minutes">
        <span className="orbit-head">Claude Code</span>
        <span className="orbit-play">
          <svg width="30" height="34" viewBox="0 0 28 32" fill="#fff" aria-hidden="true" style={{ marginLeft: 4 }}>
            <path d="M26 14.268L2 .536v30.928L26 17.732a2 2 0 0 0 0-3.464z" />
          </svg>
        </span>
        <span className="orbit-you">You, the admin</span>
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
