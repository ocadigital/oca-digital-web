import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { logError } from '@/lib/logger';

/**
 * Relatório do teste de atendimento (cliente oculto, novembro de 2026).
 * O resumo é aberto; o ranking só aparece depois do cadastro (relatorio_desbloquear -> relatorio_dados).
 */
const PAGE_URL = 'https://www.ocadigital.com.br/relatorio-atendimento';
const TITLE = 'Relatório: como 35 imobiliárias de Florianópolis atendem um comprador no WhatsApp | OCA Digital';
const DESCRIPTION =
  'Ranking do teste de atendimento com 35 imobiliárias da Grande Florianópolis: tempo de resposta, quem respondeu, se qualificaram o cliente e quão fácil é iniciar o contato pelo site.';
const LEAD_KEY = 'relatorioAtendimentoLead';

interface Imob {
  id: string;
  nome: string;
  regiao: string;
  nota: number;
  valido: boolean;
  motivo_invalido: string | null;
  posicao: number | null;
  top: boolean;
  tipo: string | null;
  tempo_min: number | null;
  qualificou: boolean | null;
  proximo_passo: boolean | null;
  destaque: string | null;
  contato_nota: number | null;
  contato: { flutuante: boolean; whatsapp: boolean; telefone: boolean; formulario: boolean };
  presenca: number;
  seguidores: number | null;
  google_nota: number | null;
  google_avaliacoes: number | null;
  ia_citacoes: number | null;
  meta_ads: boolean | null;
}

interface Lead {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  imobiliaria: string;
}

type Rpc = (fn: string, args: Record<string, unknown>) => Promise<{ data: unknown; error: { message: string } | null }>;
const rpc = supabase.rpc.bind(supabase) as unknown as Rpc;

const track = (event: string, data: Record<string, unknown> = {}) => {
  const w = window as unknown as { dataLayer?: unknown[] };
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({ event, ...data });
};

const readLead = (): Lead | null => {
  try {
    const raw = localStorage.getItem(LEAD_KEY);
    return raw ? (JSON.parse(raw) as Lead) : null;
  } catch {
    return null;
  }
};

const utm = () => {
  const p = new URLSearchParams(window.location.search);
  const out: Record<string, string> = {};
  ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content'].forEach((k) => {
    const v = p.get(k);
    if (v) out[k] = v.slice(0, 120);
  });
  return Object.keys(out).length ? out : null;
};

const TIPO: Record<string, string> = {
  ia: 'Atendente de IA', menu: 'Robô de menu', auto: 'Mensagem automática', humano: 'Pessoa', nada: 'Sem resposta',
};
const fmtMin = (m: number | null) => (m == null ? 'sem resposta' : m < 1 ? 'menos de 1 min' : m < 60 ? `${m} min` : `${Math.floor(m / 60)}h${String(m % 60).padStart(2, '0')}`);
const fmtNota = (n: number) => n.toLocaleString('pt-BR', { maximumFractionDigits: 1 });
const fieldClass = 'w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-card text-foreground placeholder-muted-foreground';

const notificar = (form: string, lead: Lead, comment: string) =>
  supabase.functions.invoke('send-contact-email', {
    body: { form, nome: lead.nome, email: lead.email, telefone: lead.telefone, tipo_de_empresa: 'relatorio', servico: 'relatorio-atendimento', comment },
  });

