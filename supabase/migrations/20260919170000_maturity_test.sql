-- Teste de Maturidade Imobiliária: respostas anônimas + lead opcional.
-- A tabela fica fechada (RLS sem policy para anon); o site grava só pelas funções abaixo.

CREATE TABLE IF NOT EXISTS public.maturity_test_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  answers jsonb NOT NULL,
  dimension_scores jsonb NOT NULL,
  overall_score numeric(3,2) NOT NULL,
  level smallint NOT NULL CHECK (level BETWEEN 1 AND 5),
  weakest_dimension text,
  utm jsonb,
  referrer text,
  lead_name text,
  lead_email text,
  lead_phone text,
  lead_company_type text,
  lead_company text,
  consent_at timestamptz,
  lead_created_at timestamptz
);

ALTER TABLE public.maturity_test_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read maturity test responses"
  ON public.maturity_test_responses
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE OR REPLACE FUNCTION public.submit_maturity_test(
  p_answers jsonb,
  p_dimension_scores jsonb,
  p_overall numeric,
  p_level smallint,
  p_weakest text,
  p_utm jsonb DEFAULT NULL,
  p_referrer text DEFAULT NULL
) RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id uuid;
  i int;
BEGIN
  IF jsonb_typeof(p_answers) <> 'array' OR jsonb_array_length(p_answers) <> 10 THEN
    RAISE EXCEPTION 'invalid answers';
  END IF;
  FOR i IN 0..9 LOOP
    IF (p_answers ->> i) IS NULL OR (p_answers ->> i) !~ '^[1-5]$' THEN
      RAISE EXCEPTION 'invalid answer value';
    END IF;
  END LOOP;
  IF p_level NOT BETWEEN 1 AND 5 OR p_overall < 1 OR p_overall > 5 THEN
    RAISE EXCEPTION 'invalid score';
  END IF;
  IF p_dimension_scores IS NULL OR length(p_dimension_scores::text) > 1000 THEN
    RAISE EXCEPTION 'invalid dimension scores';
  END IF;
  IF p_utm IS NOT NULL AND length(p_utm::text) > 1000 THEN
    p_utm := NULL;
  END IF;

  INSERT INTO public.maturity_test_responses (answers, dimension_scores, overall_score, level, weakest_dimension, utm, referrer)
  VALUES (p_answers, p_dimension_scores, p_overall, p_level, left(p_weakest, 60), p_utm, left(p_referrer, 300))
  RETURNING id INTO v_id;

  RETURN v_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.attach_maturity_lead(
  p_id uuid,
  p_name text,
  p_email text,
  p_phone text,
  p_company_type text,
  p_company text DEFAULT NULL
) RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  n int;
BEGIN
  IF length(btrim(coalesce(p_name, ''))) < 2 OR length(p_name) > 120 THEN
    RAISE EXCEPTION 'invalid name';
  END IF;
  IF p_email IS NULL OR length(p_email) > 200 OR p_email !~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' THEN
    RAISE EXCEPTION 'invalid email';
  END IF;

  UPDATE public.maturity_test_responses
  SET lead_name = btrim(p_name),
      lead_email = lower(btrim(p_email)),
      lead_phone = left(btrim(coalesce(p_phone, '')), 40),
      lead_company_type = left(coalesce(p_company_type, ''), 60),
      lead_company = left(btrim(coalesce(p_company, '')), 120),
      consent_at = now(),
      lead_created_at = now()
  WHERE id = p_id AND lead_email IS NULL;

  GET DIAGNOSTICS n = ROW_COUNT;
  RETURN n > 0;
END;
$$;

REVOKE ALL ON FUNCTION public.submit_maturity_test(jsonb, jsonb, numeric, smallint, text, jsonb, text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.attach_maturity_lead(uuid, text, text, text, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.submit_maturity_test(jsonb, jsonb, numeric, smallint, text, jsonb, text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.attach_maturity_lead(uuid, text, text, text, text, text) TO anon, authenticated;
