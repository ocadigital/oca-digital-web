import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { logError } from '@/lib/logger';
import {
  BOTTLENECKS,
  LEVELS,
  LEVEL_5_ACTIONS,
  QUESTIONS,
  computeResult,
  type Level,
} from '@/data/maturityTest';

type Step = 'intro' | 'quiz' | 'result';

const PAGE_URL = 'https://www.ocadigital.com.br/teste-maturidade';
const GUIDE_PATH = '/blog/blindagem-de-processos-imobiliaria-guia-completo';
const TITLE = 'Teste de Maturidade Imobiliária: em qual dos 5 níveis está a sua imobiliária? | OCA Digital';
const DESCRIPTION =
  'Responda 10 perguntas e descubra o nível de maturidade da sua imobiliária, do artesanal à IA, e qual gargalo trava o próximo passo. Grátis e sem cadastro para ver o resultado.';

type Rpc = (fn: string, args: Record<string, unknown>) => Promise<{ data: unknown; error: { message: string } | null }>;
const rpc = supabase.rpc.bind(supabase) as unknown as Rpc;

const track = (event: string, data: Record<string, unknown> = {}) => {
  const w = window as unknown as { dataLayer?: unknown[] };
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({ event, ...data });
};

const readUtm = () => {
  const p = new URLSearchParams(window.location.search);
  const utm: Record<string, string> = {};
  ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach((k) => {
    const v = p.get(k);
    if (v) utm[k] = v.slice(0, 100);
  });
  return Object.keys(utm).length ? utm : null;
};

const COMPANY_TYPES = [
  ['corretor-autonomo', 'Corretor autônomo'],
  ['pequena-imobiliaria', 'Pequena imobiliária'],
  ['media-imobiliaria', 'Média imobiliária'],
  ['grande-imobiliaria', 'Grande imobiliária'],
  ['incorporadora', 'Incorporadora'],
];

const MaturityTest = () => {
  const [step, setStep] = useState<Step>('intro');
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(() => QUESTIONS.map(() => null));
  const [responseId, setResponseId] = useState<string | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const { toast } = useToast();

  const result = useMemo(() => {
    if (answers.some((a) => a === null)) return null;
    return computeResult(answers as number[]);
  }, [answers]);

  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step, index]);

  const start = () => {
    track('maturity_test_start');
    setStep('quiz');
  };

  const finish = useCallback(async (all: number[]) => {
    const r = computeResult(all);
    setStep('result');
    track('maturity_test_complete', { maturity_level: r.level, maturity_score: r.overall });
    try {
      const { data, error } = await rpc('submit_maturity_test', {
        p_answers: all,
        p_dimension_scores: Object.fromEntries(r.dimensions.map((d) => [d.id, d.score])),
        p_overall: r.overall,
        p_level: r.level,
        p_weakest: r.weakest.name,
        p_utm: readUtm(),
        p_referrer: document.referrer || null,
      });
      if (error) throw error;
      setResponseId(typeof data === 'string' ? data : null);
    } catch (e) {
      logError('maturity submit error:', e);
    }
  }, []);

  const choose = useCallback(
    (value: number) => {
      const next = [...answers];
      next[index] = value;
      setAnswers(next);
      window.setTimeout(() => {
        if (index < QUESTIONS.length - 1) setIndex(index + 1);
        else finish(next as number[]);
      }, 220);
    },
    [answers, index, finish],
  );

  useEffect(() => {
    if (step !== 'quiz') return;
    const onKey = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((document.activeElement?.tagName ?? ''))) return;
      const n = Number(e.key);
      if (n >= 1 && n <= 5) choose(n);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [step, choose]);

  const restart = () => {
    setAnswers(QUESTIONS.map(() => null));
    setIndex(0);
    setResponseId(null);
    setStep('intro');
  };

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
        {step === 'intro' && <Intro onStart={start} headingRef={headingRef} />}
        {step === 'quiz' && (
          <Quiz
            index={index}
            answer={answers[index]}
            onChoose={choose}
            onBack={() => (index > 0 ? setIndex(index - 1) : setStep('intro'))}
            headingRef={headingRef}
          />
        )}
        {step === 'result' && result && (
          <Result
            result={result}
            answers={answers as number[]}
            responseId={responseId}
            onRestart={restart}
            headingRef={headingRef}
            toast={toast}
          />
        )}
      </main>
      <Footer />
    </div>
  );
};

