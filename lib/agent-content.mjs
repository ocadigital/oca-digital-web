// Shared content registry used by /middleware.ts to:
//  1) classify which paths are real app routes vs. unknown (agent-friendly 404s)
//  2) serve markdown to clients that prefer it (acceptmarkdown.com negotiation)
//  3) inject real, non-JS-dependent content into the raw HTML shell
//
// Kept as plain ESM (no TypeScript, no JSX) so it can be unit-tested with the
// Node.js built-in test runner without any extra build tooling.

const SITE_URL = 'https://www.ocadigital.com.br';

// ---------------------------------------------------------------------------
// Path classification
// ---------------------------------------------------------------------------

// Paths that resolve to a real page in the app (React Router routes).
const KNOWN_STATIC_PATHS = new Set([
  '/',
  '/about',
  '/sobre',
  '/produtos',
  '/contact',
  '/privacy',
  '/blog',
  '/cases',
  '/politica-de-privacidade',
  '/termos-de-uso',
  '/admin/login',
  '/admin/posts',
  '/admin/posts/new',
]);

// Paths that are collections with a dynamic slug (e.g. /blog/:slug).
const KNOWN_DYNAMIC_PATTERNS = [
  /^\/blog\/[a-zA-Z0-9-]+\/?$/,
  /^\/cases\/[a-zA-Z0-9-]+\/?$/,
  /^\/admin\/posts\/edit\/[a-zA-Z0-9-]+\/?$/,
];

// Paths that get real static content injected into the raw HTML (subset of
// KNOWN_STATIC_PATHS — the ones we have hand-authored copy for).
export const CONTENT_PAGES = buildContentPages();

export function isKnownAppPath(pathname) {
  const normalized = pathname.length > 1 && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
  if (KNOWN_STATIC_PATHS.has(normalized)) return true;
  return KNOWN_DYNAMIC_PATTERNS.some((pattern) => pattern.test(normalized));
}

// Requests to these should never be intercepted: real files with an
// extension (js, css, images, xml, txt, json, fonts...) always pass through
// untouched, whatever they are.
export function looksLikeStaticAsset(pathname) {
  return /\.[a-zA-Z0-9]+$/.test(pathname);
}

// ---------------------------------------------------------------------------
// Accept header negotiation (acceptmarkdown.com)
// ---------------------------------------------------------------------------

function parseAccept(acceptHeader) {
  if (!acceptHeader) return [];
  return acceptHeader
    .split(',')
    .map((part) => {
      const [rawType, ...params] = part.trim().split(';');
      const qParam = params.map((p) => p.trim()).find((p) => p.startsWith('q='));
      const q = qParam ? parseFloat(qParam.slice(2)) : 1;
      return { type: rawType.trim().toLowerCase(), q: Number.isNaN(q) ? 1 : q };
    })
    .filter((entry) => entry.type.length > 0);
}

// Returns true when the client's Accept header prefers text/markdown over
// text/html (or */*), per RFC 7231 quality values.
export function wantsMarkdown(acceptHeader) {
  const entries = parseAccept(acceptHeader);
  if (entries.length === 0) return false;

  const markdown = entries.find((e) => e.type === 'text/markdown');
  if (!markdown || markdown.q <= 0) return false;

  const html = entries.find((e) => e.type === 'text/html' || e.type === '*/*');
  // Equal q-values favor markdown: a client that lists text/markdown at all
  // (real browsers never do) is expressing explicit interest in it.
  if (html && html.q > markdown.q) return false;

  return true;
}

// ---------------------------------------------------------------------------
// Rendering: shared "page" shape -> HTML fragment / Markdown
// ---------------------------------------------------------------------------

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function renderHtmlFragment(page) {
  const parts = [`<h1>${escapeHtml(page.h1)}</h1>`];
  for (const section of page.sections) {
    if (section.h2) parts.push(`<h2>${escapeHtml(section.h2)}</h2>`);
    for (const p of section.paragraphs || []) {
      parts.push(`<p>${escapeHtml(p)}</p>`);
    }
    if (section.list && section.list.length > 0) {
      const items = section.list.map((item) => `<li>${escapeHtml(item)}</li>`).join('');
      parts.push(`<ul>${items}</ul>`);
    }
  }
  return parts.join('\n');
}