const RelatorioAtendimento = () => {
  const [lead, setLead] = useState<Lead | null>(readLead);
  const [dados, setDados] = useState<Imob[] | null>(null);
  const [carregando, setCarregando] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!lead) return;
    setCarregando(true);
    rpc('relatorio_dados', { p_lead: lead.id }).then(({ data, error }) => {
      setCarregando(false);
      if (error || !data) {
        logError('relatorio dados error:', error);
        if (!error) {
          // cadastro antigo ou removido: pede de novo
          localStorage.removeItem(LEAD_KEY);
          setLead(null);
        }
        return;
      }
      setDados((data as { imobiliarias: Imob[] }).imobiliarias);
    });
  }, [lead]);

  const desbloquear = async (c: Omit<Lead, 'id'> & { cargo: string }) => {
    const { data, error } = await rpc('relatorio_desbloquear', {
      p_nome: c.nome, p_email: c.email, p_telefone: c.telefone, p_imobiliaria: c.imobiliaria || null,
      p_cargo: c.cargo || null, p_utm: utm(), p_referrer: document.referrer || null,
    });
    if (error || typeof data !== 'string') {
      logError('relatorio desbloquear error:', error);
      toast({ title: 'Não foi possível liberar', description: 'Confira os dados e tente de novo.', variant: 'destructive' });
      return;
    }
    const l: Lead = { id: data, nome: c.nome, email: c.email, telefone: c.telefone, imobiliaria: c.imobiliaria };
    try {
      localStorage.setItem(LEAD_KEY, JSON.stringify(l));
    } catch {
      /* sem localStorage: vale só nesta visita */
    }
    notificar('relatorio_atendimento', l, `Liberou o relatório de atendimento. Imobiliária: ${c.imobiliaria || 'não informada'}. Cargo: ${c.cargo || 'não informado'}.`)
      .then(({ error: e }) => e && logError('relatorio email error:', e));
    track('relatorio_atendimento_lead', { cargo: c.cargo });
    setLead(l);
  };

  return (
    <div className="min-h-screen bg-background pt-24">
      <Helmet>
        <title>{TITLE}</title>
        <meta name="description" content={DESCRIPTION} />
        <link rel="canonical" href={PAGE_URL} />
        <meta property="og:title" content={TITLE} />
        <meta property="og:description" content={DESCRIPTION} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={PAGE_URL} />
        <meta property="og:image" content="https://www.ocadigital.com.br/images/blog/teste-atendimento-imobiliarias-whatsapp.webp" />
      </Helmet>
      <Header />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-10">
        <section className="text-center space-y-4">
          <p className="text-sm font-semibold tracking-widest uppercase text-primary">Relatório · novembro de 2026</p>
          <h1 className="text-3xl sm:text-5xl font-bold text-foreground">Como 35 imobiliárias de Florianópolis atendem um comprador no WhatsApp</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Mandamos mensagem como um comprador comum e acompanhamos cada conversa por 48 horas. Aqui está o resultado de cada
            imobiliária, e também o quão fácil é começar uma conversa pelo site delas.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
            {[['81%', 'das perguntas tiveram resposta'], ['19%', 'nunca foram respondidas'], ['23 min', 'mediana até uma pessoa responder'], ['28%', 'perguntaram o que o cliente procura']].map(([v, l]) => (
              <Card key={l} className="p-4"><div className="text-2xl font-bold text-foreground">{v}</div><div className="text-sm text-muted-foreground">{l}</div></Card>
            ))}
          </div>
        </section>

        {!lead && <Desbloqueio onEnviar={desbloquear} />}
        {lead && carregando && <p className="text-center text-muted-foreground">Carregando o relatório...</p>}
        {lead && dados && <Ranking dados={dados} lead={lead} />}

        <Metodologia />
      </main>
      <Footer />
    </div>
  );
};