type HeadingRef = React.RefObject<HTMLHeadingElement>;

const Intro = ({ onStart, headingRef }: { onStart: () => void; headingRef: HeadingRef }) => (
  <div className="text-center">
    <p className="text-sm font-semibold tracking-widest uppercase text-primary mb-4">Modelo de Maturidade Imobiliária</p>
    <h1 ref={headingRef} tabIndex={-1} className="text-4xl sm:text-5xl font-bold text-foreground mb-6 outline-none">
      Em qual dos 5 níveis está a sua imobiliária?
    </h1>
    <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
      Responda 10 perguntas sobre a rotina da sua operação e descubra o seu nível, do artesanal à IA, e qual gargalo trava o
      próximo passo.
    </p>
    <div className="flex flex-wrap justify-center gap-3 mb-10 text-sm text-muted-foreground">
      <span className="px-3 py-1 rounded-full border border-border">10 perguntas</span>
      <span className="px-3 py-1 rounded-full border border-border">menos de 3 minutos</span>
      <span className="px-3 py-1 rounded-full border border-border">resultado sem cadastro</span>
    </div>
    <Button size="lg" className="font-semibold px-10" onClick={onStart}>
      Começar o teste
    </Button>
    <p className="text-sm text-muted-foreground mt-8 max-w-xl mx-auto">
      O modelo se inspira no CMMI e no MPS.BR e foi adaptado pela OCA Digital para a rotina de imobiliárias. É uma estimativa
      baseada nas suas respostas, não uma certificação.{' '}
      <Link to={GUIDE_PATH} className="underline text-primary">
        Leia o guia completo
      </Link>
      .
    </p>
    <figure className="mt-14 text-center">
      <h2 className="text-2xl font-bold text-foreground mb-2">Conheça os 5 níveis antes de começar</h2>
      <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
        Cada nível tem um indicador principal, e cada passagem tem um gargalo a destravar.
      </p>
      <img
        src="/images/blog/modelo-maturidade-imobiliaria-infografico.webp"
        alt="Infográfico com os 5 níveis do Modelo de Maturidade Imobiliária, do artesanal à IA, com o gargalo de cada passagem (centralizar os dados, especializar e treinar, decidir por dados e automatizar com IA) e os 3 pilares da Blindagem de Processos"
        width={1200}
        height={1800}
        loading="lazy"
        decoding="async"
        className="mx-auto w-full max-w-[640px] h-auto rounded-xl border border-border"
      />
    </figure>
  </div>
);

const Quiz = ({
  index,
  answer,
  onChoose,
  onBack,
  headingRef,
}: {
  index: number;
  answer: number | null;
  onChoose: (v: number) => void;
  onBack: () => void;
  headingRef: HeadingRef;
}) => {
  const q = QUESTIONS[index];
  return (
    <div>
      <div className="mb-8">
        <div className="flex justify-between text-sm text-muted-foreground mb-2">
          <span>
            Pergunta {index + 1} de {QUESTIONS.length}
          </span>
          <span>{q.dimension}</span>
        </div>
        <Progress value={((index + 1) / QUESTIONS.length) * 100} className="h-2" aria-label="Progresso do teste" />
      </div>
      <h2 ref={headingRef} tabIndex={-1} className="text-2xl sm:text-3xl font-bold text-foreground mb-6 outline-none">
        {q.text}
      </h2>
      <div role="radiogroup" aria-label={q.text} className="space-y-3">
        {q.options.map((opt, i) => {
          const value = i + 1;
          const selected = answer === value;
          return (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChoose(value)}
              className={`w-full text-left px-5 py-4 rounded-lg border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary flex gap-4 items-start ${
                selected ? 'border-primary bg-primary/10 text-foreground' : 'border-border bg-card text-foreground hover:border-primary/60'
              }`}
            >
              <span
                className={`mt-0.5 shrink-0 w-6 h-6 rounded-full border text-xs font-semibold flex items-center justify-center ${
                  selected ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground'
                }`}
                aria-hidden="true"
              >
                {value}
              </span>
              <span>{opt}</span>
            </button>
          );
        })}
      </div>
      <div className="mt-8 flex items-center justify-between">
        <Button variant="ghost" onClick={onBack}>
          Voltar
        </Button>
        <span className="text-xs text-muted-foreground hidden sm:inline">Dica: use as teclas 1 a 5 para responder</span>
      </div>
    </div>
  );
};

