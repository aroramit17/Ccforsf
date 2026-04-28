import { useState, useEffect } from "react";
import SEO from "./components/SEO.jsx";
import "./SalesPage.css";

/* ══════════════════════════ CONSTANTS ══════════════════════════ */

const ENROLL_HASH = "#enroll";

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

function Nav() {
  const scrolled = useScrolled();
  return (
    <nav className={`nav ${scrolled ? "scrolled" : ""}`}>
      <a href="#top" className="nav-mark">
        <span className="glyph">CC</span>
        <span>CC&nbsp;<span style={{ color: "var(--ink-400)" }}>/</span>&nbsp;SF</span>
      </a>
      <div className="nav-links">
        <a href="#model">The Model</a>
        <a href="#build">What you'll build</a>
        <a href="#walkthrough">Watch</a>
        <a href="#curriculum">Curriculum</a>
        <a href={ENROLL_HASH}>Pricing</a>
        <a href={ENROLL_HASH} className="btn btn--primary" style={{ padding: "10px 18px" }}>
          Enroll <span className="arrow">→</span>
        </a>
      </div>
    </nav>
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
          <text x="6" y="76">A — PROMPT</text>
          <text x="6" y="316">B — CONTEXT</text>
          <text x="6" y="556">C — OUTPUT</text>
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
          <div className="hero-meta">
            <div className="eyebrow"><span className="num">01</span>A mini-course</div>
            <div className="hero-coords">
              <span>37.7749° N</span>
              <span>—</span>
              <span>SF·26</span>
            </div>
          </div>

          <h1 className="display">
            Claude Code,<br />
            for the modern<br />
            <em>Salesforce&nbsp;Admin.</em>
          </h1>

          <p className="lead" style={{ marginTop: "40px" }}>
            Install it. Connect it to your org. Use plain English to ship flows, validation
            rules, and metadata work — without a developer in the loop, and without
            ever touching the terminal as a stranger.
          </p>

          <div className="hero-ctas">
            <a href={ENROLL_HASH} className="btn btn--primary">
              Enroll Now <span className="arrow">→</span>
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

function Marquee() {
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
  const doubled = [...items, ...items];
  return (
    <div className="marquee">
      <div className="marquee-track">
        {doubled.map((t, i) => <span className="marquee-item" key={i}>{t}</span>)}
      </div>
    </div>
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
              The job has quietly become more strategic — and more constrained — than the
              tools were built for. Tickets queue. Sandboxes pile up. The point-and-click
              surface area keeps growing while the time you have to operate it does not.
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

function NewModel() {
  return (
    <section className="section section-divider reveal" id="model">
      <div className="shell">
        <div className="block-head">
          <div className="eyebrow"><span className="num">03</span>The new operating model</div>
          <div className="block-head-meta">Prompt-driven · Metadata-aware · Sandbox-validated</div>
        </div>

        <div className="model-intro">
          <h2 className="display">
            From clicking through screens<br />
            to <em>directing the work.</em>
          </h2>
          <p className="lead" style={{ marginTop: "28px", maxWidth: "62ch" }}>
            Claude Code reads your Salesforce project the way a senior architect would —
            knows your objects, fields, flows, and rules — and turns plain-English intent
            into reviewable, testable artifacts. You stay the operator. The model handles
            the surface area.
          </p>
        </div>

        <ModelDiagram />

        <div className="model-callout">
          <div className="callout-side">
            <div className="eyebrow">A note on control</div>
          </div>
          <div className="callout-body">
            <p className="serif-italic" style={{ fontSize: "24px", lineHeight: 1.4, color: "var(--ink-800)", maxWidth: "58ch", margin: 0 }}>
              "Claude Code is a partner, not an autopilot. Every change is reviewed,
              every change is sandboxed, every change is yours."
            </p>
          </div>
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
        code: `# Modify All — Account
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

        <div className="build-intro">
          <h2 className="display">
            Not features.<br />
            <em>Finished work.</em>
          </h2>
          <p className="lead" style={{ marginTop: "24px" }}>
            Each module ends with a real, deployable artifact — the kind of thing you'd
            normally file a ticket for. Here are four you'll ship in the course.
          </p>
        </div>

        <div className="build-grid">
          {builds.map((b) => <BuildPanel key={b.idx} {...b} />)}
        </div>
      </div>
    </section>
  );
}

function Walkthrough() {
  const beats = [
    {
      t: "00:12",
      label: "The prompt",
      body: "“Hey Claude, create a contact-role flow on the Opportunity object — when an opportunity is closed, update the contact's role.”",
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
            connects it to Salesforce DX, and runs the test loop end-to-end —
            the kind of thing that used to eat a full afternoon.
          </p>
        </div>

        <figure className="walkthrough-frame artifact">
          <div className="artifact-header">
            <span>UpdateContactRoleOnClosedWon.flow-meta.xml</span>
            <span style={{ color: "var(--accent)" }}>● live · 3 min</span>
          </div>
          <div className="walkthrough-video">
            {/* TODO: swap src to the hosted demo URL once uploaded */}
            <div className="walkthrough-poster" role="img" aria-label="Demo video coming soon">
              <div className="walkthrough-play" aria-hidden="true">▶</div>
              <div className="walkthrough-poster-label">Demo recording</div>
              <div className="walkthrough-poster-sub">Video file uploads next — watch this space</div>
            </div>
          </div>
          <figcaption className="walkthrough-caption">
            <span style={{ fontFamily: "var(--mono)", fontSize: "10px", letterSpacing: "0.12em", color: "var(--ink-500)", textTransform: "uppercase" }}>
              Caption
            </span>
            <span style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: "16px", color: "var(--ink-800)" }}>
              “I used to be deathly afraid of flows. Now all I do is test them — Claude does the build.”
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
    </section>
  );
}

function Curriculum() {
  const [open, setOpen] = useState(0);
  const phases = [
    {
      phase: "Phase I",
      title: "Foundation",
      duration: "~45 min",
      modules: [
        { n: "1.1", t: "Why Claude Code, why now", d: "The shift from point-and-click to prompt-driven admin work." },
        { n: "1.2", t: "Install — without fear", d: "Walk-through of installation on Mac and Windows. Terminal demystified." },
        { n: "1.3", t: "Your first useful output", d: "Within 15 minutes, a real artifact you can deploy." },
      ],
    },
    {
      phase: "Phase II",
      title: "Connection",
      duration: "~60 min",
      modules: [
        { n: "2.1", t: "Authenticating to your org", d: "Connecting Claude Code to your sandbox safely." },
        { n: "2.2", t: "Project context: telling Claude about your org", d: "How metadata becomes vocabulary." },
        { n: "2.3", t: "Reading the org: schemas, flows, rules", d: "From blank prompt to org-aware partner." },
      ],
    },
    {
      phase: "Phase III",
      title: "Building",
      duration: "~90 min",
      modules: [
        { n: "3.1", t: "Flows from plain English", d: "Generate, review, deploy." },
        { n: "3.2", t: "Validation rules and triggers", d: "When to use which — and how to spec them." },
        { n: "3.3", t: "Metadata and permissions work", d: "Audit, refactor, document." },
        { n: "3.4", t: "Documentation that stays current", d: "Auto-generated, version-controlled." },
      ],
    },
    {
      phase: "Phase IV",
      title: "Operating model",
      duration: "~45 min",
      modules: [
        { n: "4.1", t: "Sandbox-first patterns", d: "Validate before promote — every time." },
        { n: "4.2", t: "Review discipline", d: "Reading a diff like a senior architect." },
        { n: "4.3", t: "Where Claude ends, where you begin", d: "The boundaries of the partnership." },
      ],
    },
  ];

  return (
    <section className="section section-divider reveal" id="curriculum">
      <div className="shell">
        <div className="block-head">
          <div className="eyebrow"><span className="num">06</span>Course architecture</div>
          <div className="block-head-meta">Four phases · Twelve modules · ~4 hours</div>
        </div>

        <div className="curriculum-intro">
          <h2 className="display">
            A system, not<br />
            <em>a syllabus.</em>
          </h2>
        </div>

        <div className="curriculum">
          {phases.map((p, i) => {
            const isOpen = open === i;
            return (
              <div className={`phase ${isOpen ? "phase--open" : ""}`} key={p.phase}>
                <button className="phase-head" onClick={() => setOpen(isOpen ? -1 : i)} aria-expanded={isOpen}>
                  <div className="phase-head-l">
                    <span className="phase-tag">{p.phase}</span>
                    <span className="phase-title">{p.title}</span>
                  </div>
                  <div className="phase-head-r">
                    <span className="phase-duration">{p.duration}</span>
                    <span className="phase-count">{p.modules.length} modules</span>
                    <span className="phase-toggle">{isOpen ? "−" : "+"}</span>
                  </div>
                </button>
                <div className="phase-body" style={{ maxHeight: isOpen ? "600px" : "0px" }}>
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
              Type something<br />
              an <em>admin would say.</em>
            </h2>
            <p className="lead" style={{ marginTop: "20px" }}>
              In the course, this runs against your real org. Below: the kind of
              prompt-to-artifact loop you'll be running every day.
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
              <img className="portrait-photo" src="/amit-headshot.png" alt="Amit — instructor, 8× Salesforce Certified, GTM Engineer" />
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
              <em>"I was the admin</em><br />
              who was scared<br />
              of Flows."
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
              <div className="instructor-sign">— Amit</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ThrivecartEmbed() {
  useEffect(() => {
    const id = "tc-webpay-57-B6Q0BP";
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
      data-thrivecart-embeddable="tc-webpay-57-B6Q0BP"
    />
  );
}

function Pricing() {
  const includes = [
    "Twelve modules · ~4 hours of focused video",
    "Installation walk-throughs (Mac + Windows)",
    "Project files, prompts, and ready-to-fork repos",
    "Sandbox-safe operating playbook",
    "Lifetime access · all future updates",
    "CLAUDE.md Starter Template + Skill Pack for Salesforce",
    "Private community for course members",
  ];

  return (
    <section className="section section-divider reveal" id="enroll">
      <div className="shell">
        <div className="block-head">
          <div className="eyebrow"><span className="num">10</span>Enrollment</div>
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
              Requires a Claude Max subscription ($100/month — Claude Code now lives in Max).
              No Salesforce add-on license required beyond Enterprise / Unlimited / Developer edition.
            </p>
          </div>
        </div>
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
          <div className="eyebrow"><span className="num">11</span>Frequently asked</div>
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
              return (
                <div className={`faq-item ${isOpen ? "faq-item--open" : ""}`} key={i}>
                  <button className="faq-q" onClick={() => setOpenIdx(isOpen ? -1 : i)} aria-expanded={isOpen}>
                    <span className="faq-q-num">{String(i + 1).padStart(2, "0")}</span>
                    <span className="faq-q-text">{f.q}</span>
                    <span className="faq-toggle">{isOpen ? "−" : "+"}</span>
                  </button>
                  <div className="faq-a-wrap" style={{ maxHeight: isOpen ? "600px" : "0px" }}>
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

function FinalCTA() {
  return (
    <section className="section final-cta" id="cta">
      <div className="shell">
        <div className="final-cta-inner">
          <div className="eyebrow"><span className="num">12</span>One last thing</div>
          <h2 className="display final-cta-title">
            The admins who learn this<br />
            <em>this year</em> will be the<br />
            architects of next year.
          </h2>
          <div className="final-cta-buttons">
            <a href={ENROLL_HASH} className="btn btn--primary" style={{ padding: "20px 36px", fontSize: "15px" }}>
              Enroll Now <span className="arrow">→</span>
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
        title="CC for SF — Claude Code for Salesforce Admins"
        description="Hands-on mini-course. Use Claude Code to ship Flows, validation rules, and metadata work from plain English — no developer in the loop. $97 one-time, 30-day guarantee."
        path="/"
        jsonLd={HOMEPAGE_JSON_LD}
      />

      <Nav />
      <Hero />
      <Marquee />
      <Friction />
      <NewModel />
      <WhatYouBuild />
      <Walkthrough />
      <Curriculum />
      <Demo />
      <Safety />
      <Instructor />
      <Pricing />
      <FAQ />
      <FinalCTA />
      <Footer />
    </div>
  );
}
