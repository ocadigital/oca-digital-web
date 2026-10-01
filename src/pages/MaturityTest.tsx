import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProcessShieldBadge from '@/components/ProcessShieldBadge';
import MaturityRadar from '@/components/MaturityRadar';
import MaturityLiveReport from '@/components/MaturityLiveReport';
import MaturityFullReport from '@/components/MaturityFullReport';
import MaturityShare from '@/components/MaturityShare';
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
  diagnosisText,
  type Level,
  type TestResult,
} from '@/data/maturityTest';

type Step = 'intro' | 'profile' | 'quiz' | 'result';

/** Etapa inicial, antes das perguntas: nome e perfil da empresa. */
interface Profile {
  name: string;
  companyType: string;
}

/** Pedido só para liberar o diagnóstico completo e o PDF. */
interface Contact {
  email: string;
  phone: string;
  company: string;
}

const PAGE_URL = 'https://www.ocadigital.com.br/teste-maturidade';
const GUIDE_PATH = '/blog/blindagem-de-processos-imobiliaria-guia-completo';
const TITLE = 'Teste de Maturidade Imobiliária: em qual dos 5 níveis está a sua imobiliária? | OCA Digital';
const DESCRIPTION =
  'Responda 10 perguntas e descubra o nível de maturidade da sua imobiliária, do artesanal à IA, e qual gargalo trava o próximo passo. Grátis, leva menos de 3 minutos.';
const PROFILE_KEY = 'maturityProfile';
const CONTACT_KEY = 'maturityContact';

const COMPANY_TYPES: [string, string][] = [
  ['corretor-autonomo', 'Corretor autônomo'],
  ['pequena-imobiliaria', 'Pequena imobiliária'],
  ['media-imobiliaria', 'Média imobiliária'],
  ['grande-imobiliaria', 'Grande imobiliária'],
  ['incorporadora', 'Incorporadora'],
];
const companyTypeLabel = (v: string) => COMPANY_TYPES.find(([k]) => k === v)?.[1] ?? v;

type Rpc = (fn: string, args: Record<string, unknown>) => Promise<{ data: unknown; error: { message: string } | null }>;
const rpc = supabase.rpc.bind(supabase) as unknown as Rpc;

const track = (event: string, data: Record<string, unknown> = {}) => {
  const w = window as unknown as { dataLayer?: unknown[] };
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({ event, ...data });
};

const readStored = <T,>(key: string): T | null => {
  try {
    const raw = sessionStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
};

const store = (key: string, value: unknown) => {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* sessionStorage indisponível */
  }
};

const readCookie = (name: string) => {
  const m = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
  if (!m) return null;
  try {
    return decodeURIComponent(m[1]);
  } catch {
    return m[1];
  }
};

const CLICK_IDS = ['gclid', 'fbclid', 'msclkid'];
const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];

/**
 * UTMs da URL atual mais a atribuição gravada em cookie pelo script de rastreamento do GTM
 * (primeiro e último toque, página de entrada, origem, visitas). Sem os cookies, fica só a URL.
 */
const readAttribution = () => {
  const p = new URLSearchParams(window.location.search);
  const out: Record<string, string> = {};
  const put = (k: string, v: string | null, max = 120) => {
    if (v) out[k] = v.slice(0, max);
  };
  [...UTM_KEYS, ...CLICK_IDS].forEach((k) => {
    put(k, p.get(k));
    put(`first_${k}`, readCookie(`first_${k}`));
    put(`last_${k}`, readCookie(`last_${k}`));
  });
  put('visitor_id', readCookie('visitor_id'), 40);
  put('first_visit', readCookie('first_visit'), 30);
  put('visit_count', readCookie('visit_count'), 6);
  put('landing_page', readCookie('landing_page'), 200);
  put('first_referrer', readCookie('referrer'), 150);
  return Object.keys(out).length ? out : null;
};

const completeArgs = (id: string, all: number[], r: TestResult) => ({
  p_id: id,
  p_answers: all,
  p_dimension_scores: Object.fromEntries(r.dimensions.map((d) => [d.id, d.score])),
  p_overall: r.overall,
  p_level: r.level,
  p_weakest: r.weakest.name,
});

