
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const Services = () => {
  const services = [
    {
      title: "SDR - Núcleo de Pré-qualificação",
      description: "Unificação e centralização de leads, CRM, scripts de atendimento e dashboard em tempo real.",
      price: "R$ 20.000",
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
      title: "SEO Avançado",
      description: "Otimização completa do site, estratégia de palavras-chave e monitoramento de posicionamento.",
      price: "R$ 20.000",
      duration: "4 meses",
      features: [
        "Auditoria técnica completa",
        "Estratégia de palavras-chave",
        "Otimização de imagens e metadados",
        "Gestão de backlinks",
        "Política de reviews"
      ]
    },
    {
      title: "Automação de Marketing",
      description: "Lead scoring, cadência de e-mails e priorização automática de atendimentos.",
      price: "R$ 9.000",
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
      price: "R$ 6.000",
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
      price: "R$ 3.000/mês",
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
      price: "R$ 5.000/mês",
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
      price: "R$ 8.000/mês",
      description: "Solução completa com SEO e automação",
      features: [
        "Tudo do Avançado",
        "SEO contínuo",
        "Automação de marketing",
        "Consultoria mensal"
      ]
    }
  ];

  return (
    <section id="servicos" className="py-20 bg-white">
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
          <h3 className="text-3xl font-bold text-center mb-12">Serviços Pontuais</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="p-8 hover:shadow-lg transition-shadow">
                <div className="mb-6">
                  <h4 className="text-2xl font-bold mb-2">{service.title}</h4>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-3xl font-bold text-blue-600">{service.price}</span>
                    <span className="text-gray-500">em {service.duration}</span>
                  </div>
                </div>
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-blue-600 mr-2">✓</span>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Saiba Mais
                </Button>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-3xl font-bold text-center mb-12">Pacotes Mensais</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {packages.map((pkg, index) => (
              <Card key={index} className={`p-8 hover:shadow-lg transition-shadow ${index === 1 ? 'border-blue-500 border-2' : ''}`}>
                {index === 1 && (
                  <div className="bg-blue-600 text-white text-center py-2 px-4 rounded-t-lg -mt-8 -mx-8 mb-6">
                    Mais Popular
                  </div>
                )}
                <div className="text-center mb-6">
                  <h4 className="text-2xl font-bold mb-2">{pkg.name}</h4>
                  <div className="text-3xl font-bold text-blue-600 mb-2">{pkg.price}</div>
                  <p className="text-gray-600">{pkg.description}</p>
                </div>
                <ul className="space-y-2 mb-6">
                  {pkg.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-blue-600 mr-2">✓</span>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className={`w-full ${index === 1 ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-800 hover:bg-gray-900'}`}>
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
