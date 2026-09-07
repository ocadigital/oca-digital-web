import test from 'node:test';
import assert from 'node:assert/strict';
import {
  isKnownAppPath,
  looksLikeStaticAsset,
  wantsMarkdown,
  renderHtmlFragment,
  renderMarkdown,
  notFoundMarkdown,
  CONTENT_PAGES,
} from './agent-content.mjs';

test('isKnownAppPath: recognizes real static routes', () => {
  assert.equal(isKnownAppPath('/'), true);
  assert.equal(isKnownAppPath('/blog'), true);
  assert.equal(isKnownAppPath('/cases'), true);
  assert.equal(isKnownAppPath('/about'), true);
  assert.equal(isKnownAppPath('/contact'), true);
  assert.equal(isKnownAppPath('/privacy'), true);
  assert.equal(isKnownAppPath('/politica-de-privacidade'), true);
  assert.equal(isKnownAppPath('/termos-de-uso'), true);
  assert.equal(isKnownAppPath('/admin/login'), true);
});

test('isKnownAppPath: recognizes dynamic slug routes', () => {
  assert.equal(isKnownAppPath('/blog/como-gerar-leads'), true);
  assert.equal(isKnownAppPath('/cases/brognoli-negocios-imobiliarios'), true);
  assert.equal(isKnownAppPath('/admin/posts/edit/abc-123'), true);
});

test('isKnownAppPath: rejects nonexistent paths (the core 404 fix)', () => {
  assert.equal(isKnownAppPath('/wp-admin'), false);
  assert.equal(isKnownAppPath('/some-path-that-does-not-exist'), false);
  assert.equal(isKnownAppPath('/.env'), false);
  assert.equal(isKnownAppPath('/api/keys'), false);
  assert.equal(isKnownAppPath('/blog/'), true); // trailing slash normalizes to /blog
});

test('looksLikeStaticAsset: only matches paths with a file extension', () => {
  assert.equal(looksLikeStaticAsset('/robots.txt'), true);
  assert.equal(looksLikeStaticAsset('/assets/index-abc123.js'), true);
  assert.equal(looksLikeStaticAsset('/images/blog/leads.jpeg'), true);
  assert.equal(looksLikeStaticAsset('/favicon.png'), true);
  assert.equal(looksLikeStaticAsset('/blog'), false);
  assert.equal(looksLikeStaticAsset('/'), false);
  assert.equal(looksLikeStaticAsset('/cases/pousada-dos-sonhos'), false);
});

test('wantsMarkdown: true only when markdown outranks html/*/*', () => {
  assert.equal(wantsMarkdown('text/markdown'), true);
  assert.equal(wantsMarkdown('text/markdown, text/html'), true);
  assert.equal(wantsMarkdown('text/html, text/markdown;q=0.9'), false);
  assert.equal(wantsMarkdown('text/html'), false);
  assert.equal(wantsMarkdown('*/*'), false);
  assert.equal(wantsMarkdown(''), false);
  assert.equal(wantsMarkdown(undefined), false);
  assert.equal(wantsMarkdown('text/markdown;q=0'), false);
  assert.equal(wantsMarkdown('text/markdown;q=0.8, text/html;q=0.5'), true);
});

test('renderHtmlFragment: produces a single h1 and real paragraph content', () => {
  const html = renderHtmlFragment(CONTENT_PAGES['/']);
  assert.match(html, /<h1>Transforme sua Imobiliária/);
  assert.equal((html.match(/<h1>/g) || []).length, 1);
  assert.ok(html.length > 500, `expected >500 chars, got ${html.length}`);
});

test('renderMarkdown: produces real content well over the 500-char floor', () => {
  const md = renderMarkdown(CONTENT_PAGES['/']);
  assert.match(md, /^# Transforme sua Imobiliária/);
  assert.ok(md.length > 500, `expected >500 chars, got ${md.length}`);
  assert.match(md, /\[Sitemap\]/);
});

test('every registered content page renders >=500 chars of HTML', () => {
  for (const [path, page] of Object.entries(CONTENT_PAGES)) {
    const html = renderHtmlFragment(page);
    assert.ok(html.length >= 500, `${path}: expected >=500 chars, got ${html.length}`);
  }
});

test('notFoundMarkdown: includes the requested path and key navigation links', () => {
  const body = notFoundMarkdown('/some-path-that-does-not-exist');
  assert.match(body, /404 Not Found/);
  assert.match(body, /some-path-that-does-not-exist/);
  assert.match(body, /sitemap\.xml/);
  assert.match(body, /llms\.txt/);
});
