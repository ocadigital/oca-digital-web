-- Automação do Teste A (Cliente Oculto + cadência ao decisor), executada pelo n8n.
-- O n8n usa a service_role key: as funções abaixo só podem ser chamadas por ela.
-- Fluxo: A contatar -> Em teste -> Testado -> Em cadência -> Respondeu | Sem resposta | Não contatar

-- 1. Campos novos na imobiliária -------------------------------------------------
ALTER TABLE public.prospeccao_imobiliarias
  ADD COLUMN IF NOT EXISTS telefone_venda text,
  ADD COLUMN IF NOT EXISTS telefone_locacao text,
  ADD COLUMN IF NOT EXISTS email_decisor text,
  ADD COLUMN IF NOT EXISTS nota_venda numeric(3,1),
  ADD COLUMN IF NOT EXISTS nota_locacao numeric(3,1),
  ADD COLUMN IF NOT EXISTS nota_cliente_oculto numeric(3,1),
  ADD COLUMN IF NOT EXISTS etapa_cadencia text NOT NULL DEFAULT 'teste'
    CHECK (etapa_cadencia IN ('teste', 'D0', 'D2', 'D5', 'D9', 'concluida', 'pausada')),
  ADD COLUMN IF NOT EXISTS proxima_acao_em timestamptz,
  ADD COLUMN IF NOT EXISTS ultimo_contato_em timestamptz,
  ADD COLUMN IF NOT EXISTS opt_out boolean NOT NULL DEFAULT false;

-- 2. Um teste por imobiliária e operação (venda e locação têm equipes diferentes) --
CREATE TABLE IF NOT EXISTS public.cliente_oculto_testes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  imobiliaria_id uuid NOT NULL REFERENCES public.prospeccao_imobiliarias(id) ON DELETE CASCADE,
  operacao text NOT NULL CHECK (operacao IN ('venda', 'locacao')),
  telefone text NOT NULL,
  imovel_url text,
  mensagem text,
  enviado_em timestamptz,
  primeira_resposta_em timestamptz,
  tempo_resposta_min integer GENERATED ALWAYS AS (
    CASE WHEN primeira_resposta_em IS NULL OR enviado_em IS NULL THEN NULL
         ELSE (extract(epoch FROM primeira_resposta_em - enviado_em) / 60)::integer END
  ) STORED,
  mensagens_recebidas integer NOT NULL DEFAULT 0,
  ultima_mensagem_em timestamptz,
  resposta_automatica boolean NOT NULL DEFAULT false,
  qualificou boolean NOT NULL DEFAULT false,
  ofereceu_proximo_passo boolean NOT NULL DEFAULT false,
  follow_up boolean NOT NULL DEFAULT false,
  transcricao jsonb NOT NULL DEFAULT '[]'::jsonb,
  status text NOT NULL DEFAULT 'aguardando'
    CHECK (status IN ('aguardando', 'respondido', 'encerrado', 'sem_resposta', 'sem_whatsapp')),
  nota numeric(3,1),
  UNIQUE (imobiliaria_id, operacao)
);

-- 3. Log de tudo que a automação fez -------------------------------------------------
CREATE TABLE IF NOT EXISTS public.prospeccao_eventos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  imobiliaria_id uuid REFERENCES public.prospeccao_imobiliarias(id) ON DELETE CASCADE,
  tipo text NOT NULL,
  detalhe jsonb
);

ALTER TABLE public.cliente_oculto_testes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prospeccao_eventos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage cliente_oculto_testes" ON public.cliente_oculto_testes
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins read prospeccao_eventos" ON public.prospeccao_eventos
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));

-- 4. Funções auxiliares ----------------------------------------------------------------

-- Só dígitos, com 55 na frente: "(48) 99193-8505" -> "5548991938505"
CREATE OR REPLACE FUNCTION public.prospeccao_normaliza_fone(p text)
RETURNS text LANGUAGE sql IMMUTABLE AS $$
  SELECT CASE
    WHEN p IS NULL THEN NULL
    WHEN length(regexp_replace(p, '\D', '', 'g')) IN (10, 11) THEN '55' || regexp_replace(p, '\D', '', 'g')
    ELSE regexp_replace(p, '\D', '', 'g')
  END
