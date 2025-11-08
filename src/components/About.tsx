
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
    <section id="sobre" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-4">
            <img 
              src="/lovable-uploads/2bc2982a-cd57-40a2-900d-a5859cf5face.png" 
              alt="Equipe OCA Digital" 
              className="w-16 h-16 object-cover rounded-lg"
            />
          </div>
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Quem Somos
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Especialistas em marketing imobiliário com foco em resultados mensuráveis e crescimento sustentável.
          </p>
        </div>

        {/* Nossa História e Pilares lado a lado */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Nossa História */}
          <div>
            <h3 className="text-3xl font-bold text-foreground mb-6">Nossa História</h3>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Fundada por especialistas em marketing digital e mercado imobiliário, a OCA Digital nasceu da necessidade 
                de profissionalizar e escalar as operações de marketing das imobiliárias brasileiras.
              </p>
              <p className="text-muted-foreground">
                Nosso nome vem da sigla OCA: Organização de Processos, Captação de Leads e Automação de Marketing. 
                Esses são os três pilares que sustentam nossa metodologia única.
              </p>
              <p className="text-muted-foreground">
                Com mais de 50 clientes ativos e resultados comprovados, ajudamos imobiliárias de todos os tamanhos 
                a transformarem seus processos e alcançarem resultados excepcionais.
              </p>
            </div>
          </div>

          {/* Os 3 Pilares da OCA */}
          <div>
            <h3 className="text-3xl font-bold text-foreground mb-6">Os 3 Pilares da OCA</h3>
            <div className="space-y-6">
              {pillars.map((pillar, index) => (
                <div key={index} className="border-l-4 border-primary pl-4">
                  <h4 className="font-bold text-lg mb-2 text-foreground">{pillar.title}</h4>
                  <p className="text-muted-foreground text-sm leading-relaxed">{pillar.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Metodologia Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-foreground mb-4">Nossa Metodologia</h3>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Desenvolvemos uma abordagem estruturada que combina análise de dados, estratégia e execução para gerar resultados consistentes.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {methodology.map((phase, index) => (
              <Card key={index} className="p-6 text-center hover:shadow-xl transition-all hover:-translate-y-1 bg-card border-border/50">
                <div className="text-4xl mb-4">{phase.icon}</div>
                <h4 className="font-bold text-xl mb-3 text-foreground">{phase.phase}</h4>
                <p className="text-muted-foreground text-sm leading-relaxed">{phase.description}</p>
              </Card>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Card className="p-6 text-center hover:shadow-xl transition-all hover:-translate-y-1 bg-card border-border/50">
            <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Users className="text-primary" size={32} />
            </div>
            <h4 className="font-bold text-xl mb-2 text-foreground">Time Especializado</h4>
            <p className="text-muted-foreground">
              Profissionais com experiência comprovada em marketing imobiliário e digital.
            </p>
          </Card>

          <Card className="p-6 text-center hover:shadow-xl transition-all hover:-translate-y-1 bg-card border-border/50">
            <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Target className="text-primary" size={32} />
            </div>
            <h4 className="font-bold text-xl mb-2 text-foreground">Foco em Resultados</h4>
            <p className="text-muted-foreground">
              Estratégias direcionadas para gerar leads qualificados e aumentar vendas.
            </p>
          </Card>

          <Card className="p-6 text-center hover:shadow-xl transition-all hover:-translate-y-1 bg-card border-border/50">
            <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Zap className="text-primary" size={32} />
            </div>
            <h4 className="font-bold text-xl mb-2 text-foreground">Tecnologia Avançada</h4>
            <p className="text-muted-foreground">
              Automação e ferramentas de ponta para otimizar seus processos.
            </p>
          </Card>

          <Card className="p-6 text-center hover:shadow-xl transition-all hover:-translate-y-1 bg-card border-border/50">
            <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="text-primary" size={32} />
            </div>
            <h4 className="font-bold text-xl mb-2 text-foreground">Dados & Analytics</h4>
            <p className="text-muted-foreground">
              Decisões baseadas em dados para maximizar o retorno sobre investimento.
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default About;
