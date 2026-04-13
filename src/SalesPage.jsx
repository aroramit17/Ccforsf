import { useState, useEffect, useRef } from "react";

const COLORS = {
  sfBlue: "#0176D3",
  sfBlueDark: "#014486",
  coral: "#DA7756",
  coralHover: "#C4613F",
  charcoal: "#12122A",
  heroGrad1: "#0B0B1E",
  heroGrad2: "#0D1B3E",
  cloudGray: "#F4F6F9",
  white: "#FFFFFF",
  textPrimary: "#181818",
  textSecondary: "#5A6A7B",
  terminal: "#1E1E2E",
  green: "#04844B",
  border: "#E5E9F0",
};

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.unobserve(el); } }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function Section({ bg, children, id, style = {} }) {
  const [ref, visible] = useInView(0.08);
  return (
    <section ref={ref} id={id} style={{ background: bg || COLORS.white, padding: "72px 20px", transition: "opacity 0.7s ease, transform 0.7s ease", opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(30px)", ...style }}>
      <div style={{ maxWidth: 760, margin: "0 auto" }}>{children}</div>
    </section>
  );
}

function SectionLabel({ children }) {
  return <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600, letterSpacing: 2.5, color: COLORS.sfBlue, textTransform: "uppercase", marginBottom: 12 }}>{children}</div>;
}

function H2({ children, center }) {
  return <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: "clamp(26px, 5vw, 36px)", fontWeight: 800, color: COLORS.textPrimary, lineHeight: 1.2, marginBottom: 20, textAlign: center ? "center" : "left", letterSpacing: -0.5 }}>{children}</h2>;
}

function BodyP({ children }) {
  return <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, lineHeight: 1.7, color: COLORS.textSecondary, marginBottom: 16 }}>{children}</p>;
}

function CTAButton({ children, large }) {
  const [hover, setHover] = useState(false);
  return (
    <button onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: large ? "18px 40px" : "14px 32px", background: hover ? COLORS.coralHover : COLORS.coral, color: "#fff", border: "none", borderRadius: 8, fontSize: large ? 17 : 15, fontWeight: 700, fontFamily: "'DM Sans', sans-serif", cursor: "pointer", transition: "all 0.25s ease", transform: hover ? "translateY(-2px)" : "translateY(0)", boxShadow: hover ? `0 8px 30px ${COLORS.coral}44` : `0 4px 16px ${COLORS.coral}33`, letterSpacing: 0.3 }}>
      {children} <span style={{ fontSize: large ? 20 : 17 }}>→</span>
    </button>
  );
}

function CheckItem({ children }) {
  return (
    <div style={{ display: "flex", gap: 12, marginBottom: 14, alignItems: "flex-start" }}>
      <div style={{ minWidth: 22, height: 22, borderRadius: 6, background: `${COLORS.green}15`, display: "flex", alignItems: "center", justifyContent: "center", marginTop: 2 }}>
        <span style={{ color: COLORS.green, fontSize: 14, fontWeight: 700 }}>✓</span>
      </div>
      <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, lineHeight: 1.6, color: COLORS.textPrimary }}>{children}</span>
    </div>
  );
}

function XItem({ children }) {
  return (
    <div style={{ display: "flex", gap: 12, marginBottom: 10, alignItems: "flex-start" }}>
      <span style={{ color: "#B0B8C4", fontSize: 14, minWidth: 22, textAlign: "center" }}>✗</span>
      <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, lineHeight: 1.5, color: "#94A3B8" }}>{children}</span>
    </div>
  );
}