$$;

-- Compara pelos 8 últimos dígitos: o WhatsApp às vezes devolve o número sem o 9 extra
CREATE OR REPLACE FUNCTION public.prospeccao_mesmo_fone(a text, b text)
RETURNS boolean LANGUAGE sql IMMUTABLE AS $$
  SELECT right(regexp_replace(coalesce(a, ''), '\D', '', 'g'), 8) = right(regexp_replace(coalesce(b, ''), '\D', '', 'g'), 8)
     AND length(regexp_replace(coalesce(a, ''), '\D', '', 'g')) >= 8
$$;

-- Próximo dia útil às 10h (horário de Brasília), a partir de now() + p_dias
CREATE OR REPLACE FUNCTION public.prospeccao_proximo_dia_util(p_dias integer)
RETURNS timestamptz LANGUAGE plpgsql STABLE AS $$
DECLARE d date := (now() AT TIME ZONE 'America/Sao_Paulo')::date + p_dias;
BEGIN
  WHILE extract(isodow FROM d) > 5 LOOP d := d + 1; END LOOP;
  RETURN (d + time '10:00') AT TIME ZONE 'America/Sao_Paulo';
END $$;

-- Mesma regra da planilha: tempo até 4 pts, qualificou 3, próximo passo 2, follow-up 1
CREATE OR REPLACE FUNCTION public.cliente_oculto_nota(t public.cliente_oculto_testes)
RETURNS numeric LANGUAGE sql IMMUTABLE AS $$
  SELECT (CASE
            WHEN t.tempo_resposta_min IS NULL THEN 0
            WHEN t.tempo_resposta_min <= 5 THEN 4
            WHEN t.tempo_resposta_min <= 30 THEN 3
            WHEN t.tempo_resposta_min <= 120 THEN 2
            WHEN t.tempo_resposta_min <= 480 THEN 1
            ELSE 0 END)
       + CASE WHEN t.qualificou THEN 3 ELSE 0 END
       + CASE WHEN t.ofereceu_proximo_passo THEN 2 ELSE 0 END
       + CASE WHEN t.follow_up THEN 1 ELSE 0 END
$$;

-- 5. Funções chamadas pelo n8n -------------------------------------------------------

-- Fila do cliente oculto: imobiliárias ainda sem teste nessa operação, melhores primeiro
CREATE OR REPLACE FUNCTION public.prospeccao_proximos_testes(p_operacao text, p_limite integer DEFAULT 6)
RETURNS TABLE (imobiliaria_id uuid, nome text, telefone text, imovel_url text, imovel_descricao text)
LANGUAGE sql STABLE AS $$
  SELECT i.id, i.nome,
         public.prospeccao_normaliza_fone(CASE WHEN p_operacao = 'venda' THEN coalesce(i.telefone_venda, i.telefone)
                                               ELSE coalesce(i.telefone_locacao, i.telefone) END),
         CASE WHEN p_operacao = 'venda' THEN i.imovel_venda_url ELSE i.imovel_locacao_url END,
         CASE WHEN p_operacao = 'venda' THEN i.imovel_venda_descricao ELSE i.imovel_locacao_descricao END
  FROM public.prospeccao_imobiliarias i
  WHERE NOT i.opt_out
    AND i.status IN ('A contatar', 'Em teste')
    AND CASE WHEN p_operacao = 'venda' THEN i.imovel_venda_url ELSE i.imovel_locacao_url END IS NOT NULL
    AND CASE WHEN p_operacao = 'venda' THEN coalesce(i.telefone_venda, i.telefone) ELSE coalesce(i.telefone_locacao, i.telefone) END IS NOT NULL
    AND NOT EXISTS (SELECT 1 FROM public.cliente_oculto_testes t WHERE t.imobiliaria_id = i.id AND t.operacao = p_operacao)
  ORDER BY i.rating_interno DESC NULLS LAST, i.meta_ads_ativo DESC NULLS LAST, i.seguidores_instagram DESC NULLS LAST
  LIMIT p_limite
$$;

