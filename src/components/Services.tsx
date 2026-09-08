
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const Services = () => {
  const services = [
    {
      title: "Google Ads, Meta Ads e GPT Ads",
      description: "Campanhas de busca, performance, remarketing e captação qualificada no Facebook, Instagram e GPT Ads.",
      duration: "Mensal",
      ctaLabel: "Quero Campanhas de Google, Meta e GPT Ads",
      features: [
        "Campanhas de busca (Search) para alta intenção",
        "Performance Max, Display e remarketing",
        "Campanhas no Facebook e Instagram",
        "Anúncios em GPT Ads, o novo canal de tráfego em IA",
        "Públicos personalizados, lookalike e testes A/B",
        "Otimização contínua de CPL, conversões e ROI"
      ]
    },
    {
      title: "Sistema de Captação e Qualificação de Leads",
      description: "Descubra a origem real de cada lead e nunca mais perca uma oportunidade. Centralização, pontuação e priorização automática, do primeiro clique até a visita agendada.",
      duration: "3 meses + acompanhamento mensal",
      ctaLabel: "Quero meu Sistema de Captação e Qualificação",
      features: [
        "Centralização de leads em CRM único com rastreamento de origem real",
        "Scripts BANT + Lead Score automático",
        "Cadência de e-mails e priorização automática de filas",
        "Dashboard de acompanhamento em tempo real",
        "Clusterização por personas e segmentação avançada",
        "Limpeza automática de base"
      ]
    },
    {
      title: "Lançamento Imobiliário",
      description: "Campanha completa para lançamentos com mídia paga, landing page e materiais gráficos.",
      duration: "1 mês",
      ctaLabel: "Quero Lançar meu Empreendimento",
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
      description: "Manutenção do seu sistema de captação, sempre funcionando.",
      features: [
        "Acompanhamento e ajuste contínuo do CRM e do rastreamento de leads",
        "Monitoramento do Lead Score e das filas de qualificação",
        "Gestão do Google My Business",
        "Relatório mensal de performance"
      ]
    },
    {
      name: "Plano Avançado",
      description: "Essencial mais tráfego pago rodando em cima do seu sistema já implantado.",
      features: [
        "Tudo do Essencial",
        "Google Ads, Meta Ads e GPT Ads",
        "Otimização contínua de CPL e conversões",
        "Planejamento estratégico mensal"
      ]
    },
    {
      name: "Plano Full",
      description: "Avançado mais conteúdo e consultoria dedicada.",
      features: [
        "Tudo do Avançado",
        "1 blog post mensal",
        "1 e-mail marketing mensal",
        "Consultoria mensal com suporte prioritário"
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
    <section id="servicos" className="py-20 bg-secondary section-separator">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Nossos Serviços
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Soluções completas para transformar sua operação imobiliária em uma máquina de conversão
          </p>
        </div>

        <div className="mb-20">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="p-8 card-elevated hover:-translate-y-2 hover:border-primary/40">
                <div className="mb-6">
                  <h4 className="text-2xl font-bold mb-2 text-foreground">{service.title}</h4>
                  <p className="text-foreground mb-4">{service.description}</p>
                  <span className="text-muted-foreground">Duração: {service.duration}</span>
                </div>
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-primary mr-2">✓</span>
                      <span className="text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full font-semibold"
                  onClick={handleInteresseClick}
                >
                  {service.ctaLabel}
                </Button>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-3xl font-bold text-center mb-4 text-foreground">Pacotes Mensais</h3>
          <p className="text-xl text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Serviços mensais contínuos para impulsionar o desempenho da sua imobiliária com estratégias comprovadas
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {packages.map((pkg, index) => (
              <Card key={index} className={`p-8 card-elevated hover:-translate-y-2 hover:border-primary/40 ${index === 1 ? 'border-primary border-2 shadow-2xl' : ''}`}>
                {index === 1 && (
                  <div className="bg-primary text-primary-foreground text-center py-2 px-4 rounded-t-lg -mt-8 -mx-8 mb-6 font-semibold shadow-md">
                    Mais Popular
                  </div>
                )}
                <div className="text-center mb-6">
                  <h4 className="text-2xl font-bold mb-2 text-foreground">{pkg.name}</h4>
                  <p className="text-muted-foreground">{pkg.description}</p>
                </div>
                <ul className="space-y-2 mb-6">
                  {pkg.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-primary mr-2">✓</span>
                      <span className="text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className={`w-full font-semibold ${index === 1 ? '' : 'text-white'}`}
                  variant={index === 1 ? 'default' : 'default'}
                  onClick={handleContratarClick}
                >
                  Contratar {pkg.name}
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
