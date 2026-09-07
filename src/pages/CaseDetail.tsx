import { Helmet } from 'react-helmet';
import { Link, useParams } from 'react-router-dom';
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
import { getCaseBySlug } from '@/data/cases';

const CaseDetail = () => {
  const { slug } = useParams();
  const caseStudy = slug ? getCaseBySlug(slug) : undefined;

  if (!caseStudy) {
    return (
      <div className="min-h-screen bg-background pt-24">
        <Header />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card className="p-8 text-center">
            <h1 className="text-2xl font-bold mb-4">Case não encontrado</h1>
            <p className="text-muted-foreground mb-6">
              O case que você está procurando não existe ou foi removido.
            </p>
            <Link to="/cases">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Voltar para Cases
              </Button>
            </Link>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  const canonicalUrl = `https://www.ocadigital.com.br/cases/${caseStudy.slug}`;

  return (
    <div className="min-h-screen bg-background pt-24">
      <Helmet>
        <title>{`${caseStudy.title} | OCA Digital`}</title>
        <meta name="description" content={caseStudy.summary} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={caseStudy.title} />
        <meta property="og:description" content={caseStudy.summary} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={canonicalUrl} />
        {caseStudy.coverImage && <meta property="og:image" content={caseStudy.coverImage} />}
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: caseStudy.title,
            description: caseStudy.summary,
            image: caseStudy.coverImage || undefined,
            author: { '@type': 'Organization', name: 'OCA Digital' },
            publisher: { '@type': 'Organization', name: 'OCA Digital' },
            datePublished: caseStudy.publishedAt,
            mainEntityOfPage: canonicalUrl,
          })}
        </script>
      </Helmet>
      <Header />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Breadcrumb className="mb-8">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/cases">Cases</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="line-clamp-1">{caseStudy.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <header className="mb-8">
          <span className="text-sm font-semibold text-primary">{caseStudy.segment}</span>
          <h1 className="text-4xl font-bold text-foreground mt-2 mb-4">{caseStudy.title}</h1>
          <p className="text-xl text-muted-foreground">{caseStudy.summary}</p>
        </header>

        {caseStudy.coverImage && (
          <img
            src={caseStudy.coverImage}
            alt={caseStudy.title}
            className="w-full h-96 object-cover rounded-lg mb-8"
          />
        )}

        {caseStudy.metrics.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
            {caseStudy.metrics.map((metric) => (
              <Card key={metric.label} className="p-6 text-center card-elevated">
                <div className="text-3xl font-bold text-primary mb-1">{metric.value}</div>
                <div className="text-sm text-muted-foreground">{metric.label}</div>
              </Card>
            ))}
          </div>
        )}

        <div className="space-y-8 mb-10">
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-3">O desafio</h2>
            <p className="text-muted-foreground leading-relaxed">{caseStudy.challenge}</p>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-3">A solução</h2>
            <p className="text-muted-foreground leading-relaxed">{caseStudy.solution}</p>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-3">Os resultados</h2>
            <p className="text-muted-foreground leading-relaxed">{caseStudy.results}</p>
          </section>
        </div>

        {caseStudy.externalLinks && caseStudy.externalLinks.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-10">
            {caseStudy.externalLinks.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline">{link.label}</Button>
              </a>
            ))}
          </div>
        )}

        {caseStudy.testimonialQuote && (
          <Card className="p-8 bg-muted/50 mb-10">
            <p className="text-lg italic text-foreground mb-4">"{caseStudy.testimonialQuote}"</p>
            {caseStudy.testimonialAuthor && (
              <div className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">{caseStudy.testimonialAuthor}</span>
                {caseStudy.testimonialRole && <> — {caseStudy.testimonialRole}</>}
              </div>
            )}
          </Card>
        )}

        {caseStudy.relatedBlogSlug && (
          <Card className="p-6 mb-10">
            <h3 className="font-bold text-lg mb-2">Aprenda mais sobre essa estratégia</h3>
            <p className="text-muted-foreground mb-4">
              Confira o artigo do blog relacionado a este case.
            </p>
            <Link to={`/blog/${caseStudy.relatedBlogSlug}`}>
              <Button variant="outline">Ler artigo relacionado</Button>
            </Link>
          </Card>
        )}

        <Card className="p-8 bg-primary/10 border-primary/30 text-center">
          <h3 className="text-2xl font-bold mb-4">Quer um resultado parecido?</h3>
          <p className="text-foreground/90 mb-6">
            Agende uma consultoria gratuita e descubra como podemos ajudar você a alcançar
            resultados como este.
          </p>
          <Button
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
            onClick={() => window.open('https://calendly.com/anderson-goncalves81/30min', '_blank')}
          >
            Agendar Consultoria
          </Button>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default CaseDetail;