CREATE OR REPLACE FUNCTION public.cliente_oculto_registrar_envio(
  p_imobiliaria uuid, p_operacao text, p_telefone text, p_imovel_url text, p_mensagem text
) RETURNS uuid LANGUAGE plpgsql AS $$
DECLARE v_id uuid;
BEGIN
  INSERT INTO public.cliente_oculto_testes (imobiliaria_id, operacao, telefone, imovel_url, mensagem, enviado_em)
  VALUES (p_imobiliaria, p_operacao, p_telefone, p_imovel_url, p_mensagem, now())
  ON CONFLICT (imobiliaria_id, operacao) DO NOTHING
  RETURNING id INTO v_id;

  UPDATE public.prospeccao_imobiliarias
     SET status = 'Em teste', etapa_cadencia = 'teste', updated_at = now()
   WHERE id = p_imobiliaria AND status = 'A contatar';

  INSERT INTO public.prospeccao_eventos (imobiliaria_id, tipo, detalhe)
  VALUES (p_imobiliaria, 'teste_enviado', jsonb_build_object('operacao', p_operacao, 'telefone', p_telefone));
  RETURN v_id;
END $$;

-- Número sem WhatsApp: grava o teste como perdido para não tentar de novo
CREATE OR REPLACE FUNCTION public.cliente_oculto_sem_whatsapp(p_imobiliaria uuid, p_operacao text, p_telefone text)
RETURNS void LANGUAGE sql AS $$
  INSERT INTO public.cliente_oculto_testes (imobiliaria_id, operacao, telefone, status)
  VALUES (p_imobiliaria, p_operacao, coalesce(p_telefone, '-'), 'sem_whatsapp')
  ON CONFLICT (imobiliaria_id, operacao) DO NOTHING;
  INSERT INTO public.prospeccao_eventos (imobiliaria_id, tipo, detalhe)
  VALUES (p_imobiliaria, 'sem_whatsapp', jsonb_build_object('operacao', p_operacao, 'telefone', p_telefone));
$$;

-- Mensagem que chegou no chip do "comprador". Devolve o teste e se foi a primeira resposta.
CREATE OR REPLACE FUNCTION public.cliente_oculto_registrar_resposta(p_telefone text, p_texto text, p_recebido_em timestamptz DEFAULT now())
RETURNS jsonb LANGUAGE plpgsql AS $$
DECLARE t public.cliente_oculto_testes;
BEGIN
  SELECT * INTO t FROM public.cliente_oculto_testes
   WHERE public.prospeccao_mesmo_fone(telefone, p_telefone)
     AND status IN ('aguardando', 'respondido')
     AND enviado_em > now() - interval '72 hours'
   ORDER BY enviado_em DESC LIMIT 1;
  IF NOT FOUND THEN RETURN jsonb_build_object('teste_id', NULL); END IF;

  UPDATE public.cliente_oculto_testes SET
    primeira_resposta_em = coalesce(primeira_resposta_em, p_recebido_em),
    -- resposta em menos de 1 minuto costuma ser robô
    resposta_automatica = resposta_automatica OR (primeira_resposta_em IS NULL AND p_recebido_em - enviado_em < interval '1 minute'),
    -- voltou a chamar 20h depois da primeira resposta sem que o "comprador" respondesse: follow-up
    follow_up = follow_up OR (primeira_resposta_em IS NOT NULL AND p_recebido_em - greatest(ultima_mensagem_em, primeira_resposta_em) > interval '20 hours'),
    mensagens_recebidas = mensagens_recebidas + 1,
    ultima_mensagem_em = p_recebido_em,
    transcricao = transcricao || jsonb_build_array(jsonb_build_object('em', p_recebido_em, 'texto', p_texto)),
    status = 'respondido'
  WHERE id = t.id;

  RETURN jsonb_build_object('teste_id', t.id, 'operacao', t.operacao, 'primeira', t.primeira_resposta_em IS NULL,
                            'transcricao', t.transcricao || jsonb_build_array(jsonb_build_object('texto', p_texto)));
END $$;

