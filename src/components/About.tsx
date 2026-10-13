
import { Link } from 'react-router-dom';
import { Users, Target, Zap, BarChart3 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface AboutProps {
  /** Use when About is rendered as its own page (not a homepage section) so it gets a real h1. */
  asPage?: boolean;
  /** Use for the condensed homepage version, linking out to the full /sobre page. */
  summary?: boolean;
}

const About = ({ asPage = false, summary = false }: AboutProps) => {
  const HeadingTag = asPage ? 'h1' : 'h2';

  if (summary) {
    return (
      <section id="sobre" className="py-20 bg-background section-separator">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-4">
            <img
              src="/lovable-uploads/equipe-oca-digital.webp"
              width={192}
              height={192}
              alt="Equipe OCA Digital"
              className="w-16 h-16 object-cover rounded-lg"
            />
          </div>
          <HeadingTag className="text-4xl font-bold text-foreground mb-6">
            Quem Somos
          </HeadingTag>
          <p className="text-xl text-muted-foreground mb-8">
            Somos especialistas em marketing imobiliário, unindo estratégia, tecnologia e automação para
            transformar a operação de imobiliárias e construtoras. Com mais de 20 clientes ativos, ajudamos
            empresas de todos os tamanhos a captar e qualificar leads de forma mais eficiente.
          </p>
          <Link to="/sobre">
            <Button size="lg" className="font-semibold">
              Conheça nossa história completa
            </Button>
          </Link>
        </div>
      </section>
    );
  }

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
      description: "Criamos e implementamos soluções práticas, desde ajustes técnicos no site e automações de marketing até campanhas de mídia paga e novos processos comerciais."
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
      description: "Implantação de CRM, pesquisa de satisfação com os clientes, todos os leads num lugar só e um time de pré-atendimento para responder rápido e separar quem está pronto para visitar."
    },
    {
      title: "Captação de Clientes",
      description: "Geração de leads com campanhas sob medida, criação de marca, lançamentos imobiliários e conteúdo para redes sociais."
    },
    {
      title: "Automação e Ferramentas",
      description: "Atendimento automático no WhatsApp, sequência de e-mails para quem ainda não está pronto, nota automática para saber quem está mais perto de comprar e ajuda para escolher e implantar as ferramentas."
    }
  ];

  return (
    <section id="sobre" className="py-20 bg-background section-separator">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-4">
            <img 
              src="/lovable-uploads/equipe-oca-digital.webp"
              width={192}
              height={192} 
              alt="Equipe OCA Digital" 
              className="w-16 h-16 object-cover rounded-lg"
            />
          </div>
          <HeadingTag className="text-4xl font-bold text-foreground mb-4">
            Quem Somos
          </HeadingTag>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Marketing imobiliário com número na mesa: de onde vem cada lead, quanto custa e quanto dele vira venda.
          </p>
        </div>

        {/* Nossa História e Pilares lado a lado */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Nossa História */}
          <div>
            <h3 className="text-3xl font-bold text-foreground mb-6">Nossa História</h3>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                A OCA Digital nasceu para profissionalizar o marketing e o comercial das imobiliárias, que muitas vezes ainda
                dependem de planilha, de WhatsApp e da memória dos corretores.
              </p>
              <p className="text-muted-foreground">
                O nome vem da sigla OCA: Organização de Processos, Captação de Leads e Automação de Marketing, as três frentes
                do nosso trabalho.
              </p>
              <p className="text-muted-foreground">
                Hoje são mais de 20 clientes, entre imobiliárias de todos os tamanhos e incorporadoras.
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
