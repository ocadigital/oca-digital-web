
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from '@/components/ui/carousel';
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
      title: "Landing Pages",
      valor: "landing-page",
      description: "Página de captação para um lançamento, um empreendimento ou uma campanha, feita para transformar o clique do anúncio em contato.",
      duration: "Até 3 semanas",
      result: "Página no ar em até 3 semanas, pronta para receber o tráfego dos anúncios e medir cada contato.",
      price: "A partir de R$ 2.000",
      priceNote: "Pagamento único.",
      ctaLabel: "Quero uma landing page",
      features: [
        "Uma página focada em um empreendimento ou numa campanha",
        "Textos e layout pensados para gerar contato",
        "Formulário e WhatsApp caindo direto no CRM",
        "Pixel da Meta, GA4 e conversões configurados",
        "Rápida e feita primeiro para o celular",
        "Versões de título e chamada para testar o que converte mais"
      ]
    },
    {
      title: "Anúncios no Google, Meta e IA",
      valor: "google-meta-gpt-ads",
      description: "Anúncios no Google, no Facebook, no Instagram e nas respostas de IA, falando com quem está procurando imóvel agora.",
      duration: "Mensal",
      result: "Primeiros leads já na primeira semana, com o custo de cada lead caindo até o 3º mês.",
      price: "A partir de R$ 1.500/mês",
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
    },
    {
      title: "Planejamento de Marketing",
      valor: "planejamento-marketing",
      description: "Plano anual de marketing da imobiliária, com metas, ações, orçamento e rotina, para o time interno executar com clareza.",
      duration: "1 mês",
      result: "Em 1 mês, um plano de 12 meses que um profissional interno, mesmo com menos experiência, consegue executar.",
      price: "R$ 3.000",
      priceNote: "Pagamento único.",
      ctaLabel: "Quero um planejamento de marketing",
      features: [
        "Diagnóstico de canais, concorrência e posicionamento",
        "Metas mensais de leads, visitas, captações e vendas",
        "Calendário de 12 meses com campanhas e ações",
        "Orçamento de mídia por canal e por trimestre",
        "Rotina semanal e mensal, com checklists e indicadores",
        "Perfil da vaga e onboarding do profissional interno"
      ]
    }
  ];

  const [servico, setServico] = useState<ServicoSelecionado | null>(null);
  const [api, setApi] = useState<CarouselApi>();
  const [atual, setAtual] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!api) return;
    const sync = () => {
      setTotal(api.scrollSnapList().length);
      setAtual(api.selectedScrollSnap());
    };
    sync();
    api.on('select', sync);
    api.on('reInit', sync);
    return () => {
      api.off('select', sync);
      api.off('reInit', sync);
    };
  }, [api]);

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
          <Carousel setApi={setApi} opts={{ align: 'start' }} className="w-full" aria-label="Serviços da OCA Digital">
            <CarouselContent className="-ml-6 py-3">
            {services.map((service, index) => (
              <CarouselItem key={index} className="pl-6 basis-full md:basis-1/2 lg:basis-1/3">
              <Card className="h-full p-8 card-elevated hover:border-primary/40 flex flex-col">
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
              </CarouselItem>
            ))}
            </CarouselContent>
            <div className="mt-8 flex items-center justify-center gap-4">
              <CarouselPrevious className="static translate-y-0 h-10 w-10" aria-label="Serviço anterior" />
              <div className="flex gap-2">
                {Array.from({ length: total }).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    aria-label={`Ir para o grupo ${i + 1} de serviços`}
                    aria-current={i === atual}
                    onClick={() => api?.scrollTo(i)}
                    className={`h-2.5 rounded-full transition-all ${i === atual ? 'w-8 bg-primary' : 'w-2.5 bg-muted-foreground/30 hover:bg-muted-foreground/50'}`}
                  />
                ))}
              </div>
              <CarouselNext className="static translate-y-0 h-10 w-10" aria-label="Próximo serviço" />
            </div>
          </Carousel>
        </div>

        <Card className="p-8 md:p-10 card-elevated border-primary/30 text-center max-w-4xl mx-auto">
          <h3 className="text-3xl font-bold mb-4 text-foreground">Também fazemos sob medida</h3>
          <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
            Cada imobiliária está num momento diferente, então além desses serviços montamos propostas sob medida,
            com vídeos, SEO, conteúdo e acompanhamento mensal depois da entrega.
          </p>
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {['Vídeos e Reels', 'SEO e blog', 'Conteúdo para redes', 'Acompanhamento mensal'].map((item) => (
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