-- Resultado da classificação feita pelo Claude (só liga flags, nunca desliga)
CREATE OR REPLACE FUNCTION public.cliente_oculto_classificar(p_teste uuid, p_qualificou boolean, p_proximo_passo boolean, p_automatica boolean)
RETURNS void LANGUAGE sql AS $$
  UPDATE public.cliente_oculto_testes SET
    qualificou = qualificou OR coalesce(p_qualificou, false),
    ofereceu_proximo_passo = ofereceu_proximo_passo OR coalesce(p_proximo_passo, false),
    resposta_automatica = resposta_automatica OR coalesce(p_automatica, false)
  WHERE id = p_teste;
$$;

-- Fecha testes com 48h, calcula notas e libera a imobiliária para a cadência (D0 no próximo dia útil)
CREATE OR REPLACE FUNCTION public.cliente_oculto_fechar_testes()
RETURNS integer LANGUAGE plpgsql AS $$
DECLARE n integer;
BEGIN
  UPDATE public.cliente_oculto_testes t SET
    status = CASE WHEN t.primeira_resposta_em IS NULL THEN 'sem_resposta' ELSE 'encerrado' END,
    nota = public.cliente_oculto_nota(t)
  WHERE t.status IN ('aguardando', 'respondido') AND t.enviado_em < now() - interval '48 hours';
  GET DIAGNOSTICS n = ROW_COUNT;

  -- imobiliária em teste sem nenhum teste aberto: consolida
  WITH fechadas AS (
    SELECT i.id,
           max(t.nota) FILTER (WHERE t.operacao = 'venda') AS nv,
           max(t.nota) FILTER (WHERE t.operacao = 'locacao') AS nl,
           avg(t.nota) AS media
    FROM public.prospeccao_imobiliarias i
    JOIN public.cliente_oculto_testes t ON t.imobiliaria_id = i.id
    WHERE i.status = 'Em teste'
    GROUP BY i.id
    HAVING bool_and(t.status IN ('encerrado', 'sem_resposta', 'sem_whatsapp'))
  )
  UPDATE public.prospeccao_imobiliarias i SET
    nota_venda = f.nv, nota_locacao = f.nl, nota_cliente_oculto = round(f.media, 1),
    status = 'Testado', etapa_cadencia = 'D0',
    proxima_acao_em = public.prospeccao_proximo_dia_util(1), updated_at = now()
  FROM fechadas f WHERE i.id = f.id;

  RETURN n;
END $$;

-- Fila da cadência ao decisor, com os números do teste para montar a mensagem
CREATE OR REPLACE FUNCTION public.prospeccao_cadencia_pendente(p_limite integer DEFAULT 10)
RETURNS TABLE (
  imobiliaria_id uuid, nome text, etapa text, decisor text, whatsapp_decisor text, email_decisor text,
  telefone_imobiliaria text, nota numeric, tempo_venda_min integer, tempo_locacao_min integer,
  qualificou boolean, media_geral_min integer, testadas integer, melhor_min integer
) LANGUAGE sql STABLE AS $$
  WITH geral AS (
    SELECT round(avg(tempo_resposta_min))::integer AS media, min(tempo_resposta_min) AS melhor,
           count(DISTINCT imobiliaria_id)::integer AS qtd
    FROM public.cliente_oculto_testes WHERE status IN ('encerrado', 'sem_resposta')
  )
  SELECT i.id, i.nome, i.etapa_cadencia, i.decisor,
         public.prospeccao_normaliza_fone(i.whatsapp_decisor), i.email_decisor, i.telefone,
         i.nota_cliente_oculto,
         (SELECT tempo_resposta_min FROM public.cliente_oculto_testes WHERE imobiliaria_id = i.id AND operacao = 'venda'),
         (SELECT tempo_resposta_min FROM public.cliente_oculto_testes WHERE imobiliaria_id = i.id AND operacao = 'locacao'),
         coalesce((SELECT bool_or(qualificou) FROM public.cliente_oculto_testes WHERE imobiliaria_id = i.id), false),
         g.media, g.qtd, g.melhor
  FROM public.prospeccao_imobiliarias i CROSS JOIN geral g
  WHERE NOT i.opt_out
    AND i.status IN ('Testado', 'Em cadência')
    AND i.etapa_cadencia IN ('D0', 'D2', 'D5', 'D9')
    AND i.proxima_acao_em <= now()
  ORDER BY i.proxima_acao_em
  LIMIT p_limite
$$;

