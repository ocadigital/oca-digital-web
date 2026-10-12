
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const Services = () => {
  const services = [
    {
      title: "Web Sites",
      description: "Site para imobiliária, incorporadora ou empreendimento, feito para ser encontrado no Google e transformar visita em contato.",
      duration: "1 mês",
      ctaLabel: "Quero um Site que Gera Leads",
      features: [
        "Site institucional, portfólio de imóveis ou página de empreendimento",
        "Otimizado para celular e carregamento rápido",
        "SEO técnico para aparecer no Google",
        "Formulários e WhatsApp integrados ao CRM",
        "Rastreamento de origem dos leads (Analytics e pixels)",
        "Blog para gerar tráfego orgânico"
      ]
    },
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
      title: "CRM, Processos e Automação",
      description: "Organizamos o processo comercial e a tecnologia por trás dele: do primeiro contato do lead até a visita agendada, tudo registrado, priorizado e medido.",
      duration: "3 meses + acompanhamento mensal",
      ctaLabel: "Quero organizar meu CRM e processos",
      features: [
        "Mapeamento e padronização do processo comercial",
        "Implantação de CRM próprio ou integração com o CRM que você já usa",
        "Configuração de tags, etapas do funil e rastreamento da origem de cada lead",
        "Automações de atendimento, cadência de e-mails e filas",
        "Scripts BANT e Lead Score automático",
        "Dashboard de acompanhamento em tempo real"
      ]
    }
  ];

  const handleInteresseClick = () => {
    const contactSection = document.getElementById('contato');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="servicos" className="py-20 bg-secondary section-separator">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Serviços de Marketing Imobiliário
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
                  <h3 className="text-2xl font-bold mb-2 text-foreground">{service.title}</h3>
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

        <Card className="p-8 md:p-10 card-elevated border-primary/30 text-center max-w-4xl mx-auto">
          <h3 className="text-3xl font-bold mb-4 text-foreground">E muito mais, sob medida</h3>
          <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
            Cada imobiliária está num momento diferente. Além desses serviços, montamos propostas sob medida para a sua
            necessidade real, com vídeos, planejamento de marketing, SEO, conteúdo e acompanhamento mensal depois da entrega.
          </p>
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {['Vídeos e Reels', 'Planejamento de marketing', 'SEO e blog', 'Conteúdo para redes', 'Acompanhamento mensal'].map((item) => (
              <span key={item} className="px-4 py-1.5 rounded-full border border-border text-sm text-foreground">{item}</span>
            ))}
          </div>
          <Button size="lg" className="font-semibold" onClick={handleInteresseClick}>
            Quero uma proposta sob medida
          </Button>
        </Card>
      </div>
    </section>
  );
};

export default Services;
