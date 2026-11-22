import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { X } from 'lucide-react';
import { trackSiteEvent } from '@/lib/formProgress';

// Aviso do relatório de atendimento: card no canto (faixa no rodapé no celular),
// aparece após 8 s ou metade da página rolada; fechado, some por 7 dias.
const CHAVE = 'relatorioCardFechado';
const DIAS = 7;
const OCULTAR = ['/relatorio-atendimento', '/diagnostico', '/admin'];

const fechadoRecente = () => {
  try {
    const t = Number(localStorage.getItem(CHAVE));
    return t > 0 && Date.now() - t < DIAS * 86400000;
  } catch {
    return false;
  }
};

const RelatorioCard = () => {
  const { pathname } = useLocation();
  const [visivel, setVisivel] = useState(false);
  const oculto = OCULTAR.some((p) => pathname.startsWith(p));

  useEffect(() => {
    if (oculto || fechadoRecente()) {
      setVisivel(false);
      return;
    }
    const mostrar = () => setVisivel(true);
    const timer = window.setTimeout(mostrar, 8000);
    const rolar = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max > 0 && window.scrollY / max >= 0.5) mostrar();
    };
    window.addEventListener('scroll', rolar, { passive: true });
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('scroll', rolar);
    };
  }, [oculto]);

  if (!visivel || oculto) return null;

  const fechar = () => {
    try { localStorage.setItem(CHAVE, String(Date.now())); } catch { /* sem storage */ }
    setVisivel(false);
  };

  return (
    <div
      role="complementary"
      aria-label="Relatório de atendimento"
      className="fixed z-50 inset-x-0 bottom-0 sm:inset-x-auto sm:bottom-6 sm:right-6 sm:max-w-sm animate-in slide-in-from-bottom-4 fade-in duration-500"
    >
      <div className="relative bg-background border border-primary/30 shadow-2xl sm:rounded-2xl px-4 py-3 sm:p-5 flex sm:block items-center gap-3">
        <button onClick={fechar} aria-label="Fechar" className="absolute top-2 right-2 p-1 text-muted-foreground hover:text-foreground">
          <X className="h-4 w-4" />
        </button>
        <div className="flex-1 pr-6">
          <p className="hidden sm:block text-xs font-semibold tracking-widest uppercase text-primary mb-1">Relatório novo</p>
          <p className="text-sm sm:text-base font-semibold text-foreground leading-snug">
            Testamos o atendimento de 35 imobiliárias de Floripa no WhatsApp.
          </p>
          <p className="hidden sm:block text-sm text-muted-foreground mt-1">81% responderam, mas só 28% fizeram perguntas para entender o cliente.</p>
        </div>
        <Link
          to="/relatorio-atendimento"
          onClick={() => { trackSiteEvent('relatorio_acao', { servico: 'card' }); fechar(); }}
          className="shrink-0 sm:mt-4 inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground text-sm font-semibold px-4 py-2 hover:opacity-90 mr-6 sm:mr-0"
        >
          Ver o ranking
        </Link>
      </div>
    </div>
  );
};

export default RelatorioCard;
