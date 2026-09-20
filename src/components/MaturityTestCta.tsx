import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import ProcessShieldBadge from '@/components/ProcessShieldBadge';
import { LEVELS, type Level } from '@/data/maturityTest';

const STEPS: Level[] = [1, 2, 3, 4, 5];

const MaturityTestCta = () => (
  <section id="teste-maturidade" className="py-20 bg-secondary section-separator">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <ProcessShieldBadge size={64} className="mb-6" />
          <p className="text-sm font-semibold tracking-widest uppercase text-primary mb-3">Modelo de Maturidade Imobiliária</p>
          <h2 className="text-4xl font-bold text-foreground mb-4">Em qual nível de maturidade está a sua imobiliária?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Responda 10 perguntas sobre a rotina da sua operação e descubra o seu nível, do artesanal à IA, e o gargalo que trava o
            próximo passo. Você recebe o resultado em PDF.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Button asChild size="lg" className="font-semibold px-8">
              <Link to="/teste-maturidade">Fazer o teste gratuito</Link>
            </Button>
            <span className="text-sm text-muted-foreground">10 perguntas, menos de 3 minutos</span>
          </div>
        </div>

        <ol className="space-y-3" aria-label="Os 5 níveis do modelo">
          {STEPS.map((n) => (
            <li
              key={n}
              className="flex items-center gap-4 rounded-lg border border-border bg-card px-5 py-4"
              style={{ marginLeft: `${(n - 1) * 20}px` }}
            >
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-[#0A0A10]"
                style={{ backgroundColor: LEVELS[n].color }}
                aria-hidden="true"
              >
                {n}
              </span>
              <span className="font-semibold text-foreground">
                Nível {n}: <span className="font-medium text-muted-foreground">{LEVELS[n].name}</span>
              </span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  </section>
);

export default MaturityTestCta;
