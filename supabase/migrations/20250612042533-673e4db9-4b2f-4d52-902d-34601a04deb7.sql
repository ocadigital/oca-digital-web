
-- Criar tabela para armazenar inscrições da newsletter
CREATE TABLE public.newsletter_subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  subscribed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true,
  source VARCHAR(50) DEFAULT 'blog' -- para identificar de onde veio a inscrição
);

-- Habilitar RLS
ALTER TABLE public.newsletter_subscriptions ENABLE ROW LEVEL SECURITY;

-- Política para permitir inserção pública (formulário de newsletter)
CREATE POLICY "Allow public newsletter subscription" 
  ON public.newsletter_subscriptions 
  FOR INSERT 
  TO anon
  WITH CHECK (true);

-- Política para leitura apenas por usuários autenticados
CREATE POLICY "Allow authenticated read newsletter subscriptions" 
  ON public.newsletter_subscriptions 
  FOR SELECT 
  TO authenticated
  USING (true);

-- Índice para otimizar consultas por email
CREATE INDEX idx_newsletter_email ON public.newsletter_subscriptions(email);
