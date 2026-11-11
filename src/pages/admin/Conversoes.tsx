import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { RefreshCw } from 'lucide-react';

// Funil do site lendo as tabelas fechadas por RLS (só admin): eventos, progresso dos formulários,
// Diagnóstico e Teste de Maturidade. Tabelas fora do types.ts gerado, por isso os tipos locais.
interface Evento { event: string; page: string | null; servico: string | null; created_at: string }
interface Progresso {
  id: string; form: string; servico: string | null; campos: string[]; nome: string | null; email: string | null;
  telefone: string | null; tipo_empresa: string | null; completed_at: string | null; created_at: string; last_activity_at: string;
}
interface Diag {
  id: string; created_at: string; last_step: number; completed_at: string | null; leads_mes: number | null;
  lead_name: string | null; lead_email: string | null; lead_phone: string | null; lead_company_type: string | null;
}
interface Teste {
  id: string; created_at: string; last_step: number | null; completed_at: string | null; level: number | null;
  lead_name: string | null; lead_email: string | null; lead_phone: string | null; lead_company_type: string | null;
}

const PERIODOS = [7, 30, 90] as const;
const SERVICOS: Record<string, string> = {
  'web-sites': 'Web Sites', 'landing-page': 'Landing Pages', 'google-meta-gpt-ads': 'Anúncios',
  'planejamento-marketing': 'Planejamento', 'processos-automacao': 'Processos e Automação', crm: 'CRM', 'automacao-n8n': 'Automação n8n', lancamentos: 'Lançamentos', outros: 'Sob medida',
};
const PAGINAS: Record<string, string> = { '/': 'Home', '/teste-maturidade': 'Teste de Maturidade', '/diagnostico': 'Diagnóstico' };
const dataBr = (s: string) => new Date(s).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
const ORIGENS_WPP: Record<string, string> = {
  menu: 'Menu do site', home: 'Topo da home', 'oca-one': 'Demo OCA One', 'oca-base': 'Demo OCA Base',
  contato: 'Página de contato', blog: 'Fim dos posts do blog', case: 'Fim dos cases', fundador: 'Seção do fundador',
};
const pct = (a: number, b: number) => (b ? `${Math.round((a / b) * 100)}%` : '–');

