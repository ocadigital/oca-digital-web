-- Ações dentro do relatório de atendimento (pedido de detalhe, pedido de avaliação, clique no diagnóstico)
ALTER TABLE public.site_events DROP CONSTRAINT IF EXISTS site_events_event_check;
ALTER TABLE public.site_events ADD CONSTRAINT site_events_event_check
  CHECK (event IN ('visita', 'preco_aberto', 'servico_modal_aberto', 'contato_visto', 'whatsapp_clicado', 'relatorio_acao'));

CREATE OR REPLACE FUNCTION public.track_site_event(
  p_event text, p_page text DEFAULT NULL, p_servico text DEFAULT NULL, p_visitor text DEFAULT NULL, p_utm jsonb DEFAULT NULL
) RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF p_event NOT IN ('visita', 'preco_aberto', 'servico_modal_aberto', 'contato_visto', 'whatsapp_clicado', 'relatorio_acao') THEN RETURN; END IF;
  IF p_utm IS NOT NULL AND length(p_utm::text) > 2000 THEN p_utm := NULL; END IF;
  INSERT INTO public.site_events (event, page, servico, visitor, utm)
  VALUES (p_event, left(p_page, 200), left(p_servico, 60), left(p_visitor, 40), p_utm);
END $$;

NOTIFY pgrst, 'reload schema';
