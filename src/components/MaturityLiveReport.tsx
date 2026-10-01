import { useEffect, useRef, useState } from 'react';
import { Lock } from 'lucide-react';
import MaturityRadar from '@/components/MaturityRadar';
import { LEVELS, computePartial, type Level } from '@/data/maturityTest';

const NEUTRAL = '#9B5AF6';

/** Anima as notas do radar até o valor novo, para o relatório parecer estar sendo montado. */
function useAnimatedScores(target: (number | null)[]) {
  const [shown, setShown] = useState<(number | null)[]>(target);
  const from = useRef<(number | null)[]>(target);
  const key = target.map((v) => (v == null ? 'x' : v)).join('|');
  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const start = from.current;
    if (reduce) {
      from.current = target;
      setShown(target);
      return;
    }
    const t0 = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const k = Math.min(1, (now - t0) / 450);
      const ease = 1 - Math.pow(1 - k, 3);
      const next = target.map((v, i) => {
        if (v == null) return null;
        const a = start[i] ?? 0;
        return a + (v - a) * ease;
      });
      setShown(next);
      if (k < 1) raf = requestAnimationFrame(tick);
      else from.current = target;
    };
    raf = requestAnimationFrame(tick);
    // Aba em segundo plano pausa o requestAnimationFrame: garante o valor final mesmo assim.
    const done = window.setTimeout(() => {
      cancelAnimationFrame(raf);
      from.current = target;
      setShown(target);
    }, 600);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(done);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  return shown;
}

interface Props {
  answers: (number | null)[];
  name: string;
}

/** Relatório parcial que se monta ao lado das perguntas, a cada resposta. */
const MaturityLiveReport = ({ answers, name }: Props) => {
  const partial = computePartial(answers);
  const shown = useAnimatedScores(partial.dimensions.map((d) => d.score));
  const dims = partial.dimensions.map((d, i) => ({ ...d, score: shown[i] }));
  const level = partial.answered >= 2 ? partial.level : null;
  const info = level ? LEVELS[level as Level] : null;
  const color = info?.color ?? NEUTRAL;
  const firstName = name.trim().split(/\s+/)[0] || '';

  const complete = partial.dimensions.filter((d) => d.answered === 2 && d.score != null);
  let insight = 'Responda a primeira pergunta e veja o radar da sua imobiliária ganhar forma.';
  if (partial.answered > 0 && complete.length < 2) {
    insight = 'Cada resposta acende uma ponta do radar. Com duas frentes completas, mostramos onde você está mais forte.';
  }
  if (complete.length >= 2) {
    const strong = complete.reduce((a, b) => ((b.score as number) > (a.score as number) ? b : a));
    const weak = complete.reduce((a, b) => ((b.score as number) < (a.score as number) ? b : a));
    insight =
      (strong.score as number) - (weak.score as number) < 0.5
        ? 'Até aqui, as frentes respondidas estão num patamar parecido.'
        : `Até aqui, sua frente mais forte é ${strong.name.toLowerCase()} (${(strong.score as number).toFixed(1)}) e a que mais pede atenção é ${weak.name.toLowerCase()} (${(weak.score as number).toFixed(1)}).`;
  }
  const nextLevel = level && level < 5 ? level + 1 : null;

  return (
    <aside aria-label="Seu diagnóstico em construção" className="rounded-xl border border-border bg-card p-4 lg:p-5">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-primary">
          {firstName ? `Diagnóstico de ${firstName}` : 'Seu diagnóstico'}
        </h2>
        <span className="text-xs text-muted-foreground tabular-nums">
          {partial.completeDimensions} de 5 frentes
        </span>
      </div>

      {/* Versão compacta no celular: radar pequeno ao lado do nível */}
      <div className="mt-2 flex items-center gap-4 lg:mt-3 lg:block">
        <div className="w-20 shrink-0 lg:w-full lg:mt-2">
          <div className="lg:hidden">
            <MaturityRadar dimensions={dims} color={color} compact />
          </div>
          <div className="hidden lg:block">
            <MaturityRadar dimensions={dims} color={color} />
          </div>
        </div>
        <div className="min-w-0 lg:mt-2" aria-live="polite">
          <p className="text-xs text-muted-foreground">Nível provável até agora</p>
          {info ? (
            <p className="font-semibold text-foreground">
              <span style={{ color }}>Nível {level}</span> · {info.name}
            </p>
          ) : (
            <p className="font-semibold text-muted-foreground">Aparece após 2 respostas</p>
          )}
        </div>
      </div>

      <p className="mt-3 hidden text-sm text-muted-foreground lg:block">{insight}</p>

      <ul className="mt-4 hidden space-y-1.5 lg:block">
        {partial.dimensions.map((d) => (
          <li key={d.id} className="flex items-center justify-between gap-3 text-sm">
            <span className={d.answered ? 'text-foreground' : 'text-muted-foreground'}>{d.name}</span>
            <span className="tabular-nums text-muted-foreground">
              {d.score == null ? 'a responder' : d.answered < 2 ? `${d.score.toFixed(1)} parcial` : d.score.toFixed(1)}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-5 hidden rounded-lg border border-dashed border-border p-4 lg:block">
        <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Lock className="h-4 w-4 text-primary" aria-hidden="true" />
          Libera ao terminar
        </p>
        <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
          <li>{nextLevel ? `O gargalo que trava a passagem para o Nível ${nextLevel}` : 'O gargalo que trava o próximo nível'}</li>
          <li>3 ações práticas para destravar</li>
          <li>O relatório em PDF com o seu radar</li>
        </ul>
        <div className="mt-3 space-y-2 select-none blur-[3px]" aria-hidden="true">
          <div className="h-2.5 w-11/12 rounded bg-muted" />
          <div className="h-2.5 w-9/12 rounded bg-muted" />
          <div className="h-2.5 w-10/12 rounded bg-muted" />
        </div>
      </div>
    </aside>
  );
};

export default MaturityLiveReport;
