-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'editor', 'viewer');

-- Create user_roles table
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create blog_posts table
CREATE TABLE public.blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    image TEXT,
    author TEXT NOT NULL,
    category TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    read_time TEXT DEFAULT '5 min',
    featured BOOLEAN DEFAULT FALSE,
    published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    published_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS on blog_posts
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Blog posts policies - anyone can read published posts
CREATE POLICY "Anyone can read published blog posts"
ON public.blog_posts
FOR SELECT
USING (published = true);

-- Only admins and editors can create posts
CREATE POLICY "Admins and editors can create blog posts"
ON public.blog_posts
FOR INSERT
TO authenticated
WITH CHECK (
  public.has_role(auth.uid(), 'admin') OR 
  public.has_role(auth.uid(), 'editor')
);

-- Only admins and editors can update posts
CREATE POLICY "Admins and editors can update blog posts"
ON public.blog_posts
FOR UPDATE
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin') OR 
  public.has_role(auth.uid(), 'editor')
);

-- Only admins can delete posts
CREATE POLICY "Admins can delete blog posts"
ON public.blog_posts
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_blog_posts_updated_at
BEFORE UPDATE ON public.blog_posts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Update leads_websiteoca RLS policy to restrict to admins only
DROP POLICY IF EXISTS "Allow authenticated read on leads_websiteoca" ON public.leads_websiteoca;

CREATE POLICY "Only admins can read leads"
ON public.leads_websiteoca
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Update newsletter_subscriptions RLS policy to restrict to admins only
DROP POLICY IF EXISTS "Allow authenticated read newsletter subscriptions" ON public.newsletter_subscriptions;

CREATE POLICY "Only admins can read newsletter subscriptions"
ON public.newsletter_subscriptions
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));