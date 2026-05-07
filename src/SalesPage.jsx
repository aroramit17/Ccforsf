import { useState, useEffect, useRef } from "react";
import SEO from "./components/SEO.jsx";
import PromoBar from "./components/PromoBar.jsx";
import { getFeaturedHomepageGuides } from "./lib/posts.js";
import "./SalesPage.css";

/* ══════════════════════════ CONSTANTS ══════════════════════════ */

const ENROLL_HASH = "#enroll";
const THRIVECART_EMBED_ID = "tc-webpay-57-R3BT08";
const TYPEWRITER_WORDS = [
  "fields",
  "permission sets",
  "profiles",
  "flows",
  "validation rules",
  "Apex classes",
  "test classes",
];

const FAQS = [
  { q: "Do I need to know how to code?", a: "No. The whole course assumes zero coding background. Claude Code writes the code. You describe what you want in plain English." },
  { q: "What do I need to get started?", a: "A Claude Pro subscription ($20/month) and a Salesforce org that supports Salesforce DX (Enterprise, Unlimited, or Developer edition). The course walks you through everything." },
  { q: "How is this different from Agentforce?", a: "Agentforce is a Salesforce product that costs $125-$550/user/month plus implementation. Claude Code runs on a Claude Pro subscription from Anthropic ($20/month) and connects directly to your org. No Salesforce add-on license needed." },
  { q: "How long do I have access?", a: "Lifetime. Watch it once, come back anytime. All future updates are included." },
  { q: "What if I don't like it?", a: "Go through the course and if you didn't find value or didn't level up your Salesforce admin skills, email me within 30 days for a full refund. No questions asked." },
  { q: "Is this safe for my production org?", a: "Great question. Security is the #1 concern for admins, and it should be. In this course we work in a Salesforce sandbox, not production. Claude Code respects Salesforce's existing security model. It uses the same API permissions your user already has. And when you're ready to push changes to production, you still follow the same rigorous deployment process (change sets, CI/CD, whatever your org uses). Nothing bypasses your existing safeguards." },
  { q: "Does Claude Code store my Salesforce data?", a: "No. Claude Code is a local CLI that runs on your machine. Your metadata stays yours. It reads project files locally, sends only the relevant context to Anthropic's API to generate a response, and writes the output back to your local repo. Salesforce records, customer data, and credentials never leave your environment unless you explicitly paste them into a prompt." },
  { q: "Is this \"Shadow AI\"? What about compliance?", a: "Claude Code uses your existing Salesforce login and respects every permission, profile, sharing rule, and SOX control already in place. There is no separate AI service connected to your org. Claude only sees what you, the authenticated user, would see. All deploys go through the same change-set / CI/CD path your security team already approved. Anthropic's API does not train on your data (Pro and Max plans are excluded from training by default)." },
  { q: "Is this affiliated with Salesforce or Anthropic?", a: "No. This is an independent course. Salesforce and Claude are trademarks of their respective companies." },
];

const HOMEPAGE_JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Course",
      "@id": "https://ccforsf.com/#course",
      "name": "Claude Code for Salesforce Admins",
      "description": "A hands-on mini-course that teaches Salesforce Admins how to use Claude Code to build Flows, custom fields, validation rules, and Apex without clicking through Setup or writing code by hand.",
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
        "url": "https://ccforsf.com/#enroll",
      },
      "hasCourseInstance": {
        "@type": "CourseInstance",
        "courseMode": "Online",
        "courseWorkload": "PT4H",
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

/* ══════════════════════════ HOOKS ══════════════════════════ */

function useScrolled(threshold = 24) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);
  return scrolled;
}

function useTheme() {
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "light";
    const stored = window.localStorage.getItem("ccsf-theme");
    if (stored === "dark" || stored === "light") return stored;
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.style.colorScheme = theme;
    try { window.localStorage.setItem("ccsf-theme", theme); } catch {}
  }, [theme]);

  const toggle = () => setTheme((t) => (t === "dark" ? "light" : "dark"));
  return { theme, toggle };
}

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".ccsf-root .reveal");
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("in"));
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

/* ══════════════════════════ COMPONENTS ══════════════════════════ */

function ThemeToggle({ className = "" }) {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";
  return (
    <button
      type="button"
      onClick={toggle}
      className={`theme-toggle ${className}`}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={isDark}
      title={isDark ? "Light mode" : "Dark mode"}
    >
      <span className="theme-toggle-track">
        <span className="theme-toggle-icon theme-toggle-icon--sun" aria-hidden="true">☀</span>
        <span className="theme-toggle-icon theme-toggle-icon--moon" aria-hidden="true">☾</span>
        <span className="theme-toggle-thumb" aria-hidden="true" />
      </span>
    </button>
  );
}

