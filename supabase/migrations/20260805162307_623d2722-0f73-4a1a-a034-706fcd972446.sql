-- 1) ebook_downloads: restrict admin read policy to authenticated role only
DROP POLICY IF EXISTS "Only admins can read ebook downloads" ON public.ebook_downloads;
CREATE POLICY "Only admins can read ebook downloads"
ON public.ebook_downloads
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- 2) Replace always-true INSERT policies with validated ones
DROP POLICY IF EXISTS "Allow public ebook downloads" ON public.ebook_downloads;
CREATE POLICY "Allow public ebook downloads"
ON public.ebook_downloads
FOR INSERT
TO anon, authenticated
WITH CHECK (
  email ~* '^[A-Za-z0-9._%%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
  AND length(email) <= 255
  AND length(whatsapp) BETWEEN 8 AND 20
  AND length(priority) BETWEEN 1 AND 100
);

DROP POLICY IF EXISTS "Allow public insert on leads_websiteoca" ON public.leads_websiteoca;
CREATE POLICY "Allow public insert on leads_websiteoca"
ON public.leads_websiteoca
FOR INSERT
TO anon, authenticated
WITH CHECK (
  email IS NOT NULL
  AND email ~* '^[A-Za-z0-9._%%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
  AND length(email) <= 255
  AND (nome IS NULL OR length(nome) <= 150)
  AND (telefone IS NULL OR length(telefone) <= 30)
  AND (tipo_de_empresa IS NULL OR length(tipo_de_empresa) <= 100)
  AND (form IS NULL OR length(form) <= 100)
  AND (comment IS NULL OR length(comment) <= 5000)
);

DROP POLICY IF EXISTS "Allow public newsletter subscription" ON public.newsletter_subscriptions;
CREATE POLICY "Allow public newsletter subscription"
ON public.newsletter_subscriptions
FOR INSERT
TO anon, authenticated
WITH CHECK (
  email ~* '^[A-Za-z0-9._%%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
  AND length(email) <= 255
  AND (source IS NULL OR length(source) <= 100)
);

-- 3) SECURITY DEFINER functions must not be directly callable by API roles
REVOKE ALL ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated;