const MaturityTest = () => {
  const [step, setStep] = useState<Step>('intro');
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(() => QUESTIONS.map(() => null));
  const [profile, setProfile] = useState<Profile | null>(() => readStored<Profile>(PROFILE_KEY));
  const [contact, setContact] = useState<Contact | null>(() => readStored<Contact>(CONTACT_KEY));
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

  const onStartClick = () => {
    track('maturity_start_click');
    setStep('profile');
  };

  const onProfileSubmit = (p: Profile) => {
    store(PROFILE_KEY, p);
    setProfile(p);
    setAnswers(QUESTIONS.map(() => null));
    setIndex(0);
    setResponseId(null);
    track('maturity_test_start', { company_type: p.companyType });
    setStep('quiz');
    // Grava a linha já com nome e perfil, para quem desistir no meio aparecer no banco.
    rpc('begin_maturity_test', {
      p_name: p.name,
      p_company_type: p.companyType,
      p_utm: readAttribution(),
      p_referrer: document.referrer || null,
    }).then(({ data, error }) => {
      if (error) logError('begin maturity error:', error);
      else if (typeof data === 'string') setResponseId(data);
    });
  };

  const finish = useCallback(
    async (all: number[]) => {
      const r = computeResult(all);
      setStep('result');
      track('maturity_test_complete', { maturity_level: r.level, maturity_score: r.overall });
      if (!responseId) return;
      try {
        const { error } = await rpc('complete_maturity_test', completeArgs(responseId, all, r));
        if (error) throw error;
      } catch (e) {
        logError('complete maturity error:', e);
      }
    },
    [responseId],
  );

  const choose = useCallback(
    (value: number) => {
      const next = [...answers];
      next[index] = value;
      setAnswers(next);
      track('maturity_question', { question_number: index + 1 });
      // Salva o progresso a cada resposta para saber em que pergunta quem desiste parou.
      if (responseId && index < QUESTIONS.length - 1) {
        rpc('save_maturity_progress', { p_id: responseId, p_answers: next }).then(({ error }) => {
          if (error) logError('progress error:', error);
        });
      }
      window.setTimeout(() => {
        if (index < QUESTIONS.length - 1) setIndex(index + 1);
        else finish(next as number[]);
      }, 220);
    },
    [answers, index, finish, responseId],
  );

  useEffect(() => {
    if (step !== 'quiz') return;
    const onKey = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName ?? '')) return;
      const n = Number(e.key);
      if (n >= 1 && n <= 5) choose(n);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [step, choose]);

  /** Libera o diagnóstico completo: grava o contato, avisa a OCA por e-mail. */
  const unlock = useCallback(
    async (c: Contact): Promise<boolean> => {
      if (!profile || !result) return false;
      const all = answers as number[];
      let saved = false;
      const leadArgs = {
        p_name: profile.name,
        p_email: c.email,
        p_phone: c.phone,
        p_company_type: profile.companyType,
        p_company: c.company || null,
      };
      try {
        if (responseId) {
          const { error } = await rpc('attach_maturity_lead', { p_id: responseId, ...leadArgs });
          if (error) throw error;
        } else {
          // Sem linha criada no início (falha de rede ou banco antigo): cria agora com o contato.
          const { data, error } = await rpc('start_maturity_test', {
            ...leadArgs,
            p_utm: readAttribution(),
            p_referrer: document.referrer || null,
          });
          if (error) throw error;
          if (typeof data === 'string') {
            setResponseId(data);
            await rpc('complete_maturity_test', completeArgs(data, all, result));
          }
        }
        saved = true;
      } catch (e) {
        logError('attach lead error:', e);
      }
      try {
        const info = LEVELS[result.level as Level];
        const summary = `Concluiu o Teste de Maturidade Imobiliária: Nível ${result.level} (${info.name}), média ${result.overall.toFixed(1)}/5. Frente mais fraca: ${result.weakest.name}. Perfil: ${companyTypeLabel(profile.companyType)}. Empresa: ${c.company || 'não informada'}. Respostas: ${all.join('-')}.`;
        const { error } = await supabase.functions.invoke('send-contact-email', {
          body: {
            form: 'maturity_test',
            nome: profile.name,
            email: c.email,
            telefone: c.phone,
            tipo_de_empresa: profile.companyType,
            servico: 'diagnostico-maturidade',
            comment: summary,
          },
        });
        if (error) throw error;
        saved = true;
      } catch (e) {
        logError('result email error:', e);
      }
      if (!saved) {
        toast({
          title: 'Não foi possível enviar',
          description: 'Verifique a conexão e tente novamente em instantes.',
          variant: 'destructive',
        });
        return false;
      }
      store(CONTACT_KEY, c);
      setContact(c);
      track('maturity_lead', { maturity_level: result.level });
      return true;
    },
    [profile, result, answers, responseId, toast],
  );

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
      <main className={`${step === 'quiz' ? 'max-w-6xl' : 'max-w-3xl'} mx-auto px-4 sm:px-6 py-10 sm:py-14`}>
        {step === 'intro' && <Intro onStart={onStartClick} headingRef={headingRef} />}
        {step === 'profile' && (
          <ProfileStep initial={profile} onSubmit={onProfileSubmit} onBack={() => setStep('intro')} headingRef={headingRef} />
        )}
        {step === 'quiz' && (
          <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-10">
            <div className="lg:order-last lg:sticky lg:top-28">
              <MaturityLiveReport answers={answers} name={profile?.name ?? ''} />
            </div>
            <Quiz
              index={index}
              answer={answers[index]}
              onChoose={choose}
              onBack={() => (index > 0 ? setIndex(index - 1) : setStep('profile'))}
              headingRef={headingRef}
            />
          </div>
        )}
        {step === 'result' && result && profile && (
          <Result
            result={result}
            answers={answers as number[]}
            responseId={responseId}
            profile={profile}
            contact={contact}
            onUnlock={unlock}
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

const fieldClass =
  'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-card text-foreground placeholder-muted-foreground';

const Intro = ({ onStart, headingRef }: { onStart: () => void; headingRef: HeadingRef }) => (
  <div className="text-center">
    <ProcessShieldBadge size={72} className="mb-6" />
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
      <span className="px-3 py-1 rounded-full border border-border">seu nível na hora</span>
      <span className="px-3 py-1 rounded-full border border-border">diagnóstico completo em PDF</span>
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
    <section className="mt-14 text-left rounded-xl border border-border bg-card p-6 sm:p-8" aria-labelledby="como-construido">
      <h2 id="como-construido" className="text-2xl font-bold text-foreground mb-3 text-center">
        Como este modelo foi construído
      </h2>
      <p className="text-muted-foreground mb-5">
        O ponto de partida é o CMMI, um modelo internacional que mede a maturidade de uma empresa em cinco níveis, do improviso até a
        melhoria contínua. Aqui no Brasil existe o MPS.BR, uma versão nacional com degraus mais graduais, pensada para empresas de
        portes diferentes. A OCA Digital adaptou essa lógica para a rotina da imobiliária, com perguntas sobre CRM, funil, corretores,
        métricas e IA.
      </p>
      <ul className="divide-y divide-border rounded-lg border border-border text-sm">
        {(
          [
            [1, 'Initial'],
            [2, 'Managed'],
            [3, 'Defined'],
            [4, 'Quantitatively Managed'],
            [5, 'Optimizing'],
          ] as [Level, string][]
        ).map(([n, cmmi]) => (
          <li key={n} className="flex items-center justify-between gap-4 px-4 py-2.5">
            <span className="text-foreground">
              <span className="font-semibold" style={{ color: LEVELS[n].color }}>
                Nível {n}
              </span>{' '}
              {LEVELS[n].name}
            </span>
            <span className="text-muted-foreground shrink-0">CMMI: {cmmi}</span>
          </li>
        ))}
      </ul>
    </section>
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

const ProfileStep = ({
  initial,
  onSubmit,
  onBack,
  headingRef,
}: {
  initial: Profile | null;
  onSubmit: (p: Profile) => void;
  onBack: () => void;
  headingRef: HeadingRef;
}) => {
  const [name, setName] = useState(initial?.name ?? '');
  const [companyType, setCompanyType] = useState(initial?.companyType ?? '');
  const [website, setWebsite] = useState('');
  const [error, setError] = useState('');

  const submit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (website) return; // honeypot
    if (name.trim().length < 2) return setError('Informe seu nome para começar.');
    if (!companyType) return setError('Escolha o perfil que mais combina com a sua empresa.');
    onSubmit({ name: name.trim(), companyType });
  };

  return (
    <form onSubmit={submit} noValidate>
      <div className="mb-8">
        <div className="flex justify-between text-sm text-muted-foreground mb-2">
          <span>Antes das perguntas</span>
          <span>Sobre você</span>
        </div>
        <Progress value={3} className="h-2" aria-label="Progresso do teste" />
      </div>
      <h2 ref={headingRef} tabIndex={-1} className="text-2xl sm:text-3xl font-bold text-foreground mb-6 outline-none">
        Como podemos te chamar e qual é o perfil da sua empresa?
      </h2>
      <div className="hidden" aria-hidden="true">
        <label>
          Não preencha este campo
          <input tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
        </label>
      </div>
      <label htmlFor="mt-name" className="block text-sm font-medium text-foreground mb-2">
        Seu nome
      </label>
      <input
        id="mt-name"
        type="text"
        autoComplete="name"
        placeholder="Nome"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
          setError('');
        }}
        className={`${fieldClass} border-border mb-6`}
      />
      <p className="block text-sm font-medium text-foreground mb-2" id="mt-type-label">
        Perfil da empresa
      </p>
      <div role="radiogroup" aria-labelledby="mt-type-label" className="space-y-3">
        {COMPANY_TYPES.map(([value, label]) => {
          const selected = companyType === value;
          return (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => {
                setCompanyType(value);
                setError('');
              }}
              className={`w-full text-left px-5 py-4 rounded-lg border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary flex gap-4 items-center ${
                selected ? 'border-primary bg-primary/10 text-foreground' : 'border-border bg-card text-foreground hover:border-primary/60'
              }`}
            >
              <span
                className={`shrink-0 w-5 h-5 rounded-full border flex items-center justify-center ${
                  selected ? 'border-primary' : 'border-border'
                }`}
                aria-hidden="true"
              >
                {selected && <span className="w-2.5 h-2.5 rounded-full bg-primary" />}
              </span>
              <span>{label}</span>
            </button>
          );
        })}
      </div>
      {error && (
        <p className="text-red-500 text-sm mt-4" role="alert">
          {error}
        </p>
      )}
      <div className="mt-8 flex items-center justify-between gap-4">
        <Button type="button" variant="ghost" onClick={onBack}>
          Voltar
        </Button>
        <Button type="submit" size="lg" className="font-semibold px-8">
          Ir para as perguntas
        </Button>
      </div>
      <p className="text-xs text-muted-foreground mt-6">
        Usamos o seu nome só para personalizar o resultado. Veja a{' '}
        <Link to="/politica-de-privacidade" className="underline" target="_blank">
          Política de Privacidade
        </Link>
        .
      </p>
    </form>
  );
};

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

