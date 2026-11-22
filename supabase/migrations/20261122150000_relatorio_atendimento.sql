-- Relatório público do teste de atendimento (/relatorio-atendimento).
-- Os dados só saem pela função relatorio_dados, depois que a pessoa deixa o contato (relatorio_desbloquear).
-- Top 7 com detalhes; as demais só com nome e nota. Testes em que erramos o alvo aparecem como "não comparável".

CREATE TABLE IF NOT EXISTS public.relatorio_atendimento (
  imobiliaria_id uuid PRIMARY KEY REFERENCES public.prospeccao_imobiliarias(id) ON DELETE CASCADE,
  tipo text NOT NULL CHECK (tipo IN ('ia', 'menu', 'auto', 'humano', 'nada')),
  valido boolean NOT NULL DEFAULT true,
  motivo_invalido text,
  destaque text
);

CREATE TABLE IF NOT EXISTS public.relatorio_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  nome text NOT NULL,
  email text NOT NULL,
  telefone text NOT NULL,
  imobiliaria text,
  cargo text,
  utm jsonb,
  referrer text,
  detalhes_pedidos uuid[] NOT NULL DEFAULT '{}'
);

ALTER TABLE public.relatorio_atendimento ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.relatorio_leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read relatorio_atendimento" ON public.relatorio_atendimento FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins read relatorio_leads" ON public.relatorio_leads FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));

-- Leitura de cada conversa (tipo de quem respondeu primeiro e frase de destaque do top 7)
INSERT INTO public.relatorio_atendimento (imobiliaria_id, tipo, valido, motivo_invalido, destaque)
SELECT i.id, v.tipo, v.valido, v.motivo, v.destaque
FROM (VALUES
  ('Açoriana Imóveis', 'ia', true, NULL, 'Respondeu disponibilidade, pet e valor em segundos, perguntou o prazo da mudança e ofereceu a visita.'),
  ('Adriano Imóveis', 'menu', true, NULL, NULL),
  ('Buzz Imobiliária', 'humano', true, NULL, NULL),
  ('Casamare Imóveis', 'ia', false, 'Testada em locação, operação que a imobiliária não atende.', NULL),
  ('Dalton Andrade Imóveis', 'auto', false, 'O número de vendas do site respondeu em nome de outra empresa.', NULL),
  ('Duda Imóveis', 'menu', true, NULL, NULL),
  ('Feelin Imóveis', 'nada', true, NULL, NULL),
  ('Garapuvu Imóveis Especiais', 'auto', true, NULL, NULL),
  ('Giacomelli Imóveis', 'auto', false, 'Testada em venda, operação que a imobiliária não atende.', NULL),
  ('Gralha Imóveis', 'auto', true, NULL, NULL),
  ('Habiflex Imóveis', 'ia', true, NULL, 'Respondeu condomínio e IPTU na hora, perguntou a faixa de preço, sugeriu opções e ofereceu o corretor.'),
  ('House Floripa Imóveis', 'ia', true, NULL, 'Respondeu em segundos já perguntando casa ou apartamento e voltou a chamar sozinha.'),
  ('IMOB Campeche', 'humano', false, 'Testada em locação, operação que a imobiliária não atende.', NULL),
  ('Imobiliária Alicerce', 'humano', true, NULL, NULL),
  ('Imobiliária Metta', 'ia', true, NULL, 'Confirmou o imóvel, descreveu e perguntou a faixa de preço em 1 minuto, e voltou a chamar.'),
  ('Imobiliária Open', 'humano', true, NULL, 'Uma pessoa respondeu em 1 minuto com uma pergunta sobre a necessidade do cliente.'),
  ('Intercon Imóveis', 'nada', true, NULL, NULL),
  ('JJ Imobiliária', 'humano', true, NULL, NULL),
  ('Kabral Imóveis', 'auto', true, NULL, NULL),
  ('Living Floripa Imobiliária', 'humano', false, 'Testada em locação, operação que a imobiliária não atende.', NULL),
  ('Luiz Althoff Soluções em Imóveis', 'humano', true, NULL, NULL),
  ('Maurente Goulart Assessoria', 'humano', true, NULL, NULL),
  ('Nativo Imóveis', 'menu', true, NULL, NULL),
  ('On''Haus Floripa', 'ia', true, NULL, NULL),
  ('OnLiving Imobiliária', 'menu', true, NULL, NULL),
  ('Quadra Imobiliária', 'nada', true, NULL, NULL),
  ('Qualité Imóveis Exclusivos', 'nada', true, NULL, NULL),
  ('RK Boutique Imóveis', 'nada', true, NULL, NULL),
  ('Rodrigo Imóveis', 'humano', true, NULL, NULL),
  ('San Remo Imóveis', 'menu', true, NULL, NULL),
  ('Santa Ilha Imóveis', 'ia', true, NULL, 'Respondeu em 1 minuto, perguntou a faixa de preço e ofereceu um consultor.'),
  ('Set7 Negócios Imobiliários', 'humano', true, NULL, NULL),
  ('Silvio Cordeiro Imóveis', 'auto', true, NULL, NULL),
  ('Sonia Brandalise Negócios Imobiliários', 'auto', true, NULL, 'Uma pessoa respondeu em 20 minutos perguntando o que o cliente busca.'),
  ('Terranoble', 'nada', true, NULL, NULL)
) AS v(nome, tipo, valido, motivo, destaque)
JOIN public.prospeccao_imobiliarias i ON i.nome = v.nome
ON CONFLICT (imobiliaria_id) DO UPDATE SET tipo = excluded.tipo, valido = excluded.valido,
  motivo_invalido = excluded.motivo_invalido, destaque = excluded.destaque;

