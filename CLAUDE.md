# CLAUDE.md — ccforsf.com

This file is the source of truth for every Cursor and Claude Code session on this project. Read it at the start of every session. If anything here conflicts with something a prompt asks for, flag the conflict before acting.

---

## 1\. What this project is

**ccforsf.com** is the marketing \+ sales site for **Claude Code for Salesforce (CC for SF)**, a short paid video course that teaches Salesforce Admins how to use Claude Code (Anthropic's agentic coding tool) to build Flows, custom fields, validation rules, and Apex — without touching a button in Setup and without writing code by hand.

**Audience:** Salesforce Admins who know the platform but want to move 10× faster. Not for existing Salesforce developers, and not a cert-prep course.

**Instructor:** Amit — 8× Salesforce Certified, GTM Engineer, AI Tools Builder. Creator of *AI with Amit*.

---

## 2\. Product facts (SOURCE OF TRUTH — do not hallucinate)

Any future copy, ad, email, meta tag, or schema should pull from this list. If a prompt asks for a change to these facts, confirm with me before editing.

| Fact | Value |
| :---- | :---- |
| Price | **$97 one-time** (launch price, reg. $197) |
| Guarantee | **30-day money-back, no questions asked** (framed around "went through the course and didn't level up") |
| Format | **Total number of modules and total course time is TBD** |
| Access | Lifetime access to the course |
| Checkout | Thrivecart (but students don’t need to know that) |
| Tool dependency | **Claude Max subscription ($100/month, required)** — Anthropic moved Claude Code access into the Max plan in 2026. The old Pro tier is no longer sufficient. |
| SF license required | None beyond the existing Enterprise / Unlimited / Developer edition |
| Works with | Salesforce DX projects |

### Module list (coming soon)

### Bonuses

- **CLAUDE.md Starter Template** (value: $29)  
- **Claude Code Skill Pack for Salesforce** — pre-built slash-command skills for the 10 most common admin tasks: Flow generator, field migrator, validation-rule writer, Apex-test generator, Aura → LWC migrator (value: $149)  
- **Access to private Claude community** (value: $299)

### Disclaimer (include near checkout and in footer)

Not affiliated with or endorsed by Salesforce or Anthropic. Salesforce and Claude are trademarks of their respective companies.

---

## 3\. Tech stack

- **Framework:** React 19 \+ Vite 8 (currently SPA — see §7 for the SEO migration plan)  
- **Styling:** Inline style objects \+ `<style>` tag for keyframes. No Tailwind, no CSS modules. Keep it that way.  
- **Hosting:** GitHub is the source of truth. `.github/workflows/deploy.yml` builds and publishes `dist/` on every push to `main`. Vercel reads from the GitHub repo and serves the site on `ccforsf.com`. Both the workflow and `vercel.json` are expected to coexist.  
- **Custom domain:** ccforsf.com → requires `public/CNAME` containing `ccforsf.com` (verify this exists; create if missing)  
- **Package manager:** npm (use `npm ci` in CI — already configured)  
- **Node version:** 20 (set in workflow)  
- **Dev tools:** Cursor \+ Claude Code

### Fonts (loaded from Google Fonts in the component)

- **Bricolage Grotesque** — display / H1–H3  
- **DM Sans** — body  
- **JetBrains Mono** — code, labels, terminal, nav

### Color tokens (from `src/SalesPage.jsx`, `COLORS` object — DO NOT redefine elsewhere, import or extend)

orange        \#DA7756   brand accent / primary CTA

orangeHover   \#C4613F

sfBlue        \#0176D3   salesforce nod

green         \#22C55E   success / checkmarks

gold          \#FFB347   star ratings

bg            \#0a0a0a   page background

surface       \#111111

surface2      \#1a1a1a

surface3      \#222222

textPrimary   \#f0f0f0

textSecondary \#a0a0a0

textMuted     \#666666

border        rgba(255,255,255,0.08)

borderHover   rgba(218,119,86,0.4)

### Voice & tone

Short sentences. Concrete numbers. No corporate voice. The admin reading this is stressed, behind on tickets, and skeptical of AI hype. Prove it with specifics, not adjectives.

Good: *"15 clicks to create one field. Then the page layout. Then the permission set."* Bad: *"Streamline your administrative workflow with cutting-edge AI."*

Never use: "unlock," "supercharge," "revolutionize," "game-changer," "synergy," "leverage" as a verb.

---

## 4\. 🛑 Non-negotiable rules

These apply to every future change. Violate them → the change gets reverted.

### Rule 1 — Sitemap must always reflect reality

- `public/sitemap.xml` is the single source of URL truth.  
- **Every time a page is added, removed, or renamed, update `sitemap.xml` in the same commit.**  
- Every `<url>` entry must include `<loc>`, `<lastmod>` (today in ISO 8601), `<changefreq>`, `<priority>`.  
- After deploy, ping search engines:  
    
  curl "https://www.google.com/ping?sitemap=https://ccforsf.com/sitemap.xml"  
    
- Validate: [https://www.xml-sitemaps.com/validate-xml-sitemap.html](https://www.xml-sitemaps.com/validate-xml-sitemap.html)

### Rule 2 — Every page must ship fully-rendered HTML (no blank-div SPA)

The current build ships `<div id="root"></div>` and paints client-side. Bots see nothing. **This is the blocker, and it must be fixed before any paid traffic scales.** See §7 for the exact migration. After that is done:

- `curl https://ccforsf.com/` must return HTML where the hero headline, pricing, and CTAs are visible in raw source.  
- Any new route must pass the same curl test.  
- Validate with Google Rich Results Test, Facebook Sharing Debugger, and LinkedIn Post Inspector after every deploy that touches page content.

### Rule 3 — Every page ships with full SEO metadata

Every route must set:

- `<title>` — 50–60 chars, includes "Claude Code" and/or "Salesforce"  
- `<meta name="description">` — 150–160 chars, ends with a soft CTA  
- `<meta name="robots" content="index, follow">` (or explicit `noindex` for `/thanks`, `/checkout-success`)  
- `<link rel="canonical" href="https://ccforsf.com/<path>">`  
- Open Graph: `og:title`, `og:description`, `og:image` (1200×630 PNG in `/public/og/`), `og:url`, `og:type`  
- Twitter: `twitter:card=summary_large_image`, `twitter:title`, `twitter:description`, `twitter:image`  
- JSON-LD structured data — see §5

Use a shared `<SEO />` component (create it in `src/components/SEO.jsx` when the second page is added).

### Rule 4 — Do not edit source-of-truth facts without confirmation

§2 is locked. If a prompt says "change the price to $47" or "make it 10 modules," pause and confirm with me before touching anything. Ads, emails, and schema all read from these facts.

### Rule 5 — Brand consistency

Use the `COLORS` token object. Do not introduce new hex codes. Do not swap fonts. Nav branding is styled as a Salesforce custom field: `cc_for_sf__c`. Keep it.

### Rule 6 — No analytics or third-party scripts without asking

No GA, no Segment, no heatmap tools get dropped in without a one-line confirmation. If one is added, it must respect DNT and defer-load.

### Rule 7 — QA every change before committing + pushing

"It builds successfully" is not QA. "It renders correctly" is QA. Before any commit is pushed:

- **Visual / style / copy changes**: run `npm run build`, then open the affected page in a browser and confirm the change renders as intended — contrast, layout, spacing, word choice, responsive behavior on both desktop and mobile widths.
- **Functional changes**: exercise the flow end-to-end (submit the form and verify the DB write, click through the modal, refresh and test from a clean state).
- **CLI-only sessions where a browser isn't available**: explicitly reason about color pairings in every CSS edit. For every `color:` property you touch, identify the background it sits on and verify contrast. Low-contrast text is the most common bug that ships unnoticed. Also `grep` the built HTML in `dist/` for key strings to confirm they're present.

**Past incidents this rule is for:**

- Waitlist modal inputs rendered black-on-black after the dark → light theme flip — text color was correctly flipped, input `background` was left hardcoded dark.
- Blog post code blocks rendered black-on-black — `.post-body pre code` inherited the inline-code text color instead of the `<pre>` element's light color.
- 500 server error on the waitlist form shown as "Something went wrong" — the fallback message fired because the response body wasn't JSON.

In each case, the code compiled, the build succeeded, and the bug shipped. Every one would have been caught in 30 seconds of visual review.

---

## 5\. Structured data (JSON-LD) — per page type

Ship these in a `<script type="application/ld+json">` tag in each page's `<head>`.

### Homepage (`/`)

- `Course` (name, description, provider, hasCourseInstance, offers with `price: 97`, `priceCurrency: USD`)  
- `Organization` (AI with Amit, logo, sameAs links)  
- `Person` for Amit (instructor)  
- `AggregateRating` **only if real ratings exist** — never fake.

### FAQ page or section

- `FAQPage` with each Q/A as a `Question` → `Answer`

### Module / lesson pages (when added)

- `Course` or `LearningResource` with `isPartOf` pointing to the parent Course

### Checkout / thank-you

- `noindex`, no schema.

---

## 6\. `robots.txt` policy

`public/robots.txt` must:

- Allow all major bots (Googlebot, Bingbot, DuckDuckBot, Applebot)  
- Allow social preview crawlers (facebookexternalhit, Twitterbot, LinkedInBot, Slackbot, Discordbot)  
- Allow AI/answer-engine crawlers unless we explicitly decide otherwise (GPTBot, ClaudeBot, PerplexityBot, Google-Extended)  
- `Disallow: /thanks`, `/checkout-success`, `/admin` (if these get added)  
- Reference the sitemap

The committed `robots.txt` already does this — keep it in sync.

---

## 7\. The SPA → SEO-readable fix (do this next)

**Problem:** Vite \+ React with `createRoot().render()` in `main.jsx` ships an empty shell. No crawler that doesn't execute JS sees any content.

**Fix (recommended for this stack):** Prerender at build time with **`vite-react-ssg`**. This keeps the existing React code, keeps GitHub Pages hosting, and generates real HTML for every route at build.

### Migration steps

1. Install:  
     
   npm install \--save-dev vite-react-ssg  
     
   npm install react-router-dom  
     
2. Convert `src/main.jsx` to export a routes array that `vite-react-ssg` can consume. Example:  
     
   // src/main.jsx  
     
   import { ViteReactSSG } from 'vite-react-ssg'  
     
   import SalesPage from './SalesPage.jsx'  
     
   const routes \= \[  
     
     { path: '/', element: \<SalesPage /\>, entry: 'src/SalesPage.jsx' },  
     
     // add new routes here — and update public/sitemap.xml in the same commit  
     
   \]  
     
   export const createRoot \= ViteReactSSG({ routes })  
     
3. Update `package.json` scripts:  
     
   "build": "vite-react-ssg build"  
     
4. Add a `<Head>` component (from `vite-react-ssg`) inside `SalesPage.jsx` with the title, description, OG tags, and JSON-LD so they're emitted into static HTML.  
5. Leave `vite.config.js`, `.github/workflows/deploy.yml`, and the `dist/` output path as-is — the workflow already deploys whatever is in `dist/`.  
6. Verify locally:  
     
   npm run build  
     
   cat dist/index.html   \# should contain the hero headline, pricing, CTAs in raw HTML  
     
7. Deploy. Re-test with:  
   - `curl https://ccforsf.com/ | grep "Build complex Flows"` → should match  
   - Google Rich Results Test  
   - Facebook Sharing Debugger (re-scrape)  
   - LinkedIn Post Inspector

**Alternative (bigger lift, worth it later):** Port to **Astro**. Astro ships zero JS by default, top Lighthouse scores, and treats marketing sites as first-class. Revisit after the site grows past \~5 pages.

**Do NOT** try to fix this with React Helmet alone — Helmet injects tags at runtime; bots still see a blank body. Helmet is useful *after* SSG is in place.

---

## 8\. Adding a new page — checklist

When a prompt says "add an /about page" or "build a /modules page," do all of the following in one PR:

- [ ] Create the route component in `src/pages/<Name>.jsx`  
- [ ] Register the route in `main.jsx` (`vite-react-ssg` routes array — see §7)  
- [ ] Add `<Head>` with title, meta description, canonical, OG tags, Twitter card, JSON-LD  
- [ ] Add an entry to `public/sitemap.xml` with today's `<lastmod>`  
- [ ] Add the path to `public/robots.txt` if it should be disallowed (e.g., `/thanks`)  
- [ ] Add an internal link from at least one existing page (nav or footer)  
- [ ] Run `npm run build` and `cat dist/<path>/index.html` — confirm the main content is in the raw HTML  
- [ ] Test Lighthouse locally, aim for ≥95 on SEO and Best Practices  
- [ ] Update this `CLAUDE.md` if the new page introduces new product facts or components

---

## 9\. File layout (current \+ planned)

/

├── CLAUDE.md                       ← this file

├── README.md                       ← public-facing, can be short

├── index.html                      ← Vite shell; keep \<title\> \+ meta fallback

├── package.json

├── vite.config.js

├── .github/workflows/deploy.yml

├── public/

│   ├── sitemap.xml                 ← updated on every route change

│   ├── robots.txt

│   ├── CNAME                       ← "ccforsf.com" (verify exists)

│   ├── favicon.svg

│   ├── icons.svg

│   └── og/

│       └── og-home.png             ← 1200×630 PNG (add before first ad run)

└── src/

    ├── main.jsx                    ← becomes SSG entry (see §7)

    ├── SalesPage.jsx               ← current homepage

    ├── components/

    │   └── SEO.jsx                 ← create when adding route \#2

    └── pages/                      ← create as needed

        ├── Modules.jsx

        ├── About.jsx

        └── Thanks.jsx              ← noindex

---

## 10\. Cursor vs Claude Code — when to use which

- **Cursor:** precise edits inside one component, refactors, style tweaks, writing copy.  
- **Claude Code:** multi-file changes, creating new routes, migrations (e.g., the SSG move), running build \+ test loops, anything that needs terminal access.

Always commit per-task. Never bundle unrelated changes.

---

## 11\. Open items (update as they close)

- [x] Migrate to `vite-react-ssg` — routes in `src/routes.jsx`; `src/main.jsx` uses `ViteReactSSG`; `npm run build` emits real HTML for `/`, `/privacy`, `/terms`, `/refund`  
- [ ] Create `public/og/og-home.png` (1200×630)  
- [x] Confirm `public/CNAME` exists with `ccforsf.com`  
- [x] Add `<Head>` tags to every route via shared `src/components/SEO.jsx` (title, description, canonical, OG, Twitter, JSON-LD)  
- [ ] Register site with Google Search Console and Bing Webmaster Tools; submit sitemap  
- [ ] Wire up Thrivecart embed / button to replace the non-functional CTA buttons  
- [ ] **Waitlist DB setup in Vercel** (required for `/api/waitlist` to work): in Vercel dashboard → Storage → Create Postgres (Neon) database → link to this project. `POSTGRES_URL` env var auto-injects. The function at `api/waitlist.js` lazily creates the `waitlist(id, name, email, role, created_at)` table on first call.  
- [ ] Add real testimonials to replace the placeholder Sarah/Marcus/Priya quotes OR clearly mark them as illustrative — FTC matters  
- [x] Privacy, Terms, and Refund pages shipped at `/privacy`, `/terms`, `/refund` (footer links wired)
- [x] `public/llms.txt` shipped — LLM-friendly index per [llmstxt.org](https://llmstxt.org/). Update it whenever a page, blog post, or product fact changes (same cadence as `sitemap.xml`). `robots.txt` points to it.

---

*Last updated: 2026-04-18*  
