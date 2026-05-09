import { FormInput, MessageCircle, CreditCard, ListChecks, Users, BarChart3 } from 'lucide-react';

const nodes = [
  { icon: FormInput, label: 'Formulário', sub: 'Lead capturado' },
  { icon: MessageCircle, label: 'WhatsApp', sub: 'Mensagem disparada' },
  { icon: CreditCard, label: 'Asaas', sub: 'Cobrança gerada' },
  { icon: ListChecks, label: 'ClickUp', sub: 'Tarefa criada' },
  { icon: Users, label: 'CRM', sub: 'Cliente atualizado' },
  { icon: BarChart3, label: 'Dashboard', sub: 'Indicador atualizado' },
];

const Automations = () => {
  return (
    <section id="automacao" className="relative py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs font-medium text-muted-foreground mb-4">
            Automação com IA
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            Automatize processos sem depender
            <br className="hidden md:block" /> de <span className="text-gradient">tarefas manuais</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Cada interação dispara o próximo passo. Sua equipe foca em estratégia,
            a IA cuida da execução.
          </p>
        </div>

        {/* Flow */}
        <div className="relative max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 md:gap-2 relative">
            {nodes.map((n, i) => (
              <div key={n.label} className="relative flex flex-col items-center text-center animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="relative w-16 h-16 rounded-2xl glass-strong flex items-center justify-center shadow-card-saas">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-primary opacity-20 blur-xl" />
                  <n.icon className="relative w-7 h-7 text-primary" />
                </div>
                <div className="mt-3 text-sm font-semibold">{n.label}</div>
                <div className="text-[11px] text-muted-foreground">{n.sub}</div>

                {/* Connector line - desktop */}
                {i < nodes.length - 1 && (
                  <svg
                    className="hidden md:block absolute top-8 left-[calc(50%+32px)] h-0.5"
                    width="100%"
                    height="2"
                    style={{ width: 'calc(100% - 64px)' }}
                  >
                    <line
                      x1="0" y1="1" x2="100%" y2="1"
                      stroke="hsl(var(--neon-purple))"
                      strokeWidth="2"
                      className="animate-dash"
                    />
                  </svg>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { v: '92%', l: 'Tarefas operacionais automatizadas' },
            { v: '4.8h', l: 'Economia diária por colaborador' },
            { v: '24/7', l: 'IA monitorando sua operação' },
          ].map((s) => (
            <div key={s.l} className="glass rounded-xl p-5 text-center">
              <div className="text-3xl font-bold text-gradient">{s.v}</div>
              <div className="text-xs text-muted-foreground mt-1">{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Automations;