-- Etapa 1: a pessoa deixa o contato e recebe o id que desbloqueia o relatório
CREATE OR REPLACE FUNCTION public.relatorio_desbloquear(
  p_nome text, p_email text, p_telefone text, p_imobiliaria text DEFAULT NULL, p_cargo text DEFAULT NULL,
  p_utm jsonb DEFAULT NULL, p_referrer text DEFAULT NULL
) RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_id uuid;
BEGIN
  IF length(btrim(coalesce(p_nome, ''))) < 2 OR length(p_nome) > 120 THEN RAISE EXCEPTION 'invalid name'; END IF;
  IF p_email !~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' OR length(p_email) > 200 THEN RAISE EXCEPTION 'invalid email'; END IF;
  IF length(regexp_replace(coalesce(p_telefone, ''), '\D', '', 'g')) < 10 THEN RAISE EXCEPTION 'invalid phone'; END IF;
  IF p_utm IS NOT NULL AND length(p_utm::text) > 4000 THEN p_utm := NULL; END IF;
  INSERT INTO public.relatorio_leads (nome, email, telefone, imobiliaria, cargo, utm, referrer)
  VALUES (btrim(p_nome), lower(btrim(p_email)), left(btrim(p_telefone), 30), left(btrim(p_imobiliaria), 120),
          left(btrim(p_cargo), 60), p_utm, left(p_referrer, 300))
  RETURNING id INTO v_id;
  RETURN v_id;
END $$;

-- Índice de presença digital (indicador secundário, 0 a 100):
-- Instagram 35 + Google 25 + citações em IA 25 + anúncio ativo na Meta 15. Sem dado conta zero.
CREATE OR REPLACE FUNCTION public.relatorio_presenca(i public.prospeccao_imobiliarias)
RETURNS integer LANGUAGE sql IMMUTABLE AS $$
  SELECT round(
      coalesce(least(log(greatest(i.seguidores_instagram, 1)) / log(40000), 1) * 35, 0)
    + coalesce((i.google_nota / 5) * least(log(coalesce(i.google_avaliacoes, 0) + 1) / 3, 1) * 25, 0)
    + coalesce(least(i.ia_citacoes / 15.0, 1) * 25, 0)
    + CASE WHEN i.meta_ads_ativo THEN 15 ELSE 0 END
  )::integer
$$;

