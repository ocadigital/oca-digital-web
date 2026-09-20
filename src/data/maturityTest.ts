export type Level = 1 | 2 | 3 | 4 | 5;

export interface Question {
  dimension: string;
  text: string;
  /** Cinco opções, da 1 (nível 1) à 5 (nível 5). */
  options: [string, string, string, string, string];
}

export interface Dimension {
  id: string;
  name: string;
  questions: [number, number];
}

export const DIMENSIONS: Dimension[] = [
  { id: 'dados', name: 'Registro e previsibilidade', questions: [0, 1] },
  { id: 'processos', name: 'Processos e padrão de atendimento', questions: [2, 3] },
  { id: 'papeis', name: 'Papéis e treinamento', questions: [4, 5] },
  { id: 'metricas', name: 'Métricas e decisões', questions: [6, 7] },
  { id: 'tecnologia', name: 'Esteira, tecnologia e IA', questions: [8, 9] },
];

export const QUESTIONS: Question[] = [
  {
    dimension: 'Registro e previsibilidade',
    text: 'Onde ficam registrados os leads e as captações de imóveis?',
    options: [
      'Em cadernos, planilhas soltas e na memória dos corretores',
      'Num CRM único, mas nem todo o time preenche',
      'Num CRM que todos usam, com preenchimento obrigatório e padronizado',
      'No CRM integrado aos portais e às campanhas, com a origem de cada lead',
      'No CRM, com priorização e alertas automáticos por IA',
    ],
  },
  {
    dimension: 'Registro e previsibilidade',
    text: 'Como você sabe quanto vai faturar no mês que vem?',
    options: [
      'Não sei: depende dos plantões e das indicações',
      'Estimo pelas propostas e contratos em andamento',
      'Tenho a previsão por etapa do funil, com prazos e responsáveis',
      'Projeto o resultado com as taxas de conversão do histórico',
      'Um modelo preditivo projeta vendas e cancelamentos',
    ],
  },
  {
    dimension: 'Processos e padrão de atendimento',
    text: 'Como o atendimento acontece entre corretores diferentes?',
    options: [
      'Cada corretor atende do seu jeito',
      'Existe um funil básico (lead, visita, proposta, fechamento), mas cada um conduz como quer',
      'Todos seguem o mesmo método documentado, com checklists',
      'O método é revisado com base nos indicadores de cada etapa',
      'Etapas repetitivas são automatizadas e o método evolui por testes',
    ],
  },
  {
    dimension: 'Processos e padrão de atendimento',
    text: 'O que acontece se o corretor mais forte sair amanhã?',
    options: [
      'Ele leva os clientes e a operação sofre muito',
      'Perdemos clientes, mas o CRM guarda parte do histórico',
      'A operação segue, porque o método e os clientes são da imobiliária',
      'A operação segue e sabemos o impacto exato nos números',
      'A operação segue e a IA redistribui os leads sem intervenção',
    ],
  },
  {
    dimension: 'Papéis e treinamento',
    text: 'Como as funções da imobiliária são divididas?',
    options: [
      'O dono e poucos corretores fazem quase tudo',
      'Há alguma divisão, mas os papéis se misturam',
      'Papéis claros: pré-vendas, corretores, captação e jurídico',
      'Cada papel tem metas e indicadores próprios',
      'Time enxuto que combina especialistas e automações',
    ],
  },
  {
    dimension: 'Papéis e treinamento',
    text: 'Como um colaborador novo aprende o trabalho?',
    options: [
      'Acompanhando os colegas, sem roteiro',
      'Recebe orientações soltas do gestor',
      'Passa por um onboarding obrigatório, com vídeos e checklists',
      'O onboarding tem metas de desempenho medidas',
      'O onboarding é personalizado, com apoio de IA',
    ],
  },
  {
    dimension: 'Métricas e decisões',
    text: 'Como você decide onde investir em portais e campanhas?',
    options: [
      'Pelo feeling ou pelo que os concorrentes fazem',
      'Olhando o volume de leads que cada canal traz',
      'Comparando resultados por canal em relatórios periódicos',
      'Pelo CAC e pelo ROI por canal, num painel atualizado',
      'Com otimização automática e testes A/B contínuos',
    ],
  },
  {
    dimension: 'Métricas e decisões',
    text: 'Você acompanha vacância, conversão de visita em proposta e tempo de resposta ao lead?',
    options: [
      'Nenhum deles',
      'Alguns, de forma manual e eventual',
      'Sim, em relatórios periódicos',
      'Sim, num painel de BI, com metas e alertas',
      'Sim, com projeções e recomendações automáticas',
    ],
  },
  {
    dimension: 'Esteira, tecnologia e IA',
    text: 'Como funcionam a análise de crédito e a esteira de contratos?',
    options: [
      'Manual e demorada, com documentos que se perdem',
      'Parcialmente digital, com muito vaivém',
      'Esteira padronizada, com checklist e prazos por etapa',
      'Esteira medida por tempo de ciclo, com gargalos identificados',
      'Análise de crédito e assinatura digitais, quase sem intervenção',
    ],
  },
  {
    dimension: 'Esteira, tecnologia e IA',
    text: 'Qual é o papel da IA e da automação hoje?',
    options: [
      'Ainda não usamos',
      'Uso pontual e individual (o corretor usa o ChatGPT por conta própria)',
      'Automações simples, como resposta inicial e cadência de e-mail',
      'Automações integradas ao CRM, com dados confiáveis por trás',
      'IA em precificação, análise de crédito e previsão de cancelamentos',
    ],
  },
];

