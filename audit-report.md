# Blog Draft Agent — Audit Report

**Date:** 2026-05-04

## Status: Queue empty — no draft this run

The scheduled blog-draft agent ran but could not produce a post because the required infrastructure is not yet present in the repository.

## What is missing

| Path | Status |
|---|---|
| `content/topic-queue.yaml` | Does not exist |
| `src/content/blog/` | Does not exist |
| `public/llms.txt` | Does not exist |

## What needs to happen before the next scheduled run

1. **Create `content/topic-queue.yaml`** with at least one entry in this shape:

   ```yaml
   - slug: your-post-slug
     title: "Your Post Title"
     angle: "The hook or angle for this post"
     keywords:
       - keyword one
       - keyword two
       - keyword three
     status: queued
   ```

2. **Create `src/content/blog/`** and populate it with at least the three reference posts the agent reads for voice and structure:
   - `your-first-claude-md-for-salesforce.mdx`
   - `validation-rules-with-claude-code.mdx`
   - `deploy-flows-between-salesforce-orgs-with-claude-code.mdx`

3. **Create `public/llms.txt`** with at minimum a `## Blog posts` section (can be empty initially).

4. **Wire up the blog build pipeline** — `vite.config.js` and `package.json` need to support `.mdx` files, render them into `dist/blog/<slug>.html`, and regenerate `public/sitemap.xml` to include blog URLs. The agent's Step 7 verification expects `dist/blog/<slug>.html` to exist after `npm run build`.

## Next scheduled run

The agent will pick this up automatically once `content/topic-queue.yaml` exists with at least one `status: queued` entry. No code changes to the agent are needed.
