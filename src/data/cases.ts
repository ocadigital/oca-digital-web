export interface CaseStudy {
  id: string;
  slug: string;
  client: string;
  segment: string;
  logo?: string;
  coverImage?: string;
  title: string;
  summary: string;
  challenge: string;
  solution: string;
  results: string;
  metrics: { label: string; value: string }[];
  testimonialQuote?: string;
  testimonialAuthor?: string;
  testimonialRole?: string;
  relatedBlogSlug?: string;
  publishedAt: string;
  featured?: boolean;
}

// PLACEHOLDER — substituir por cases reais assim que o conteúdo for definido.
export const cases: CaseStudy[] = [
  {
    id: "1",
    slug: "case-exemplo-imobiliaria",
    client: "Nome do Cliente (exemplo)",
    segment: "Imobiliária",
    title: "Como a [Cliente] aumentou X% os leads qualificados em Y meses",
    summary:
      "Resumo curto do desafio e do resultado alcançado — substituir por um case real.",
    challenge:
      "[Descreva aqui o cenário e o problema do cliente antes da OCA Digital.]",
    solution:
      "[Descreva aqui o que foi implementado: campanhas, automações, processos, etc.]",
    results:
      "[Descreva aqui os resultados alcançados, com contexto e números reais.]",
    metrics: [
      { label: "Aumento em leads", value: "+XX%" },
      { label: "Redução de CPL", value: "-XX%" },
      { label: "Tempo de implementação", value: "X meses" },
    ],
    testimonialQuote: "[Depoimento real do cliente, se disponível.]",
    testimonialAuthor: "Nome",
    testimonialRole: "Cargo, Empresa",
    publishedAt: "2026-01-01",
    featured: true,
  },
];

export const getCaseBySlug = (slug: string) =>
  cases.find((c) => c.slug === slug);

export const getCaseByRelatedBlogSlug = (blogSlug: string) =>
  cases.find((c) => c.relatedBlogSlug === blogSlug);
