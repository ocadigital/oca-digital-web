
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const Services = () => {
  const services = [
    {
      title: "Diagnóstico Estratégico",
      description: "Análise completa da sua operação atual com sugestões práticas para melhorar seus resultados.",
      duration: "1 semana",
      features: [
        "Auditoria completa do marketing digital",
        "Análise da concorrência",
        "Mapeamento de oportunidades",
        "Plano de ação personalizado",
        "Relatório detalhado com insights"
      ]
    },
    {
      title: "SDR - Núcleo de Pré-qualificação",
      description: "Unificação e centralização de leads, CRM, scripts de atendimento e dashboard em tempo real.",
      duration: "3 meses",
      features: [
        "Centralização de leads em repositório único",
        "Implementação de CRM personalizado",
        "Scripts BANT para qualificação",
        "Dashboard de acompanhamento",
        "Clusterização por personas"
      ]
    },
    {
      title: "Automação de Marketing",
      description: "Lead scoring, cadência de e-mails e priorização automática de atendimentos.",
      duration: "3 meses",
      features: [
        "Algoritmo de Lead Score",
        "Priorização automática de filas",
        "E-mails personalizados",
        "Limpeza automática de base",
        "Segmentação avançada"
      ]
    },
    {
      title: "Lançamento Imobiliário",
      description: "Campanha completa para lançamentos com mídia paga, landing page e materiais gráficos.",
      duration: "1 mês",
      features: [
        "Mídia paga estratégica",
        "Landing page otimizada",
        "E-mail marketing",
        "Artes gráficas",
        "Gestão de redes sociais"
      ]
    }
  ];

  const packages = [
    {
      name: "Plano Essencial",
      price: "R$ 2.700/mês",
      description: "Mídia paga + landing + My Business + relatório",
      features: [
        "Google Ads",
        "Meta (Instagram e Facebook)",
        "Gestão Google My Business",
        "Relatórios mensais"
      ]
    },
    {
      name: "Plano Avançado",
      price: "R$ 3.200/mês",
      description: "Inclui planejamento estratégico e conteúdo",
      features: [
        "Tudo do Essencial",
        "Planejamento estratégico",
        "1 blog post mensal",
        "1 e-mail marketing mensal"
      ]
    },
    {
      name: "Plano Full",
      price: "R$ 4.000/mês",
      description: "Solução completa com automação",
      features: [
        "Tudo do Avançado",
        "Automação de marketing",
        "Consultoria mensal",
        "Suporte prioritário"
      ]
    }
  ];

  const handleInteresseClick = () => {
    const contactSection = document.getElementById('contato');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleContratarClick = () => {
    window.open('https://form.typeform.com/to/FVEwOxzP', '_blank');
  };

  return (
    <section id="servicos" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Nossos Serviços
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Soluções completas para transformar sua operação imobiliária em uma máquina de conversão
          </p>
        </div>

        <div className="mb-20">
          <h3 className="text-3xl font-bold text-center mb-12 text-gray-900">Serviços Pontuais</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="p-8 hover:shadow-lg transition-shadow bg-white border-gray-200">
                <div className="mb-6">
                  <h4 className="text-2xl font-bold mb-2 text-gray-900">{service.title}</h4>
                  <p className="text-gray-700 mb-4">{service.description}</p>
                  <span className="text-gray-600">Duração: {service.duration}</span>
                </div>
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-blue-500 mr-2">✓</span>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                  onClick={handleInteresseClick}
                >
                  Tenho Interesse!
                </Button>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-3xl font-bold text-center mb-4 text-gray-900">Pacotes Mensais</h3>
          <p className="text-xl text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Serviços mensais contínuos para impulsionar o desempenho da sua imobiliária com estratégias comprovadas
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {packages.map((pkg, index) => (
              <Card key={index} className={`p-8 hover:shadow-lg transition-shadow bg-white border-gray-200 ${index === 1 ? 'border-blue-400 border-2' : ''}`}>
                {index === 1 && (
                  <div className="bg-blue-600 text-white text-center py-2 px-4 rounded-t-lg -mt-8 -mx-8 mb-6 font-semibold">
                    Mais Popular
                  </div>
                )}
                <div className="text-center mb-6">
                  <h4 className="text-2xl font-bold mb-2 text-gray-900">{pkg.name}</h4>
                  <div className="text-3xl font-bold text-blue-600 mb-2">{pkg.price}</div>
                  <p className="text-gray-600">{pkg.description}</p>
                </div>
                <ul className="space-y-2 mb-6">
                  {pkg.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-blue-500 mr-2">✓</span>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className={`w-full font-semibold ${index === 1 ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}`}
                  onClick={handleContratarClick}
                >
                  Contratar Agora
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
