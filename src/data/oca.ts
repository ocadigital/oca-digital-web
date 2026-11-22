// Conteúdo institucional da OCA usado em /sobre e nas páginas de serviço.
// Fonte única dos 3 pilares e da metodologia: mude aqui e as duas páginas acompanham.

export type PilarId = 'processos' | 'captacao' | 'automacao';

export const pilares: { id: PilarId; titulo: string; descricao: string }[] = [
  {
    id: 'processos',
    titulo: 'Organização de Processos',
    descricao:
      'Implantação de CRM, pesquisa de satisfação com os clientes, todos os leads num lugar só e um time de pré-atendimento para responder rápido e separar quem está pronto para visitar.',
  },
  {
    id: 'captacao',
    titulo: 'Captação de Clientes',
    descricao:
      'Geração de leads com campanhas sob medida, criação de marca, lançamentos imobiliários e conteúdo para redes sociais.',
  },
  {
    id: 'automacao',
    titulo: 'Automação e Ferramentas',
    descricao:
      'Atendimento automático no WhatsApp, sequência de e-mails para quem ainda não está pronto, nota automática para saber quem está mais perto de comprar e ajuda para escolher e implantar as ferramentas.',
  },
];

export const metodologia = [
  {
    fase: 'Descoberta',
    icone: '🔹',
    descricao:
      'Coletamos dados, analisamos o cenário atual e escutamos o time interno. É o momento de abrir possibilidades, identificar gargalos e entender o comportamento dos leads.',
  },
  {
    fase: 'Definição',
    icone: '🔸',
    descricao:
      'Com base nos dados, organizamos os aprendizados, identificamos oportunidades e traçamos um diagnóstico estratégico. Aqui é onde as ideias começam a ganhar forma.',
  },
  {
    fase: 'Execução',
    icone: '🔹',
    descricao:
      'Criamos e implementamos soluções práticas, desde ajustes técnicos no site e automações de marketing até campanhas de mídia paga e novos processos comerciais.',
  },
  {
    fase: 'Entrega',
    icone: '🔸',
    descricao:
      'Validamos, medimos e refinamos. Entregamos relatórios, dashboards e insights contínuos para que a empresa evolua com base em dados e cultura de melhoria contínua.',
  },
];

/** De qual pilar é cada serviço. A página-pilar (marketing imobiliário) cobre os três. */
export const pilaresDoServico: Record<string, PilarId[]> = {
  'marketing-imobiliario': ['processos', 'captacao', 'automacao'],
  'sites-para-imobiliarias': ['captacao'],
  'landing-pages-imobiliarias': ['captacao'],
  'anuncios-imobiliarios': ['captacao'],
  'planejamento-de-marketing-imobiliario': ['captacao'],
  'marketing-para-lancamentos-imobiliarios': ['captacao'],
  'consultoria-processos-comerciais': ['processos'],
  'crm-imobiliario': ['processos'],
  'automacao-n8n-imobiliarias': ['automacao'],
};

/** Posts do blog ligados a cada serviço, na ordem em que aparecem na esteira. */
export const postsDoServico: Record<string, string[]> = {
  'marketing-imobiliario': [
    'por-que-estrategia-marketing-imobiliario-nao-sai-do-papel',
    'blindagem-de-processos-imobiliaria-guia-completo',
    'como-gerar-mais-leads-qualificados-imobiliaria-2024',
  ],
  'sites-para-imobiliarias': ['como-gerar-mais-leads-qualificados-imobiliaria-2024', 'guia-completo-crm-imobiliario-organizar-leads'],
  'landing-pages-imobiliarias': ['como-gerar-mais-leads-qualificados-imobiliaria-2024', 'guia-completo-crm-imobiliario-organizar-leads'],
  'anuncios-imobiliarios': ['como-gerar-mais-leads-qualificados-imobiliaria-2024', 'por-que-estrategia-marketing-imobiliario-nao-sai-do-papel'],
  'planejamento-de-marketing-imobiliario': [
    'por-que-estrategia-marketing-imobiliario-nao-sai-do-papel',
    'como-gerar-mais-leads-qualificados-imobiliaria-2024',
  ],
  'marketing-para-lancamentos-imobiliarios': [
    'como-gerar-mais-leads-qualificados-imobiliaria-2024',
    'por-que-estrategia-marketing-imobiliario-nao-sai-do-papel',
  ],
  'consultoria-processos-comerciais': [
    'blindagem-de-processos-imobiliaria-guia-completo',
    'ferramenta-nao-basta-metodo-imobiliaria',
  ],
  'crm-imobiliario': [
    'guia-completo-crm-imobiliario-organizar-leads',
    'crm-com-whatsapp-imobiliaria-historico-do-cliente',
    'ferramenta-nao-basta-metodo-imobiliaria',
  ],
  'automacao-n8n-imobiliarias': [
    'crm-com-whatsapp-imobiliaria-historico-do-cliente',
    'guia-completo-crm-imobiliario-organizar-leads',
    'blindagem-de-processos-imobiliaria-guia-completo',
  ],
};
