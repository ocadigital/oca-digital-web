// Re-runnable verification of the "Is Agentic" audit fixes against a live
// deployment. Usage: node scripts/verify-agent-readiness.mjs <base-url>
// e.g. node scripts/verify-agent-readiness.mjs https://www.ocadigital.com.br

const baseUrl = (process.argv[2] || 'https://www.ocadigital.com.br').replace(/\/$/, '');

let failures = 0;

function report(name, ok, detail) {
  console.log(`${ok ? '✅' : '❌'} ${name}${detail ? ' — ' + detail : ''}`);
  if (!ok) failures++;
}

async function check404() {
  const path = '/some-path-that-does-not-exist';
  const res = await fetch(`${baseUrl}${path}`);
  const body = await res.text();
  report('1. Agent-friendly 404', res.status === 404, `status=${res.status}`);
  report('1b. 404 body links to sitemap/llms.txt', /sitemap\.xml/.test(body) && /llms\.txt/.test(body));
}

function extractRootRegion(html) {
  const startIdx = html.indexOf('<div id="root">');
  if (startIdx < 0) return '';
  const rest = html.slice(startIdx);
  const bodyEndIdx = rest.search(/<\/body>/i);
  return bodyEndIdx >= 0 ? rest.slice(0, bodyEndIdx) : rest;
}

function rootTextLength(html) {
  const region = extractRootRegion(html);
  // Strip script tags (e.g. Cloudflare's email-decode injection) before
  // stripping all other tags, so their src/content never counts as content.
  const withoutScripts = region.replace(/<script[\s\S]*?<\/script>/gi, '');
  return withoutScripts.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().length;
}

async function checkHomepageRawContent() {
  const res = await fetch(`${baseUrl}/`, { headers: { Accept: 'text/html' } });
  const html = await res.text();
  const region = extractRootRegion(html);
  report('2. Homepage raw HTML has >=500 chars', rootTextLength(html) >= 500, `${rootTextLength(html)} chars`);
  report('2b. Homepage raw HTML has exactly one <h1>', (region.match(/<h1>/g) || []).length === 1);
}

async function checkMarkdownNegotiation() {
  const res = await fetch(`${baseUrl}/`, { headers: { Accept: 'text/markdown' } });
  const contentType = res.headers.get('content-type') || '';
  const vary = res.headers.get('vary') || '';
  report('3. Accept: text/markdown returns text/markdown', contentType.includes('text/markdown'), contentType);
  report('3b. Vary header includes Accept', /accept(?!-encoding)/i.test(vary.replace(/accept-encoding/gi, '')), vary);
}

async function checkTrustPages() {
  for (const path of ['/about', '/contact', '/privacy']) {
    const res = await fetch(`${baseUrl}${path}`);
    const html = await res.text();
    const len = rootTextLength(html);
    report(`6. ${path} raw HTML has >=500 chars`, len >= 500, `status=${res.status}, ${len} chars`);
  }
}

async function checkLlmsTxt() {
  const res = await fetch(`${baseUrl}/llms.txt`);
  const body = await res.text();
  report('5. llms.txt has a When to Use section', /When to Use/i.test(body));
}

async function checkOrgSchema() {
  const res = await fetch(`${baseUrl}/`);
  const html = await res.text();
  const match = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  let hasContactPoint = false;
  if (match) {
    try {
      const json = JSON.parse(match[1]);
      hasContactPoint = Boolean(json.contactPoint);
    } catch {
      // ignore parse errors, reported as failure below
    }
  }
  report('7. Organization/LocalBusiness schema has contactPoint', hasContactPoint);
}

async function checkKnownRoutesStillWork() {
  for (const path of ['/', '/blog', '/cases', '/about', '/contact', '/privacy', '/politica-de-privacidade', '/termos-de-uso']) {
    const res = await fetch(`${baseUrl}${path}`);
    report(`Sanity: ${path} returns 200`, res.status === 200, `status=${res.status}`);
  }
}

async function main() {
  console.log(`Verifying agent-readiness fixes against ${baseUrl}\n`);
  await check404();
  await checkHomepageRawContent();
  await checkMarkdownNegotiation();
  await checkTrustPages();
  await checkLlmsTxt();
  await checkOrgSchema();
  await checkKnownRoutesStillWork();

  console.log(`\n${failures === 0 ? '✅ All checks passed' : `❌ ${failures} check(s) failed`}`);
  process.exit(failures === 0 ? 0 : 1);
}

main();
