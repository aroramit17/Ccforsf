import { chromium } from 'playwright';
import { AxeBuilder } from '@axe-core/playwright';
import { writeFileSync } from 'fs';

const URLS = {
  home: 'http://localhost:4600/',
  blogpost: null, // /blog/your-first-claude-md-for-salesforce does not exist in this repo's routes
};

async function auditUrl(page, url, slug) {
  await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
  await page.mouse.move(0, 0);

  const axeResults = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();

  writeFileSync(
    `/home/user/Ccforsf/axe-${slug}.json`,
    JSON.stringify({ violations: axeResults.violations, incomplete: axeResults.incomplete, passes: axeResults.passes.length }, null, 2)
  );

  return {
    violationCount: axeResults.violations.length,
    incompleteCount: axeResults.incomplete.length,
    violations: axeResults.violations.map(v => ({ id: v.id, impact: v.impact, description: v.description, nodes: v.nodes.length })),
    incomplete: axeResults.incomplete.map(v => ({ id: v.id, impact: v.impact, description: v.description })),
  };
}

async function sprint1SpotChecks(page, slug) {
  const checks = {};

  if (slug === 'home') {
    // Skip-link: Tab on fresh page should focus skip link
    await page.goto('http://localhost:4600/', { waitUntil: 'networkidle' });
    await page.keyboard.press('Tab');
    const focusedEl = await page.evaluate(() => {
      const el = document.activeElement;
      return {
        tagName: el?.tagName,
        href: el?.getAttribute('href'),
        className: el?.className,
        text: el?.textContent?.trim().slice(0, 50),
      };
    });
    const skipLinkFocused = focusedEl?.href === '#main-content' || focusedEl?.text?.toLowerCase().includes('skip');
    checks['skip-link-focused-on-tab'] = { pass: skipLinkFocused, detail: JSON.stringify(focusedEl) };

    // Skip-link bounding rect when focused
    const skipLinkRect = await page.evaluate(() => {
      const el = document.querySelector('a[href="#main-content"], .skip-link');
      if (!el) return null;
      el.focus();
      const r = el.getBoundingClientRect();
      return { top: r.top, left: r.left, width: r.width, height: r.height };
    });
    checks['skip-link-visible-when-focused'] = {
      pass: skipLinkRect !== null && skipLinkRect.top >= 0 && skipLinkRect.width > 0,
      detail: JSON.stringify(skipLinkRect),
    };

    // main#main-content exists
    const mainEl = await page.evaluate(() => {
      const el = document.querySelector('main#main-content');
      return el ? { id: el.id, tagName: el.tagName, tabIndex: el.tabIndex } : null;
    });
    checks['main-landmark-exists'] = { pass: mainEl !== null, detail: JSON.stringify(mainEl) };

    // FAQ buttons: type=button, aria-expanded, aria-controls, panel exists
    const faqButtons = await page.evaluate(() => {
      const btns = [...document.querySelectorAll('button[id^="faq-q-"]')];
      if (btns.length === 0) return { found: 0, errors: ['No buttons with id faq-q-N found'] };
      const errors = [];
      for (const btn of btns) {
        if (btn.getAttribute('type') !== 'button') errors.push(`${btn.id}: missing type=button`);
        if (btn.getAttribute('aria-expanded') === null) errors.push(`${btn.id}: missing aria-expanded`);
        const controls = btn.getAttribute('aria-controls');
        if (!controls) { errors.push(`${btn.id}: missing aria-controls`); continue; }
        if (!document.getElementById(controls)) errors.push(`${btn.id}: aria-controls="${controls}" panel not found`);
      }
      return { found: btns.length, errors };
    });
    checks['faq-buttons-aria'] = { pass: faqButtons.found > 0 && faqButtons.errors.length === 0, detail: JSON.stringify(faqButtons) };

    // Curriculum phase buttons
    const currButtons = await page.evaluate(() => {
      const btns = [...document.querySelectorAll('button[id^="phase-head-"]')];
      if (btns.length === 0) return { found: 0, errors: ['No buttons with id phase-head-N found'] };
      const errors = [];
      for (const btn of btns) {
        if (btn.getAttribute('type') !== 'button') errors.push(`${btn.id}: missing type=button`);
        if (btn.getAttribute('aria-expanded') === null) errors.push(`${btn.id}: missing aria-expanded`);
        const controls = btn.getAttribute('aria-controls');
        if (!controls) { errors.push(`${btn.id}: missing aria-controls`); continue; }
        if (!document.getElementById(controls)) errors.push(`${btn.id}: panel ${controls} not found`);
      }
      return { found: btns.length, errors };
    });
    checks['curriculum-buttons-aria'] = { pass: currButtons.found > 0 && currButtons.errors.length === 0, detail: JSON.stringify(currButtons) };

    // Build tabs: tablist, role=tab, aria-controls -> tabpanel, aria-labelledby round-trip
    const buildTabs = await page.evaluate(() => {
      const tablist = document.querySelector('[role="tablist"]');
      if (!tablist) return { found: false, errors: ['No [role=tablist] found'] };
      const tabs = [...tablist.querySelectorAll('[role="tab"]')];
      if (tabs.length === 0) return { found: false, errors: ['No role=tab buttons in tablist'] };
      const errors = [];
      for (const tab of tabs) {
        if (tab.getAttribute('aria-selected') === null) errors.push(`${tab.id || tab.textContent?.slice(0,20)}: missing aria-selected`);
        const controls = tab.getAttribute('aria-controls');
        if (!controls) { errors.push(`tab missing aria-controls`); continue; }
        const panel = document.getElementById(controls);
        if (!panel) { errors.push(`tab aria-controls="${controls}" panel not found`); continue; }
        if (panel.getAttribute('role') !== 'tabpanel') errors.push(`panel ${controls} missing role=tabpanel`);
        const labelledBy = panel.getAttribute('aria-labelledby');
        if (!labelledBy) errors.push(`panel ${controls} missing aria-labelledby`);
        else if (!document.getElementById(labelledBy)) errors.push(`panel ${controls}: aria-labelledby="${labelledBy}" tab not found`);
      }
      return { found: true, tabCount: tabs.length, errors };
    });
    checks['build-tabs-aria'] = { pass: buildTabs.found && buildTabs.errors?.length === 0, detail: JSON.stringify(buildTabs) };
  }

  if (slug === 'blogpost') {
    // Newsletter input checks
    const newsletterCheck = await page.evaluate(() => {
      const input = document.querySelector('input[type="email"], input[name="email"]');
      if (!input) return { found: false, error: 'No email input found' };
      const cs = window.getComputedStyle(input);
      const bg = cs.backgroundColor;
      const color = cs.color;
      const ariaLabel = input.getAttribute('aria-label');
      const id = input.id;
      const label = id ? document.querySelector(`label[for="${id}"]`) : null;
      return {
        found: true,
        backgroundColor: bg,
        color,
        ariaLabel,
        hasAssociatedLabel: !!label,
        labelText: label?.textContent?.trim(),
      };
    });
    checks['newsletter-input-exists'] = { pass: newsletterCheck.found, detail: JSON.stringify(newsletterCheck) };
    if (newsletterCheck.found) {
      checks['newsletter-aria-label'] = { pass: !!newsletterCheck.ariaLabel, detail: `aria-label: ${newsletterCheck.ariaLabel}` };
      checks['newsletter-associated-label'] = { pass: newsletterCheck.hasAssociatedLabel, detail: `label exists: ${newsletterCheck.hasAssociatedLabel}` };
    }
  }

  return checks;
}

