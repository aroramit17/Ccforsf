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
