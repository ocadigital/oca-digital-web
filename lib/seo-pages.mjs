// SEO por rota para o middleware: canonical, title, description, og e schema (JSON-LD),
// mais o conteúdo principal de blog e cases no HTML inicial (sem depender de JavaScript).
// Dados de posts e cases vêm de lib/seo-snapshot.mjs, gerado no prebuild.
import snapshot from './seo-snapshot.mjs';

export const SITE_URL = 'https://www.ocadigital.com.br';
const LOGO = `${SITE_URL}/oca-logo-white.webp`;
const DEFAULT_IMAGE = `${SITE_URL}/images/anderson-goncalves-960.webp`;

/** URLs duplicadas apontam o canonical para a versão em português. */
const CANONICAL_ALIAS = {
  '/about': '/sobre',
  '/privacy': '/politica-de-privacidade',
};

/** Páginas do React sem conteúdo próprio no middleware: só title, descrição e canonical. */
const SIMPLE_META = {
  '/diagnostico': {
    title: 'Diagnóstico Gratuito de Marketing Imobiliário | OCA Digital',
    description: 'Conte como funciona a captação e o atendimento da sua imobiliária e receba um diagnóstico com os gargalos e o que resolver primeiro.',
  },
  '/politica-de-privacidade': {
    title: 'Política de Privacidade | OCA Digital',
    description: 'Como a OCA Digital coleta, usa e protege os dados de quem preenche os formulários do site.',
  },
  '/termos-de-uso': {
    title: 'Termos de Uso | OCA Digital',
    description: 'Termos de uso do site da OCA Digital.',
  },
};

export const ORGANIZATION = {
  '@type': 'ProfessionalService',
  '@id': `${SITE_URL}/#organizacao`,
  name: 'OCA Digital',
  url: `${SITE_URL}/`,
  logo: LOGO,
  image: LOGO,
  description: 'Agência de marketing imobiliário em Florianópolis: anúncios, sites, landing pages, CRM e automação para imobiliárias e incorporadoras.',
  email: 'anderson@ocadigital.com.br',
  telephone: '+55-48-99679-0700',
  areaServed: { '@type': 'Country', name: 'Brasil' },
  address: { '@type': 'PostalAddress', addressLocality: 'Florianópolis', addressRegion: 'SC', addressCountry: 'BR' },
  founder: { '@id': `${SITE_URL}/sobre#anderson` },
  sameAs: ['https://www.instagram.com/ocadigital.marketing/', 'https://www.linkedin.com/company/941540/', 'https://www.facebook.com/ocadigitalfloripa'],
};

export const PERSON = {
  '@type': 'Person',
  '@id': `${SITE_URL}/sobre#anderson`,
  name: 'Anderson Gonçalves',
  jobTitle: 'Fundador da OCA Digital',
  url: `${SITE_URL}/sobre#anderson`,
  image: DEFAULT_IMAGE,
  worksFor: { '@id': `${SITE_URL}/#organizacao` },
  description: 'Especialista em marketing imobiliário. Foi Head de Marketing da Brognoli, Gerente de Marketing da Buzz Imobiliária e responsável pelo marketing da Santa Ilha Imóveis.',
  sameAs: ['https://www.instagram.com/andersonmgoncalves/'],
};

const WEBSITE = {
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#site`,
  url: `${SITE_URL}/`,
  name: 'OCA Digital',
  inLanguage: 'pt-BR',
  publisher: { '@id': `${SITE_URL}/#organizacao` },
};

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const abs = (u) => (!u ? null : u.startsWith('http') ? u : `${SITE_URL}${u.startsWith('/') ? '' : '/'}${u}`);
const dataBR = (iso) => (iso ? new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric', timeZone: 'America/Sao_Paulo' }) : '');

function breadcrumb(items) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map(([name, url], i) => ({ '@type': 'ListItem', position: i + 1, name, item: `${SITE_URL}${url}` })),
  };
}

export function normalizePath(pathname) {
  return pathname.length > 1 && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
}

export function canonicalFor(pathname) {
  const p = normalizePath(pathname);
  return p === '/' ? `${SITE_URL}/` : `${SITE_URL}${CANONICAL_ALIAS[p] || p}`;
}

function blogIndex() {
  const posts = snapshot.posts;
  const items = posts
    .map((p) => `<li><a href="/blog/${esc(p.slug)}">${esc(p.title)}</a><p>${esc(p.excerpt)}</p></li>`)
    .join('');
  return {
    title: 'Blog de Marketing Imobiliário, CRM e Automação | OCA Digital',
    description: 'Artigos práticos sobre geração de leads, CRM, atendimento, processos e automação para imobiliárias e incorporadoras.',
    fragment: `<h1>Blog de marketing imobiliário</h1><p>Artigos práticos sobre leads, CRM, atendimento e automação para imobiliárias e incorporadoras.</p><ul>${items}</ul>`,
    schema: [
      {
        '@type': 'Blog',
        '@id': `${SITE_URL}/blog#blog`,
        name: 'Blog da OCA Digital',
        url: `${SITE_URL}/blog`,
        publisher: { '@id': `${SITE_URL}/#organizacao` },
        blogPost: posts.map((p) => ({ '@type': 'BlogPosting', headline: p.title, url: `${SITE_URL}/blog/${p.slug}` })),
      },
      breadcrumb([['Início', '/'], ['Blog', '/blog']]),
    ],
  };
}

