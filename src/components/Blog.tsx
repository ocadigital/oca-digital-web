
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { blogPosts } from '@/data/blogPosts';

const Blog = () => {
  const featuredPosts = blogPosts.filter(post => post.featured).slice(0, 2);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {featuredPosts.map((post) => (
            <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
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
                  <span>{formatDate(post.date)}</span>
                  <span className="mx-2">•</span>
                  <span>{post.readTime} de leitura</span>
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