function ModuleCard({ num, title, desc, time }) {
  const [hover, setHover] = useState(false);
  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} style={{ background: COLORS.white, border: `1px solid ${hover ? COLORS.sfBlue + "44" : COLORS.border}`, borderRadius: 12, padding: "24px 24px 20px", transition: "all 0.3s ease", transform: hover ? "translateY(-3px)" : "translateY(0)", boxShadow: hover ? "0 12px 40px rgba(1,118,211,0.08)" : "0 2px 8px rgba(0,0,0,0.04)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 700, color: COLORS.sfBlue, background: `${COLORS.sfBlue}10`, padding: "3px 10px", borderRadius: 4 }}>MODULE {num}</div>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#94A3B8" }}>{time}</div>
      </div>
      <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 17, fontWeight: 700, color: COLORS.textPrimary, marginBottom: 8, lineHeight: 1.3 }}>{title}</h3>
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: COLORS.textSecondary, lineHeight: 1.6, margin: 0 }}>{desc}</p>
    </div>
  );
}

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: `1px solid ${COLORS.border}`, cursor: "pointer" }} onClick={() => setOpen(!open)}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 0" }}>
        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 600, color: COLORS.textPrimary, paddingRight: 16 }}>{q}</span>
        <span style={{ fontSize: 20, color: COLORS.sfBlue, fontWeight: 300, transition: "transform 0.3s", transform: open ? "rotate(45deg)" : "rotate(0)" }}>+</span>
      </div>
      <div style={{ maxHeight: open ? 200 : 0, overflow: "hidden", transition: "max-height 0.4s ease" }}>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: COLORS.textSecondary, lineHeight: 1.7, margin: "0 0 18px", paddingRight: 40 }}>{a}</p>
      </div>
    </div>
  );
}