function blogPost(slug) {
  const p = snapshot.posts.find((x) => x.slug === slug);
  if (!p) return null;
  const url = `${SITE_URL}/blog/${p.slug}`;
  const image = abs(p.image);
  return {
    title: `${p.title} | OCA Digital`,
    description: p.excerpt,
    ogTitle: p.title,
    ogImage: image,
    ogType: 'article',
    fragment: `<article><h1>${esc(p.title)}</h1><p>Por <a href="/sobre#anderson">${esc(p.author)}</a> · publicado em ${esc(dataBR(p.publishedAt))}${p.updatedAt && p.updatedAt.slice(0, 10) !== (p.publishedAt || '').slice(0, 10) ? ` · atualizado em ${esc(dataBR(p.updatedAt))}` : ''}</p>${p.content}</article>`,
    schema: [
      {
        '@type': 'BlogPosting',
        '@id': `${url}#artigo`,
        headline: p.title,
        description: p.excerpt,
        image: image || undefined,
        datePublished: p.publishedAt,
        dateModified: p.updatedAt,
        inLanguage: 'pt-BR',
        mainEntityOfPage: url,
        author: { '@id': PERSON['@id'], '@type': 'Person', name: p.author, url: PERSON.url },
        publisher: { '@id': ORGANIZATION['@id'] },
      },
      breadcrumb([['Início', '/'], ['Blog', '/blog'], [p.title, `/blog/${p.slug}`]]),
    ],
  };
}

function casesIndex() {
  const cases = snapshot.cases.filter((c) => !c.otherSegment);
  const items = cases
    .map((c) => `<li><a href="/cases/${esc(c.slug)}">${esc(c.title)}</a><p>${esc(c.summary)}</p></li>`)
    .join('');
  return {
    title: 'Cases de Marketing Imobiliário com Resultados | OCA Digital',
    description: 'Cases da OCA Digital com imobiliárias e incorporadoras: lançamentos, sites, captação de imóveis e CRM, com os números de cada projeto.',
    fragment: `<h1>Cases de marketing imobiliário</h1><p>Projetos da OCA Digital com imobiliárias e incorporadoras, com contexto, solução e resultados.</p><ul>${items}</ul>`,
    schema: [breadcrumb([['Início', '/'], ['Cases', '/cases']])],
  };
}

function caseDetail(slug) {
  const c = snapshot.cases.find((x) => x.slug === slug);
  if (!c) return null;
  const metrics = c.metrics.map((m) => `<li><strong>${esc(m.value)}</strong> ${esc(m.label)}</li>`).join('');
  return {
    title: `${c.title} | OCA Digital`,
    description: c.summary,
    ogTitle: c.title,
    ogImage: abs(c.coverImage),
    fragment: `<article><h1>${esc(c.title)}</h1><p>${esc(c.client)} · ${esc(c.segment)}</p><p>${esc(c.summary)}</p>${metrics ? `<ul>${metrics}</ul>` : ''}<h2>Desafio</h2><p>${esc(c.challenge)}</p><h2>Solução</h2><p>${esc(c.solution)}</p><h2>Resultados</h2><p>${esc(c.results)}</p></article>`,
    schema: [breadcrumb([['Início', '/'], ['Cases', '/cases'], [c.client, `/cases/${c.slug}`]])],
    noindex: c.otherSegment,
  };
}

const lista = (itens) => `<ul>${itens.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>`;

function servicosIndex() {
  const todos = snapshot.servicos || [];
  const items = todos
    .map((s) => `<li><a href="/servicos/${esc(s.slug)}">${esc(s.nome)}</a><p>${esc(s.seoDescription)}</p></li>`)
    .join('');
  return {
    title: 'Serviços de Marketing Imobiliário | OCA Digital',
    description: 'Sites, landing pages, anúncios, CRM, processos comerciais, automação com n8n, lançamentos e planejamento de marketing para imobiliárias e incorporadoras.',
    fragment: `<h1>Serviços de marketing imobiliário</h1><p>Cada serviço resolve uma etapa do caminho entre o anúncio e a visita agendada.</p><ul>${items}</ul>`,
    schema: [
      {
        '@type': 'ItemList',
        name: 'Serviços da OCA Digital',
        itemListElement: todos.map((s, i) => ({ '@type': 'ListItem', position: i + 1, url: `${SITE_URL}/servicos/${s.slug}`, name: s.nome })),
      },
      breadcrumb([['Início', '/'], ['Serviços', '/servicos']]),
    ],
  };
}

