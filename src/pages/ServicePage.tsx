import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import ServiceLeadModal, { type ServicoSelecionado } from '@/components/ServiceLeadModal';
import { getServicoBySlug, servicos } from '@/data/servicos';
import { getCaseBySlug } from '@/data/cases';
import { abrirWhatsapp } from '@/lib/whatsapp';

const ServicePage = () => {
  const { slug } = useParams();
  const s = slug ? getServicoBySlug(slug) : undefined;
  const [modal, setModal] = useState<ServicoSelecionado | null>(null);
  const [aberta, setAberta] = useState<number | null>(0);

  if (!s) return <Navigate to="/servicos" replace />;

  const canonical = `https://www.ocadigital.com.br/servicos/${s.slug}`;
  const cases = s.cases.map(getCaseBySlug).filter((c): c is NonNullable<typeof c> => !!c);
  const relacionados = s.relacionados.map(getServicoBySlug).filter((r): r is NonNullable<typeof r> => !!r);
  const pedir = () => setModal({ valor: s.valor, titulo: s.nome });

  return (
    <div className="min-h-screen bg-background pt-24">
      <Helmet>
        <title>{s.seoTitle}</title>
        <meta name="description" content={s.seoDescription} />
        <link rel="canonical" href={canonical} />
        <meta property="og:title" content={s.h1} />
        <meta property="og:description" content={s.seoDescription} />
        <meta property="og:url" content={canonical} />
      </Helmet>
      <Header />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Breadcrumb className="mb-8">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild><Link to="/">Home</Link></BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild><Link to="/servicos">Serviços</Link></BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{s.nome}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <header className="mb-12">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">{s.nome}</span>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mt-3 mb-5 text-balance">{s.h1}</h1>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl">{s.intro}</p>
          <div className="flex flex-wrap gap-3 mt-8">
            <Button size="lg" className="font-semibold" onClick={pedir}>{s.ctaLabel}</Button>
            <Button size="lg" variant="outline" onClick={() => abrirWhatsapp('servico', s.nome)}>Falar no WhatsApp</Button>
          </div>
        </header>

        <div className="grid gap-10 md:grid-cols-2 mb-14">
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">Para quem é</h2>
            <ul className="space-y-3">
              {s.paraQuem.map((item) => (
                <li key={item} className="flex items-start gap-2 text-foreground">
                  <span className="text-primary mt-0.5" aria-hidden="true">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">{s.problema.titulo}</h2>
            <p className="text-muted-foreground leading-relaxed">{s.problema.texto}</p>
          </section>
        </div>

        <section className="mb-14">
          <h2 className="text-2xl font-bold text-foreground mb-6">Como funciona</h2>
          <ol className="grid gap-4 sm:grid-cols-2">
            {s.comoFunciona.map((passo, i) => (
              <li key={passo.etapa}>
                <Card className="h-full p-6 card-elevated">
                  <p className="text-sm font-semibold text-primary mb-1">Etapa {i + 1}</p>
                  <h3 className="text-lg font-bold text-foreground mb-2">{passo.etapa}</h3>
                  <p className="text-muted-foreground">{passo.texto}</p>
                </Card>
              </li>
            ))}
          </ol>
        </section>

        {s.pilar ? (
          <section className="mb-14">
            <h2 className="text-2xl font-bold text-foreground mb-6">Serviços de marketing imobiliário</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {relacionados.map((r) => (
                <Link key={r.slug} to={`/servicos/${r.slug}`} className="group">
                  <Card className="h-full p-6 card-elevated group-hover:border-primary/40 transition-colors">
                    <h3 className="text-lg font-bold text-foreground mb-1 group-hover:text-primary">{r.nome}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{r.seoDescription}</p>
                    <p className="text-sm font-semibold text-foreground">{r.preco}</p>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        ) : (
          <section className="grid gap-8 md:grid-cols-[1.4fr_1fr] mb-14">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">O que entregamos</h2>
              <ul className="space-y-3">
                {s.entregas.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-foreground">
                    <span className="text-primary mt-0.5" aria-hidden="true">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Card className="p-6 border-primary/30 bg-primary/5 self-start">
              <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-1">Prazo</p>
              <p className="text-foreground mb-4">{s.prazo}</p>
              <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-1">Investimento</p>
              <p className="text-2xl font-bold text-foreground">{s.preco}</p>
              <p className="text-sm text-muted-foreground mt-2 mb-5">{s.precoNota}</p>
              <Button className="w-full font-semibold" onClick={pedir}>{s.ctaLabel}</Button>
            </Card>
          </section>
        )}

        {cases.length > 0 && (
          <section className="mb-14">
            <h2 className="text-2xl font-bold text-foreground mb-6">Cases relacionados</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {cases.map((c) => (
                <Link key={c.slug} to={`/cases/${c.slug}`} className="group">
                  <Card className="h-full p-6 card-elevated group-hover:border-primary/40 transition-colors">
                    <p className="text-sm font-semibold text-primary mb-1">{c.client}</p>
                    <h3 className="font-bold text-foreground mb-3 group-hover:text-primary">{c.title}</h3>
                    {c.metrics[0] && (
                      <p className="text-sm text-muted-foreground">
                        <strong className="text-foreground">{c.metrics[0].value}</strong> {c.metrics[0].label.toLowerCase()}
                      </p>
                    )}
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="mb-14">
          <h2 className="text-2xl font-bold text-foreground mb-6">Perguntas frequentes</h2>
          <div className="space-y-3">
            {s.faq.map((f, i) => (
              <Card key={f.pergunta} className="overflow-hidden">
                <button
                  type="button"
                  onClick={() => setAberta(aberta === i ? null : i)}
                  aria-expanded={aberta === i}
                  className="flex w-full items-center justify-between gap-4 p-5 text-left font-semibold text-foreground hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {f.pergunta}
                  <ChevronDown className={`h-5 w-5 shrink-0 transition-transform ${aberta === i ? 'rotate-180' : ''}`} aria-hidden="true" />
                </button>
                <div hidden={aberta !== i} className="px-5 pb-5 text-muted-foreground leading-relaxed">{f.resposta}</div>
              </Card>
            ))}
          </div>
        </section>

        {!s.pilar && relacionados.length > 0 && (
          <section className="mb-14">
            <h2 className="text-2xl font-bold text-foreground mb-4">Serviços que combinam</h2>
            <div className="flex flex-wrap gap-2">
              {relacionados.map((r) => (
                <Link key={r.slug} to={`/servicos/${r.slug}`} className="rounded-full border border-border px-4 py-2 text-sm text-foreground hover:border-primary/50 hover:text-primary transition-colors">
                  {r.nome}
                </Link>
              ))}
              <Link to="/servicos/marketing-imobiliario" className="rounded-full border border-border px-4 py-2 text-sm text-foreground hover:border-primary/50 hover:text-primary transition-colors">
                Marketing imobiliário completo
              </Link>
            </div>
          </section>
        )}

        <Card className="p-8 bg-primary/10 border-primary/30 text-center">
          <h2 className="text-2xl font-bold mb-3 text-foreground">Vamos ver se faz sentido para a sua imobiliária?</h2>
          <p className="text-foreground/90 mb-6 max-w-2xl mx-auto">
            Conte como funciona a sua operação hoje e nós dizemos por onde começar, sem compromisso.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button size="lg" className="font-semibold" onClick={pedir}>{s.ctaLabel}</Button>
            <Button size="lg" variant="outline" onClick={() => abrirWhatsapp('servico', s.nome)}>Falar no WhatsApp</Button>
          </div>
        </Card>
      </main>

      <Footer />
      <ServiceLeadModal servico={modal} onClose={() => setModal(null)} />
    </div>
  );
};

export const ServicosIndex = () => {
  const pilar = getServicoBySlug('marketing-imobiliario')!;
  const lista = servicos.filter((s) => !s.pilar);
  return (
    <div className="min-h-screen bg-background pt-24">
      <Helmet>
        <title>Serviços de Marketing Imobiliário | OCA Digital</title>
        <meta name="description" content="Sites, landing pages, anúncios, CRM, processos comerciais, automação com n8n, lançamentos e planejamento de marketing para imobiliárias e incorporadoras." />
        <link rel="canonical" href="https://www.ocadigital.com.br/servicos" />
      </Helmet>
      <Header />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Serviços de marketing imobiliário</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mb-10">
          Cada serviço resolve uma etapa do caminho entre o anúncio e a visita agendada. Você pode contratar um só ou combinar vários. Clique em um serviço para ver como funciona, o prazo, o investimento e as perguntas frequentes.
        </p>
        <Link to={`/servicos/${pilar.slug}`} className="group block mb-8">
          <Card className="p-8 border-primary/30 bg-primary/5 group-hover:border-primary/60 transition-colors">
            <p className="text-sm font-semibold text-primary mb-1">Visão geral</p>
            <h2 className="text-2xl font-bold text-foreground mb-2">{pilar.h1}</h2>
            <p className="text-muted-foreground">{pilar.seoDescription}</p>
            <p className="mt-4 text-sm font-semibold text-primary group-hover:underline">Ver a visão geral →</p>
          </Card>
        </Link>
        <div className="grid gap-4 sm:grid-cols-2">
          {lista.map((s) => (
            <Link key={s.slug} to={`/servicos/${s.slug}`} className="group">
              <Card className="h-full p-6 card-elevated group-hover:border-primary/40 transition-colors">
                <h2 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary">{s.nome}</h2>
                <p className="text-sm text-muted-foreground mb-3">{s.seoDescription}</p>
                <p className="text-sm font-semibold text-foreground">{s.preco}</p>
                <p className="mt-4 text-sm font-semibold text-primary group-hover:underline">Ver página do serviço →</p>
              </Card>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ServicePage;
