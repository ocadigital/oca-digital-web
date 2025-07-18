
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  date: string;
  author: string;
  category: string;
  tags: string[];
  readTime: string;
  featured: boolean;
}

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "Como Gerar Mais Leads Qualificados para sua Imobiliária em 2024",
    slug: "como-gerar-mais-leads-qualificados-imobiliaria-2024",
    excerpt: "Descubra as estratégias mais eficazes para atrair clientes que realmente querem comprar ou vender imóveis. Aprenda sobre SEO, campanhas pagas e automação de marketing.",
    content: `
      <h2>Introdução</h2>
      <p>O mercado imobiliário em 2024 apresenta novos desafios e oportunidades para profissionais que buscam gerar leads qualificados. Com a evolução das tecnologias digitais e mudanças no comportamento do consumidor, é essencial adaptar suas estratégias de marketing.</p>

      <h2>1. SEO para Imobiliárias</h2>
      <p>O Search Engine Optimization (SEO) é fundamental para aumentar a visibilidade online da sua imobiliária. Algumas estratégias importantes incluem:</p>
      <ul>
        <li>Otimização de palavras-chave locais</li>
        <li>Criação de conteúdo relevante sobre o mercado imobiliário</li>
        <li>Otimização de fichas de imóveis</li>
        <li>Melhoria da velocidade do site</li>
      </ul>

      <h2>2. Campanhas de Mídia Paga</h2>
      <p>As campanhas pagas no Google Ads e redes sociais são essenciais para resultados rápidos:</p>
      <ul>
        <li>Google Ads para pesquisas de imóveis</li>
        <li>Facebook e Instagram Ads com segmentação precisa</li>
        <li>Remarketing para visitantes do site</li>
        <li>Campanhas de vídeo no YouTube</li>
      </ul>

      <h2>3. Automação de Marketing</h2>
      <p>A automação permite nutrir leads de forma escalável:</p>
      <ul>
        <li>E-mail marketing personalizado</li>
        <li>Chatbots para atendimento inicial</li>
        <li>Lead scoring para priorização</li>
        <li>Cadências automáticas de follow-up</li>
      </ul>

      <h2>Conclusão</h2>
      <p>Implementar essas estratégias de forma integrada é a chave para gerar mais leads qualificados em 2024. A combinação de SEO, mídia paga e automação cria um funil de vendas robusto e eficiente.</p>
    `,
    image: "/lovable-uploads/26b5f8ef-bdb2-46e5-95ca-bce53bcf3dca.png",
    date: "2024-01-15",
    author: "Anderson Santos",
    category: "Marketing Digital",
    tags: ["leads", "seo", "google-ads", "automacao"],
    readTime: "8 min",
    featured: true
  },
  {
    id: "2",
    title: "O Guia Completo do CRM Imobiliário: Como Organizar seus Leads",
    slug: "guia-completo-crm-imobiliario-organizar-leads",
    excerpt: "Entenda como implementar um sistema de CRM eficiente que vai revolucionar seu atendimento e aumentar suas vendas. Dicas práticas e ferramentas recomendadas.",
    content: `
      <h2>Por que um CRM é essencial?</h2>
      <p>Um Customer Relationship Management (CRM) bem implementado é a diferença entre uma imobiliária que cresce de forma organizada e uma que perde oportunidades diariamente.</p>

      <h2>1. Escolhendo o CRM Ideal</h2>
      <p>Fatores importantes na escolha:</p>
      <ul>
        <li>Facilidade de uso para a equipe</li>
        <li>Integração com outras ferramentas</li>
        <li>Custo-benefício</li>
        <li>Suporte técnico disponível</li>
      </ul>

      <h2>2. Configuração Inicial</h2>
      <p>Passos essenciais para configurar seu CRM:</p>
      <ul>
        <li>Definição do funil de vendas</li>
        <li>Criação de campos customizados</li>
        <li>Automações básicas</li>
        <li>Integração com site e landing pages</li>
      </ul>

      <h2>3. Gestão de Leads</h2>
      <p>Como organizar e qualificar seus leads:</p>
      <ul>
        <li>Critérios de qualificação BANT</li>
        <li>Segmentação por interesse</li>
        <li>Atribuição de responsáveis</li>
        <li>Acompanhamento de histórico</li>
      </ul>

      <h2>4. Métricas Importantes</h2>
      <p>KPIs que você deve acompanhar:</p>
      <ul>
        <li>Taxa de conversão por estágio</li>
        <li>Tempo médio de conversão</li>
        <li>Custo por lead</li>
        <li>Lifetime Value do cliente</li>
      </ul>

      <h2>Conclusão</h2>
      <p>Um CRM bem estruturado é o coração de uma operação imobiliária eficiente. Invista tempo na configuração inicial e colha os frutos de uma gestão de leads organizada.</p>
    `,
    image: "/lovable-uploads/59b9e7e2-b0cd-4eba-9ab0-4502658f48db.png",
    date: "2024-01-08",
    author: "Maria Silva",
    category: "Gestão de Leads",
    tags: ["crm", "gestao", "leads", "organizacao"],
    readTime: "12 min",
    featured: true
  }
];

export const categories = [
  "Marketing Digital",
  "Gestão de Leads", 
  "Automação",
  "Vendas",
  "Mercado Imobiliário"
];

export const tags = [
  "leads", "seo", "google-ads", "automacao", "crm", "gestao", 
  "organizacao", "vendas", "marketing", "imobiliario"
];
