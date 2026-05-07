import SEO from '../components/SEO.jsx'
import BlogLayout from '../components/BlogLayout.jsx'

const COLORS = {
  orange: '#DA7756',
  sfBlue: '#0176D3',
  green: '#22C55E',
  textPrimary: '#1A1815',
  textSecondary: '#5A5348',
  textMuted: '#8A8272',
  border: 'rgba(26,24,21,0.09)',
  borderStrong: 'rgba(26,24,21,0.15)',
  surface2: '#FAF6EC',
  bone: '#F1ECDF',
}

const ABOUT_JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'AboutPage',
      '@id': 'https://ccforsf.com/about#page',
      url: 'https://ccforsf.com/about',
      name: 'About Amit — creator of CC for SF',
      mainEntity: { '@id': 'https://ccforsf.com/#amit' },
    },
    {
      '@type': 'Person',
      '@id': 'https://ccforsf.com/#amit',
      name: 'Amit Arora',
      alternateName: 'AI with Amit',
      jobTitle: 'GTM Engineer, 8× Salesforce Certified',
      image: 'https://ccforsf.com/amit-headshot.png',
      url: 'https://ccforsf.com/about',
      email: 'mailto:me@amit.so',
      address: { '@type': 'PostalAddress', addressLocality: 'Aubrey', addressRegion: 'TX', addressCountry: 'US' },
      description: 'GTM Engineer and AI tools builder. 8× Salesforce Certified. Creator of the CC for SF course teaching Salesforce Admins to use Claude Code for Flows, fields, validation rules, and Apex.',
      knowsAbout: [
        'Salesforce',
        'Salesforce DX',
        'Claude Code',
        'Anthropic Claude',
        'Apex',
        'Salesforce Flow',
        'Agentforce',
        'Go-to-market engineering',
        'Revenue operations',
      ],
      sameAs: [
        'https://amit.so',
        'https://www.youtube.com/@aiwithamit',
        'https://medium.com/gptcommands',
      ],
      worksFor: { '@id': 'https://ccforsf.com/#org' },
    },
  ],
}

function Stat({ value, label }) {
  return (
    <div>
      <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 'clamp(28px, 4vw, 38px)', fontWeight: 800, color: COLORS.textPrimary, lineHeight: 1, marginBottom: 6, letterSpacing: -0.5 }}>{value}</div>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600, letterSpacing: 1.5, color: COLORS.textMuted, textTransform: 'uppercase' }}>{label}</div>
    </div>
  )
}

function CaseStudyCard({ category, title, body }) {
  return (
    <article style={{ padding: 28, border: `1px solid ${COLORS.border}`, borderRadius: 16, background: '#fff', display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, fontWeight: 600, letterSpacing: 1.8, color: COLORS.orange, textTransform: 'uppercase' }}>{category}</div>
      <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 22, fontWeight: 800, color: COLORS.textPrimary, lineHeight: 1.25, letterSpacing: -0.3 }}>{title}</h3>
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, lineHeight: 1.65, color: COLORS.textSecondary }}>{body}</p>
    </article>
  )
}

function CareerRow({ company, role, period, summary, bullets }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(140px, 200px) 1fr', gap: 32, alignItems: 'start', padding: '28px 0', borderTop: `1px solid ${COLORS.border}` }} className="career-row">
      <div>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600, letterSpacing: 1.6, color: COLORS.textMuted, textTransform: 'uppercase', marginBottom: 6 }}>{period}</div>
        <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 18, fontWeight: 700, color: COLORS.textPrimary, letterSpacing: -0.2 }}>{company}</div>
      </div>
      <div>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14.5, fontWeight: 600, color: COLORS.textPrimary, marginBottom: 8 }}>{role}</div>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15.5, lineHeight: 1.65, color: COLORS.textSecondary, marginBottom: bullets ? 12 : 0 }}>{summary}</p>
        {bullets && (
          <ul style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14.5, lineHeight: 1.65, color: COLORS.textSecondary, paddingLeft: 18, margin: 0 }}>
            {bullets.map((b) => <li key={b} style={{ marginBottom: 4 }}>{b}</li>)}
          </ul>
        )}
      </div>
    </div>
  )
}

function CertBadge({ name }) {
  return (
    <div style={{ padding: '12px 14px', border: `1px solid ${COLORS.border}`, borderRadius: 10, background: '#fff', fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: COLORS.textPrimary, letterSpacing: 0.02 }}>
      <span style={{ color: COLORS.orange, marginRight: 8 }}>✓</span>{name}
    </div>
  )
}

