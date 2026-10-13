import { Link } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useParallax } from '@/hooks/use-parallax';

const WHATSAPP =
  'https://wa.me/5548996790700?text=' +
  encodeURIComponent('Oi Anderson, vi o site da OCA Digital e quero conversar sobre a minha imobiliária.');

const provas = [
  { valor: '2019', texto: 'Head de Marketing da Brognoli' },
  { valor: '+1,1 mi', texto: 'visualizações num vídeo da websérie Vida Independente, sem mídia paga' },
  { valor: 'Blindagem', texto: 'de Processos, método que levo em palestras e mentorias para agências' },
];

/** Seção da home sobre o fundador, com foto e trajetória. */
const Founder = ({ id = 'sobre', mostrarHistoria = true }: { id?: string; mostrarHistoria?: boolean }) => {
  const fotoRef = useParallax<HTMLImageElement>(0.06);
  return (
  <section id={id} className="py-20 bg-background section-separator">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-10 lg:gap-16 items-center">
      <div className="relative mx-auto w-full max-w-sm md:max-w-none">
        <img
          ref={fotoRef}
          src="/images/anderson-goncalves-960.webp"
          srcSet="/images/anderson-goncalves-600.webp 600w, /images/anderson-goncalves-960.webp 960w"
          sizes="(min-width: 768px) 40vw, 90vw"
          width={960}
          height={1200}
          loading="lazy"
          alt="Anderson Gonçalves, fundador da OCA Digital, durante uma palestra"
          className="w-full h-auto rounded-2xl border border-border object-cover"
          style={{ boxShadow: 'var(--shadow-card)' }}
        />
      </div>

      <div>
        <p className="text-sm font-semibold tracking-widest uppercase text-primary mb-2">Quem está por trás da OCA</p>
        <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-1">Anderson Gonçalves</h2>
        <p className="text-muted-foreground mb-6">Fundador da OCA Digital</p>

        <div className="space-y-4 text-lg text-muted-foreground">
          <p>
            Eu conheci o mercado imobiliário por dentro. Em 2019, como Head de Marketing da Brognoli, o problema não era falta
            de mídia: a imobiliária locava mais imóveis do que conseguia captar, e os leads se perdiam entre planilha, WhatsApp
            e portal.
          </p>
          <p>
            Foi ali que criamos o Indicasse e a websérie Vida Independente. Desde então, antes de pensar em anúncio, eu olho para
            o processo: de onde vem o lead, quem atende e o que se perde no caminho.
          </p>
          <p>
            Hoje faço isso com imobiliárias e incorporadoras, juntando a experiência em gestão de produto e projetos (sou formado
            pela FIAP) com CRM, automação e IA. Esse método, a Blindagem de Processos, eu também levo para outras agências em
            palestras e mentorias.
          </p>
        </div>

        <dl className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-8">
          {provas.map((p) => (
            <div key={p.valor} className="rounded-xl border border-border bg-card p-4">
              <dt className="text-2xl font-bold text-primary">{p.valor}</dt>
              <dd className="text-sm text-muted-foreground mt-1">{p.texto}</dd>
            </div>
          ))}
        </dl>

        <div className="flex flex-wrap gap-3 mt-8">
          <Button asChild size="lg" className="font-semibold">
            <a href={WHATSAPP} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="mr-2 h-5 w-5" aria-hidden="true" />
              Falar com o Anderson
            </a>
          </Button>
          {mostrarHistoria && (
            <Button asChild size="lg" variant="outline" className="font-semibold">
              <Link to="/sobre">Conheça a história da OCA</Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  </section>
  );
};

export default Founder;
