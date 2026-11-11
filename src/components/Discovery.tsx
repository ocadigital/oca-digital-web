// Peças de navegação entre conteúdos: cards das ferramentas (calculadora e teste de maturidade)
// intercalados nas listas, esteiras de cases e de posts no fim das páginas e o box do autor.
import { useEffect, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Gauge, Thermometer } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { cases as todosCases, type CaseStudy } from '@/data/cases';

type Ferramenta = 'temperatura' | 'maturidade';

const FERRAMENTAS: Record<Ferramenta, {
  to: string; rotulo: string; titulo: string; texto: string; botao: string; detalhe: string; Icone: typeof Gauge;
}> = {
  temperatura: {
    to: '/diagnostico',
    rotulo: 'Calculadora gratuita',
    titulo: 'Qual a temperatura dos seus leads?',
    texto: 'Responda 3 perguntas sobre a sua operação e veja na hora quanto em comissão pode estar esfriando no WhatsApp.',
    botao: 'Medir meus leads',
    detalhe: '3 perguntas · 2 minutos',
    Icone: Thermometer,
  },
  maturidade: {
    to: '/teste-maturidade',
    rotulo: 'Teste gratuito',
    titulo: 'Em que nível de maturidade está a sua imobiliária?',
    texto: 'São 10 perguntas sobre captação, atendimento e processos. No fim você vê em qual dos 5 níveis está e o que fazer primeiro.',
    botao: 'Fazer o teste',
    detalhe: '10 perguntas · 5 níveis',
    Icone: Gauge,
  },
};

const registrar = (ferramenta: Ferramenta, origem: string) => {
  const w = window as unknown as { dataLayer?: Record<string, unknown>[] };
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({ event: 'tool_card_click', ferramenta, origem });
};

/** Card de ferramenta no mesmo formato dos cards de post e de case, para intercalar nas listas. */
export const ToolCard = ({ ferramenta, origem }: { ferramenta: Ferramenta; origem: string }) => {
  const f = FERRAMENTAS[ferramenta];
  return (
    <Card className="overflow-hidden flex flex-col border-primary/40 hover:shadow-lg transition-shadow">
      <div className="h-48 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-primary/25 via-primary/10 to-accent/20">
        <f.Icone className="h-14 w-14 text-primary" aria-hidden="true" />
        <span className="text-xs font-semibold uppercase tracking-wider text-primary">{f.detalhe}</span>
      </div>
      <div className="p-6 flex flex-col flex-1">
        <span className="text-xs font-semibold text-primary mb-2">{f.rotulo}</span>
        <h2 className="text-xl font-bold mb-2 text-foreground">{f.titulo}</h2>
        <p className="text-muted-foreground mb-4 flex-1">{f.texto}</p>
        <Link to={f.to} onClick={() => registrar(ferramenta, origem)}>
          <Button className="w-full font-semibold">{f.botao}</Button>
        </Link>
      </div>
    </Card>
  );
};

/** Intercala os dois cards de ferramenta numa lista: a calculadora depois do 2º item e o teste depois do 4º. */
export function intercalarFerramentas(itens: ReactNode[], origem: string): ReactNode[] {
  const saida = [...itens];
  const posicoes: [number, Ferramenta][] = [[4, 'maturidade'], [2, 'temperatura']];
  for (const [pos, ferramenta] of posicoes) {
    const card = <ToolCard key={`ferramenta-${ferramenta}`} ferramenta={ferramenta} origem={origem} />;
    if (saida.length >= pos) saida.splice(pos, 0, card);
    else saida.push(card);
  }
  return saida;
}

const casesImobiliarios = () =>
  todosCases
    .filter((c) => !c.otherSegment)
    .sort((a, b) => (b.publishedAt || '').localeCompare(a.publishedAt || ''));

const CaseMini = ({ c }: { c: CaseStudy }) => (
  <Link to={`/cases/${c.slug}`} className="group">
    <Card className="h-full overflow-hidden group-hover:shadow-lg group-hover:border-primary/40 transition">
      {c.coverImage && (
        <img src={c.coverImage} alt={c.title} width={1200} height={670} loading="lazy" className="w-full h-40 object-cover" />
      )}
      <div className="p-5">
        <p className="text-xs font-semibold text-primary mb-1">{c.client}</p>
        <h3 className="font-bold text-foreground line-clamp-3 group-hover:text-primary">{c.title}</h3>
        {c.metrics[0] && (
          <p className="text-sm text-muted-foreground mt-3">
            <strong className="text-foreground">{c.metrics[0].value}</strong> {c.metrics[0].label.toLowerCase()}
          </p>
        )}
      </div>
    </Card>
  </Link>
);

