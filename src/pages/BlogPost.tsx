import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import ShareButtons from '@/components/blog/ShareButtons';
import TableOfContents from '@/components/blog/TableOfContents';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string | null;
  author: string;
  category: string;
  tags: string[];
  read_time: string;
  created_at: string;
  featured: boolean;
}

const BlogPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetchPost();
    }
  }, [slug]);

  const fetchPost = async () => {
    try {
      const { data: postData, error: postError } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .single();

      if (postError) throw postError;

      setPost(postData);

      // Fetch related posts
      if (postData) {
        const { data: related, error: relatedError } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('published', true)
          .eq('category', postData.category)
          .neq('id', postData.id)
          .limit(3);

        if (relatedError) throw relatedError;
        setRelatedPosts(related || []);
      }
    } catch (error) {
      console.error('Error fetching post:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Carregando post...</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background pt-24">
        <Header />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card className="p-8 text-center">
            <h1 className="text-2xl font-bold mb-4">Post não encontrado</h1>
            <p className="text-muted-foreground mb-6">
              O post que você está procurando não existe ou foi removido.
            </p>
            <Link to="/blog">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Voltar para o Blog
              </Button>
            </Link>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24">
      <Helmet>
        <title>{`${post.title} | OCA Digital`}</title>
        <meta name="description" content={post.excerpt} />
        <link rel="canonical" href={`https://oca-digital-web.lovable.app/blog/${post.slug}`} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://oca-digital-web.lovable.app/blog/${post.slug}`} />
        {post.image && <meta property="og:image" content={post.image} />}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.excerpt} />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: post.title,
            description: post.excerpt,
            image: post.image || undefined,
            author: { '@type': 'Person', name: post.author },
            publisher: { '@type': 'Organization', name: 'OCA Digital' },
            datePublished: post.created_at,
            mainEntityOfPage: `https://oca-digital-web.lovable.app/blog/${post.slug}`,
          })}
        </script>
      </Helmet>
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content */}
          <article className="lg:col-span-8">
            <Breadcrumb className="mb-8">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to="/">Home</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to="/blog">Blog</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="line-clamp-1">{post.title}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

        <header className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm font-semibold text-primary">
              {post.category}
            </span>
            <span className="text-muted-foreground">•</span>
            <span className="text-sm text-muted-foreground">{post.read_time}</span>
          </div>
          
          <h1 className="text-4xl font-bold text-foreground mb-4">
            {post.title}
          </h1>
          
          <div className="flex items-center text-muted-foreground">
            <span>Por {post.author}</span>
            <span className="mx-2">•</span>
            <time>{formatDate(post.created_at)}</time>
          </div>
        </header>

        {post.image && (
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-96 object-cover rounded-lg mb-8"
          />
        )}

        <div 
          className="prose prose-lg max-w-none mb-8"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-muted rounded-full text-sm"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

            <ShareButtons 
              title={post.title} 
              url={window.location.href}
            />

            {relatedPosts.length > 0 && (
              <section className="mt-12 pt-12 border-t">
                <h2 className="text-2xl font-bold mb-6">Posts Relacionados</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedPosts.map((relatedPost) => (
                    <Card
                      key={relatedPost.id}
                      className="overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      {relatedPost.image && (
                        <img
                          src={relatedPost.image}
                          alt={relatedPost.title}
                          className="w-full h-40 object-cover"
                        />
                      )}
                      <div className="p-4">
                        <h3 className="font-bold mb-2 line-clamp-2">
                          {relatedPost.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                          {relatedPost.excerpt}
                        </p>
                        <Link to={`/blog/${relatedPost.slug}`}>
                          <Button variant="outline" size="sm" className="w-full">
                            Ler mais
                          </Button>
                        </Link>
                      </div>
                    </Card>
                  ))}
                </div>
              </section>
            )}

            <section className="mt-12 pt-12 border-t">
              <Card className="p-8 bg-primary/10 border-primary/30">
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-4">
                    Pronto para transformar seu negócio imobiliário?
                  </h3>
                  <p className="text-foreground/90 mb-6">
                    Agende uma consultoria gratuita e descubra como podemos ajudar
                    você a alcançar seus objetivos.
                  </p>
                  <Button
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                    onClick={() => window.open('https://calendly.com/anderson-ocadigital/30min', '_blank')}
                  >
                    Agendar Consultoria
                  </Button>
                </div>
              </Card>
            </section>
          </article>

          {/* Sidebar with Table of Contents */}
          <aside className="hidden lg:block lg:col-span-4">
            <TableOfContents content={post.content} />
          </aside>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BlogPost;
