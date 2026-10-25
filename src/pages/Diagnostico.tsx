import { useEffect, useMemo, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { logError } from '@/lib/logger';

/**
 * Diagnóstico de leads em etapas. Cada etapa grava na mesma linha de diagnostico_respostas
 * (begin -> save -> complete), igual ao Teste de Maturidade. O e-mail para a OCA só sai no fim.
 */
type Step = 'intro' | 'operacao' | 'atendimento' | 'negocio' | 'resultado' | 'obrigado';
const FLOW: Step[] = ['operacao', 'atendimento', 'negocio', 'resultado'];

const PAGE_URL = 'https://www.ocadigital.com.br/diagnostico';
const TITLE = 'Lead que espera, esfria: quanto a sua imobiliária perde no WhatsApp? | OCA Digital';
const DESCRIPTION =
  'Responda 3 perguntas rápidas sobre a sua operação e veja quantos leads esfriam esperando resposta e quanto isso custa em comissão. Grátis, leva 2 minutos.';

const ORIGENS: [string, string][] = [
  ['portais', 'Portais (ZAP, VivaReal, Imovelweb)'],
  ['anuncios', 'Anúncios (Meta, Google)'],
  ['site', 'Site da imobiliária'],
  ['redes', 'Instagram e redes sociais'],
  ['indicacao', 'Indicação'],
  ['placas', 'Placas e plantão'],
];

// Mesma tabela usada pelo banco (coluna esfria_pct): suposições conservadoras, ditas como estimativa na página
const TEMPOS: { id: string; label: string; esfria: number; temp: string }[] = [
  { id: '5min', label: 'Em até 5 minutos', esfria: 10, temp: 'quente' },
  { id: '1h', label: 'Em até 1 hora', esfria: 25, temp: 'morno' },
  { id: '4h', label: 'Em até 4 horas', esfria: 40, temp: 'esfriando' },
  { id: 'mais', label: 'Mais de 4 horas', esfria: 55, temp: 'frio' },
];

const QUEM: [string, string][] = [
  ['corretor', 'Cada corretor no próprio WhatsApp'],
  ['recepcao', 'Uma recepção ou SDR que distribui'],
  ['robo', 'Um robô ou resposta automática'],
  ['eu', 'Eu mesmo, o dono'],
];

const COMPANY_TYPES: [string, string][] = [
  ['corretor-autonomo', 'Corretor autônomo'],
  ['pequena-imobiliaria', 'Pequena imobiliária (2 a 10 corretores)'],
  ['media-imobiliaria', 'Média imobiliária (11 a 50 corretores)'],
  ['grande-imobiliaria', 'Grande imobiliária (50+ corretores)'],
  ['incorporadora', 'Incorporadora'],
];

interface Respostas {
  leads_mes: number;
  origens: string[];
  tempo_resposta: string;
  quem_responde: string;
  conversao_pct: number;
  ticket_medio: number;
  comissao_pct: number;
}

const INICIAL: Respostas = {
  leads_mes: 150, origens: [], tempo_resposta: '', quem_responde: '',
  conversao_pct: 2, ticket_medio: 600000, comissao_pct: 5,
};

type Rpc = (fn: string, args: Record<string, unknown>) => Promise<{ data: unknown; error: { message: string } | null }>;
const rpc = supabase.rpc.bind(supabase) as unknown as Rpc;

const track = (event: string, data: Record<string, unknown> = {}) => {
  const w = window as unknown as { dataLayer?: unknown[] };
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({ event, ...data });
};

const readAttribution = () => {
  const p = new URLSearchParams(window.location.search);
  const out: Record<string, string> = {};
  ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'gclid', 'fbclid'].forEach((k) => {
    const v = p.get(k);
    if (v) out[k] = v.slice(0, 120);
  });
  const vid = document.cookie.match(/(?:^|; )visitor_id=([^;]*)/);
  if (vid) out.visitor_id = vid[1].slice(0, 40);
  return Object.keys(out).length ? out : null;
};

const brl = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });

