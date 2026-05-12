import { useParams } from 'react-router-dom'
import SEO from '../components/SEO.jsx'
import BlogLayout from '../components/BlogLayout.jsx'
import NewsletterCTA from '../components/NewsletterCTA.jsx'
import { getAllSlugs, getPostBySlug, getStartHereSequence } from '../lib/posts.js'

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

  const blogPostingLd = {
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

  const faqLd = post.faq.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        '@id': `${url}#faq`,
        mainEntity: post.faq.map((item) => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: { '@type': 'Answer', text: item.a },
        })),
      }
    : null

  const jsonLd = faqLd
    ? { '@context': 'https://schema.org', '@graph': [blogPostingLd, faqLd] }
    : blogPostingLd

  const sequence = getStartHereSequence()
  const sequencePosition = sequence.findIndex((item) => item.slug === post.slug)
  const inSequence = sequencePosition >= 0
  const nextInSequence = inSequence ? sequence[sequencePosition + 1] : null

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
        .post-tldr {
          background: rgba(218,119,86,0.06);
          border-left: 3px solid ${COLORS.orange};
          padding: 22px 24px;
          margin: 32px 0 40px;
          border-radius: 0 10px 10px 0;
        }
        .post-tldr-eyebrow {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 2.5px;
          color: ${COLORS.orange};
          text-transform: uppercase;
          margin-bottom: 12px;
        }
        .post-tldr ul { margin: 0; padding-left: 20px; }
        .post-tldr li {
          font-family: 'DM Sans', sans-serif;
          font-size: 16px;
          line-height: 1.55;
          color: ${COLORS.textPrimary};
          margin-bottom: 8px;
        }
        .post-tldr li:last-child { margin-bottom: 0; }
        .post-tldr code {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.9em;
          background: rgba(26,24,21,0.06);
          padding: 1px 5px;
          border-radius: 3px;
        }
        .post-faq { margin-top: 56px; padding-top: 40px; border-top: 1px solid ${COLORS.border}; }
        .post-faq-eyebrow {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 2.5px;
          color: ${COLORS.orange};
          text-transform: uppercase;
          margin-bottom: 10px;
        }
        .post-faq h2 {
          font-family: 'Bricolage Grotesque', sans-serif;
          font-size: 26px;
          font-weight: 800;
          letter-spacing: -0.4px;
          color: ${COLORS.textPrimary};
          margin: 0 0 24px;
        }
        .post-faq-item {
          padding: 18px 0;
          border-bottom: 1px solid ${COLORS.border};
        }
        .post-faq-item:first-of-type { border-top: 1px solid ${COLORS.border}; }
        .post-faq-q {
          font-family: 'Bricolage Grotesque', sans-serif;
          font-size: 17px;
          font-weight: 700;
          color: ${COLORS.textPrimary};
          margin: 0 0 8px;
          letter-spacing: -0.1px;
        }
        .post-faq-a {
          font-family: 'DM Sans', sans-serif;
          font-size: 15.5px;
          line-height: 1.6;
          color: ${COLORS.textSecondary};
          margin: 0;
        }
        .post-faq-a code {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.9em;
          background: rgba(26,24,21,0.06);
          padding: 1px 5px;
          border-radius: 3px;
          color: ${COLORS.textPrimary};
        }
        .post-starthere { margin-top: 56px; padding: 28px; background: rgba(26,24,21,0.04); border-radius: 12px; border: 1px solid ${COLORS.border}; }
        .post-starthere-eyebrow {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 2.5px;
          color: ${COLORS.orange};
          text-transform: uppercase;
          margin-bottom: 8px;
        }
        .post-starthere h3 {
          font-family: 'Bricolage Grotesque', sans-serif;
          font-size: 20px;
          font-weight: 800;
          color: ${COLORS.textPrimary};
          margin: 0 0 16px;
          letter-spacing: -0.2px;
        }
        .post-starthere-list { list-style: none; margin: 0; padding: 0; counter-reset: starthere; }
        .post-starthere-list li {
          counter-increment: starthere;
          padding: 10px 0;
          border-top: 1px solid ${COLORS.border};
          display: grid;
          grid-template-columns: 36px 1fr;
          gap: 12px;
          align-items: baseline;
        }
        .post-starthere-list li::before {
          content: counter(starthere, decimal-leading-zero);
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          letter-spacing: 1.5px;
          color: ${COLORS.textMuted};
          font-weight: 600;
        }
        .post-starthere-list li.is-current .post-starthere-link { color: ${COLORS.textPrimary}; font-weight: 700; cursor: default; pointer-events: none; }
        .post-starthere-list li.is-current::after {
          content: 'YOU ARE HERE';
          grid-column: 2;
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          letter-spacing: 1.5px;
          color: ${COLORS.orange};
          font-weight: 700;
          margin-top: 4px;
        }
        .post-starthere-link {
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          color: ${COLORS.orange};
          text-decoration: none;
          line-height: 1.4;
        }
        .post-starthere-link:hover { text-decoration: underline; text-underline-offset: 3px; }
        .post-next {
          display: block;
          margin-top: 32px;
          padding: 22px;
          border: 1px solid ${COLORS.border};
          border-radius: 12px;
          background: #fff;
          text-decoration: none;
          color: inherit;
          transition: border-color 200ms ease, transform 200ms ease;
        }
        .post-next:hover { border-color: ${COLORS.orange}; transform: translateY(-1px); }
        .post-next-eyebrow {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 2.5px;
          color: ${COLORS.orange};
          text-transform: uppercase;
          margin-bottom: 8px;
        }
        .post-next-title {
          font-family: 'Bricolage Grotesque', sans-serif;
          font-size: 19px;
          font-weight: 800;
          color: ${COLORS.textPrimary};
          letter-spacing: -0.2px;
        }
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

          {post.tldr.length > 0 && (
            <aside className="post-tldr" aria-label="TL;DR summary">
              <div className="post-tldr-eyebrow">TL;DR</div>
              <ul>
                {post.tldr.map((line, i) => (
                  <li key={i}>{line}</li>
                ))}
              </ul>
            </aside>
          )}

          <div className="post-body">
            <Body />
          </div>

          {post.faq.length > 0 && (
            <section className="post-faq" aria-labelledby="post-faq-title">
              <div className="post-faq-eyebrow">FAQ</div>
              <h2 id="post-faq-title">Common questions</h2>
              {post.faq.map((item, i) => (
                <div className="post-faq-item" key={i}>
                  <h3 className="post-faq-q">{item.q}</h3>
                  <p className="post-faq-a">{item.a}</p>
                </div>
              ))}
            </section>
          )}

          {sequence.length > 0 && (
            <aside className="post-starthere" aria-label="Start Here reading order">
              <div className="post-starthere-eyebrow">Start here</div>
              <h3>Recommended reading order</h3>
              <ol className="post-starthere-list">
                {sequence.map((item) => {
                  const isCurrent = item.slug === post.slug
                  return (
                    <li key={item.slug} className={isCurrent ? 'is-current' : ''}>
                      <a className="post-starthere-link" href={`/blog/${item.slug}`}>
                        {item.label}
                      </a>
                    </li>
                  )
                })}
              </ol>
              {nextInSequence && (
                <a className="post-next" href={`/blog/${nextInSequence.slug}`}>
                  <div className="post-next-eyebrow">Up next</div>
                  <div className="post-next-title">{nextInSequence.title} →</div>
                </a>
              )}
            </aside>
          )}

          <NewsletterCTA />
        </div>
      </article>
    </BlogLayout>
  )
}

export function getStaticPaths() {
  return getAllSlugs().map((slug) => `/blog/${slug}`)
}
