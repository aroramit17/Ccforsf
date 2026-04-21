#!/usr/bin/env node
/**
 * Regenerates public/sitemap.xml from a fixed list of static routes
 * plus every MDX post under src/content/blog/. Wired as `prebuild` so
 * sitemap and content can never drift out of sync (CLAUDE.md Rule 1).
 */
import { readFileSync, readdirSync, writeFileSync, existsSync, mkdirSync } from 'node:fs'
import { join, dirname, basename } from 'node:path'
import { fileURLToPath } from 'node:url'
import matter from 'gray-matter'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const POSTS_DIR = join(ROOT, 'src/content/blog')
const SITEMAP_PATH = join(ROOT, 'public/sitemap.xml')
const SITE = 'https://ccforsf.com'
const TODAY = new Date().toISOString().slice(0, 10)

const STATIC_URLS = [
  { loc: '/', changefreq: 'weekly', priority: '1.0', lastmod: TODAY },
  { loc: '/blog', changefreq: 'weekly', priority: '0.8', lastmod: TODAY },
  { loc: '/privacy', changefreq: 'yearly', priority: '0.3', lastmod: '2026-04-18' },
  { loc: '/terms', changefreq: 'yearly', priority: '0.3', lastmod: '2026-04-18' },
  { loc: '/refund', changefreq: 'yearly', priority: '0.3', lastmod: '2026-04-18' },
]

function readPosts() {
  if (!existsSync(POSTS_DIR)) return []
  return readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => {
      const raw = readFileSync(join(POSTS_DIR, f), 'utf8')
      const { data } = matter(raw)
      return {
        slug: basename(f, '.mdx'),
        date: data.date ? new Date(data.date).toISOString().slice(0, 10) : TODAY,
      }
    })
}

function urlEntry({ loc, lastmod, changefreq, priority }) {
  return `  <url>
    <loc>${SITE}${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
}

function build() {
  const postUrls = readPosts().map((p) => ({
    loc: `/blog/${p.slug}`,
    lastmod: p.date,
    changefreq: 'monthly',
    priority: '0.7',
  }))

  const all = [...STATIC_URLS, ...postUrls]
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${all.map(urlEntry).join('\n')}
</urlset>
`
  mkdirSync(dirname(SITEMAP_PATH), { recursive: true })
  writeFileSync(SITEMAP_PATH, xml)
  console.log(`[sitemap] wrote ${all.length} URLs to public/sitemap.xml`)
}

build()
