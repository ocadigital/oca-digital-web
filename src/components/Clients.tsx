import brognoli from '@/assets/clients/brognoli.png.asset.json';
import buzz from '@/assets/clients/buzz.png.asset.json';
import captei from '@/assets/clients/captei.png.asset.json';
import creditoReal from '@/assets/clients/credito-real.svg.asset.json';
import jessica from '@/assets/clients/jessica-mendonca.png.asset.json';
import santaIlha from '@/assets/clients/santa-ilha.svg.asset.json';
import vokkan from '@/assets/clients/vokkan.png.asset.json';
import yes from '@/assets/clients/yes-empreendimentos.png.asset.json';

const clients = [
  { name: 'Brognoli', src: brognoli.url },
  { name: 'Buzz', src: buzz.url },
  { name: 'Captei', src: captei.url },
  { name: 'Crédito Real', src: creditoReal.url },
  { name: 'Jéssica Mendonça', src: jessica.url },
  { name: 'Santa Ilha', src: santaIlha.url },
  { name: 'Vokkan', src: vokkan.url },
  { name: 'Yes Empreendimentos', src: yes.url },
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