export default function SalesPage() {
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const h = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <div style={{ background: COLORS.white, minHeight: "100vh", overflowX: "hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;600;700;800&family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet" />

      {/* NAV */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, padding: "0 20px", background: scrollY > 50 ? "rgba(11,11,30,0.95)" : "transparent", backdropFilter: scrollY > 50 ? "blur(12px)" : "none", transition: "all 0.4s ease", borderBottom: scrollY > 50 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", height: 56 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 14, fontWeight: 700, color: COLORS.coral }}>cc</span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 14, fontWeight: 400, color: "rgba(255,255,255,0.5)" }}>for</span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 14, fontWeight: 700, color: COLORS.sfBlue }}>sf</span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.3)", marginLeft: 6 }}>.com</span>
          </div>
          <CTAButton>Get Access — $97</CTAButton>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ background: `linear-gradient(160deg, ${COLORS.heroGrad1} 0%, ${COLORS.heroGrad2} 50%, #0D2847 100%)`, padding: "140px 20px 80px", position: "relative", overflow: "hidden" }}>
        {/* Decorative grid */}
        <div style={{ position: "absolute", inset: 0, opacity: 0.04, backgroundImage: `linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)`, backgroundSize: "60px 60px" }} />
        {/* Glow orb */}
        <div style={{ position: "absolute", top: "20%", right: "-5%", width: 400, height: 400, background: `radial-gradient(circle, ${COLORS.sfBlue}22 0%, transparent 70%)`, borderRadius: "50%", filter: "blur(60px)" }} />
        <div style={{ position: "absolute", bottom: "10%", left: "-5%", width: 300, height: 300, background: `radial-gradient(circle, ${COLORS.coral}18 0%, transparent 70%)`, borderRadius: "50%", filter: "blur(50px)" }} />

        <div style={{ maxWidth: 760, margin: "0 auto", position: "relative", zIndex: 2 }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 600, letterSpacing: 3, color: COLORS.coral, marginBottom: 20, opacity: 0.9 }}>CLAUDE CODE × SALESFORCE</div>
          <h1 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: "clamp(32px, 6.5vw, 52px)", fontWeight: 800, color: "#FFFFFF", lineHeight: 1.1, marginBottom: 24, letterSpacing: -1, maxWidth: 680 }}>
            Build Flows, Triggers & Validation Rules with AI
            <span style={{ color: COLORS.coral }}>—</span> in Minutes
          </h1>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(16px, 2.5vw, 19px)", color: "rgba(255,255,255,0.6)", lineHeight: 1.6, maxWidth: 560, marginBottom: 36 }}>
            The hands-on mini-course that teaches Salesforce Admins how to use Claude Code as their AI development partner. No coding background required. No Agentforce license needed.
          </p>
          <CTAButton large>Get Instant Access — $97</CTAButton>
          <div style={{ marginTop: 24, display: "flex", gap: 20, flexWrap: "wrap" }}>
            {["5 video modules", "60 min total", "Lifetime access", "7-day guarantee"].map((t, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 4, height: 4, borderRadius: "50%", background: COLORS.coral }} />
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.45)" }}>{t}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* THE PROBLEM */}
      <Section bg={COLORS.white}>
        <SectionLabel>The Problem</SectionLabel>
        <H2>You're Being Asked to Do More with Less</H2>
        {[
          ["$125–$550/user/month", "— that's what Agentforce costs before the $50K+ implementation. Your org wants AI yesterday, but not at that price."],
          ["40–60% of admin tasks", "are being automated. The admins who learn AI tools now will lead the ones who don't."],
          ["Stuck between extremes:", "\"learn to code\" or \"wait for IT\" while your backlog grows and your leadership asks what's taking so long."],
          ["There's a $17/month tool", "that outperforms Agentforce Vibes for Flow generation — and almost nobody in the Salesforce ecosystem is talking about it."],
        ].map(([bold, rest], i) => (
          <div key={i} style={{ display: "flex", gap: 14, marginBottom: 18, alignItems: "flex-start" }}>
            <div style={{ minWidth: 6, height: 6, borderRadius: "50%", background: COLORS.coral, marginTop: 10 }} />
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, lineHeight: 1.7, color: COLORS.textSecondary, margin: 0 }}>
              <strong style={{ color: COLORS.textPrimary }}>{bold}</strong> {rest}
            </p>
          </div>
        ))}
      </Section>

      {/* THE BRIDGE */}
      <Section bg={COLORS.cloudGray}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <SectionLabel>The Solution</SectionLabel>
          <H2 center>What If You Could Build Like a Developer — Without Becoming One?</H2>
          <BodyP>Claude Code is Anthropic's AI coding assistant. It connects directly to your Salesforce org and builds Flows, Apex triggers, validation rules, and LWCs from plain English prompts. It costs $17/month. No Salesforce add-on license required.</BodyP>
        </div>

        {/* Terminal mockup */}
        <div style={{ background: COLORS.terminal, borderRadius: 12, overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ padding: "10px 16px", background: "rgba(255,255,255,0.03)", display: "flex", gap: 6, alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#FF5F57" }} />
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#FEBC2E" }} />
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#28C840" }} />
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "rgba(255,255,255,0.3)", marginLeft: 10 }}>claude-code — salesforce-org</span>
          </div>
          <div style={{ padding: "20px 24px" }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, lineHeight: 2 }}>
              <span style={{ color: COLORS.coral }}>❯</span> <span style={{ color: "rgba(255,255,255,0.5)" }}>claude</span> <span style={{ color: "#A5D6FF" }}>"Build a lead assignment Flow that routes</span>
              <br />
              <span style={{ color: "#A5D6FF" }}>{"  "}Enterprise leads to the West region team and</span>
              <br />
              <span style={{ color: "#A5D6FF" }}>{"  "}assigns a follow-up task due in 48 hours"</span>
              <br /><br />
              <span style={{ color: COLORS.green }}>✓</span> <span style={{ color: "rgba(255,255,255,0.6)" }}>Flow created:</span> <span style={{ color: "#E2E8F0" }}>Lead_Assignment_Enterprise.flow</span>
              <br />
              <span style={{ color: COLORS.green }}>✓</span> <span style={{ color: "rgba(255,255,255,0.6)" }}>3 decision elements, 2 assignments, 1 scheduled path</span>
              <br />
              <span style={{ color: COLORS.green }}>✓</span> <span style={{ color: "rgba(255,255,255,0.6)" }}>Ready to activate in your org</span>
            </div>
          </div>
        </div>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#94A3B8", textAlign: "center", marginTop: 16 }}>That's it. One prompt. One Flow. Sixty seconds.</p>
      </Section>

      {/* MODULES */}
      <Section bg={COLORS.white}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <SectionLabel>What You'll Learn</SectionLabel>
          <H2 center>60 Minutes to Your First AI-Built Flow</H2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
          <ModuleCard num="01" title="Setup in 10 Minutes" time="10 min" desc="Install Claude Code, connect to your Salesforce DX environment, and create your first CLAUDE.md configuration file. Zero terminal experience needed." />
          <ModuleCard num="02" title="Your First AI-Generated Flow" time="15 min" desc="Watch me prompt Claude Code to build a complete lead assignment Flow from scratch. See the prompt, the output, and how to deploy it." />
          <ModuleCard num="03" title="Validation Rules & Apex Without Code" time="15 min" desc="Generate validation rules and lightweight Apex triggers using plain English. Ship code you couldn't write manually." />
          <ModuleCard num="04" title="When AI Gets It Wrong" time="15 min" desc="Real errors. Real debugging. The 3-step process to get Claude Code back on track when it misfires." />
          <ModuleCard num="05" title="The $17 vs $550 Conversation" time="10 min" desc="The ROI framework and talking points to pitch Claude Code to your leadership team. Make the business case." />
        </div>
      </Section>

      {/* THE MATH */}
      <Section bg={COLORS.cloudGray}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <SectionLabel>The Math</SectionLabel>
          <H2 center>The Cost of Waiting vs. The Cost of Learning</H2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
          {/* Without */}
          <div style={{ background: COLORS.white, borderRadius: 12, padding: 28, border: `1px solid ${COLORS.border}` }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 700, color: "#94A3B8", letterSpacing: 1.5, marginBottom: 20 }}>WITHOUT CLAUDE CODE</div>
            {[
              ["Agentforce license", "$125–$550/mo"],
              ["Implementation", "$50K–$150K"],
              ["Time to first automation", "8–12 weeks"],
              ["Dependency", "IT + Salesforce AE"],
            ].map(([k, v], i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${COLORS.border}` }}>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: COLORS.textSecondary }}>{k}</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 600, color: "#94A3B8" }}>{v}</span>
              </div>
            ))}
          </div>
          {/* With */}
          <div style={{ background: COLORS.white, borderRadius: 12, padding: 28, border: `2px solid ${COLORS.sfBlue}33`, boxShadow: `0 8px 30px ${COLORS.sfBlue}08` }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 700, color: COLORS.sfBlue, letterSpacing: 1.5, marginBottom: 20 }}>WITH CLAUDE CODE</div>
            {[
              ["Claude Pro subscription", "$17/mo"],
              ["This course", "$97 one-time"],
              ["Time to first automation", "60 minutes"],
              ["Dependency", "Just you"],
            ].map(([k, v], i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${COLORS.border}` }}>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: COLORS.textPrimary }}>{k}</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 700, color: COLORS.sfBlue }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ textAlign: "center", marginTop: 28, padding: "16px 24px", background: `${COLORS.sfBlue}08`, borderRadius: 10, border: `1px solid ${COLORS.sfBlue}18` }}>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 600, color: COLORS.textPrimary, margin: 0 }}>
            10× cost reduction. 60× speed increase. <span style={{ color: COLORS.sfBlue }}>Same results.</span>
          </p>
        </div>
      </Section>

      {/* WHO THIS IS FOR */}
      <Section bg={COLORS.white}>
        <SectionLabel>Is This For You?</SectionLabel>
        <H2>This Is For You If...</H2>
        <div style={{ marginBottom: 28 }}>
          <CheckItem>You're a Salesforce Admin who's never used a terminal or CLI tool before</CheckItem>
          <CheckItem>You've heard about AI coding tools but don't know where to start</CheckItem>
          <CheckItem>Your org is asking about AI and you want to be the one with answers</CheckItem>
          <CheckItem>You're tired of waiting for developers to build what you already know how to spec</CheckItem>
          <CheckItem>You want to future-proof your career before the 330% admin supply glut catches up</CheckItem>
        </div>
        <div style={{ padding: "20px 24px", background: COLORS.cloudGray, borderRadius: 10 }}>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, color: "#94A3B8", marginBottom: 10 }}>This is NOT for:</p>
          <XItem>Experienced Salesforce developers already using VS Code extensions</XItem>
          <XItem>Certification prep — this is a practical skills course, not exam study</XItem>
          <XItem>Salesforce's Einstein or Agentforce products — this is a third-party tool</XItem>
        </div>
      </Section>

      {/* INSTRUCTOR */}
      <Section bg={COLORS.cloudGray}>
        <SectionLabel>Your Instructor</SectionLabel>
        <div style={{ display: "flex", gap: 24, alignItems: "flex-start", flexWrap: "wrap" }}>
          <div style={{ width: 80, height: 80, borderRadius: 16, background: `linear-gradient(135deg, ${COLORS.sfBlue}, ${COLORS.coral})`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <span style={{ fontSize: 32, color: "#fff", fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800 }}>A</span>
          </div>
          <div style={{ flex: 1, minWidth: 240 }}>
            <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 22, fontWeight: 700, color: COLORS.textPrimary, marginBottom: 4 }}>Amit</h3>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: COLORS.sfBlue, marginBottom: 14 }}>GTM Engineer · Salesforce Admin · AI Tools Builder</p>
            <BodyP>I've spent years in the Salesforce ecosystem doing RevOps, sales operations, and CRM architecture. When Claude Code launched, I started using it to build Flows, automate lead routing, and generate Apex — things that used to require a developer. This course is everything I wish someone had shown me on Day 1.</BodyP>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 8 }}>
              {["Enterprise Salesforce workflows", "Claude Code & OpenClaw builder", "Creator of AI with Amit"].map((t, i) => (
                <span key={i} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: COLORS.textSecondary, background: COLORS.white, padding: "4px 12px", borderRadius: 6, border: `1px solid ${COLORS.border}` }}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* FAQ */}
      <Section bg={COLORS.white}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <SectionLabel>FAQ</SectionLabel>
          <H2 center>Common Questions</H2>
        </div>
        <FAQItem q="Do I need to know how to code?" a="No. The entire course assumes zero coding background. Claude Code writes the code — you describe what you want in plain English." />
        <FAQItem q="Do I need a paid Claude subscription?" a="You'll need Claude Pro ($17/month) to use Claude Code. The course walks you through setup." />
        <FAQItem q="Will this work with my Salesforce edition?" a="Claude Code works with any org that supports Salesforce DX — Enterprise, Unlimited, and Developer editions. No Salesforce add-on license required." />
        <FAQItem q="How long do I have access?" a="Lifetime access. Watch it once, revisit it anytime. All future updates included." />
        <FAQItem q="What if I'm not satisfied?" a="Full refund within 7 days, no questions asked." />
        <FAQItem q="Is this affiliated with Salesforce or Anthropic?" a="No. This is an independent course by a practitioner. Salesforce and Claude Code are trademarks of their respective companies." />
      </Section>

      {/* FINAL CTA */}
      <section style={{ background: `linear-gradient(160deg, ${COLORS.heroGrad1} 0%, ${COLORS.heroGrad2} 50%, #0D2847 100%)`, padding: "80px 20px", position: "relative", overflow: "hidden", textAlign: "center" }}>
        <div style={{ position: "absolute", top: "30%", left: "50%", transform: "translateX(-50%)", width: 500, height: 500, background: `radial-gradient(circle, ${COLORS.coral}12 0%, transparent 60%)`, borderRadius: "50%", filter: "blur(80px)" }} />
        <div style={{ maxWidth: 600, margin: "0 auto", position: "relative", zIndex: 2 }}>
          <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: "clamp(26px, 5vw, 40px)", fontWeight: 800, color: "#FFFFFF", lineHeight: 1.15, marginBottom: 20, letterSpacing: -0.5 }}>
            The Admins Who Learn AI First Will Lead the Ones Who Don't
          </h2>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 17, color: "rgba(255,255,255,0.55)", lineHeight: 1.6, marginBottom: 32 }}>
            60 minutes. 5 modules. $17/month tool. $97 one-time investment.
          </p>
          <CTAButton large>Get Instant Access — $97</CTAButton>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.3)", marginTop: 20 }}>
            Secure checkout via Gumroad · Instant access · 7-day money-back guarantee
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: COLORS.charcoal, padding: "32px 20px", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 700, color: COLORS.coral }}>cc</span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: "rgba(255,255,255,0.3)" }}>for</span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 700, color: COLORS.sfBlue }}>sf</span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.2)" }}>.com</span>
          </div>
          <div style={{ display: "flex", gap: 20 }}>
            {["Terms", "Privacy", "Refund Policy"].map((t, i) => (
              <span key={i} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.25)", cursor: "pointer" }}>{t}</span>
            ))}
          </div>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.15)" }}>© 2026 AI with Amit</span>
        </div>
      </footer>
    </div>
  );
}
