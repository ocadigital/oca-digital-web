-- Prospecção do Teste A (Cliente Oculto): imobiliárias-alvo com dados de site, estoque e Instagram.
-- Tabela fechada (RLS só para admin), igual às demais tabelas internas do site.

CREATE TABLE IF NOT EXISTS public.prospeccao_imobiliarias (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  nome text NOT NULL UNIQUE,
  regiao text NOT NULL CHECK (regiao IN ('Sul', 'Centro', 'Norte', 'Lagoa')),
  bairro text,
  telefone text,
  site text,
  instagram text,
  seguidores_instagram integer,
  google_nota numeric(2,1),
  google_avaliacoes integer,
  meta_ads_ativo boolean,
  plataforma_site text,
  estoque_venda integer,
  estoque_locacao integer,
  estoque_total integer GENERATED ALWAYS AS (coalesce(estoque_venda, 0) + coalesce(estoque_locacao, 0)) STORED,
  imovel_venda_url text,
  imovel_venda_descricao text,
  imovel_locacao_url text,
  imovel_locacao_descricao text,
  ex_cliente boolean NOT NULL DEFAULT false,
  decisor text,
  whatsapp_decisor text,
  num_corretores integer,
  rating_interno numeric(4,1),
  status text NOT NULL DEFAULT 'A contatar',
  observacoes text,
  coletado_em date NOT NULL DEFAULT current_date
);

ALTER TABLE public.prospeccao_imobiliarias ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage prospeccao_imobiliarias"
  ON public.prospeccao_imobiliarias
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

