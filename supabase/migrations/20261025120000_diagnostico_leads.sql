-- Diagnóstico de leads (/diagnostico): uma linha por visitante, atualizada a cada etapa.
-- Mesmo padrão do Teste de Maturidade: a tabela fica fechada (RLS só admin) e o site grava
-- só pelas funções abaixo. O contato entra no fim; quem desiste no meio também fica registrado.

CREATE TABLE IF NOT EXISTS public.diagnostico_respostas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  last_activity_at timestamptz NOT NULL DEFAULT now(),
  last_step smallint NOT NULL DEFAULT 1,
  -- etapa 1: operação
  leads_mes integer,
  origens text[],
  -- etapa 2: atendimento
  tempo_resposta text CHECK (tempo_resposta IN ('5min', '1h', '4h', 'mais')),
  quem_responde text CHECK (quem_responde IN ('corretor', 'recepcao', 'robo', 'eu')),
  -- etapa 3: negócio
  conversao_pct numeric(5,2),
  ticket_medio numeric(14,2),
  comissao_pct numeric(5,2),
  -- resultado (calculado aqui no banco a partir das respostas)
  esfria_pct smallint GENERATED ALWAYS AS (
    CASE tempo_resposta WHEN '5min' THEN 10 WHEN '1h' THEN 25 WHEN '4h' THEN 40 WHEN 'mais' THEN 55 END
  ) STORED,
  -- etapa 4: contato
  lead_name text,
  lead_email text,
  lead_phone text,
  lead_company text,
  lead_company_type text,
  completed_at timestamptz,
  utm jsonb,
  referrer text
);

-- Colunas derivadas em view para não duplicar a regra de cálculo
CREATE OR REPLACE VIEW public.diagnostico_resultados
WITH (security_invoker = true) AS
SELECT d.*,
       round(d.leads_mes * d.esfria_pct / 100.0)::integer AS leads_frios_mes,
       round(d.leads_mes * d.esfria_pct / 100.0 * d.conversao_pct / 100.0, 2) AS vendas_perdidas_mes,
       round(d.leads_mes * d.esfria_pct / 100.0 * d.conversao_pct / 100.0 * d.ticket_medio * d.comissao_pct / 100.0, 2) AS comissao_perdida_mes
FROM public.diagnostico_respostas d;

ALTER TABLE public.diagnostico_respostas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read diagnostico_respostas"
  ON public.diagnostico_respostas FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));

-- Aplica as respostas de uma etapa, aceitando só os campos conhecidos e dentro de faixas razoáveis
CREATE OR REPLACE FUNCTION public.diagnostico_aplica(p_id uuid, p_step smallint, p_dados jsonb)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_origens text[];
BEGIN
  IF p_dados ? 'origens' THEN
    SELECT array_agg(o) INTO v_origens
    FROM jsonb_array_elements_text(p_dados -> 'origens') o
    WHERE o IN ('portais', 'anuncios', 'site', 'indicacao', 'redes', 'placas');
  END IF;

  UPDATE public.diagnostico_respostas SET
    leads_mes = CASE WHEN p_dados ? 'leads_mes' THEN least(greatest((p_dados ->> 'leads_mes')::integer, 0), 100000) ELSE leads_mes END,
    origens = CASE WHEN p_dados ? 'origens' THEN v_origens ELSE origens END,
    tempo_resposta = CASE WHEN p_dados ? 'tempo_resposta' THEN p_dados ->> 'tempo_resposta' ELSE tempo_resposta END,
    quem_responde = CASE WHEN p_dados ? 'quem_responde' THEN p_dados ->> 'quem_responde' ELSE quem_responde END,
    conversao_pct = CASE WHEN p_dados ? 'conversao_pct' THEN least(greatest((p_dados ->> 'conversao_pct')::numeric, 0), 100) ELSE conversao_pct END,
    ticket_medio = CASE WHEN p_dados ? 'ticket_medio' THEN least(greatest((p_dados ->> 'ticket_medio')::numeric, 0), 100000000) ELSE ticket_medio END,
    comissao_pct = CASE WHEN p_dados ? 'comissao_pct' THEN least(greatest((p_dados ->> 'comissao_pct')::numeric, 0), 100) ELSE comissao_pct END,
    last_step = greatest(last_step, least(greatest(p_step, 1), 4)),
    last_activity_at = now()
  WHERE id = p_id AND completed_at IS NULL;
END $$;

-- Etapa 1 concluída: nasce a linha
CREATE OR REPLACE FUNCTION public.begin_diagnostico(p_dados jsonb, p_utm jsonb DEFAULT NULL, p_referrer text DEFAULT NULL)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_id uuid;
BEGIN
  IF p_utm IS NOT NULL AND length(p_utm::text) > 4000 THEN p_utm := NULL; END IF;
  INSERT INTO public.diagnostico_respostas (utm, referrer) VALUES (p_utm, left(p_referrer, 300)) RETURNING id INTO v_id;
  PERFORM public.diagnostico_aplica(v_id, 1::smallint, p_dados);
  RETURN v_id;
END $$;

-- Etapas 2 e 3
CREATE OR REPLACE FUNCTION public.save_diagnostico(p_id uuid, p_step smallint, p_dados jsonb)
RETURNS void LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  SELECT public.diagnostico_aplica(p_id, p_step, p_dados);
$$;

-- Etapa 4: contato. Devolve o resultado calculado para o e-mail de aviso.
CREATE OR REPLACE FUNCTION public.complete_diagnostico(
  p_id uuid, p_name text, p_email text, p_phone text, p_company text DEFAULT NULL, p_company_type text DEFAULT NULL
) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE r record;
BEGIN
  IF length(btrim(coalesce(p_name, ''))) < 2 OR length(p_name) > 120 THEN RAISE EXCEPTION 'invalid name'; END IF;
  IF p_email !~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' OR length(p_email) > 200 THEN RAISE EXCEPTION 'invalid email'; END IF;
  IF length(regexp_replace(coalesce(p_phone, ''), '\D', '', 'g')) < 10 THEN RAISE EXCEPTION 'invalid phone'; END IF;
  IF p_company_type IS NOT NULL AND p_company_type NOT IN
     ('corretor-autonomo', 'pequena-imobiliaria', 'media-imobiliaria', 'grande-imobiliaria', 'incorporadora') THEN
    RAISE EXCEPTION 'invalid company type';
  END IF;

  UPDATE public.diagnostico_respostas SET
    lead_name = btrim(p_name), lead_email = lower(btrim(p_email)), lead_phone = left(btrim(p_phone), 30),
    lead_company = left(btrim(p_company), 120), lead_company_type = p_company_type,
    last_step = 4, last_activity_at = now(), completed_at = coalesce(completed_at, now())
  WHERE id = p_id;

  SELECT leads_frios_mes, vendas_perdidas_mes, comissao_perdida_mes INTO r
  FROM public.diagnostico_resultados WHERE id = p_id;
  RETURN to_jsonb(r);
END $$;

REVOKE ALL ON FUNCTION public.diagnostico_aplica(uuid, smallint, jsonb) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.begin_diagnostico(jsonb, jsonb, text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.save_diagnostico(uuid, smallint, jsonb) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.complete_diagnostico(uuid, text, text, text, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.begin_diagnostico(jsonb, jsonb, text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.save_diagnostico(uuid, smallint, jsonb) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.complete_diagnostico(uuid, text, text, text, text, text) TO anon, authenticated;

NOTIFY pgrst, 'reload schema';