async function main() {
  const browser = await chromium.launch({ args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  const context = await browser.newContext({ baseURL: 'http://localhost:4400' });
  const results = {};

  // Audit home
  const page = await context.newPage();
  console.log('Auditing homepage...');
  results.home = await auditUrl(page, 'http://localhost:4600/', 'home');
  results.homeChecks = await sprint1SpotChecks(page, 'home');
  await page.close();

  // Blog post doesn't exist in this repo's routes — create stub axe result
  console.log('Blog route /blog/your-first-claude-md-for-salesforce does not exist in this repo.');
  const blogPage = await context.newPage();
  const response = await blogPage.goto('http://localhost:4600/blog/your-first-claude-md-for-salesforce', { waitUntil: 'domcontentloaded', timeout: 10000 }).catch(() => null);
  const blogStatus = response?.status() ?? 'no response';
  console.log(`Blog URL status: ${blogStatus}`);

  let blogAxeResult = { violations: [], incomplete: [], passes: 0, note: `Route /blog/your-first-claude-md-for-salesforce not found in routes.jsx — HTTP ${blogStatus}` };
  if (blogStatus !== 404 && blogStatus !== 'no response') {
    const blogAxe = await new AxeBuilder({ page: blogPage }).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
    blogAxeResult = { violations: blogAxe.violations, incomplete: blogAxe.incomplete, passes: blogAxe.passes.length };
    results.blogpost = {
      violationCount: blogAxe.violations.length,
      violations: blogAxe.violations.map(v => ({ id: v.id, impact: v.impact, description: v.description, nodes: v.nodes.length })),
    };
    results.blogpostChecks = await sprint1SpotChecks(blogPage, 'blogpost');
  } else {
    results.blogpost = { violationCount: 0, violations: [], note: `Route not in repo — ${blogStatus}` };
    results.blogpostChecks = { 'newsletter-input-route-missing': { pass: false, detail: 'Blog route does not exist in routes.jsx' } };
  }
  writeFileSync('/home/user/Ccforsf/axe-blogpost.json', JSON.stringify(blogAxeResult, null, 2));
  await blogPage.close();

  await browser.close();

  console.log('\n=== RESULTS ===');
  console.log('Home violations:', results.home.violationCount);
  results.home.violations.forEach(v => console.log(`  [${v.impact}] ${v.id}: ${v.description} (${v.nodes} nodes)`));
  console.log('\nHome Sprint 1 checks:');
  Object.entries(results.homeChecks).forEach(([k,v]) => console.log(`  ${v.pass ? '✓' : '✗'} ${k}:`, v.detail));
  console.log('\nBlog checks:');
  Object.entries(results.blogpost).forEach(([k,v]) => console.log(`  ${k}: ${JSON.stringify(v)}`));
  console.log('\nBlog Sprint 1 checks:');
  Object.entries(results.blogpostChecks).forEach(([k,v]) => console.log(`  ${v.pass ? '✓' : '✗'} ${k}:`, v.detail));

  writeFileSync('/home/user/Ccforsf/axe-audit-summary.json', JSON.stringify(results, null, 2));
  console.log('\nDone. Results written to axe-*.json and axe-audit-summary.json');
}

main().catch(e => { console.error(e); process.exit(1); });
