-- Perfil da empresa no Teste de Maturidade, preenchido de forma opcional
-- quando a pessoa pede o PDF do resultado.

ALTER TABLE public.maturity_test_responses
  ADD COLUMN IF NOT EXISTS profile jsonb,
  ADD COLUMN IF NOT EXISTS profile_completed_at timestamptz;

CREATE OR REPLACE FUNCTION public.update_maturity_profile(
  p_id uuid,
  p_segments text[],
  p_portfolio text[],
  p_size text,
  p_revenue text,
  p_regions text[]
) RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  n int;
BEGIN
  IF p_segments IS NOT NULL AND (
       cardinality(p_segments) > 3
       OR NOT (p_segments <@ ARRAY['imobiliaria-corretora','incorporadora','construtora','loteadora',
                                   'administradora-condominios','gestora-ativos','proptech','outro'])
     ) THEN
    RAISE EXCEPTION 'invalid segments';
  END IF;
  IF p_portfolio IS NOT NULL AND NOT (p_portfolio <@ ARRAY['locacao','venda','curta-temporada','condominios']) THEN
    RAISE EXCEPTION 'invalid portfolio';
  END IF;
  IF p_size IS NOT NULL AND p_size NOT IN ('micro','pequena','media','grande') THEN
    RAISE EXCEPTION 'invalid size';
  END IF;
  IF p_revenue IS NOT NULL AND p_revenue NOT IN ('ate-1m','1m-5m','5m-20m','20m-100m','acima-100m') THEN
    RAISE EXCEPTION 'invalid revenue';
  END IF;
  IF p_regions IS NOT NULL AND NOT (p_regions <@ ARRAY['sudeste','sul','nordeste','centro-oeste','norte']) THEN
    RAISE EXCEPTION 'invalid regions';
  END IF;

  UPDATE public.maturity_test_responses
  SET profile = jsonb_build_object(
        'segments', coalesce(to_jsonb(p_segments), '[]'::jsonb),
        'portfolio', coalesce(to_jsonb(p_portfolio), '[]'::jsonb),
        'size', p_size,
        'revenue', p_revenue,
        'regions', coalesce(to_jsonb(p_regions), '[]'::jsonb)
      ),
      profile_completed_at = now()
  WHERE id = p_id AND completed_at IS NOT NULL;

  GET DIAGNOSTICS n = ROW_COUNT;
  RETURN n > 0;
END;
$$;

REVOKE ALL ON FUNCTION public.update_maturity_profile(uuid, text[], text[], text, text, text[]) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.update_maturity_profile(uuid, text[], text[], text, text, text[]) TO anon, authenticated;

NOTIFY pgrst, 'reload schema';
