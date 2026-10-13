import { Bot, CheckCircle2, LayoutDashboard, Users, Briefcase, CalendarDays, Building2 } from 'lucide-react';
import { useParallax } from '@/hooks/use-parallax';

/** Barra cinza no lugar de texto (dados reais nunca aparecem no site). */
const Sk = ({ w, h = 'h-2.5', className = '' }: { w: string; h?: string; className?: string }) => (
  <span className={`block rounded-full bg-muted-foreground/20 ${h} ${className}`} style={{ width: w }} aria-hidden="true" />
);

const kpis = [
  { rotulo: 'Total de leads', barra: 'bg-muted-foreground/40', nota: 'Portais, site e anúncios' },
  { rotulo: 'Qualificados', barra: 'bg-emerald-500/40', nota: 'Nota acima de 60' },
  { rotulo: 'No funil', barra: 'bg-blue-500/40', nota: 'Negócios em andamento' },
  { rotulo: 'Fechados', barra: 'bg-emerald-500/40', nota: 'Chaves entregues' },
  { rotulo: 'Perdidos', barra: 'bg-red-500/40', nota: 'Com o motivo registrado' },
];

const origens = [
  { nome: 'Portais', w: '92%' },
  { nome: 'Site', w: '48%' },
  { nome: 'Google', w: '34%' },
  { nome: 'Instagram', w: '22%' },
  { nome: 'WhatsApp', w: '15%' },
];

const etapas = [
  { nome: 'Novo', w: '100%' },
  { nome: 'Em atendimento', w: '70%' },
  { nome: 'Visita agendada', w: '38%' },
  { nome: 'Proposta', w: '20%' },
];

const menu = [
  { icone: LayoutDashboard, nome: 'Painel', ativo: true },
  { icone: Briefcase, nome: 'Negócios' },
  { icone: Users, nome: 'Leads' },
  { icone: CalendarDays, nome: 'Atividades' },
  { icone: Building2, nome: 'Equipe' },
];

const pontos = [
  'Todo lead de portal, site, anúncio e WhatsApp cai no mesmo lugar, com a origem registrada.',
  'Cada contato ganha uma nota automática, então o corretor começa por quem está mais perto de comprar.',
  'O painel mostra quantos leads viraram visita e negócio, separado por canal e por corretor.',
];

