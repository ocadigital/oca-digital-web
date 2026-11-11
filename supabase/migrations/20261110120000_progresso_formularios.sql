-- Progressive profiling dos formulários de contato e de serviço, e eventos do funil do site.
-- Mesmo padrão do Teste de Maturidade e do Diagnóstico: tabelas fechadas (RLS só admin),
-- o site grava só pelas funções abaixo, que validam e limitam tudo.
--
-- Contato pessoal (nome, e-mail, telefone) só entra quando o campo está completo e válido,
-- e o formulário avisa que os dados preenchidos ficam salvos. O resto do progresso é anônimo.

CREATE TABLE IF NOT EXISTS public.form_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  last_activity_at timestamptz NOT NULL DEFAULT now(),
  form text NOT NULL CHECK (form IN ('contato', 'servico')),
  servico text,
  page text,
  campos text[] NOT NULL DEFAULT '{}',
  nome text,
  email text,
  telefone text,
  tipo_empresa text,
  mensagem_chars integer,
  completed_at timestamptz,
  utm jsonb,
  referrer text
);

CREATE INDEX IF NOT EXISTS form_progress_created_idx ON public.form_progress (created_at DESC);

ALTER TABLE public.form_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can read form_progress"
  ON public.form_progress FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));

-- Nasce quando a pessoa começa a preencher (primeiro campo tocado), sem dado pessoal
CREATE OR REPLACE FUNCTION public.begin_form_progress(
  p_form text, p_servico text DEFAULT NULL, p_page text DEFAULT NULL, p_utm jsonb DEFAULT NULL, p_referrer text DEFAULT NULL
) RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_id uuid;
BEGIN
  IF p_form NOT IN ('contato', 'servico') THEN RAISE EXCEPTION 'invalid form'; END IF;
  IF p_utm IS NOT NULL AND length(p_utm::text) > 4000 THEN p_utm := NULL; END IF;
  INSERT INTO public.form_progress (form, servico, page, utm, referrer)
  VALUES (p_form, left(p_servico, 60), left(p_page, 200), p_utm, left(p_referrer, 300))
  RETURNING id INTO v_id;
  RETURN v_id;
END $$;

-- Atualiza o que já foi preenchido. Só aceita campos conhecidos e só grava contato válido.
CREATE OR REPLACE FUNCTION public.save_form_progress(p_id uuid, p_dados jsonb)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_campos text[];
  v_nome text := btrim(coalesce(p_dados ->> 'nome', ''));
  v_email text := lower(btrim(coalesce(p_dados ->> 'email', '')));
  v_tel text := btrim(coalesce(p_dados ->> 'telefone', ''));
  v_tipo text := p_dados ->> 'tipo_empresa';
BEGIN
  IF p_dados IS NULL OR length(p_dados::text) > 2000 THEN RETURN; END IF;
  SELECT coalesce(array_agg(c), '{}') INTO v_campos
  FROM jsonb_array_elements_text(coalesce(p_dados -> 'campos', '[]'::jsonb)) c
  WHERE c IN ('nome', 'email', 'telefone', 'tipo_empresa', 'servico', 'mensagem');

  UPDATE public.form_progress SET
    campos = (SELECT coalesce(array_agg(DISTINCT x), '{}') FROM unnest(campos || v_campos) x),
    nome = CASE WHEN length(v_nome) BETWEEN 2 AND 120 THEN v_nome ELSE nome END,
    email = CASE WHEN v_email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' AND length(v_email) <= 200 THEN v_email ELSE email END,
    telefone = CASE WHEN length(regexp_replace(v_tel, '\D', '', 'g')) BETWEEN 10 AND 13 THEN left(v_tel, 30) ELSE telefone END,
    tipo_empresa = CASE WHEN v_tipo IN ('corretor-autonomo', 'pequena-imobiliaria', 'media-imobiliaria', 'grande-imobiliaria', 'incorporadora')
                        THEN v_tipo ELSE tipo_empresa END,
    servico = CASE WHEN p_dados ? 'servico' THEN left(p_dados ->> 'servico', 60) ELSE servico END,
    mensagem_chars = CASE WHEN p_dados ? 'mensagem_chars' THEN least(greatest((p_dados ->> 'mensagem_chars')::integer, 0), 5000) ELSE mensagem_chars END,
    last_activity_at = now()
  WHERE id = p_id AND completed_at IS NULL AND created_at > now() - interval '2 days';
END $$;

-- Envio concluído
CREATE OR REPLACE FUNCTION public.complete_form_progress(p_id uuid)
RETURNS void LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  UPDATE public.form_progress SET completed_at = coalesce(completed_at, now()), last_activity_at = now()
  WHERE id = p_id;
$$;

-- Eventos do funil: visitas às páginas-chave, preço aberto, formulário aberto
CREATE TABLE IF NOT EXISTS public.site_events (
  id bigserial PRIMARY KEY,
  created_at timestamptz NOT NULL DEFAULT now(),
  event text NOT NULL CHECK (event IN ('visita', 'preco_aberto', 'servico_modal_aberto', 'contato_visto')),
  page text,
  servico text,
  visitor text,
  utm jsonb
);

CREATE INDEX IF NOT EXISTS site_events_created_idx ON public.site_events (created_at DESC);
CREATE INDEX IF NOT EXISTS site_events_event_idx ON public.site_events (event, created_at DESC);

ALTER TABLE public.site_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can read site_events"
  ON public.site_events FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE OR REPLACE FUNCTION public.track_site_event(
  p_event text, p_page text DEFAULT NULL, p_servico text DEFAULT NULL, p_visitor text DEFAULT NULL, p_utm jsonb DEFAULT NULL
) RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF p_event NOT IN ('visita', 'preco_aberto', 'servico_modal_aberto', 'contato_visto') THEN RETURN; END IF;
  IF p_utm IS NOT NULL AND length(p_utm::text) > 2000 THEN p_utm := NULL; END IF;
  INSERT INTO public.site_events (event, page, servico, visitor, utm)
  VALUES (p_event, left(p_page, 200), left(p_servico, 60), left(p_visitor, 40), p_utm);
END $$;

REVOKE ALL ON FUNCTION public.begin_form_progress(text, text, text, jsonb, text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.save_form_progress(uuid, jsonb) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.complete_form_progress(uuid) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.track_site_event(text, text, text, text, jsonb) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.begin_form_progress(text, text, text, jsonb, text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.save_form_progress(uuid, jsonb) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.complete_form_progress(uuid) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.track_site_event(text, text, text, text, jsonb) TO anon, authenticated;

NOTIFY pgrst, 'reload schema';
