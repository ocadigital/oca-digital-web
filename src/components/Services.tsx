
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const Services = () => {
  const services = [
    {
      title: "Web Sites",
      description: "Site para imobiliária, incorporadora ou empreendimento, feito para ser encontrado no Google e transformar visita em contato.",
      duration: "1 mês",
      ctaLabel: "Quero um site que traz contatos",
      features: [
        "Site institucional, portfólio de imóveis ou página de empreendimento",
        "Rápido e pensado primeiro para o celular",
        "Estrutura feita para aparecer no Google",
        "Formulários e WhatsApp caindo direto no CRM",
        "Você sabe de onde veio cada contato",
        "Blog para atrair visitas do Google sem pagar anúncio"
      ]
    },
    {
      title: "Google Ads, Meta Ads e GPT Ads",
      description: "Anúncios no Google, no Facebook, no Instagram e nas respostas de IA, falando com quem está procurando imóvel agora.",
      duration: "Mensal",
      ctaLabel: "Quero anúncios no Google, Meta e GPT Ads",
      features: [
        "Anúncios no Google para quem já está buscando imóvel",
        "Anúncios que voltam a aparecer para quem visitou o seu site",
        "Campanhas no Facebook e no Instagram",
        "GPT Ads, anúncios que aparecem dentro das respostas de IA",
        "Testes com públicos e criativos diferentes até achar o que funciona",
        "Acompanhamento do custo de cada contato e de cada venda"
      ]
    },
    {
      title: "CRM, Processos e Automação",
      description: "A gente organiza o seu processo comercial e a tecnologia por trás dele, do primeiro contato do lead até a visita agendada, com tudo registrado e medido.",
      duration: "3 meses + acompanhamento mensal",
      ctaLabel: "Quero organizar meu CRM e processos",
      features: [
        "Um jeito só de atender, combinado com o seu time",
        "CRM novo ou integração com o que você já usa",
        "Etapas do funil e origem de cada contato configuradas",
        "Resposta automática, sequência de e-mails e distribuição dos leads entre os corretores",
        "Roteiro de perguntas e nota automática para saber quem está mais perto de comprar",
        "Painel com os números do comercial em tempo real"
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
            O site traz o contato, o anúncio traz gente nova e o CRM garante que ninguém fique sem resposta
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
          <h3 className="text-3xl font-bold mb-4 text-foreground">Também fazemos sob medida</h3>
          <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
            Cada imobiliária está num momento diferente, então além desses três serviços a gente monta propostas sob medida,
            com vídeos, planejamento de marketing, SEO, conteúdo e acompanhamento mensal depois da entrega.
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