const Desbloqueio = ({ onEnviar }: { onEnviar: (c: Omit<Lead, 'id'> & { cargo: string }) => Promise<void> }) => {
  const [c, setC] = useState({ nome: '', email: '', telefone: '', imobiliaria: '', cargo: '' });
  const [enviando, setEnviando] = useState(false);
  const ok = c.nome.trim().length >= 2 && /\S+@\S+\.\S+/.test(c.email) && c.telefone.replace(/\D/g, '').length >= 10;
  const ch = (k: keyof typeof c) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setC((p) => ({ ...p, [k]: e.target.value }));
  return (
    <Card className="p-6 sm:p-8 border-2 border-primary/20 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-foreground">Veja o ranking completo</h2>
      <p className="text-muted-foreground mt-1 mb-5">
        Deixe seu contato para liberar o resultado de cada imobiliária, os 7 melhores atendimentos em detalhe e o índice de presença digital.
      </p>
      <form className="grid gap-3" onSubmit={async (e) => { e.preventDefault(); if (!ok) return; setEnviando(true); await onEnviar(c); setEnviando(false); }}>
        <input className={fieldClass} placeholder="Nome" aria-label="Nome" value={c.nome} onChange={ch('nome')} />
        <div className="grid sm:grid-cols-2 gap-3">
          <input className={fieldClass} type="tel" placeholder="WhatsApp" aria-label="WhatsApp" value={c.telefone} onChange={ch('telefone')} />
          <input className={fieldClass} type="email" placeholder="E-mail" aria-label="E-mail" value={c.email} onChange={ch('email')} />
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          <input className={fieldClass} placeholder="Imobiliária onde trabalha" aria-label="Imobiliária" value={c.imobiliaria} onChange={ch('imobiliaria')} />
          <select className={fieldClass} aria-label="Cargo" value={c.cargo} onChange={ch('cargo')}>
            <option value="">Seu cargo</option>
            <option>Dono ou sócio</option>
            <option>Gerente ou diretor</option>
            <option>Corretor</option>
            <option>Marketing</option>
            <option>Outro</option>
          </select>
        </div>
        <Button type="submit" size="lg" disabled={!ok || enviando}>{enviando ? 'Liberando...' : 'Liberar o relatório'}</Button>
        <p className="text-xs text-muted-foreground text-center">Seus dados estão protegidos. Não fazemos spam.</p>
      </form>
    </Card>
  );
};

const Selo = ({ v }: { v: boolean | null }) => (
  <span className={`px-2 py-0.5 text-xs rounded ${v ? 'bg-green-100 text-green-800' : 'bg-muted text-muted-foreground'}`}>{v ? 'sim' : 'não'}</span>
);