const ContactForm = ({ onSubmit }: { onSubmit: (c: Contact) => Promise<boolean> }) => {
  const [form, setForm] = useState({ email: '', phone: '', company: '', consent: false, website: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  const set = (k: string, v: string | boolean) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: '' }));
  };

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (form.website) return; // honeypot
    const e: Record<string, string> = {};
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email.trim())) e.email = 'E-mail inválido';
    if (form.phone.replace(/\D/g, '').length < 10) e.phone = 'Informe um WhatsApp com DDD';
    if (!form.consent) e.consent = 'É preciso concordar para continuar';
    setErrors(e);
    if (Object.keys(e).length) return;
    setBusy(true);
    await onSubmit({ email: form.email.trim(), phone: form.phone.trim(), company: form.company.trim() });
    setBusy(false);
  };

  return (
    <form onSubmit={submit} className="space-y-4 text-left" noValidate>
      <div className="hidden" aria-hidden="true">
        <label>
          Não preencha este campo
          <input tabIndex={-1} autoComplete="off" value={form.website} onChange={(e) => set('website', e.target.value)} />
        </label>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <input
            type="email"
            placeholder="E-mail"
            aria-label="E-mail"
            autoComplete="email"
            value={form.email}
            onChange={(e) => set('email', e.target.value)}
            className={`${fieldClass} ${errors.email ? 'border-red-500' : 'border-border'}`}
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>
        <div>
          <input
            type="tel"
            placeholder="WhatsApp com DDD"
            aria-label="WhatsApp com DDD"
            autoComplete="tel"
            value={form.phone}
            onChange={(e) => set('phone', e.target.value)}
            className={`${fieldClass} ${errors.phone ? 'border-red-500' : 'border-border'}`}
          />
          {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
        </div>
      </div>
      <input
        type="text"
        placeholder="Nome da empresa (opcional)"
        aria-label="Nome da empresa (opcional)"
        autoComplete="organization"
        value={form.company}
        onChange={(e) => set('company', e.target.value)}
        className={`${fieldClass} border-border`}
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
      <Button type="submit" size="lg" className="w-full font-semibold" disabled={busy}>
        {busy ? 'Liberando...' : 'Liberar diagnóstico completo e baixar o PDF'}
      </Button>
    </form>
  );
};