function Nav() {
  const scrolled = useScrolled();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e) => { if (e.key === "Escape") setMenuOpen(false); };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  const close = () => setMenuOpen(false);

  return (
    <nav className={`nav ${scrolled ? "scrolled" : ""}`}>
      <a href="#top" className="nav-mark" onClick={close}>
        <span className="glyph">CC</span>
        <span>CC&nbsp;<span style={{ color: "var(--ink-400)" }}>/</span>&nbsp;SF</span>
      </a>
      <div className="nav-links">
        <a href="#model">The Model</a>
        <a href="#build">What you'll build</a>
        <a href="#walkthrough">Watch</a>
        <a href="#curriculum">Curriculum</a>
        <a href={ENROLL_HASH}>Pricing</a>
        <ThemeToggle className="theme-toggle--nav" />
        <a href={ENROLL_HASH} className="btn btn--primary nav-enroll" style={{ padding: "10px 18px" }}>
          Enroll <span className="arrow">→</span>
        </a>
      </div>

      <ThemeToggle className="theme-toggle--mobile" />

      <button
        type="button"
        className={`nav-burger ${menuOpen ? "nav-burger--open" : ""}`}
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        aria-expanded={menuOpen}
        aria-controls="ccsf-mobile-menu"
        onClick={() => setMenuOpen((v) => !v)}
      >
        <span /><span /><span />
      </button>

      <div
        id="ccsf-mobile-menu"
        className={`nav-mobile ${menuOpen ? "nav-mobile--open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-hidden={!menuOpen}
      >
        <a href="#model" onClick={close}>The Model</a>
        <a href="#build" onClick={close}>What you'll build</a>
        <a href="#walkthrough" onClick={close}>Watch</a>
        <a href="#curriculum" onClick={close}>Curriculum</a>
        <a href="#faq" onClick={close}>FAQ</a>
        <a href={ENROLL_HASH} onClick={close}>Pricing</a>
        <a href={ENROLL_HASH} className="btn btn--primary nav-mobile-cta" onClick={close}>
          Get Lifetime Access for $97 <span className="arrow">→</span>
        </a>
      </div>
    </nav>
  );
}

function StickyEnroll() {
  const scrolled = useScrolled(600);
  return (
    <a
      href={ENROLL_HASH}
      className={`sticky-enroll ${scrolled ? "sticky-enroll--show" : ""}`}
      aria-label="Enroll, get lifetime access for $97"
    >
      <span className="sticky-enroll-text">Get Lifetime Access: $97</span>
      <span className="arrow">→</span>
    </a>
  );
}

function HeroComposition() {
  return (
    <div className="hero-comp">
      <svg className="hero-annotations" viewBox="0 0 600 640" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <pattern id="ccsf-dotpat" width="14" height="14" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="0.6" fill="rgba(26,25,22,0.18)" />
          </pattern>
        </defs>
        <rect width="600" height="640" fill="url(#ccsf-dotpat)" opacity="0.5" />
        <g stroke="rgba(26,25,22,0.22)" strokeWidth="0.5" fill="none">
          <line x1="0" y1="80" x2="600" y2="80" strokeDasharray="2,3" />
          <line x1="0" y1="320" x2="600" y2="320" strokeDasharray="2,3" />
          <line x1="0" y1="560" x2="600" y2="560" strokeDasharray="2,3" />
        </g>
        <g fontFamily="var(--mono)" fontSize="9" fill="rgba(26,25,22,0.45)" letterSpacing="1">
          <text x="6" y="76">A: PROMPT</text>
          <text x="6" y="316">B: CONTEXT</text>
          <text x="6" y="556">C: OUTPUT</text>
        </g>
      </svg>

      <div className="hero-card hero-card--prompt artifact">
        <div className="artifact-header">
          <span>prompt.md</span>
          <span className="artifact-dots"><span /><span /><span /></span>
        </div>
        <div style={{ padding: "18px 20px", fontFamily: "var(--mono)", fontSize: "12.5px", lineHeight: 1.65, color: "var(--ink-800)" }}>
          <span style={{ color: "var(--ink-400)" }}>{">"} </span>
          Build a validation rule preventing<br />
          <span style={{ paddingLeft: "14px" }}>opportunities from closing without</span><br />
          <span style={{ paddingLeft: "14px" }}>a primary contact role.</span>
          <span className="cursor-blink">▍</span>
        </div>
      </div>

      <div className="hero-card hero-card--meta artifact">
        <div className="artifact-header">
          <span>org · metadata</span>
          <span style={{ color: "var(--accent)" }}>● connected</span>
        </div>
        <div style={{ padding: "14px 18px" }}>
          <div className="meta-tree">
            <div className="meta-row"><span className="meta-key">objects/</span><span className="meta-val">94</span></div>
            <div className="meta-row meta-row--child"><span className="meta-key">Opportunity.object</span><span className="meta-val">read</span></div>
            <div className="meta-row meta-row--child"><span className="meta-key">OpportunityContactRole</span><span className="meta-val">scan</span></div>
            <div className="meta-row"><span className="meta-key">flows/</span><span className="meta-val">28</span></div>
            <div className="meta-row"><span className="meta-key">validationRules/</span><span className="meta-val">142</span></div>
          </div>
        </div>
      </div>

      <div className="hero-card hero-card--output artifact">
        <div className="artifact-header">
          <span>RequirePrimaryContactRole.rule</span>
          <span style={{ color: "var(--ink-500)" }}>generated · 4s</span>
        </div>
        <div style={{ padding: "16px 18px", fontFamily: "var(--mono)", fontSize: "11.5px", lineHeight: 1.7, color: "var(--ink-800)" }}>
          <div><span style={{ color: "var(--ink-400)" }}>1</span>&nbsp;&nbsp;<span style={{ color: "var(--accent)" }}>AND</span>(</div>
          <div><span style={{ color: "var(--ink-400)" }}>2</span>&nbsp;&nbsp;&nbsp;&nbsp;ISPICKVAL(StageName, <span style={{ color: "#0B6E5F" }}>"Closed Won"</span>),</div>
          <div><span style={{ color: "var(--ink-400)" }}>3</span>&nbsp;&nbsp;&nbsp;&nbsp;NOT(<span style={{ color: "var(--accent)" }}>HasPrimaryContact__c</span>)</div>
          <div><span style={{ color: "var(--ink-400)" }}>4</span>&nbsp;&nbsp;)</div>
        </div>
      </div>

      <svg className="hero-connectors" viewBox="0 0 600 640" aria-hidden="true">
        <g stroke="var(--accent)" strokeWidth="1" fill="none" strokeDasharray="3,4">
          <path d="M 320 130 L 320 200" />
          <path d="M 320 380 L 320 460" />
        </g>
        <g fill="var(--accent)">
          <circle cx="320" cy="130" r="3" />
          <circle cx="320" cy="200" r="3" />
          <circle cx="320" cy="380" r="3" />
          <circle cx="320" cy="460" r="3" />
        </g>
      </svg>

      <div className="hero-corner-tag tag">
        <span className="dot" /> Live composition
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className="hero" id="top">
      <div className="grid-overlay" />
      <div className="shell hero-grid">
        <div className="hero-copy">
          <div className="hero-meta hero-meta--coords-only">
            <div className="hero-coords">
              <span>37.7749° N</span>
              <span>/</span>
              <span>SF·26</span>
            </div>
          </div>

          <h1 className="display">
            The modern<br />
            Salesforce Admin<br />
            doesn't just manage the org.<br />
            <em>They prompt it.</em>
          </h1>

          <p className="lead" style={{ marginTop: "40px" }}>
            Stop Clicking. Start Prompting. Build &amp; Deploy Salesforce Flows in
            5&nbsp;Minutes. No Code Required.
          </p>

          <div className="hero-ctas">
            <a href={ENROLL_HASH} className="btn btn--primary">
              Get Lifetime Access for $97 <span className="arrow">→</span>
            </a>
            <a href="#model" className="btn btn--ghost">
              See how it works
            </a>
          </div>

          <div className="hero-proof">
            <div className="proof-item">
              <span className="proof-num">01</span>
              <span className="proof-label">No terminal experience required</span>
            </div>
            <div className="proof-item">
              <span className="proof-num">02</span>
              <span className="proof-label">Built for Salesforce Admins</span>
            </div>
            <div className="proof-item">
              <span className="proof-num">03</span>
              <span className="proof-label">Hands-on mini-course</span>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <HeroComposition />
        </div>
      </div>

      <div className="hero-footer shell">
        <div className="measure-line measure-line--full">
          <span>SECTION 01 / HERO</span>
        </div>
      </div>
    </section>
  );
}

const RIBBON_PATH = "M -120 230 C 240 60, 540 400, 820 200 S 1380 40, 1720 230";
const RIBBON_BASE_SPEED = 0.085;   // % of path length per frame at 60fps
const RIBBON_HOVER_SPEED = 0.022;  // slowed-down speed when desktop user hovers
const RIBBON_REPS = 12;            // how many times to repeat the tagline list inside textPath

function Marquee() {
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const textPathRef = useRef(null);
  const pathRef = useRef(null);
  const speedRef = useRef(RIBBON_BASE_SPEED);

  const items = [
    "Flow builder, faster",
    "Validation rules in plain English",
    "Metadata-aware",
    "Sandbox-safe",
    "Built for admins",
    "No dev queue",
    "Claude Code as partner",
    "Org-aware execution",
  ];
  const oneCycle = items.join("    ✱    ") + "    ✱    ";
  const ribbonText = oneCycle.repeat(RIBBON_REPS);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let offset = 0;
    let cyclePercent = 12; // fallback; replaced after first measurement

    const measure = () => {
      const tp = textPathRef.current;
      const path = pathRef.current;
      if (!tp || !path) return;
      try {
        const pathLen = path.getTotalLength();
        const textLen = tp.getComputedTextLength();
        if (pathLen > 0 && textLen > 0) {
          const cycleLen = textLen / RIBBON_REPS;
          cyclePercent = (cycleLen / pathLen) * 100;
        }
      } catch {
        /* getComputedTextLength can throw if not yet laid out */
      }
    };

    const loop = () => {
      offset -= speedRef.current;
      if (offset <= -cyclePercent) offset += cyclePercent;
      const tp = textPathRef.current;
      if (tp) tp.setAttribute("startOffset", `${offset}%`);
      raf = requestAnimationFrame(loop);
    };

    // Wait one frame so the textPath has been laid out before we measure
    requestAnimationFrame(() => {
      measure();
      raf = requestAnimationFrame(loop);
    });

    const onResize = () => measure();
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  // Desktop-only mouse-follow parallax. Tracks cursor over the section,
  // lerps a transform on the stage. Skipped on touch devices.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!canHover) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const section = sectionRef.current;
    const stage = stageRef.current;
    if (!section || !stage) return;

    let targetX = 0, targetY = 0; // -1..1
    let curX = 0, curY = 0;
    let raf = 0;
    let active = false;

    const apply = () => {
      const tx = curX * 36;          // px
      const ty = curY * 18;          // px
      const rot = curX * 2.4;        // deg
      stage.style.transform = `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, 0) rotate(${rot.toFixed(2)}deg)`;
    };

    const tick = () => {
      // Lerp toward target with damping
      curX += (targetX - curX) * 0.09;
      curY += (targetY - curY) * 0.09;
      apply();
      // Stop the loop when essentially at rest and not active
      const settled = Math.abs(curX - targetX) < 0.001 && Math.abs(curY - targetY) < 0.001;
      if (active || !settled) {
        raf = requestAnimationFrame(tick);
      } else {
        raf = 0;
      }
    };

    const ensureLoop = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const onMove = (e) => {
      const r = section.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;   // 0..1
      const y = (e.clientY - r.top) / r.height;   // 0..1
      targetX = Math.max(-1, Math.min(1, (x - 0.5) * 2));
      targetY = Math.max(-1, Math.min(1, (y - 0.5) * 2));
      ensureLoop();
    };
    const onEnter = () => { active = true; ensureLoop(); };
    const onLeave = () => {
      active = false;
      targetX = 0;
      targetY = 0;
      ensureLoop();
    };

    section.addEventListener("mouseenter", onEnter);
    section.addEventListener("mouseleave", onLeave);
    section.addEventListener("mousemove", onMove);

    return () => {
      section.removeEventListener("mouseenter", onEnter);
      section.removeEventListener("mouseleave", onLeave);
      section.removeEventListener("mousemove", onMove);
      if (raf) cancelAnimationFrame(raf);
      stage.style.transform = "";
    };
  }, []);

  const handleEnter = () => { speedRef.current = RIBBON_HOVER_SPEED; };
  const handleLeave = () => { speedRef.current = RIBBON_BASE_SPEED; };

  return (
    <section
      className="ribbon-section"
      aria-label="Course taglines"
      ref={sectionRef}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <div className="ribbon-stage" ref={stageRef}>
        <svg
          className="ribbon-svg"
          viewBox="0 0 1600 460"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
        >
          <defs>
            <path id="ribbon-curve" ref={pathRef} d={RIBBON_PATH} fill="none" />
            <linearGradient id="ribbon-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="55%" stopColor="#F5F1E8" />
              <stop offset="100%" stopColor="#E5DFCD" />
            </linearGradient>
            <filter id="ribbon-shadow" x="-10%" y="-10%" width="120%" height="160%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="6" />
              <feOffset dy="6" />
              <feComponentTransfer><feFuncA type="linear" slope="0.18" /></feComponentTransfer>
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <g filter="url(#ribbon-shadow)">
            <path
              d={RIBBON_PATH}
              fill="none"
              stroke="url(#ribbon-grad)"
              strokeWidth="40"
              strokeLinecap="round"
            />
            <text className="ribbon-text">
              <textPath ref={textPathRef} href="#ribbon-curve" startOffset="0%">
                {ribbonText}
              </textPath>
            </text>
          </g>
        </svg>
      </div>
      <p className="ribbon-sr">{items.join(" · ")}</p>
    </section>
  );
}

function Friction() {
  const frictions = [
    { n: "01", title: "The dev queue", body: "Every non-trivial change waits two weeks behind a Jira ticket. Momentum dies in the backlog." },
    { n: "02", title: "The click-tax", body: "Repetitive setup, picklist-by-picklist, page-layout-by-page-layout. Hours on work that should take minutes." },
    { n: "03", title: "The context loss", body: "Documentation drifts. Tribal knowledge walks out the door. Each new request starts from zero." },
    { n: "04", title: "The fear ceiling", body: "Flow Builder. Apex. Triggers. The line between “admin work” and “developer work” has been gatekeeping leverage." },
  ];
  return (
    <section className="section section-divider reveal" id="friction">
      <div className="shell">
        <div className="block-head">
          <div className="eyebrow"><span className="num">02</span>The legacy workflow</div>
          <div className="block-head-meta">A problem statement</div>
        </div>

        <div className="friction-grid">
          <div className="friction-lead">
            <h2 className="display">
              Admin work, as<br />
              <em>currently designed,</em><br />
              is a bottleneck.
            </h2>
            <p className="lead" style={{ marginTop: "32px" }}>
              Finally bridge the gap between "I know what the business needs" and "I don't
              know how to write the Apex for it." Be your own developer.
            </p>
          </div>

          <ol className="friction-list">
            {frictions.map((f) => (
              <li className="friction-item" key={f.n}>
                <div className="friction-num">{f.n}</div>
                <div className="friction-body">
                  <h4 className="friction-title">{f.title}</h4>
                  <p className="friction-text">{f.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function ModelDiagram() {
  const stages = [
    { label: "Prompt", body: "Plain English request from the admin", code: "PROMPT" },
    { label: "Claude Code", body: "Reads your project context", code: "AGENT" },
    { label: "Org Context", body: "Metadata, schemas, flows, rules", code: "META" },
    { label: "Reviewed Output", body: "You read it. You approve it.", code: "DIFF" },
    { label: "Sandbox", body: "Validate before production", code: "SBX" },
    { label: "Production", body: "Deploy with confidence", code: "PROD" },
  ];
  return (
    <div className="model-diagram">
      {stages.map((s, i) => (
        <div className="model-stage" key={s.code}>
          <div className="model-stage-num">{String(i + 1).padStart(2, "0")}</div>
          <div className="model-stage-card">
            <div className="model-stage-code">{s.code}</div>
            <div className="model-stage-label">{s.label}</div>
            <div className="model-stage-body">{s.body}</div>
          </div>
          {i < stages.length - 1 && <div className="model-arrow">→</div>}
        </div>
      ))}
    </div>
  );
}

function ProjectFiles() {
  const files = [
    {
      n: "01",
      name: "claude.md",
      label: "The voice.",
      body: "Tone, naming conventions, what \"good\" looks like in your org. The model writes the way you write.",
    },
    {
      n: "02",
      name: "project.md",
      label: "The map.",
      body: "Objects, fields, flows, business processes you actually run. Written once, referenced forever.",
    },
    {
      n: "03",
      name: "agents.md",
      label: "The crew.",
      body: "Specialized agents for flow review, security audit, documentation, migration. Wired up, ready to call.",
    },
  ];

  const claudeMdContent = `# CC for SF · org

> Voice. Naming. Guardrails.

## Voice
- Plain language. Short sentences.
- Show the diff before you propose.

## Conventions
- Custom fields end in __c
- Flows live in /flows
- Validation rules use AND() / NOT()

## Guardrails
- Sandbox first. Always.
- No bulk DML without review.`;

  return (
    <div className="model-files">
      <div className="model-files-meta">
        <div className="eyebrow">Project structure</div>
        <div className="block-head-meta">Three files · one folder</div>
      </div>

      <div className="model-files-grid">
        <div className="model-files-copy">
          <h3 className="display">
            Open VS Code.<br />
            Drop in your org.<br />
            <em>That's the install.</em>
          </h3>
          <p className="lead" style={{ marginTop: "20px" }}>
            Claude Code reads three plain text files the way a new hire reads
            onboarding docs. Write them once. The model speaks fluent your-org
            from then on.
          </p>

          <ol className="files-list">
            {files.map((f) => (
              <li className="files-item" key={f.n}>
                <div className="files-item-num">{f.n}</div>
                <div>
                  <div className="files-item-name"><span className="files-mono">{f.name}</span></div>
                  <div className="files-item-label">{f.label}</div>
                  <div className="files-item-body">{f.body}</div>
                </div>
              </li>
            ))}
          </ol>

          <p className="files-closer">Three files. No syntax. No magic. Just context.</p>
        </div>

        <div className="vscode" aria-label="VS Code wireframe">
          <div className="vscode-titlebar">
            <span className="vscode-traffic"><span /><span /><span /></span>
            <span className="vscode-titlebar-text">ccforsf-org / claude.md</span>
            <span className="vscode-titlebar-meta">VS&nbsp;Code</span>
          </div>
          <div className="vscode-body">
            <div className="vscode-activitybar" aria-hidden="true">
              <span className="vscode-act vscode-act--active">▢</span>
              <span className="vscode-act">⌕</span>
              <span className="vscode-act">⎇</span>
              <span className="vscode-act">⊕</span>
            </div>
            <div className="vscode-sidebar">
              <div className="vscode-sidebar-h">EXPLORER</div>
              <div className="vscode-sidebar-folder">▾ ccforsf-org</div>
              <div className="vscode-sidebar-file vscode-sidebar-file--active">
                <span className="vscode-fi">md</span>
                <span>claude.md</span>
              </div>
              <div className="vscode-sidebar-file">
                <span className="vscode-fi">md</span>
                <span>project.md</span>
              </div>
              <div className="vscode-sidebar-file">
                <span className="vscode-fi">md</span>
                <span>agents.md</span>
              </div>
              <div className="vscode-sidebar-folder vscode-sidebar-folder--collapsed">▸ flows</div>
              <div className="vscode-sidebar-folder vscode-sidebar-folder--collapsed">▸ objects</div>
              <div className="vscode-sidebar-folder vscode-sidebar-folder--collapsed">▸ permissionsets</div>
            </div>
            <div className="vscode-editor">
              <div className="vscode-tabs" aria-hidden="true">
                <div className="vscode-tab vscode-tab--active">claude.md</div>
              </div>
              <pre className="vscode-code">{claudeMdContent}</pre>
            </div>
          </div>
          <div className="vscode-statusbar">
            <span>main</span>
            <span>UTF-8</span>
            <span>Markdown</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function TypewriterHeadline() {
  const [wordIndex, setWordIndex] = useState(0);
  const [letters, setLetters] = useState(TYPEWRITER_WORDS[0]);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    if (prefersReducedMotion) return undefined;

    const fullWord = TYPEWRITER_WORDS[wordIndex];
    let delay = deleting ? 42 : 74;

    if (!deleting && letters === fullWord) {
      delay = 1200;
    } else if (deleting && letters === "") {
      delay = 220;
    }

    const timeout = window.setTimeout(() => {
      if (!deleting && letters === fullWord) {
        setDeleting(true);
        return;
      }

      if (deleting && letters === "") {
        setDeleting(false);
        setWordIndex((i) => (i + 1) % TYPEWRITER_WORDS.length);
        return;
      }

      setLetters((current) => (
        deleting ? fullWord.slice(0, Math.max(0, current.length - 1)) : fullWord.slice(0, current.length + 1)
      ));
    }, delay);

    return () => window.clearTimeout(timeout);
  }, [deleting, letters, wordIndex]);

  return (
    <h2 className="display model-typewriter-headline">
      Ship{" "}
      <em className="typewriter-word" aria-live="polite">
        {letters || "\u00a0"}
      </em>
      <br />
      at the speed of light.
    </h2>
  );
}

function NewModel() {
  return (
    <section className="section section-divider reveal" id="model">
      <div className="shell">
        <div className="block-head">
          <div className="eyebrow"><span className="num">03</span>The new operating model</div>
          <div className="block-head-meta">Prompt-driven · Metadata-aware · Sandbox-validated</div>
        </div>

        <div className="model-intro">
          <TypewriterHeadline />
          <p className="lead" style={{ marginTop: "28px", maxWidth: "62ch" }}>
            One prompt. One reviewable diff. One deploy. The kind of work that used to
            mean a Jira ticket, two sprints of waiting, and an apology email to the VP of
            Sales, done before your second coffee.
          </p>
        </div>

        <ModelDiagram />

        <ProjectFiles />
      </div>
    </section>
  );
}

function HeadlessFuture() {
  return (
    <section className="section section-divider reveal" id="headless">
      <div className="shell">
        <div className="block-head">
          <div className="eyebrow"><span className="num">Signal</span>The future is headless</div>
          <div className="block-head-meta">API-first · CLI-ready · AI-native</div>
        </div>

        <div className="headless-grid">
          <div className="headless-copy">
            <h2 className="display">
              The UI is dying.<br />
              <em>Admins who adapt win.</em>
            </h2>
            <div className="headless-body">
              <p>
                Salesforce is moving to APIs, CLI, and AI-first workflows.
                Clicking through Setup will not be enough anymore.
              </p>
              <p>
                Admins who can command Salesforce will build faster, earn more,
                and stay in demand.
              </p>
              <p>
                This is how you get ahead before everyone else catches on.
              </p>
            </div>
          </div>

          <figure className="headless-media">
            <div className="headless-image-wrap">
              <picture>
                <source
                  type="image/avif"
                  srcSet="/images/benioff-400.avif 400w, /images/benioff-800.avif 800w"
                  sizes="(max-width: 800px) 100vw, 600px"
                />
                <source
                  type="image/webp"
                  srcSet="/images/benioff-400.webp 400w, /images/benioff-800.webp 800w"
                  sizes="(max-width: 800px) 100vw, 600px"
                />
                <img
                  src="/benioff.png"
                  alt="Conference speaker on stage"
                  className="headless-image"
                  width="930"
                  height="479"
                  loading="lazy"
                  decoding="async"
                />
              </picture>
              <div className="headless-scanlines" aria-hidden="true" />
              <div className="headless-tweet" aria-label="Marc Benioff tweet excerpt">
                <div className="headless-tweet-meta">
                  <span>Marc Benioff</span>
                  <span>@Benioff</span>
                </div>
                <p>
                  Welcome Salesforce Headless 360. No browser required.
                  Our API is the UI. Salesforce, Agentforce, and Slack are now
                  exposed through APIs, MCP, and CLI.
                </p>
              </div>
              <figcaption className="headless-caption">
                Salesforce signal · Headless workflows
              </figcaption>
            </div>
          </figure>
        </div>
      </div>
    </section>
  );
}

function BuildPanel({ idx, title, kind, prompt, artifact, tag }) {
  return (
    <article className="build-panel">
      <div className="build-panel-meta">
        <div className="eyebrow"><span className="num">{idx}</span>{kind}</div>
        <div className="tag"><span className="dot" />{tag}</div>
      </div>
      <h3 className="display">{title}</h3>

      <div className="build-panel-artifact artifact">
        <div className="artifact-header">
          <span>{artifact.file}</span>
          <span style={{ color: "var(--ink-500)" }}>{artifact.meta}</span>
        </div>
        <div className="build-prompt">
          <div className="build-prompt-label">YOU</div>
          <div className="build-prompt-text">{prompt}</div>
        </div>
        <div className="build-output">
          <div className="build-output-label">CLAUDE CODE</div>
          <pre className="build-output-code">{artifact.code}</pre>
        </div>
      </div>
    </article>
  );
}

function BacklogMock() {
  const tickets = [
    { id: "T-2841", pri: "high", title: "Territory routing flow for net-new Leads", owner: "Sarah K.", age: "14d", type: "Flow" },
    { id: "T-2837", pri: "high", title: "Validation: Close Date required at Negotiation", owner: "Marcus R.", age: "9d", type: "Rule" },
    { id: "T-2829", pri: "med",  title: "Audit profiles with Modify All on Account", owner: "Priya S.", age: "22d", type: "Audit" },
    { id: "T-2818", pri: "high", title: "Migrate Quote Builder Aura → LWC", owner: "DevOps", age: "31d", type: "LWC" },
    { id: "T-2807", pri: "low",  title: "Document active Opportunity flows", owner: "Unassigned", age: "6d", type: "Docs" },
    { id: "T-2792", pri: "med",  title: "Permission set: Finance read-only on Opp", owner: "Sarah K.", age: "18d", type: "Perms" },
    { id: "T-2774", pri: "high", title: "Apex test class for CommissionTrigger", owner: "Marcus R.", age: "27d", type: "Apex" },
  ];
  return (
    <div className="backlog-mock" aria-label="Salesforce admin backlog mock-up">
      <div className="backlog-mock-frame">
        <div className="backlog-mock-tabs">
          <span className="backlog-mock-tab backlog-mock-tab--active">
            <span className="backlog-mock-tab-icon">★</span>
            Admin Backlog
          </span>
          <span className="backlog-mock-tab-meta">42 items · sorted by Priority</span>
        </div>

        <div className="backlog-mock-toolbar">
          <span className="backlog-mock-pill">List View · Recently Modified</span>
          <span className="backlog-mock-search">⌕ Search this list…</span>
        </div>

        <div className="backlog-mock-table">
          <div className="backlog-mock-row backlog-mock-row--head">
            <div>#</div>
            <div>P</div>
            <div>Subject</div>
            <div>Owner</div>
            <div>Age</div>
            <div>Type</div>
          </div>
          {tickets.map((t) => (
            <div className="backlog-mock-row" key={t.id}>
              <div className="backlog-mock-id">{t.id}</div>
              <div>
                <span className={`backlog-mock-pri backlog-mock-pri--${t.pri}`}>
                  {t.pri === "high" ? "High" : t.pri === "med" ? "Med" : "Low"}
                </span>
              </div>
              <div className="backlog-mock-subject">{t.title}</div>
              <div className="backlog-mock-owner">{t.owner}</div>
              <div className="backlog-mock-age">{t.age}</div>
              <div className="backlog-mock-type">{t.type}</div>
            </div>
          ))}
          <div className="backlog-mock-row backlog-mock-row--more">
            <div />
            <div />
            <div className="backlog-mock-subject" style={{ color: "var(--ink-500)" }}>
              + 35 more &nbsp;&nbsp;·&nbsp;&nbsp; oldest item: 89&nbsp;days
            </div>
            <div /><div /><div />
          </div>
        </div>
      </div>
      <div className="backlog-mock-caption">
        <span className="backlog-mock-caption-eyebrow">Live list view · BrightPath sandbox</span>
        <span>Every row is a Tuesday afternoon you don't get back.</span>
      </div>
    </div>
  );
}

function WhatYouBuild() {
  const builds = [
    {
      idx: "01",
      kind: "Flow",
      tag: "Generated",
      title: "A complete Flow from a sentence.",
      prompt: "When a high-value opportunity is created, notify the AE manager and create a follow-up task on the account owner.",
      artifact: {
        file: "HighValueOpportunityFollowUp.flow-meta.xml",
        meta: "32 lines · validated",
        code: `<Flow xmlns="urn:sf...">
  <decisions>
    <name>Is_High_Value</name>
    <rules>
      <conditions>
        <field>Amount</field>
        <operator>GreaterThan</operator>
        <value>50000</value>
      </conditions>
    </rules>
  </decisions>
  <actionCalls>
    <name>Notify_Manager</name>
    ...`,
      },
    },
    {
      idx: "02",
      kind: "Validation Rule",
      tag: "Drafted",
      title: "Validation rules that read like spec.",
      prompt: "Don't allow a case to be closed unless it has a resolution code AND the customer has been emailed in the last 24 hours.",
      artifact: {
        file: "Case_RequireResolution.rule",
        meta: "4 conditions",
        code: `AND(
  ISPICKVAL(Status, "Closed"),
  ISBLANK(ResolutionCode__c) ||
  LastEmailDate__c <
    NOW() - 1
)`,
      },
    },
    {
      idx: "03",
      kind: "Permissions",
      tag: "Audited",
      title: "Permission audits, in seconds.",
      prompt: "List every profile that has Modify All on the Account object and tell me why that's a problem.",
      artifact: {
        file: "permission-audit.md",
        meta: "12 profiles · 3 risks",
        code: `# Modify All: Account
- System Administrator ✓ (expected)
- Sales Ops Lead ⚠ (review)
- Integration_API ⚠ (over-scoped)
- Legacy Marketing ⛔ (revoke)

Risks:
1. Integration user has...`,
      },
    },
    {
      idx: "04",
      kind: "Documentation",
      tag: "Generated",
      title: "Org documentation that stays current.",
      prompt: "Document every active flow on the Opportunity object. Include trigger, purpose, and downstream effects.",
      artifact: {
        file: "opportunity-flows.md",
        meta: "8 flows · auto-generated",
        code: `# Opportunity Flows

## 1. Opportunity_StageChange
- Trigger: Record-Triggered, after update
- Purpose: Sync stage to forecast
- Affects: Forecast__c, Activity
- Owner: rev-ops@`,
      },
    },
  ];

  return (
    <section className="section section-divider reveal" id="build">
      <div className="shell">
        <div className="block-head">
          <div className="eyebrow"><span className="num">04</span>What you'll build</div>
          <div className="block-head-meta">Four case studies · real artifacts</div>
        </div>

        <div className="build-intro-grid">
          <div className="build-intro">
            <h2 className="display">
              Backlog anxiety<br />
              is <em>real.</em>
            </h2>
            <p className="lead" style={{ marginTop: "24px" }}>
              That feeling when your "Quick Wins" list has 42 items and your Tuesday is
              booked with back-to-back meetings. Each module ends with a real, deployable
              artifact, the kind of thing you'd normally file a ticket for. Claude Code
              isn't just a tool; it's how you get your lunch break back.
            </p>
          </div>

          <BacklogMock />
        </div>
      </div>

      <BuildStack builds={builds} />
    </section>
  );
}

function BuildStack({ builds }) {
  const trackRef = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = trackRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const winH = window.innerHeight || document.documentElement.clientHeight;
      const total = el.offsetHeight - winH;
      const scrolled = Math.max(0, -rect.top);
      const p = total > 0 ? Math.min(1, scrolled / total) : 0;
      setProgress(p);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const count = builds.length;
  const activeIdx = Math.min(count - 1, Math.floor(progress * count));

  const goTo = (i) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector(`[data-build-card="${i}"]`);
    const top = card
      ? card.getBoundingClientRect().top + window.scrollY - 96
      : el.offsetTop + ((el.offsetHeight - window.innerHeight) * (i / count));
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <div className="build-track" ref={trackRef}>
      <div className="shell build-sticky-shell">
        <div className="build-stack-meta">
          <div className="eyebrow">
            <span className="num">{String(activeIdx + 1).padStart(2, "0")}</span>
            {builds[activeIdx].kind}<span className="build-scroll-hint"> · scroll to advance</span>
          </div>
          <div className="block-head-meta">
            {String(activeIdx + 1).padStart(2, "0")} <span style={{ opacity: 0.4 }}>/ {String(count).padStart(2, "0")}</span>
          </div>
        </div>

        <div className="build-stack" style={{ "--build-count": count }}>
          {builds.map((b, i) => (
            <div
              key={b.idx}
              data-build-card={i}
              id={`build-panel-${i}`}
              role="tabpanel"
              aria-labelledby={`build-tab-${i}`}
              aria-hidden={i !== activeIdx}
              className={`build-stack-card${i === activeIdx ? " is-active" : ""}${i < activeIdx ? " is-past" : ""}${i > activeIdx ? " is-future" : ""}`}
              style={{
                "--card-index": i,
                "--reverse-index": count - i,
                zIndex: 10 + i,
              }}
            >
              <BuildPanel {...b} />
            </div>
          ))}
        </div>

        <div className="build-progress" role="tablist" aria-label="What you'll build">
          {builds.map((b, i) => (
            <button
              key={b.idx}
              type="button"
              role="tab"
              id={`build-tab-${i}`}
              aria-selected={i === activeIdx}
              aria-controls={`build-panel-${i}`}
              tabIndex={i === activeIdx ? 0 : -1}
              onClick={() => goTo(i)}
              className={`build-progress-step${i === activeIdx ? " is-active" : ""}${i < activeIdx ? " is-past" : ""}`}
            >
              <span className="build-progress-num">{b.idx}</span>
              <span className="build-progress-label">{b.kind}</span>
              <span className="build-progress-bar" aria-hidden="true" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

const WALKTHROUGH_EMBED_URL = "https://player.mediadelivery.net/embed/649324/964a7aed-07dc-42ef-ae34-2c358caa9f51?autoplay=true&loop=true&muted=true&preload=true&responsive=true";

function VideoModal({ open, onClose, src, title }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="video-modal-overlay" role="dialog" aria-modal="true" aria-label={title} onClick={onClose}>
      <div className="video-modal-frame" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="video-modal-close" onClick={onClose} aria-label="Close video">×</button>
        <div className="video-modal-aspect">
          <iframe
            src={src}
            title={title}
            allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            playsInline
          />
        </div>
      </div>
    </div>
  );
}

function Walkthrough() {
  const [videoOpen, setVideoOpen] = useState(false);
  const beats = [
    {
      t: "00:12",
      label: "The prompt",
      body: "“Hey Claude, create a contact-role flow on the Opportunity object. When an opportunity is closed, update the contact's role.”",
    },
    {
      t: "00:38",
      label: "Flow generated",
      body: "Claude reads the org via Salesforce DX, drafts UpdateContactRoleOnClosedWon, and auto-optimizes the trigger so it only fires on the transition to Closed Won.",
    },
    {
      t: "01:25",
      label: "Tested in the org",
      body: "Open the flow in Setup. It's there. Confirm record-triggered, after-save, decision-maker assignment.",
    },
    {
      t: "02:40",
      label: "End-to-end",
      body: "Relate a Contact to the Opportunity (Claude does it via anonymous Apex), close the deal, watch the Contact's role flip to Decision Maker.",
    },
  ];

  return (
    <section className="section section-divider reveal" id="walkthrough">
      <div className="shell">
        <div className="block-head">
          <div className="eyebrow"><span className="num">05</span>Live walkthrough</div>
          <div className="block-head-meta">An hour's work · in three minutes</div>
        </div>

        <div className="walkthrough-intro">
          <h2 className="display">
            From a sentence<br />
            to a deployed <em>Flow.</em>
          </h2>
          <p className="lead" style={{ marginTop: "24px" }}>
            A real recording from my dev org. One prompt builds the flow,
            connects it to Salesforce DX, and runs the test loop end-to-end.
            The kind of thing that used to eat a full afternoon.
          </p>
        </div>

        <figure className="walkthrough-frame artifact">
          <div className="artifact-header">
            <span>UpdateContactRoleOnClosedWon.flow-meta.xml</span>
            <span style={{ color: "var(--accent)" }}>● live · 3 min</span>
          </div>
          <div className="walkthrough-video">
            <button
              type="button"
              className="walkthrough-poster walkthrough-poster-button has-thumb"
              aria-label="Play demo video"
              onClick={() => setVideoOpen(true)}
            >
              <picture>
                <source
                  type="image/avif"
                  srcSet="/images/walkthrough-thumb-400.avif 400w, /images/walkthrough-thumb-800.avif 800w, /images/walkthrough-thumb-1200.avif 1200w"
                  sizes="(max-width: 1000px) 100vw, 1000px"
                />
                <source
                  type="image/webp"
                  srcSet="/images/walkthrough-thumb-400.webp 400w, /images/walkthrough-thumb-800.webp 800w, /images/walkthrough-thumb-1200.webp 1200w"
                  sizes="(max-width: 1000px) 100vw, 1000px"
                />
                <img
                  className="walkthrough-poster-img"
                  src="/walkthrough-thumb.png"
                  alt="Demo: Claude Code generating Salesforce metadata in VS Code"
                  width="1870"
                  height="920"
                  loading="lazy"
                  decoding="async"
                />
              </picture>
              <div className="walkthrough-poster-overlay" aria-hidden="true" />
              <div className="walkthrough-play" aria-hidden="true">▶</div>
              <div className="walkthrough-poster-label">Demo recording · 3 min</div>
              <div className="walkthrough-poster-sub">Click to watch the full walkthrough.</div>
            </button>
          </div>
          <figcaption className="walkthrough-caption">
            <span style={{ fontFamily: "var(--mono)", fontSize: "10px", letterSpacing: "0.12em", color: "var(--ink-500)", textTransform: "uppercase" }}>
              Caption
            </span>
            <span style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: "16px", color: "var(--ink-800)" }}>
              “I used to be deathly afraid of flows. Now all I do is test them. Claude does the build.”
            </span>
          </figcaption>
        </figure>

        <div className="walkthrough-beats">
          {beats.map((b, i) => (
            <div className="walkthrough-beat" key={b.t}>
              <div className="walkthrough-beat-meta">
                <span className="walkthrough-beat-num">{String(i + 1).padStart(2, "0")}</span>
                <span className="walkthrough-beat-time">{b.t}</span>
              </div>
              <div className="walkthrough-beat-label">{b.label}</div>
              <div className="walkthrough-beat-body">{b.body}</div>
            </div>
          ))}
        </div>
      </div>
      <VideoModal
        open={videoOpen}
        onClose={() => setVideoOpen(false)}
        src={WALKTHROUGH_EMBED_URL}
        title="Claude Code for Salesforce: live walkthrough"
      />
    </section>
  );
}

function Curriculum() {
  const [open, setOpen] = useState(0);
  const phases = [
    {
      phase: "Phase I",
      title: "Foundation & data model",
      duration: "Capstone: BrightPath Solar",
      modules: [
        { n: "1.1", t: "Why Claude Code, why now", d: "The shift from point-and-click to prompt-driven admin work, set inside the BrightPath capstone scenario." },
        { n: "1.2", t: "Install, connect, first prompt", d: "Walk-through inside VS Code. Authenticate to a Salesforce DX sandbox. Get your first artifact deployed." },
        { n: "1.3", t: "Custom fields on Account, Contact, Opportunity", d: "Ship the BrightPath field set: Customer Type, Utility Provider, System Size, Financing Method, and more from a single prompt." },
      ],
    },
    {
      phase: "Phase II",
      title: "Custom objects & schema",
      duration: "6 objects · 25+ fields",
      modules: [
        { n: "2.1", t: "Custom objects + relationships", d: "Build Site Survey, Installation, Warranty Claim, Equipment, Incentive Program, and Incentive Application, with master-detail and lookup wiring." },
        { n: "2.2", t: "Record types + page layouts", d: "Residential vs Commercial accounts. Three opportunity record types: Residential Install, Commercial Install, Service/Warranty." },
        { n: "2.3", t: "Permission sets + custom app", d: "Sales Rep, Operations, and Admin personas. Build the BrightPath Solar app with custom tabs in one prompt." },
        { n: "2.4", t: "Validation rules", d: "Stage-gated amounts, future-only schedule dates, and warranty expiration logic. Drafted, deployed, tested." },
      ],
    },
    {
      phase: "Phase III",
      title: "Flows from English",
      duration: "4 production flows",
      modules: [
        { n: "3.1", t: "Lead Intake screen flow", d: "Three-screen wizard that creates Account + Contact + Opportunity in one go, with a live savings estimate." },
        { n: "3.2", t: "Post-Survey auto-update", d: "Record-triggered flow that promotes the Opportunity to Proposal, files panel-upgrade tasks, and Chatter-warns on heavy shade." },
        { n: "3.3", t: "Installation milestone notifications", d: "Branching flow that emails the customer on inspection scheduling and closes the deal on inspection passed." },
        { n: "3.4", t: "Warranty expiration scheduled flow", d: "Daily 7am job that surfaces 90-day warranty expirations and pings the Customer Success manager with a summary." },
      ],
    },
    {
      phase: "Phase IV",
      title: "Apex, LWC & ops",
      duration: "Triggers · Batch · LWC",
      modules: [
        { n: "4.1", t: "Apex trigger: Commission Calculator", d: "Tiered commission logic with cash bonus and lease/PPA penalty. Handler-class pattern, bulkified to 200+ records, 90% test coverage." },
        { n: "4.2", t: "Apex trigger: Installation Validator", d: "Forward-only status progression, permit-number gating, and completed-survey enforcement, with custom errors and full negative-path tests." },
        { n: "4.3", t: "Batch + Schedulable: Production Estimator", d: "Nightly job that calculates annual kWh production and 25-year lifetime savings on every Closed Won deal." },
        { n: "4.4", t: "Lightning Web Component: Installation Timeline", d: "A wired LWC that visualizes status from Permit Submitted → Inspection Passed, with an On Hold amber state. CSS-only, responsive." },
        { n: "4.5", t: "Dummy data + reports + dashboard", d: "100+ records seeded across all objects. Pipeline-by-financing-method report, install-status tracker, and a live BrightPath Operations dashboard." },
      ],
    },
  ];

  return (
    <section className="section section-divider reveal" id="curriculum">
      <div className="shell">
        <div className="block-head">
          <div className="eyebrow"><span className="num">06</span>Course architecture</div>
          <div className="block-head-meta">Four phases · BrightPath Solar capstone</div>
        </div>

        <div className="curriculum-intro">
          <h2 className="display">
            A system, not<br />
            <em>a syllabus.</em>
          </h2>
          <p className="lead" style={{ marginTop: "24px", maxWidth: "62ch" }}>
            You'll build a complete Salesforce org for a fictional solar installer,
            BrightPath Energy, alongside the lessons. Six custom objects, 25+ fields,
            four flows, two Apex triggers, a batch job, and a Lightning Web Component.
            Everything you'd ship at a real job, shipped here first.
          </p>
        </div>

        <div className="curriculum">
          {phases.map((p, i) => {
            const isOpen = open === i;
            const btnId = `phase-head-${i}`;
            const panelId = `phase-body-${i}`;
            return (
              <div className={`phase ${isOpen ? "phase--open" : ""}`} key={p.phase}>
                <button
                  type="button"
                  id={btnId}
                  className="phase-head"
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                >
                  <div className="phase-head-l">
                    <span className="phase-tag">{p.phase}</span>
                    <span className="phase-title">{p.title}</span>
                  </div>
                  <div className="phase-head-r">
                    <span className="phase-duration">{p.duration}</span>
                    <span className="phase-count">{p.modules.length} modules</span>
                    <span className="phase-toggle" aria-hidden="true">{isOpen ? "−" : "+"}</span>
                  </div>
                </button>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={btnId}
                  aria-hidden={!isOpen}
                  className="phase-body"
                  style={{ maxHeight: isOpen ? "1200px" : "0px" }}
                >
                  <div className="phase-body-inner">
                    {p.modules.map((m) => (
                      <div className="module" key={m.n}>
                        <div className="module-n">{m.n}</div>
                        <div className="module-content">
                          <div className="module-t">{m.t}</div>
                          <div className="module-d">{m.d}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Demo() {
  const examplePrompt = "Write a validation rule that requires a Close Date in the future for any Opportunity in 'Negotiation' stage.";
  const exampleOutput = `AND(
  ISPICKVAL(StageName, "Negotiation"),
  OR(
    ISBLANK(CloseDate),
    CloseDate <= TODAY()
  )
)`;

  const otherExamples = [
    "Draft a Flow that creates a follow-up task when a Lead is converted but the account has no opportunities.",
    "List the metadata changes I'd need to add a 'Health Score' field to Account, with formula and page layout updates.",
    "Audit which permission sets grant access to the SSN__c field on Contact and flag anything risky.",
  ];

  return (
    <section className="section section--tight section-divider reveal" id="demo">
      <div className="shell">
        <div className="block-head">
          <div className="eyebrow"><span className="num">07</span>What it looks like</div>
          <div className="block-head-meta">Prompt → reviewable artifact</div>
        </div>

        <div className="demo-grid">
          <div className="demo-copy">
            <h2 className="display">
              The kind of thing<br />
              an <em>admin would say.</em>
            </h2>
            <p className="lead" style={{ marginTop: "20px" }}>
              A snapshot of the prompt-to-artifact loop you'll run every day in the
              course. The example on the right is real output from a real org. Below:
              other prompts admins use to put Claude to work.
            </p>
            <div className="demo-examples">
              <div className="eyebrow" style={{ marginBottom: "12px" }}>Other things admins ask Claude</div>
              {otherExamples.map((e, i) => (
                <div className="demo-ex" key={i}>
                  <span className="demo-ex-arrow">→</span>
                  <span>{e}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="demo-panel artifact">
            <div className="artifact-header">
              <span>demo · prompt → artifact</span>
              <span style={{ color: "var(--accent)" }}>● example</span>
            </div>
            <div className="demo-input-wrap">
              <pre className="demo-input">{examplePrompt}</pre>
            </div>
            <div className="demo-output">
              <pre className="demo-output-code">{exampleOutput}</pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Safety() {
  const principles = [
    { n: "01", t: "Review everything", d: "Every diff is yours to read before it ships. The model proposes; you dispose." },
    { n: "02", t: "Sandbox first", d: "Validate against a sandbox org. Promote only what passes." },
    { n: "03", t: "Partner, not autopilot", d: "Claude Code is leverage on top of your judgment, not a replacement for it." },
    { n: "04", t: "Governance respected", d: "Existing Salesforce permissions, profiles, and SOX controls all still apply." },
  ];

  return (
    <section className="section section-divider reveal" id="safety">
      <div className="shell">
        <div className="block-head">
          <div className="eyebrow"><span className="num">08</span>Safety & trust</div>
          <div className="block-head-meta">How to operate without breaking things</div>
        </div>

        <div className="safety-grid">
          <div className="safety-lead">
            <h2 className="display">
              Speed,<br />
              without <em>chaos.</em>
            </h2>
            <p className="lead" style={{ marginTop: "24px" }}>
              The course is structured around four operating principles. They're how you
              keep the leverage of AI without giving up the discipline that production orgs
              demand.
            </p>
          </div>

          <div className="safety-list">
            {principles.map((p) => (
              <div className="safety-item" key={p.n}>
                <div className="safety-n">{p.n}</div>
                <div>
                  <h4 className="safety-t">{p.t}</h4>
                  <p className="safety-d">{p.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Instructor() {
  return (
    <section className="section section-divider section--dark reveal" id="instructor">
      <div className="shell">
        <div className="block-head">
          <div className="eyebrow"><span className="num">09</span>Instructor</div>
          <div className="block-head-meta">Built by an operator</div>
        </div>

        <div className="instructor-grid">
          <div className="instructor-portrait">
            <div className="portrait-frame">
              <picture>
                <source
                  type="image/avif"
                  srcSet="/images/amit-headshot-400.avif 400w, /images/amit-headshot-800.avif 800w"
                  sizes="(max-width: 900px) 100vw, 400px"
                />
                <source
                  type="image/webp"
                  srcSet="/images/amit-headshot-400.webp 400w, /images/amit-headshot-800.webp 800w"
                  sizes="(max-width: 900px) 100vw, 400px"
                />
                <img
                  className="portrait-photo"
                  src="/amit-headshot.png"
                  alt="Amit, instructor. 8× Salesforce Certified, GTM Engineer."
                  width="1024"
                  height="1024"
                  loading="lazy"
                  decoding="async"
                />
              </picture>
              <div className="portrait-grid" />
              <div className="portrait-caption">
                <span>Amit</span>
                <span>SF·26</span>
              </div>
            </div>
            <div className="instructor-creds">
              <div className="cred"><span className="cred-n">8×</span><span>Salesforce Certified</span></div>
              <div className="cred"><span className="cred-n">·</span><span>GTM Engineer</span></div>
              <div className="cred"><span className="cred-n">·</span><span>AI Tools Builder</span></div>
            </div>
          </div>

          <div className="instructor-note">
            <h2 className="display">
              Stop being a<br />
              <em>"point-and-click"</em> admin.<br />
              Start being a Salesforce<br />
              <em>architect.</em>
            </h2>
            <div className="instructor-body">
              <p>
                I've spent years in the Salesforce ecosystem doing RevOps, sales operations,
                and CRM architecture. I was the admin who was scared of Flows. When Claude
                Code came out, everything changed.
              </p>
              <p>
                I went from filing Jira tickets and waiting two weeks to just… building the
                thing myself. This course is everything I wish someone had shown me on day one.
              </p>
              <div className="instructor-sign">- Amit</div>
              <div className="instructor-work-pills" aria-label="Past operator roles">
                <span>Avan Grid · Solo Admin</span>
                <span>Slalom · Salesforce Consultant</span>
                <span>dice.com · Business Systems Director</span>
                <span>webAI · RevOps Manager</span>
              </div>
              <a href="/about" className="instructor-more-link">
                More about me <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const quotes = [
    {
      body: "I shipped a Flow on a Wednesday that's been on the backlog since March. The PM didn't believe me until I sent the diff.",
      name: "Sarah K.",
      role: "Sr. Salesforce Admin · Mid-market SaaS",
      rot: -3.2,
    },
    {
      body: "I was scared of writing Apex. Now I read the diff Claude gives me, ship it to the sandbox, and ship to prod when it passes. The fear was the bottleneck, not the language.",
      name: "Marcus R.",
      role: "Salesforce Architect · FinTech",
      rot: 1.8,
    },
    {
      body: "Three years of 'we should clean up our permission sets.' Done in a single afternoon. Claude audited every profile and gave me the redlines.",
      name: "Priya S.",
      role: "RevOps Lead · Industrial",
      rot: -1.6,
    },
    {
      body: "I used to file Jira tickets. Now I close them.",
      name: "Devin H.",
      role: "Solo Admin · 200-seat org",
      rot: 2.6,
    },
    {
      body: "The flip moment: Claude wrote a validation rule, ran it against my sandbox, found the edge case I missed, and patched it. I just watched.",
      name: "Jordan T.",
      role: "Salesforce Admin · Healthcare",
      rot: -2.1,
    },
    {
      body: "First flow I shipped from a prompt: territory routing for inbound leads. Took 18 minutes. My manager asked who I hired.",
      name: "Amelia C.",
      role: "RevOps Manager · B2B SaaS",
      rot: 3.0,
    },
  ];
  const quoteRows = [quotes.slice(0, 3), quotes.slice(3)];

  return (
    <section className="section section-divider reveal" id="testimonials">
      <div className="shell">
        <div className="block-head">
          <div className="eyebrow"><span className="num">10</span>Field reports</div>
          <div className="block-head-meta">Beta cohort · names abbreviated at request</div>
        </div>

        <div className="testimonials-intro">
          <h2 className="display">
            Proof from admins<br />
            <em>who stopped waiting.</em>
          </h2>
          <p className="lead" style={{ marginTop: "20px", maxWidth: "62ch" }}>
            Composite quotes drawn from beta-cohort interviews, paraphrased and
            anonymized at the participants' request. Every one came from a working
            Salesforce admin who shipped real artifacts during the course.
          </p>
        </div>

        <div className="testimonials-wall" aria-label="Beta cohort testimonial cards">
          {quoteRows.map((row, rowIdx) => (
            <div
              className={`testimonials-marquee testimonials-marquee--${rowIdx === 0 ? "right" : "left"}`}
              key={rowIdx}
            >
              <div className="testimonials-marquee-track">
                {[...row, ...row].map((q, i) => (
                  <figure
                    key={`${rowIdx}-${i}`}
                    className="testimonial-paper"
                    style={{ "--rot": `${q.rot}deg` }}
                    aria-hidden={i >= row.length}
                  >
                    <blockquote className="testimonial-paper-body">{q.body}</blockquote>
                    <figcaption className="testimonial-paper-cap">
                      <div className="testimonial-paper-avatar" aria-hidden="true">
                        {q.name.split(" ").map((p) => p[0]).join("").slice(0, 2)}
                      </div>
                      <div className="testimonial-paper-meta">
                        <div className="testimonial-paper-name">{q.name}</div>
                        <div className="testimonial-paper-role">{q.role}</div>
                      </div>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="testimonials-foot">
          <span className="testimonials-foot-eyebrow">Disclosure</span>
          <span>
            Quotes are paraphrased composites from beta-cohort interviews. Real names
            withheld for privacy. Aggregated public testimonials with full attribution
            ship after Cohort 02.
          </span>
        </div>
      </div>
    </section>
  );
}

function ThrivecartEmbed() {
  useEffect(() => {
    const id = THRIVECART_EMBED_ID;
    if (document.getElementById(id)) return;
    const s = document.createElement("script");
    s.async = true;
    s.id = id;
    s.src = "//tinder.thrivecart.com/embed/v2/thrivecart.js";
    document.body.appendChild(s);
  }, []);

  return (
    <div
      className="tc-v2-embeddable-target"
      data-thrivecart-account="webpay"
      data-thrivecart-tpl="v2"
      data-thrivecart-product="57"
      data-thrivecart-embeddable={THRIVECART_EMBED_ID}
    />
  );
}

/* Small SLDS-flavored object icons (Contact / Account / Opportunity) for bonus cards.
   Colors approximate the Salesforce Lightning standard-icon palette so an admin
   recognizes them at a glance. */
function SObjectIcon({ kind }) {
  const ICONS = {
    contact: {
      bg: "#A094ED",
      label: "Contact",
      glyph: (
        <g fill="none" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="9" r="3.6" />
          <path d="M5 19.5c0-3.6 3.1-6 7-6s7 2.4 7 6" />
        </g>
      ),
    },
    account: {
      bg: "#F88962",
      label: "Account",
      glyph: (
        <g fill="none" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5.5 21V8.2L12 4.5l6.5 3.7V21" />
          <path d="M3.5 21h17" />
          <path d="M9 12h2M13 12h2M9 16h2M13 16h2" />
        </g>
      ),
    },
    opportunity: {
      bg: "#FCB95B",
      label: "Opportunity",
      glyph: (
        <g fill="none" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3.8" y="7.5" width="16.4" height="12.5" rx="1.6" />
          <path d="M9 7.5V5.6c0-.9.7-1.6 1.6-1.6h2.8c.9 0 1.6.7 1.6 1.6v1.9" />
          <path d="M3.8 13h16.4" />
        </g>
      ),
    },
  };
  const data = ICONS[kind] || ICONS.contact;
  return (
    <div
      className="bonus-card-icon"
      style={{ background: data.bg }}
      role="img"
      aria-label={`${data.label} icon`}
    >
      <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
        {data.glyph}
      </svg>
    </div>
  );
}

function PricingBonuses() {
  const bonuses = [
    {
      tag: "Bonus 01",
      icon: "contact",
      label: "The Inner Circle",
      title: "Private Slack for course members.",
      sub: "When 'just ask the team' isn't an option.",
      body: "You're the solo admin. Or the senior on a two-person team. Either way, there's no Slack channel to drop your weird Flow error into at 4:55pm on a Friday. This one is. Working admins, the instructor, and the kind of community where 'is this CPU-time limit normal?' gets answered in 12 minutes, not 12 days.",
      tagline: "Lifetime access",
    },
    {
      tag: "Bonus 02",
      icon: "account",
      label: "The Production Vault",
      title: "Real Claude Code transcripts from real orgs.",
      sub: "Every Salesforce prompt I've shipped.",
      body: "The unedited Claude Code sessions I run against production Salesforce orgs: the prompts that worked, the dead ends I had to back out of, the recovery patterns when Claude got it wrong. The kind of senior-architect ride-along that normally costs $5,000 in consulting time.",
      tagline: "Field-tested sessions",
    },
    {
      tag: "Bonus 03",
      icon: "opportunity",
      label: "The Plugin Pack",
      title: "Handpicked Claude Code plugins for serious leverage.",
      sub: "My personal plugin stack for faster Claude Code work.",
      body: "You get the exact plugins I use to make Claude Code more useful across real projects, including Superpowers and Claude Mem. These are the productivity boosters, memory tools, workflow helpers, and repo habits I trust when I want Claude to move faster without losing context.",
      tagline: "Curated by Amit",
    },
  ];

  return (
    <div className="pricing-bonuses">
      <div className="pricing-bonuses-head">
        <div className="eyebrow"><span className="num">+ 03</span>Bonuses · included free</div>
        <div className="block-head-meta">Three bonuses, yours at no extra cost</div>
      </div>

      <div className="pricing-bonuses-intro">
        <h3 className="display">
          The extras that make this<br />
          <em>a no-brainer.</em>
        </h3>
        <p className="lead" style={{ marginTop: "20px", maxWidth: "62ch" }}>
          Course alone gets you the skill. These bonuses get you the unfair advantage:
          the community, the receipts, and the tools I personally won't ship without.
        </p>
      </div>

      <div className="pricing-bonuses-grid">
        {bonuses.map((b) => (
          <article key={b.tag} className="bonus-card">
            <SObjectIcon kind={b.icon} />
            <div className="bonus-card-head">
              <span className="bonus-card-tag">{b.tag}</span>
            </div>
            <div className="bonus-card-label">{b.label}</div>
            <h4 className="bonus-card-title">{b.title}</h4>
            <div className="bonus-card-sub">{b.sub}</div>
            <p className="bonus-card-body">{b.body}</p>
            <div className="bonus-card-foot">
              <span className="bonus-card-included">✓ Included</span>
              <span className="bonus-card-tagline">{b.tagline}</span>
            </div>
          </article>
        ))}
      </div>

      <div className="pricing-bonuses-stack">
        <div className="bonus-stack-row">
          <span>Course · twelve modules + capstone</span>
          <span className="bonus-stack-included">✓ Included</span>
        </div>
        <div className="bonus-stack-row">
          <span>Bonus 01 · The Inner Circle (lifetime)</span>
          <span className="bonus-stack-included">✓ Included</span>
        </div>
        <div className="bonus-stack-row">
          <span>Bonus 02 · The Production Vault</span>
          <span className="bonus-stack-included">✓ Included</span>
        </div>
        <div className="bonus-stack-row">
          <span>Bonus 03 · The Plugin Pack</span>
          <span className="bonus-stack-included">✓ Included</span>
        </div>
        <div className="bonus-stack-row bonus-stack-row--total">
          <span>Regular price</span>
          <span className="bonus-stack-val">$697</span>
        </div>
        <div className="bonus-stack-row bonus-stack-row--your">
          <span>Your price today</span>
          <span className="bonus-stack-val bonus-stack-val--accent">$97</span>
        </div>
      </div>
    </div>
  );
}

function Pricing() {
  const includes = [
    "BrightPath Solar capstone: full org build, end to end",
    "6 custom objects + 25+ fields, fully wired with relationships",
    "3 Account / Opportunity record types and page layouts",
    "4 production Flows (screen, record-triggered, scheduled)",
    "2 Apex triggers with handler classes · 90% test coverage",
    "1 Apex batch + Schedulable job (annual production estimator)",
    "1 Lightning Web Component (Installation Timeline)",
    "Permission sets + custom app for 3 user personas",
    "100+ records of seeded data · 2 reports + 1 live dashboard",
    "Installation walkthrough for VS Code",
    "Lifetime access · all future updates",
    "CLAUDE.md Starter Template + Skill Pack for Salesforce",
  ];

  return (
    <section className="section section-divider reveal" id="enroll">
      <span id="pricing" aria-hidden="true" style={{ position: "absolute", marginTop: "-80px" }} />
      <div className="shell">
        <div className="block-head">
          <div className="eyebrow"><span className="num">11</span>Enrollment</div>
          <div className="block-head-meta">One tier · everything included</div>
        </div>

        <div className="pricing-card">
          <div className="pricing-l">
            <div className="tag" style={{ marginBottom: "24px" }}><span className="dot" />Open · Cohort 01</div>
            <h2 className="display">
              Claude Code<br />
              for <em>Salesforce</em>.
            </h2>
            <p className="lead" style={{ marginTop: "24px", maxWidth: "48ch" }}>
              Built for admins who want technical leverage without becoming a developer.
              One price. Everything included. Lifetime access.
            </p>

            <ul className="pricing-includes">
              {includes.map((i, idx) => (
                <li key={idx}>
                  <span className="pricing-check">✓</span>
                  <span>{i}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pricing-r">
            <div className="pricing-price-block">
              <div className="eyebrow">Launch price · USD</div>
              <div className="pricing-price">
                <span className="dollar">$</span>
                <span className="num">97</span>
                <span className="reg">reg. $197</span>
              </div>
              <div className="pricing-sub">One-time · lifetime access</div>
            </div>

            <div className="pricing-thrivecart-wrap">
              <div className="pricing-thrivecart-label">Secure checkout</div>
              <ThrivecartEmbed />
            </div>

            <div className="pricing-guarantee">
              <div className="eyebrow" style={{ marginBottom: "8px" }}>Guarantee</div>
              <p style={{ fontSize: "13px", color: "var(--ink-600)", lineHeight: 1.5, margin: 0 }}>
                30-day money-back, no questions asked. Go through the course; if you didn't
                level up your admin skills, email me for a full refund.
              </p>
            </div>

            <p style={{ fontFamily: "var(--mono)", fontSize: "10px", letterSpacing: "0.06em", color: "var(--ink-500)", marginTop: 12, lineHeight: 1.5 }}>
              Requires a Claude Pro subscription ($20/month).
              No Salesforce add-on license required beyond Enterprise / Unlimited / Developer edition.
            </p>
          </div>
        </div>

        <PricingBonuses />
      </div>
    </section>
  );
}

function FAQ() {
  const [openIdx, setOpenIdx] = useState(-1);
  return (
    <section className="section section-divider reveal" id="faq">
      <div className="shell">
        <div className="block-head">
          <div className="eyebrow"><span className="num">12</span>Frequently asked</div>
          <div className="block-head-meta">Practical objections, answered</div>
        </div>

        <div className="faq-grid">
          <div className="faq-lead">
            <h2 className="display">
              Questions, <em>answered.</em>
            </h2>
            <p className="lead" style={{ marginTop: "20px" }}>
              The honest version of every question that gets asked before enrollment.
            </p>
          </div>
          <div className="faq-list">
            {FAQS.map((f, i) => {
              const isOpen = openIdx === i;
              const btnId = `faq-q-${i}`;
              const panelId = `faq-a-${i}`;
              return (
                <div className={`faq-item ${isOpen ? "faq-item--open" : ""}`} key={i}>
                  <button
                    type="button"
                    id={btnId}
                    className="faq-q"
                    onClick={() => setOpenIdx(isOpen ? -1 : i)}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                  >
                    <span className="faq-q-num">{String(i + 1).padStart(2, "0")}</span>
                    <span className="faq-q-text">{f.q}</span>
                    <span className="faq-toggle" aria-hidden="true">{isOpen ? "−" : "+"}</span>
                  </button>
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={btnId}
                    aria-hidden={!isOpen}
                    className="faq-a-wrap"
                    style={{ maxHeight: isOpen ? "600px" : "0px" }}
                  >
                    <div className="faq-a">{f.a}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function FeaturedGuides() {
  const guides = getFeaturedHomepageGuides();
  if (!guides.length) return null;
  return (
    <section className="section section-divider reveal" id="start-here" aria-labelledby="start-here-title">
      <div className="shell">
        <div className="block-head">
          <div className="eyebrow"><span className="num">11</span>Start here</div>
          <div className="block-head-meta">Three guides · free, no signup</div>
        </div>
        <div className="featured-guides-grid">
          <div className="featured-guides-lead">
            <h2 id="start-here-title" className="display">
              Read these <em>first.</em>
            </h2>
            <p className="lead" style={{ marginTop: "20px" }}>
              The shortest path from "I've never used Claude Code" to "I just shipped a flow from a prompt." Each post is a self-contained tutorial — no fluff, no signup wall.
            </p>
          </div>
          <div className="featured-guides-list">
            {guides.map((g, i) => (
              <a
                key={g.slug}
                href={`/blog/${g.slug}`}
                className="featured-guide"
              >
                <div className="featured-guide-num">{String(i + 1).padStart(2, "0")}</div>
                <div className="featured-guide-body">
                  <div className="featured-guide-title">{g.title}</div>
                  <div className="featured-guide-blurb">{g.blurb}</div>
                  <div className="featured-guide-link">Read the guide <span aria-hidden="true">→</span></div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="section final-cta" id="cta">
      <div className="shell">
        <div className="final-cta-inner">
          <div className="eyebrow"><span className="num">13</span>One last thing</div>
          <h2 className="display final-cta-title">
            The admins who learn this<br />
            <em>this year</em> will be the<br />
            architects of next year.
          </h2>
          <div className="final-cta-buttons">
            <a href={ENROLL_HASH} className="btn btn--primary" style={{ padding: "20px 36px", fontSize: "15px" }}>
              Start Building with Claude <span className="arrow">→</span>
            </a>
            <a href="#curriculum" className="btn btn--ghost" style={{ padding: "20px 36px", fontSize: "15px", borderColor: "var(--bone-300)", color: "var(--bone-100)" }}>
              See the curriculum
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="shell">
        <div className="footer-grid">
          <div className="footer-mark">
            <div className="footer-glyph">CC</div>
            <div className="footer-mark-text">
              <div className="serif-italic" style={{ fontSize: "22px", color: "var(--bone-100)" }}>CC for SF</div>
              <div style={{ fontFamily: "var(--mono)", fontSize: "11px", letterSpacing: "0.06em", color: "var(--ink-400)", marginTop: "8px" }}>
                Claude Code · for Salesforce Admins
              </div>
            </div>
          </div>
          <div className="footer-cols">
            <div className="footer-col">
              <div className="footer-col-h">Course</div>
              <a href="#model">The model</a>
              <a href="#curriculum">Curriculum</a>
              <a href={ENROLL_HASH}>Pricing</a>
              <a href="#faq">FAQ</a>
            </div>
            <div className="footer-col">
              <div className="footer-col-h">Resources</div>
              <a href="/blog">Blog</a>
              <a href="/about">About</a>
            </div>
            <div className="footer-col">
              <div className="footer-col-h">Legal</div>
              <a href="/terms">Terms</a>
              <a href="/privacy">Privacy</a>
              <a href="/refund">Refund Policy</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <div>© 2026 · CC for SF</div>
          <div style={{ fontFamily: "var(--mono)" }}>SF·26 / 37.7749° N</div>
          <div>Not affiliated with Salesforce, Inc. or Anthropic, PBC.</div>
        </div>
      </div>
    </footer>
  );
}

/* ══════════════════════════ APP ══════════════════════════ */

export default function SalesPage() {
  useReveal();

  return (
    <div className="ccsf-root">
      <SEO
        title="CC for SF: Claude Code for Salesforce Admins"
        description="Hands-on mini-course. Use Claude Code to ship Flows, validation rules, and metadata work from plain English. No developer in the loop. $97 one-time, 30-day guarantee."
        path="/"
        jsonLd={HOMEPAGE_JSON_LD}
      />

      <a href="#main-content" className="skip-link">Skip to main content</a>
      <PromoBar />
      <Nav />
      <StickyEnroll />
      <main id="main-content" tabIndex={-1}>
        <Hero />
        <Marquee />
        <Friction />
        <NewModel />
        <HeadlessFuture />
        <WhatYouBuild />
        <Walkthrough />
        <Curriculum />
        <Demo />
        <Safety />
        <Instructor />
        <Testimonials />
        <Pricing />
        <FeaturedGuides />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
