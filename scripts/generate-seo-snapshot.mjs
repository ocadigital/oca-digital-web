// Roda antes de cada build (ver "prebuild" em package.json) e grava lib/seo-snapshot.mjs
// com os posts publicados (Supabase) e os cases (src/data/cases.ts). O middleware usa
// esse arquivo para entregar title, canonical, schema e o conteúdo principal no HTML
// inicial de /blog, /blog/:slug, /cases e /cases/:slug, sem depender de JavaScript.
import { writeFileSync, readFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
import { transformSync } from 'esbuild';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SUPABASE_URL = 'https://ujhyhsplcdppmutsvmrv.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVqaHloc3BsY2RwcG11dHN2bXJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk1MTQ3MzksImV4cCI6MjA2NTA5MDczOX0.FdXOL9-_fRjfsh228vc57ntqMn2j41XnTbppq8vO4FQ';

async function fetchPosts() {
  try {
    const fields = 'slug,title,excerpt,content,image,author,category,published_at,updated_at,created_at';
    const res = await fetch(`${SUPABASE_URL}/rest/v1/blog_posts?select=${fields}&published=eq.true&order=published_at.desc`, {
      headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` },
    });
    if (!res.ok) throw new Error(`Supabase respondeu ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('[seo-snapshot] Falha ao buscar posts:', err.message);
    return [];
  }
}

async function loadCases() {
  try {
    const src = readFileSync(path.join(ROOT, 'src/data/cases.ts'), 'utf-8');
    const { code } = transformSync(src, { loader: 'ts', format: 'esm' });
    const dir = mkdtempSync(path.join(tmpdir(), 'oca-cases-'));
    const file = path.join(dir, 'cases.mjs');
    writeFileSync(file, code, 'utf-8');
    const mod = await import(pathToFileURL(file).href);
    return mod.cases || [];
  } catch (err) {
    console.warn('[seo-snapshot] Falha ao ler cases.ts:', err.message);
    return [];
  }
}

async function main() {
  const [posts, cases] = await Promise.all([fetchPosts(), loadCases()]);
  const snapshot = {
    generatedAt: new Date().toISOString(),
    posts: posts.map((p) => ({
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt || '',
      content: (p.content || '').replace(/<script[\s\S]*?<\/script>/gi, ''),
      image: p.image || null,
      author: p.author || 'Anderson Gonçalves',
      category: p.category || null,
      publishedAt: p.published_at || p.created_at,
      updatedAt: p.updated_at || p.published_at || p.created_at,
    })),
    cases: cases.map((c) => ({
      slug: c.slug,
      client: c.client,
      segment: c.segment,
      title: c.title,
      summary: c.summary,
      challenge: c.challenge,
      solution: c.solution,
      results: c.results,
      metrics: c.metrics || [],
      coverImage: c.coverImage || null,
      publishedAt: c.publishedAt,
      otherSegment: !!c.otherSegment,
    })),
  };
  writeFileSync(path.join(ROOT, 'lib/seo-snapshot.mjs'), 'export default ' + JSON.stringify(snapshot) + ';\n', 'utf-8');
  console.log(`[seo-snapshot] ${snapshot.posts.length} posts e ${snapshot.cases.length} cases.`);
}

main();