/** Seção com a prévia do painel do CRM em estilo skeleton, com parallax nas camadas. */
const CrmPreview = () => {
  const painelRef = useParallax<HTMLDivElement>(-0.06);
  const chipRoboRef = useParallax<HTMLDivElement>(-0.2);
  const chipNotaRef = useParallax<HTMLDivElement>(0.16);
  const brilhoRef = useParallax<HTMLDivElement>(0.25);

  return (
    <section id="painel-crm" className="py-20 bg-secondary section-separator relative overflow-hidden">
      <div
        ref={brilhoRef}
        className="absolute inset-x-0 -top-[20%] -bottom-[20%] pointer-events-none"
        style={{ background: 'radial-gradient(circle at 75% 45%, hsl(265 90% 55% / 0.12), transparent 55%)' }}
      />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-12 items-center">
        <div>
          <p className="text-sm font-semibold tracking-widest uppercase text-primary mb-2">O que você acompanha</p>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4 text-balance">
            Um painel com o comercial inteiro, do lead à chave entregue
          </h2>
          <p className="text-lg text-muted-foreground mb-6">
            É o CRM que implantamos na sua operação. Você abre e vê de onde vieram os contatos, quem foi atendido e quanto
            cada canal virou negócio.
          </p>
          <ul className="space-y-3">
            {pontos.map((p) => (
              <li key={p} className="flex gap-3 text-foreground">
                <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" aria-hidden="true" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative">
          <div ref={painelRef}>
            <div
              className="rounded-2xl border border-border bg-card overflow-hidden"
              style={{ boxShadow: 'var(--shadow-card)' }}
              role="img"
              aria-label="Prévia ilustrativa do painel do CRM: totais de leads, leads por origem, funil de vendas e lista de leads recentes com nota."
            >
              {/* barra do navegador */}
              <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-border bg-muted/40">
                <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
                <span className="ml-3 h-4 flex-1 max-w-[220px] rounded bg-muted-foreground/10" />
              </div>

              <div className="flex">
                {/* menu lateral */}
                <aside className="hidden sm:flex flex-col gap-1 w-36 shrink-0 border-r border-border p-3">
                  <div className="flex items-center gap-2 px-1 pb-3">
                    <img src="/oca-logo-white.webp" alt="" width={333} height={144} className="logo-oca h-6 w-auto" />
                  </div>
                  {menu.map(({ icone: Icone, nome, ativo }) => (
                    <div
                      key={nome}
                      className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-[11px] ${
                        ativo ? 'bg-primary text-primary-foreground font-semibold' : 'text-muted-foreground'
                      }`}
                    >
                      <Icone className="h-3.5 w-3.5" aria-hidden="true" />
                      {nome}
                    </div>
                  ))}
                </aside>

                <div className="flex-1 min-w-0 p-3 sm:p-4 space-y-3">
                  {/* indicadores */}
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                    {kpis.map((k, i) => (
                      <div key={k.rotulo} className={`rounded-lg border border-border p-2 ${i > 2 ? 'hidden sm:block' : ''}`}>
                        <p className="text-[10px] text-muted-foreground leading-tight">{k.rotulo}</p>
                        <Sk w="55%" h="h-4" className={`my-1.5 ${k.barra}`} />
                        <p className="text-[9px] text-muted-foreground/80 leading-tight">{k.nota}</p>
                      </div>
                    ))}
                  </div>

                  {/* gráficos */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="rounded-lg border border-border p-3">
                      <p className="text-[11px] font-semibold text-foreground mb-2">Leads por origem</p>
                      <div className="space-y-1.5">
                        {origens.map((o) => (
                          <div key={o.nome} className="flex items-center gap-2">
                            <span className="w-14 text-right text-[10px] text-muted-foreground">{o.nome}</span>
                            <span className="h-2.5 rounded-sm bg-blue-500/80" style={{ width: o.w, maxWidth: 'calc(100% - 4rem)' }} />
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-lg border border-border p-3">
                      <p className="text-[11px] font-semibold text-foreground mb-2">Funil de vendas</p>
                      <div className="space-y-1.5">
                        {etapas.map((e) => (
                          <div key={e.nome} className="flex items-center gap-2">
                            <span className="w-20 text-right text-[10px] text-muted-foreground leading-tight">{e.nome}</span>
                            <span className="h-2.5 rounded-sm bg-primary/80" style={{ width: e.w, maxWidth: 'calc(100% - 5.5rem)' }} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* leads recentes */}
                  <div className="rounded-lg border border-border p-3">
                    <p className="text-[11px] font-semibold text-foreground mb-2">Leads recentes</p>
                    <div className="grid grid-cols-[1.4fr_1fr_0.8fr_0.6fr] gap-x-3 text-[9px] uppercase tracking-wider text-muted-foreground pb-1.5 border-b border-border">
                      <span>Nome</span>
                      <span>Contato</span>
                      <span>Origem</span>
                      <span>Nota</span>
                    </div>
                    {['62%', '48%', '70%', '55%'].map((w, i) => (
                      <div key={i} className="grid grid-cols-[1.4fr_1fr_0.8fr_0.6fr] gap-x-3 items-center py-1.5 border-b border-border/60 last:border-0">
                        <Sk w={w} />
                        <Sk w="80%" />
                        <Sk w="65%" />
                        <span className="h-3 w-7 rounded-full bg-emerald-500/30" aria-hidden="true" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* cartões flutuantes, em camadas de parallax diferentes */}
          <div ref={chipRoboRef} className="absolute -left-3 sm:-left-8 top-[60%] z-10">
            <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-xs shadow-lg">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600">
                <Bot className="h-4 w-4" aria-hidden="true" />
              </span>
              <span>
                <span className="block font-semibold text-foreground">Lead respondido</span>
                <span className="text-muted-foreground">pelo robô no WhatsApp</span>
              </span>
            </div>
          </div>
          <div ref={chipNotaRef} className="absolute -right-2 sm:-right-6 bottom-[14%] z-10">
            <div className="rounded-xl border border-border bg-card px-3 py-2 text-xs shadow-lg">
              <span className="block text-muted-foreground">Nota do lead</span>
              <span className="flex items-center gap-2">
                <span className="text-lg font-bold text-primary">Quente</span>
                <span className="rounded-full bg-primary/10 px-2 py-0.5 font-semibold text-primary">visita marcada</span>
              </span>
            </div>
          </div>

          <p className="text-xs text-muted-foreground text-center mt-4">Prévia ilustrativa, sem dados de clientes.</p>
        </div>
      </div>
    </section>
  );
};

export default CrmPreview;
