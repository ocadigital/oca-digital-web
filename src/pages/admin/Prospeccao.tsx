import { Fragment, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowDown, ArrowUp, ExternalLink, RefreshCw } from 'lucide-react';

// Imobiliárias do Teste A (Cliente Oculto). Tabela fora do types.ts gerado, por isso o tipo local.
interface Imobiliaria {
  id: string;
  nome: string;
  regiao: string;
  bairro: string | null;
  telefone: string | null;
  site: string | null;
  instagram: string | null;
  seguidores_instagram: number | null;
  google_nota: number | null;
  google_avaliacoes: number | null;
  meta_ads_ativo: boolean | null;
  plataforma_site: string | null;
  estoque_venda: number | null;
  estoque_locacao: number | null;
  imovel_venda_url: string | null;
  imovel_venda_descricao: string | null;
  imovel_locacao_url: string | null;
  imovel_locacao_descricao: string | null;
  ex_cliente: boolean;
  rating_interno: number | null;
  status: string;
  observacoes: string | null;
  rating: number;
}

// Rating provisório (0 a 100): Instagram 35, estoque 25, Google 20, anúncio na Meta 20.
// Se rating_interno estiver preenchido no banco, ele vale.
const score = (d: Imobiliaria) => {
  const ig = d.seguidores_instagram ? Math.min(Math.log10(d.seguidores_instagram) / Math.log10(40000), 1) : 0;
  const total = (d.estoque_venda || 0) + (d.estoque_locacao || 0);
  const est = total ? Math.min(Math.log10(total + 1) / Math.log10(3500), 1) : 0;
  const g = d.google_nota ? (d.google_nota / 5) * Math.min(Math.log10((d.google_avaliacoes || 0) + 1) / 3, 1) : 0;
  return Math.round(ig * 35 + est * 25 + g * 20 + (d.meta_ads_ativo ? 20 : 0));
};

const fmt = (n: number | null) => (n == null ? '—' : n.toLocaleString('pt-BR'));

type SortKey = 'nome' | 'regiao' | 'seguidores_instagram' | 'estoque_venda' | 'estoque_locacao' | 'google_nota' | 'rating';

const COLS: { key: SortKey | 'bairro' | 'plataforma_site'; label: string; num?: boolean }[] = [
  { key: 'nome', label: 'Imobiliária' },
  { key: 'regiao', label: 'Região' },
  { key: 'bairro', label: 'Bairro' },
  { key: 'plataforma_site', label: 'Plataforma' },
  { key: 'seguidores_instagram', label: 'Seguidores IG', num: true },
  { key: 'estoque_venda', label: 'Venda', num: true },
  { key: 'estoque_locacao', label: 'Locação', num: true },
  { key: 'google_nota', label: 'Google', num: true },
  { key: 'rating', label: 'Rating', num: true },
];

const ExtLink = ({ href, children }: { href: string | null; children: React.ReactNode }) =>
  href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1">
      {children} <ExternalLink className="h-3 w-3" />
    </a>
  ) : (
    <span className="text-muted-foreground">não encontrado</span>
  );

