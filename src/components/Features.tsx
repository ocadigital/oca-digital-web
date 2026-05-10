import {
  Target, BarChart3, Megaphone, Building2,
  Globe, MousePointerClick, Database, Sparkles as SparkIcon,
  MessageCircle, Workflow, CreditCard, BrainCircuit,
  LayoutDashboard, Users, FileBarChart, Banknote,
} from 'lucide-react';

const groups = [
  {
    label: 'Performance Imobiliária',
    desc: 'Captação, mídia paga e lançamentos.',
    color: 'from-neon-purple to-neon-blue',
    items: [
      { icon: Target, title: 'Google Ads', desc: 'Campanhas de busca, performance e remarketing.' },
      { icon: Megaphone, title: 'Meta Ads', desc: 'Facebook, Instagram e captação qualificada.' },
      { icon: Building2, title: 'Lançamentos Imobiliários', desc: 'Estratégia 360º para VGV e velocidade de venda.' },
      { icon: BarChart3, title: 'Estratégia Comercial', desc: 'Funis, SDR, cadência e gestão de leads.' },
    ],
  },
  {
    label: 'Sites & Estrutura Digital',
    desc: 'Presença que converte visitante em lead.',
    color: 'from-neon-blue to-neon-cyan',
    items: [
      { icon: Globe, title: 'Sites Imobiliários', desc: 'Portais e sites institucionais com integração de imóveis.' },
      { icon: MousePointerClick, title: 'Landing Pages', desc: 'Páginas otimizadas para campanhas e lançamentos.' },
      { icon: Database, title: 'Integrações CRM', desc: 'Conexão com Vista, Jetimob, RD CRM, HubSpot e mais.' },
      { icon: SparkIcon, title: 'UX focada em Conversão', desc: 'Design e copy testados para maximizar o lead-rate.' },
    ],
  },
  {
    label: 'Automação & IA',
    desc: 'Inteligência aplicada à operação.',
    color: 'from-neon-purple to-neon-cyan',
    items: [
      { icon: MessageCircle, title: 'WhatsApp com IA', desc: 'Atendimento, qualificação e nutrição automatizados.' },
      { icon: Workflow, title: 'Fluxos Automatizados', desc: 'Cadências, lembretes e roteamento inteligente.' },
      { icon: CreditCard, title: 'Cobrança Automatizada', desc: 'Régua multicanal integrada ao Asaas.' },
      { icon: BrainCircuit, title: 'IA + ClickUp', desc: 'Tarefas, projetos e SLA disparados pelo CRM.' },
    ],
  },
  {
    label: 'OCA ONE',
    desc: 'Plataforma operacional de gestão.',
    color: 'from-neon-cyan to-neon-purple',
    items: [
      { icon: LayoutDashboard, title: 'Dashboards Executivos', desc: 'Indicadores de receita, churn, MRR e operação.' },
      { icon: Users, title: 'Gestão de Clientes', desc: 'Timeline 360º com contratos, faturas e atendimentos.' },
      { icon: Banknote, title: 'Gestão Financeira', desc: 'Receita recorrente, conciliação e DRE em tempo real.' },
      { icon: FileBarChart, title: 'Relatórios Inteligentes', desc: 'Insights gerados por IA para decisão executiva.' },
    ],
  },
];

const Features = () => {
  return (
    <section id="servicos" className="relative py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs font-medium text-muted-foreground mb-4">
            Serviços
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            Quatro frentes integradas para{' '}
            <span className="text-gradient">escalar sua operação</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Performance, estrutura digital, automação com IA e a plataforma OCA ONE
            — trabalhando como um único motor de crescimento.
          </p>
        </div>

        <div className="space-y-8">
          {groups.map((g) => (
            <div key={g.label} className="glass rounded-2xl p-6 md:p-8">
              <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
                <div>
                  <div className={`inline-block text-xs font-bold uppercase tracking-wider bg-gradient-to-r ${g.color} bg-clip-text text-transparent`}>
                    {g.label}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{g.desc}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {g.items.map((it) => (
                  <div
                    key={it.title}
                    className="p-4 rounded-xl bg-card/60 border border-border/60 hover:border-primary/40 hover:shadow-glow transition-all"
                  >
                    <div className="w-9 h-9 rounded-lg bg-gradient-primary p-px mb-3">
                      <div className="w-full h-full rounded-[7px] bg-card flex items-center justify-center">
                        <it.icon className="w-5 h-5 text-primary" />
                      </div>
                    </div>
                    <h3 className="font-semibold text-sm mb-1">{it.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{it.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
