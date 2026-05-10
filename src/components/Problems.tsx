import { AlertTriangle, FileWarning, Phone, Layers, BarChart3, Zap, MessageSquareWarning, Network, ArrowRight } from 'lucide-react';

const problems = [
  { icon: MessageSquareWarning, title: 'Leads sem resposta', desc: 'Oportunidades perdidas por falta de follow-up rápido.' },
  { icon: Phone, title: 'Corretor sobrecarregado', desc: 'Tempo gasto qualificando lead frio em vez de vender.' },
  { icon: FileWarning, title: 'Planilhas espalhadas', desc: 'Captação, CRM e financeiro desconectados.' },
  { icon: Layers, title: 'Funil comercial sem visibilidade', desc: 'Você não sabe onde o lead está travando.' },
  { icon: BarChart3, title: 'Campanhas sem ROI claro', desc: 'Investimento em mídia sem rastreio até a venda.' },
  { icon: Zap, title: 'Processos manuais', desc: 'Cadência, agendamento e cobrança feitos no braço.' },
  { icon: AlertTriangle, title: 'Inadimplência alta', desc: 'Receita parada e régua de cobrança sem padrão.' },
  { icon: Network, title: 'Ferramentas desconectadas', desc: 'CRM, WhatsApp, financeiro e mídia em silos.' },
];

const Problems = () => {
  return (
    <section id="solucoes" className="relative py-24 md:py-32">
      <div className="absolute inset-0 dot-bg opacity-50 pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs font-medium text-muted-foreground mb-4">
            O problema
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            Sua operação imobiliária está{' '}
            <span className="text-gradient">perdendo dinheiro</span> em processos manuais?
          </h2>
          <p className="text-muted-foreground text-lg">
            Da captação ao pós-venda, cada lead frio, planilha esquecida e cobrança
            atrasada custa receita. Veja onde isso acontece:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {problems.map((p) => (
            <div
              key={p.title}
              className="group relative p-5 rounded-xl glass hover:bg-card/80 transition-all hover:-translate-y-0.5"
            >
              <div className="w-10 h-10 rounded-lg bg-destructive/10 border border-destructive/20 flex items-center justify-center mb-3 group-hover:bg-destructive/20 transition-colors">
                <p.icon className="w-5 h-5 text-destructive" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">{p.title}</h3>
              <p className="text-sm text-muted-foreground">{p.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <span>A OCA ONE resolve tudo isso em um só lugar</span>
          <ArrowRight className="w-4 h-4 text-primary" />
        </div>
      </div>
    </section>
  );
};

export default Problems;
