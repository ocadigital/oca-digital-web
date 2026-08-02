const clients = [
  { name: 'Brognoli', src: '/clients/brognoli.png' },
  { name: 'Buzz', src: '/clients/buzz.png' },
  { name: 'Captei', src: '/clients/captei.png' },
  { name: 'Crédito Real', src: '/clients/credito-real.svg' },
  { name: 'Jéssica Mendonça', src: '/clients/jessica-mendonca.png' },
  { name: 'Santa Ilha', src: '/clients/santa-ilha.svg' },
  { name: 'Vokkan', src: '/clients/vokkan.png' },
  { name: 'Yes Empreendimentos', src: '/clients/yes-empreendimentos.png' },
];

const Clients = () => {
  const loop = [...clients, ...clients];

  return (
    <section aria-label="Clientes que confiam na OCA Digital" className="py-10 bg-secondary/60 border-y border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm font-light tracking-wide text-muted-foreground mb-6">
          <span className="text-foreground font-semibold">+40 projetos bem-sucedidos</span> · <span className="text-foreground font-semibold">+20 clientes</span> confiam na OCA Digital
        </p>
      </div>

      <div className="relative overflow-hidden group [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        <div className="flex w-max items-center animate-marquee group-hover:[animation-play-state:paused]">
          {loop.map((client, i) => (
            <img
              key={`${client.name}-${i}`}
              src={client.src}
              alt={`Logo ${client.name}`}
              loading="lazy"
              className="mx-10 h-8 md:h-10 w-auto object-contain opacity-60 hover:opacity-100 transition-opacity"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Clients;
