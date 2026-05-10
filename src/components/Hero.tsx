import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, TrendingUp, Activity, DollarSign, Users, Zap, CheckCircle2 } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, BarChart, Bar } from 'recharts';

const revenueData = [
  { v: 28 }, { v: 35 }, { v: 32 }, { v: 48 }, { v: 52 }, { v: 65 }, { v: 78 }, { v: 92 },
];
const barData = [
  { v: 12 }, { v: 18 }, { v: 14 }, { v: 22 }, { v: 28 }, { v: 24 }, { v: 32 },
];

const goTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

const Hero = () => {
  return (
    <section id="inicio" className="relative pt-32 pb-24 md:pt-40 md:pb-32 overflow-hidden">
      {/* Background mesh */}
      <div className="absolute inset-0 bg-gradient-mesh pointer-events-none" />
      <div className="absolute inset-0 grid-bg pointer-events-none opacity-40" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-glow pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs font-medium text-muted-foreground mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-purple opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-purple"></span>
            </span>
            Especialistas em operação imobiliária + tecnologia
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] mb-6">
            <span className="text-gradient">Automação, performance</span>{' '}
            <span className="text-foreground/90">e</span>{' '}
            <span className="text-gradient">inteligência operacional</span>
            <br />
            <span className="text-foreground/90">para empresas que querem escalar resultados</span>
          </h1>

          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
            Especialistas em mercado imobiliário, geração de leads, automações,
            dashboards e operações comerciais inteligentes.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
            <Button
              size="lg"
              onClick={() => goTo('diagnostico')}
              className="bg-gradient-primary text-white shadow-glow hover:opacity-90 h-12 px-6"
            >
              <Sparkles className="w-4 h-4" />
              Agendar Diagnóstico
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => goTo('oca-one')}
              className="h-12 px-6 border-border bg-secondary/40 hover:bg-secondary"
            >
              Conhecer OCA ONE
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {['Leads', 'Conversão', 'Automação', 'Cobrança', 'Receita', 'Operação'].map((t) => (
              <span
                key={t}
                className="text-[11px] px-3 py-1.5 rounded-full glass text-muted-foreground border border-border/60"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Dashboard mockup */}
        <div className="relative mt-16 md:mt-20 max-w-6xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="absolute -inset-4 bg-gradient-primary opacity-20 blur-3xl rounded-full" />
          <div className="relative glass-strong rounded-2xl p-3 md:p-4 shadow-elevated">
            {/* Window chrome */}
            <div className="flex items-center justify-between px-3 py-2 mb-3">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-destructive/70" />
                <div className="w-2.5 h-2.5 rounded-full bg-warning/70" />
                <div className="w-2.5 h-2.5 rounded-full bg-success/70" />
              </div>
              <div className="text-[10px] text-muted-foreground font-mono">app.ocadigital.com.br/dashboard</div>
              <div className="w-12" />
            </div>

            <div className="grid grid-cols-12 gap-3">
              {/* Sidebar */}
              <div className="hidden md:flex col-span-2 flex-col gap-1 p-3 bg-card/50 rounded-xl border border-border/50">
                {['Visão geral', 'Clientes', 'Cobranças', 'Automações', 'Relatórios'].map((l, i) => (
                  <div
                    key={l}
                    className={`text-[10px] px-2 py-1.5 rounded-md ${i === 0 ? 'bg-primary/15 text-primary' : 'text-muted-foreground'}`}
                  >
                    {l}
                  </div>
                ))}
              </div>

              {/* Main */}
              <div className="col-span-12 md:col-span-10 space-y-3">
                {/* KPI cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { icon: DollarSign, label: 'MRR', value: 'R$ 248k', delta: '+12.4%', color: 'text-success' },
                    { icon: Users, label: 'Clientes', value: '1.284', delta: '+8.1%', color: 'text-success' },
                    { icon: Activity, label: 'Churn', value: '1.8%', delta: '-0.4%', color: 'text-success' },
                    { icon: TrendingUp, label: 'LTV', value: 'R$ 18.9k', delta: '+5.2%', color: 'text-success' },
                  ].map((k) => (
                    <div key={k.label} className="bg-card/60 border border-border/50 rounded-xl p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{k.label}</span>
                        <k.icon className="w-3.5 h-3.5 text-muted-foreground" />
                      </div>
                      <div className="text-base md:text-lg font-bold text-foreground">{k.value}</div>
                      <div className={`text-[10px] ${k.color} mt-0.5`}>{k.delta} vs. mês anterior</div>
                    </div>
                  ))}
                </div>

                {/* Charts */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2 bg-card/60 border border-border/50 rounded-xl p-3 h-40 md:h-48">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] text-muted-foreground">Receita recorrente</span>
                      <span className="text-[10px] text-success">↑ 24%</span>
                    </div>
                    <ResponsiveContainer width="100%" height="85%">
                      <AreaChart data={revenueData}>
                        <defs>
                          <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="hsl(var(--neon-purple))" stopOpacity={0.6} />
                            <stop offset="100%" stopColor="hsl(var(--neon-purple))" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <Area type="monotone" dataKey="v" stroke="hsl(var(--neon-purple))" strokeWidth={2} fill="url(#g1)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="bg-card/60 border border-border/50 rounded-xl p-3 h-40 md:h-48">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] text-muted-foreground">Cobranças</span>
                      <Zap className="w-3 h-3 text-neon-cyan" />
                    </div>
                    <ResponsiveContainer width="100%" height="85%">
                      <BarChart data={barData}>
                        <Bar dataKey="v" fill="hsl(var(--neon-blue))" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating cards */}
          <div className="hidden md:block absolute -left-8 top-1/3 glass rounded-xl p-3 shadow-card-saas animate-float">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-success/20 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-success" />
              </div>
              <div>
                <div className="text-[10px] text-muted-foreground">Cobrança automática</div>
                <div className="text-xs font-semibold">R$ 4.890 recebido</div>
              </div>
            </div>
          </div>

          <div className="hidden md:block absolute -right-8 top-1/2 glass rounded-xl p-3 shadow-card-saas animate-float-slow" style={{ animationDelay: '1s' }}>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
              <div>
                <div className="text-[10px] text-muted-foreground">IA detectou</div>
                <div className="text-xs font-semibold">3 clientes em risco</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
