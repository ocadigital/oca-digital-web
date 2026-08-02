const clients = [
  'Aldo Imóveis',
  'Vokkan',
  'Yes Empreendimentos',
  'Buzz',
  'Brognoli',
  'Santa Ilha',
  'RE/MAX',
  'Captei',
  'Unik',
  'ImobCampeche',
  'Açoriana Imóveis',
  'Jéssica Mendonça',
  'Hot Imóveis',
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
        <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused]">
          {loop.map((name, i) => (
            <span
              key={`${name}-${i}`}
              className="mx-8 whitespace-nowrap text-lg md:text-xl font-semibold uppercase tracking-widest text-foreground/70 hover:text-foreground transition-colors"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Clients;
