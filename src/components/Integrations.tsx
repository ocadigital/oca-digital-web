import { Sparkles } from 'lucide-react';

const integrations = [
  { name: 'Asaas', desc: 'Cobrança e pagamentos' },
  { name: 'ClickUp', desc: 'Gestão de tarefas' },
  { name: 'Google Sheets', desc: 'Planilhas dinâmicas' },
  { name: 'WhatsApp', desc: 'Mensageria oficial' },
  { name: 'Pipedrive', desc: 'CRM de vendas' },
  { name: 'OpenAI', desc: 'Modelos de IA' },
  { name: 'N8N', desc: 'Workflows custom' },
  { name: 'APIs externas', desc: 'Webhooks e REST' },
];

const Integrations = () => {
  return (
    <section id="integracoes" className="relative py-24 md:py-32 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-glow opacity-50 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs font-medium text-muted-foreground mb-4">
            Ecossistema conectado
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            Suas ferramentas favoritas,
            <br className="hidden md:block" /> <span className="text-gradient">conversando entre si</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            A OCA ONE conecta tudo que sua empresa já usa — e automatiza o fluxo entre elas.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Center hub */}
          <div className="flex justify-center mb-8">
            <div className="relative w-24 h-24 rounded-3xl bg-gradient-primary flex items-center justify-center shadow-glow animate-glow-pulse">
              <Sparkles className="w-10 h-10 text-white" />
              <div className="absolute -inset-3 rounded-3xl border border-primary/30 animate-pulse" />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {integrations.map((it, i) => (
              <div
                key={it.name}
                className="group glass rounded-xl p-5 text-center hover:-translate-y-1 hover:shadow-glow-blue transition-all animate-fade-in-up"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-primary p-px mb-3">
                  <div className="w-full h-full rounded-[11px] bg-card flex items-center justify-center">
                    <span className="text-lg font-bold text-gradient">{it.name[0]}</span>
                  </div>
                </div>
                <div className="font-semibold text-sm">{it.name}</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">{it.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Integrations;
