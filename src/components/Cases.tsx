import { TrendingDown, Clock, Rocket, TrendingUp } from 'lucide-react';

const metrics = [
  { icon: TrendingDown, value: '38%', label: 'de redução em inadimplência', desc: 'Régua de cobrança automatizada e score de risco com IA.', color: 'text-success' },
  { icon: Clock, value: '720h', label: 'economizadas por mês', desc: 'Eliminamos planilhas e tarefas manuais repetitivas.', color: 'text-neon-cyan' },
  { icon: Rocket, value: '4.2x', label: 'mais produtividade', desc: 'Equipe focada no estratégico, IA cuida do operacional.', color: 'text-neon-purple' },
  { icon: TrendingUp, value: '+106%', label: 'de crescimento de MRR', desc: 'Visibilidade total e decisões orientadas por dado.', color: 'text-neon-blue' },
];

const quotes = [
  { q: 'A OCA ONE virou a coluna vertebral da nossa operação. Reduzimos inadimplência em mais de 30% no primeiro trimestre.', n: 'Marina Costa', r: 'COO · Aurora Incorporações' },
  { q: 'Não voltamos mais para planilhas. Tudo está em um lugar só, com indicadores em tempo real e automação fazendo o trabalho pesado.', n: 'Rafael Mendes', r: 'CEO · Vértice Group' },
];

const Cases = () => {
  return (
    <section id="cases" className="relative py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs font-medium text-muted-foreground mb-4">
            Resultados
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            Empresas que escalaram com a
            <br className="hidden md:block" /> <span className="text-gradient">OCA ONE</span>
          </h2>
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
