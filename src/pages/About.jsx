import SEO from '../components/SEO.jsx'
import BlogLayout from '../components/BlogLayout.jsx'

const COLORS = {
  orange: '#DA7756',
  sfBlue: '#0176D3',
  green: '#22C55E',
  textPrimary: '#f0f0f0',
  textSecondary: '#a0a0a0',
  textMuted: '#666666',
  border: 'rgba(255,255,255,0.08)',
  surface2: '#1a1a1a',
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
      name: 'Amit',
      alternateName: 'AI with Amit',
      jobTitle: 'GTM Engineer, 8x Salesforce Certified',
      image: 'https://ccforsf.com/amit-headshot.png',
      url: 'https://ccforsf.com/about',
      description: 'GTM Engineer and AI tools builder. 8x Salesforce Certified. Creator of the CC for SF course teaching Salesforce Admins to use Claude Code for Flows, fields, validation rules, and Apex.',
      knowsAbout: [
        'Salesforce',
        'Salesforce DX',
        'Claude Code',
        'Anthropic Claude',
        'Apex',
        'Salesforce Flow',
        'Agentforce',
        'Go-to-market engineering',
      ],
      worksFor: { '@id': 'https://ccforsf.com/#org' },
    },
  ],
}

function Stat({ value, label }) {
  return (
    <div style={{ padding: '20px 0' }}>
      <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 32, fontWeight: 800, color: COLORS.orange, lineHeight: 1, marginBottom: 6 }}>{value}</div>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600, letterSpacing: 1.5, color: COLORS.textMuted, textTransform: 'uppercase' }}>{label}</div>
    </div>
  )
}

export default function About() {
  return (
    <BlogLayout>
      <SEO
        title="About Amit — creator of CC for SF"
        description="GTM Engineer, 8x Salesforce Certified, creator of the CC for SF course. Why I built this, who it's for, and how to get in touch."
        path="/about"
        image="/amit-headshot.png"
        jsonLd={ABOUT_JSON_LD}
      />

      <section style={{ padding: '80px 20px 40px' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600, letterSpacing: 2.5, color: COLORS.orange, textTransform: 'uppercase', marginBottom: 12 }}>
            About
          </div>
          <h1 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 800, color: COLORS.textPrimary, lineHeight: 1.1, marginBottom: 18, letterSpacing: -0.6 }}>
            Hi, I'm Amit.
          </h1>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 18, color: COLORS.textSecondary, lineHeight: 1.6, maxWidth: 640, marginBottom: 40 }}>
            GTM Engineer, 8× Salesforce Certified, and the creator of CC for SF. I build tools and teach other admins how to use AI — specifically Claude Code — to ship real Salesforce work faster.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 40, borderTop: `1px solid ${COLORS.border}`, borderBottom: `1px solid ${COLORS.border}`, padding: '8px 0', marginBottom: 48 }}>
            <Stat value="8×" label="Salesforce Certified" />
            <Stat value="10+" label="Years in Salesforce" />
            <Stat value="1,000s" label="Admins reached via AI with Amit" />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            <div>
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 26, fontWeight: 800, color: COLORS.textPrimary, marginBottom: 12, letterSpacing: -0.3 }}>Why this course exists</h2>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16.5, lineHeight: 1.7, color: COLORS.textSecondary, marginBottom: 14 }}>
                I started using Claude Code on my own org six months ago. The first week I built a record-triggered Flow, three custom fields, and a validation rule in about 40 minutes. On a normal Tuesday. Between meetings.
              </p>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16.5, lineHeight: 1.7, color: COLORS.textSecondary, marginBottom: 14 }}>
                That's when I realized most admins are about to get a huge lever — and most admins don't know it exists yet. CC for SF is the course I wish someone had handed me in week one.
              </p>
            </div>

            <div>
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 26, fontWeight: 800, color: COLORS.textPrimary, marginBottom: 12, letterSpacing: -0.3 }}>Who this is for</h2>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16.5, lineHeight: 1.7, color: COLORS.textSecondary, marginBottom: 14 }}>
                Working Salesforce Admins who know the platform and want to ship 10× faster without becoming a developer. If you already write Apex triggers on a daily basis, this probably isn't for you.
              </p>
            </div>

            <div>
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 26, fontWeight: 800, color: COLORS.textPrimary, marginBottom: 12, letterSpacing: -0.3 }}>Credentials</h2>
              <ul style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, lineHeight: 1.75, color: COLORS.textSecondary, paddingLeft: 22, marginBottom: 14 }}>
                <li>8× Salesforce Certified (Admin, Advanced Admin, Platform App Builder, Sales Cloud, Service Cloud, and more)</li>
                <li>GTM Engineer — building go-to-market tools at the intersection of Salesforce and AI</li>
                <li>Creator of <strong style={{ color: COLORS.textPrimary }}>AI with Amit</strong> — newsletter and tutorials on AI-native workflows for CRM teams</li>
                <li>Shipping production Salesforce work with Claude Code daily since 2025</li>
              </ul>
            </div>

            <div>
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 26, fontWeight: 800, color: COLORS.textPrimary, marginBottom: 12, letterSpacing: -0.3 }}>Get in touch</h2>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16.5, lineHeight: 1.7, color: COLORS.textSecondary, marginBottom: 14 }}>
                Questions about the course, feedback on a blog post, or just want to compare notes on Claude Code workflows? Email <a href="mailto:support@ccforsf.com" style={{ color: COLORS.orange, textDecoration: 'underline', textUnderlineOffset: 3 }}>support@ccforsf.com</a>.
              </p>
            </div>
          </div>

          <div style={{ marginTop: 56, padding: '28px', background: COLORS.surface2, border: `1px solid ${COLORS.border}`, borderRadius: 12 }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600, letterSpacing: 2, color: COLORS.orange, textTransform: 'uppercase', marginBottom: 10 }}>
              The course
            </div>
            <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 22, fontWeight: 800, color: COLORS.textPrimary, lineHeight: 1.2, marginBottom: 8, letterSpacing: -0.3 }}>
              CC for SF — $97, lifetime access
            </h3>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: COLORS.textSecondary, lineHeight: 1.6, marginBottom: 18 }}>
              The hands-on mini-course that teaches Salesforce Admins to build Flows, fields, and Apex with Claude Code — 30-day money-back guarantee.
            </p>
            <a href="/#pricing" style={{ display: 'inline-block', padding: '12px 22px', background: COLORS.orange, color: '#fff', borderRadius: 8, fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 800, textDecoration: 'none', letterSpacing: 0.3 }}>
              Get access →
            </a>
          </div>

          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: COLORS.textMuted, marginTop: 40, textAlign: 'center' }}>
            Last updated: April 21, 2026
          </p>
        </div>
      </section>
    </BlogLayout>
  )
}