-- Etapa 2: os dados do relatório, só para um contato registrado
CREATE OR REPLACE FUNCTION public.relatorio_dados(p_lead uuid)
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE v jsonb;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.relatorio_leads WHERE id = p_lead) THEN RETURN NULL; END IF;
  WITH base AS (
    SELECT i.id, i.nome, i.regiao, i.nota_cliente_oculto AS nota, r.valido, r.motivo_invalido, r.tipo, r.destaque,
           i.seguidores_instagram, i.google_nota, i.google_avaliacoes, i.ia_citacoes, i.meta_ads_ativo,
           public.relatorio_presenca(i) AS presenca, r.contato_nota, r.contato_flutuante, r.contato_whatsapp, r.contato_telefone, r.contato_formulario,
           (SELECT min(t.tempo_resposta_min) FROM public.cliente_oculto_testes t WHERE t.imobiliaria_id = i.id) AS tempo,
           (SELECT bool_or(t.qualificou) FROM public.cliente_oculto_testes t WHERE t.imobiliaria_id = i.id) AS qualificou,
           (SELECT bool_or(t.ofereceu_proximo_passo) FROM public.cliente_oculto_testes t WHERE t.imobiliaria_id = i.id) AS proximo_passo
    FROM public.prospeccao_imobiliarias i JOIN public.relatorio_atendimento r ON r.imobiliaria_id = i.id
  ), ranked AS (
    SELECT b.*, CASE WHEN b.valido THEN rank() OVER (PARTITION BY b.valido ORDER BY b.nota DESC) END AS posicao
    FROM base b
  )
  SELECT jsonb_build_object(
    'atualizado_em', '2026-11-22',
    'imobiliarias', coalesce(jsonb_agg(jsonb_build_object(
        'id', id, 'nome', nome, 'regiao', regiao, 'nota', nota, 'valido', valido, 'motivo_invalido', motivo_invalido,
        'posicao', posicao, 'top', valido AND destaque IS NOT NULL,
        'tipo', CASE WHEN valido AND destaque IS NOT NULL THEN tipo END,
        'tempo_min', CASE WHEN valido AND destaque IS NOT NULL THEN tempo END,
        'qualificou', CASE WHEN valido AND destaque IS NOT NULL THEN qualificou END,
        'proximo_passo', CASE WHEN valido AND destaque IS NOT NULL THEN proximo_passo END,
        'destaque', CASE WHEN valido THEN destaque END,
        'contato_nota', contato_nota, 'contato', jsonb_build_object('flutuante', contato_flutuante, 'whatsapp', contato_whatsapp, 'telefone', contato_telefone, 'formulario', contato_formulario),
        'presenca', presenca, 'seguidores', seguidores_instagram, 'google_nota', google_nota,
        'google_avaliacoes', google_avaliacoes, 'ia_citacoes', ia_citacoes, 'meta_ads', meta_ads_ativo
      ) ORDER BY valido DESC, nota DESC, nome), '[]'::jsonb)
  ) INTO v FROM ranked;
  RETURN v;
END $$;

-- Etapa 3: "sou desta imobiliária". Confere com a imobiliária informada no cadastro e registra o pedido.
CREATE OR REPLACE FUNCTION public.relatorio_pedir_detalhe(p_lead uuid, p_imobiliaria uuid)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE l public.relatorio_leads; i public.prospeccao_imobiliarias; v_ok boolean; v_chave text; v_informada text;
BEGIN
  SELECT * INTO l FROM public.relatorio_leads WHERE id = p_lead;
  SELECT * INTO i FROM public.prospeccao_imobiliarias WHERE id = p_imobiliaria;
  IF l.id IS NULL OR i.id IS NULL THEN RETURN jsonb_build_object('ok', false); END IF;

  -- compara pela primeira palavra significativa do nome (sem acento, sem "imobiliária", "imóveis" etc.)
  v_chave := split_part(btrim(regexp_replace(translate(lower(i.nome), 'áàâãéêíóôõúç''', 'aaaaeeiooouc '),
             '(imobiliaria|imoveis|negocios|imobiliarios|solucoes|em|assessoria|especiais|exclusivos|floripa)', ' ', 'g')), ' ', 1);
  v_informada := translate(lower(coalesce(l.imobiliaria, '')), 'áàâãéêíóôõúç''', 'aaaaeeiooouc ');
  v_ok := length(v_chave) >= 3 AND position(v_chave IN v_informada) > 0;

  UPDATE public.relatorio_leads SET detalhes_pedidos = array_append(detalhes_pedidos, p_imobiliaria)
   WHERE id = p_lead AND NOT p_imobiliaria = ANY(detalhes_pedidos);
  INSERT INTO public.prospeccao_eventos (imobiliaria_id, tipo, detalhe)
  VALUES (i.id, 'relatorio_pedido_detalhe', jsonb_build_object('lead', p_lead, 'confere', v_ok,
          'nome', l.nome, 'telefone', l.telefone, 'imobiliaria_informada', l.imobiliaria, 'cargo', l.cargo));
  RETURN jsonb_build_object('ok', true, 'confere', v_ok, 'imobiliaria', i.nome);
