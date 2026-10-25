import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const track = (event: string) => {
  const w = window as unknown as { dataLayer?: unknown[] };
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({ event, origem: 'home' });
};

/** Resumo do diagnóstico na home. O diagnóstico em etapas, com o formulário, fica em /diagnostico. */
const DiagnosticSection = () => (
  <section id="diagnostico" className="py-20 bg-background section-separator">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-5">
          <span className="text-sm font-semibold tracking-wider uppercase text-primary">Diagnóstico gratuito</span>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground leading-tight">Lead que espera, esfria.</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Na sua imobiliária ninguém serve café frio para um cliente. No WhatsApp isso acontece todo dia: o lead chega, espera
            horas pela resposta e, quando o corretor responde, ele já conversou com outras duas imobiliárias.
          </p>
          <ul className="space-y-2 text-foreground">
            <li className="flex gap-2"><span className="text-primary">✓</span> Quantos leads esfriam por mês na sua operação</li>
            <li className="flex gap-2"><span className="text-primary">✓</span> Quanto isso custa em comissão</li>
            <li className="flex gap-2"><span className="text-primary">✓</span> Os primeiros passos para responder mais rápido</li>
          </ul>
        </div>
        <Card className="p-8 shadow-2xl border-2 border-primary/20 bg-card text-center">
          <p className="text-sm font-semibold tracking-wider uppercase text-primary">3 perguntas · 2 minutos</p>
          <h3 className="text-2xl font-bold text-foreground mt-2">Qual a temperatura dos seus leads?</h3>
          <p className="text-muted-foreground mt-3 mb-6">
            Responda sobre a sua operação e veja na hora quanto em comissão pode estar esfriando no WhatsApp.
          </p>
          <Link to="/diagnostico" onClick={() => track('diagnostico_cta_home')}>
            <Button size="lg" className="w-full font-semibold">Medir a temperatura dos meus leads</Button>
          </Link>
          <p className="text-xs text-muted-foreground mt-4">Grátis e sem compromisso.</p>
        </Card>
      </div>
    </div>
  </section>
);

export default DiagnosticSection;
