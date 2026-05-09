import { Button } from '@/components/ui/button';
import { ArrowRight, LayoutDashboard, CreditCard, Users, Workflow } from 'lucide-react';

const tabs = [
  { icon: LayoutDashboard, label: 'Dashboard' },
  { icon: Users, label: 'CRM' },
  { icon: CreditCard, label: 'Cobranças' },
  { icon: Workflow, label: 'Automações' },
];

const clients = [
  { name: 'Construtora Aurora', status: 'Ativo', mrr: 'R$ 12.4k', risk: 'Baixo', color: 'text-success' },
  { name: 'Imobiliária Norte', status: 'Ativo', mrr: 'R$ 8.9k', risk: 'Médio', color: 'text-warning' },
  { name: 'Grupo Vértice', status: 'Trial', mrr: 'R$ 0', risk: 'Alto', color: 'text-destructive' },
  { name: 'Fênix Incorporadora', status: 'Ativo', mrr: 'R$ 22.1k', risk: 'Baixo', color: 'text-success' },
  { name: 'Studio Habitar', status: 'Ativo', mrr: 'R$ 5.3k', risk: 'Baixo', color: 'text-success' },
];

const OcaOne = () => {
  return (
    <section id="oca-one" className="relative py-24 md:py-32 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-gradient-glow pointer-events-none opacity-60" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs font-medium mb-4">
            <span className="text-gradient font-bold">OCA ONE</span>
            <span className="text-muted-foreground">· Plataforma</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            <span className="text-gradient">OCA ONE</span> — Plataforma Inteligente
            <br className="hidden md:block" /> de Gestão e Automação
          </h2>
          <p className="text-muted-foreground text-lg">
            Centralize clientes, cobranças, automações e indicadores em um único ambiente
            — com IA orquestrando o operacional para você.
          </p>
        </div>

        {/* Big mockup */}
        <div className="relative max-w-6xl mx-auto">
          <div className="absolute -inset-6 bg-gradient-primary opacity-20 blur-3xl rounded-full" />
          <div className="relative glass-strong rounded-2xl shadow-elevated overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-md bg-gradient-primary flex items-center justify-center text-white text-xs font-bold">O</div>
                <span className="text-sm font-semibold">OCA ONE</span>
              </div>
              <div className="hidden md:flex gap-1">
                {tabs.map((t, i) => (
                  <div
                    key={t.label}
                    className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-md ${i === 1 ? 'bg-primary/15 text-primary' : 'text-muted-foreground'}`}
                  >
                    <t.icon className="w-3.5 h-3.5" />
                    {t.label}
                  </div>
                ))}
              </div>
              <div className="w-7 h-7 rounded-full bg-secondary" />
            </div>

            {/* Body: clients table */}
            <div className="p-4 md:p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-sm font-semibold">Clientes ativos</div>
                  <div className="text-xs text-muted-foreground">1.284 clientes · R$ 248.4k MRR</div>
                </div>
                <div className="hidden sm:flex gap-2">
                  {['Todos', 'Ativos', 'Em risco', 'Trial'].map((f, i) => (
                    <span
                      key={f}
                      className={`text-xs px-2.5 py-1 rounded-md ${i === 0 ? 'bg-secondary text-foreground' : 'text-muted-foreground'}`}
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-border/60 overflow-hidden">
                <div className="grid grid-cols-12 px-4 py-2 text-[10px] uppercase tracking-wider text-muted-foreground bg-secondary/40 border-b border-border/60">
                  <div className="col-span-5">Cliente</div>
                  <div className="col-span-2">Status</div>
                  <div className="col-span-3">MRR</div>
                  <div className="col-span-2">Risco</div>
                </div>
                {clients.map((c, i) => (
                  <div
                    key={c.name}
                    className={`grid grid-cols-12 items-center px-4 py-3 text-sm ${i !== clients.length - 1 ? 'border-b border-border/40' : ''} hover:bg-secondary/30 transition-colors`}
                  >
                    <div className="col-span-5 flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-primary opacity-80" />
                      <span className="font-medium truncate">{c.name}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-xs px-2 py-0.5 rounded-md bg-secondary text-muted-foreground">{c.status}</span>
                    </div>
                    <div className="col-span-3 font-medium">{c.mrr}</div>
                    <div className={`col-span-2 text-xs font-medium ${c.color}`}>● {c.risk}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-10">
          <Button
            size="lg"
            onClick={() => document.getElementById('diagnostico')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-gradient-primary text-white shadow-glow hover:opacity-90"
          >
            Quero conhecer a OCA ONE
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default OcaOne;