-- Registra o toque feito e agenda o próximo (D0 -> D2 -> D5 -> D9 -> fim)
CREATE OR REPLACE FUNCTION public.prospeccao_avancar_cadencia(p_imobiliaria uuid, p_etapa text, p_canal text, p_mensagem text DEFAULT NULL)
RETURNS void LANGUAGE plpgsql AS $$
BEGIN
  INSERT INTO public.prospeccao_eventos (imobiliaria_id, tipo, detalhe)
  VALUES (p_imobiliaria, 'cadencia_' || p_etapa, jsonb_build_object('canal', p_canal, 'mensagem', p_mensagem));

  UPDATE public.prospeccao_imobiliarias SET
    status = CASE WHEN p_etapa = 'D9' THEN 'Sem resposta' ELSE 'Em cadência' END,
    etapa_cadencia = CASE p_etapa WHEN 'D0' THEN 'D2' WHEN 'D2' THEN 'D5' WHEN 'D5' THEN 'D9' ELSE 'concluida' END,
    proxima_acao_em = CASE p_etapa WHEN 'D0' THEN public.prospeccao_proximo_dia_util(2)
                                   WHEN 'D2' THEN public.prospeccao_proximo_dia_util(3)
                                   WHEN 'D5' THEN public.prospeccao_proximo_dia_util(4) ELSE NULL END,
    ultimo_contato_em = now(), updated_at = now()
  WHERE id = p_imobiliaria AND etapa_cadencia = p_etapa;
END $$;

-- Mensagem que chegou no WhatsApp comercial da OCA: o decisor respondeu (ou pediu para parar)
CREATE OR REPLACE FUNCTION public.prospeccao_decisor_respondeu(p_telefone text, p_texto text)
RETURNS jsonb LANGUAGE plpgsql AS $$
DECLARE i public.prospeccao_imobiliarias; v_opt boolean;
BEGIN
  SELECT * INTO i FROM public.prospeccao_imobiliarias
   WHERE public.prospeccao_mesmo_fone(whatsapp_decisor, p_telefone) LIMIT 1;
  IF NOT FOUND THEN RETURN jsonb_build_object('imobiliaria_id', NULL); END IF;

  v_opt := p_texto ~* '(^|\W)(parar|pare|sair|remover|descadastr|n[aã]o tenho interesse|sem interesse|n[aã]o quero)';
  UPDATE public.prospeccao_imobiliarias SET
    status = CASE WHEN v_opt THEN 'Não contatar' ELSE 'Respondeu' END,
    opt_out = opt_out OR v_opt,
    etapa_cadencia = 'pausada', proxima_acao_em = NULL, updated_at = now()
  WHERE id = i.id;

  INSERT INTO public.prospeccao_eventos (imobiliaria_id, tipo, detalhe)
  VALUES (i.id, CASE WHEN v_opt THEN 'opt_out' ELSE 'decisor_respondeu' END, jsonb_build_object('texto', p_texto));

  RETURN jsonb_build_object('imobiliaria_id', i.id, 'nome', i.nome, 'decisor', i.decisor, 'opt_out', v_opt, 'texto', p_texto);
END $$;

-- 6. Só a service_role (n8n) executa as funções da automação ----------------------------
DO $$
DECLARE f text;
BEGIN
  FOREACH f IN ARRAY ARRAY[
    'prospeccao_proximos_testes(text, integer)',
    'cliente_oculto_registrar_envio(uuid, text, text, text, text)',
    'cliente_oculto_sem_whatsapp(uuid, text, text)',
    'cliente_oculto_registrar_resposta(text, text, timestamptz)',
    'cliente_oculto_classificar(uuid, boolean, boolean, boolean)',
    'cliente_oculto_fechar_testes()',
    'prospeccao_cadencia_pendente(integer)',
    'prospeccao_avancar_cadencia(uuid, text, text, text)',
    'prospeccao_decisor_respondeu(text, text)'
  ] LOOP
    EXECUTE format('REVOKE EXECUTE ON FUNCTION public.%s FROM PUBLIC, anon, authenticated', f);
    EXECUTE format('GRANT EXECUTE ON FUNCTION public.%s TO service_role', f);
  END LOOP;
END $$;
