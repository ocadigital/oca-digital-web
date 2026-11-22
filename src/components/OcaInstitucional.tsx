// Blocos institucionais das páginas de serviço: pilar do serviço, metodologia, resumo do fundador
// e a esteira de cases e artigos relacionados.
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { getCaseBySlug, type CaseStudy } from '@/data/cases';
import { metodologia, pilares, type PilarId } from '@/data/oca';

/** Os 3 pilares da OCA com o(s) pilar(es) deste serviço em destaque. */
export const PilaresDoServico = ({ ativos }: { ativos: PilarId[] }) => {
  if (!ativos.length) return null;
  const todos = ativos.length === pilares.length;
  return (
    <section className="mb-14" aria-labelledby="pilar-titulo">
      <p className="text-sm font-semibold uppercase tracking-wider text-primary mb-2">Os 3 pilares da OCA</p>
      <h2 id="pilar-titulo" className="text-2xl font-bold text-foreground mb-6 text-balance">
        {todos ? 'Este serviço reúne os três pilares' : `Este serviço faz parte de ${pilares.find((p) => p.id === ativos[0])?.titulo}`}
      </h2>
      <div className="grid gap-4 md:grid-cols-3">
        {pilares.map((p) => {
          const ativo = ativos.includes(p.id);
          return (
            <div
              key={p.id}
              className={`rounded-xl border p-5 transition-colors ${
                ativo ? 'border-primary bg-primary/10' : 'border-border bg-card opacity-60'
              }`}
            >
              {ativo && !todos && (
                <span className="inline-block mb-2 rounded-full bg-primary px-2.5 py-0.5 text-xs font-semibold text-primary-foreground">
                  Este serviço
                </span>
              )}
              <h3 className="font-bold text-foreground mb-2">{p.titulo}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{p.descricao}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

/** As 4 fases da metodologia, igual à página /sobre. */
export const Metodologia = () => (
  <section className="mb-14" aria-labelledby="metodologia-titulo">
    <h2 id="metodologia-titulo" className="text-2xl font-bold text-foreground mb-2">Nossa Metodologia</h2>
    <p className="text-muted-foreground mb-6 max-w-3xl">
      Desenvolvemos uma abordagem estruturada que combina análise de dados, estratégia e execução para gerar resultados consistentes.
    </p>
    <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {metodologia.map((m) => (
        <li key={m.fase}>
          <Card className="h-full p-5 bg-card border-border/50">
            <div className="text-3xl mb-3" aria-hidden="true">{m.icone}</div>
            <h3 className="font-bold text-lg mb-2 text-foreground">{m.fase}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{m.descricao}</p>
          </Card>
        </li>
      ))}
    </ol>
  </section>
);

/** Resumo do fundador, com link para o perfil completo em /sobre#anderson. */
export const FundadorResumo = () => (
  <section className="mb-14 flex flex-col sm:flex-row gap-6 items-start sm:items-center rounded-2xl border border-border bg-card p-6 sm:p-8" aria-label="Quem está por trás da OCA">
    <img
      src="/images/anderson-goncalves-600.webp"
      alt="Anderson Gonçalves, fundador da OCA Digital"
      width={112}
      height={112}
      loading="lazy"
      className="h-28 w-28 rounded-full object-cover object-top border border-border shrink-0"
    />
    <div>
      <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-1">Quem está por trás da OCA</p>
      <h2 className="text-2xl font-bold text-foreground">Anderson Gonçalves</h2>
      <p className="text-muted-foreground mb-3">Fundador da OCA Digital</p>
      <p className="text-muted-foreground leading-relaxed">
        Foi Head de Marketing da Brognoli, Gerente de Marketing da Buzz Imobiliária e responsável pelo marketing da Santa Ilha
        Imóveis. Antes de pensar em anúncio, olha para o processo: de onde vem o lead, quem atende e o que se perde no caminho.
      </p>
      <Link to="/sobre#anderson" className="inline-block mt-3 text-sm font-medium text-primary hover:underline">
        Conheça a trajetória do Anderson
      </Link>
    </div>
  </section>
);

interface PostResumo {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  image: string | null;
  category: string | null;
}

type Item = { tipo: 'case'; c: CaseStudy } | { tipo: 'post'; p: PostResumo };

/** Intercala cases e posts: case, post, case, post... e o que sobrar no fim. */
const intercalar = (cs: CaseStudy[], ps: PostResumo[]): Item[] => {
  const out: Item[] = [];
  for (let i = 0; i < Math.max(cs.length, ps.length); i++) {
    if (cs[i]) out.push({ tipo: 'case', c: cs[i] });
    if (ps[i]) out.push({ tipo: 'post', p: ps[i] });
  }
  return out;
};

/** Esteira única com os cases e os artigos do blog ligados ao serviço. */
export const EsteiraRelacionados = ({ casesSlugs, postsSlugs }: { casesSlugs: string[]; postsSlugs: string[] }) => {
  const [posts, setPosts] = useState<PostResumo[]>([]);
  const [trilho, setTrilho] = useState<HTMLDivElement | null>(null);
  const chave = postsSlugs.join(',');

  useEffect(() => {
    if (!postsSlugs.length) return;
    let ativo = true;
    supabase
      .from('blog_posts')
      .select('id, slug, title, excerpt, image, category')
      .eq('published', true)
      .in('slug', postsSlugs)
      .then(({ data }) => {
        if (!ativo || !data) return;
        const lista = data as PostResumo[];
        setPosts(postsSlugs.map((s) => lista.find((p) => p.slug === s)).filter((p): p is PostResumo => !!p));
      });
    return () => { ativo = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chave]);

  const cs = casesSlugs.map(getCaseBySlug).filter((c): c is CaseStudy => !!c);
  const itens = intercalar(cs, posts);
  if (!itens.length) return null;

  const rolar = (dir: 1 | -1) => trilho?.scrollBy({ left: dir * trilho.clientWidth * 0.8, behavior: 'smooth' });

  return (
    <section className="mt-14" aria-labelledby="esteira-titulo">
      <div className="flex items-end justify-between gap-4 mb-6">
        <h2 id="esteira-titulo" className="text-2xl font-bold text-foreground">Cases e artigos relacionados</h2>
        {itens.length > 3 && (
          <div className="hidden sm:flex gap-2">
            <button type="button" onClick={() => rolar(-1)} aria-label="Anterior" className="rounded-full border border-border p-2 hover:border-primary/50 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            <button type="button" onClick={() => rolar(1)} aria-label="Próximo" className="rounded-full border border-border p-2 hover:border-primary/50 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
      <div ref={setTrilho} className="flex gap-5 overflow-x-auto snap-x snap-mandatory pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 [scrollbar-width:thin]">
        {itens.map((it) => {
          const to = it.tipo === 'case' ? `/cases/${it.c.slug}` : `/blog/${it.p.slug}`;
          const img = it.tipo === 'case' ? it.c.coverImage : it.p.image;
          const titulo = it.tipo === 'case' ? it.c.title : it.p.title;
          return (
            <Link key={to} to={to} className="group snap-start shrink-0 w-[82%] sm:w-[calc((100%-2.5rem)/3)]">
              <Card className="h-full overflow-hidden group-hover:shadow-lg group-hover:border-primary/40 transition">
                {img && <img src={img} alt={titulo} loading="lazy" width={1200} height={670} className="w-full h-40 object-cover" />}
                <div className="p-5">
                  <p className="text-xs font-semibold uppercase tracking-wider mb-1">
                    <span className={it.tipo === 'case' ? 'text-primary' : 'text-foreground'}>
                      {it.tipo === 'case' ? 'Case' : 'Artigo'}
                    </span>
                    <span className="text-muted-foreground normal-case tracking-normal font-medium">
                      {' · '}{it.tipo === 'case' ? it.c.client : it.p.category}
                    </span>
                  </p>
                  <h3 className="font-bold text-foreground line-clamp-3 group-hover:text-primary">{titulo}</h3>
                  {it.tipo === 'case' && it.c.metrics[0] && (
                    <p className="text-sm text-muted-foreground mt-3">
                      <strong className="text-foreground">{it.c.metrics[0].value}</strong> {it.c.metrics[0].label.toLowerCase()}
                    </p>
                  )}
                  {it.tipo === 'post' && it.p.excerpt && <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{it.p.excerpt}</p>}
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </section>
  );
};