const Prospeccao = () => {
  const { signOut, user } = useAuth();
  const [rows, setRows] = useState<Imobiliaria[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [regiao, setRegiao] = useState('');
  const [plataforma, setPlataforma] = useState('');
  const [ads, setAds] = useState('');
  const [sort, setSort] = useState<{ key: SortKey; dir: 1 | -1 }>({ key: 'rating', dir: -1 });
  const [open, setOpen] = useState<string | null>(null);

  const fetchRows = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('prospeccao_imobiliarias' as any)
        .select('*')
        .order('nome');
      if (error) throw error;
      setRows(((data as any[]) || []).map((d) => {
        const r = { ...d, google_nota: d.google_nota == null ? null : Number(d.google_nota) } as Imobiliaria;
        return { ...r, rating: r.rating_interno ?? score(r) };
      }));
    } catch (error: any) {
      toast.error('Erro ao carregar imobiliárias: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRows();
  }, []);

  const opts = (k: 'regiao' | 'plataforma_site') => [...new Set(rows.map((r) => r[k]).filter(Boolean) as string[])].sort();

  const visible = useMemo(() => {
    const t = q.toLowerCase();
    return rows
      .filter((r) =>
        (!t || [r.nome, r.bairro, r.plataforma_site].join(' ').toLowerCase().includes(t)) &&
        (!regiao || r.regiao === regiao) &&
        (!plataforma || r.plataforma_site === plataforma) &&
        (!ads || String(Number(!!r.meta_ads_ativo)) === ads))
      .sort((a, b) => {
        const x = a[sort.key], y = b[sort.key];
        if (x == null) return 1;
        if (y == null) return -1;
        return (typeof x === 'string' ? x.localeCompare(y as string) : (x as number) - (y as number)) * sort.dir;
      });
  }, [rows, q, regiao, plataforma, ads, sort]);

  const toggleSort = (key: string) => {
    if (!['nome', 'regiao', 'seguidores_instagram', 'estoque_venda', 'estoque_locacao', 'google_nota', 'rating'].includes(key)) return;
    const k = key as SortKey;
    setSort((s) => (s.key === k ? { key: k, dir: (-s.dir) as 1 | -1 } : { key: k, dir: k === 'nome' || k === 'regiao' ? 1 : -1 }));
  };

  const kpis = [
    [visible.length, 'imobiliárias'],
    [visible.filter((r) => r.meta_ads_ativo).length, 'anunciam na Meta'],
    [visible.filter((r) => r.ex_cliente).length, 'ex-clientes'],
    [visible.filter((r) => r.imovel_venda_url && r.imovel_locacao_url).length, 'com venda e locação p/ teste'],
  ] as const;

  const selectCls = 'h-10 rounded-md border border-input bg-background px-3 text-sm';

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center gap-4 flex-wrap">
          <h1 className="text-2xl font-bold text-foreground">Prospecção de Imobiliárias</h1>
          <div className="flex gap-4 items-center">
            <Link to="/admin/posts" className="text-sm text-muted-foreground hover:text-foreground">Posts do blog</Link>
            <span className="text-muted-foreground">Olá, {user?.email}</span>
            <Button onClick={signOut} variant="outline" size="sm">Sair</Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {kpis.map(([v, l]) => (
            <Card key={l} className="p-4">
              <div className="text-2xl font-bold text-foreground">{v}</div>
              <div className="text-sm text-muted-foreground">{l}</div>
            </Card>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          <Input className="max-w-xs" placeholder="Buscar nome, bairro ou plataforma" value={q} onChange={(e) => setQ(e.target.value)} />
          <select className={selectCls} value={regiao} onChange={(e) => setRegiao(e.target.value)}>
            <option value="">Todas as regiões</option>
            {opts('regiao').map((o) => <option key={o}>{o}</option>)}
          </select>
          <select className={selectCls} value={plataforma} onChange={(e) => setPlataforma(e.target.value)}>
            <option value="">Todas as plataformas</option>
            {opts('plataforma_site').map((o) => <option key={o}>{o}</option>)}
          </select>
          <select className={selectCls} value={ads} onChange={(e) => setAds(e.target.value)}>
            <option value="">Meta Ads: todos</option>
            <option value="1">Anuncia na Meta</option>
            <option value="0">Não anuncia</option>
          </select>
          <Button variant="outline" onClick={fetchRows} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Recarregar
          </Button>
        </div>

        <Card className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                {COLS.map((c) => (
                  <th
                    key={c.key}
                    onClick={() => toggleSort(c.key)}
                    className={`px-3 py-2 font-medium text-muted-foreground whitespace-nowrap cursor-pointer select-none ${c.num ? 'text-right' : 'text-left'}`}
                  >
                    {c.label}
                    {sort.key === c.key && (sort.dir > 0 ? <ArrowUp className="inline h-3 w-3 ml-1" /> : <ArrowDown className="inline h-3 w-3 ml-1" />)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {!loading && visible.length === 0 && (
                <tr><td colSpan={COLS.length} className="p-8 text-center text-muted-foreground">Nenhuma imobiliária encontrada.</td></tr>
              )}
              {visible.map((r) => (
                <Fragment key={r.id}>
                  <tr className="border-b cursor-pointer hover:bg-muted/50" onClick={() => setOpen(open === r.id ? null : r.id)}>
                    <td className="px-3 py-2">
                      <div className="font-semibold text-foreground">{r.nome}</div>
                      <div className="flex gap-1 mt-1">
                        {r.meta_ads_ativo && <span className="px-2 py-0.5 text-xs rounded bg-green-100 text-green-800">Meta Ads</span>}
                        {r.ex_cliente && <span className="px-2 py-0.5 text-xs rounded bg-amber-100 text-amber-800">ex-cliente</span>}
                      </div>
                    </td>
                    <td className="px-3 py-2">{r.regiao}</td>
                    <td className="px-3 py-2">{r.bairro}</td>
                    <td className="px-3 py-2">{r.plataforma_site || '—'}</td>
                    <td className="px-3 py-2 text-right tabular-nums">{fmt(r.seguidores_instagram)}</td>
                    <td className="px-3 py-2 text-right tabular-nums">{fmt(r.estoque_venda)}</td>
                    <td className="px-3 py-2 text-right tabular-nums">{fmt(r.estoque_locacao)}</td>
                    <td className="px-3 py-2 text-right tabular-nums whitespace-nowrap">
                      {r.google_nota ? <>{r.google_nota.toFixed(1)} <span className="text-muted-foreground">({fmt(r.google_avaliacoes)})</span></> : '—'}
                    </td>
                    <td className="px-3 py-2 text-right tabular-nums font-semibold">{r.rating}</td>
                  </tr>
                  {open === r.id && (
                    <tr className="border-b bg-muted/30">
                      <td colSpan={COLS.length} className="px-3 py-4">
                        <div className="grid gap-4 md:grid-cols-4">
                          <div>
                            <div className="text-xs uppercase text-muted-foreground mb-1">Imóvel de venda</div>
                            <div>{r.imovel_venda_descricao}</div>
                            <ExtLink href={r.imovel_venda_url}>ver imóvel</ExtLink>
                          </div>
                          <div>
                            <div className="text-xs uppercase text-muted-foreground mb-1">Imóvel de locação</div>
                            <div>{r.imovel_locacao_descricao}</div>
                            <ExtLink href={r.imovel_locacao_url}>ver imóvel</ExtLink>
                          </div>
                          <div className="space-y-1">
                            <div className="text-xs uppercase text-muted-foreground mb-1">Contato</div>
                            <div>{r.telefone || 'sem telefone'}</div>
                            <div><ExtLink href={r.site}>{r.site?.replace(/^https?:\/\/(www\.)?/, '')}</ExtLink></div>
                            {r.instagram && <div><ExtLink href={`https://www.instagram.com/${r.instagram}/`}>@{r.instagram}</ExtLink></div>}
                          </div>
                          <div>
                            <div className="text-xs uppercase text-muted-foreground mb-1">Status e observações</div>
                            <div>{r.status}</div>
                            <div className="text-muted-foreground">{r.observacoes || '—'}</div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </Card>
        <p className="text-xs text-muted-foreground">
          Rating provisório (0 a 100): seguidores no Instagram 35, estoque 25, Google 20, anúncio na Meta 20. Se rating_interno estiver preenchido no banco, ele vale.
        </p>
      </main>
    </div>
  );
};

export default Prospeccao;
