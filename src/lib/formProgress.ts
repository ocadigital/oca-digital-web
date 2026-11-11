import { useCallback, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Progressive profiling dos formulários de contato e de serviço, e eventos do funil do site.
// Tudo é "melhor esforço": se a rede ou o banco falhar, o formulário segue funcionando normalmente.

type Rpc = (fn: string, args: Record<string, unknown>) => Promise<{ data: unknown; error: { message: string } | null }>;
const rpcRaw = supabase.rpc.bind(supabase) as unknown as Rpc;
// o retorno do supabase-js é um "thenable" sem .catch: embrulha numa Promise de verdade
const rpc: Rpc = (fn, args) => Promise.resolve(rpcRaw(fn, args));

export const readAttribution = () => {
  const p = new URLSearchParams(window.location.search);
  const out: Record<string, string> = {};
  ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'gclid', 'fbclid'].forEach((k) => {
    const v = p.get(k);
    if (v) out[k] = v.slice(0, 120);
  });
  return Object.keys(out).length ? out : null;
};

const visitor = () => document.cookie.match(/(?:^|; )visitor_id=([^;]*)/)?.[1]?.slice(0, 40) ?? null;

export type SiteEvent = 'visita' | 'preco_aberto' | 'servico_modal_aberto' | 'contato_visto' | 'whatsapp_clicado';

/** Registra um evento do funil no banco (para o painel /admin/conversoes). Nunca lança erro. */
export const trackSiteEvent = (event: SiteEvent, data: { servico?: string } = {}) => {
  rpc('track_site_event', {
    p_event: event,
    p_page: window.location.pathname,
    p_servico: data.servico ?? null,
    p_visitor: visitor(),
    p_utm: readAttribution(),
  }).catch(() => undefined);
};

type Campo = 'nome' | 'email' | 'telefone' | 'tipo_empresa' | 'servico' | 'mensagem';
export interface DadosParciais {
  nome?: string;
  email?: string;
  telefone?: string;
  tipo_empresa?: string;
  servico?: string;
  mensagem?: string;
}

/**
 * Salva o preenchimento aos poucos: a linha nasce no primeiro campo tocado e é atualizada
 * 1,2 s depois que a pessoa para de digitar. O banco só guarda nome, e-mail e telefone válidos.
 */
export const useFormProgress = (form: 'contato' | 'servico', servico?: string) => {
  const idRef = useRef<Promise<string | null> | null>(null);
  const timer = useRef<number>();
  const ultimo = useRef<DadosParciais>({});

  const garantirLinha = useCallback(() => {
    if (!idRef.current) {
      idRef.current = rpc('begin_form_progress', {
        p_form: form,
        p_servico: servico ?? null,
        p_page: window.location.pathname,
        p_utm: readAttribution(),
        p_referrer: document.referrer || null,
      })
        .then(({ data, error }) => (error ? null : (data as string)))
        .catch(() => null);
    }
    return idRef.current;
  }, [form, servico]);

  const enviar = useCallback(async () => {
    const id = await garantirLinha();
    if (!id) return;
    const d = ultimo.current;
    const campos = (Object.keys(d) as Campo[]).filter((k) => String(d[k] ?? '').trim().length > 0);
    await rpc('save_form_progress', {
      p_id: id,
      p_dados: {
        campos,
        nome: d.nome?.trim(),
        email: d.email?.trim(),
        telefone: d.telefone?.trim(),
        tipo_empresa: d.tipo_empresa,
        servico: d.servico,
        mensagem_chars: d.mensagem ? d.mensagem.length : undefined,
      },
    }).catch(() => undefined);
  }, [garantirLinha]);

  /** Chame a cada mudança do formulário. */
  const registrar = useCallback(
    (dados: DadosParciais) => {
      ultimo.current = dados;
      garantirLinha();
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(enviar, 1200);
    },
    [enviar, garantirLinha],
  );

  /** Chame depois do envio com sucesso. */
  const concluir = useCallback(async () => {
    window.clearTimeout(timer.current);
    const id = await (idRef.current ?? Promise.resolve(null));
    if (id) {
      await enviar();
      await rpc('complete_form_progress', { p_id: id }).catch(() => undefined);
    }
    idRef.current = null;
    ultimo.current = {};
  }, [enviar]);

  /** Recomeça (por exemplo, quando o modal é aberto para outro serviço). */
  const reiniciar = useCallback(() => {
    window.clearTimeout(timer.current);
    idRef.current = null;
    ultimo.current = {};
  }, []);

  // grava o que estiver pendente se a pessoa sair da página
  useEffect(() => {
    const sair = () => {
      if (timer.current) {
        window.clearTimeout(timer.current);
        enviar();
      }
    };
    window.addEventListener('pagehide', sair);
    return () => {
      window.removeEventListener('pagehide', sair);
      window.clearTimeout(timer.current);
    };
  }, [enviar]);

  return { registrar, concluir, reiniciar };
};

/** Registra uma visita à página (home, teste e diagnóstico), para o topo do funil no painel. */
export const useTrackVisit = () => {
  useEffect(() => {
    trackSiteEvent('visita');
  }, []);
};
