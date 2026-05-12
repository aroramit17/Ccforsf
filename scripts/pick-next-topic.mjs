#!/usr/bin/env node
/**
 * Read content/topic-queue.yaml and emit the first entry with status: queued.
 *
 * In a GitHub Actions step (`$GITHUB_OUTPUT` set), writes:
 *   slug=<slug>
 *   title=<title>
 *   angle=<one-line angle>
 *   keywords=<comma-separated>
 *   has_topic=true|false
 *
 * Locally (no `$GITHUB_OUTPUT`), prints the same lines to stdout.
 *
 * Exits 0 in both "found" and "queue empty" cases — the workflow checks
 * `has_topic` to decide whether to proceed.
 */
import { readFileSync, appendFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import YAML from 'yaml'

const __dirname = dirname(fileURLToPath(import.meta.url))
const QUEUE_PATH = join(__dirname, '..', 'content/topic-queue.yaml')

const queue = YAML.parse(readFileSync(QUEUE_PATH, 'utf8')) || []
const next = queue.find((t) => t && t.status === 'queued')

const out = process.env.GITHUB_OUTPUT
const write = (lines) => {
  const text = lines.join('\n') + '\n'
  if (out) appendFileSync(out, text)
  else process.stdout.write(text)
}

if (!next) {
  write(['has_topic=false', 'slug=', 'title=', 'angle=', 'keywords='])
  process.exit(0)
}

// Single-line escape for GH outputs: collapse newlines, trim.
const flat = (s) => String(s ?? '').replace(/\r?\n+/g, ' ').trim()

write([
  'has_topic=true',
  `slug=${flat(next.slug)}`,
  `title=${flat(next.title)}`,
  `angle=${flat(next.angle)}`,
  `keywords=${(next.keywords || []).map(flat).join(', ')}`,
])
