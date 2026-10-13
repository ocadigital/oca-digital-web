import { useEffect, useRef, useState } from 'react';

/**
 * Animação do hero: o lead chega (Instagram, Google, portal, WhatsApp), entra no CRM,
 * é pontuado e vira visita. Vídeo gerado no projeto sketch-videos (composição HeroOCA).
 * Ciclo: o desenho completo (imagem por cima do vídeo) fica parado alguns segundos, some
 * enquanto o vídeo monta o fluxo e volta quando o vídeo acaba, em loop. Assim a tela nunca
 * fica vazia nem preta. Quem pede menos movimento no aparelho vê só a imagem final.
 */
const PAUSA_MS = 2500;
const POSTER = '/motion/hero-fluxo-lead-v2.jpg';

const HeroMotion = () => {
  const [reduce, setReduce] = useState(false);
  const [tocando, setTocando] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduce(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduce(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v || reduce) return;
    // O React não repassa `muted` como atributo, e sem ele o navegador bloqueia a reprodução automática.
    v.muted = true;
    let timer = 0;
    const agendar = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(tocar, PAUSA_MS);
    };
    // O navegador recusa tocar vídeo em aba escondida; nesse caso fica o desenho completo e o ciclo
    // recomeça quando a aba volta a ficar visível.
    function tocar() {
      if (document.hidden) return;
      v.currentTime = 0;
      v.play()
        .then(() => setTocando(true))
        .catch(() => setTocando(false));
    }
    const aoTerminar = () => {
      setTocando(false);
      agendar();
    };
    const aoPausar = () => {
      if (!v.ended) setTocando(false);
    };
    const aoVoltar = () => {
      if (!document.hidden && v.paused) agendar();
    };
    v.addEventListener('ended', aoTerminar);
    v.addEventListener('pause', aoPausar);
    document.addEventListener('visibilitychange', aoVoltar);
    agendar();
    return () => {
      window.clearTimeout(timer);
      v.removeEventListener('ended', aoTerminar);
      v.removeEventListener('pause', aoPausar);
      document.removeEventListener('visibilitychange', aoVoltar);
    };
  }, [reduce]);

  const label =
    'Animação: leads do Instagram, Google, portais e WhatsApp entram no CRM com a origem rastreada, recebem um lead score e viram visita agendada.';

  return (
    <div className="relative mx-auto w-full max-w-[560px] aspect-square rounded-2xl overflow-hidden border-2 border-primary/20 shadow-2xl bg-[#0A0A10]">
      {reduce ? (
        <img src={POSTER} alt={label} width={900} height={900} className="w-full h-full object-cover" />
      ) : (
        <>
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            muted
            playsInline
            preload="auto"
            poster={POSTER}
            width={900}
            height={900}
            aria-label={label}
          >
            <source src="/motion/hero-fluxo-lead-v2.webm" type="video/webm" />
            <source src="/motion/hero-fluxo-lead-v2.mp4" type="video/mp4" />
          </video>
          <img
            src={POSTER}
            alt=""
            aria-hidden="true"
            width={900}
            height={900}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${tocando ? 'opacity-0' : 'opacity-100'}`}
          />
        </>
      )}
    </div>
  );
};

export default HeroMotion;
