import {
  LayoutDashboard, Users, CreditCard, Plug, ListChecks, MessageCircle,
  FileSignature, UserCheck, ShieldAlert, BellRing, Banknote, FileBarChart,
} from 'lucide-react';

const features = [
  { icon: LayoutDashboard, title: 'Dashboard Executivo', desc: 'Visão consolidada de receita, churn, LTV e MRR em tempo real.' },
  { icon: Users, title: 'CRM Inteligente', desc: 'Pipeline com IA priorizando leads quentes e próximas ações.' },
  { icon: CreditCard, title: 'Cobrança Automatizada', desc: 'Régua de cobrança multicanal sem esforço manual.' },
  { icon: Plug, title: 'Integração com Asaas', desc: 'Boletos, Pix e cartão sincronizados automaticamente.' },
  { icon: ListChecks, title: 'Integração com ClickUp', desc: 'Tarefas e projetos disparados pelos eventos do CRM.' },
  { icon: MessageCircle, title: 'Automação WhatsApp', desc: 'Mensagens contextuais para cada estágio do cliente.' },
  { icon: FileSignature, title: 'Contratos Automatizados', desc: 'Geração e assinatura digital com fluxo de aprovação.' },
  { icon: UserCheck, title: 'Gestão de Clientes', desc: 'Timeline 360°: contratos, faturas, atendimentos e tickets.' },
  { icon: ShieldAlert, title: 'Score de Risco', desc: 'IA classifica clientes por probabilidade de churn ou inadimplência.' },
  { icon: BellRing, title: 'Alertas Automáticos', desc: 'Notificações inteligentes para a equipe agir no momento certo.' },
  { icon: Banknote, title: 'Automação Financeira', desc: 'Conciliação, recorrência e DRE atualizada sem planilha.' },
  { icon: FileBarChart, title: 'Relatórios Inteligentes', desc: 'Insights gerados por IA prontos para a reunião de board.' },
];

const Features = () => {
  return (
    <section className="relative py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs font-medium text-muted-foreground mb-4">
            Recursos
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            Tudo que sua operação precisa,
            <br className="hidden md:block" />
            <span className="text-gradient">em um único lugar</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            12 módulos integrados que substituem dezenas de ferramentas avulsas.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="group relative p-5 rounded-xl bg-card/60 border border-border/60 hover:border-primary/40 hover:shadow-glow transition-all"
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-primary p-px mb-4">
                <div className="w-full h-full rounded-[7px] bg-card flex items-center justify-center">
                  <f.icon className="w-5 h-5 text-primary" />
                </div>
              </div>
              <h3 className="font-semibold text-foreground mb-1.5">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
