const modules = import.meta.glob('/src/content/blog/*.mdx', { eager: true })

const posts = Object.entries(modules).map(([path, mod]) => {
  const slug = path.split('/').pop().replace(/\.mdx$/, '')
  const frontmatter = mod.frontmatter || {}
  return {
    slug,
    Component: mod.default,
    title: frontmatter.title || slug,
    description: frontmatter.description || '',
    date: frontmatter.date || '',
    author: frontmatter.author || 'Amit',
    heroImage: frontmatter.heroImage || '/amit-headshot.png',
    tldr: Array.isArray(frontmatter.tldr) ? frontmatter.tldr : [],
    faq: Array.isArray(frontmatter.faq) ? frontmatter.faq : [],
  }
}).sort((a, b) => (a.date < b.date ? 1 : -1))

export function getAllPosts() {
  return posts
}

export function getPostBySlug(slug) {
  return posts.find((p) => p.slug === slug)
}

export function getAllSlugs() {
  return posts.map((p) => p.slug)
}

// Curated onboarding order — surfaced as "Start Here" on blog posts and as
// "Featured Guides" on the homepage. Order matters: it represents the
// recommended reading sequence for an admin new to Claude Code.
export const START_HERE_SEQUENCE = [
  {
    slug: 'connect-claude-code-to-salesforce-with-mcp',
    label: 'Connect Claude Code to Salesforce',
    blurb: 'Install Node, the SF CLI, and wire MCP into VS Code in 6 phases.',
  },
  {
    slug: 'your-first-claude-md-for-salesforce',
    label: 'Your first CLAUDE.md',
    blurb: 'The config file Claude reads to understand your org and your style.',
  },
  {
    slug: 'ai-for-salesforce-flows',
    label: 'AI for Salesforce Flows',
    blurb: 'Prompt-driven Flow building, end to end, on a real org.',
  },
  {
    slug: 'validation-rules-with-claude-code',
    label: 'Validation rules with Claude Code',
    blurb: 'Stage-gated, deterministic rules drafted, deployed, and tested.',
  },
  {
    slug: 'claude-code-vs-agentforce',
    label: 'Claude Code vs Agentforce',
    blurb: 'Where each tool wins and how to pick the right one for the job.',
  },
]

export function getStartHereSequence() {
  return START_HERE_SEQUENCE.map((item) => {
    const post = posts.find((p) => p.slug === item.slug)
    return post ? { ...item, title: post.title, description: post.description } : null
  }).filter(Boolean)
}

// The three guides surfaced on the homepage. Picked for strategic / SEO
// value (head-term coverage) rather than reading-order. Kept separate from
// START_HERE_SEQUENCE so the two can evolve independently.
const FEATURED_HOMEPAGE_GUIDES = [
  {
    slug: 'connect-claude-code-to-salesforce-with-mcp',
    blurb: 'Install Node, the SF CLI, and wire MCP into VS Code in 6 phases.',
  },
  {
    slug: 'claude-code-vs-agentforce',
    blurb: 'The decision framework: which tool wins for which kind of Salesforce work.',
  },
  {
    slug: 'ai-for-salesforce-flows',
    blurb: 'Prompt-driven Flow building, end to end, on a real org.',
  },
]

export function getFeaturedHomepageGuides() {
  return FEATURED_HOMEPAGE_GUIDES.map((item) => {
    const post = posts.find((p) => p.slug === item.slug)
    return post ? { ...item, title: post.title, description: post.description } : null
  }).filter(Boolean)
}
