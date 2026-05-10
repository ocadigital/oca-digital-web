import { useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid,
} from 'recharts';
import { TrendingUp, TrendingDown, Filter, Building2 } from 'lucide-react';

const leads = [
  { m: 'Jan', v: 320 }, { m: 'Fev', v: 410 }, { m: 'Mar', v: 480 },
  { m: 'Abr', v: 560 }, { m: 'Mai', v: 720 }, { m: 'Jun', v: 890 },
  { m: 'Jul', v: 1024 }, { m: 'Ago', v: 1280 },
];
const visits = [
  { m: 'Jan', v: 42 }, { m: 'Fev', v: 58 }, { m: 'Mar', v: 64 },
  { m: 'Abr', v: 81 }, { m: 'Mai', v: 102 }, { m: 'Jun', v: 124 },
  { m: 'Jul', v: 138 }, { m: 'Ago', v: 162 },
];
const inad = [
  { m: 'Jan', v: 18 }, { m: 'Fev', v: 16 }, { m: 'Mar', v: 14 },
  { m: 'Abr', v: 13 }, { m: 'Mai', v: 11 }, { m: 'Jun', v: 9 },
  { m: 'Jul', v: 8 }, { m: 'Ago', v: 7 },
];
const origens = [
  { name: 'Google Ads', value: 38 },
  { name: 'Meta Ads', value: 29 },
  { name: 'Orgânico', value: 18 },
  { name: 'Indicação', value: 15 },
];
const ORIGEM_COLORS = ['hsl(var(--neon-purple))', 'hsl(var(--neon-blue))', 'hsl(var(--neon-cyan))', 'hsl(var(--primary))'];

const funnel = [
  { stage: 'Leads', n: 1280, pct: 100 },
  { stage: 'Qualificados', n: 612, pct: 48 },
  { stage: 'Visitas', n: 162, pct: 26 },
  { stage: 'Propostas', n: 84, pct: 14 },
  { stage: 'Vendas', n: 38, pct: 6 },
];

const filters = ['Empreendimento', 'Origem', 'Corretor', 'Status'];
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
            <Building2 className="w-3.5 h-3.5 text-primary" />
            Dashboards Imobiliários
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            Indicadores que importam,
            <br className="hidden md:block" />
            <span className="text-gradient">atualizados em tempo real</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Leads por origem, funil comercial, visitas agendadas, clientes em risco,
            inadimplência e receita recorrente — tudo em um painel.
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
          {/* Leads */}
          <div className="lg:col-span-2 glass rounded-xl p-5 h-80">
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="text-xs text-muted-foreground">Leads captados</div>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-bold">1.280</span>
                  <span className="text-xs text-success flex items-center gap-0.5"><TrendingUp className="w-3 h-3" />+25%</span>
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height="80%">
              <AreaChart data={leads}>
                <defs>
                  <linearGradient id="leadsG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--neon-purple))" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="hsl(var(--neon-purple))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="m" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip {...tooltipStyle} />
                <Area type="monotone" dataKey="v" stroke="hsl(var(--neon-purple))" strokeWidth={2.5} fill="url(#leadsG)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Origem */}
          <div className="glass rounded-xl p-5 h-80">
            <div className="text-xs text-muted-foreground">Leads por origem</div>
            <div className="flex items-baseline gap-2 mt-1 mb-2">
              <span className="text-2xl font-bold">4 canais</span>
            </div>
            <ResponsiveContainer width="100%" height="75%">
              <PieChart>
                <Pie data={origens} dataKey="value" nameKey="name" innerRadius={45} outerRadius={70} paddingAngle={3}>
                  {origens.map((_, i) => <Cell key={i} fill={ORIGEM_COLORS[i]} />)}
                </Pie>
                <Tooltip {...tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Funil */}
          <div className="lg:col-span-2 glass rounded-xl p-5">
            <div className="text-xs text-muted-foreground mb-3">Funil comercial</div>
            <div className="space-y-2">
              {funnel.map((f, i) => (
                <div key={f.stage} className="flex items-center gap-3">
                  <div className="w-24 text-xs text-muted-foreground">{f.stage}</div>
                  <div className="flex-1 h-7 rounded-md bg-secondary/40 overflow-hidden relative">
                    <div
                      className="h-full bg-gradient-to-r from-neon-purple to-neon-blue rounded-md flex items-center px-2 text-xs font-semibold text-white"
                      style={{ width: `${f.pct}%`, opacity: 1 - i * 0.12 }}
                    >
                      {f.n.toLocaleString('pt-BR')}
                    </div>
                  </div>
                  <div className="w-12 text-right text-xs font-medium">{f.pct}%</div>
                </div>
              ))}
            </div>
          </div>

          {/* Visitas */}
          <div className="glass rounded-xl p-5 h-80">
            <div className="text-xs text-muted-foreground">Visitas agendadas</div>
            <div className="flex items-baseline gap-2 mt-1 mb-2">
              <span className="text-2xl font-bold">162</span>
              <span className="text-xs text-success flex items-center gap-0.5"><TrendingUp className="w-3 h-3" />+34%</span>
            </div>
            <ResponsiveContainer width="100%" height="80%">
              <LineChart data={visits}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="m" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip {...tooltipStyle} />
                <Line type="monotone" dataKey="v" stroke="hsl(var(--neon-cyan))" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Inadimplência */}
          <div className="glass rounded-xl p-5 h-80 lg:col-span-2">
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

          {/* Mini KPIs */}
          <div className="glass rounded-xl p-5 grid grid-cols-2 gap-3">
            {[
              { label: 'MRR', value: 'R$ 248k', delta: '+12%' },
              { label: 'Conversão', value: '6.2%', delta: '+1.4pp' },
              { label: 'Em risco', value: '12', delta: '-30%' },
              { label: 'ROI campanhas', value: '4.8x', delta: '+0.6x' },
            ].map((k) => (
              <div key={k.label} className="rounded-lg bg-card/60 border border-border/60 p-3">
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider">{k.label}</div>
                <div className="text-base font-bold mt-1">{k.value}</div>
                <div className="text-[10px] text-success mt-0.5">{k.delta}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboards;