export interface LevelInfo {
  name: string;
  color: string;
  description: string;
}

export const LEVELS: Record<Level, LevelInfo> = {
  1: {
    name: 'Inicial ou artesanal',
    color: '#C9AF7D',
    description:
      'O sucesso depende do esforço e do talento de cada pessoa. Os registros ficam em cadernos, planilhas e na memória dos corretores, e o dono acumula funções. Se o corretor estrela sai, a operação sente.',
  },
  2: {
    name: 'Gerenciado, com funil básico',
    color: '#5089FB',
    description:
      'Já existe um CRM registrando captações e contatos, e um funil primário: lead, visita, proposta e fechamento. O processo é repetível e dá para estimar o faturamento do mês seguinte.',
  },
  3: {
    name: 'Definido e padronizado',
    color: '#9B5AF6',
    description:
      'Todos seguem o mesmo método, seja qual for o corretor. Os papéis são especializados, os processos são documentados e o onboarding é obrigatório. O método pertence à imobiliária.',
  },
  4: {
    name: 'Gerenciado por dados e métricas',
    color: '#E056FD',
    description:
      'As decisões vêm de números: um painel cruza portais, redes e CRM, e a imobiliária acompanha CAC por canal, vacância, conversão e ROI por portal.',
  },
  5: {
    name: 'Em otimização, com IA',
    color: '#4DD9E8',
    description:
      'Melhoria contínua, automação e IA sustentam a operação: precificação automatizada, esteira de locação digital, alerta de cancelamento e testes constantes.',
  },
};

export interface Bottleneck {
  title: string;
  text: string;
  actions: string[];
}

/** Gargalo da passagem a partir do nível indicado (chave) para o seguinte. */
export const BOTTLENECKS: Record<1 | 2 | 3 | 4, Bottleneck> = {
  1: {
    title: 'Centralizar os dados',
    text: 'O gargalo é a informação espalhada em cadernos, planilhas e na cabeça dos corretores. Para destravar, o CRM passa a ser obrigatório e o registro diário vira regra da casa.',
    actions: [
      'Escolha um CRM e migre as planilhas e os cadernos para ele.',
      'Defina os campos obrigatórios de cada lead e de cada captação.',
      'Adote a regra da casa: o que não está no CRM não existe.',
    ],
  },
  2: {
    title: 'Especializar e treinar',
    text: 'O gargalo é exigir que o corretor faça tudo, do marketing ao contrato. Para destravar, separe os papéis e crie um onboarding padrão.',
    actions: [
      'Separe os papéis: pré-vendas, captação, vendas e jurídico.',
      'Documente o fluxo com checklists e vídeos curtos de treinamento.',
      'Monte um onboarding padrão para todo colaborador novo.',
    ],
  },
  3: {
    title: 'Decidir por dados',
    text: 'O gargalo é investir em portais e campanhas sem saber o retorno. Para destravar, unifique os dados num painel de BI e leve os números para a reunião semanal.',
    actions: [
      'Unifique portais, campanhas e CRM num painel de BI.',
      'Acompanhe CAC por canal, vacância, conversão e ROI por portal.',
      'Leve os números para uma reunião semanal e decida em cima deles.',
    ],
  },
  4: {
    title: 'Automatizar com IA',
    text: 'O gargalo é o atrito humano em tarefas repetitivas, como análise de crédito, precificação e alertas de cancelamento. Para destravar, automatize essas etapas sobre dados que já são confiáveis.',
    actions: [
      'Automatize a análise de crédito e a esteira de locação.',
      'Teste a precificação automatizada (AVM) e os alertas de cancelamento.',
      'Rode testes A/B e personalize a jornada do comprador.',
    ],
  },
};

export const LEVEL_5_ACTIONS = [
  'Revise os indicadores todo mês e procure os gargalos novos.',
  'Teste uma automação nova por trimestre, sempre com meta definida.',
  'Documente o que funciona para expandir sem perder qualidade.',
];

export interface DimensionScore {
  id: string;
  name: string;
  score: number;
}

export interface TestResult {
  overall: number;
  level: Level;
  dimensions: DimensionScore[];
  weakest: DimensionScore;
}

const round2 = (n: number) => Math.round(n * 100) / 100;

export function computeResult(answers: number[]): TestResult {
  const overall = round2(answers.reduce((a, b) => a + b, 0) / answers.length);
  const level = Math.min(5, Math.max(1, Math.round(overall))) as Level;
  const dimensions: DimensionScore[] = DIMENSIONS.map((d) => ({
    id: d.id,
    name: d.name,
    score: round2((answers[d.questions[0]] + answers[d.questions[1]]) / 2),
  }));
  const weakest = dimensions.reduce((min, d) => (d.score < min.score ? d : min), dimensions[0]);
  return { overall, level, dimensions, weakest };
}
