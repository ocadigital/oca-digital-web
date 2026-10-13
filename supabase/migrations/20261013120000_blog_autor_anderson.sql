-- Todos os posts do blog assinados pelo Anderson (antes havia autores de modelo como "Anderson Santos" e "Maria Silva").
update public.blog_posts
set author = 'Anderson Gonçalves'
where author is distinct from 'Anderson Gonçalves';
