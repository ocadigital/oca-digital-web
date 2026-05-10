import { Building2, Users, MessageCircle, Target, BarChart3, Calendar, Workflow, ArrowRight } from 'lucide-react';

const cards = [
  { icon: Target, title: 'Geração de Leads', desc: 'Mídia paga, SEO e funis de captura para imobiliárias e lançamentos.' },
  { icon: Users, title: 'CRM Imobiliário', desc: 'Pipeline comercial, qualificação e distribuição inteligente para corretores.' },
  { icon: MessageCircle, title: 'Automação WhatsApp', desc: 'Atendimento 24/7, qualificação e nutrição com IA integrada ao corretor.' },
  { icon: Calendar, title: 'Agendamento de Visitas', desc: 'Fluxo automatizado da visita ao fechamento com lembretes e follow-up.' },
  { icon: BarChart3, title: 'Dashboards de Performance', desc: 'Leads por origem, conversão por corretor, ROI por campanha.' },
  { icon: Workflow, title: 'Acompanhamento Comercial', desc: 'Cadência, gestão de SDRs e indicadores em tempo real.' },
];

const flow = ['Lead', 'Qualificação IA', 'Corretor', 'Visita', 'Proposta', 'Venda'];

const RealEstate = () => {
  return (
    <section id="imobiliario" className="relative py-24 md:py-32">
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs font-medium text-muted-foreground mb-4">
            <Building2 className="w-3.5 h-3.5 text-primary" />
            Especialistas em Operação Imobiliária
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            Tecnologia e estratégia para{' '}
            <span className="text-gradient">imobiliárias, incorporadoras</span>{' '}
            e operações comerciais
          </h2>
          <p className="text-muted-foreground text-lg">
            A OCA Digital une marketing, automação e inteligência operacional para
            ajudar imobiliárias e operações comerciais a escalarem processos, vendas
            e gestão.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {cards.map((c) => (
            <div
              key={c.title}
              className="group relative p-5 rounded-xl glass hover:bg-card/80 hover:-translate-y-0.5 transition-all"
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-primary p-px mb-3">
                <div className="w-full h-full rounded-[7px] bg-card flex items-center justify-center">
                  <c.icon className="w-5 h-5 text-primary" />
                </div>
              </div>
              <h3 className="font-semibold text-foreground mb-1.5">{c.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>

        {/* Funil operacional */}
        <div className="glass-strong rounded-2xl p-6 md:p-8">
          <div className="flex items-center justify-between mb-5">
            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground">Fluxo operacional</div>
              <div className="text-base font-semibold mt-1">Do lead à venda — orquestrado por IA</div>
            </div>
            <div className="hidden md:flex items-center gap-2 text-xs text-success">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
              Operação ativa
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {flow.map((step, i) => (
              <div key={step} className="flex items-center gap-2">
                <div className="px-3 py-2 rounded-lg bg-card/60 border border-border/60 text-sm font-medium">
                  <span className="text-[10px] text-muted-foreground mr-1.5">0{i + 1}</span>
                  {step}
                </div>
                {i < flow.length - 1 && <ArrowRight className="w-4 h-4 text-primary/60" />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RealEstate;
