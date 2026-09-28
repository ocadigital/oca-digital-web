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
    coverImage: "/images/cases/brognoli-2026-09.webp",
    title: "Brognoli: de um dos maiores cases orgânicos do YouTube no mercado imobiliário à previsibilidade comercial de hoje",
    summary:
      "Uma web série que viralizou organicamente entre universitários de Florianópolis e, anos depois, a estruturação de CRM e atendimento que trouxe previsibilidade comercial para a operação.",
    challenge:
      "Em 2019, como Head de Marketing da Brognoli, Anderson Gonçalves (hoje fundador da OCA Digital) enfrentou um desafio comum: aumentar a visibilidade da imobiliária entre universitários em busca do primeiro imóvel para alugar em Florianópolis, mas com verba limitada para mídia paga, sem inteligência artificial e sem investimento em anúncios. Mais tarde, já como cliente da OCA Digital, o desafio da Brognoli passou a ser outro: leads e atendimento espalhados em planilhas e canais desconectados, sem visibilidade real do funil comercial.",
    solution:
      "A resposta veio de um ano inteiro analisando dados de clientes para entender o público a fundo, e a análise revelou uma dualidade simples e poderosa: o estudante buscava independência, mas quem pagava o aluguel (os pais) buscava segurança. Foi esse insight que guiou a criação da web série \"Vida Independente\", com 8 episódios no YouTube respondendo às dúvidas reais de quem está se mudando para estudar em Florianópolis, roteirizada com apoio de SEMrush e Google Keyword Tool para SEO, gravada com um ator iniciante para caber no orçamento, e distribuída também em cortes para Instagram e Facebook. Já durante a parceria com a OCA Digital, o foco foi outro: centralização de leads em um único repositório, implantação de CRM personalizado e unificação de marketing, WhatsApp e cobrança em um só fluxo de atendimento.",
    results:
      "A web série teve um único vídeo com mais de 1,1 milhão de visualizações e 966 comentários, e o canal saiu de poucos seguidores para mais de 2 mil novos inscritos orgânicos em apenas 30 dias, chegando a 13 mil inscritos ao longo dos anos seguintes. O resultado foi mais visitas ao site, melhor SEO e geração consistente de leads, incluindo indicações vindas dos próprios pais dos estudantes, tudo isso sem mídia paga e sem IA, só estratégia e dados guiando a criação. Já com a OCA Digital, a Brognoli passou a contar com dashboards que orientavam toda a operação comercial, deixando de depender de planilhas para gerir seus leads.",
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
    id: "7",
    slug: "brognoli-indicasse-programa-de-indicacao",
    client: "Brognoli Negócios Imobiliários",
    segment: "Imobiliária",
    coverImage: "/images/cases/brognoli-indicasse.webp",
    title: "Indicasse: o programa de indicação que levou a Brognoli a uma média de 300 novas captações por mês",
    summary:
      "Em 2019 a Brognoli locava mais imóveis do que conseguia captar. Das entrevistas com proprietários, zeladores, porteiros e gestores de condomínio nasceu o Indicasse, um app de indicação com acompanhamento transparente e pagamento garantido a quem indica.",
    challenge:
      "Em 2019, como Head de Marketing da Brognoli, Anderson Gonçalves (hoje fundador da OCA Digital) percebeu que a quantidade de imóveis locados crescia mais rápido do que a de imóveis captados, e a carteira começava a ficar desequilibrada, com menos opções para oferecer a quem procurava. Para entender onde estavam os imóveis que não chegavam até a imobiliária, ele entrevistou proprietários e potenciais parceiros, como zeladores, porteiros e gestores de condomínio, que são os primeiros a saber quando um apartamento vai ficar vago. A dor apareceu logo: depois de indicar um imóvel, essas pessoas não tinham como acompanhar o que acontecia com a indicação, nem certeza de que receberiam alguma coisa por ela. Sem transparência, ninguém tinha motivo para indicar.",
    solution:
      "A resposta foi o Indicasse (indicasse.com.br), um aplicativo web da própria Brognoli para indicar imóveis residenciais e comerciais. Qualquer pessoa acima de 18 anos faz um cadastro rápido e pode indicar de duas formas: preenchendo o nome, o celular do proprietário e o endereço, ou compartilhando um link para o próprio proprietário preencher os dados. A partir daí, cada etapa aparece no app até o imóvel ser publicado no site da Brognoli. Na campanha de lançamento, o indicador recebia R$ 100 num cartão pré-pago sem anuidade assim que o imóvel era publicado, mais 10% do primeiro aluguel quando o imóvel residencial era locado. O lançamento foi feito em parceria com o Sindhub, com um evento presencial transmitido ao vivo, e uma campanha em mídia on e off com as chamadas \"Indicou imóvel, publicou, ganhou!\" e \"Já indicasse, mô quirido?\", no sotaque manezinho de Florianópolis. Na versão 2.0, o Indicasse passou a checar se o endereço indicado já existia no sistema da imobiliária, para evitar indicação duplicada, e a mandar cada indicação para o funil comercial no Bitrix24 separado por bairro, com restrição às regiões atendidas para não criar falsa expectativa em quem indica imóvel fora da área de atuação.",
    results:
      "Depois do mês de lançamento, a Brognoli passou a efetivar, em média, 300 novas captações de imóveis por mês vindas do programa, o que ajudou a reequilibrar a carteira entre imóveis captados e locados. Zeladores, porteiros, gestores de condomínio e os próprios clientes viraram uma rede de captação, porque passaram a ver em que pé estava cada indicação e a receber por ela. O Indicasse segue ativo até hoje.",
    metrics: [
      { label: "Novas captações por mês", value: "300 em média" },
      { label: "Lançamento", value: "2019" },
      { label: "Status do programa", value: "Ativo até hoje" },
    ],
    externalLinks: [
      {
        label: "Conhecer o Indicasse",
        url: "https://indicasse.com.br",
      },
      {
        label: "Post de lançamento no blog da Brognoli",
        url: "https://www.brognoli.com.br/blog/renda-extra-indicou-imovel-publicou-ganhou/",
      },
      {
        label: "Campanha \"Já indicasse, mô quirido?\"",
        url: "https://www.brognoli.com.br/blog/ja-indicasse-mo-quirido/",
      },
    ],
    publishedAt: "2026-09-28",
  },
  {
    id: "6",
    slug: "aldo-imoveis-lagoa-da-conceicao",
    client: "Aldo Imóveis",
    segment: "Imobiliária",
    coverImage: "/images/cases/aldo-imoveis-2026-09.webp",
    title: "Aldo Imóveis: 48 mil novos usuários após relançar o site com o OCA Base",
    summary:
      "Relançamento do site da Aldo Imóveis (Lagoa da Conceição, Florianópolis) com o OCA Base, combinado a campanhas de Google Ads segmentadas por venda e locação.",
    challenge:
      "A Aldo Imóveis, cliente de longa data e cujo site anterior também foi construído pela OCA Digital, precisava modernizar sua presença digital para acompanhar o volume de buscas por imóveis em uma das regiões mais valorizadas de Florianópolis, a Lagoa da Conceição, tanto para venda quanto para locação.",
    solution:
      "Relançamos o site em 1º de janeiro de 2026 com o OCA Base, nossa plataforma com integração aos principais portais imobiliários, com busca segmentada por finalidade (compra ou locação), bairro, tipo e faixa de preço. Em paralelo, estruturamos campanhas de Google Ads segmentadas por intenção: \"[SEARCH] Venda\" e \"[SEARCH] Aluguel\", e testamos complementarmente Meta e Instagram Ads.",
    results:
      "No período acompanhado pelo Google Analytics (agosto/2025 a agosto/2026, que inclui os últimos meses do site anterior e os primeiros 8 meses após o relançamento em janeiro), a Aldo Imóveis somou 48 mil novos usuários, com tráfego bem distribuído entre canais e 13 mil sessões vindas diretamente das campanhas de Google Ads Search. No comparativo do próprio Google Analytics com imobiliárias semelhantes, o desempenho do site ficou acima da mediana do setor. Meta e Instagram Ads tiveram resultado mais limitado por causa do orçamento reduzido destinado a esse canal, e a medição de leads/conversões diretas ainda não está implementada: pontos que já estão no radar para os próximos ciclos.",
    metrics: [
      { label: "Novos usuários no período", value: "48 mil" },
      { label: "Sessões via Google Ads (Search)", value: "13 mil" },
      { label: "Desempenho vs. setor", value: "Acima da mediana" },
    ],
    testimonialQuote:
      "Já trabalhamos com a OCA desde o site anterior, e a migração pro novo site trouxe um salto na experiência de busca pros nossos clientes. Com as campanhas de Google Ads rodando junto, conseguimos capturar tanto quem busca comprar quanto quem busca alugar na Lagoa da Conceição.",
    testimonialAuthor: "Aldo Silveira",
    testimonialRole: "Proprietário, Aldo Imóveis",
    relatedBlogSlug: "como-gerar-mais-leads-qualificados-imobiliaria-2024",
    externalLinks: [
      {
        label: "Visitar o site da Aldo Imóveis",
        url: "https://aldoimoveis.com.br",
      },
    ],
    publishedAt: "2026-09-07",
  },
  {
    id: "4",
    slug: "santa-ilha-sunclub-campeche",
    client: "Santa Ilha Imobiliária",
    segment: "Lançamento Imobiliário",
    coverImage: "/images/cases/santa-ilha-sunclub-2026-09.webp",
    title: "SUNCLUB Campeche: 173 leads em 5 semanas de pré-lançamento com CPL de R$43,44",
    summary:
      "Campanha completa de pré-lançamento do SUNCLUB Campeche Beach Residence para a Santa Ilha Imobiliária: hotsite, mídia paga, e-mail marketing e imprensa, do zero até 173 leads captados. A Santa Ilha terminou como a segunda imobiliária que mais vendeu unidades do empreendimento.",
    challenge:
      "A Santa Ilha Imobiliária precisava estruturar, praticamente do zero e em pouco mais de 5 semanas, toda a operação digital de pré-lançamento do SUNCLUB Campeche Beach Residence, desde a presença online até a geração de leads qualificados, com um orçamento de mídia enxuto.",
    solution:
      "Construímos o funil completo: criação do hotsite, configuração de domínio, hospedagem, e-mail e Google Analytics; produção de 30 dias de conteúdo para Facebook e Instagram; edição e publicação de vídeos do empreendimento no canal da Santa Ilha; disparo de e-mail marketing para a base própria da OCA Digital; e articulação de uma matéria de imprensa no portal DuCampeche, além de um post no blog da própria Santa Ilha. Em paralelo, rodamos mídia paga em Google Ads (Search e YouTube), Facebook/Instagram Ads (tráfego e geração direta de leads) e uma campanha de remarketing.",
    results:
      "A campanha impactou aproximadamente 106 mil pessoas e levou 7.167 visitantes únicos ao hotsite. O vídeo da trilha sonora do empreendimento sozinho somou 7.626 visualizações no YouTube. Ao todo, foram captados 173 leads (136 via formulário na landing page, 31 via Lead Ads no Facebook/Instagram e 6 por resposta direta ao e-mail), com um investimento total de R$7.514,32 (R$5.000 de honorários da OCA Digital + R$2.514,32 em mídia), um custo geral por lead de R$43,44. Nas vendas, a Santa Ilha foi a segunda imobiliária que mais vendeu imóveis do SUNCLUB Campeche.",
    metrics: [
      { label: "Leads captados", value: "173" },
      { label: "Custo por lead (CPL)", value: "R$43,44" },
      { label: "Ranking de vendas no empreendimento", value: "2º lugar" },
    ],
    relatedBlogSlug: "como-gerar-mais-leads-qualificados-imobiliaria-2024",
    publishedAt: "2026-01-01",
    featured: true,
  },
  {
    id: "5",
    slug: "vokkan-vivaon-vivapark",
    client: "Vokkan Construtora",
    segment: "Incorporadora",
    coverImage: "/images/cases/vokkan-vivapark-2026-09.webp",
    title: "Vokkan: a plataforma completa da VivaOn, a imobiliária in-house do Vivapark, em 60 dias",
    summary:
      "Design, desenvolvimento full-stack e CMS sob medida para posicionar a VivaOn, time in-house do Vivapark, como uma imobiliária completa, com captação de leads integrada ao CRM e gestão de múltiplos empreendimentos.",
    challenge:
      "A Vokkan precisava posicionar a VivaOn, seu time de corretores in-house, no mesmo nível de uma imobiliária completa, com uma plataforma capaz de apresentar os empreendimentos do Vivapark (Vista, Vértice, Voz e Ventura) com preços, plantas e disponibilidade, captar leads qualificados e direcionar cada visitante para falar com um especialista. Tudo isso sem nenhuma presença digital própria anterior para servir de base ou comparação.",
    solution:
      "Desenvolvemos a plataforma do zero, com arquitetura Next.js no front-end e Django (Python) + PostgreSQL no back-end, hospedados em Vercel, Render e Cloudflare R2. O CMS sob medida permite à própria Vokkan editar conteúdo, cadastrar novos empreendimentos, gerenciar corretores parceiros e controlar permissões de usuário, sem depender de terceiros para cada atualização. O design, aprovado em Figma antes do desenvolvimento, segue uma estrutura pensada para conversão: vídeo institucional com CTA já nos primeiros segundos, apresentação de cada empreendimento, um espaço dedicado à equipe de especialistas para humanizar o atendimento e um Q&A para quebra de objeções. A captação de leads foi integrada diretamente ao CRM da operação comercial, com boas práticas de SEO e rastreamento de conversão desde o primeiro dia.",
    results:
      "A plataforma entrou no ar em imoveisnovivapark.com.br após 60 dias de desenvolvimento, partindo do zero, já que não existia presença digital própria da VivaOn antes. Por substituir uma ausência total, ainda não há comparativos históricos de performance, mas toda a estrutura foi construída para medir SEO, conversão e leads desde o lançamento. A parceria segue ativa: a OCA Digital é responsável pela manutenção mensal contínua (monitoramento de uptime, segurança, performance e relatórios), e as duas empresas já avaliam a viabilidade de novos projetos juntas.",
    metrics: [
      { label: "Prazo de desenvolvimento", value: "60 dias" },
      { label: "Empreendimentos na plataforma", value: "4" },
      { label: "Status da parceria", value: "Cliente ativo" },
    ],
    relatedBlogSlug: "guia-completo-crm-imobiliario-organizar-leads",
    externalLinks: [
      {
        label: "Ver o novo site do Vivapark",
        url: "https://imoveisnovivapark.com.br",
      },
    ],
    publishedAt: "2026-09-07",
  },
  {
    id: "2",
    slug: "maria-do-mar-hotel",
    client: "Maria do Mar Hotel",
    segment: "Hotelaria",
    otherSegment: true,
    coverImage: "/images/cases/maria-do-mar-hotel.webp",
    title: "Maria do Mar Hotel: a mascote Maricota e o evento Sunset Wedding que viraram notícia",
    summary:
      "Como um hotel tradicional de Florianópolis rejuvenesceu sua marca com uma mascote local e conquistou mídia espontânea com um evento voltado ao mercado de casamentos.",
    challenge:
      "O Maria do Mar Hotel, com uma imagem tradicional consolidada em Florianópolis, precisava se comunicar com um público mais jovem e também dar visibilidade à reforma de seus espaços de eventos, com o objetivo final de aumentar o número de casamentos realizados no hotel.",
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
    coverImage: "/images/cases/pousada-dos-sonhos.webp",
    title: "Pousada dos Sonhos: +403% em acessos orgânicos com uma ação off-line de link building",
    summary:
      "Uma ação off-line com blogueiras, pensada para gerar link building, resultou em um salto expressivo no tráfego orgânico e no ranqueamento das palavras-chave prioritárias do cliente.",
    challenge:
      "A Pousada dos Sonhos precisava aumentar sua visibilidade orgânica nos mecanismos de busca e ranquear melhor para suas palavras-chave prioritárias, além de estruturar o controle de leads e conversões vindos do site.",
    solution:
      "Desenvolvemos uma estratégia off-line pensada para gerar link building: a \"Festa do Pijama\", experiência reunindo quatro blogueiras na pousada, com cobertura em blog próprio. Também criamos uma landing page dedicada à venda do pacote de Réveillon e implementamos controle de leads e conversões.",
    results:
      "A ação gerou um aumento de 403% nos acessos vindos de busca orgânica em relação ao mesmo período do ano anterior, o tipo de acesso que mais converte. A pousada também saltou 4.143.167 posições no ranking Alexa e passou a ocupar as primeiras posições do Google para suas principais palavras-chave prioritárias.",
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