function servicoDetail(slug) {
  const todos = snapshot.servicos || [];
  const s = todos.find((x) => x.slug === slug);
  if (!s) return null;
  const url = `${SITE_URL}/servicos/${s.slug}`;
  const nomeDe = (sl) => (todos.find((x) => x.slug === sl) || {}).nome;
  const casesRel = s.cases.map((sl) => snapshot.cases.find((c) => c.slug === sl)).filter(Boolean);
  const passos = s.comoFunciona.map((p) => `<li><strong>${esc(p.etapa)}:</strong> ${esc(p.texto)}</li>`).join('');
  const faq = s.faq.map((f) => `<h3>${esc(f.pergunta)}</h3><p>${esc(f.resposta)}</p>`).join('');
  const rel = s.relacionados.map((sl) => `<li><a href="/servicos/${esc(sl)}">${esc(nomeDe(sl) || sl)}</a></li>`).join('');
  const casesHtml = casesRel.map((c) => `<li><a href="/cases/${esc(c.slug)}">${esc(c.title)}</a></li>`).join('');
  const fragment = [
    `<article><h1>${esc(s.h1)}</h1><p>${esc(s.intro)}</p>`,
    `<h2>Para quem é</h2>${lista(s.paraQuem)}`,
    `<h2>${esc(s.problema.titulo)}</h2><p>${esc(s.problema.texto)}</p>`,
    `<h2>Como funciona</h2><ol>${passos}</ol>`,
    s.pilar ? '' : `<h2>O que entregamos</h2>${lista(s.entregas)}<p>Prazo: ${esc(s.prazo)}. Investimento: ${esc(s.preco)}. ${esc(s.precoNota)}</p>`,
    casesHtml ? `<h2>Cases relacionados</h2><ul>${casesHtml}</ul>` : '',
    `<h2>Perguntas frequentes</h2>${faq}`,
    rel ? `<h2>${s.pilar ? 'Serviços de marketing imobiliário' : 'Serviços que combinam'}</h2><ul>${rel}</ul>` : '',
    `</article>`,
  ].join('');
  const service = {
    '@type': 'Service',
    '@id': `${url}#servico`,
    name: s.nome,
    serviceType: s.nome,
    description: s.seoDescription,
    url,
    provider: { '@id': ORGANIZATION['@id'] },
    areaServed: { '@type': 'Country', name: 'Brasil' },
    audience: { '@type': 'BusinessAudience', audienceType: 'Imobiliárias e incorporadoras' },
  };
  return {
    title: s.seoTitle,
    description: s.seoDescription,
    ogTitle: s.h1,
    fragment,
    schema: [
      service,
      {
        '@type': 'FAQPage',
        mainEntity: s.faq.map((f) => ({ '@type': 'Question', name: f.pergunta, acceptedAnswer: { '@type': 'Answer', text: f.resposta } })),
      },
      breadcrumb([['Início', '/'], ['Serviços', '/servicos'], [s.nome, `/servicos/${s.slug}`]]),
    ],
  };
}

/**
 * SEO de uma rota. Retorna { title, description, canonical, ogTitle?, ogImage?, ogType?, fragment?, schema[], noindex? }
 * ou null quando a rota não tem nada além do canonical (o middleware ainda corrige o canonical).
 */
export function seoFor(pathname) {
  const p = normalizePath(pathname);
  const canonical = canonicalFor(p);
  let seo = null;
  if (p === '/blog') seo = blogIndex();
  else if (p.startsWith('/blog/')) seo = blogPost(p.slice(6));
  else if (p === '/cases') seo = casesIndex();
  else if (p.startsWith('/cases/')) seo = caseDetail(p.slice(7));
  else if (p === '/servicos') seo = servicosIndex();
  else if (p.startsWith('/servicos/')) seo = servicoDetail(p.slice(10));
  else if (SIMPLE_META[p]) seo = { ...SIMPLE_META[p], schema: [] };
  if (p === '/') seo = { ...(seo || {}), schema: [ORGANIZATION, WEBSITE, PERSON] };
  if (p === '/sobre' || p === '/about') seo = { ...(seo || {}), schema: [PERSON, breadcrumb([['Início', '/'], ['Sobre', '/sobre']])] };
  return { canonical, ...(seo || { schema: [] }) };
}

export function jsonLdTag(schema) {
  if (!schema || !schema.length) return '';
  const graph = { '@context': 'https://schema.org', '@graph': schema };
  return `<script type="application/ld+json">${JSON.stringify(graph).replace(/</g, '\\u003c')}</script>`;
}
