import { ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import HeroMotion from '@/components/HeroMotion';
import { useParallax } from '@/hooks/use-parallax';

const Hero = () => {
  // Parallax leve: o brilho e o grafismo ficam para trás na rolagem, a animação anda um pouco à frente.
  const brilhoRef = useParallax<HTMLDivElement>(0.4);
  const grafismoRef = useParallax<HTMLDivElement>(0.25);
  const motionRef = useParallax<HTMLDivElement>(-0.1);

  return (
    <section id="inicio" className="pt-16 min-h-screen relative overflow-hidden bg-background">
      {/* Violet glow backdrop */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'var(--gradient-hero-glow)' }}
      />
      <div
        ref={brilhoRef}
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 80%, hsl(265 90% 45% / 0.25), transparent 40%), radial-gradient(circle at 80% 20%, hsl(250 95% 55% / 0.2), transparent 45%)',
        }}
      />
      {/* Grafismo herdado da identidade original da marca, ver Brand Book cap. 05 */}
      <div
        ref={grafismoRef}
        className="grafismo-oca absolute inset-x-0 -top-[15%] -bottom-[15%] pointer-events-none opacity-[0.08]"
        style={{
          backgroundImage: 'url(/patterns/oca-grafismo.webp)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          mixBlendMode: 'screen',
        }}
      />


      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-5xl font-bold text-foreground leading-tight text-balance">
                Do anúncio à <span className="text-primary">visita agendada</span>, com número em cada etapa
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                A OCA cuida do anúncio, do site e do CRM da sua imobiliária, com automação para nenhum lead ficar sem resposta
                e um relatório que mostra quanto cada canal vira venda.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="text-lg px-8 py-4"
                onClick={() => window.open('https://calendly.com/anderson-goncalves81/30min', '_blank')}
              >
                Falar com Especialista
              </Button>
            </div>

            <dl className="grid grid-cols-3 gap-4 sm:gap-8 pt-8">
              <div className="text-center">
                <dt className="text-2xl sm:text-3xl font-bold text-primary">173 leads</dt>
                <dd className="text-sm text-muted-foreground">em 1 semana no Sunclub Campeche, a R$ 43 cada</dd>
              </div>
              <div className="text-center">
                <dt className="text-2xl sm:text-3xl font-bold text-primary">2º lugar</dt>
                <dd className="text-sm text-muted-foreground">em vendas no Sunclub entre as imobiliárias do empreendimento</dd>
              </div>
              <div className="text-center">
                <dt className="text-2xl sm:text-3xl font-bold text-primary">300/mês</dt>
                <dd className="text-sm text-muted-foreground">captações de imóveis com o Indicasse, da Brognoli</dd>
              </div>
            </dl>
          </div>

          <div className="relative">
            <div ref={motionRef}>
              <HeroMotion />
            </div>
          </div>
        </div>

        <div className="text-center mt-16">
          <ArrowDown className="mx-auto text-muted-foreground animate-bounce" size={32} />
        </div>
      </div>
    </section>
  );
};

export default Hero;