export const calcula = (r: Respostas) => {
  const t = TEMPOS.find((x) => x.id === r.tempo_resposta) ?? TEMPOS[2];
  const frios = Math.round(r.leads_mes * (t.esfria / 100));
  const vendas = frios * (r.conversao_pct / 100);
  const comissao = vendas * r.ticket_medio * (r.comissao_pct / 100);
  return { tempo: t, frios, vendas, comissao };
};

const fieldClass =
  'w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-card text-foreground placeholder-muted-foreground';

const Diagnostico = () => {
  const [step, setStep] = useState<Step>('intro');
  const [r, setR] = useState<Respostas>(INICIAL);
  const [id, setId] = useState<string | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const { toast } = useToast();
  const res = useMemo(() => calcula(r), [r]);

  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  const set = <K extends keyof Respostas>(k: K, v: Respostas[K]) => setR((p) => ({ ...p, [k]: v }));

  /** Grava a etapa concluída e avança. Falha de rede não trava a pessoa: o contato no fim recria a linha. */
  const avancar = (de: Step, dados: Partial<Respostas>) => {
    const n = FLOW.indexOf(de) + 1;
    track('diagnostico_etapa', { etapa: n, nome: de });
    if (de === 'operacao' && !id) {
      rpc('begin_diagnostico', { p_dados: dados, p_utm: readAttribution(), p_referrer: document.referrer || null })
        .then(({ data, error }) => {
          if (error) logError('begin diagnostico error:', error);
          else if (typeof data === 'string') setId(data);
        });
    } else if (id) {
      rpc('save_diagnostico', { p_id: id, p_step: n, p_dados: dados }).then(({ error }) => {
        if (error) logError('save diagnostico error:', error);
      });
    }
    setStep(FLOW[n]);
  };

  const enviar = async (c: { name: string; email: string; phone: string; company: string; companyType: string }) => {
    try {
      let rowId = id;
      if (!rowId) {
        // a linha não nasceu na etapa 1 (rede instável): cria agora com tudo
        const { data, error } = await rpc('begin_diagnostico', { p_dados: r, p_utm: readAttribution(), p_referrer: document.referrer || null });
        if (error) throw error;
        rowId = data as string;
        setId(rowId);
      }
      const { error } = await rpc('complete_diagnostico', {
        p_id: rowId, p_name: c.name, p_email: c.email, p_phone: c.phone,
        p_company: c.company || null, p_company_type: c.companyType || null,
      });
      if (error) throw error;

      const origens = r.origens.map((o) => ORIGENS.find(([k]) => k === o)?.[1] ?? o).join(', ') || 'não informado';
      const quem = QUEM.find(([k]) => k === r.quem_responde)?.[1] ?? 'não informado';
      const resumo = [
        `Concluiu o diagnóstico de leads (/diagnostico). ID: ${rowId}`,
        `Leads por mês: ${r.leads_mes} (origens: ${origens})`,
        `1ª resposta: ${res.tempo.label.toLowerCase()} · quem responde: ${quem}`,
        `Conversão ${r.conversao_pct}% · ticket ${brl(r.ticket_medio)} · comissão ${r.comissao_pct}%`,
        `Estimativa: ${res.frios} leads esfriam por mês, ${res.vendas.toFixed(1)} vendas e ${brl(res.comissao)} de comissão perdidos por mês (${brl(res.comissao * 12)} por ano).`,
        `Empresa: ${c.company || 'não informada'}`,
      ].join('\n');
      const { error: mailError } = await supabase.functions.invoke('send-contact-email', {
        body: {
          form: 'diagnostico', nome: c.name, email: c.email, telefone: c.phone,
          tipo_de_empresa: c.companyType || 'nao-informado', servico: 'diagnostico-leads', comment: resumo,
        },
      });
      if (mailError) logError('diagnostico email error:', mailError);

      track('diagnostico_lead', { comissao_mes: Math.round(res.comissao), tempo: r.tempo_resposta });
      setStep('obrigado');
    } catch (e) {
      logError('complete diagnostico error:', e);
      toast({ title: 'Não foi possível enviar', description: 'Confira os dados e tente de novo em instantes.', variant: 'destructive' });
    }
  };

  const progresso = step === 'intro' ? 0 : step === 'obrigado' ? 100 : ((FLOW.indexOf(step) + 1) / (FLOW.length + 1)) * 100;
  const voltar = () => setStep(FLOW.indexOf(step) > 0 ? FLOW[FLOW.indexOf(step) - 1] : 'intro');

  return (
    <div className="min-h-screen bg-background pt-24">
      <Helmet>
        <title>{TITLE}</title>
        <meta name="description" content={DESCRIPTION} />
        <link rel="canonical" href={PAGE_URL} />
        <meta property="og:title" content={TITLE} />
        <meta property="og:description" content={DESCRIPTION} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={PAGE_URL} />
      </Helmet>
      <Header />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        {step !== 'intro' && step !== 'obrigado' && (
          <div className="mb-8">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>{step === 'resultado' ? 'Resultado' : `Etapa ${FLOW.indexOf(step) + 1} de 3`}</span>
              <button type="button" onClick={voltar} className="underline hover:text-foreground">Voltar</button>
            </div>
            <Progress value={progresso} />
          </div>
        )}

        {step === 'intro' && (
          <div className="text-center">
            <p className="text-sm font-semibold tracking-widest uppercase text-primary mb-4">Diagnóstico gratuito</p>
            <h1 ref={headingRef} tabIndex={-1} className="text-4xl sm:text-5xl font-bold text-foreground mb-6 outline-none">
              Lead que espera, esfria.
            </h1>
            <p className="text-lg text-muted-foreground mb-4 max-w-2xl mx-auto">
              Na sua imobiliária ninguém serve café frio para um cliente. No WhatsApp isso acontece todo dia: o lead chega, espera
              horas pela resposta e, quando o corretor responde, ele já conversou com outras duas imobiliárias.
            </p>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Responda 3 perguntas sobre a sua operação e veja quantos leads esfriam por mês e quanto isso custa em comissão.
            </p>
            <div className="flex flex-wrap justify-center gap-3 mb-10 text-sm text-muted-foreground">
              <span className="px-3 py-1 rounded-full border border-border">3 perguntas</span>
              <span className="px-3 py-1 rounded-full border border-border">2 minutos</span>
              <span className="px-3 py-1 rounded-full border border-border">resultado na hora</span>
            </div>
            <Button size="lg" className="font-semibold px-10" onClick={() => { track('diagnostico_inicio'); setStep('operacao'); }}>
              Medir a temperatura dos meus leads
            </Button>
          </div>
        )}

        {step === 'operacao' && (
          <Etapa titulo="Quantos leads chegam por mês?" sub="Some tudo: portais, anúncios, site, Instagram e indicações." headingRef={headingRef}>
            <input type="number" inputMode="numeric" min={0} max={100000} value={r.leads_mes} aria-label="Leads por mês"
              onChange={(e) => set('leads_mes', Math.max(0, Number(e.target.value) || 0))} className={`${fieldClass} text-2xl font-bold`} />
            <p className="font-medium text-foreground mt-6 mb-3">De onde eles vêm? <span className="text-muted-foreground font-normal">(marque quantos quiser)</span></p>
            <div className="grid sm:grid-cols-2 gap-2">
              {ORIGENS.map(([k, l]) => {
                const on = r.origens.includes(k);
                return (
                  <button key={k} type="button" onClick={() => set('origens', on ? r.origens.filter((o) => o !== k) : [...r.origens, k])}
                    className={`text-left px-4 py-3 rounded-lg border transition ${on ? 'border-primary bg-primary/10 text-foreground' : 'border-border hover:border-primary/50'}`}>
                    {on ? '✓ ' : ''}{l}
                  </button>
                );
              })}
            </div>
            <Button className="w-full mt-8" size="lg" disabled={r.leads_mes < 1}
              onClick={() => avancar('operacao', { leads_mes: r.leads_mes, origens: r.origens })}>Continuar</Button>
          </Etapa>
        )}

        {step === 'atendimento' && (
          <Etapa titulo="Quanto tempo o lead espera pela primeira resposta?" sub="Pense na média, não no melhor dia." headingRef={headingRef}>
            <Opcoes valor={r.tempo_resposta} onChange={(v) => set('tempo_resposta', v)} opcoes={TEMPOS.map((t) => [t.id, t.label])} />
            <p className="font-medium text-foreground mt-6 mb-3">Quem responde primeiro?</p>
            <Opcoes valor={r.quem_responde} onChange={(v) => set('quem_responde', v)} opcoes={QUEM} />
            <Button className="w-full mt-8" size="lg" disabled={!r.tempo_resposta || !r.quem_responde}
              onClick={() => avancar('atendimento', { tempo_resposta: r.tempo_resposta, quem_responde: r.quem_responde })}>Continuar</Button>
          </Etapa>
        )}

        {step === 'negocio' && (
          <Etapa titulo="E quanto vale cada venda?" sub="Se não souber de cabeça, deixe os valores sugeridos." headingRef={headingRef}>
            <div className="grid sm:grid-cols-3 gap-4">
              <Campo label="% de leads que viram venda" valor={r.conversao_pct} step={0.1} onChange={(v) => set('conversao_pct', v)} max={100} />
              <Campo label="Ticket médio do imóvel (R$)" valor={r.ticket_medio} step={10000} onChange={(v) => set('ticket_medio', v)} max={100000000} />
              <Campo label="Comissão (%)" valor={r.comissao_pct} step={0.5} onChange={(v) => set('comissao_pct', v)} max={100} />
            </div>
            <Button className="w-full mt-8" size="lg"
              onClick={() => avancar('negocio', { conversao_pct: r.conversao_pct, ticket_medio: r.ticket_medio, comissao_pct: r.comissao_pct })}>
              Ver o resultado
            </Button>
          </Etapa>
        )}

        {step === 'resultado' && <Resultado r={r} res={res} onEnviar={enviar} headingRef={headingRef} />}

        {step === 'obrigado' && (
          <div className="text-center">
            <h1 ref={headingRef} tabIndex={-1} className="text-3xl sm:text-4xl font-bold text-foreground mb-4 outline-none">Recebemos o seu diagnóstico</h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Vamos analisar os seus números e chamar você no WhatsApp para marcar os 20 minutos. Lá mostramos onde os seus leads
              esfriam e o que resolver primeiro.
            </p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

type HeadingRef = React.RefObject<HTMLHeadingElement>;

const Etapa = ({ titulo, sub, headingRef, children }: { titulo: string; sub: string; headingRef: HeadingRef; children: React.ReactNode }) => (
  <Card className="p-6 sm:p-8">
    <h1 ref={headingRef} tabIndex={-1} className="text-2xl sm:text-3xl font-bold text-foreground outline-none">{titulo}</h1>
    <p className="text-muted-foreground mt-2 mb-6">{sub}</p>
    {children}
  </Card>
);

const Opcoes = ({ valor, onChange, opcoes }: { valor: string; onChange: (v: string) => void; opcoes: [string, string][] }) => (
  <div className="grid sm:grid-cols-2 gap-2" role="radiogroup">
    {opcoes.map(([k, l]) => (
      <button key={k} type="button" role="radio" aria-checked={valor === k} onClick={() => onChange(k)}
        className={`text-left px-4 py-3 rounded-lg border transition ${valor === k ? 'border-primary bg-primary/10 text-foreground font-medium' : 'border-border hover:border-primary/50'}`}>
        {l}
      </button>
    ))}
  </div>
);

const Campo = ({ label, valor, onChange, step, max }: { label: string; valor: number; onChange: (v: number) => void; step: number; max: number }) => (
  <label className="block space-y-1">
    <span className="text-sm font-medium text-foreground">{label}</span>
    <input type="number" inputMode="decimal" min={0} max={max} step={step} value={valor} className={fieldClass}
      onChange={(e) => onChange(Math.min(max, Math.max(0, Number(e.target.value) || 0)))} />
  </label>
);

const Resultado = ({ r, res, onEnviar, headingRef }: {
  r: Respostas; res: ReturnType<typeof calcula>; headingRef: HeadingRef;
  onEnviar: (c: { name: string; email: string; phone: string; company: string; companyType: string }) => Promise<void>;
}) => {
  const [c, setC] = useState({ name: '', email: '', phone: '', company: '', companyType: '' });
  const [enviando, setEnviando] = useState(false);
  const ok = c.name.trim().length >= 2 && /\S+@\S+\.\S+/.test(c.email) && c.phone.replace(/\D/g, '').length >= 10 && !!c.companyType;
  const ch = (k: keyof typeof c) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setC((p) => ({ ...p, [k]: e.target.value }));

  return (
    <div className="space-y-6">
      <Card className="p-6 sm:p-8 text-center">
        <p className="text-sm font-semibold tracking-widest uppercase text-primary">O café está {res.tempo.temp}</p>
        <h1 ref={headingRef} tabIndex={-1} className="text-2xl sm:text-3xl font-bold text-foreground mt-2 outline-none">
          Cerca de {res.frios} dos seus {r.leads_mes} leads esfriam todo mês
        </h1>
        <div className="grid sm:grid-cols-2 gap-4 mt-6">
          <div className="rounded-xl bg-primary/5 border border-primary/20 p-5">
            <div className="text-3xl font-bold text-foreground">{res.vendas.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}</div>
            <div className="text-sm text-muted-foreground">vendas por mês que podem estar ficando pelo caminho</div>
          </div>
          <div className="rounded-xl bg-primary/5 border border-primary/20 p-5">
            <div className="text-3xl font-bold text-primary">{brl(res.comissao)}</div>
            <div className="text-sm text-muted-foreground">de comissão por mês, {brl(res.comissao * 12)} por ano</div>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-5 max-w-xl mx-auto">
          Estimativa: usamos uma taxa conservadora de leads que esfriam para cada faixa de tempo de resposta ({res.tempo.esfria}% para{' '}
          {res.tempo.label.toLowerCase()}). No diagnóstico medimos os números reais da sua operação.
        </p>
      </Card>

      <Card className="p-6 sm:p-8">
        <h2 className="text-xl font-bold text-foreground">Quer servir o café quente?</h2>
        <p className="text-muted-foreground mt-1 mb-5">
          Deixe seu contato e marcamos 20 minutos para mostrar onde os seus leads esfriam e o que resolver primeiro. Sem compromisso.
        </p>
        <form className="grid gap-3" onSubmit={async (e) => { e.preventDefault(); if (!ok) return; setEnviando(true); await onEnviar(c); setEnviando(false); }}>
          <input className={fieldClass} placeholder="Nome" aria-label="Nome" value={c.name} onChange={ch('name')} />
          <div className="grid sm:grid-cols-2 gap-3">
            <input className={fieldClass} type="tel" placeholder="WhatsApp" aria-label="WhatsApp" value={c.phone} onChange={ch('phone')} />
            <input className={fieldClass} type="email" placeholder="E-mail" aria-label="E-mail" value={c.email} onChange={ch('email')} />
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <input className={fieldClass} placeholder="Imobiliária (opcional)" aria-label="Imobiliária" value={c.company} onChange={ch('company')} />
            <select className={fieldClass} aria-label="Tamanho da empresa" value={c.companyType} onChange={ch('companyType')}>
              <option value="">Tamanho da empresa</option>
              {COMPANY_TYPES.map(([k, l]) => <option key={k} value={k}>{l}</option>)}
            </select>
          </div>
          <Button type="submit" size="lg" disabled={!ok || enviando}>{enviando ? 'Enviando...' : 'Quero o diagnóstico de 20 minutos'}</Button>
          <p className="text-xs text-muted-foreground text-center">Seus dados estão protegidos. Não fazemos spam.</p>
        </form>
      </Card>
    </div>
  );
};

export default Diagnostico;
