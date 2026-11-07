-- Citações em IA (ChatGPT, Gemini e Perplexity) segundo o ranking público da Ranqueia.
-- NULL = não apareceu na lista, que só mostra quem teve pelo menos 2 citações no mês.
ALTER TABLE public.prospeccao_imobiliarias
  ADD COLUMN IF NOT EXISTS ia_citacoes integer,
  ADD COLUMN IF NOT EXISTS ia_posicao integer,
  ADD COLUMN IF NOT EXISTS ia_ranking_mes date;

UPDATE public.prospeccao_imobiliarias i
   SET ia_posicao = v.posicao, ia_citacoes = v.citacoes, ia_ranking_mes = '2026-11-01', updated_at = now()
  FROM (VALUES
    ('Santa Ilha Imóveis', 3, 15),
    ('Giacomelli Imóveis', 4, 14),
    ('Dalton Andrade Imóveis', 5, 11),
    ('Buzz Imobiliária', 6, 8),
    ('RK Boutique Imóveis', 9, 4),
    ('Gralha Imóveis', 14, 3),
    ('JJ Imobiliária', 17, 3),
    ('San Remo Imóveis', 21, 2),
    ('Adriano Imóveis', 23, 2),
    ('Imobiliária Metta', 29, 2),
    ('Regente Imóveis', 33, 2)
  ) AS v(nome, posicao, citacoes)
 WHERE i.nome = v.nome;

NOTIFY pgrst, 'reload schema';
