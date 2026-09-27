-- Teste de Maturidade: progresso por pergunta (para ver onde quem desiste parou)
-- e limite maior para a atribuicao (UTMs de primeiro/ultimo toque vindos dos cookies).

ALTER TABLE public.maturity_test_responses
  ADD COLUMN IF NOT EXISTS partial_answers jsonb,
  ADD COLUMN IF NOT EXISTS last_step smallint NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_activity_at timestamptz;

CREATE OR REPLACE FUNCTION public.save_maturity_progress(p_id uuid, p_answers jsonb)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  i int;
  v_step int := 0;
  n int;
BEGIN
  IF jsonb_typeof(p_answers) <> 'array' OR jsonb_array_length(p_answers) > 10 THEN
    RAISE EXCEPTION 'invalid answers';
  END IF;
  FOR i IN 0..jsonb_array_length(p_answers) - 1 LOOP
    IF jsonb_typeof(p_answers -> i) = 'null' THEN
      CONTINUE;
    END IF;
    IF (p_answers ->> i) !~ '^[1-5]$' THEN
      RAISE EXCEPTION 'invalid answer value';
    END IF;
    v_step := v_step + 1;
  END LOOP;

  UPDATE public.maturity_test_responses
  SET partial_answers = p_answers,
      last_step = v_step,
      last_activity_at = now()
  WHERE id = p_id AND completed_at IS NULL;

  GET DIAGNOSTICS n = ROW_COUNT;
  RETURN n > 0;
END;
$$;

REVOKE ALL ON FUNCTION public.save_maturity_progress(uuid, jsonb) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.save_maturity_progress(uuid, jsonb) TO anon, authenticated;

-- Quem conclui fica com last_step = 10
CREATE OR REPLACE FUNCTION public.mark_maturity_completed_step()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.completed_at IS NOT NULL AND OLD.completed_at IS NULL THEN
    NEW.last_step := 10;
    NEW.last_activity_at := NEW.completed_at;
  END IF;
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS maturity_completed_step ON public.maturity_test_responses;
CREATE TRIGGER maturity_completed_step BEFORE UPDATE ON public.maturity_test_responses
  FOR EACH ROW EXECUTE FUNCTION public.mark_maturity_completed_step();
UPDATE public.maturity_test_responses SET last_step = 10 WHERE completed_at IS NOT NULL;

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
  IF p_utm IS NOT NULL AND length(p_utm::text) > 4000 THEN
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

NOTIFY pgrst, 'reload schema';
