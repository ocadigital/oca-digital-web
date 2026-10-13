import { useEffect, useRef, useState } from 'react';

/**
 * Animação do hero: o lead chega (Instagram, Google, portal, WhatsApp), entra no CRM,
 * é pontuado e vira visita. Vídeo gerado no projeto sketch-videos (composição HeroOCA).
 * O visitante vê primeiro o desenho completo (o poster); depois de alguns segundos o vídeo
 * monta o fluxo uma vez e para no último quadro, que também é o desenho completo.
 * Quem pede menos movimento no aparelho vê só a imagem final.
 */
const ATRASO_MS = 2500;

const HeroMotion = () => {
  const [reduce, setReduce] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduce(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduce(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // O React não repassa `muted` como atributo, e sem ele o navegador bloqueia a reprodução automática.
  useEffect(() => {
    const v = videoRef.current;
    if (!v || reduce) return;
    v.muted = true;
    const t = window.setTimeout(() => {
      v.play().catch(() => undefined);
    }, ATRASO_MS);
    return () => window.clearTimeout(t);
  }, [reduce]);

  const label =
    'Animação: leads do Instagram, Google, portais e WhatsApp entram no CRM com a origem rastreada, recebem um lead score e viram visita agendada.';

  return (
    <div className="relative mx-auto w-full max-w-[560px] aspect-square rounded-2xl overflow-hidden border-2 border-primary/20 shadow-2xl bg-[#0A0A10]">
      {reduce ? (
        <img src="/motion/hero-fluxo-lead-v2.jpg" alt={label} width={900} height={900} className="w-full h-full object-cover" />
      ) : (
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          muted
          playsInline
          preload="auto"
          poster="/motion/hero-fluxo-lead-v2.jpg"
          width={900}
          height={900}
          aria-label={label}
        >
          <source src="/motion/hero-fluxo-lead-v2.webm" type="video/webm" />
          <source src="/motion/hero-fluxo-lead-v2.mp4" type="video/mp4" />
        </video>
      )}
    </div>
  );
};

export default HeroMotion;
