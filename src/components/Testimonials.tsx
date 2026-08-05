
import { Card } from '@/components/ui/card';

const Testimonials = () => {
  const testimonials = [
    {
      name: "Diretoria Comercial",
      company: "Yes Empreendimentos",
      content: "A OCA estruturou nossa captação e nosso atendimento. Hoje temos previsibilidade comercial e dashboards que orientam toda a operação.",
      rating: 5
    },
    {
      name: "Gestão de Operação",
      company: "Brognoli Imóveis",
      content: "Não voltamos mais para planilhas. Marketing, CRM, WhatsApp e cobrança falando entre si — e a equipe focada em vender.",
      rating: 5
    }
  ];

  return (
    <section className="py-20 bg-background section-separator">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            O que nossos clientes dizem
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Resultados reais de empresas que transformaram suas operações com a OCA Digital
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="p-8 card-elevated hover:-translate-y-1 hover:border-primary/40">
              <div className="mb-4">
                <div className="flex text-yellow-400 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i}>⭐</span>
                  ))}
                </div>
                <p className="text-muted-foreground italic leading-relaxed">
                  "{testimonial.content}"
                </p>
              </div>
              <div className="border-t border-border pt-4">
                <div className="font-bold text-foreground">{testimonial.name}</div>
                <div className="text-primary">{testimonial.company}</div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
