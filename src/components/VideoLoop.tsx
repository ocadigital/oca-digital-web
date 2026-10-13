import { useEffect, useRef, useState } from 'react';

interface Props {
  /** Caminho sem extensão: usa <base>.webm, <base>.mp4 e <base>.jpg (pôster com o desenho completo). */
  base: string;
  width: number;
  height: number;
  label: string;
  className?: string;
  /** Tempo parado no desenho completo antes de cada volta. */
  pausaMs?: number;
}

/**
 * Vídeo de animação em loop sem tela vazia nem preta: o pôster (desenho completo) fica por cima,
 * some enquanto o vídeo monta o desenho e volta quando ele acaba. Retoma quando a aba volta a ficar
 * visível, porque o navegador pausa vídeo em aba escondida. Com "reduzir movimento", só a imagem.
 */
const VideoLoop = ({ base, width, height, label, className = '', pausaMs = 2500 }: Props) => {
  const [reduce, setReduce] = useState(false);
  const [tocando, setTocando] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const poster = `${base}.jpg`;

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
      timer = window.setTimeout(tocar, pausaMs);
    };
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
  }, [reduce, pausaMs]);

  return (
    <div className={`relative overflow-hidden bg-[#0A0A10] ${className}`}>
      {reduce ? (
        <img src={poster} alt={label} width={width} height={height} className="w-full h-full object-cover" />
      ) : (
        <>
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            muted
            playsInline
            preload="auto"
            poster={poster}
            width={width}
            height={height}
            aria-label={label}
          >
            <source src={`${base}.webm`} type="video/webm" />
            <source src={`${base}.mp4`} type="video/mp4" />
          </video>
          <img
            src={poster}
            alt=""
            aria-hidden="true"
            width={width}
            height={height}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${tocando ? 'opacity-0' : 'opacity-100'}`}
          />
        </>
      )}
    </div>
  );
};

export default VideoLoop;