const Result = ({
  result,
  answers,
  responseId,
  onRestart,
  headingRef,
  toast,
}: {
  result: ReturnType<typeof computeResult>;
  answers: number[];
  responseId: string | null;
  onRestart: () => void;
  headingRef: HeadingRef;
  toast: ReturnType<typeof useToast>['toast'];
}) => {
  const level = result.level as Level;
  const info = LEVELS[level];
  const next = level < 5 ? BOTTLENECKS[level as 1 | 2 | 3 | 4] : null;
  const actions = next ? next.actions : LEVEL_5_ACTIONS;

  const shareText = `Fiz o Teste de Maturidade Imobiliária da OCA Digital e a minha imobiliária está no Nível ${level} de 5 (${info.name}). Descubra o seu: ${PAGE_URL}`;
  const share = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      toast({ title: 'Texto copiado', description: 'Cole onde quiser compartilhar.' });
    } catch {
      toast({ title: 'Não foi possível copiar', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-8">
      <Card className="p-8 card-elevated text-center">
        <p className="text-sm font-semibold tracking-widest uppercase text-muted-foreground mb-3">O resultado da sua imobiliária</p>
        <h1 ref={headingRef} tabIndex={-1} className="outline-none">
          <span className="block text-6xl font-bold mb-2" style={{ color: info.color }}>
            Nível {level}
            <span className="text-2xl text-muted-foreground font-medium"> de 5</span>
          </span>
          <span className="block text-2xl sm:text-3xl font-bold text-foreground">{info.name}</span>
        </h1>
        <div className="flex justify-center gap-2 mt-5" aria-hidden="true">
          {([1, 2, 3, 4, 5] as Level[]).map((n) => (
            <span
              key={n}
              className="h-2.5 w-12 rounded-full"
              style={{ backgroundColor: n <= level ? LEVELS[n].color : 'hsl(var(--border))' }}
            />
          ))}
        </div>
        <p className="text-muted-foreground mt-6 max-w-2xl mx-auto">{info.description}</p>
        <p className="text-sm text-muted-foreground mt-4">Pontuação média: {result.overall.toFixed(1)} de 5</p>
      </Card>

      <Card className="p-8 card-elevated">
        <h2 className="text-xl font-bold text-foreground mb-1">Como você está em cada frente</h2>
        <p className="text-sm text-muted-foreground mb-6">A frente mais baixa é a que mais puxa a sua operação para baixo.</p>
        <ul className="space-y-4">
          {result.dimensions.map((d) => {
            const weakest = d.id === result.weakest.id;
            return (
              <li key={d.id}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-foreground font-medium">
                    {d.name}
                    {weakest && <span className="ml-2 text-xs font-semibold text-primary">menor pontuação</span>}
                  </span>
                  <span className="text-muted-foreground tabular-nums">{d.score.toFixed(1)}</span>
                </div>
                <div className="h-2.5 rounded-full bg-muted overflow-hidden" role="img" aria-label={`${d.name}: ${d.score.toFixed(1)} de 5`}>
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${(d.score / 5) * 100}%`, backgroundColor: weakest ? 'hsl(var(--primary))' : info.color }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      </Card>

      <Card className="p-8 card-elevated">
        <p className="text-sm font-semibold tracking-widest uppercase text-primary mb-2">
          {next ? `Do Nível ${level} para o ${level + 1}` : 'Você está no topo do modelo'}
        </p>
        <h2 className="text-2xl font-bold text-foreground mb-3">{next ? `O gargalo: ${next.title.toLowerCase()}` : 'O próximo passo é manter o ritmo'}</h2>
        <p className="text-muted-foreground mb-5">
          {next ? next.text : 'No Nível 5 o desafio é não deixar a operação estagnar. Melhoria contínua é o que mantém a vantagem.'}
        </p>
        <ul className="space-y-2">
          {actions.map((a) => (
            <li key={a} className="flex gap-3 text-foreground">
              <span className="text-primary mt-0.5" aria-hidden="true">
                ✓
              </span>
              <span>{a}</span>
            </li>
          ))}
        </ul>
        {result.weakest.score <= result.overall - 0.4 && (
          <p className="mt-5 text-sm text-muted-foreground border-t border-border pt-4">
            Ponto de atenção: a sua frente com menor pontuação é <span className="text-foreground font-medium">{result.weakest.name.toLowerCase()}</span> (
            {result.weakest.score.toFixed(1)} de 5). Ela costuma ser a que mais segura a passagem para o próximo nível.
          </p>
        )}
      </Card>

      <LeadForm result={result} answers={answers} responseId={responseId} toast={toast} />

      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <Button asChild variant="outline">
          <Link to={GUIDE_PATH}>Ler o guia completo</Link>
        </Button>
        <Button variant="outline" onClick={share}>
          Copiar texto para compartilhar
        </Button>
        <Button variant="ghost" onClick={onRestart}>
          Refazer o teste
        </Button>
      </div>
    </div>
  );
};

const LeadForm = ({
  result,
  answers,
  responseId,
  toast,
}: {
  result: ReturnType<typeof computeResult>;
  answers: number[];
  responseId: string | null;
  toast: ReturnType<typeof useToast>['toast'];
}) => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', companyType: '', company: '', consent: false, website: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const level = result.level as Level;

  const set = (k: string, v: string | boolean) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: '' }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (form.name.trim().length < 2) e.name = 'Informe seu nome';
    if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'E-mail inválido';
    if (form.phone.replace(/\D/g, '').length < 10) e.phone = 'Informe um WhatsApp com DDD';
    if (!form.companyType) e.companyType = 'Selecione o tipo de empresa';
    if (!form.consent) e.consent = 'É preciso concordar para enviarmos o plano';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (form.website) return; // honeypot
    if (!validate()) return;
    setSending(true);
    let saved = false;
    try {
      if (responseId) {
        const { error } = await rpc('attach_maturity_lead', {
          p_id: responseId,
          p_name: form.name,
          p_email: form.email,
          p_phone: form.phone,
          p_company_type: form.companyType,
          p_company: form.company || null,
        });
        if (error) throw error;
        saved = true;
      }
    } catch (e) {
      logError('attach lead error:', e);
    }
    try {
      const summary = `Teste de Maturidade Imobiliária: Nível ${level} (${LEVELS[level].name}), média ${result.overall.toFixed(1)}/5. Frente mais fraca: ${result.weakest.name}. Empresa: ${form.company || 'não informada'}. Respostas: ${answers.join('-')}.`;
      const { error } = await supabase.functions.invoke('send-contact-email', {
        body: {
          form: 'maturity_test',
          nome: form.name,
          email: form.email,
          telefone: form.phone,
          tipo_de_empresa: form.companyType,
          servico: 'diagnostico-maturidade',
          comment: summary,
        },
      });
      if (error) throw error;
      saved = true;
    } catch (e) {
      logError('lead email error:', e);
    }
    setSending(false);
    if (saved) {
      track('maturity_test_lead', { maturity_level: level });
      setSent(true);
    } else {
      toast({ title: 'Erro ao enviar', description: 'Não foi possível enviar agora. Tente novamente em instantes.', variant: 'destructive' });
    }
  };

  const field =
    'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-card text-foreground placeholder-muted-foreground';

  if (sent) {
    return (
      <Card className="p-8 card-elevated text-center">
        <h2 className="text-2xl font-bold text-foreground mb-3">Recebemos os seus dados</h2>
        <p className="text-muted-foreground mb-6">
          A equipe da OCA Digital vai entrar em contato com um plano para levar a sua imobiliária do Nível {level} para o próximo.
        </p>
        <Button asChild>
          <Link to="/contact">Agendar uma conversa de 30 minutos</Link>
        </Button>
      </Card>
    );
  }

  return (
    <Card className="p-8 card-elevated">
      <h2 className="text-2xl font-bold text-foreground mb-2">Quer um plano para subir de nível?</h2>
      <p className="text-muted-foreground mb-6">
        Deixe seus dados e a OCA Digital entra em contato com um plano de ação para o seu caso. É opcional: o resultado acima já é seu.
      </p>
      <form onSubmit={submit} className="space-y-4" noValidate>
        <div className="hidden" aria-hidden="true">
          <label>
            Não preencha este campo
            <input tabIndex={-1} autoComplete="off" value={form.website} onChange={(e) => set('website', e.target.value)} />
          </label>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <input
              type="text"
              placeholder="Nome"
              aria-label="Nome"
              autoComplete="name"
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              className={`${field} ${errors.name ? 'border-red-500' : 'border-border'}`}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>
          <div>
            <input
              type="email"
              placeholder="E-mail"
              aria-label="E-mail"
              autoComplete="email"
              value={form.email}
              onChange={(e) => set('email', e.target.value)}
              className={`${field} ${errors.email ? 'border-red-500' : 'border-border'}`}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <input
              type="tel"
              placeholder="WhatsApp com DDD"
              aria-label="WhatsApp com DDD"
              autoComplete="tel"
              value={form.phone}
              onChange={(e) => set('phone', e.target.value)}
              className={`${field} ${errors.phone ? 'border-red-500' : 'border-border'}`}
            />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
          </div>
          <div>
            <select
              aria-label="Tipo de empresa"
              value={form.companyType}
              onChange={(e) => set('companyType', e.target.value)}
              className={`${field} ${errors.companyType ? 'border-red-500' : 'border-border'}`}
            >
              <option value="">Tipo de empresa</option>
              {COMPANY_TYPES.map(([v, l]) => (
                <option key={v} value={v}>
                  {l}
                </option>
              ))}
            </select>
            {errors.companyType && <p className="text-red-500 text-sm mt-1">{errors.companyType}</p>}
          </div>
        </div>
        <input
          type="text"
          placeholder="Nome da imobiliária (opcional)"
          aria-label="Nome da imobiliária (opcional)"
          autoComplete="organization"
          value={form.company}
          onChange={(e) => set('company', e.target.value)}
          className={`${field} border-border`}
        />
        <div>
          <label className="flex gap-3 items-start text-sm text-muted-foreground cursor-pointer">
            <input
              type="checkbox"
              checked={form.consent}
              onChange={(e) => set('consent', e.target.checked)}
              className="mt-1 h-4 w-4 accent-[hsl(var(--primary))]"
            />
            <span>
              Concordo em receber contato da OCA Digital sobre o meu resultado, conforme a{' '}
              <Link to="/politica-de-privacidade" className="underline text-primary" target="_blank">
                Política de Privacidade
              </Link>
              .
            </span>
          </label>
          {errors.consent && <p className="text-red-500 text-sm mt-1">{errors.consent}</p>}
        </div>
        <Button type="submit" className="w-full py-3 font-semibold" disabled={sending}>
          {sending ? 'Enviando...' : 'Quero o plano de ação'}
        </Button>
      </form>
    </Card>
  );
};

export default MaturityTest;
