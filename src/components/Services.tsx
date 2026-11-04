
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useEffect, useRef, useState } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
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
    },
    {
      title: "Consultoria em Processos e Automação",
      valor: "processos-automacao",
      description: "Organizamos com o seu time o processo comercial, do primeiro contato do lead até a visita agendada, e automatizamos o que hoje depende de alguém lembrar.",
      duration: "1 mês de implantação + acompanhamento mensal",
      result: "No primeiro mês, nenhum lead sem resposta e o atendimento mais rápido. A conversão sobe a partir daí.",
      price: "Sob medida",
      priceNote: "O investimento depende do tamanho do time e da operação. Montamos a proposta depois de conhecer o seu processo.",
      ctaLabel: "Quero organizar meus processos",
      features: [
        "Mapeamento de como o seu time atende hoje e onde o lead se perde",
        "Um jeito só de atender, combinado com o seu time",
        "Resposta automática e sequência de e-mails para cada lead",
        "Roteiro de perguntas e nota automática para saber quem está mais perto de comprar",
        "Indicadores de atendimento acompanhados todo mês"
      ]
    },
    {
      title: "CRM",
      valor: "crm",
      description: "CRM configurado para o funil da sua imobiliária, com cada contato registrado, a origem de cada lead e o painel do comercial em tempo real.",
      duration: "Implantação em até 1 mês",
      result: "Do primeiro mês em diante, todo lead registrado, distribuído e com o próximo passo à vista.",
      price: "A partir de R$ 150/mês",
      priceNote: "Licença do CRM para até 3 usuários. Implantação e planos com mais usuários conforme a operação.",
      ctaLabel: "Quero um CRM para a minha imobiliária",
      features: [
        "CRM novo ou integração com o que você já usa",
        "Etapas do funil e origem de cada contato configuradas",
        "Site, formulários e WhatsApp caindo direto no CRM",
        "Distribuição dos leads entre os corretores",
        "Painel com os números do comercial em tempo real"
      ]
    }
  ];

  const [servico, setServico] = useState<ServicoSelecionado | null>(null);
  const [api, setApi] = useState<CarouselApi>();
  const [atual, setAtual] = useState(0);
  const [visiveis, setVisiveis] = useState<number[]>([0]);
  const [precosAbertos, setPrecosAbertos] = useState<Record<string, boolean>>({});
  // rotação automática: o visitante pode pausar; para sozinha enquanto o mouse, o foco ou o toque estão no carrossel
  const [autoplay, setAutoplay] = useState(true);
  const [segurando, setSegurando] = useState(false);
  const retomarRef = useRef<number>();
  const reduzMovimento = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  const alternarPreco = (valor: string) => {
    setPrecosAbertos((atual) => {
      const abrir = !atual[valor];
      if (abrir) {
        const w = window as unknown as { dataLayer?: Record<string, unknown>[] };
        w.dataLayer = w.dataLayer || [];
        w.dataLayer.push({ event: 'service_price_open', servico: valor });
      }
      return { ...atual, [valor]: abrir };
    });
  };

  useEffect(() => {
    if (!api) return;
    const sync = () => {
      setAtual(api.selectedScrollSnap());
      const emVista = api.slidesInView();
      if (emVista.length) setVisiveis(emVista);
    };
    sync();
    api.on('select', sync);
    api.on('reInit', sync);
    api.on('slidesInView', sync);
    return () => {
      api.off('select', sync);
      api.off('reInit', sync);
      api.off('slidesInView', sync);
    };
  }, [api]);

  // mantém o serviço ativo visível na lista de nomes (no celular ela rola na horizontal)
  const listaRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const lista = listaRef.current;
    const chip = lista?.children[atual] as HTMLElement | undefined;
    if (!lista || !chip || lista.scrollWidth <= lista.clientWidth) return;
    lista.scrollTo({ left: chip.offsetLeft - (lista.clientWidth - chip.offsetWidth) / 2, behavior: reduzMovimento ? 'auto' : 'smooth' });
  }, [atual, reduzMovimento]);

  useEffect(() => {
    if (!api || !autoplay || segurando || reduzMovimento) return;
    const id = window.setInterval(() => {
      if (document.visibilityState === 'visible') api.scrollNext();
    }, 6000);
    return () => window.clearInterval(id);
  }, [api, autoplay, segurando, reduzMovimento]);

  // depois de um toque ou clique, espera um pouco antes de voltar a girar
  const segurarPorUmTempo = () => {
    setSegurando(true);
    window.clearTimeout(retomarRef.current);
    retomarRef.current = window.setTimeout(() => setSegurando(false), 12000);
  };
  useEffect(() => () => window.clearTimeout(retomarRef.current), []);

  const irPara = (i: number) => {
    segurarPorUmTempo();
    api?.scrollTo(i);
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
          <div className="mb-6 flex items-center gap-3">
            <div
              ref={listaRef}
              className="relative flex flex-1 gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:flex-wrap md:justify-center"
              role="tablist"
              aria-label="Escolha um serviço"
            >
              {services.map((service, i) => {
                const emVista = visiveis.includes(i);
                return (
                  <button
                    key={service.valor}
                    type="button"
                    role="tab"
                    aria-selected={i === atual}
                    aria-controls={`servico-${service.valor}`}
                    onClick={() => irPara(i)}
                    className={`shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                      i === atual
                        ? 'border-primary bg-primary text-primary-foreground'
                        : emVista
                          ? 'border-primary/50 bg-primary/10 text-foreground'
                          : 'border-border text-muted-foreground hover:border-primary/40 hover:text-foreground'
                    }`}
                  >
                    {service.title}
                  </button>
                );
              })}
            </div>
            {!reduzMovimento && (
              <button
                type="button"
                onClick={() => setAutoplay((a) => !a)}
                aria-label={autoplay ? 'Pausar a rotação dos serviços' : 'Retomar a rotação dos serviços'}
                className="hidden shrink-0 items-center justify-center rounded-full border border-border h-9 w-9 text-muted-foreground hover:text-foreground hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:flex"
              >
                {autoplay ? <Pause className="h-4 w-4" aria-hidden="true" /> : <Play className="h-4 w-4" aria-hidden="true" />}
              </button>
            )}
          </div>
          <Carousel
            setApi={setApi}
            opts={{ align: 'start', loop: true }}
            className="w-full"
            aria-label="Serviços da OCA Digital"
            onMouseEnter={() => setSegurando(true)}
            onMouseLeave={() => setSegurando(false)}
            onFocusCapture={() => setSegurando(true)}
            onBlurCapture={() => setSegurando(false)}
            onPointerDown={segurarPorUmTempo}
          >
            <CarouselContent className="-ml-6 py-3">
            {services.map((service, index) => (
              <CarouselItem key={index} id={`servico-${service.valor}`} className="pl-6 basis-[86%] sm:basis-[70%] md:basis-1/2 lg:basis-1/3">
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
                <div className="mt-auto mb-5 border-t border-border pt-4">
                  <button
                    type="button"
                    onClick={() => alternarPreco(service.valor)}
                    aria-expanded={!!precosAbertos[service.valor]}
                    aria-controls={`preco-${service.valor}`}
                    className="flex w-full items-center justify-between rounded-md py-1 text-left font-semibold text-primary hover:text-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    Ver investimento
                    <ChevronDown
                      className={`h-5 w-5 transition-transform duration-200 ${precosAbertos[service.valor] ? 'rotate-180' : ''}`}
                      aria-hidden="true"
                    />
                  </button>
                  <div id={`preco-${service.valor}`} hidden={!precosAbertos[service.valor]} className="pt-3">
                    <p className="text-2xl font-bold text-foreground">{service.price}</p>
                    <p className="text-sm text-muted-foreground mt-1">{service.priceNote}</p>
                  </div>
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
            <CarouselPrevious
              onClick={() => { segurarPorUmTempo(); api?.scrollPrev(); }}
              className="hidden md:inline-flex md:-left-5 top-28 translate-y-0 h-11 w-11 bg-background/95 shadow-lg border-primary/30 hover:bg-primary hover:text-primary-foreground disabled:opacity-0"
              aria-label="Serviço anterior"
            />
            <CarouselNext
              onClick={() => { segurarPorUmTempo(); api?.scrollNext(); }}
              className="hidden md:inline-flex md:-right-5 top-28 translate-y-0 h-11 w-11 bg-background/95 shadow-lg border-primary/30 hover:bg-primary hover:text-primary-foreground disabled:opacity-0"
              aria-label="Próximo serviço"
            />
          </Carousel>
          <div className="mt-4 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => { segurarPorUmTempo(); api?.scrollPrev(); }}
              aria-label="Serviço anterior"
              className="md:hidden flex h-10 w-10 items-center justify-center rounded-full border border-primary/30 bg-background shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            <p className="text-center text-sm text-muted-foreground" aria-live="polite">
              {atual + 1} de {services.length} · {services[atual]?.title}
            </p>
            <button
              type="button"
              onClick={() => { segurarPorUmTempo(); api?.scrollNext(); }}
              aria-label="Próximo serviço"
              className="md:hidden flex h-10 w-10 items-center justify-center rounded-full border border-primary/30 bg-background shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
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
