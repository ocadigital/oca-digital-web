
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
    },
    {
      name: "Roberto Costa",
      company: "Costa Incorporações",
      content: "O lançamento do nosso último empreendimento com a OCA Digital foi um sucesso. Vendemos 80% das unidades em 30 dias. A estratégia de marketing foi impecável.",
      rating: 5
    },
    {
      name: "Ana Beatriz",
      company: "Imobiliária Premium",
      content: "A automação de marketing que implementaram revolucionou nosso atendimento. Agora conseguimos nutrir leads automaticamente e nossa equipe foca apenas nos clientes mais qualificados.",
      rating: 5
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
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
            <Card key={index} className="p-8 hover:shadow-lg transition-shadow">
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
              <div className="border-t pt-4">
                <div className="font-bold text-gray-900">{testimonial.name}</div>
                <div className="text-blue-600">{testimonial.company}</div>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">98%</div>
              <div className="text-gray-600">Taxa de Satisfação</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">+180%</div>
              <div className="text-gray-600">ROI Médio dos Clientes</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">24h</div>
              <div className="text-gray-600">Tempo Médio de Resposta</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
