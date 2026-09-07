// Runs before every build (see "prebuild" in package.json) and regenerates
// public/sitemap.xml so blog posts are included automatically on each deploy.
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const SITE_URL = 'https://www.ocadigital.com.br';
const SUPABASE_URL = 'https://ujhyhsplcdppmutsvmrv.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVqaHloc3BsY2RwcG11dHN2bXJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk1MTQ3MzksImV4cCI6MjA2NTA5MDczOX0.FdXOL9-_fRjfsh228vc57ntqMn2j41XnTbppq8vO4FQ';

const staticUrls = [
  { loc: '/', changefreq: 'weekly', priority: '1.0' },
  { loc: '/blog', changefreq: 'weekly', priority: '0.8' },
  { loc: '/politica-de-privacidade', changefreq: 'yearly', priority: '0.3' },
  { loc: '/termos-de-uso', changefreq: 'yearly', priority: '0.3' },
];

async function fetchPublishedPosts() {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/blog_posts?select=slug,updated_at&published=eq.true`,
      {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
      }
    );
    if (!res.ok) throw new Error(`Supabase respondeu ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('[generate-sitemap] Falha ao buscar posts do Supabase, gerando sitemap só com páginas estáticas:', err.message);
    return [];
  }
}

function urlEntry({ loc, changefreq, priority, lastmod }) {
  return [
    '  <url>',
    `    <loc>${SITE_URL}${loc}</loc>`,
    lastmod ? `    <lastmod>${lastmod}</lastmod>` : null,
    `    <changefreq>${changefreq}</changefreq>`,
    `    <priority>${priority}</priority>`,
    '  </url>',
  ]
    .filter(Boolean)
    .join('\n');
}

async function main() {
  const posts = await fetchPublishedPosts();

  const postEntries = posts.map((post) =>
    urlEntry({
      loc: `/blog/${post.slug}`,
      changefreq: 'monthly',
      priority: '0.6',
      lastmod: post.updated_at ? post.updated_at.slice(0, 10) : undefined,
    })
  );

  const staticEntries = staticUrls.map(urlEntry);

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${[
    ...staticEntries,
    ...postEntries,
  ].join('\n')}\n</urlset>\n`;

  const outPath = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    '../public/sitemap.xml'
  );
  writeFileSync(outPath, xml, 'utf-8');
  console.log(`[generate-sitemap] sitemap.xml gerado com ${staticUrls.length} páginas estáticas + ${posts.length} posts.`);
}

main();
