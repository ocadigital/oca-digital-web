import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  image: string | null;
  created_at: string;
  author: string;
  category: string;
  tags: string[];
  read_time: string | null;
}

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLatestPosts();
  }, []);

  const fetchLatestPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('id, title, slug, excerpt, image, created_at, author, category, tags, read_time')
        .eq('published', true)
        .order('created_at', { ascending: false })
        .limit(2);

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
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
      <section id="blog" className="py-20 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-muted-foreground">Carregando posts...</p>
          </div>
        </div>
      </section>
    );
  }

  if (posts.length === 0) {
    return (
      <section id="blog" className="py-20 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Blog OCA Digital
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Conteúdos exclusivos sobre marketing imobiliário, estratégias de vendas e tendências do mercado
            </p>
          </div>
          <div className="text-center">
            <p className="text-muted-foreground mb-4">Nenhum post publicado ainda.</p>
          </div>
        </div>
      </section>
    );
  }
  return (
    <section id="blog" className="py-20 bg-secondary section-separator">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Blog OCA Digital
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Conteúdos exclusivos sobre marketing imobiliário, estratégias de vendas e tendências do mercado
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {posts.map((post) => (
            <Card key={post.id} className="overflow-hidden card-elevated hover:-translate-y-1 hover:border-primary/40">
              <div className="aspect-video bg-muted relative overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                    {post.category}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center text-sm text-muted-foreground mb-3">
                  <span>{formatDate(post.created_at)}</span>
                  <span className="mx-2">•</span>
                  <span>{post.read_time || '5 min'} de leitura</span>
                </div>
                
                <h3 className="text-xl font-bold text-foreground mb-3 line-clamp-2">
                  {post.title}
                </h3>
                
                <p className="text-muted-foreground mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                
                <Link to={`/blog/${post.slug}`}>
                  <Button variant="outline">
                    Ler Mais
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Link to="/blog">
            <Button 
              size="lg" 
              className="font-semibold"
            >
              Ver Todos os Posts
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Blog;
