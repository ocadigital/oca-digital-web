-- Correção: least(NULL, 1) devolve 1 no Postgres, então quem não tinha citações em IA ganhava os 25 pontos.
CREATE OR REPLACE FUNCTION public.relatorio_presenca(i public.prospeccao_imobiliarias)
RETURNS integer LANGUAGE sql IMMUTABLE AS $$
  SELECT round(
      CASE WHEN i.seguidores_instagram > 0 THEN least(log(i.seguidores_instagram) / log(40000), 1) * 35 ELSE 0 END
    + CASE WHEN i.google_nota IS NOT NULL THEN (i.google_nota / 5) * least(log(coalesce(i.google_avaliacoes, 0) + 1) / 3, 1) * 25 ELSE 0 END
    + CASE WHEN i.ia_citacoes > 0 THEN least(i.ia_citacoes / 15.0, 1) * 25 ELSE 0 END
    + CASE WHEN i.meta_ads_ativo THEN 15 ELSE 0 END
  )::integer
$$;
