
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import ServiceLeadModal, { type ServicoSelecionado } from '@/components/ServiceLeadModal';

const Services = () => {
  const services = [
    {
      title: "Web Sites",
      valor: "web-sites",
      description: "Site para imobiliária, incorporadora ou empreendimento, feito para ser encontrado no Google e transformar visita em contato.",
      duration: "2 meses",
      result: "Site no ar em 2 meses, com a busca orgânica crescendo a partir do 3º mês.",
      price: "A partir de R$ 7.000",
      priceNote: "Pagamento único.",
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
      title: "Anúncios no Google, Meta e IA",
      valor: "google-meta-gpt-ads",
      description: "Anúncios no Google, no Facebook, no Instagram e nas respostas de IA, falando com quem está procurando imóvel agora.",
      duration: "Mensal",
      result: "Primeiros leads já na primeira semana, com o custo de cada lead caindo até o 3º mês.",
      price: "A partir de R$ 1.200/mês",
      priceNote: "+ R$ 1.000 de setup. A verba dos anúncios é paga direto ao Google e à Meta, à parte.",
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
      valor: "crm-processos-automacao",
      description: "Organizamos o seu processo comercial e a tecnologia por trás dele, do primeiro contato do lead até a visita agendada, com tudo registrado e medido.",
      duration: "1 mês de implantação + acompanhamento mensal",
      result: "No primeiro mês, nenhum lead sem resposta e o atendimento mais rápido. A conversão sobe a partir daí.",
      price: "R$ 800/mês",
      priceNote: "+ R$ 1.500 de setup. Licença do CRM incluída para até 10 usuários.",
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

  const [servico, setServico] = useState<ServicoSelecionado | null>(null);

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
              <Card key={index} className="p-8 card-elevated hover:-translate-y-2 hover:border-primary/40 flex flex-col">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold mb-2 text-foreground">{service.title}</h3>
                  <p className="text-foreground mb-4">{service.description}</p>
                  <span className="text-muted-foreground">Prazo: {service.duration}</span>
                  <div className="mt-4 rounded-lg border border-primary/30 bg-primary/5 p-3">
                    <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-1">Resultado esperado</p>
                    <p className="text-sm text-foreground">{service.result}</p>
                  </div>
                </div>
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-primary mr-2">✓</span>
                      <span className="text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-auto mb-5 border-t border-border pt-5">
                  <p className="text-2xl font-bold text-foreground">{service.price}</p>
                  <p className="text-sm text-muted-foreground mt-1">{service.priceNote}</p>
                </div>
                <Button
                  className="w-full font-semibold"
                  onClick={() => setServico({ valor: service.valor, titulo: service.title })}
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
            Cada imobiliária está num momento diferente, então além desses três serviços montamos propostas sob medida,
            com vídeos, planejamento de marketing, SEO, conteúdo e acompanhamento mensal depois da entrega.
          </p>
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {['Vídeos e Reels', 'Planejamento de marketing', 'SEO e blog', 'Conteúdo para redes', 'Acompanhamento mensal'].map((item) => (
              <span key={item} className="px-4 py-1.5 rounded-full border border-border text-sm text-foreground">{item}</span>
            ))}
          </div>
          <Button size="lg" className="font-semibold" onClick={() => setServico({ valor: 'outros', titulo: 'Projeto sob medida' })}>
            Quero uma proposta sob medida
          </Button>
        </Card>
      </div>
      <ServiceLeadModal servico={servico} onClose={() => setServico(null)} />
    </section>
  );
};

export default Services;
