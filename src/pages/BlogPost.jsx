import { useParams } from 'react-router-dom'
import SEO from '../components/SEO.jsx'
import BlogLayout from '../components/BlogLayout.jsx'
import NewsletterCTA from '../components/NewsletterCTA.jsx'
import { getAllSlugs, getPostBySlug } from '../lib/posts.js'

const COLORS = {
  orange: '#DA7756',
  textPrimary: '#1A1815',
  textSecondary: '#5A5348',
  textMuted: '#8A8272',
  border: 'rgba(26,24,21,0.09)',
}

function formatDate(d) {
  if (!d) return ''
  const date = new Date(d)
  if (Number.isNaN(date.getTime())) return d
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

export default function BlogPost() {
  const { slug } = useParams()
  const post = getPostBySlug(slug)

  if (!post) {
    return (
      <BlogLayout>
        <SEO title="Post not found — CC for SF" description="That post doesn't exist." path={`/blog/${slug || ''}`} noindex />
        <section style={{ padding: '120px 20px', textAlign: 'center' }}>
          <h1 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 32, color: COLORS.textPrimary, marginBottom: 12 }}>Post not found.</h1>
          <a href="/blog" style={{ fontFamily: "'DM Sans', sans-serif", color: COLORS.orange, textDecoration: 'none' }}>← Back to the blog</a>
        </section>
      </BlogLayout>
    )
  }

  const Body = post.Component
  const url = `https://ccforsf.com/blog/${post.slug}`
  const image = post.heroImage.startsWith('http') ? post.heroImage : `https://ccforsf.com${post.heroImage}`

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${url}#post`,
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    image,
    url,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    author: { '@id': 'https://ccforsf.com/#amit', '@type': 'Person', name: post.author },
    publisher: { '@id': 'https://ccforsf.com/#org' },
  }

  return (
    <BlogLayout>
      <SEO
        title={`${post.title} — CC for SF`}
        description={post.description}
        path={`/blog/${post.slug}`}
        image={post.heroImage}
        jsonLd={jsonLd}
      />
      <style>{`
        .post-body { font-family: 'DM Sans', sans-serif; font-size: 17px; line-height: 1.75; color: ${COLORS.textPrimary}; }
        .post-body h2 { font-family: 'Bricolage Grotesque', sans-serif; font-size: 28px; font-weight: 800; color: ${COLORS.textPrimary}; margin: 48px 0 16px; letter-spacing: -0.4px; line-height: 1.2; }
        .post-body h2 a, .post-body h3 a { color: inherit; text-decoration: none; }
        .post-body h3 { font-family: 'Bricolage Grotesque', sans-serif; font-size: 22px; font-weight: 700; color: ${COLORS.textPrimary}; margin: 36px 0 12px; letter-spacing: -0.2px; }
        .post-body p { margin: 0 0 20px; color: ${COLORS.textPrimary}; }
        .post-body a { color: ${COLORS.orange}; text-decoration: underline; text-underline-offset: 3px; }
        .post-body strong { color: ${COLORS.textPrimary}; font-weight: 700; }
        .post-body ul, .post-body ol { margin: 0 0 20px; padding-left: 24px; color: ${COLORS.textPrimary}; }
        .post-body li { margin-bottom: 8px; }
        .post-body code { font-family: 'JetBrains Mono', monospace; font-size: 0.9em; background: rgba(26,24,21,0.06); border: 1px solid ${COLORS.border}; padding: 2px 6px; border-radius: 4px; color: ${COLORS.textPrimary}; }
        .post-body pre { font-family: 'JetBrains Mono', monospace; font-size: 14px; background: #0E0E14; color: #E2E8F0; border: 1px solid rgba(255,255,255,0.08); padding: 18px; border-radius: 10px; overflow-x: auto; margin: 0 0 24px; line-height: 1.55; }
        .post-body pre code { background: none; border: none; padding: 0; color: #E2E8F0; font-size: inherit; }
        .post-body blockquote { border-left: 3px solid ${COLORS.orange}; padding: 4px 0 4px 18px; margin: 0 0 24px; color: ${COLORS.textSecondary}; font-style: italic; }
        .post-body img { max-width: 100%; border-radius: 10px; margin: 24px 0; }
        .post-body table { width: 100%; border-collapse: collapse; margin: 0 0 24px; font-size: 15px; }
        .post-body th, .post-body td { padding: 10px 12px; border-bottom: 1px solid ${COLORS.border}; text-align: left; }
        .post-body th { font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: ${COLORS.textSecondary}; }
      `}</style>

      <article style={{ padding: '64px 20px 40px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <a href="/blog" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: COLORS.orange, textDecoration: 'none', letterSpacing: 1 }}>← BLOG</a>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: COLORS.textMuted, marginTop: 28, marginBottom: 12 }}>
            {formatDate(post.date)} · {post.author}
          </div>
          <h1 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 'clamp(30px, 5vw, 44px)', fontWeight: 800, color: COLORS.textPrimary, lineHeight: 1.1, marginBottom: 18, letterSpacing: -0.6 }}>
            {post.title}
          </h1>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 19, color: COLORS.textSecondary, lineHeight: 1.55, marginBottom: 40 }}>
            {post.description}
          </p>

          <div className="post-body">
            <Body />
          </div>

          <NewsletterCTA />
        </div>
      </article>
    </BlogLayout>
  )
}

export function getStaticPaths() {
  return getAllSlugs().map((slug) => `/blog/${slug}`)
}