INSERT INTO public.prospeccao_imobiliarias (nome, regiao, bairro, telefone, site, instagram, seguidores_instagram, google_nota, google_avaliacoes, meta_ads_ativo, plataforma_site, estoque_venda, estoque_locacao, imovel_venda_url, imovel_venda_descricao, imovel_locacao_url, imovel_locacao_descricao, ex_cliente, observacoes, coletado_em) VALUES
  ('Santa Ilha Imóveis', 'Sul', 'Campeche', '(48) 3206-4700', 'https://santailha.com.br', 'santailha', 19800, 4.6, 1226, false, 'Leadlink (+ Superlógica na locação)', 1494, 133, 'https://santailha.com.br/imovel/apartamento-a-venda-com-67m-no-bairro-portal-do-ribeirao-em-florianopolis-64059/', 'Apartamento 2q, 67 m², Portal do Ribeirão, R$ 775.000', 'https://santailha.com.br/imovel/apartamento-para-alugar-com-67m-no-bairro-campeche-em-florianopolis-64720/', 'Apartamento 2q, 67 m², Campeche, R$ 4.500/mês', true, 'Ex-cliente. Abordagem de reativação', '2026-10-24'),
  ('Buzz Imobiliária', 'Sul', 'Campeche/Rio Tavares', NULL, 'https://www.imobiliariabuzz.com.br', 'buzzfloripa', 33000, NULL, NULL, true, 'Leadlink', 1763, 83, 'https://www.imobiliariabuzz.com.br/imovel/17417/cobertura-a-venda-com-125m-no-bairro-campeche-em-florianopolis_florianopolis/venda/', 'Cobertura 2q, 125 m², Campeche, R$ 2.300.000', 'https://www.imobiliariabuzz.com.br/imovel/16622/casa-em-condominio-para-comprar-ou-alugar-com-431m-no-bairro-lagoa-da-conceicao-em-florianopolis_florianopolis/venda-e-aluguel/', 'Casa em condomínio 4q, 431 m², Lagoa, R$ 28.000/mês', true, 'Ex-cliente (Funil Intel). Abordagem de reativação', '2026-10-24'),
  ('IMOB Campeche', 'Sul', 'Campeche', '(48) 99193-8505', 'https://imobcampeche.com.br', 'imobcampeche', 2288, 4.8, 48, false, 'Loft (ex-Vista)', NULL, NULL, 'https://imobcampeche.com.br/imovel/casa-tapera-da-base-florianopolis-sc-3-quartos-280m2-1506', 'Casa 3q, 280 m², Tapera, R$ 998.000', NULL, NULL, true, 'Ex-cliente. Site só mostra venda em destaque', '2026-10-24'),
  ('Feelin Imóveis', 'Sul', 'Campeche', '(48) 98836-5286', 'https://feelinimoveis.com.br', 'feelinimoveis', 5982, 4.4, 222, false, 'Imobisoft', 1332, 25, 'https://feelinimoveis.com.br/imovel/apartamento-3-suites-vaga-de-garagem-dupla-105-52m-valence-residence-id-2255/', 'Valence Residence, 3 suítes, Porto Belo, R$ 1.753.560 (destaque da home é fora de Floripa)', 'https://feelinimoveis.com.br/imovel/apartamento-2-quartos-campeche-id-2506/', 'Apartamento 2q, 65 m², Campeche, R$ 2.800/mês', false, NULL, '2026-10-24'),
  ('Habiflex Imóveis', 'Sul', 'Campeche', '(48) 99114-4424', 'https://www.habiflex.com.br', 'habiflex', 13000, 4.8, 524, true, 'Keyspot', 619, NULL, 'https://www.habiflex.com.br/imovel/casa-a-venda-3-quartos-1-suite-2-banheiros-2-vagas-rio-tavares-florianopolis-sc-cod-18043', 'Casa 3q (1 suíte), Rio Tavares', NULL, NULL, false, 'Não achei página de locação', '2026-10-24'),
  ('San Remo Imóveis', 'Sul', 'Rio Tavares', '(48) 3244-3344', 'https://www.sanremoimoveis.com.br', 'sanremoimoveis', 9168, 4.8, 279, true, 'Inforce', 347, 288, 'https://www.sanremoimoveis.com.br/imovel/venda+apartamento+2-quartos+balneario+florianopolis+sc+88m2+rs650000,00/6180', 'Apartamento 2q, 88 m², Balneário, R$ 650.000', 'https://www.sanremoimoveis.com.br/imovel/aluguel+apartamento+2-quartos+capoeiras+florianopolis+sc+76m2+rs3600,00/6238', 'Apartamento 2q, 76 m², Capoeiras, R$ 3.600/mês', false, NULL, '2026-10-24'),
  ('Living Floripa Imobiliária', 'Sul', 'Campeche', '(48) 99154-8263', 'https://livingfloripa.com.br', 'livingfloripaimobiliaria', 3327, 5.0, 118, false, 'Loft (ex-Vista)', NULL, NULL, 'https://livingfloripa.com.br/imovel/casa-ribeirao-da-ilha-florianopolis-sc-4-quartos-200.96m2-1397', 'Casa 4q, 200 m², Ribeirão da Ilha, R$ 2.150.000', NULL, NULL, false, 'Foco em venda', '2026-10-24'),
  ('Açoriana Imóveis', 'Sul', 'Rio Tavares', '(48) 3206-5361', 'https://www.acorianaimoveis.com.br', 'acorianaimoveis', 1350, 4.9, 98, false, 'Jetimob', 258, 68, 'https://www.acorianaimoveis.com.br/imovel/casa-com-3-quartos-a-venda-e-2-vagas-bairro-rio-tavares-em-florianopolis/86030', 'Casa 3q, 154 m², Rio Tavares, R$ 1.675.000', 'https://www.acorianaimoveis.com.br/imovel/casa-com-3-quartos-para-alugar-e-2-vagas-bairro-lagoa-da-conceicao-em-florianopolis/36391', 'Casa 3q, 170 m², Lagoa, R$ 11.000/mês', false, NULL, '2026-10-24'),
  ('On''Haus Floripa', 'Sul', 'Rio Tavares', '(48) 99173-2226', 'https://onhausimob.com.br', 'onhausimob', 4334, 4.9, 130, false, 'Vista/Loft (painel SuperAdmin)', NULL, NULL, 'https://onhausimob.com.br/imoveis?negocio=comprar', 'Cód. 2940, apartamento 2 suítes, 93 m², Agronômica, R$ 2.290.000', 'https://onhausimob.com.br/imoveis', 'Cód. 3046, studio 45 m², Campeche, R$ 4.300/mês', false, 'Imóveis citados pelo código (sem link direto)', '2026-10-24'),
  ('House Floripa Imóveis', 'Sul', 'Campeche', NULL, NULL, 'housefloripaimoveis', 4748, NULL, NULL, true, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, 'Achada só pela Meta. Site e Instagram a confirmar', '2026-10-24'),
  ('RK Boutique Imóveis', 'Sul', 'Campeche', '(48) 98855-4636', 'https://www.rkboutiqueimoveis.com.br', 'imobiliariaboutique', 4984, 5.0, 577, false, 'Universal Software', NULL, NULL, 'https://www.rkboutiqueimoveis.com.br/imovel/apartamento-a-venda-3-quartos-1-suite-2-vagas-morro-das-pedras-florianopolis-sc/3866', 'Apartamento 3q, 114 m², Morro das Pedras, R$ 1.595.000', 'https://www.rkboutiqueimoveis.com.br/imovel/casa-nova-e-mobiliada-para-locacao-no-campeche-400-m-da-praia-vista-para-a-montanha/3869', 'Casa mobiliada, 195 m², Campeche, R$ 12.000/mês', false, 'Corrigido de RTK', '2026-10-24'),
  ('Quadra Imobiliária', 'Centro', 'Itacorubi', NULL, 'https://www.quadraimobiliaria.com.br', 'quadraimobiliaria', 2853, NULL, NULL, true, 'Kenlo', 383, 23, 'https://www.quadraimobiliaria.com.br/imovel/sala-florianopolis-26-m/SA0141-QUB?from=sale', 'Sala 26 m², Trindade, R$ 195.000', 'https://www.quadraimobiliaria.com.br/imovel/apartamento-palhoca-2-quartos-51-m/AP2742-QUB?from=rent', 'Apartamento 2q, 51 m², Palhoça, R$ 1.900/mês', false, NULL, '2026-10-24'),
  ('Dalton Andrade Imóveis', 'Centro', 'Trindade/Agronômica', '(48) 3029-5000', 'https://daltonandrade.com.br', 'daltonandradei', 7495, NULL, NULL, true, 'RocketImob', 3317, 124, 'https://daltonandrade.com.br/imovel/93006/apartamento-2-quartos-centro-florianopolis/', 'Apartamento 2q, Centro', 'https://daltonandrade.com.br/imovel/8834/casa-carianos-florianopolis/', 'Casa, Carianos (exclusivo)', false, 'WhatsApp de venda e de locação são números diferentes', '2026-10-24'),
  ('Maurente Goulart Assessoria', 'Centro', 'Coqueiros', NULL, NULL, NULL, NULL, NULL, NULL, true, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, 'Achada só pela Meta. Site e Instagram não encontrados', '2026-10-24'),
  ('Regente Imóveis', 'Centro', 'Trindade', '(48) 3233-1919', 'https://regenteimoveis.com.br', 'regenteimoveis', 4913, 4.3, 414, true, 'WordPress (próprio)', 588, 172, 'https://regenteimoveis.com.br/imovel/84773/casa-em-condominio-a-venda-no-bairro-saco-grande-em-florianopolis-2/', 'Casa em condomínio 3q, 316 m², Saco Grande, R$ 2.800.000', 'https://regenteimoveis.com.br/imovel/87509/excelente-apartamento-de-3-dormitorios-para-locacao-no-bairro-carvoeira-3/', 'Apartamento 3q, 117 m², Carvoeira', false, NULL, '2026-10-24'),
  ('Gralha Imóveis', 'Centro', 'Centro/Trindade', '(48) 3028-8383', 'https://www.gralhaimoveis.com.br', 'gralhaimoveissc', 19000, 4.2, 342, true, 'A confirmar', NULL, NULL, NULL, NULL, NULL, NULL, false, 'Locação em site separado (gralhaalugueis.com.br). Pode ser grande demais para o ICP', '2026-10-24'),
  ('Giacomelli Imóveis', 'Centro', 'Centro', '(48) 3212-6000', 'https://www.giacomelli.com.br', 'giacomelliimoveis', 7453, 4.4, 839, false, 'Próprio', NULL, NULL, NULL, NULL, 'https://www.giacomelli.com.br/imovel/aluguel-comercial-loja-santa-monica-florianopolis-10241', 'Loja 45 m², Santa Mônica, R$ 3.480/mês', false, 'Home focada em locação', '2026-10-24'),
  ('Adriano Imóveis', 'Centro', 'Centro', '(48) 3244-8551', 'https://www.adrianoimoveis.com.br', 'adrianoimoveiss', 5287, 4.6, 1481, false, 'Kenlo', 116, 198, 'https://www.adrianoimoveis.com.br/imovel/apartamento-florianopolis-2-quartos-63-m/AP1445-ADU9?from=sale', 'Apartamento 2q, 63 m², Capoeiras, R$ 560.000', 'https://www.adrianoimoveis.com.br/imovel/apartamento-florianopolis-3-quartos-120-m/AP0369-ADU9?from=rent', 'Apartamento 3q, 120 m², Capoeiras (exclusivo)', false, NULL, '2026-10-24'),
  ('Kabral Imóveis', 'Centro', 'Centro', '(48) 3224-6575', 'https://www.kabral.com.br', 'kabralimoveis', 11000, 4.2, 306, false, 'WordPress (próprio)', NULL, NULL, 'https://kabral.com.br/imovel/apartamento-para-venda-no-bairro-santinho-de-florianopolis-ref-ka9128462/', 'Apartamento 2q, 65 m², Santinho, R$ 627.000', 'https://kabral.com.br/imovel/lote-para-locacao-no-bairro-de-palhoca-ref-7376/', 'Lote 768 m², Palhoça, R$ 15.000/mês', false, 'WhatsApp de venda e de locação são números diferentes', '2026-10-24'),
  ('Duda Imóveis', 'Centro', 'Trindade', '(48) 3953-8888', 'https://www.dudaimoveis.com.br', 'dudaimoveisoficial', 21000, 4.4, 442, false, 'Cayman', NULL, NULL, NULL, NULL, NULL, NULL, false, NULL, '2026-10-24'),
  ('Terranoble', 'Centro', 'Centro', '(48) 99612-9612', 'https://terranoble.com.br', 'terranobleimoveis', 893, 5.0, 41, false, 'Loft (ex-Vista)', NULL, NULL, 'https://terranoble.com.br/imovel/casa-em-condominio-rio-grande-palhoca-sc-3-quartos-136m2-184', 'Casa em condomínio 3q, 136 m², Palhoça, R$ 450.000', 'https://terranoble.com.br/imovel/apartamento-centro-florianopolis-sc-2-quartos-60m2-262', 'Apartamento 2q, 60 m², Beira-Mar, R$ 4.250/mês', false, NULL, '2026-10-24'),
  ('Intercon Imóveis', 'Norte', 'Canasvieiras', NULL, 'https://www.interconimoveis.com.br', 'interconimoveis', 5522, NULL, NULL, true, 'Próprio', NULL, NULL, NULL, NULL, NULL, NULL, false, 'Foco em lançamentos e investidor', '2026-10-24'),
  ('Imobiliária Metta', 'Norte', 'Canasvieiras/Jurerê', NULL, 'https://mettaimobiliaria.com.br', 'mettaimobiliaria', 2951, NULL, NULL, true, 'Praedium', NULL, NULL, 'https://mettaimobiliaria.com.br/imovel/casa-a-venda-4-quartos-joao-paulo-florianopolis-sc-357m2-id-4026', 'Casa 4q, 357 m², João Paulo, R$ 4.200.000', NULL, NULL, false, NULL, '2026-10-24'),
  ('JJ Imobiliária', 'Norte', 'Ingleses', '(48) 99842-0500', 'https://www.imobiliariajj.com.br', 'jjimobiliariaingleses', 6343, 4.7, 1476, false, 'CasaSoft', NULL, NULL, NULL, NULL, NULL, NULL, false, NULL, '2026-10-24'),
  ('Imobiliária Open', 'Norte', 'Canasvieiras', '(48) 99812-0080', 'https://www.imobiliariaopen.com.br', 'imobiliariaopencanas', 1068, 4.8, 188, false, 'Kenlo', 129, 10, 'https://www.imobiliariaopen.com.br/imovel/apartamento-florianopolis-1-quarto-33-m/AP0638-MI5?from=sale', 'Apartamento 1q, 33 m², Ponta das Canas, R$ 365.000', 'https://www.imobiliariaopen.com.br/imovel/cobertura-florianopolis-2-quartos-90-m/CO0045-MI5?from=rent', 'Cobertura 2q, 90 m², Canasvieiras, sob consulta', false, NULL, '2026-10-24'),
  ('Imobiliária Steinhaus', 'Norte', 'Jurerê', '(48) 3282-0002', 'https://www.steinhaus.com.br', 'imobiliariasteinhaus', 2135, 4.7, 67, false, 'Atoda Sistemas', NULL, NULL, 'https://www.steinhaus.com.br/ImovelSelecionado.aspx?id=60375&fin=1', 'Apartamento 2q, 65 m², Ingleses, R$ 1.150.000', NULL, NULL, false, 'Também trabalha com temporada', '2026-10-24'),
  ('Nativo Imóveis', 'Lagoa', 'Rio Vermelho', '(48) 3233-0387', 'https://nativoterrenos.com.br', 'imobiliarianativoimoveis', 11000, 4.9, 503, true, 'apresenta.me', 285, 12, NULL, NULL, 'https://nativoterrenos.com.br/imoveis/aluguel', 'Cód. 1793, casa com suíte, São João do Rio Vermelho, R$ 3.300/mês', false, 'Foco em terrenos', '2026-10-24'),
  ('Silvio Cordeiro Imóveis', 'Lagoa', 'Lagoa da Conceição', '(48) 99920-4000', 'https://silviocordeiroimoveis.com.br', 'silviocordeiroimoveis', 1665, 4.6, 55, true, 'Loft (ex-Vista)', NULL, NULL, 'https://silviocordeiroimoveis.com.br/imovel/casa-lagoa-da-conceicao-florianopolis-sc-3-quartos-235m2-699', 'Casa 3q, 235 m², Lagoa, R$ 2.890.000', 'https://silviocordeiroimoveis.com.br/imovel/apartamento-lagoa-da-conceicao-florianopolis-sc-1-quartos-800', 'Apartamento 1q, Centrinho da Lagoa, R$ 4.100/mês', false, NULL, '2026-10-24'),
  ('Rodrigo Imóveis', 'Lagoa', 'Lagoa da Conceição', NULL, NULL, NULL, NULL, NULL, NULL, true, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, 'rodrigoimoveis.com.br é outra empresa (MG). Site a confirmar', '2026-10-24'),
  ('Garapuvu Imóveis Especiais', 'Lagoa', 'Lagoa da Conceição', '(48) 4009-3339', 'https://www.garapuvu.com.br', 'garapuvu', 1785, 5.0, 8, true, 'Leadlink', NULL, NULL, 'https://www.garapuvu.com.br/imovel/977/casa-de-condominio-com-1018m2-4-dormitorios-no-bairro-cacupe-em-florianopolis-para-comprar/venda/', 'Casa em condomínio 4 suítes, 1.018 m², Cacupé, R$ 14.300.000', NULL, NULL, false, 'Alto padrão', '2026-10-24'),
  ('Casamare Imóveis', 'Lagoa', 'Lagoa/Praia Mole', NULL, 'https://casamareimoveis.com.br', 'casamareimoveis', 2413, NULL, NULL, true, 'Loft (ex-Vista)', NULL, NULL, 'https://casamareimoveis.com.br/imovel/casa-em-condominio-cacupe-florianopolis-sc-2-quartos-185m2-MAF5666', 'Casa em condomínio 2q, 185 m², Cacupé, R$ 2.600.000', NULL, NULL, false, NULL, '2026-10-24')
ON CONFLICT (nome) DO NOTHING;
