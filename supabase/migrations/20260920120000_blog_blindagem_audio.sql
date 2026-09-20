-- Narração em áudio (voz sintética, pt-BR) do post de Blindagem de Processos. Arquivo no bucket blog-audio.
UPDATE public.blog_posts
SET audio_url = 'https://ujhyhsplcdppmutsvmrv.supabase.co/storage/v1/object/public/blog-audio/blindagem-de-processos-imobiliaria-guia-completo-v1.mp3'
WHERE slug = 'blindagem-de-processos-imobiliaria-guia-completo';
