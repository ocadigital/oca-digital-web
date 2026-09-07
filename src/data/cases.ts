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
  externalLinks?: { label: string; url: string }[];
  publishedAt: string;
  featured?: boolean;
  /** true = fora do foco imobiliário atual (ex: hotelaria); exibido em seção separada */
  otherSegment?: boolean;
}

export const cases: CaseStudy[] = [
  {
    id: "1",
    slug: "brognoli-negocios-imobiliarios",
    client: "Brognoli Negócios Imobiliários",
    segment: "Imobiliária",
    coverImage: "/images/cases/brognoli.jpeg",
    title: "Brognoli: de um dos maiores cases orgânicos do YouTube no mercado imobiliário à previsibilidade comercial de hoje",
    summary:
      "Uma web série que viralizou organicamente entre universitários de Florianópolis e, anos depois, a estruturação de CRM e atendimento que trouxe previsibilidade comercial para a operação.",
    challenge:
      "Em 2019, como Head de Marketing da Brognoli, Anderson Gonçalves (hoje fundador da OCA Digital) enfrentou um desafio comum: aumentar a visibilidade da imobiliária entre universitários em busca do primeiro imóvel para alugar em Florianópolis, mas com verba limitada para mídia paga — sem inteligência artificial e sem investimento em anúncios. Mais tarde, já como cliente da OCA Digital, o desafio da Brognoli passou a ser outro: leads e atendimento espalhados em planilhas e canais desconectados, sem visibilidade real do funil comercial.",
    solution:
      "A resposta veio de um ano inteiro analisando dados de clientes para entender o público a fundo — e a análise revelou uma dualidade simples e poderosa: o estudante buscava independência, mas quem pagava o aluguel (os pais) buscava segurança. Foi esse insight que guiou a criação da web série \"Vida Independente\", com 8 episódios no YouTube respondendo às dúvidas reais de quem está se mudando para estudar em Florianópolis — roteirizada com apoio de SEMrush e Google Keyword Tool para SEO, gravada com um ator iniciante para caber no orçamento, e distribuída também em cortes para Instagram e Facebook. Já durante a parceria com a OCA Digital, o foco foi outro: centralização de leads em um único repositório, implantação de CRM personalizado e unificação de marketing, WhatsApp e cobrança em um só fluxo de atendimento.",
    results:
      "A web série teve um único vídeo com mais de 1,1 milhão de visualizações e 966 comentários, e o canal saiu de poucos seguidores para mais de 2 mil novos inscritos orgânicos em apenas 30 dias — chegando a 13 mil inscritos ao longo dos anos seguintes. O resultado foi mais visitas ao site, melhor SEO e geração consistente de leads, incluindo indicações vindas dos próprios pais dos estudantes — tudo isso sem mídia paga e sem IA, só estratégia e dados guiando a criação. Já com a OCA Digital, a Brognoli passou a contar com dashboards que orientavam toda a operação comercial, deixando de depender de planilhas para gerir seus leads.",
    metrics: [
      { label: "Visualizações em 1 vídeo", value: "+1,1 milhão" },
      { label: "Novos inscritos em 30 dias", value: "+2 mil" },
      { label: "Inscritos conquistados (orgânico)", value: "13 mil" },
    ],
    testimonialQuote:
      "A OCA estruturou nossa captação e nosso atendimento. Hoje temos previsibilidade comercial e dashboards que orientam toda a operação.",
    testimonialAuthor: "Diretoria Comercial",
    testimonialRole: "Brognoli Negócios Imobiliários",
    relatedBlogSlug: "guia-completo-crm-imobiliario-organizar-leads",
    externalLinks: [
      {
        label: "Assista ao episódio no YouTube",
        url: "https://www.youtube.com/watch?v=jT-IfDTBoqg&list=PLTufKudJrYkZSJDienlxHJ6NyjwgWsCsh&index=1",
      },
      {
        label: "Ver publicação original no LinkedIn",
        url: "https://www.linkedin.com/posts/andersongoncalves_how-i-built-brazils-biggest-real-estate-activity-7364831945597300736-pa1P",
      },
    ],
    publishedAt: "2026-01-01",
    featured: true,
  },
  {
    id: "2",
    slug: "maria-do-mar-hotel",
    client: "Maria do Mar Hotel",
    segment: "Hotelaria",
    otherSegment: true,
    coverImage: "/images/cases/maria-do-mar-hotel.jpeg",
    title: "Maria do Mar Hotel: a mascote Maricota e o evento Sunset Wedding que viraram notícia",
    summary:
      "Como um hotel tradicional de Florianópolis rejuvenesceu sua marca com uma mascote local e conquistou mídia espontânea com um evento voltado ao mercado de casamentos.",
    challenge:
      "O Maria do Mar Hotel, com uma imagem tradicional consolidada em Florianópolis, precisava se comunicar com um público mais jovem e também dar visibilidade à reforma de seus espaços de eventos — com o objetivo final de aumentar o número de casamentos realizados no hotel.",
    solution:
      "A estratégia teve duas frentes. A primeira foi a criação da Maricota, mascote inspirada na gaivota (ave típica da orla de Florianópolis) e no sotaque \"manezinho\" local, presente em campanhas de e-mail marketing, peças publicitárias e redes sociais, respondendo dúvidas e dando dicas de viagem com humor e identidade local. A segunda foi o evento Sunset Wedding: reunimos cerimonialistas e fornecedores de altíssimo nível (incluindo a renomada Vera Simão, responsável pela recepção do Papa no Brasil) para uma experiência completa na piscina do hotel, com vista para o pôr do sol, degustação, apresentação do novo salão de eventos (capacidade de 50 a 800 pessoas) e jazz ao vivo.",
    results:
      "A campanha da Maricota foi destaque no Diário Catarinense e rendeu ao hotel a extensão da parceria para a criação de um novo site e o planejamento de marketing anual seguinte. O Sunset Wedding, realizado em março de 2015, gerou prospecções de casamentos já no mesmo mês, além de cobertura espontânea em múltiplos veículos (Diário Catarinense, ClicRBS, CaseBem, ND+), novos seguidores e avaliações positivas na fanpage do hotel.",
    metrics: [
      { label: "Menções espontâneas na mídia", value: "5+" },
      { label: "Capacidade do novo salão", value: "até 800 pessoas" },
      { label: "Resultado direto", value: "Parceria estendida" },
    ],
    publishedAt: "2026-01-01",
  },
  {
    id: "3",
    slug: "pousada-dos-sonhos",
    client: "Pousada dos Sonhos",
    segment: "Hotelaria",
    otherSegment: true,
    coverImage: "/images/cases/pousada-dos-sonhos.jpeg",
    title: "Pousada dos Sonhos: +403% em acessos orgânicos com uma ação off-line de link building",
    summary:
      "Uma ação off-line com blogueiras, pensada para gerar link building, resultou em um salto expressivo no tráfego orgânico e no ranqueamento das palavras-chave prioritárias do cliente.",
    challenge:
      "A Pousada dos Sonhos precisava aumentar sua visibilidade orgânica nos mecanismos de busca e ranquear melhor para suas palavras-chave prioritárias, além de estruturar o controle de leads e conversões vindos do site.",
    solution:
      "Desenvolvemos uma estratégia off-line pensada para gerar link building: a \"Festa do Pijama\", experiência reunindo quatro blogueiras na pousada, com cobertura em blog próprio. Também criamos uma landing page dedicada à venda do pacote de Réveillon e implementamos controle de leads e conversões.",
    results:
      "A ação gerou um aumento de 403% nos acessos vindos de busca orgânica em relação ao mesmo período do ano anterior — o tipo de acesso que mais converte. A pousada também saltou 4.143.167 posições no ranking Alexa e passou a ocupar as primeiras posições do Google para suas principais palavras-chave prioritárias.",
    metrics: [
      { label: "Aumento em acessos orgânicos", value: "+403%" },
      { label: "Salto no ranking Alexa", value: "+4,1 milhões de posições" },
      { label: "Palavras-chave prioritárias", value: "1ª posição no Google" },
    ],
    publishedAt: "2026-01-01",
  },
];

export const getCaseBySlug = (slug: string) =>
  cases.find((c) => c.slug === slug);

export const getCaseByRelatedBlogSlug = (blogSlug: string) =>
  cases.find((c) => c.relatedBlogSlug === blogSlug);
