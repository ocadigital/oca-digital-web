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
import { seoFor, jsonLdTag } from './lib/seo-pages.mjs';

function escapeAttr(str: string): string {
  return String(str).replace(/&/g, '&amp;').replace(/"/g, '&quot;');
}

type PageMeta = { title: string; description: string; url?: string; ogTitle?: string; ogImage?: string };

/** Troca as tags de prévia (WhatsApp, LinkedIn, X) quando a página tem imagem própria. */
function injectSocial(baseHtml: string, page: PageMeta): string {
  if (!page.ogImage) return baseHtml;
  const title = escapeAttr(page.ogTitle || page.title);
  const desc = escapeAttr(page.description);
  const img = escapeAttr(page.ogImage);
  const tags: [RegExp, string][] = [
    [/<meta property="og:title" content=".*?"\s*\/?>/s, `<meta property="og:title" content="${title}" />`],
    [/<meta property="og:description" content=".*?"\s*\/?>/s, `<meta property="og:description" content="${desc}" />`],
    [/<meta property="og:image" content=".*?"\s*\/?>/s, `<meta property="og:image" content="${img}" />`],
    [/<meta name="twitter:title" content=".*?"\s*\/?>/s, `<meta name="twitter:title" content="${title}" />`],
    [/<meta name="twitter:description" content=".*?"\s*\/?>/s, `<meta name="twitter:description" content="${desc}" />`],
    [/<meta name="twitter:image" content=".*?"\s*\/?>/s, `<meta name="twitter:image" content="${img}" />`],
  ];
  if (page.url) tags.push([/<meta property="og:url" content=".*?"\s*\/?>/s, `<meta property="og:url" content="${escapeAttr(page.url)}" />`]);
  return tags.reduce((html, [re, tag]) => html.replace(re, tag), baseHtml);
}

function injectContent(baseHtml: string, page: PageMeta, fragment: string): string {
  let html = injectSocial(baseHtml, page);
  html = html.replace(/<title>.*?<\/title>/s, `<title>${escapeAttr(page.title)}</title>`);
  html = html.replace(
    /<meta name="description" content=".*?"\s*\/?>/s,
    `<meta name="description" content="${escapeAttr(page.description)}" />`
  );
  html = html.replace('<div id="root"></div>', `<div id="root">${fragment}</div>`);
  return html;
}

type Seo = ReturnType<typeof seoFor>;

/** Canonical e og:url próprios, og:type, noindex quando for o caso e o JSON-LD no head. */
function applySeo(baseHtml: string, seo: Seo): string {
  const url = escapeAttr(seo.canonical);
  let html = baseHtml
    .replace(/<link rel="canonical" href=".*?"\s*\/?>/s, `<link rel="canonical" href="${url}" />`)
    .replace(/<meta property="og:url" content=".*?"\s*\/?>/s, `<meta property="og:url" content="${url}" />`);
  if (seo.ogType) {
    html = html.replace(/<meta property="og:type" content=".*?"\s*\/?>/s, `<meta property="og:type" content="${escapeAttr(seo.ogType)}" />`);
  }
  if (seo.noindex) {
    html = html.replace('</head>', '<meta name="robots" content="noindex, follow" />\n</head>');
  }
  const ld = jsonLdTag(seo.schema);
  if (ld) html = html.replace('</head>', `${ld}\n</head>`);
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

  // URLs antigas ou duplicadas: redirecionamento permanente para a versão oficial.
  const PERMANENT: Record<string, string> = { '/about': '/sobre', '/privacy': '/politica-de-privacidade', '/produtos': '/' };
  const destino = PERMANENT[pathname.replace(/\/$/, '') || '/'];
  if (destino) {
    return Response.redirect(new URL(destino + url.search, request.url), 301);
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

  if (page && preferMarkdown) {
    return new Response(renderMarkdown(page), {
      status: 200,
      headers: {
        'Content-Type': 'text/markdown; charset=utf-8',
        Vary: 'Accept, Accept-Encoding',
      },
    });
  }

  // Admin fica fora do SEO: só o SPA.
  if (pathname.startsWith('/admin')) {
    return next();
  }

  // HTML: busca o index.html do build e injeta canonical, title, descrição, prévia social,
  // dados estruturados e o conteúdo principal, para robôs lerem sem executar JavaScript.
  const seo = seoFor(pathname);

  // Serviço ou case com slug que não existe: 404 de verdade. (Posts ficam de fora porque um
  // post novo publicado no admin ainda não está no snapshot até o próximo deploy.)
  if (/^\/(servicos|cases)\/[^/]+\/?$/.test(pathname) && !seo.title) {
    return new Response(notFoundMarkdown(pathname), {
      status: 404,
      headers: { 'Content-Type': 'text/markdown; charset=utf-8', 'Cache-Control': 'no-store', Vary: 'Accept, Accept-Encoding' },
    });
  }
  const baseRes = await fetch(new URL('/index.html', request.url));
  let html = await baseRes.text();

  if (page) {
    html = injectContent(html, { ...page, url: seo.canonical }, renderHtmlFragment(page));
  } else if (seo.title) {
    html = injectContent(
      html,
      { title: seo.title, description: seo.description, url: seo.canonical, ogTitle: seo.ogTitle, ogImage: seo.ogImage },
      seo.fragment || ''
    );
  }
  html = applySeo(html, seo);

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