const Conversoes = () => {
  const { signOut } = useAuth();
  const [dias, setDias] = useState<(typeof PERIODOS)[number]>(30);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [progresso, setProgresso] = useState<Progresso[]>([]);
  const [diags, setDiags] = useState<Diag[]>([]);
  const [testes, setTestes] = useState<Teste[]>([]);

  const carregar = async () => {
    setCarregando(true);
    setErro('');
    const desde = new Date(Date.now() - dias * 86400000).toISOString();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = supabase as any;
    const [e, p, d, t] = await Promise.all([
      db.from('site_events').select('event,page,servico,created_at').gte('created_at', desde).limit(10000),
      db.from('form_progress').select('*').gte('created_at', desde).order('created_at', { ascending: false }).limit(2000),
      db.from('diagnostico_respostas').select('id,created_at,last_step,completed_at,leads_mes,lead_name,lead_email,lead_phone,lead_company_type')
        .gte('created_at', desde).order('created_at', { ascending: false }).limit(2000),
      db.from('maturity_test_responses').select('id,created_at,last_step,completed_at,level,lead_name,lead_email,lead_phone,lead_company_type')
        .gte('created_at', desde).order('created_at', { ascending: false }).limit(2000),
    ]);
    const falhas = [e, p, d, t].filter((r) => r.error).map((r) => r.error.message);
    if (falhas.length) setErro(`Algumas tabelas não carregaram: ${falhas.join(' · ')}`);
    setEventos(e.data ?? []);
    setProgresso(p.data ?? []);
    setDiags(d.data ?? []);
    setTestes(t.data ?? []);
    setCarregando(false);
  };

  useEffect(() => {
    carregar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dias]);

  const resumo = useMemo(() => {
    const conta = (ev: string, filtro?: (x: Evento) => boolean) => eventos.filter((x) => x.event === ev && (!filtro || filtro(x))).length;
    const visitas = Object.keys(PAGINAS).map((pg) => ({ pg, n: conta('visita', (x) => x.page === pg) }));
    const servicos = Object.keys(SERVICOS).map((sv) => {
      const prog = progresso.filter((x) => x.form === 'servico' && x.servico === sv);
      return {
        sv,
        preco: conta('preco_aberto', (x) => x.servico === sv),
        modal: conta('servico_modal_aberto', (x) => x.servico === sv),
        iniciou: prog.length,
        contato: prog.filter((x) => x.email || x.telefone).length,
        enviou: prog.filter((x) => x.completed_at).length,
      };
    }).filter((x) => x.preco || x.modal || x.iniciou);
    const contato = progresso.filter((x) => x.form === 'contato');
    const funis = [
      {
        nome: 'Teste de Maturidade', topo: visitas.find((v) => v.pg === '/teste-maturidade')?.n ?? 0,
        iniciou: testes.length, contato: testes.filter((x) => x.lead_email || x.lead_phone).length,
        concluiu: testes.filter((x) => x.completed_at).length,
      },
      {
        nome: 'Diagnóstico (calculadora)', topo: visitas.find((v) => v.pg === '/diagnostico')?.n ?? 0,
        iniciou: diags.length, contato: diags.filter((x) => x.lead_email || x.lead_phone).length,
        concluiu: diags.filter((x) => x.completed_at).length,
      },
      {
        nome: 'Formulário de contato', topo: conta('contato_visto'),
        iniciou: contato.length, contato: contato.filter((x) => x.email || x.telefone).length,
        concluiu: contato.filter((x) => x.completed_at).length,
      },
      {
        nome: 'Cards de serviço', topo: conta('servico_modal_aberto'),
        iniciou: progresso.filter((x) => x.form === 'servico').length,
        contato: progresso.filter((x) => x.form === 'servico' && (x.email || x.telefone)).length,
        concluiu: progresso.filter((x) => x.form === 'servico' && x.completed_at).length,
      },
    ];
    // quem deixou contato e não concluiu: para retomar
    const parados = [
      ...progresso.filter((x) => !x.completed_at && (x.email || x.telefone)).map((x) => ({
        quando: x.last_activity_at, origem: x.form === 'servico' ? `Serviço: ${SERVICOS[x.servico ?? ''] ?? x.servico}` : 'Contato',
        nome: x.nome, email: x.email, telefone: x.telefone, tipo: x.tipo_empresa, onde: `campos: ${x.campos.join(', ') || '–'}`,
      })),
      ...diags.filter((x) => !x.completed_at && (x.lead_email || x.lead_phone)).map((x) => ({
        quando: x.created_at, origem: 'Diagnóstico', nome: x.lead_name, email: x.lead_email, telefone: x.lead_phone,
        tipo: x.lead_company_type, onde: `etapa ${x.last_step} de 4`,
      })),
      ...testes.filter((x) => !x.completed_at && (x.lead_email || x.lead_phone)).map((x) => ({
        quando: x.created_at, origem: 'Teste de Maturidade', nome: x.lead_name, email: x.lead_email, telefone: x.lead_phone,
        tipo: x.lead_company_type, onde: `respondeu ${x.last_step ?? 0} de 10 perguntas`,
      })),
    ].sort((a, b) => b.quando.localeCompare(a.quando));
    // onde o teste e o diagnóstico param
    const paradasTeste = Array.from({ length: 11 }, (_, i) => testes.filter((x) => !x.completed_at && (x.last_step ?? 0) === i).length);
    const paradasDiag = [1, 2, 3, 4].map((i) => diags.filter((x) => !x.completed_at && x.last_step === i).length);
    const whatsapp = Object.keys(ORIGENS_WPP).map((o) => ({ o, n: conta('whatsapp_clicado', (x) => x.servico === o) })).filter((x) => x.n);
    return { visitas, servicos, funis, parados, paradasTeste, paradasDiag, whatsapp };
  }, [eventos, progresso, diags, testes]);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-foreground">Conversões do site</h1>
            <Link to="/admin/posts" className="text-sm text-muted-foreground hover:text-foreground">Posts do blog</Link>
            <Link to="/admin/prospeccao" className="text-sm text-muted-foreground hover:text-foreground">Prospecção</Link>
          </div>
          <div className="flex items-center gap-2">
            {PERIODOS.map((p) => (
              <Button key={p} size="sm" variant={dias === p ? 'default' : 'outline'} onClick={() => setDias(p)}>{p} dias</Button>
            ))}
            <Button size="sm" variant="outline" onClick={carregar} aria-label="Atualizar"><RefreshCw className="h-4 w-4" /></Button>
            <Button size="sm" variant="ghost" onClick={signOut}>Sair</Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {erro && <p className="text-sm text-destructive">{erro}</p>}
        {carregando ? <p className="text-muted-foreground">Carregando…</p> : (
          <>
            <section>
              <h2 className="text-lg font-semibold mb-3 text-foreground">Visitas</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {resumo.visitas.map((v) => (
                  <Card key={v.pg} className="p-5">
                    <p className="text-sm text-muted-foreground">{PAGINAS[v.pg]}</p>
                    <p className="text-3xl font-bold text-foreground tabular-nums">{v.n}</p>
                  </Card>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-2">Contagem própria do site, começou a registrar em 10/11/2026. O GA4 continua sendo a fonte para tráfego total.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-1 text-foreground">Cliques no WhatsApp</h2>
              <p className="text-xs text-muted-foreground mb-3">Botões de conversa do site, por lugar do clique. A conversa em si acontece no seu WhatsApp.</p>
              {resumo.whatsapp.length === 0 ? <p className="text-sm text-muted-foreground">Nenhum clique no período.</p> : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {resumo.whatsapp.map((w) => (
                    <Card key={w.o} className="p-4">
                      <p className="text-sm text-muted-foreground">{ORIGENS_WPP[w.o]}</p>
                      <p className="text-2xl font-bold text-foreground tabular-nums">{w.n}</p>
                    </Card>
                  ))}
                </div>
              )}
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3 text-foreground">Funil por formulário</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-left text-muted-foreground">
                    <tr><th className="py-2 pr-4">Formulário</th><th className="pr-4">Viu / abriu</th><th className="pr-4">Começou</th><th className="pr-4">Deixou contato</th><th className="pr-4">Concluiu</th><th>Conclusão</th></tr>
                  </thead>
                  <tbody className="tabular-nums">
                    {resumo.funis.map((f) => (
                      <tr key={f.nome} className="border-t border-border">
                        <td className="py-2 pr-4 font-medium text-foreground">{f.nome}</td>
                        <td className="pr-4">{f.topo}</td><td className="pr-4">{f.iniciou}</td><td className="pr-4">{f.contato}</td>
                        <td className="pr-4">{f.concluiu}</td><td>{pct(f.concluiu, f.iniciou)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-5">
                <h3 className="font-semibold mb-3 text-foreground">Onde o Teste de Maturidade para</h3>
                <p className="text-xs text-muted-foreground mb-3">Quantas perguntas a pessoa respondeu antes de parar (0 = viu o perfil e não começou o quiz).</p>
                <div className="flex items-end gap-1 h-28">
                  {resumo.paradasTeste.map((n, i) => {
                    const max = Math.max(1, ...resumo.paradasTeste);
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <span className="text-xs tabular-nums text-muted-foreground">{n || ''}</span>
                        <div className="w-full rounded-t bg-primary/70" style={{ height: `${(n / max) * 80}px` }} />
                        <span className="text-[10px] text-muted-foreground">{i}</span>
                      </div>
                    );
                  })}
                </div>
              </Card>
              <Card className="p-5">
                <h3 className="font-semibold mb-3 text-foreground">Onde o Diagnóstico para</h3>
                <p className="text-xs text-muted-foreground mb-3">1 operação · 2 atendimento · 3 negócio · 4 contato (resultado visto).</p>
                <div className="grid grid-cols-4 gap-3 text-center">
                  {resumo.paradasDiag.map((n, i) => (
                    <div key={i}><p className="text-2xl font-bold tabular-nums text-foreground">{n}</p><p className="text-xs text-muted-foreground">etapa {i + 1}</p></div>
                  ))}
                </div>
              </Card>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-1 text-foreground">Serviços: preço aberto e interesse</h2>
              <p className="text-xs text-muted-foreground mb-3">Se muita gente abre o preço e pouca abre o formulário depois, o valor pode estar afastando.</p>
              {resumo.servicos.length === 0 ? <p className="text-sm text-muted-foreground">Nenhum registro no período.</p> : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="text-left text-muted-foreground">
                      <tr><th className="py-2 pr-4">Serviço</th><th className="pr-4">Abriu o preço</th><th className="pr-4">Abriu o formulário</th><th className="pr-4">Começou</th><th className="pr-4">Deixou contato</th><th>Enviou</th></tr>
                    </thead>
                    <tbody className="tabular-nums">
                      {resumo.servicos.map((s) => (
                        <tr key={s.sv} className="border-t border-border">
                          <td className="py-2 pr-4 font-medium text-foreground">{SERVICOS[s.sv]}</td>
                          <td className="pr-4">{s.preco}</td><td className="pr-4">{s.modal}</td><td className="pr-4">{s.iniciou}</td><td className="pr-4">{s.contato}</td><td>{s.enviou}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-1 text-foreground">Deixaram contato e não concluíram</h2>
              <p className="text-xs text-muted-foreground mb-3">Para retomar a conversa. Mais recentes primeiro.</p>
              {resumo.parados.length === 0 ? <p className="text-sm text-muted-foreground">Ninguém nesse período.</p> : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="text-left text-muted-foreground">
                      <tr><th className="py-2 pr-4">Quando</th><th className="pr-4">Origem</th><th className="pr-4">Nome</th><th className="pr-4">E-mail</th><th className="pr-4">Telefone</th><th className="pr-4">Tipo</th><th>Onde parou</th></tr>
                    </thead>
                    <tbody>
                      {resumo.parados.map((x, i) => (
                        <tr key={i} className="border-t border-border">
                          <td className="py-2 pr-4 tabular-nums whitespace-nowrap">{dataBr(x.quando)}</td>
                          <td className="pr-4">{x.origem}</td><td className="pr-4">{x.nome ?? '–'}</td><td className="pr-4">{x.email ?? '–'}</td>
                          <td className="pr-4 whitespace-nowrap">{x.telefone ?? '–'}</td><td className="pr-4">{x.tipo ?? '–'}</td><td className="text-muted-foreground">{x.onde}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
};

export default Conversoes;