const Result = ({
  result,
  answers,
  responseId,
  profile,
  contact,
  onUnlock,
  onRestart,
  headingRef,
  toast,
}: {
  result: TestResult;
  answers: number[];
  responseId: string | null;
  profile: Profile;
  contact: Contact | null;
  onUnlock: (c: Contact) => Promise<boolean>;
  onRestart: () => void;
  headingRef: HeadingRef;
  toast: ReturnType<typeof useToast>['toast'];
}) => {
  const level = result.level as Level;
  const info = LEVELS[level];
  const next = level < 5 ? BOTTLENECKS[level as 1 | 2 | 3 | 4] : null;
  const actions = next ? next.actions : LEVEL_5_ACTIONS;
  const unlocked = !!contact;
  const [pdfBusy, setPdfBusy] = useState(false);

  const downloadPdf = async (c: Contact) => {
    setPdfBusy(true);
    try {
      const { downloadMaturityPdf } = await import('@/lib/maturityPdf');
      await downloadMaturityPdf({
        name: profile.name,
        company: c.company || undefined,
        profile: companyTypeLabel(profile.companyType),
        result,
        answers,
      });
      track('maturity_test_pdf', { maturity_level: level });
    } catch (e) {
      logError('pdf error:', e);
      toast({ title: 'Não foi possível gerar o PDF', description: 'Tente novamente em instantes.', variant: 'destructive' });
    } finally {
      setPdfBusy(false);
    }
  };

  const handleUnlock = async (c: Contact) => {
    const ok = await onUnlock(c);
    if (ok) await downloadPdf(c);
    return ok;
  };

  return (
    <div className="space-y-8">
      <Card className="p-8 card-elevated text-center">
        <p className="text-sm font-semibold tracking-widest uppercase text-muted-foreground mb-3">
          O resultado de {profile.name.split(' ')[0]}
        </p>
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
        {unlocked && (
          <div className="mt-6">
            <Button size="lg" className="font-semibold px-8" onClick={() => downloadPdf(contact)} disabled={pdfBusy}>
              {pdfBusy ? 'Gerando PDF...' : 'Baixar resultado em PDF'}
            </Button>
          </div>
        )}
      </Card>

      <Card className="p-8 card-elevated">
        <h2 className="text-xl font-bold text-foreground mb-1">Como você está em cada frente</h2>
        <p className="text-sm text-muted-foreground mb-6">{diagnosisText(result)}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <MaturityRadar dimensions={result.dimensions} color={info.color} />
          <ul className="space-y-4">
            {result.dimensions.map((d) => {
              const weakest = d.id === result.weakest.id;
              return (
                <li key={d.id}>
                  <div className="flex justify-between text-sm mb-1.5 gap-3">
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
        </div>
      </Card>

      <Card className="p-8 card-elevated">
        <div className="flex items-start gap-4 mb-4">
          <ProcessShieldBadge size={52} className="shrink-0" />
          <div>
            <p className="text-sm font-semibold tracking-widest uppercase text-primary mb-1">
              {next ? `Do Nível ${level} para o ${level + 1}` : 'Você está no topo do modelo'}
            </p>
            <h2 className="text-2xl font-bold text-foreground">
              {next ? `O gargalo: ${next.title.toLowerCase()}` : 'O próximo passo é manter o ritmo'}
            </h2>
          </div>
        </div>
        {unlocked ? (
          <>
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
          </>
        ) : (
          <>
            <p className="text-muted-foreground mb-6">
              Informe onde quer receber o diagnóstico completo. Ele libera aqui na tela e em PDF:
            </p>
            <ul className="mb-6 grid gap-2 sm:grid-cols-2 text-sm text-foreground">
              {[
                `O gargalo da passagem para o ${next ? `Nível ${level + 1}` : 'próximo ciclo'} e ${actions.length} ações`,
                'Plano com uma ação para cada frente, por prioridade',
                'Mapa de evolução: sua resposta e o próximo degrau em cada pergunta',
                'Indicadores para começar a medir',
                'Modelo no Miro para blindar os processos',
                'Relatório completo em PDF',
              ].map((t) => (
                <li key={t} className="flex gap-2">
                  <span className="text-primary" aria-hidden="true">
                    ✓
                  </span>
                  {t}
                </li>
              ))}
            </ul>
            <ContactForm onSubmit={handleUnlock} />
          </>
        )}
      </Card>

      {unlocked && (
        <MaturityFullReport
          result={result}
          answers={answers}
          onMiro={() => track('maturity_miro_click', { maturity_level: level })}
        />
      )}
      <MaturityShare result={result} responseId={responseId} toast={toast} track={track} />
      <Card className="p-8 card-elevated text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">Quer um plano para subir de nível?</h2>
        <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
          Converse com a OCA Digital: uma conversa de 30 minutos, sem custo, para transformar este resultado em um plano de ação para
          a sua imobiliária.
        </p>
        <Button asChild size="lg" className="font-semibold px-8">
          <Link to="/contact">Agendar uma conversa</Link>
        </Button>
      </Card>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <Button asChild variant="outline">
          <Link to={GUIDE_PATH}>Ler o guia completo</Link>
        </Button>
        <Button variant="ghost" onClick={onRestart}>
          Refazer o teste
        </Button>
      </div>
    </div>
  );
};

export default MaturityTest;
