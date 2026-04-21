#!/usr/bin/env node
/**
 * Append a topic to content/topic-queue.yaml.
 *
 * Usage:
 *   npm run queue:add -- "Title of the post" "Angle / hook"
 *   npm run queue:add -- "Title" "Angle" --keywords "tag1,tag2"
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import YAML from 'yaml'

const __dirname = dirname(fileURLToPath(import.meta.url))
const QUEUE_PATH = join(__dirname, '..', 'content/topic-queue.yaml')

function slugify(s) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80)
}

function parseArgs(argv) {
  const positional = []
  let keywords = []
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--keywords' && argv[i + 1]) {
      keywords = argv[i + 1].split(',').map((k) => k.trim()).filter(Boolean)
      i++
    } else {
      positional.push(argv[i])
    }
  }
  return { positional, keywords }
}

const argv = process.argv.slice(2)
const { positional, keywords } = parseArgs(argv)
const [title, angle] = positional

if (!title || !angle) {
  console.error('Usage: npm run queue:add -- "Title" "Angle" [--keywords "tag1,tag2"]')
  process.exit(1)
}

const raw = readFileSync(QUEUE_PATH, 'utf8')
const headerEnd = raw.indexOf('\n- ')
const header = headerEnd === -1 ? raw : raw.slice(0, headerEnd)
const body = headerEnd === -1 ? '[]' : raw.slice(headerEnd)

const queue = YAML.parse(body) || []
const slug = slugify(title)

if (queue.some((e) => e.slug === slug)) {
  console.error(`[queue] slug "${slug}" already exists — pick a different title or edit the YAML by hand`)
  process.exit(1)
}

queue.push({
  slug,
  title,
  angle,
  keywords: keywords.length ? keywords : ['claude code', 'salesforce'],
  status: 'queued',
})

const out = header + '\n' + YAML.stringify(queue, { lineWidth: 0 })
writeFileSync(QUEUE_PATH, out)
console.log(`[queue] added "${title}" (slug: ${slug})`)
console.log(`[queue] ${queue.filter((e) => e.status === 'queued').length} topics now queued`)
