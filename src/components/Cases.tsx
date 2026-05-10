import { TrendingDown, Clock, Rocket, TrendingUp, Building2 } from 'lucide-react';

const metrics = [
  { icon: TrendingUp, value: '+312%', label: 'em leads qualificados', desc: 'Performance integrada com CRM e WhatsApp IA.', color: 'text-neon-purple' },
  { icon: Rocket, value: '4.2x', label: 'mais produtividade comercial', desc: 'Roteamento inteligente e cadência automatizada.', color: 'text-neon-cyan' },
  { icon: TrendingDown, value: '38%', label: 'de redução em inadimplência', desc: 'Régua de cobrança e score de risco com IA.', color: 'text-success' },
  { icon: Clock, value: '720h', label: 'economizadas por mês', desc: 'Eliminamos planilhas e tarefas manuais repetitivas.', color: 'text-neon-blue' },
];

const clients = [
  { name: 'Aldo Imóveis', tag: 'Imobiliária' },
  { name: 'Vokkan', tag: 'Incorporadora' },
  { name: 'Aurora Incorporações', tag: 'Lançamentos' },
  { name: 'Vértice Group', tag: 'Operação Comercial' },
  { name: 'Fênix Incorporadora', tag: 'Incorporadora' },
  { name: 'Studio Habitar', tag: 'Imobiliária' },
];

const quotes = [
  {
    q: 'A OCA estruturou nossa captação e nosso atendimento. Hoje temos previsibilidade comercial e dashboards que orientam toda a operação.',
    n: 'Marina Costa',
    r: 'COO · Aurora Incorporações',
  },
  {
    q: 'Não voltamos mais para planilhas. Marketing, CRM, WhatsApp e cobrança falando entre si — e a equipe focada em vender.',
    n: 'Rafael Mendes',
    r: 'CEO · Vértice Group',
  },
];

const Cases = () => {
  return (
    <section id="cases" className="relative py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs font-medium text-muted-foreground mb-4">
            Resultados reais
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            Imobiliárias e incorporadoras que escalaram com a{' '}
            <span className="text-gradient">OCA Digital</span>
          </h2>
        </div>

        {/* Logos / clientes reais */}
        <div className="glass rounded-2xl p-6 md:p-8 mb-10">
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-5">Clientes que confiam na OCA</div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {clients.map((c) => (
              <div
                key={c.name}
                className="rounded-xl border border-border/60 bg-card/40 px-3 py-4 text-center hover:border-primary/40 transition-colors"
              >
                <Building2 className="w-5 h-5 text-primary mx-auto mb-2" />
                <div className="text-sm font-semibold truncate">{c.name}</div>
                <div className="text-[10px] text-muted-foreground mt-0.5">{c.tag}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {metrics.map((m) => (
            <div key={m.label} className="relative gradient-border p-6">
              <m.icon className={`w-6 h-6 ${m.color} mb-3`} />
              <div className="text-4xl md:text-5xl font-bold text-gradient">{m.value}</div>
              <div className="text-sm font-semibold mt-1">{m.label}</div>
              <div className="text-xs text-muted-foreground mt-2 leading-relaxed">{m.desc}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quotes.map((q) => (
            <div key={q.n} className="glass rounded-xl p-6">
              <div className="text-3xl text-primary mb-2 leading-none">"</div>
              <p className="text-foreground/90 leading-relaxed mb-4">{q.q}</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-primary" />
                <div>
                  <div className="text-sm font-semibold">{q.n}</div>
                  <div className="text-xs text-muted-foreground">{q.r}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Cases;
