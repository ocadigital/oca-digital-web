// Páginas de serviço em /servicos/:slug. Este arquivo é a fonte única: a página React,
// o middleware (HTML inicial, schema) e o sitemap leem daqui.
// Regras de texto: pt-BR, "nós", sem travessão, sem número que não esteja nos cases.

export interface ServicoPagina {
  slug: string;
  /** valor enviado no formulário do modal (mesmo do card da home) */
  valor: string;
  nome: string;
  seoTitle: string;
  seoDescription: string;
  h1: string;
  intro: string;
  paraQuem: string[];
  problema: { titulo: string; texto: string };
  comoFunciona: { etapa: string; texto: string }[];
  entregas: string[];
  prazo: string;
  preco: string;
  precoNota: string;
  ctaLabel: string;
  faq: { pergunta: string; resposta: string }[];
  cases: string[];
  relacionados: string[];
  /** página-pilar: lista todos os serviços em vez de preço único */
  pilar?: boolean;
}

export const servicos: ServicoPagina[] = [
  {
    slug: 'marketing-imobiliario',
    valor: 'outros',
    nome: 'Marketing Imobiliário',
    seoTitle: 'Marketing Imobiliário: do Anúncio à Visita Agendada | OCA Digital',
    seoDescription:
      'Como a OCA Digital faz marketing imobiliário para imobiliárias e incorporadoras: site, anúncios, CRM, processos e automação trabalhando juntos, com número em cada etapa.',
    h1: 'Marketing imobiliário do anúncio à visita agendada',
    intro:
      'Marketing imobiliário não termina quando o lead chega. Nós cuidamos do caminho inteiro: o anúncio que traz o contato, o site que convence, o CRM que registra, o atendimento que responde rápido e a automação que não deixa ninguém esquecido, tudo medido para você saber o que vira visita e o que vira venda.',
    paraQuem: [
      'Imobiliárias de venda e de locação que querem mais leads sem perder os que já chegam',
      'Incorporadoras e construtoras que vão lançar ou estão vendendo um empreendimento',
      'Corretores autônomos que querem sair da dependência dos portais',
      'Gestores que sentem que investem em marketing mas não sabem o que dá retorno',
    ],
    problema: {
      titulo: 'Onde o marketing imobiliário costuma travar',
      texto:
        'O problema raramente é falta de lead. O lead chega pelo portal, pelo Instagram ou pelo site, cai num WhatsApp qualquer, espera horas por uma resposta e esfria. Ninguém sabe dizer qual canal trouxe a venda do mês, então o orçamento do próximo mês é decidido no achismo. Por isso nós olhamos para captação, organização e automação ao mesmo tempo, que é de onde vem o nome OCA.',
    },
    comoFunciona: [
      { etapa: 'Organização', texto: 'Processo comercial combinado com o time, CRM configurado e origem de cada lead registrada, para todo contato ter dono e próximo passo.' },
      { etapa: 'Captação', texto: 'Site, landing pages e anúncios no Google, na Meta e nas respostas de IA, falando com quem está procurando imóvel agora.' },
      { etapa: 'Automação', texto: 'Resposta automática, distribuição dos leads, nota de qualificação e lembretes, para o corretor gastar tempo com quem está perto de comprar.' },
      { etapa: 'Medição', texto: 'Painel com leads, visitas, propostas e vendas por canal, para cada real investido ter um resultado à vista.' },
    ],
    entregas: [
      'Diagnóstico da operação atual, do anúncio até a venda',
      'Plano com o que resolver primeiro e quanto investir em cada canal',
      'Execução dos serviços contratados, com a mesma equipe olhando o funil inteiro',
      'Reunião mensal com os números de cada etapa',
    ],
    prazo: 'Depende dos serviços escolhidos',
    preco: 'Conforme os serviços',
    precoNota: 'Você pode contratar um serviço só ou combinar vários. Veja o investimento de cada um nas páginas abaixo.',
    ctaLabel: 'Quero um diagnóstico',
    faq: [
      {
        pergunta: 'O que é marketing imobiliário?',
        resposta:
          'É o conjunto de ações para atrair, atender e converter pessoas que querem comprar, vender ou alugar imóveis. Na prática envolve site, anúncios, conteúdo, portais, CRM e o processo de atendimento do time comercial.',
      },
      {
        pergunta: 'Por onde começar se eu tenho pouco orçamento?',
        resposta:
          'Normalmente pelo que faz o lead que já chega não se perder: CRM e uma rotina de atendimento. Não adianta comprar mais leads se metade fica sem resposta. O teste de maturidade do site ajuda a ver em que ponto a sua imobiliária está.',
      },
      {
        pergunta: 'Vocês atendem fora de Florianópolis?',
        resposta: 'Sim. A sede é em Florianópolis, mas atendemos o Brasil todo, com reuniões online.',
      },
      {
        pergunta: 'Preciso contratar tudo de uma vez?',
        resposta: 'Não. Cada serviço pode ser contratado sozinho. O que muda é que, olhando o funil inteiro, conseguimos dizer onde o seu dinheiro rende mais.',
      },
    ],
    cases: ['brognoli-negocios-imobiliarios', 'santa-ilha-sunclub-campeche', 'aldo-imoveis-lagoa-da-conceicao', 'vokkan-vivaon-vivapark'],
    relacionados: [
      'sites-para-imobiliarias',
      'landing-pages-imobiliarias',
      'anuncios-imobiliarios',
      'crm-imobiliario',
      'consultoria-processos-comerciais',
      'automacao-n8n-imobiliarias',
      'marketing-para-lancamentos-imobiliarios',
      'planejamento-de-marketing-imobiliario',
    ],
    pilar: true,
  },
  {
    slug: 'sites-para-imobiliarias',
    valor: 'web-sites',
    nome: 'Sites para Imobiliárias',
    seoTitle: 'Site para Imobiliária e Incorporadora | OCA Digital',
    seoDescription:
      'Site para imobiliária, incorporadora ou empreendimento, feito para aparecer no Google e transformar visita em contato, com formulários e WhatsApp caindo no CRM. A partir de R$ 7.000.',
    h1: 'Site para imobiliária feito para ser encontrado e gerar contato',
    intro:
      'Um site imobiliário bonito que ninguém encontra não ajuda o comercial. Nós fazemos o site pensando primeiro em quem procura imóvel no Google e no celular, e ligamos cada formulário e cada botão de WhatsApp ao CRM, para você saber de onde veio cada contato.',
    paraQuem: [
      'Imobiliárias com site antigo, lento ou que não aparece no Google',
      'Incorporadoras que precisam de um site institucional com todos os empreendimentos',
      'Empreendimentos que pedem uma página própria, além da landing page de campanha',
      'Quem quer depender menos dos portais e ter tráfego próprio',
    ],
    problema: {
      titulo: 'Por que muitos sites imobiliários não geram contato',
      texto:
        'O site carrega devagar no celular, as páginas não foram pensadas para o Google e o formulário manda um e-mail que ninguém olha. O visitante desiste antes de falar com alguém e você não fica sabendo. Nós resolvemos as três coisas juntas: velocidade, estrutura para busca e contato registrado.',
    },
    comoFunciona: [
      { etapa: 'Briefing e estrutura', texto: 'Entendemos o público, os imóveis e os concorrentes, e definimos as páginas e as palavras que o seu cliente usa na busca.' },
      { etapa: 'Layout e textos', texto: 'Desenhamos primeiro para o celular e escrevemos os textos de cada página com chamadas claras para contato.' },
      { etapa: 'Desenvolvimento', texto: 'Site rápido, com SEO técnico, blog, formulários e WhatsApp integrados ao CRM e às ferramentas de medição.' },
      { etapa: 'Publicação e ajustes', texto: 'Colocamos no ar, enviamos ao Google e acompanhamos os primeiros meses para ajustar o que for preciso.' },
    ],
    entregas: [
      'Site institucional, portfólio de imóveis ou página de empreendimento',
      'Versão pensada primeiro para o celular',
      'Estrutura de SEO: títulos, descrições, dados estruturados e sitemap',
      'Formulários e WhatsApp caindo direto no CRM',
      'GA4, pixel da Meta e origem de cada contato configurados',
      'Blog para atrair visitas do Google sem pagar anúncio',
    ],
    prazo: '2 meses',
    preco: 'A partir de R$ 7.000',
    precoNota: 'Pagamento único. A busca orgânica costuma crescer a partir do 3º mês, que é o tempo que o Google leva para posicionar as páginas.',
    ctaLabel: 'Quero um site',
    faq: [
      {
        pergunta: 'O site vem integrado com o meu CRM?',
        resposta: 'Sim. Formulários e botões de WhatsApp levam o contato para o CRM com a origem registrada. Se você ainda não tem CRM, também implantamos.',
      },
      {
        pergunta: 'Consigo atualizar os imóveis sozinho?',
        resposta: 'Sim. Você recebe acesso para editar páginas, imóveis e posts do blog, e mostramos como fazer.',
      },
      {
        pergunta: 'Em quanto tempo o site aparece no Google?',
        resposta: 'As páginas são enviadas ao Google na publicação. O crescimento da busca orgânica costuma aparecer a partir do 3º mês.',
      },
      {
        pergunta: 'Vocês fazem só a landing page de um empreendimento?',
        resposta: 'Sim, esse é o serviço de Landing Pages, mais rápido e focado em uma campanha.',
      },
    ],
    cases: ['aldo-imoveis-lagoa-da-conceicao', 'vokkan-vivaon-vivapark'],
    relacionados: ['landing-pages-imobiliarias', 'anuncios-imobiliarios', 'crm-imobiliario'],
  },
  {
    slug: 'landing-pages-imobiliarias',
    valor: 'landing-page',
    nome: 'Landing Pages Imobiliárias',
    seoTitle: 'Landing Page para Lançamento e Empreendimento | OCA Digital',
    seoDescription:
      'Landing page de captação para lançamento, empreendimento ou campanha imobiliária, com formulário e WhatsApp no CRM e conversões configuradas. Até 3 semanas, a partir de R$ 2.000.',
    h1: 'Landing page imobiliária para transformar clique em contato',
    intro:
      'Quando o anúncio leva para a home do site, o visitante se perde. A landing page fala de um empreendimento ou de uma campanha só, responde as dúvidas que importam e pede o contato. Nós entregamos a página pronta para receber o tráfego e medir cada lead.',
    paraQuem: [
      'Incorporadoras com lançamento ou pré-lançamento chegando',
      'Imobiliárias que vão anunciar um empreendimento ou um bairro específico',
      'Campanhas de captação de imóveis com proprietários',
      'Quem já anuncia e acha que o custo por lead está alto',
    ],
    problema: {
      titulo: 'Por que o anúncio gera clique e não gera lead',
      texto:
        'A página demora a abrir, tem informação demais ou de menos, e o formulário pede dados que a pessoa ainda não quer dar. O clique foi pago e o contato não veio. Uma página focada, rápida e com a chamada certa muda o custo de cada lead.',
    },
    comoFunciona: [
      { etapa: 'Oferta e público', texto: 'Definimos para quem é a página, qual é a promessa e quais dúvidas ela precisa responder.' },
      { etapa: 'Texto e layout', texto: 'Escrevemos e desenhamos a página com foco em um único próximo passo: falar com a sua equipe.' },
      { etapa: 'Integração e medição', texto: 'Formulário e WhatsApp no CRM, pixel da Meta, GA4 e conversões configurados antes de ligar o anúncio.' },
      { etapa: 'Testes', texto: 'Versões de título e chamada para descobrir o que converte mais com o tráfego real.' },
    ],
    entregas: [
      'Uma página focada em um empreendimento ou numa campanha',
      'Textos e layout pensados para gerar contato',
      'Formulário e WhatsApp caindo direto no CRM',
      'Pixel da Meta, GA4 e conversões configurados',
      'Página rápida e feita primeiro para o celular',
      'Versões de título e chamada para teste',
    ],
    prazo: 'Até 3 semanas',
    preco: 'A partir de R$ 2.000',
    precoNota: 'Pagamento único.',
    ctaLabel: 'Quero uma landing page',
    faq: [
      {
        pergunta: 'Qual a diferença entre landing page e site?',
        resposta: 'O site apresenta a empresa e todos os imóveis. A landing page tem um objetivo só, normalmente captar contatos de um empreendimento ou de uma campanha, e por isso converte melhor com anúncio.',
      },
      {
        pergunta: 'Vocês também fazem os anúncios?',
        resposta: 'Sim. A landing page pode vir junto com a gestão de anúncios no Google e na Meta.',
      },
      {
        pergunta: 'A página fica no meu domínio?',
        resposta: 'Sim. Publicamos no seu domínio ou num subdomínio, como lancamento.suaimobiliaria.com.br.',
      },
    ],
    cases: ['santa-ilha-sunclub-campeche'],
    relacionados: ['anuncios-imobiliarios', 'marketing-para-lancamentos-imobiliarios', 'crm-imobiliario'],
  },
  {
    slug: 'anuncios-imobiliarios',
    valor: 'google-meta-gpt-ads',
    nome: 'Anúncios no Google, Meta e IA',
    seoTitle: 'Anúncios para Imobiliárias no Google, Meta e IA | OCA Digital',
    seoDescription:
      'Gestão de anúncios para imobiliárias e incorporadoras no Google, Facebook, Instagram e nas respostas de IA (GPT Ads), com custo por lead e por venda acompanhado. A partir de R$ 1.500/mês.',
    h1: 'Anúncios imobiliários no Google, na Meta e nas respostas de IA',
    intro:
      'Nós anunciamos para quem está procurando imóvel agora: no Google, no Facebook, no Instagram e dentro das respostas de IA. E acompanhamos o que acontece depois do clique, porque lead barato que nunca vira visita não é resultado.',
    paraQuem: [
      'Imobiliárias que dependem só dos portais e querem leads próprios',
      'Incorporadoras em lançamento ou com estoque para vender',
      'Quem já anuncia mas não sabe quanto custa cada venda',
      'Captação de imóveis com proprietários da região',
    ],
    problema: {
      titulo: 'Onde o investimento em anúncio se perde',
      texto:
        'Campanha aberta demais, público errado, página fraca e nenhuma ligação com o CRM. O relatório mostra cliques e alcance, mas ninguém consegue dizer quantas visitas e vendas vieram dali. Nós ligamos o anúncio ao funil para otimizar pelo que importa.',
    },
    comoFunciona: [
      { etapa: 'Setup', texto: 'Contas, pixel, conversões e ligação com o CRM configurados, para medir do clique até a venda.' },
      { etapa: 'Campanhas', texto: 'Busca no Google para quem já procura, Meta para gerar demanda, remarketing para quem visitou e GPT Ads nas respostas de IA.' },
      { etapa: 'Testes', texto: 'Públicos e criativos diferentes rodando ao mesmo tempo até achar o que funciona para cada imóvel.' },
      { etapa: 'Otimização mensal', texto: 'Verba movida para o que traz visita e venda, com relatório e reunião todo mês.' },
    ],
    entregas: [
      'Anúncios no Google para quem já está buscando imóvel',
      'Remarketing para quem visitou o seu site',
      'Campanhas no Facebook e no Instagram',
      'GPT Ads, anúncios dentro das respostas de IA',
      'Testes de público e de criativo',
      'Custo de cada contato e de cada venda acompanhado',
    ],
    prazo: 'Mensal',
    preco: 'A partir de R$ 1.500/mês',
    precoNota: '+ R$ 1.000 de setup. A verba dos anúncios é paga direto ao Google e à Meta, à parte. Os primeiros leads costumam chegar na primeira semana e o custo por lead cai até o 3º mês.',
    ctaLabel: 'Quero anunciar',
    faq: [
      {
        pergunta: 'Quanto preciso investir em verba de anúncio?',
        resposta: 'Depende da região, do tipo de imóvel e do objetivo. No diagnóstico indicamos uma verba inicial e ajustamos conforme os resultados dos primeiros meses.',
      },
      {
        pergunta: 'O que é GPT Ads?',
        resposta: 'São anúncios que aparecem dentro das respostas de assistentes de IA, quando alguém pergunta, por exemplo, sobre imóveis num bairro. É um canal novo e ainda pouco disputado.',
      },
      {
        pergunta: 'Tem fidelidade?',
        resposta: 'Não. O contrato mensal pode ser cancelado com 30 dias de aviso.',
      },
      {
        pergunta: 'Vocês fazem os criativos?',
        resposta: 'Sim. Fazemos as peças e os textos dos anúncios a partir das fotos e vídeos dos imóveis.',
      },
    ],
    cases: ['santa-ilha-sunclub-campeche', 'aldo-imoveis-lagoa-da-conceicao'],
    relacionados: ['landing-pages-imobiliarias', 'crm-imobiliario', 'marketing-para-lancamentos-imobiliarios'],
  },
  {
    slug: 'planejamento-de-marketing-imobiliario',
    valor: 'planejamento-marketing',
    nome: 'Planejamento de Marketing',
    seoTitle: 'Planejamento de Marketing para Imobiliárias | OCA Digital',
    seoDescription:
      'Plano anual de marketing para imobiliária, com diagnóstico, metas mensais, calendário de 12 meses, orçamento de mídia e rotina para o time interno executar. 1 mês, R$ 3.000.',
    h1: 'Planejamento de marketing imobiliário para o seu time executar',
    intro:
      'Muitas imobiliárias têm alguém cuidando do marketing, mas sem um plano essa pessoa vive apagando incêndio. Nós montamos o plano de 12 meses com metas, ações, orçamento e rotina, num formato que um profissional interno, mesmo com menos experiência, consegue seguir.',
    paraQuem: [
      'Imobiliárias com marketing interno que precisa de direção',
      'Gestores que vão contratar alguém para o marketing e querem um plano antes',
      'Quem quer organizar o orçamento de mídia do ano',
    ],
    problema: {
      titulo: 'Marketing sem plano vira lista de tarefas',
      texto:
        'Post no Instagram, um anúncio aqui, uma ação ali, e no fim do ano ninguém sabe o que funcionou. Sem meta mensal e sem rotina, o marketing não conversa com o comercial. O plano junta as duas coisas.',
    },
    comoFunciona: [
      { etapa: 'Diagnóstico', texto: 'Canais, concorrência, posicionamento e números atuais do funil.' },
      { etapa: 'Metas', texto: 'Leads, visitas, captações e vendas por mês, calculadas a partir da meta comercial.' },
      { etapa: 'Calendário e orçamento', texto: 'Campanhas e ações dos 12 meses, com a verba de mídia por canal e por trimestre.' },
      { etapa: 'Rotina', texto: 'Checklists semanais e mensais, indicadores e o onboarding do profissional que vai executar.' },
    ],
    entregas: [
      'Diagnóstico de canais, concorrência e posicionamento',
      'Metas mensais de leads, visitas, captações e vendas',
      'Calendário de 12 meses com campanhas e ações',
      'Orçamento de mídia por canal e por trimestre',
      'Rotina semanal e mensal, com checklists e indicadores',
      'Perfil da vaga e onboarding do profissional interno',
    ],
    prazo: '1 mês',
    preco: 'R$ 3.000',
    precoNota: 'Pagamento único.',
    ctaLabel: 'Quero um planejamento',
    faq: [
      {
        pergunta: 'Vocês executam o plano depois?',
        resposta: 'Pode ser. O plano é feito para o seu time executar, mas qualquer parte dele pode ser contratada com a gente, como anúncios, site ou CRM.',
      },
      {
        pergunta: 'Preciso ter alguém de marketing contratado?',
        resposta: 'Não. Se ainda não tem, o plano inclui o perfil da vaga e o roteiro de onboarding para quem entrar.',
      },
      {
        pergunta: 'O plano serve para incorporadora?',
        resposta: 'Sim. Nesse caso o calendário segue as fases dos empreendimentos: pré-lançamento, lançamento e estoque.',
      },
    ],
    cases: ['brognoli-negocios-imobiliarios', 'brognoli-indicasse-programa-de-indicacao'],
    relacionados: ['consultoria-processos-comerciais', 'anuncios-imobiliarios', 'marketing-imobiliario'],
  },
  {
    slug: 'consultoria-processos-comerciais',
    valor: 'processos-automacao',
    nome: 'Consultoria em Processos e Automação',
    seoTitle: 'Consultoria em Processos Comerciais para Imobiliárias | OCA Digital',
    seoDescription:
      'Consultoria para organizar o processo comercial da imobiliária, do primeiro contato do lead até a visita agendada, com resposta automática, qualificação e indicadores. Sob medida.',
    h1: 'Processo comercial imobiliário do primeiro contato à visita',
    intro:
      'Nós organizamos com o seu time como cada lead é atendido, do primeiro contato até a visita agendada, e automatizamos o que hoje depende de alguém lembrar. O resultado esperado no primeiro mês é simples: nenhum lead sem resposta.',
    paraQuem: [
      'Imobiliárias em que cada corretor atende de um jeito',
      'Gestores que não sabem quantos leads ficaram sem resposta no mês',
      'Times que recebem muitos leads e não conseguem separar quem está pronto para comprar',
    ],
    problema: {
      titulo: 'O lead não some, ele esfria esperando',
      texto:
        'Quem pede informação de um imóvel costuma falar com mais de uma imobiliária. Se a resposta demora, outra chega antes. Sem um processo combinado, cada corretor decide quando e como responder, e o gestor só descobre o problema quando a venda não acontece.',
    },
    comoFunciona: [
      { etapa: 'Mapeamento', texto: 'Acompanhamos como o seu time atende hoje e onde o lead se perde.' },
      { etapa: 'Processo combinado', texto: 'Um jeito só de atender, com etapas, prazos e roteiro de perguntas, definido junto com o time.' },
      { etapa: 'Automação', texto: 'Resposta automática, sequência de e-mails e nota automática para saber quem está mais perto de comprar.' },
      { etapa: 'Acompanhamento', texto: 'Indicadores de atendimento revisados todo mês, com ajustes no processo.' },
    ],
    entregas: [
      'Mapeamento do atendimento atual',
      'Processo comercial documentado e combinado com o time',
      'Resposta automática e sequência de e-mails para cada lead',
      'Roteiro de qualificação e nota automática dos leads',
      'Indicadores de atendimento acompanhados todo mês',
    ],
    prazo: '1 mês de implantação + acompanhamento mensal',
    preco: 'Sob medida',
    precoNota: 'O investimento depende do tamanho do time e da operação. Montamos a proposta depois de conhecer o seu processo.',
    ctaLabel: 'Quero organizar processos',
    faq: [
      {
        pergunta: 'Preciso ter CRM para fazer a consultoria?',
        resposta: 'Ajuda, mas não é obrigatório. Se você não tiver, implantamos o CRM junto.',
      },
      {
        pergunta: 'O que é a nota automática do lead?',
        resposta: 'É uma pontuação calculada a partir das respostas e do comportamento do lead, como orçamento, prazo e interesse. Ela mostra ao corretor quem atender primeiro.',
      },
      {
        pergunta: 'Qual a diferença para o serviço de automação com n8n?',
        resposta: 'A consultoria organiza o processo e o time. A automação com n8n é a parte técnica: fluxos que conectam as suas ferramentas. Muitas vezes os dois andam juntos.',
      },
    ],
    cases: ['brognoli-negocios-imobiliarios'],
    relacionados: ['crm-imobiliario', 'automacao-n8n-imobiliarias', 'planejamento-de-marketing-imobiliario'],
  },
  {
    slug: 'crm-imobiliario',
    valor: 'crm',
    nome: 'CRM Imobiliário',
    seoTitle: 'CRM para Imobiliária: Implantação e Configuração | OCA Digital',
    seoDescription:
      'CRM configurado para o funil da imobiliária, com origem de cada lead, distribuição entre corretores e painel do comercial em tempo real. A partir de R$ 150/mês para até 3 usuários.',
    h1: 'CRM imobiliário configurado para o seu funil',
    intro:
      'Um CRM só funciona quando é configurado para o jeito que a sua imobiliária vende. Nós montamos as etapas do funil, ligamos o site, os formulários e o WhatsApp, distribuímos os leads entre os corretores e deixamos o painel do comercial pronto para o gestor acompanhar.',
    paraQuem: [
      'Imobiliárias que controlam leads em planilha ou no WhatsApp',
      'Quem já tem CRM mas o time não usa',
      'Gestores que querem ver o funil do comercial em tempo real',
    ],
    problema: {
      titulo: 'Lead fora do CRM é lead sem dono',
      texto:
        'Quando o contato fica no celular do corretor, a imobiliária não sabe quantos leads recebeu, quantos foram atendidos e de onde veio cada venda. Se o corretor sai, o histórico vai junto.',
    },
    comoFunciona: [
      { etapa: 'Escolha ou revisão', texto: 'CRM novo ou integração com o que você já usa.' },
      { etapa: 'Configuração', texto: 'Etapas do funil, campos, origem de cada contato e regras de distribuição entre corretores.' },
      { etapa: 'Integrações', texto: 'Site, formulários, portais e WhatsApp caindo direto no CRM.' },
      { etapa: 'Treinamento', texto: 'Time treinado e painel do comercial pronto para o gestor.' },
    ],
    entregas: [
      'CRM novo ou integração com o que você já usa',
      'Etapas do funil e origem de cada contato configuradas',
      'Site, formulários e WhatsApp caindo direto no CRM',
      'Distribuição dos leads entre os corretores',
      'Painel com os números do comercial em tempo real',
    ],
    prazo: 'Implantação em até 1 mês',
    preco: 'A partir de R$ 150/mês',
    precoNota: 'Licença do CRM para até 3 usuários. Implantação e planos com mais usuários conforme a operação.',
    ctaLabel: 'Quero um CRM',
    faq: [
      {
        pergunta: 'Qual CRM vocês usam?',
        resposta: 'Trabalhamos com o OCA One, nosso CRM para imobiliárias, e também integramos com o CRM que você já usa quando faz sentido manter.',
      },
      {
        pergunta: 'Os leads dos portais entram no CRM?',
        resposta: 'Sim. Configuramos a entrada dos leads dos portais, do site e do WhatsApp com a origem registrada.',
      },
      {
        pergunta: 'E se eu tiver mais de 3 corretores?',
        resposta: 'Há planos com mais usuários. O valor é definido conforme o tamanho do time.',
      },
    ],
    cases: ['brognoli-negocios-imobiliarios'],
    relacionados: ['consultoria-processos-comerciais', 'automacao-n8n-imobiliarias', 'sites-para-imobiliarias'],
  },
  {
    slug: 'automacao-n8n-imobiliarias',
    valor: 'automacao-n8n',
    nome: 'Automações e Integrações com n8n',
    seoTitle: 'Automação com n8n para Imobiliárias | OCA Digital',
    seoDescription:
      'Automações e integrações com n8n para imobiliárias: leads dos portais no CRM e no WhatsApp do corretor, resposta automática, follow-up e relatórios. R$ 1.500 de setup + a partir de R$ 300 por fluxo.',
    h1: 'Automação com n8n para imobiliárias',
    intro:
      'O n8n é uma ferramenta de automação que conecta os sistemas que a sua imobiliária já usa: portais, site, CRM, WhatsApp, e-mail e planilhas. Nós desenhamos e montamos os fluxos para que as tarefas repetidas aconteçam sozinhas e o corretor fique com o que só ele pode fazer, que é atender e vender.',
    paraQuem: [
      'Imobiliárias que copiam lead do portal para o CRM na mão',
      'Times que esquecem de dar retorno para quem não respondeu',
      'Gestores que montam relatório toda semana juntando dados de vários lugares',
      'Quem usa ferramentas que não conversam entre si',
    ],
    problema: {
      titulo: 'Tarefa repetida é onde o lead se perde',
      texto:
        'Cada passo manual entre o portal, o CRM e o WhatsApp é um atraso e uma chance de esquecimento. Com os fluxos certos, o lead chega no CRM, o corretor é avisado na hora, a primeira resposta sai em minutos e quem parou de responder recebe um lembrete.',
    },
    comoFunciona: [
      { etapa: 'Mapeamento', texto: 'Listamos as tarefas repetidas do time e escolhemos as que mais economizam tempo ou salvam leads.' },
      { etapa: 'Setup', texto: 'Configuramos o n8n e as conexões com as suas ferramentas.' },
      { etapa: 'Fluxos', texto: 'Montamos e testamos cada fluxo com dados reais antes de ligar para o time.' },
      { etapa: 'Acompanhamento', texto: 'Monitoramos os fluxos e ajustamos quando uma ferramenta muda.' },
    ],
    entregas: [
      'Leads dos portais e do site entrando no CRM e avisando o corretor no WhatsApp',
      'Primeira resposta automática com os detalhes do imóvel',
      'Follow-up automático para quem parou de responder',
      'Lembrete de visita para o cliente e para o corretor',
      'Relatório semanal com os números do comercial',
      'Integração entre CRM, planilhas, e-mail e outras ferramentas',
    ],
    prazo: 'Cada fluxo leva de alguns dias a 2 semanas, conforme a complexidade',
    preco: 'R$ 1.500 de setup + a partir de R$ 300 por fluxo',
    precoNota: 'O setup configura o n8n e as conexões com as suas ferramentas. O valor de cada fluxo depende de quantas etapas e sistemas ele envolve.',
    ctaLabel: 'Quero automatizar',
    faq: [
      {
        pergunta: 'O que é n8n?',
        resposta: 'É uma plataforma de automação de código aberto, parecida com Zapier e Make, que conecta sistemas diferentes por meio de fluxos. Ela permite automações mais completas e com custo de uso menor quando o volume cresce.',
      },
      {
        pergunta: 'Funciona com o CRM que eu já uso?',
        resposta: 'Na maioria dos casos, sim. O n8n conversa com qualquer sistema que tenha API ou webhook. No mapeamento confirmamos isso antes de começar.',
      },
      {
        pergunta: 'Preciso de alguém técnico na equipe?',
        resposta: 'Não. Nós montamos, testamos e acompanhamos os fluxos. O time só usa o resultado.',
      },
      {
        pergunta: 'Qual a diferença para a consultoria em processos?',
        resposta: 'A consultoria organiza como o time atende. A automação com n8n é a parte técnica que executa esse processo sozinha. Dá para contratar só os fluxos.',
      },
    ],
    cases: [],
    relacionados: ['consultoria-processos-comerciais', 'crm-imobiliario', 'anuncios-imobiliarios'],
  },
  {
    slug: 'marketing-para-lancamentos-imobiliarios',
    valor: 'lancamentos',
    nome: 'Marketing para Lançamentos',
    seoTitle: 'Marketing para Lançamento Imobiliário | OCA Digital',
    seoDescription:
      'Marketing para lançamento imobiliário: landing page, anúncios, CRM e atendimento do pré-lançamento ao pós-venda. Case SUNCLUB Campeche: 173 leads em 1 semana a R$ 43,44 por lead.',
    h1: 'Marketing para lançamento imobiliário, do pré-lançamento às vendas',
    intro:
      'Lançamento tem prazo e não perdoa atraso. Nós cuidamos da captação e do atendimento ao mesmo tempo: página, anúncios, CRM e sequência de contato prontos antes do lançamento, para cada lead chegar com origem registrada e ser atendido rápido pela equipe de vendas.',
    paraQuem: [
      'Incorporadoras e construtoras com lançamento ou pré-lançamento',
      'Imobiliárias que vão vender um empreendimento com exclusividade',
      'Empreendimentos com estoque que precisa girar',
    ],
    problema: {
      titulo: 'O lançamento gera procura e o atendimento não acompanha',
      texto:
        'Nas primeiras semanas os leads chegam todos de uma vez. Sem página preparada, sem CRM e sem regra de distribuição, os corretores não dão conta e os melhores contatos esfriam. A preparação acontece antes do primeiro anúncio.',
    },
    comoFunciona: [
      { etapa: 'Pré-lançamento', texto: 'Landing page, lista de interessados e campanhas para formar a base antes da abertura das vendas.' },
      { etapa: 'Lançamento', texto: 'Anúncios no Google e na Meta, distribuição dos leads e atendimento com prazo combinado.' },
      { etapa: 'Vendas', texto: 'Remarketing, sequência de e-mails e acompanhamento do custo por lead e por venda.' },
      { etapa: 'Estoque e pós-venda', texto: 'Campanhas para as unidades restantes e comunicação com quem já comprou.' },
    ],
    entregas: [
      'Landing page ou site do empreendimento',
      'Campanhas no Google, no Facebook e no Instagram',
      'CRM com funil do lançamento e distribuição dos leads',
      'Sequência de contato e e-mails para os interessados',
      'Relatório de leads, visitas e vendas por canal',
    ],
    prazo: 'Conforme o cronograma do lançamento',
    preco: 'Sob medida',
    precoNota: 'O investimento depende do tamanho do empreendimento, da duração da campanha e da verba de mídia.',
    ctaLabel: 'Quero planejar o lançamento',
    faq: [
      {
        pergunta: 'Com quanto tempo de antecedência devemos começar?',
        resposta: 'O ideal é começar no pré-lançamento, algumas semanas antes da abertura das vendas, para a página, o CRM e as campanhas estarem testados.',
      },
      {
        pergunta: 'Vocês trabalham junto com a imobiliária parceira?',
        resposta: 'Sim. Configuramos a distribuição dos leads para a equipe própria e para as imobiliárias parceiras, com a origem de cada contato registrada.',
      },
      {
        pergunta: 'Qual foi o resultado do SUNCLUB Campeche?',
        resposta: '173 leads captados em 1 semana, a R$ 43,44 por lead. O case completo está na página de cases.',
      },
    ],
    cases: ['santa-ilha-sunclub-campeche', 'vokkan-vivaon-vivapark'],
    relacionados: ['landing-pages-imobiliarias', 'anuncios-imobiliarios', 'crm-imobiliario'],
  },
];

export const getServicoBySlug = (slug: string) => servicos.find((s) => s.slug === slug);
