UPDATE public.blog_posts
SET content = replace(
  content,
  '<p>Em qual nível está a sua imobiliária, e qual é o gargalo que impede a passagem para o próximo? Se quiser ajuda para responder, <a href="/#contato">fale com a gente</a>.</p>',
  '<p>Em qual nível está a sua imobiliária, e qual é o gargalo que impede a passagem para o próximo? <a href="/teste-maturidade">Faça o Teste de Maturidade Imobiliária</a>, com 10 perguntas e resultado sem cadastro, ou <a href="/#contato">fale com a gente</a>.</p>'
)
WHERE slug = 'blindagem-de-processos-imobiliaria-guia-completo';
