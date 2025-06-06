
import { Card } from '@/components/ui/card';

const Testimonials = () => {
  const testimonials = [
    {
      name: "Carlos Mendes",
      company: "Imobiliária Mendes & Associados",
      content: "A OCA Digital transformou completamente nossa operação. Em 6 meses, nossos leads qualificados aumentaram 250% e nossa taxa de conversão triplicou. O investimento se pagou no primeiro mês.",
      rating: 5
    },
    {
      name: "Marina Silva",
      company: "Corretora Independente",
      content: "Como corretora autônoma, eu estava perdida no marketing digital. A consultoria da OCA me deu clareza e as ferramentas certas. Hoje tenho um pipeline consistente de clientes.",
      rating: 5
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            O que nossos clientes dizem
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Resultados reais de empresas que transformaram suas operações com a OCA Digital
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="p-8 hover:shadow-lg transition-shadow bg-white border-gray-200">
              <div className="mb-4">
                <div className="flex text-yellow-400 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i}>⭐</span>
                  ))}
                </div>
                <p className="text-gray-700 italic leading-relaxed">
                  "{testimonial.content}"
                </p>
              </div>
              <div className="border-t border-gray-200 pt-4">
                <div className="font-bold text-gray-900">{testimonial.name}</div>
                <div className="text-blue-600">{testimonial.company}</div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
