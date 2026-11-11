// Runs before every build (see "prebuild" in package.json) and regenerates
// public/sitemap.xml so blog posts are included automatically on each deploy.
import { writeFileSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const SITE_URL = 'https://www.ocadigital.com.br';
const SUPABASE_URL = 'https://ujhyhsplcdppmutsvmrv.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVqaHloc3BsY2RwcG11dHN2bXJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk1MTQ3MzksImV4cCI6MjA2NTA5MDczOX0.FdXOL9-_fRjfsh228vc57ntqMn2j41XnTbppq8vO4FQ';

const staticUrls = [
  { loc: '/', changefreq: 'weekly', priority: '1.0' },
  { loc: '/sobre', changefreq: 'monthly', priority: '0.6' },
  { loc: '/contact', changefreq: 'monthly', priority: '0.6' },
  { loc: '/teste-maturidade', changefreq: 'monthly', priority: '0.7' },
  { loc: '/diagnostico', changefreq: 'monthly', priority: '0.7' },
  { loc: '/blog', changefreq: 'weekly', priority: '0.8' },
  { loc: '/cases', changefreq: 'weekly', priority: '0.8' },
  { loc: '/servicos', changefreq: 'monthly', priority: '0.9' },
  { loc: '/politica-de-privacidade', changefreq: 'yearly', priority: '0.3' },
  { loc: '/termos-de-uso', changefreq: 'yearly', priority: '0.3' },
];

function getCaseSlugs() {
  try {
    const filePath = path.resolve(
      path.dirname(fileURLToPath(import.meta.url)),
      '../src/data/cases.ts'
    );
    const content = readFileSync(filePath, 'utf-8');
    // Cada case começa em `id:`; os marcados com otherSegment (fora do foco imobiliário) não entram.
    return content
      .split(/\n\s*\{\s*\n\s*id:/)
      .slice(1)
      .filter((bloco) => !/otherSegment:\s*true/.test(bloco))
      .map((bloco) => (bloco.match(/slug:\s*"([^"]+)"/) || [])[1])
      .filter(Boolean);
  } catch (err) {
    console.warn('[generate-sitemap] Falha ao ler cases.ts:', err.message);
    return [];
  }
}

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
  const caseSlugs = getCaseSlugs();

  const postEntries = posts.map((post) =>
    urlEntry({
      loc: `/blog/${post.slug}`,
      changefreq: 'monthly',
      priority: '0.6',
      lastmod: post.updated_at ? post.updated_at.slice(0, 10) : undefined,
    })
  );

  const caseEntries = caseSlugs.map((slug) =>
    urlEntry({ loc: `/cases/${slug}`, changefreq: 'monthly', priority: '0.7' })
  );

  // Páginas de serviço: lidas do snapshot que o prebuild acabou de gerar.
  let servicoSlugs = [];
  try {
    const { default: snap } = await import(new URL('../lib/seo-snapshot.mjs', import.meta.url).href);
    servicoSlugs = (snap.servicos || []).map((s) => s.slug);
  } catch (err) {
    console.warn('[generate-sitemap] Falha ao ler os serviços do snapshot:', err.message);
  }
  const servicoEntries = servicoSlugs.map((slug) =>
    urlEntry({ loc: `/servicos/${slug}`, changefreq: 'monthly', priority: slug === 'marketing-imobiliario' ? '0.9' : '0.8' })
  );

  const staticEntries = staticUrls.map(urlEntry);

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${[
    ...staticEntries,
    ...servicoEntries,
    ...postEntries,
    ...caseEntries,
  ].join('\n')}\n</urlset>\n`;

  const outPath = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    '../public/sitemap.xml'
  );
  writeFileSync(outPath, xml, 'utf-8');
  console.log(`[generate-sitemap] sitemap.xml gerado com ${staticUrls.length} páginas estáticas + ${servicoSlugs.length} serviços + ${posts.length} posts + ${caseSlugs.length} cases.`);
}

main();
