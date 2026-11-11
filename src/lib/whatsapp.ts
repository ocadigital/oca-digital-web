import { trackSiteEvent } from '@/lib/formProgress';

// CTAs de conversa do site: abrem o WhatsApp do Anderson com uma mensagem pronta conforme o lugar do clique.
export const WHATSAPP_NUMERO = '5548996790700';

export type OrigemWhatsapp = 'menu' | 'home' | 'oca-one' | 'oca-base' | 'contato' | 'blog' | 'case' | 'fundador';

const MENSAGENS: Record<OrigemWhatsapp, (detalhe?: string) => string> = {
  menu: () => 'Oi Anderson, vim pelo site da OCA Digital e quero conversar sobre o marketing da minha imobiliária.',
  home: () => 'Oi Anderson, vim pelo site da OCA Digital e quero conversar sobre como gerar e atender melhor os leads da minha imobiliária.',
  'oca-one': () => 'Oi Anderson, vim pelo site da OCA Digital e quero ver uma demonstração do OCA One.',
  'oca-base': () => 'Oi Anderson, vim pelo site da OCA Digital e quero ver uma demonstração do OCA Base.',
  contato: () => 'Oi Anderson, vim pelo site da OCA Digital e quero marcar uma conversa sobre a minha imobiliária.',
  blog: (titulo) => `Oi Anderson, li o post "${titulo ?? 'do blog'}" no site da OCA Digital e quero aplicar isso na minha imobiliária.`,
  case: (titulo) => `Oi Anderson, vi o case "${titulo ?? 'no site'}" da OCA Digital e quero um resultado parecido na minha imobiliária.`,
  fundador: () => 'Oi Anderson, vi o site da OCA Digital e quero conversar sobre a minha imobiliária.',
};

export const linkWhatsapp = (origem: OrigemWhatsapp, detalhe?: string) =>
  `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(MENSAGENS[origem](detalhe))}`;

/** Registra o clique (painel e GA4) e abre a conversa. Chamar direto no clique, sem await, para o navegador não bloquear a aba. */
export const abrirWhatsapp = (origem: OrigemWhatsapp, detalhe?: string) => {
  trackSiteEvent('whatsapp_clicado', { servico: origem });
  const w = window as unknown as { dataLayer?: Record<string, unknown>[] };
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({ event: 'whatsapp_click', origem });
  window.open(linkWhatsapp(origem, detalhe), '_blank', 'noopener');
};
