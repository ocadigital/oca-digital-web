UPDATE public.blog_posts
SET content = replace(
  content,
  '<h2>O que é Blindagem de Processos</h2>',
  '<figure>
      <img src="/images/blog/modelo-maturidade-imobiliaria-infografico.webp" alt="Infográfico com os 5 níveis do Modelo de Maturidade Imobiliária, do artesanal à IA, com o gargalo de cada passagem (centralizar os dados, especializar e treinar, decidir por dados e automatizar com IA) e os 3 pilares da Blindagem de Processos" width="1200" height="1800" loading="lazy" decoding="async" />
      <figcaption>Os 5 níveis do Modelo de Maturidade Imobiliária, com o gargalo de cada passagem e os 3 pilares da Blindagem de Processos.</figcaption>
    </figure>

    <h2>O que é Blindagem de Processos</h2>'
)
WHERE slug = 'blindagem-de-processos-imobiliaria-guia-completo'
  AND content NOT LIKE '%modelo-maturidade-imobiliaria-infografico.webp%';
