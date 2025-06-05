
import { Card } from '@/components/ui/card';

const About = () => {
  const methodology = [
    {
      phase: "Descoberta",
      icon: "🔹",
      description: "Coletamos dados, analisamos o cenário atual e escutamos o time interno. É o momento de abrir possibilidades, identificar gargalos e entender o comportamento dos leads."
    },
    {
      phase: "Definição",
      icon: "🔸",
      description: "Com base nos dados, organizamos os aprendizados, identificamos oportunidades e traçamos um diagnóstico estratégico. Aqui é onde as ideias começam a ganhar forma."
    },
    {
      phase: "Desenvolvimento",
      icon: "🔹",
      description: "Criamos e implementamos soluções práticas — desde ajustes técnicos no site e automações de marketing até campanhas de mídia paga e novos processos comerciais."
    },
    {
      phase: "Entrega",
      icon: "🔸",
      description: "Validamos, medimos e refinamos. Entregamos relatórios, dashboards e insights contínuos para que a empresa evolua com base em dados e cultura de melhoria contínua."
    }
  ];

  const pillars = [
    {
      title: "Organização de Processos",
      description: "Implantação de CRM, NPS, unificação dos Leads para atendimento, processos e metodologia de SDR para criação de núcleo especializado de atendimento."
    },
    {
      title: "Captação de Clientes",
      description: "Geração de Leads através de Campanhas Marketing customizadas, criação de logo, lançamentos imobiliários e conteúdo para redes sociais."
    },
    {
      title: "Automação e Ferramentas",
      description: "Criação de Chatbot para atendimento automatizado, cadência de e-mails (inbound marketing), Lead Score, consultoria na contratação e implantação de ferramentas."
    }
  ];

  return (
    <section id="sobre" className="py-20 bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Sobre a OCA Digital
          </h2>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto">
            Nascemos para resolver uma dor que praticamente toda imobiliária e corretor vive: 
            a dificuldade de gerar leads de qualidade, organizar o funil e transformar este ativo em vendas.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          <div className="space-y-6">
            <h3 className="text-3xl font-bold text-white">Nossa História</h3>
            <p className="text-gray-300 leading-relaxed">
              A OCA Digital é uma consultoria especializada em marketing imobiliário que atua na transformação 
              digital de imobiliárias, corretores e incorporadoras. Unimos estratégia, dados, automação e 
              criatividade para gerar mais leads qualificados, organizar processos e impulsionar resultados consistentes.
            </p>
            <p className="text-gray-300 leading-relaxed">
              Trabalhamos com uma abordagem clara e focada em performance: olhamos o todo, analisamos dados 
              reais e entregamos soluções práticas que transformam o comercial em máquina de conversão.
            </p>
            <div className="bg-gray-700 p-6 rounded-lg border border-gray-600">
              <p className="text-gray-200 font-medium italic">
                "Não se trata de uma agência de marketing. Somos uma consultoria especializada em marketing 
                imobiliário. Unimos estratégia, dados e tecnologia para estruturar sua presença online, 
                aumentar a geração de leads qualificados e, principalmente, transformar seus processos 
                comerciais em uma máquina de conversão."
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-3xl font-bold text-white">Os Três Pilares OCA</h3>
            <p className="text-gray-300">
              Nosso nome vem da sigla OCA: <strong>Organização de Processos</strong>, <strong>Captação de Leads</strong> 
              e <strong>Automação</strong> – os três pilares que sustentam o crescimento sustentável no mercado imobiliário atual.
            </p>
            <div className="space-y-4">
              {pillars.map((pillar, index) => (
                <Card key={index} className="p-6 bg-gray-700 border-gray-600">
                  <h4 className="font-bold text-lg mb-2 text-blue-400">{pillar.title}</h4>
                  <p className="text-gray-300">{pillar.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-3xl font-bold text-center mb-12 text-white">Metodologia Double Diamond</h3>
          <p className="text-center text-gray-300 mb-12 max-w-4xl mx-auto">
            Utilizamos a metodologia Double Diamond, um modelo consagrado de resolução de problemas usado 
            pelas maiores consultorias e agências do mundo. Ela nos permite entender o contexto, 
            diagnosticar com profundidade e propor soluções personalizadas e orientadas a resultados.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {methodology.map((step, index) => (
              <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow bg-gray-700 border-gray-600">
                <div className="text-4xl mb-4">{step.icon}</div>
                <h4 className="text-xl font-bold mb-4 text-white">
                  Etapa {index + 1}: {step.phase}
                </h4>
                <p className="text-gray-300">{step.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
