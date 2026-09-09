import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cases } from '@/data/cases';

const FeaturedCases = () => {
  const featuredCases = cases.filter((c) => c.featured && !c.otherSegment).slice(0, 2);

  if (featuredCases.length === 0) return null;

  return (
    <section id="cases" className="py-20 bg-background section-separator">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Cases de Sucesso
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Resultados reais de imobiliárias que transformaram sua operação com a OCA Digital
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {featuredCases.map((caseStudy) => (
            <Card
              key={caseStudy.id}
              className="overflow-hidden card-elevated hover:-translate-y-1 hover:border-primary/40"
            >
              {caseStudy.coverImage && (
                <div className="aspect-video bg-muted overflow-hidden">
                  <img
                    src={caseStudy.coverImage}
                    alt={caseStudy.title}
                    width={1200}
                    height={670}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-6">
                <span className="text-xs font-semibold text-primary">
                  {caseStudy.segment}
                </span>
                <h3 className="text-xl font-bold text-foreground mt-2 mb-3 line-clamp-2">
                  {caseStudy.title}
                </h3>
                <p className="text-muted-foreground mb-4 line-clamp-3">
                  {caseStudy.summary}
                </p>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {caseStudy.metrics.slice(0, 3).map((metric) => (
                    <div key={metric.label} className="text-center bg-muted rounded-lg py-2 px-1">
                      <div className="font-bold text-primary text-sm">{metric.value}</div>
                      <div className="text-[11px] text-muted-foreground leading-tight">
                        {metric.label}
                      </div>
                    </div>
                  ))}
                </div>
                <Link to={`/cases/${caseStudy.slug}`} aria-label={`Ver case completo: ${caseStudy.client}`}>
                  <Button variant="outline">Ver Case Completo</Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Link to="/cases">
            <Button size="lg" className="font-semibold">
              Ver Todos os Cases de Marketing Imobiliário
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCases;
