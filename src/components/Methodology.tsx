import { Search, BrainCircuit, Rocket, LineChart } from 'lucide-react';

const steps = [
  {
    n: '01',
    icon: Search,
    title: 'Diagnóstico Operacional',
    desc: 'Mapeamos gargalos, atendimento, marketing, processos comerciais e oportunidades de automação.',
  },
  {
    n: '02',
    icon: BrainCircuit,
    title: 'Inteligência & Estratégia',
    desc: 'Transformamos dados em decisões e desenhamos fluxos escaláveis para crescimento sustentável.',
  },
  {
    n: '03',
    icon: Rocket,
    title: 'Implementação',
    desc: 'Executamos campanhas, integrações, automações, dashboards e melhorias operacionais.',
  },
  {
    n: '04',
    icon: LineChart,
    title: 'Evolução Contínua',
    desc: 'Acompanhamos indicadores, refinamos processos e geramos evolução contínua baseada em dados.',
  },
];

const Methodology = () => {
  return (
    <section id="metodologia" className="relative py-24 md:py-32">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-glow opacity-40 pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs font-medium text-muted-foreground mb-4">
            Metodologia
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            Como transformamos{' '}
            <span className="text-gradient">operação em crescimento</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Uma metodologia que combina análise, estratégia, automação e execução contínua.
          </p>
        </div>

        <div className="relative">
          {/* line */}
          <div className="hidden lg:block absolute top-12 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s) => (
              <div key={s.n} className="relative group">
                <div className="hidden lg:block absolute -top-1.5 left-10 w-3 h-3 rounded-full bg-gradient-primary shadow-glow" />
                <div className="glass rounded-xl p-6 hover:-translate-y-1 transition-all">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-primary p-px">
                      <div className="w-full h-full rounded-[7px] bg-card flex items-center justify-center">
                        <s.icon className="w-5 h-5 text-primary" />
                      </div>
                    </div>
                    <span className="text-3xl font-bold text-gradient">{s.n}</span>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{s.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Methodology;
