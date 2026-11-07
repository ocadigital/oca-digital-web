-- 6 imobiliárias vindas do ranking de IA. Sem imóvel cadastrado, não entram na fila do teste.
ALTER TABLE public.prospeccao_imobiliarias DROP CONSTRAINT IF EXISTS prospeccao_imobiliarias_regiao_check;
ALTER TABLE public.prospeccao_imobiliarias ADD CONSTRAINT prospeccao_imobiliarias_regiao_check
  CHECK (regiao IN ('Sul', 'Centro', 'Norte', 'Lagoa', 'Continente'));

INSERT INTO public.prospeccao_imobiliarias
  (nome, regiao, bairro, telefone, site, instagram, seguidores_instagram, plataforma_site, ia_posicao, ia_citacoes, ia_ranking_mes, observacoes)
VALUES
  ('Set7 Negócios Imobiliários', 'Continente', 'Estreito', '(48) 3500-0777', 'https://set7negociosimobiliarios.com.br', 'set7floripa', 16000, 'Kenlo', 7, 6, '2026-11-01', 'Veio do ranking de IA. Também tem unidades em Biguaçu e Itapema. Falta imóvel do teste'),
  ('OnLiving Imobiliária', 'Centro', 'Trindade/Centro/Campeche', '(48) 3364-1364', 'https://onliving.com.br', 'onlivingimobiliaria', 13000, 'WordPress', 32, 2, '2026-11-01', 'Ex-F1 Cia., que tem mais 2 citações (posição 19) no ranking. Falta imóvel do teste'),
  ('Luiz Althoff Soluções em Imóveis', 'Continente', 'Pedra Branca', '(48) 99132-0425', 'https://luizalthoff.com.br', 'luiz.althoff', 7923, 'RocketImob', 15, 3, '2026-11-01', 'Veio do ranking de IA. Falta imóvel do teste'),
  ('Qualité Imóveis Exclusivos', 'Norte', 'Cacupé', '(48) 99101-1690', 'https://imobiliariaqualite.com.br', 'imobiliariaqualite', 7684, 'RocketImob', 37, 2, '2026-11-01', 'Veio do ranking de IA. Falta imóvel do teste'),
  ('Sonia Brandalise Negócios Imobiliários', 'Norte', 'João Paulo', '(48) 99972-2585', 'https://soniabrandalise.com.br', 'soniabrandaliseimoveis', 4245, NULL, 34, 2, '2026-11-01', 'Médio e alto padrão. Avaliar ICP. Falta imóvel do teste'),
  ('Imobiliária Alicerce', 'Continente', 'Estreito', '(48) 99942-7615', 'https://imobiliariaalicerce.com.br', 'imobiliariaalicerce', 3701, 'Universal Software', 26, 2, '2026-11-01', 'Veio do ranking de IA. Falta imóvel do teste')
ON CONFLICT (nome) DO NOTHING;

UPDATE public.prospeccao_imobiliarias SET telefone = '(48) 3331-0600', updated_at = now()
 WHERE nome = 'Buzz Imobiliária' AND telefone IS NULL;

NOTIFY pgrst, 'reload schema';
