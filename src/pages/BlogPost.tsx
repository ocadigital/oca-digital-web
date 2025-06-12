
import { useParams, Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { blogPosts } from '@/data/blogPosts';
import { ArrowLeft } from 'lucide-react';

const BlogPost = () => {
  const { slug } = useParams();
  const post = blogPosts.find(p => p.slug === slug);

  if (!post) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="pt-24 pb-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Post não encontrado</h1>
              <p className="text-gray-600 mb-8">O post que você está procurando não existe.</p>
              <Link to="/blog">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Voltar ao Blog
                </Button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const relatedPosts = blogPosts
    .filter(p => p.id !== post.id && (p.category === post.category || p.tags.some(tag => post.tags.includes(tag))))
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="pt-24 pb-16">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Link to="/blog" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-8">
            <ArrowLeft size={20} className="mr-2" />
            Voltar ao Blog
          </Link>

          {/* Article Header */}
          <header className="mb-8">
            <div className="mb-4">
              <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                {post.category}
              </span>
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              {post.title}
            </h1>
            
            <div className="flex items-center text-gray-600 mb-6">
              <span>Por {post.author}</span>
              <span className="mx-3">•</span>
              <span>{formatDate(post.date)}</span>
              <span className="mx-3">•</span>
              <span>{post.readTime} de leitura</span>
            </div>

            <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden mb-8">
              <img 
                src={post.image} 
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          </header>

          {/* Article Content */}
          <div 
            className="prose prose-lg max-w-none mb-12"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Tags */}
          <div className="border-t border-gray-200 pt-8 mb-12">
            <h3 className="font-bold text-lg mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <section className="border-t border-gray-200 pt-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Posts Relacionados</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <Card key={relatedPost.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-video bg-gray-200 relative overflow-hidden">
                      <img 
                        src={relatedPost.image} 
                        alt={relatedPost.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="p-4">
                      <div className="text-sm text-gray-500 mb-2">
                        {formatDate(relatedPost.date)}
                      </div>
                      
                      <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">
                        {relatedPost.title}
                      </h3>
                      
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {relatedPost.excerpt}
                      </p>
                      
                      <Link to={`/blog/${relatedPost.slug}`}>
                        <Button variant="outline" size="sm" className="text-blue-600 border-blue-600 hover:bg-blue-50">
                          Ler Mais
                        </Button>
                      </Link>
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          )}
        </article>

        {/* CTA Section */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
          <Card className="p-8 bg-blue-50 border-blue-200 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Gostou do conteúdo?
            </h3>
            <p className="text-gray-700 mb-6">
              Agende uma consultoria gratuita e descubra como podemos ajudar sua imobiliária a crescer
            </p>
            <Button 
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
              onClick={() => window.open('https://calendly.com/anderson-ocadigital/30min', '_blank')}
            >
              Agendar Consultoria Gratuita
            </Button>
          </Card>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default BlogPost;
