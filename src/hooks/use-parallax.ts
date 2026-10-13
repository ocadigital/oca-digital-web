import { useEffect, useRef } from 'react';

/**
 * Parallax leve: desloca o elemento na vertical conforme a rolagem, proporcional à distância
 * entre o centro do bloco pai e o centro da tela. speed positivo faz o elemento "ficar para trás"
 * (fundo); negativo faz andar um pouco à frente. Mexe direto no transform, sem re-renderizar,
 * e fica desligado para quem pede menos movimento no aparelho.
 */
export function useParallax<T extends HTMLElement>(speed: number) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    const alvo = el?.parentElement;
    if (!el || !alvo) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let raf = 0;
    const atualizar = () => {
      raf = 0;
      const r = alvo.getBoundingClientRect();
      if (r.bottom < -200 || r.top > window.innerHeight + 200) return; // fora da tela
      const distancia = r.top + r.height / 2 - window.innerHeight / 2;
      el.style.transform = `translate3d(0, ${(-distancia * speed).toFixed(1)}px, 0)`;
    };
    const agendar = () => {
      if (!raf) raf = requestAnimationFrame(atualizar);
    };
    el.style.willChange = 'transform';
    atualizar();
    window.addEventListener('scroll', agendar, { passive: true });
    window.addEventListener('resize', agendar);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', agendar);
      window.removeEventListener('resize', agendar);
      el.style.transform = '';
      el.style.willChange = '';
    };
  }, [speed]);

  return ref;
}
