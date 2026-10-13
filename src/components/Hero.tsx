import { ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import HeroMotion from '@/components/HeroMotion';

const Hero = () => {
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section id="inicio" className="pt-16 min-h-screen relative overflow-hidden bg-background">
      {/* Violet glow backdrop */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'var(--gradient-hero-glow)' }}
      />
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 80%, hsl(265 90% 45% / 0.25), transparent 40%), radial-gradient(circle at 80% 20%, hsl(250 95% 55% / 0.2), transparent 45%)',
          transform: `translateY(${scrollY * 0.3}px)`,
        }}
      />
      {/* Grafismo herdado da identidade original da marca, ver Brand Book cap. 05 */}
      <div
        className="grafismo-oca absolute inset-0 pointer-events-none opacity-[0.08]"
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
              <h1 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight">
                Transforme sua
                <span className="text-primary"> Imobiliária</span>
                <br />
                em uma Máquina de
                <span className="text-primary"> Conversão</span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Especialistas em marketing imobiliário que combinam estratégia, dados e automação 
                para gerar mais leads qualificados e impulsionar suas vendas.
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

            <div className="grid grid-cols-3 gap-8 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">+200%</div>
                <div className="text-sm text-muted-foreground">Aumento em Leads</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">+150%</div>
                <div className="text-sm text-muted-foreground">ROI Médio</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">+20</div>
                <div className="text-sm text-muted-foreground">Clientes</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <HeroMotion />
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
