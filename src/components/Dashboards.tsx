import { useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid,
} from 'recharts';
import { TrendingUp, TrendingDown, Filter } from 'lucide-react';

const mrr = [
  { m: 'Jan', v: 120 }, { m: 'Fev', v: 138 }, { m: 'Mar', v: 152 },
  { m: 'Abr', v: 168 }, { m: 'Mai', v: 192 }, { m: 'Jun', v: 215 },
  { m: 'Jul', v: 228 }, { m: 'Ago', v: 248 },
];
const churn = [
  { m: 'Jan', v: 3.4 }, { m: 'Fev', v: 3.1 }, { m: 'Mar', v: 2.8 },
  { m: 'Abr', v: 2.5 }, { m: 'Mai', v: 2.2 }, { m: 'Jun', v: 2.0 },
  { m: 'Jul', v: 1.9 }, { m: 'Ago', v: 1.8 },
];
const inad = [
  { m: 'Jan', v: 18 }, { m: 'Fev', v: 16 }, { m: 'Mar', v: 14 },
  { m: 'Abr', v: 13 }, { m: 'Mai', v: 11 }, { m: 'Jun', v: 9 },
  { m: 'Jul', v: 8 }, { m: 'Ago', v: 7 },
];

const filters = ['Período', 'Status', 'Receita', 'Risco'];
const periods = ['7d', '30d', '90d', '12m'];

const Dashboards = () => {
  const [period, setPeriod] = useState('12m');

  const tooltipStyle = {
    contentStyle: {
      background: 'hsl(var(--card))',
      border: '1px solid hsl(var(--border))',
      borderRadius: 8,
      fontSize: 12,
    },
    labelStyle: { color: 'hsl(var(--muted-foreground))' },
  };

  return (
    <section className="relative py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs font-medium text-muted-foreground mb-4">
            Dashboards
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            Indicadores que importam,
            <br className="hidden md:block" />
            <span className="text-gradient">atualizados em tempo real</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Receita, churn, LTV, MRR, inadimplência e clientes em risco — tudo em um painel.
          </p>
        </div>

        {/* Filters */}
        <div className="glass rounded-xl p-4 mb-6 flex flex-wrap items-center gap-3">
          <Filter className="w-4 h-4 text-muted-foreground" />
          {filters.map((f) => (
            <button
              key={f}
              className="text-xs px-3 py-1.5 rounded-md bg-secondary/60 text-muted-foreground hover:text-foreground transition-colors"
            >
              {f}
            </button>
          ))}
          <div className="ml-auto flex gap-1 p-1 rounded-md bg-secondary/60">
            {periods.map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`text-xs px-3 py-1 rounded ${period === p ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* MRR */}
          <div className="lg:col-span-2 glass rounded-xl p-5 h-80">
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="text-xs text-muted-foreground">MRR (Receita Recorrente Mensal)</div>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-bold">R$ 248k</span>
                  <span className="text-xs text-success flex items-center gap-0.5"><TrendingUp className="w-3 h-3" />+106%</span>
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height="80%">
              <AreaChart data={mrr}>
                <defs>
                  <linearGradient id="mrrG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--neon-purple))" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="hsl(var(--neon-purple))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="m" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip {...tooltipStyle} />
                <Area type="monotone" dataKey="v" stroke="hsl(var(--neon-purple))" strokeWidth={2.5} fill="url(#mrrG)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Churn */}
          <div className="glass rounded-xl p-5 h-80">
            <div className="text-xs text-muted-foreground">Churn rate</div>
            <div className="flex items-baseline gap-2 mt-1 mb-2">
              <span className="text-2xl font-bold">1.8%</span>
              <span className="text-xs text-success flex items-center gap-0.5"><TrendingDown className="w-3 h-3" />-1.6pp</span>
            </div>
            <ResponsiveContainer width="100%" height="80%">
              <LineChart data={churn}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="m" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip {...tooltipStyle} />
                <Line type="monotone" dataKey="v" stroke="hsl(var(--neon-cyan))" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Inadimplência */}
          <div className="glass rounded-xl p-5 h-80">
            <div className="text-xs text-muted-foreground">Inadimplência</div>
            <div className="flex items-baseline gap-2 mt-1 mb-2">
              <span className="text-2xl font-bold">7%</span>
              <span className="text-xs text-success flex items-center gap-0.5"><TrendingDown className="w-3 h-3" />-11pp</span>
            </div>
            <ResponsiveContainer width="100%" height="80%">
              <BarChart data={inad}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="m" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip {...tooltipStyle} />
                <Bar dataKey="v" fill="hsl(var(--neon-blue))" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Mini KPIs row */}
          <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'LTV', value: 'R$ 18.9k', delta: '+5.2%' },
              { label: 'CAC', value: 'R$ 1.240', delta: '-8.4%' },
              { label: 'Em risco', value: '12', delta: '-30%' },
              { label: 'Tickets', value: '184', delta: '+2.1%' },
            ].map((k) => (
              <div key={k.label} className="glass rounded-xl p-4">
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider">{k.label}</div>
                <div className="text-xl font-bold mt-1">{k.value}</div>
                <div className="text-xs text-success mt-0.5">{k.delta}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboards;
