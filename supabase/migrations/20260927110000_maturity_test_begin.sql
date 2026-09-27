-- Teste de Maturidade: a linha nasce na etapa inicial, só com nome e perfil da empresa.
-- E-mail e WhatsApp entram depois, via attach_maturity_lead, quando a pessoa libera o
-- diagnóstico completo.

CREATE OR REPLACE FUNCTION public.begin_maturity_test(
  p_name text,
  p_company_type text,
  p_utm jsonb DEFAULT NULL,
  p_referrer text DEFAULT NULL
) RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id uuid;
BEGIN
  IF length(btrim(coalesce(p_name, ''))) < 2 OR length(p_name) > 120 THEN
    RAISE EXCEPTION 'invalid name';
  END IF;
  IF p_company_type IS NULL OR p_company_type NOT IN
     ('corretor-autonomo', 'pequena-imobiliaria', 'media-imobiliaria', 'grande-imobiliaria', 'incorporadora') THEN
    RAISE EXCEPTION 'invalid company type';
  END IF;
  IF p_utm IS NOT NULL AND length(p_utm::text) > 4000 THEN
    p_utm := NULL;
  END IF;

  INSERT INTO public.maturity_test_responses (lead_name, lead_company_type, utm, referrer, last_activity_at)
  VALUES (btrim(p_name), p_company_type, p_utm, left(p_referrer, 300), now())
  RETURNING id INTO v_id;

  RETURN v_id;
END;
$$;

REVOKE ALL ON FUNCTION public.begin_maturity_test(text, text, jsonb, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.begin_maturity_test(text, text, jsonb, text) TO anon, authenticated;

NOTIFY pgrst, 'reload schema';
