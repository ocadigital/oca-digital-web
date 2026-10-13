import VideoLoop from '@/components/VideoLoop';

/**
 * Animação do hero: o lead chega (Instagram, Google, portal, WhatsApp), entra no CRM,
 * é pontuado e vira visita. Vídeo gerado no projeto sketch-videos (composição HeroOCA).
 */
const HeroMotion = () => (
  <VideoLoop
    base="/motion/hero-fluxo-lead-v2"
    width={900}
    height={900}
    label="Animação: leads do Instagram, Google, portais e WhatsApp entram no CRM com a origem rastreada, recebem um lead score e viram visita agendada."
    className="mx-auto w-full max-w-[440px] lg:max-w-[clamp(320px,calc(100svh-260px),440px)] aspect-square rounded-2xl border-2 border-primary/20 shadow-2xl"
  />
);

export default HeroMotion;