export function renderMarkdown(page) {
  const parts = [`# ${page.h1}`, '', page.description, ''];
  for (const section of page.sections) {
    if (section.h2) parts.push(`## ${section.h2}`, '');
    for (const p of section.paragraphs || []) {
      parts.push(p, '');
    }
    if (section.list && section.list.length > 0) {
      for (const item of section.list) parts.push(`- ${item}`);
      parts.push('');
    }
  }
  parts.push('---', `[Home](${SITE_URL}/) · [Sitemap](${SITE_URL}/sitemap.xml) · [llms.txt](${SITE_URL}/llms.txt)`);
  return parts.join('\n');
}

export function notFoundMarkdown(pathname) {
  return [
    '# 404 Not Found',
    '',
    `The page \`${pathname}\` does not exist on OCA Digital.`,
    '',
    `- [Home](${SITE_URL}/)`,
    `- [Sitemap](${SITE_URL}/sitemap.xml)`,
    `- [llms.txt (agent guide)](${SITE_URL}/llms.txt)`,
    `- [Blog](${SITE_URL}/blog)`,
    `- [Cases](${SITE_URL}/cases)`,
    '',
  ].join('\n');
}

// ---------------------------------------------------------------------------
// Content registry
// ---------------------------------------------------------------------------

function buildContentPages() {
  const home = {
    title: 'OCA Digital | Marketing Imobiliário com IA',
    description:
      'Marketing imobiliário com estratégia, dados e automação. Gere mais leads qualificados e transforme sua imobiliária em uma máquina de conversão.',
    h1: 'Transforme sua Imobiliária em uma Máquina de Conversão',
    sections: [
      {
        paragraphs: [
          'A OCA Digital é uma agência especialista em marketing imobiliário que combina estratégia, dados e automação para gerar mais leads qualificados e impulsionar vendas de imobiliárias, incorporadoras e corretores autônomos em todo o Brasil, com sede em Florianópolis, SC.',
        ],
      },
      {
        h2: 'Nossos Serviços',
        list: [
          'Google Ads, Meta Ads e GPT Ads: campanhas de performance e remarketing',
          'Sistema de Captação e Qualificação de Leads: CRM, Lead Score e dashboard em tempo real',
          'Lançamento Imobiliário: campanhas completas de pré-lançamento',
          'Pacotes mensais de manutenção: Essencial, Avançado e Full',
        ],
      },
      {
        h2: 'Nossos Produtos',
        paragraphs: [
          'Conheça o OCA One, o OCA Base e o Curso para Corretores na página de produtos.',
        ],
      },
      {
        h2: 'Quem Somos',
        paragraphs: [
          'Somos especialistas em marketing imobiliário, unindo estratégia, tecnologia e automação para transformar a operação de imobiliárias e construtoras. Com mais de 20 clientes ativos, ajudamos empresas de todos os tamanhos a captar e qualificar leads de forma mais eficiente.',
        ],
      },
      {
        h2: 'Contato',
        paragraphs: [
          'E-mail: contato@ocadigital.com.br · WhatsApp: (48) 99679-0700 · Florianópolis, SC, atendimento em todo o Brasil.',
        ],
      },
    ],
  };

  const about = {
    title: 'Sobre a OCA Digital | Marketing Imobiliário com IA',
    description:
      'Conheça a história, a metodologia e os pilares da OCA Digital, agência especialista em marketing imobiliário sediada em Florianópolis.',
    h1: 'Sobre a OCA Digital',
    sections: [
      {
        h2: 'Nossa História',
        paragraphs: [
          'Fundada por especialistas em marketing digital e mercado imobiliário, a OCA Digital nasceu da necessidade de profissionalizar e escalar as operações de marketing das imobiliárias brasileiras.',
          'Nosso nome vem da sigla OCA: Organização de Processos, Captação de Leads e Automação de Marketing. Esses são os três pilares que sustentam nossa metodologia única.',
          'Com mais de 20 clientes ativos e resultados comprovados, ajudamos imobiliárias de todos os tamanhos a transformarem seus processos e alcançarem resultados excepcionais.',
        ],
      },
      {
        h2: 'Os 3 Pilares da OCA',
        list: [
          'Organização de Processos: implantação de CRM, NPS, unificação dos leads para atendimento e metodologia de SDR',
          'Captação de Clientes: geração de leads através de campanhas customizadas, lançamentos imobiliários e conteúdo',
          'Automação e Ferramentas: chatbot de atendimento, cadência de e-mails, lead score e consultoria de ferramentas',
        ],
      },
      {
        h2: 'Nossa Metodologia',
        paragraphs: [
          'Trabalhamos em quatro fases: Descoberta (coleta e análise de dados), Definição (diagnóstico estratégico), Execução (implementação de soluções práticas) e Entrega (validação, medição e refinamento contínuo).',
        ],
      },
    ],
  };

  const produtos = {
    title: 'Produtos e Cursos | OCA Digital',
    description:
      'Conheça o OCA One, o OCA Base e o Curso para Corretores: soluções da OCA Digital para automatizar a captação de leads e profissionalizar sua operação imobiliária.',
    h1: 'Nossos Produtos',
    sections: [
      {
        h2: 'OCA One',
        paragraphs: [
          'Uma plataforma imobiliária inteligente que centraliza os leads, automatiza a qualificação, sugere imóveis em carteira e oferece inteligência de mercado, tudo via IA no WhatsApp.',
        ],
        list: [
          'IA treinada com BANT no WhatsApp',
          'CRM com automação integrada',
          'Avaliação e captação inteligente',
          'Inteligência de mercado',
        ],
      },
      {
        h2: 'OCA Base',
        paragraphs: [
          'Solução completa para pequenas imobiliárias e corretores autônomos, com site profissional e integração com os maiores portais do mercado.',
        ],
        list: [
          'Site profissional',
          'Integração com portais',
          'Gestão de imóveis',
          'Preço acessível',
        ],
      },
      {
        h2: 'Curso para Corretores',
        paragraphs: [
          'Treinamento completo de marketing imobiliário para corretores que querem acelerar suas vendas: R$297, acesso vitalício e mais de 10 horas de conteúdo.',
        ],
      },
    ],
  };

  const contact = {
    title: 'Contato | OCA Digital',
    description:
      'Fale com a OCA Digital: e-mail, WhatsApp e horário de atendimento para tirar dúvidas ou agendar uma consultoria gratuita.',
    h1: 'Entre em Contato',
    sections: [
      {
        paragraphs: [
          'Pronto para transformar sua imobiliária? Fale com a OCA Digital pelos canais abaixo ou agende uma consultoria gratuita de 30 minutos para entender como podemos ajudar seu negócio a crescer com marketing digital orientado a dados.',
          'Atendemos imobiliárias, incorporadoras e corretores autônomos de todos os tamanhos, com sede em Florianópolis (SC) e atendimento 100% digital para todo o Brasil.',
        ],
      },
      {
        h2: 'Informações de Contato',
        list: [
          'E-mail: contato@ocadigital.com.br',
          'WhatsApp: (48) 99679-0700',
          'Localização: Florianópolis, SC, atendimento nacional',
          'Horário de atendimento: segunda a sexta, das 9h às 18h',
        ],
      },
      {
        h2: 'Como Podemos Ajudar',
        paragraphs: [
          'Seja para tirar uma dúvida rápida, pedir um orçamento ou agendar uma consultoria gratuita, nossa equipe responde pelos canais acima em horário comercial. Também é possível preencher o formulário de contato diretamente no site.',
        ],
      },
    ],
  };

  const privacy = {
    title: 'Política de Privacidade | OCA Digital',
    description: 'Saiba como a OCA Digital coleta, usa e protege seus dados pessoais, em conformidade com a LGPD.',
    h1: 'Política de Privacidade',
    sections: [
      {
        h2: 'Informações Gerais',
        paragraphs: [
          'A OCA Digital está comprometida em proteger a privacidade e os dados pessoais de nossos usuários. Coletamos, usamos, armazenamos e protegemos suas informações em conformidade com a Lei Geral de Proteção de Dados (LGPD).',
        ],
      },
      {
        h2: 'Dados Coletados',
        list: [
          'Dados de identificação: nome, e-mail, telefone',
          'Dados profissionais: empresa, cargo, setor de atuação',
          'Dados de navegação: cookies, endereço IP, páginas visitadas',
          'Dados de comunicação: mensagens enviadas através de formulários',
        ],
      },
      {
        h2: 'Seus Direitos',
        paragraphs: [
          'Você pode confirmar a existência de tratamento, acessar e corrigir seus dados, solicitar exclusão, revogar consentimento e obter informações sobre compartilhamento, entrando em contato pelo e-mail contato@ocadigital.com.br.',
        ],
      },
    ],
  };

  return {
    '/': home,
    '/about': about,
    '/sobre': about,
    '/produtos': produtos,
    '/contact': contact,
    '/privacy': privacy,
  };
}
