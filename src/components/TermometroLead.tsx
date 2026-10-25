import { useEffect, useMemo, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

/**
 * Termômetro do Lead: estima quanto a imobiliária perde com leads que esfriam esperando resposta.
 * As taxas por tempo de resposta são suposições conservadoras, editáveis pelo visitante.
 */
const ESFRIA_POR_TEMPO: Record<string, { label: string; pct: number; temp: string }> = {
  '5min': { label: 'Até 5 minutos', pct: 10, temp: 'quente' },
  '1h': { label: 'Até 1 hora', pct: 25, temp: 'morno' },
  '4h': { label: 'Até 4 horas', pct: 40, temp: 'esfriando' },
  'mais': { label: 'Mais de 4 horas', pct: 55, temp: 'frio' },
};

export interface ResultadoTermometro {
  leadsEsfriados: number;
  vendasPerdidas: number;
  comissaoMes: number;
  resumo: string;
}

const brl = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });

const pushEvent = (event: string, data: Record<string, unknown>) => {
  const w = window as unknown as { dataLayer?: Record<string, unknown>[] };
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({ event, ...data });
};

interface Props {
  onResultado: (r: ResultadoTermometro) => void;
}

const TermometroLead = ({ onResultado }: Props) => {
  const [leads, setLeads] = useState(200);
  const [tempo, setTempo] = useState('4h');
  const [esfria, setEsfria] = useState(ESFRIA_POR_TEMPO['4h'].pct);
  const [conversao, setConversao] = useState(2);
  const [ticket, setTicket] = useState(600000);
  const [comissao, setComissao] = useState(5);

  // trocar o tempo de resposta sugere a taxa de esfriamento correspondente
  useEffect(() => setEsfria(ESFRIA_POR_TEMPO[tempo].pct), [tempo]);

  const r = useMemo<ResultadoTermometro>(() => {
    const leadsEsfriados = Math.round(leads * (esfria / 100));
    const vendasPerdidas = leadsEsfriados * (conversao / 100);
    const comissaoMes = vendasPerdidas * ticket * (comissao / 100);
    const resumo = `Termômetro do Lead: ${leads} leads/mês, resposta ${ESFRIA_POR_TEMPO[tempo].label.toLowerCase()}, ${esfria}% esfriam, conversão ${conversao}%, ticket ${brl(ticket)}, comissão ${comissao}%. Estimativa: ${leadsEsfriados} leads frios, ${vendasPerdidas.toFixed(1)} vendas e ${brl(comissaoMes)} de comissão perdidos por mês.`;
    return { leadsEsfriados, vendasPerdidas, comissaoMes, resumo };
  }, [leads, tempo, esfria, conversao, ticket, comissao]);

  // só repassa depois que o visitante mexeu em algum número (os valores iniciais são só exemplo)
  const primeiro = useRef(true);
  useEffect(() => {
    if (primeiro.current) { primeiro.current = false; return; }
    onResultado(r);
  }, [r, onResultado]);

  const temp = ESFRIA_POR_TEMPO[tempo].temp;
  const inputCls = 'w-full px-3 py-2 border border-border rounded-lg bg-card text-foreground focus:ring-2 focus:ring-primary focus:border-transparent';

  const campo = (label: string, el: React.ReactNode, dica?: string) => (
    <label className="block space-y-1">
      <span className="text-sm font-medium text-foreground">{label}</span>
      {el}
      {dica && <span className="block text-xs text-muted-foreground">{dica}</span>}
    </label>
  );

  const num = (v: number, set: (n: number) => void, min: number, max: number, step = 1) => (
    <input type="number" inputMode="decimal" min={min} max={max} step={step} value={v} className={inputCls}
      onChange={(e) => set(Math.min(max, Math.max(min, Number(e.target.value) || 0)))} />
  );

  return (
    <Card className="p-6 sm:p-8 border-2 border-primary/20">
      <div className="mb-6">
        <span className="text-sm font-semibold tracking-wider uppercase text-primary">Termômetro do Lead</span>
        <h3 className="text-2xl font-bold text-foreground mt-1">Quanto custa o café frio da sua imobiliária?</h3>
        <p className="text-muted-foreground mt-2">
          Coloque os números da sua operação e veja quanto em comissão pode estar esfriando no WhatsApp todo mês.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {campo('Leads por mês', num(leads, setLeads, 0, 100000), 'Somando portais, anúncios e site')}
        {campo('Tempo médio da 1ª resposta', (
          <select value={tempo} onChange={(e) => setTempo(e.target.value)} className={inputCls}>
            {Object.entries(ESFRIA_POR_TEMPO).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        ))}
        {campo('% de leads que esfriam', num(esfria, setEsfria, 0, 100), 'Sugestão pelo tempo de resposta, pode ajustar')}
        {campo('% de leads que viram venda', num(conversao, setConversao, 0, 100, 0.1))}
        {campo('Ticket médio do imóvel (R$)', num(ticket, setTicket, 0, 100000000, 10000))}
        {campo('Comissão (%)', num(comissao, setComissao, 0, 100, 0.5))}
      </div>

      <div className="mt-6 rounded-xl bg-primary/5 border border-primary/20 p-5 grid gap-4 sm:grid-cols-3 text-center">
        <div>
          <div className="text-3xl font-bold text-foreground">{r.leadsEsfriados}</div>
          <div className="text-sm text-muted-foreground">leads esfriam por mês ({temp})</div>
        </div>
        <div>
          <div className="text-3xl font-bold text-foreground">{r.vendasPerdidas.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}</div>
          <div className="text-sm text-muted-foreground">vendas que podem estar ficando pelo caminho</div>
        </div>
        <div>
          <div className="text-3xl font-bold text-primary">{brl(r.comissaoMes)}</div>
          <div className="text-sm text-muted-foreground">de comissão por mês, {brl(r.comissaoMes * 12)} por ano</div>
        </div>
      </div>

      <div className="mt-5 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <p className="text-xs text-muted-foreground max-w-xl">
          É uma estimativa: as taxas de esfriamento por tempo de resposta são suposições conservadoras. No diagnóstico medimos os números reais da sua operação.
        </p>
        <Button
          onClick={() => {
            pushEvent('termometro_lead_cta', { leads, tempo, esfria, comissao_mes: Math.round(r.comissaoMes) });
            document.getElementById('diagnostico-form')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }}
        >
          Quero servir o café quente
        </Button>
      </div>
    </Card>
  );
};

export default TermometroLead;