const Ranking = ({ dados, lead }: { dados: Imob[]; lead: Lead }) => {
  const top = dados.filter((d) => d.top);
  const demais = dados.filter((d) => d.valido && !d.top);
  const naoComparaveis = dados.filter((d) => !d.valido);
  const porPresenca = [...dados].sort((a, b) => b.presenca - a.presenca);

  return (
    <>
      <section className="space-y-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Os 7 melhores atendimentos</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {top.map((d) => (
            <Card key={d.id} className="p-5 space-y-3">
              <div className="flex justify-between items-start gap-3">
                <div>
                  <div className="text-sm text-muted-foreground">#{d.posicao} · {d.regiao}</div>
                  <h3 className="text-xl font-bold text-foreground">{d.nome}</h3>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-primary">{fmtNota(d.nota)}</div>
                  <div className="text-xs text-muted-foreground">atendimento</div>
                </div>
              </div>
              <p className="text-sm text-foreground">{d.destaque}</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><span className="text-muted-foreground">Quem respondeu:</span> {TIPO[d.tipo ?? 'nada']}</div>
                <div><span className="text-muted-foreground">1ª resposta:</span> {fmtMin(d.tempo_min)}</div>
                <div><span className="text-muted-foreground">Qualificou:</span> <Selo v={d.qualificou} /></div>
                <div><span className="text-muted-foreground">Próximo passo:</span> <Selo v={d.proximo_passo} /></div>
                <div className="col-span-2"><span className="text-muted-foreground">Contato no site:</span> {d.contato_nota == null ? 'sem site para avaliar' : `${d.contato_nota}/10`}</div>
              </div>
              <PedirDetalhe imob={d} lead={lead} />
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Todas as imobiliárias avaliadas</h2>
        <Card className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b text-muted-foreground"><th className="px-3 py-2 text-left">#</th><th className="px-3 py-2 text-left">Imobiliária</th><th className="px-3 py-2 text-left">Região</th><th className="px-3 py-2 text-right">Atendimento</th><th className="px-3 py-2 text-right">Contato no site</th><th className="px-3 py-2"></th></tr></thead>
            <tbody>
              {demais.map((d) => (
                <tr key={d.id} className="border-b align-top">
                  <td className="px-3 py-2 text-muted-foreground">{d.posicao}</td>
                  <td className="px-3 py-2 font-medium text-foreground">{d.nome}</td>
                  <td className="px-3 py-2">{d.regiao}</td>
                  <td className="px-3 py-2 text-right font-semibold">{fmtNota(d.nota)}</td>
                  <td className="px-3 py-2 text-right">{d.contato_nota == null ? '-' : `${d.contato_nota}/10`}</td>
                  <td className="px-3 py-2 text-right"><PedirDetalhe imob={d} lead={lead} compacto /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
        {naoComparaveis.length > 0 && (
          <Card className="p-5">
            <h3 className="font-semibold text-foreground mb-2">Testes não comparáveis</h3>
            <p className="text-sm text-muted-foreground mb-3">Nestes casos o teste não mediu o atendimento normal da imobiliária, por isso não entram no ranking.</p>
            <ul className="space-y-1 text-sm">
              {naoComparaveis.map((d) => <li key={d.id}><b className="text-foreground">{d.nome}</b>: {d.motivo_invalido}</li>)}
            </ul>
          </Card>
        )}
      </section>

      <NaoEstou lead={lead} />

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-foreground">Indicador secundário: presença digital</h2>
        <p className="text-muted-foreground">
          Este índice tem peso menor e não mede atendimento. Ele resume o quanto a imobiliária aparece para quem procura imóvel:
          seguidores no Instagram (até 35 pontos), nota e número de avaliações no Google (até 25), quantas vezes foi citada por
          ChatGPT, Gemini e Perplexity no ranking da Ranqueia (até 25) e se anunciava na Meta em outubro (15). Sem o dado, o item conta zero.
        </p>
        <Card className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b text-muted-foreground"><th className="px-3 py-2 text-left">Imobiliária</th><th className="px-3 py-2 text-right">Índice</th><th className="px-3 py-2 text-right">Instagram</th><th className="px-3 py-2 text-right">Google</th><th className="px-3 py-2 text-right">Citações em IA</th><th className="px-3 py-2 text-right">Anúncio Meta</th></tr></thead>
            <tbody>
              {porPresenca.map((d) => (
                <tr key={d.id} className="border-b">
                  <td className="px-3 py-2 text-foreground">{d.nome}</td>
                  <td className="px-3 py-2 text-right font-semibold">{d.presenca}</td>
                  <td className="px-3 py-2 text-right">{d.seguidores?.toLocaleString('pt-BR') ?? '-'}</td>
                  <td className="px-3 py-2 text-right">{d.google_nota ? `${fmtNota(Number(d.google_nota))} (${d.google_avaliacoes})` : '-'}</td>
                  <td className="px-3 py-2 text-right">{d.ia_citacoes ?? '-'}</td>
                  <td className="px-3 py-2 text-right">{d.meta_ads ? 'sim' : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </section>
    </>
  );
};

const PedirDetalhe = ({ imob, lead, compacto = false }: { imob: Imob; lead: Lead; compacto?: boolean }) => {
  const [estado, setEstado] = useState<'inicio' | 'enviando' | 'confere' | 'naoconfere'>('inicio');
  const pedir = async () => {
    setEstado('enviando');
    const { data, error } = await rpc('relatorio_pedir_detalhe', { p_lead: lead.id, p_imobiliaria: imob.id });
    const confere = !error && !!(data as { confere?: boolean })?.confere;
    notificar('relatorio_detalhe', lead,
      `Pediu os detalhes da ${imob.nome} no relatório de atendimento. Imobiliária informada no cadastro: ${lead.imobiliaria || 'não informada'} (${confere ? 'confere' : 'não confere'}).`)
      .then(({ error: e }) => e && logError('relatorio detalhe email error:', e));
    track('relatorio_atendimento_detalhe', { confere });
    setEstado(confere ? 'confere' : 'naoconfere');
  };
  if (estado === 'confere') return <p className="text-xs text-green-700">Vamos te chamar no WhatsApp com os detalhes completos da {imob.nome}.</p>;
  if (estado === 'naoconfere')
    return <p className="text-xs text-muted-foreground">Os detalhes vão só para quem trabalha na imobiliária. Registramos seu pedido e vamos confirmar pelo WhatsApp.</p>;
  return (
    <Button variant="outline" size="sm" onClick={pedir} disabled={estado === 'enviando'} className={compacto ? 'whitespace-nowrap' : 'w-full'}>
      {compacto ? 'Trabalho aqui' : 'Trabalho aqui: quero os detalhes'}
    </Button>
  );
};

const NaoEstou = ({ lead }: { lead: Lead }) => {
  const [nome, setNome] = useState(lead.imobiliaria);
  const [feito, setFeito] = useState(false);
  return (
    <Card className="p-6 bg-primary/5 border-primary/20">
      <h2 className="text-xl font-bold text-foreground">Sua imobiliária não está na lista?</h2>
      <p className="text-muted-foreground mt-1 mb-4">Fazemos o mesmo teste no seu atendimento e no seu site, e te mostramos o resultado em 20 minutos.</p>
      {feito ? (
        <p className="text-green-700">Pedido recebido. Vamos te chamar no WhatsApp para combinar.</p>
      ) : (
        <div className="flex flex-col sm:flex-row gap-3">
          <input className={fieldClass} placeholder="Nome da imobiliária" value={nome} onChange={(e) => setNome(e.target.value)} />
          <Button size="lg" disabled={nome.trim().length < 2} onClick={() => {
            notificar('relatorio_avaliacao', lead, `Quer que a imobiliária ${nome} seja avaliada (veio do relatório de atendimento).`)
              .then(({ error }) => error && logError('relatorio avaliacao email error:', error));
            track('relatorio_atendimento_avaliacao');
            setFeito(true);
          }}>Quero ser avaliado</Button>
        </div>
      )}
      <p className="text-sm text-muted-foreground mt-3">Ou faça agora a conta de quanto o seu WhatsApp deixa esfriar: <Link to="/diagnostico" className="text-primary underline">diagnóstico em 3 perguntas</Link>.</p>
    </Card>
  );
};

const Metodologia = () => (
  <section className="text-sm text-muted-foreground space-y-2 border-t pt-8">
    <h2 className="text-lg font-semibold text-foreground">Como o teste foi feito</h2>
    <p>
      De 9 a 13 de novembro de 2026 enviamos 36 mensagens por WhatsApp para 35 imobiliárias da Grande Florianópolis, como um comprador
      comum, sem identificar a OCA Digital e sem agendar visita: 20 sobre venda e 16 sobre locação, umas sobre um imóvel do site e outras
      pedindo opções num bairro. Cada conversa foi acompanhada por 48 horas.
    </p>
    <p>
      <b className="text-foreground">Nota de atendimento (0 a 10):</b> tempo até a primeira resposta (até 4 pontos), se perguntou o que o
      cliente procura (3), se ofereceu visita ou próximo passo (2) e se voltou a chamar sozinha (1). Resposta automática instantânea
      ganha os pontos de tempo mesmo sem conduzir a conversa.
    </p>
    <p>
      <b className="text-foreground">Contato no site (0 a 10):</b> avaliado em 22 de novembro na página inicial: botão flutuante de
      WhatsApp (4), link direto para o WhatsApp (2), telefone clicável (2) e formulário de contato (2).
    </p>
    <p>
      É um retrato de uma conversa por imobiliária, num dia e horário, e não uma avaliação definitiva. Imobiliárias que quiserem corrigir
      ou comentar algum dado podem falar com a gente pelo{' '}
      <Link to="/contact" className="text-primary underline">contato</Link>.
    </p>
  </section>
);

export default RelatorioAtendimento;