END $$;

REVOKE ALL ON FUNCTION public.relatorio_desbloquear(text, text, text, text, text, jsonb, text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.relatorio_dados(uuid) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.relatorio_pedir_detalhe(uuid, uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.relatorio_desbloquear(text, text, text, text, text, jsonb, text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.relatorio_dados(uuid) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.relatorio_pedir_detalhe(uuid, uuid) TO anon, authenticated;

-- Facilidade de contato no site (avaliado em 2026-11-22, página inicial de cada site):
-- botão flutuante de WhatsApp 4, link direto de WhatsApp 2, telefone clicável 2, formulário de contato 2.
ALTER TABLE public.relatorio_atendimento
  ADD COLUMN IF NOT EXISTS contato_nota smallint,
  ADD COLUMN IF NOT EXISTS contato_flutuante boolean,
  ADD COLUMN IF NOT EXISTS contato_whatsapp boolean,
  ADD COLUMN IF NOT EXISTS contato_telefone boolean,
  ADD COLUMN IF NOT EXISTS contato_formulario boolean;

UPDATE public.relatorio_atendimento r SET contato_nota = v.nota, contato_flutuante = v.f, contato_whatsapp = v.w,
  contato_telefone = v.t, contato_formulario = v.fo
FROM (VALUES
  ('Açoriana Imóveis', 8, true, true, false, true),
  ('Adriano Imóveis', 8, true, true, true, false),
  ('Buzz Imobiliária', 6, true, true, false, false),
  ('Casamare Imóveis', 4, true, false, false, false),
  ('Dalton Andrade Imóveis', 8, true, true, true, false),
  ('Duda Imóveis', 8, true, true, true, false),
  ('Feelin Imóveis', 10, true, true, true, true),
  ('Garapuvu Imóveis Especiais', 8, true, false, true, true),
  ('Giacomelli Imóveis', 6, true, true, false, false),
  ('Gralha Imóveis', 4, false, true, false, true),
  ('Habiflex Imóveis', 8, true, true, true, false),
  ('IMOB Campeche', 4, true, false, false, false),
  ('Imobiliária Alicerce', 8, true, true, true, false),
  ('Imobiliária Metta', 10, true, true, true, true),
  ('Imobiliária Open', 4, false, true, true, false),
  ('Intercon Imóveis', 8, true, true, false, true),
  ('JJ Imobiliária', 8, true, true, true, false),
  ('Kabral Imóveis', 8, true, true, false, true),
  ('Living Floripa Imobiliária', 4, true, false, false, false),
  ('Luiz Althoff Soluções em Imóveis', 6, true, true, false, false),
  ('Nativo Imóveis', 4, false, false, true, true),
  ('On''Haus Floripa', 8, true, true, true, false),
  ('OnLiving Imobiliária', 8, true, true, true, false),
  ('Quadra Imobiliária', 8, true, true, true, false),
  ('Qualité Imóveis Exclusivos', 4, false, false, true, true),
  ('RK Boutique Imóveis', 8, true, true, true, false),
  ('San Remo Imóveis', 10, true, true, true, true),
  ('Santa Ilha Imóveis', 6, true, false, false, true),
  ('Set7 Negócios Imobiliários', 8, true, true, true, false),
  ('Silvio Cordeiro Imóveis', 4, true, false, false, false),
  ('Sonia Brandalise Negócios Imobiliários', 8, true, true, true, false),
  ('Terranoble', 4, true, false, false, false)
) AS v(nome, nota, f, w, t, fo)
JOIN public.prospeccao_imobiliarias i ON i.nome = v.nome
WHERE r.imobiliaria_id = i.id;

NOTIFY pgrst, 'reload schema';
