-- Create table for ebook downloads
CREATE TABLE IF NOT EXISTS public.ebook_downloads (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email varchar NOT NULL,
  whatsapp varchar NOT NULL,
  priority varchar NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.ebook_downloads ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public inserts
CREATE POLICY "Allow public ebook downloads"
  ON public.ebook_downloads
  FOR INSERT
  WITH CHECK (true);

-- Create policy for admins to view
CREATE POLICY "Only admins can read ebook downloads"
  ON public.ebook_downloads
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Create index for better query performance
CREATE INDEX idx_ebook_downloads_email ON public.ebook_downloads(email);
CREATE INDEX idx_ebook_downloads_created_at ON public.ebook_downloads(created_at DESC);