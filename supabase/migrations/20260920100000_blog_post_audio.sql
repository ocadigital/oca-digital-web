-- Áudio opcional nos posts do blog: o player só aparece quando audio_url está preenchido.
ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS audio_url text;

-- Bucket público para os arquivos de áudio (até 50 MB por arquivo).
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'blog-audio',
  'blog-audio',
  true,
  52428800,
  ARRAY['audio/mpeg', 'audio/mp3', 'audio/mp4', 'audio/x-m4a', 'audio/aac', 'audio/wav', 'audio/x-wav', 'audio/ogg', 'audio/webm']
)
ON CONFLICT (id) DO UPDATE
SET public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

CREATE POLICY "Anyone can read blog audio"
ON storage.objects
FOR SELECT
USING (bucket_id = 'blog-audio');

CREATE POLICY "Admins and editors can upload blog audio"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'blog-audio'
  AND (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'))
);

CREATE POLICY "Admins and editors can update blog audio"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'blog-audio'
  AND (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'))
);

CREATE POLICY "Admins and editors can delete blog audio"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'blog-audio'
  AND (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'))
);
