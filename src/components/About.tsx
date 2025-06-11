
import { Users, Target, Zap, BarChart3 } from 'lucide-react';
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
      phase: "Execução",
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
    <section id="sobre" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-4">
            <img 
              src="/lovable-uploads/2bc2982a-cd57-40a2-900d-a5859cf5face.png" 
              alt="Equipe OCA Digital" 
              className="w-16 h-16 object-cover rounded-lg"
            />
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Quem Somos
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Especialistas em marketing imobiliário com foco em resultados mensuráveis e crescimento sustentável.
          </p>
        </div>

        <div className="text-center mb-16">
          <h3 className="text-3xl font-bold text-gray-900 mb-6">Nossa História</h3>
          <div className="max-w-4xl mx-auto space-y-4">
            <p className="text-gray-600">
              Fundada por especialistas em marketing digital e mercado imobiliário, a OCA Digital nasceu da necessidade 
              de profissionalizar e escalar as operações de marketing das imobiliárias brasileiras.
            </p>
            <p className="text-gray-600">
              Nosso nome vem da sigla OCA: Organização de Processos, Captação de Leads e Automação de Marketing. 
              Esses são os três pilares que sustentam nossa metodologia única.
            </p>
            <p className="text-gray-600">
              Com mais de 50 clientes ativos e resultados comprovados, ajudamos imobiliárias de todos os tamanhos 
              a transformarem seus processos e alcançarem resultados excepcionais.
            </p>
          </div>
        </div>

        {/* Metodologia Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Nossa Metodologia</h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Desenvolvemos uma abordagem estruturada que combina análise de dados, estratégia e execução para gerar resultados consistentes.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {methodology.map((phase, index) => (
              <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">{phase.icon}</div>
                <h4 className="font-bold text-xl mb-3 text-gray-900">{phase.phase}</h4>
                <p className="text-gray-600 text-sm leading-relaxed">{phase.description}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Pilares OCA */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Os 3 Pilares da OCA</h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Organização, Captação e Automação - os fundamentos que transformam operações imobiliárias.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {pillars.map((pillar, index) => (
              <Card key={index} className="p-8 hover:shadow-lg transition-shadow">
                <h4 className="font-bold text-xl mb-4 text-gray-900">{pillar.title}</h4>
                <p className="text-gray-600 leading-relaxed">{pillar.description}</p>
              </Card>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Users className="text-blue-600" size={32} />
            </div>
            <h4 className="font-bold text-xl mb-2 text-gray-900">Time Especializado</h4>
            <p className="text-gray-600">
              Profissionais com experiência comprovada em marketing imobiliário e digital.
            </p>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Target className="text-green-600" size={32} />
            </div>
            <h4 className="font-bold text-xl mb-2 text-gray-900">Foco em Resultados</h4>
            <p className="text-gray-600">
              Estratégias direcionadas para gerar leads qualificados e aumentar vendas.
            </p>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Zap className="text-purple-600" size={32} />
            </div>
            <h4 className="font-bold text-xl mb-2 text-gray-900">Tecnologia Avançada</h4>
            <p className="text-gray-600">
              Automação e ferramentas de ponta para otimizar seus processos.
            </p>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="text-orange-600" size={32} />
            </div>
            <h4 className="font-bold text-xl mb-2 text-gray-900">Dados & Analytics</h4>
            <p className="text-gray-600">
              Decisões baseadas em dados para maximizar o retorno sobre investimento.
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default About;
