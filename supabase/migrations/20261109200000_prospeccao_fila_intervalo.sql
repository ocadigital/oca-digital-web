-- Fila do cliente oculto: no máximo um teste por imobiliária a cada 7 dias, e o mesmo número
-- também só recebe outra mensagem depois de 7 dias. Evita venda e locação no mesmo dia para o
-- mesmo atendente (aconteceu com a Buzz em 2026-11-09) e deixa a resposta ligada ao teste certo.
CREATE OR REPLACE FUNCTION public.prospeccao_proximos_testes(p_operacao text, p_limite integer DEFAULT 6)
RETURNS TABLE (imobiliaria_id uuid, nome text, telefone text, imovel_url text, imovel_descricao text)
LANGUAGE sql STABLE AS $$
  WITH candidatas AS (
    SELECT i.*,
           public.prospeccao_normaliza_fone(CASE WHEN p_operacao = 'venda' THEN coalesce(i.telefone_venda, i.telefone)
                                                 ELSE coalesce(i.telefone_locacao, i.telefone) END) AS fone
    FROM public.prospeccao_imobiliarias i
    WHERE NOT i.opt_out
      AND i.status IN ('A contatar', 'Em teste')
      AND CASE WHEN p_operacao = 'venda' THEN i.imovel_venda_url ELSE i.imovel_locacao_url END IS NOT NULL
      AND NOT EXISTS (SELECT 1 FROM public.cliente_oculto_testes t
                       WHERE t.imobiliaria_id = i.id AND t.operacao = p_operacao)
      AND NOT EXISTS (SELECT 1 FROM public.cliente_oculto_testes t
                       WHERE t.imobiliaria_id = i.id AND t.enviado_em > now() - interval '7 days')
  )
  SELECT c.id, c.nome, c.fone,
         CASE WHEN p_operacao = 'venda' THEN c.imovel_venda_url ELSE c.imovel_locacao_url END,
         CASE WHEN p_operacao = 'venda' THEN c.imovel_venda_descricao ELSE c.imovel_locacao_descricao END
  FROM candidatas c
  WHERE c.fone IS NOT NULL
    AND NOT EXISTS (SELECT 1 FROM public.cliente_oculto_testes t
                     WHERE public.prospeccao_mesmo_fone(t.telefone, c.fone)
                       AND t.enviado_em > now() - interval '7 days')
  ORDER BY c.rating_interno DESC NULLS LAST, c.meta_ads_ativo DESC NULLS LAST, c.seguidores_instagram DESC NULLS LAST
  LIMIT p_limite
$$;

REVOKE EXECUTE ON FUNCTION public.prospeccao_proximos_testes(text, integer) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.prospeccao_proximos_testes(text, integer) TO service_role;
