import { DIMENSIONS } from '@/data/maturityTest';

interface Props {
  /** Nota de 0 a 5 por frente; null quando a frente ainda não foi respondida. */
  dimensions: { id: string; name: string; score: number | null }[];
  color: string;
  /** Sem rótulos, para a versão pequena do relatório ao vivo. */
  compact?: boolean;
}

const CX = 200;
const CY = 150;
const R = 96;

const point = (i: number, ratio: number) => {
  const angle = -Math.PI / 2 + (i * 2 * Math.PI) / DIMENSIONS.length;
  return { x: CX + Math.cos(angle) * R * ratio, y: CY + Math.sin(angle) * R * ratio, cos: Math.cos(angle) };
};

const poly = (ratios: number[]) => ratios.map((r, i) => `${point(i, r).x.toFixed(1)},${point(i, r).y.toFixed(1)}`).join(' ');

/** Radar das cinco frentes, escala de 0 a 5. */
const MaturityRadar = ({ dimensions, color, compact = false }: Props) => {
  const summary = dimensions
    .map((d) => `${d.name}: ${d.score == null ? 'ainda sem resposta' : `${d.score.toFixed(1)} de 5`}`)
    .join('; ');
  const ratio = (s: number | null) => (s ?? 0) / 5;
  return (
    <svg
      viewBox={compact ? '96 46 208 208' : '0 0 400 300'}
      className="w-full h-auto"
      role="img"
      aria-label={`Radar da maturidade. ${summary}`}
    >
      {[1, 2, 3, 4, 5].map((n) => (
        <polygon
          key={n}
          points={poly(DIMENSIONS.map(() => n / 5))}
          fill="none"
          stroke="hsl(var(--border))"
          strokeWidth={n === 5 ? 1.4 : 1}
        />
      ))}
      {DIMENSIONS.map((_, i) => {
        const p = point(i, 1);
        return <line key={i} x1={CX} y1={CY} x2={p.x} y2={p.y} stroke="hsl(var(--border))" strokeWidth={1} />;
      })}
      <polygon
        points={poly(dimensions.map((d) => ratio(d.score)))}
        fill={color}
        fillOpacity={0.22}
        stroke={color}
        strokeWidth={2.2}
        strokeLinejoin="round"
      />
      {dimensions.map((d, i) => {
        if (d.score == null) return null;
        const p = point(i, ratio(d.score));
        return <circle key={d.id} cx={p.x} cy={p.y} r={4} fill={color} stroke="hsl(var(--card))" strokeWidth={1.5} />;
      })}
      {!compact &&
        DIMENSIONS.map((d, i) => {
          const p = point(i, 1.2);
          const anchor = Math.abs(p.cos) < 0.2 ? 'middle' : p.cos > 0 ? 'start' : 'end';
          const s = dimensions[i].score;
          return (
            <text key={d.id} x={p.x} y={p.y} textAnchor={anchor} fontSize={13} fill="hsl(var(--foreground))" fontWeight={600}>
              <tspan x={p.x} dy={i === 0 ? -4 : 0}>
                {d.short}
              </tspan>
              <tspan x={p.x} dy={15} fontSize={12} fontWeight={500} fill="hsl(var(--muted-foreground))">
                {s == null ? '—' : s.toFixed(1)}
              </tspan>
            </text>
          );
        })}
    </svg>
  );
};

export default MaturityRadar;
