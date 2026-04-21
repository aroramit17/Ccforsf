import SEO from '../components/SEO.jsx'
import BlogLayout from '../components/BlogLayout.jsx'
import { getAllPosts } from '../lib/posts.js'

const COLORS = {
  orange: '#DA7756',
  textPrimary: '#f0f0f0',
  textSecondary: '#a0a0a0',
  textMuted: '#666666',
  border: 'rgba(255,255,255,0.08)',
}

function formatDate(d) {
  if (!d) return ''
  const date = new Date(d)
  if (Number.isNaN(date.getTime())) return d
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

const BLOG_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Blog',
  '@id': 'https://ccforsf.com/blog#blog',
  name: 'CC for SF Blog',
  description: 'Tutorials and field notes on using Claude Code with Salesforce.',
  url: 'https://ccforsf.com/blog',
  publisher: { '@id': 'https://ccforsf.com/#org' },
}

export default function Blog() {
  const posts = getAllPosts()

  return (
    <BlogLayout>
      <SEO
        title="Blog — Claude Code for Salesforce Admins"
        description="Tutorials, field notes, and prompts for Salesforce Admins using Claude Code to build Flows, fields, validation rules, and Apex."
        path="/blog"
        jsonLd={BLOG_JSON_LD}
      />
      <section style={{ padding: '80px 20px 40px' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600, letterSpacing: 2.5, color: COLORS.orange, textTransform: 'uppercase', marginBottom: 12 }}>
            Blog
          </div>
          <h1 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 800, color: COLORS.textPrimary, lineHeight: 1.1, marginBottom: 16, letterSpacing: -0.5 }}>
            Field notes from the terminal.
          </h1>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 17, color: COLORS.textSecondary, lineHeight: 1.6, maxWidth: 600 }}>
            Real walkthroughs of building Salesforce stuff with Claude Code — Flows, fields, validation rules, Apex. Written for admins, not engineers.
          </p>
        </div>
      </section>

      <section style={{ padding: '20px 20px 60px' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          {posts.length === 0 && (
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, color: COLORS.textMuted }}>
              First post lands soon.
            </p>
          )}
          {posts.map((p) => (
            <a
              key={p.slug}
              href={`/blog/${p.slug}`}
              style={{
                display: 'block',
                padding: '24px 0',
                borderTop: `1px solid ${COLORS.border}`,
                textDecoration: 'none',
              }}
            >
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: COLORS.textMuted, marginBottom: 8 }}>
                {formatDate(p.date)}
              </div>
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 24, fontWeight: 700, color: COLORS.textPrimary, lineHeight: 1.25, marginBottom: 8, letterSpacing: -0.3 }}>
                {p.title}
              </h2>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: COLORS.textSecondary, lineHeight: 1.6, margin: 0 }}>
                {p.description}
              </p>
            </a>
          ))}
        </div>
      </section>
    </BlogLayout>
  )
}
