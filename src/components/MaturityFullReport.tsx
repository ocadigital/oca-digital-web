import { ExternalLink } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  LEVEL_METRICS,
  MIRO_TEMPLATE_URL,
  evolutionMap,
  frontPlan,
  type Level,
  type TestResult,
} from '@/data/maturityTest';

interface Props {
  result: TestResult;
  answers: number[];
  onMiro: () => void;
}

/** Partes do diagnóstico que só aparecem depois do cadastro. */
const MaturityFullReport = ({ result, answers, onMiro }: Props) => {
  const plan = frontPlan(result);
  const steps = evolutionMap(answers);
  const metrics = LEVEL_METRICS[result.level as Level];
  return (
    <>
      <Card className="p-8 card-elevated">
        <p className="text-sm font-semibold tracking-widest uppercase text-primary mb-1">Plano por frente</p>
        <h2 className="text-2xl font-bold text-foreground mb-2">Uma ação para cada frente, na ordem de prioridade</h2>
        <p className="text-muted-foreground mb-6">Comece pela primeira: é a frente com a nota mais baixa.</p>
        <ol className="space-y-4">
          {plan.map((p, i) => (
            <li key={p.id} className="flex gap-4">
              <span
                className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  i === 0 ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'
                }`}
                aria-hidden="true"
              >
                {i + 1}
              </span>
              <div>
                <p className="font-semibold text-foreground">
                  {p.name} <span className="font-normal text-muted-foreground tabular-nums">· {p.score.toFixed(1)} de 5</span>
                </p>
                <p className="text-muted-foreground">{p.action}</p>
              </div>
            </li>
          ))}
        </ol>
      </Card>

      <Card className="p-8 card-elevated">
        <p className="text-sm font-semibold tracking-widest uppercase text-primary mb-1">Mapa de evolução</p>
        <h2 className="text-2xl font-bold text-foreground mb-2">Onde você está hoje e qual é o próximo degrau</h2>
        <p className="text-muted-foreground mb-6">Pergunta por pergunta, a sua resposta e o que muda quando a imobiliária sobe um nível.</p>
        <ul className="divide-y divide-border">
          {steps.map((s) => (
            <li key={s.question} className="py-4 first:pt-0 last:pb-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">{s.dimension}</p>
              <p className="font-semibold text-foreground mb-3">{s.question}</p>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg border border-border bg-muted/40 p-3">
                  <p className="text-xs font-semibold text-muted-foreground mb-1">Hoje</p>
                  <p className="text-sm text-foreground">{s.today}</p>
                </div>
                <div className="rounded-lg border border-primary/40 bg-primary/5 p-3">
                  <p className="text-xs font-semibold text-primary mb-1">Próximo degrau</p>
                  <p className="text-sm text-foreground">{s.next ?? 'Você já está no último degrau desta pergunta. O desafio é manter.'}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-8 card-elevated">
          <p className="text-sm font-semibold tracking-widest uppercase text-primary mb-1">Para medir a partir de agora</p>
          <h2 className="text-xl font-bold text-foreground mb-4">Indicadores para levar à próxima reunião</h2>
          <ul className="space-y-2">
            {metrics.map((m) => (
              <li key={m} className="flex gap-3 text-foreground">
                <span className="text-primary mt-0.5" aria-hidden="true">
                  ▸
                </span>
                <span>{m}</span>
              </li>
            ))}
          </ul>
        </Card>
        <Card className="p-8 card-elevated">
          <p className="text-sm font-semibold tracking-widest uppercase text-primary mb-1">Bônus</p>
          <h2 className="text-xl font-bold text-foreground mb-2">Modelo no Miro para blindar os processos</h2>
          <p className="text-muted-foreground mb-5">
            O quadro que usamos com os clientes, com os 3 passos: mapear visualmente, documentar regras e processos e
            estabelecer rotinas. Faça uma cópia e preencha com o seu time.
          </p>
          <Button asChild onClick={onMiro}>
            <a href={MIRO_TEMPLATE_URL} target="_blank" rel="noopener noreferrer">
              Abrir o modelo no Miro <ExternalLink className="ml-2 h-4 w-4" aria-hidden="true" />
            </a>
          </Button>
        </Card>
      </div>
    </>
  );
};

export default MaturityFullReport;