function ProjectCard({ title, kind, body, footer }) {
  return (
    <article
      className="project-card"
      style={{
        padding: 24,
        border: `1px solid ${COLORS.border}`,
        borderRadius: 14,
        background: '#fff',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}
    >
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, fontWeight: 600, letterSpacing: 1.8, color: COLORS.orange, textTransform: 'uppercase' }}>{kind}</div>
      <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 19, fontWeight: 800, color: COLORS.textPrimary, lineHeight: 1.25, letterSpacing: -0.3 }}>{title}</h3>
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14.5, lineHeight: 1.6, color: COLORS.textSecondary, flex: 1 }}>{body}</p>
      {footer && <div style={{ marginTop: 6 }}>{footer}</div>}
    </article>
  )
}

export default function About() {
  return (
    <BlogLayout>
      <SEO
        title="About Amit Arora — creator of CC for SF"
        description="GTM Engineer, 8× Salesforce Certified, creator of the CC for SF course. 10+ years building revenue operations at Avangrid, Slalom, DHI, and webAI."
        path="/about"
        image="/amit-headshot.png"
        jsonLd={ABOUT_JSON_LD}
      />

      <style>{`
        .about-hero-grid { display: grid; grid-template-columns: 1fr; gap: 32px; align-items: center; }
        @media (min-width: 880px) { .about-hero-grid { grid-template-columns: 1.15fr 0.85fr; gap: 56px; } }
        .about-stats-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; }
        @media (min-width: 720px) { .about-stats-grid { grid-template-columns: repeat(4, 1fr); gap: 32px; } }
        .case-grid { display: grid; grid-template-columns: 1fr; gap: 20px; }
        @media (min-width: 720px) { .case-grid { grid-template-columns: 1fr 1fr; gap: 24px; } }
        .cert-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        @media (min-width: 720px) { .cert-grid { grid-template-columns: repeat(4, 1fr); gap: 14px; } }
        .project-grid { display: grid; grid-template-columns: 1fr; gap: 18px; }
        @media (min-width: 720px) { .project-grid { grid-template-columns: 1fr 1fr; gap: 22px; } }
        .career-row { transition: background 0.2s ease; }
        .career-row:hover { background: rgba(218,119,86,0.04); }
        .about-cta-row { display: flex; flex-wrap: wrap; gap: 12px; }
        .about-sticky-cta {
          position: fixed;
          right: 24px;
          bottom: 24px;
          z-index: 60;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 14px 22px;
          background: ${COLORS.orange};
          color: #fff;
          border-radius: 999px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 800;
          letter-spacing: 0.3px;
          text-decoration: none;
          box-shadow: 0 14px 36px rgba(218,119,86,0.32), 0 4px 12px rgba(0,0,0,0.12);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .about-sticky-cta:hover { transform: translateY(-2px); box-shadow: 0 18px 44px rgba(218,119,86,0.42), 0 6px 14px rgba(0,0,0,0.16); }
        @media (max-width: 600px) {
          .about-sticky-cta { right: 14px; bottom: 14px; padding: 12px 18px; font-size: 13px; }
        }
      `}</style>

      {/* HERO */}
      <section style={{ padding: '64px 20px 32px' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          <div className="about-hero-grid">
            <div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600, letterSpacing: 2.5, color: COLORS.orange, textTransform: 'uppercase', marginBottom: 14 }}>
                About
              </div>
              <h1 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 'clamp(36px, 6vw, 56px)', fontWeight: 800, color: COLORS.textPrimary, lineHeight: 1.05, marginBottom: 18, letterSpacing: -0.8 }}>
                Amit Arora
              </h1>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 'clamp(18px, 2.2vw, 22px)', color: COLORS.textSecondary, lineHeight: 1.45, maxWidth: 560, marginBottom: 28 }}>
                I build the GTM operating system your revenue team is missing. Now I'm teaching admins to do the same with Claude Code.
              </p>
              <div className="about-cta-row">
                <a href="/#pricing" style={{ display: 'inline-block', padding: '12px 22px', background: COLORS.orange, color: '#fff', borderRadius: 8, fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 800, textDecoration: 'none', letterSpacing: 0.3 }}>
                  Get the course →
                </a>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 18, marginTop: 28, fontFamily: "'JetBrains Mono', monospace", fontSize: 11.5, color: COLORS.textMuted, letterSpacing: 0.05 }}>
                <span><strong style={{ color: COLORS.textPrimary }}>8×</strong> Salesforce Certified</span>
                <span><strong style={{ color: COLORS.textPrimary }}>10+</strong> yrs Revenue Ops</span>
                <span>Aubrey, TX</span>
              </div>
            </div>
            <div>
              <div style={{ width: '100%', aspectRatio: '1 / 1', borderRadius: 20, overflow: 'hidden', border: `1px solid ${COLORS.border}`, boxShadow: '0 20px 60px rgba(0,0,0,0.18)' }}>
                <picture>
                  <source
                    type="image/avif"
                    srcSet="/images/amit-headshot-400.avif 400w, /images/amit-headshot-800.avif 800w"
                    sizes="(max-width: 880px) 100vw, 400px"
                  />
                  <source
                    type="image/webp"
                    srcSet="/images/amit-headshot-400.webp 400w, /images/amit-headshot-800.webp 800w"
                    sizes="(max-width: 880px) 100vw, 400px"
                  />
                  <img
                    src="/amit-headshot.png"
                    alt="Amit Arora — 8× Salesforce Certified, GTM Engineer, creator of CC for SF"
                    width="1024"
                    height="1024"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                </picture>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section style={{ padding: '48px 20px', background: COLORS.bone }}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600, letterSpacing: 2.5, color: COLORS.orange, textTransform: 'uppercase', marginBottom: 14 }}>
            01 · About
          </div>
          <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 'clamp(28px, 4.5vw, 40px)', fontWeight: 800, color: COLORS.textPrimary, lineHeight: 1.15, marginBottom: 24, letterSpacing: -0.5, maxWidth: 720 }}>
            10+ years driving GTM transformation across Salesforce, RevOps, and AI.
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16, maxWidth: 760, marginBottom: 36 }}>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 17, lineHeight: 1.7, color: COLORS.textSecondary }}>
              I've spent a decade owning the systems behind revenue teams: Salesforce architecture, lead-to-cash plumbing, forecasting, ICP scoring, and the AI/automation work that holds it all together. I started as the admin who was scared of Flows. I ended up rebuilding entire GTM stacks at venture-backed startups and Fortune-1000 enterprises.
            </p>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 17, lineHeight: 1.7, color: COLORS.textSecondary }}>
              The tools changed everything. <strong style={{ color: COLORS.textPrimary }}>+25% forecasting accuracy</strong> at DHI Group. <strong style={{ color: COLORS.textPrimary }}>98% client satisfaction</strong> across enterprise Salesforce delivery at Slalom. And then Claude Code came out, and the rate at which a single admin could ship work jumped a full order of magnitude.
            </p>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 17, lineHeight: 1.7, color: COLORS.textSecondary }}>
              CC for SF is the course I wish someone had handed me in week one. It compresses everything I learned the hard way into a path you can run in an afternoon.
            </p>
          </div>

          <div className="about-stats-grid">
            <Stat value="10+" label="Years of Experience" />
            <Stat value="8×" label="Salesforce Certified" />
            <Stat value="+25%" label="Forecast Accuracy Gain" />
            <Stat value="A–B" label="Series A–B Startup Experience" />
          </div>
        </div>
      </section>

      {/* SELECTED WORK */}
      <section style={{ padding: '64px 20px' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600, letterSpacing: 2.5, color: COLORS.orange, textTransform: 'uppercase', marginBottom: 14 }}>
            02 · Selected Work
          </div>
          <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 'clamp(28px, 4.5vw, 40px)', fontWeight: 800, color: COLORS.textPrimary, lineHeight: 1.15, marginBottom: 28, letterSpacing: -0.5 }}>
            Where the work showed up.
          </h2>
          <div className="case-grid">
            <CaseStudyCard
              category="Revenue Operations"
              title="Automated ICP scoring engine at webAI"
              body="Inside the first six months at a VC-backed AI startup, stood up a closed-loop ICP scoring engine using HubSpot, Clay, Apify, and Claude. Pipeline conversion rates moved by double digits in the first quarter the system was live."
            />
            <CaseStudyCard
              category="GTM Systems · Business Transformation"
              title="Lead-to-cash transformation at DHI Group"
              body="Migrated Salesforce Classic to Lightning while re-engineering the full lead-to-cash process. Forecasting accuracy improved by 25% on the backside of the migration."
            />
          </div>
        </div>
      </section>

      {/* CAREER */}
      <section style={{ padding: '48px 20px', background: COLORS.bone }}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600, letterSpacing: 2.5, color: COLORS.orange, textTransform: 'uppercase', marginBottom: 14 }}>
            03 · Career
          </div>
          <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 'clamp(28px, 4.5vw, 40px)', fontWeight: 800, color: COLORS.textPrimary, lineHeight: 1.15, marginBottom: 12, letterSpacing: -0.5 }}>
            Where I've made impact.
          </h2>
          <div style={{ borderBottom: `1px solid ${COLORS.border}`, marginTop: 16 }}>
            <CareerRow
              period="Mar 2025 — Apr 2026"
              company="webAI, Inc."
              role="Revenue Operations Manager"
              summary="Stood up RevOps from scratch at a VC-backed AI startup. Owned the HubSpot-to-Salesforce transition and built the ICP scoring engine on a HubSpot + Clay + Apify + Claude stack."
            />
            <CareerRow
              period="Oct 2021 — Jul 2024"
              company="DHI Group Inc."
              role="Director, Business Systems"
              summary="Owned the GTM tech stack across two B2B SaaS brands. Led the Classic-to-Lightning migration and the lead-to-cash redesign that delivered +25% forecast accuracy."
            />
            <CareerRow
              period="May 2018 — Oct 2021"
              company="Slalom LLC"
              role="Salesforce Consultant"
              summary="Delivered enterprise Salesforce solutions across Sales, Service, and Experience Cloud. Maintained 98% client satisfaction and 95% project success rate across the engagement portfolio."
            />
            <CareerRow
              period="Jun 2015 — May 2018"
              company="Avangrid"
              role="Sr. Salesforce Administrator"
              summary="Led a $750K Salesforce migration for a Fortune-500 utility and drove +30% operational efficiency across the supported business units."
            />
          </div>
        </div>
      </section>

      {/* CERTIFICATIONS */}
      <section style={{ padding: '64px 20px' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600, letterSpacing: 2.5, color: COLORS.orange, textTransform: 'uppercase', marginBottom: 14 }}>
            04 · Credentials
          </div>
          <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 'clamp(28px, 4.5vw, 40px)', fontWeight: 800, color: COLORS.textPrimary, lineHeight: 1.15, marginBottom: 24, letterSpacing: -0.5 }}>
            8× Salesforce Certified.
          </h2>
          <div className="cert-grid">
            {[
              'Salesforce Administrator',
              'Advanced Administrator',
              'Sales Cloud Consultant',
              'Service Cloud Consultant',
              'Experience Cloud Consultant',
              'AI Associate',
              'Agentforce Specialist',
              'Salesforce Maps Accredited',
            ].map((c) => <CertBadge key={c} name={c} />)}
          </div>
        </div>
      </section>

      {/* SIDE PROJECTS */}
      <section style={{ padding: '48px 20px', background: COLORS.bone }}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600, letterSpacing: 2.5, color: COLORS.orange, textTransform: 'uppercase', marginBottom: 14 }}>
            05 · Building
          </div>
          <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 'clamp(28px, 4.5vw, 40px)', fontWeight: 800, color: COLORS.textPrimary, lineHeight: 1.15, marginBottom: 24, letterSpacing: -0.5 }}>
            What I'm shipping outside the day job.
          </h2>
          <div className="project-grid">
            <ProjectCard
              kind="YouTube Channel"
              title="AI with Amit"
              body="Teaching SMBs and solopreneurs how to wire up AI agent workflows that actually move pipeline. Practical, no fluff."
            />
            <ProjectCard
              kind="Medium Publication"
              title="GPTcommands"
              body="Real-world AI prompting, use cases, and automation guides. Where I publish the longer-form notes that don't fit in a video."
            />
            <ProjectCard
              kind="Course"
              title="CC for SF"
              body="The course you're already on. Salesforce Admins learn to ship Flows, fields, validation rules, and Apex with Claude Code instead of the click-tax."
              footer={(
                <a href="/#pricing" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 700, letterSpacing: 0.5, color: COLORS.orange, textDecoration: 'none' }}>
                  Get the course →
                </a>
              )}
            />
            <ProjectCard
              kind="Open Source Tool"
              title="Job Tracker"
              body="A small personal job application tracker I open-sourced. Shows the kind of vibe-coded tool you can ship in an afternoon when AI is in the loop."
            />
          </div>
        </div>
      </section>

      {/* CONNECT */}
      <section style={{ padding: '64px 20px 96px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600, letterSpacing: 2.5, color: COLORS.orange, textTransform: 'uppercase', marginBottom: 14 }}>
            06 · Connect
          </div>
          <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 'clamp(28px, 4.5vw, 40px)', fontWeight: 800, color: COLORS.textPrimary, lineHeight: 1.15, marginBottom: 16, letterSpacing: -0.5 }}>
            Let's talk.
          </h2>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 17, lineHeight: 1.65, color: COLORS.textSecondary, marginBottom: 28, maxWidth: 580, marginLeft: 'auto', marginRight: 'auto' }}>
            Ready to stop clicking and start prompting? The course is the whole reason this site exists.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
            <a href="/#pricing" style={{ display: 'inline-block', padding: '14px 26px', background: COLORS.orange, color: '#fff', borderRadius: 8, fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 800, textDecoration: 'none', letterSpacing: 0.3 }}>
              Get the course →
            </a>
          </div>
        </div>
      </section>

      <a href="/#pricing" className="about-sticky-cta" aria-label="Get Lifetime Access for $97">
        Get Lifetime Access · $97 <span aria-hidden="true">→</span>
      </a>
    </BlogLayout>
  )
}
