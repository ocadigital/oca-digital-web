import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import NewsletterForm from '@/components/NewsletterForm';
import { supabase } from '@/integrations/supabase/client';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  image: string | null;
  author: string;
  category: string;
  tags: string[];
  read_time: string;
  created_at: string;
  featured: boolean;
}

const BlogIndex = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const postsPerPage = 6;

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setPosts(data || []);
      
      // Extract unique categories and tags
      const uniqueCategories = [...new Set(data?.map(post => post.category) || [])];
      const allTags = data?.flatMap(post => post.tags) || [];
      const uniqueTags = [...new Set(allTags)];
      
      setCategories(uniqueCategories);
      setTags(uniqueTags);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter posts
  let filteredPosts = posts;
  if (selectedCategory) {
    filteredPosts = filteredPosts.filter(post => post.category === selectedCategory);
  }
  if (selectedTag) {
    filteredPosts = filteredPosts.filter(post => post.tags.includes(selectedTag));
  }

  // Pagination
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const currentPosts = filteredPosts.slice(startIndex, startIndex + postsPerPage);

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
        <div className="text-xl">Carregando posts...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Blog OCA Digital</h1>
          <p className="text-xl text-gray-600">
            Insights e estratégias para alavancar seu negócio imobiliário
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1 space-y-6">
            <Card className="p-6">
              <h3 className="font-bold text-xl mb-4">Categorias</h3>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    setSelectedCategory(null);
                    setCurrentPage(1);
                  }}
                  className={`block w-full text-left px-4 py-2 rounded ${
                    !selectedCategory ? 'bg-primary text-primary-foreground' : 'hover:bg-gray-100'
                  }`}
                >
                  Todas
                </button>
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => {
                      setSelectedCategory(category);
                      setCurrentPage(1);
                    }}
                    className={`block w-full text-left px-4 py-2 rounded ${
                      selectedCategory === category ? 'bg-primary text-primary-foreground' : 'hover:bg-gray-100'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-bold text-xl mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => {
                      setSelectedTag(selectedTag === tag ? null : tag);
                      setCurrentPage(1);
                    }}
                    className={`px-3 py-1 rounded-full text-sm ${
                      selectedTag === tag
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <NewsletterForm />
            </Card>
          </aside>

          <div className="lg:col-span-3">
            {currentPosts.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-gray-600">Nenhum post encontrado.</p>
              </Card>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  {currentPosts.map((post) => (
                    <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      {post.image && (
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-48 object-cover"
                        />
                      )}
                      <div className="p-6">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-semibold text-primary">
                            {post.category}
                          </span>
                          <span className="text-gray-400">•</span>
                          <span className="text-xs text-gray-500">{post.read_time}</span>
                        </div>
                        <h2 className="text-xl font-bold mb-2 text-gray-900">
                          {post.title}
                        </h2>
                        <p className="text-gray-600 mb-4 line-clamp-3">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-500">
                            <span>{post.author}</span>
                            <span className="mx-2">•</span>
                            <span>{formatDate(post.created_at)}</span>
                          </div>
                        </div>
                        <Link to={`/blog/${post.slug}`}>
                          <Button className="w-full mt-4 bg-primary hover:bg-primary/90 text-primary-foreground">
                            Ler mais
                          </Button>
                        </Link>
                      </div>
                    </Card>
                  ))}
                </div>

                {totalPages > 1 && (
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                          className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        />
                      </PaginationItem>
                      
                      {[...Array(totalPages)].map((_, i) => (
                        <PaginationItem key={i + 1}>
                          <PaginationLink
                            onClick={() => setCurrentPage(i + 1)}
                            isActive={currentPage === i + 1}
                            className="cursor-pointer"
                          >
                            {i + 1}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      
                      <PaginationItem>
                        <PaginationNext
                          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                          className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BlogIndex;
