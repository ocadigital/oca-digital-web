import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
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
import { cases, type CaseStudy } from '@/data/cases';

const CaseCard = ({ caseStudy }: { caseStudy: CaseStudy }) => (
  <Card className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
    {caseStudy.coverImage && (
      <img
        src={caseStudy.coverImage}
        alt={caseStudy.title}
        className="w-full h-48 object-cover"
      />
    )}
    <div className="p-6 flex flex-col flex-1">
      <span className="text-xs font-semibold text-primary mb-2">
        {caseStudy.segment}
      </span>
      <h2 className="text-xl font-bold mb-2 text-foreground">
        {caseStudy.title}
      </h2>
      <p className="text-muted-foreground mb-4 line-clamp-3 flex-1">
        {caseStudy.summary}
      </p>
      {caseStudy.metrics.length > 0 && (
        <div className="grid grid-cols-2 gap-2 mb-4">
          {caseStudy.metrics.slice(0, 2).map((metric) => (
            <div key={metric.label} className="text-center bg-muted rounded-lg py-2">
              <div className="font-bold text-primary">{metric.value}</div>
              <div className="text-xs text-muted-foreground">{metric.label}</div>
            </div>
          ))}
        </div>
      )}
      <Link to={`/cases/${caseStudy.slug}`}>
        <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
          Ver case completo
        </Button>
      </Link>
    </div>
  </Card>
);

const CasesIndex = () => {
  const mainCases = cases.filter((c) => !c.otherSegment);
  const otherCases = cases.filter((c) => c.otherSegment);

  return (
    <div className="min-h-screen bg-background pt-24">
      <Helmet>
        <title>Cases de Sucesso | OCA Digital</title>
        <meta
          name="description"
          content="Resultados reais de imobiliárias e incorporadoras que transformaram sua operação com a OCA Digital."
        />
        <link rel="canonical" href="https://www.ocadigital.com.br/cases" />
        <meta property="og:title" content="Cases de Sucesso | OCA Digital" />
        <meta
          property="og:description"
          content="Resultados reais de imobiliárias e incorporadoras que transformaram sua operação com a OCA Digital."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.ocadigital.com.br/cases" />
      </Helmet>
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Breadcrumb className="mb-8">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Cases</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Cases de Sucesso</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Resultados reais de imobiliárias e incorporadoras que transformaram sua operação com a OCA Digital
          </p>
        </div>

        {cases.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">Nenhum case publicado ainda.</p>
          </Card>
        ) : (
          <>
            {mainCases.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {mainCases.map((caseStudy) => (
                  <CaseCard key={caseStudy.id} caseStudy={caseStudy} />
                ))}
              </div>
            )}

            {otherCases.length > 0 && (
              <div className="mt-16">
                <h2 className="text-2xl font-bold text-foreground mb-2">Outros segmentos</h2>
                <p className="text-muted-foreground mb-8">
                  Cases fora do foco imobiliário atual, de quando a OCA Digital se chamava PontoBr —
                  mostrando a mesma metodologia aplicada a outros negócios.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {otherCases.map((caseStudy) => (
                    <CaseCard key={caseStudy.id} caseStudy={caseStudy} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default CasesIndex;
