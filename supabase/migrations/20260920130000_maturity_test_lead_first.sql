-- Teste de Maturidade: o lead é capturado antes de começar; as respostas entram ao concluir.
ALTER TABLE public.maturity_test_responses
  ALTER COLUMN answers DROP NOT NULL,
  ALTER COLUMN dimension_scores DROP NOT NULL,
  ALTER COLUMN overall_score DROP NOT NULL,
  ALTER COLUMN level DROP NOT NULL,
  ADD COLUMN IF NOT EXISTS completed_at timestamptz;

CREATE OR REPLACE FUNCTION public.start_maturity_test(
  p_name text,
  p_email text,
  p_phone text,
  p_company_type text,
  p_company text DEFAULT NULL,
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
  IF p_email IS NULL OR length(p_email) > 200 OR p_email !~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' THEN
    RAISE EXCEPTION 'invalid email';
  END IF;
  IF p_utm IS NOT NULL AND length(p_utm::text) > 1000 THEN
    p_utm := NULL;
  END IF;

  INSERT INTO public.maturity_test_responses (
    lead_name, lead_email, lead_phone, lead_company_type, lead_company,
    consent_at, lead_created_at, utm, referrer
  ) VALUES (
    btrim(p_name), lower(btrim(p_email)), left(btrim(coalesce(p_phone, '')), 40),
    left(coalesce(p_company_type, ''), 60), left(btrim(coalesce(p_company, '')), 120),
    now(), now(), p_utm, left(p_referrer, 300)
  ) RETURNING id INTO v_id;

  RETURN v_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.complete_maturity_test(
  p_id uuid,
  p_answers jsonb,
  p_dimension_scores jsonb,
  p_overall numeric,
  p_level smallint,
  p_weakest text
) RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  i int;
  n int;
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

  UPDATE public.maturity_test_responses
  SET answers = p_answers,
      dimension_scores = p_dimension_scores,
      overall_score = p_overall,
      level = p_level,
      weakest_dimension = left(p_weakest, 60),
      completed_at = now()
  WHERE id = p_id AND completed_at IS NULL;

  GET DIAGNOSTICS n = ROW_COUNT;
  RETURN n > 0;
END;
$$;

REVOKE ALL ON FUNCTION public.start_maturity_test(text, text, text, text, text, jsonb, text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.complete_maturity_test(uuid, jsonb, jsonb, numeric, smallint, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.start_maturity_test(text, text, text, text, text, jsonb, text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.complete_maturity_test(uuid, jsonb, jsonb, numeric, smallint, text) TO anon, authenticated;