/** Esteira com 3 cases. Sem `referencia`, mostra os mais recentes; com ela, prioriza o mesmo segmento. */
export const CasesRail = ({ titulo, referencia }: { titulo: string; referencia?: CaseStudy }) => {
  let lista = casesImobiliarios();
  if (referencia) {
    lista = lista.filter((c) => c.slug !== referencia.slug);
    lista.sort((a, b) => Number(b.segment === referencia.segment) - Number(a.segment === referencia.segment));
  }
  lista = lista.slice(0, 3);
  if (!lista.length) return null;
  return (
    <section className="mt-16 pt-12 border-t border-border">
      <div className="flex items-end justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold text-foreground">{titulo}</h2>
        <Link to="/cases" className="text-sm font-medium text-primary hover:underline shrink-0">Ver todos os cases</Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {lista.map((c) => <CaseMini key={c.slug} c={c} />)}
      </div>
    </section>
  );
};

interface PostResumo {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  image: string | null;
  category: string | null;
  created_at: string;
}

/** Esteira com 3 posts. Com `categoria`, prioriza a mesma categoria e completa com os mais recentes. */
export const PostsRail = ({ titulo, categoria, excluirId }: { titulo: string; categoria?: string | null; excluirId?: string }) => {
  const [posts, setPosts] = useState<PostResumo[]>([]);
  useEffect(() => {
    let ativo = true;
    supabase
      .from('blog_posts')
      .select('id, slug, title, excerpt, image, category, created_at')
      .eq('published', true)
      .order('created_at', { ascending: false })
      .limit(12)
      .then(({ data }) => {
        if (!ativo || !data) return;
        const outros = (data as PostResumo[]).filter((p) => p.id !== excluirId);
        const mesma = categoria ? outros.filter((p) => p.category === categoria) : [];
        const resto = outros.filter((p) => !mesma.includes(p));
        setPosts([...mesma, ...resto].slice(0, 3));
      });
    return () => { ativo = false; };
  }, [categoria, excluirId]);

  if (!posts.length) return null;
  return (
    <section className="mt-16 pt-12 border-t border-border">
      <div className="flex items-end justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold text-foreground">{titulo}</h2>
        <Link to="/blog" className="text-sm font-medium text-primary hover:underline shrink-0">Ver todos os artigos</Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {posts.map((p) => (
          <Link key={p.id} to={`/blog/${p.slug}`} className="group">
            <Card className="h-full overflow-hidden group-hover:shadow-lg group-hover:border-primary/40 transition">
              {p.image && <img src={p.image} alt={p.title} loading="lazy" className="w-full h-40 object-cover" />}
              <div className="p-5">
                {p.category && <p className="text-xs font-semibold text-primary mb-1">{p.category}</p>}
                <h3 className="font-bold text-foreground line-clamp-3 group-hover:text-primary">{p.title}</h3>
                {p.excerpt && <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{p.excerpt}</p>}
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
};

/** Box do autor no fim dos artigos e dos cases, ligando ao perfil em /sobre#anderson. */
export const AuthorBox = () => (
  <aside className="mt-12 flex flex-col sm:flex-row gap-5 items-start rounded-xl border border-border bg-card p-6" aria-label="Sobre o autor">
    <img
      src="/images/anderson-goncalves-600.webp"
      alt="Anderson Gonçalves"
      width={96}
      height={96}
      loading="lazy"
      className="h-24 w-24 rounded-full object-cover object-top border border-border shrink-0"
    />
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-1">Quem escreve</p>
      <p className="text-lg font-bold text-foreground">
        <Link to="/sobre#anderson" className="hover:text-primary">Anderson Gonçalves</Link>
      </p>
      <p className="text-muted-foreground mt-1">
        Fundador da OCA Digital. Foi Head de Marketing da Brognoli, Gerente de Marketing da Buzz Imobiliária e responsável
        pelo marketing da Santa Ilha Imóveis.
      </p>
      <Link to="/sobre#anderson" className="inline-block mt-3 text-sm font-medium text-primary hover:underline">
        Conheça a trajetória do Anderson
      </Link>
    </div>
  </aside>
);
