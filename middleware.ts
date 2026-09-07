// Vercel Routing Middleware — runs before the vercel.json SPA rewrite.
//
// Responsibilities (see the "Is Agentic" readiness audit this fixes):
//  1. Return a real HTTP 404 for paths that aren't a real app route, instead
//     of the SPA shell returning 200 for everything (soft-404).
//  2. Serve meaningful, real content in the raw HTML for pages an agent or
//     crawler reads without executing JavaScript.
//  3. Honor "Accept: text/markdown" content negotiation (acceptmarkdown.com)
//     with a correct Vary header, for the pages we have markdown for.
//
// Any request that isn't a known app route AND isn't already an unknown
// path is left completely untouched (next()) so static assets, the admin
// SPA, and dynamic blog/case slugs keep working exactly as before.
import { next } from '@vercel/functions';
import {
  CONTENT_PAGES,
  isKnownAppPath,
  looksLikeStaticAsset,
  notFoundMarkdown,
  renderHtmlFragment,
  renderMarkdown,
  wantsMarkdown,
} from './lib/agent-content.mjs';

function escapeAttr(str: string): string {
  return String(str).replace(/&/g, '&amp;').replace(/"/g, '&quot;');
}

function injectContent(baseHtml: string, page: { title: string; description: string }, fragment: string): string {
  let html = baseHtml;
  html = html.replace(/<title>.*?<\/title>/s, `<title>${escapeAttr(page.title)}</title>`);
  html = html.replace(
    /<meta name="description" content=".*?"\s*\/?>/s,
    `<meta name="description" content="${escapeAttr(page.description)}" />`
  );
  html = html.replace('<div id="root"></div>', `<div id="root">${fragment}</div>`);
  return html;
}

export default async function middleware(request: Request) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  // Real files (JS, CSS, images, robots.txt, sitemap.xml, llms.txt, fonts...)
  // always pass through untouched.
  if (looksLikeStaticAsset(pathname)) {
    return next();
  }

  const accept = request.headers.get('accept') || '';
  const preferMarkdown = wantsMarkdown(accept);

  // Unknown path: agent-friendly 404, not a 200 SPA shell.
  if (!isKnownAppPath(pathname)) {
    return new Response(notFoundMarkdown(pathname), {
      status: 404,
      headers: {
        'Content-Type': 'text/markdown; charset=utf-8',
        'Cache-Control': 'no-store',
        Vary: 'Accept, Accept-Encoding',
      },
    });
  }

  const page = CONTENT_PAGES[pathname];

  // Known route we don't have hand-authored content for (blog/case slugs,
  // legacy PT-only pages, admin) — let the SPA handle it as before.
  if (!page) {
    return next();
  }

  if (preferMarkdown) {
    return new Response(renderMarkdown(page), {
      status: 200,
      headers: {
        'Content-Type': 'text/markdown; charset=utf-8',
        Vary: 'Accept, Accept-Encoding',
      },
    });
  }

  // Normal HTML request: fetch the real built index.html (with its correct,
  // hashed asset tags) and inject real content into the root div so it's
  // present without JavaScript, then let React take over as usual on load.
  const baseRes = await fetch(new URL('/index.html', request.url));
  const baseHtml = await baseRes.text();
  const fragment = renderHtmlFragment(page);
  const html = injectContent(baseHtml, page, fragment);

  return new Response(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      Vary: 'Accept, Accept-Encoding',
    },
  });
}

export const config = {
  matcher: '/(.*)',
};
