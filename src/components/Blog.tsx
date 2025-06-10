
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, ArrowRight } from 'lucide-react';

const Blog = () => {
  const blogPosts = [
    {
      title: "Como Gerar Mais Leads Imobiliários em 2024",
      excerpt: "Estratégias comprovadas para aumentar a captação de leads qualificados no mercado imobiliário.",
      date: "15 Mar 2024",
      category: "Marketing Digital",
      image: "/lovable-uploads/14cd3465-b643-4d56-9e4b-6ea118327a94.png"
    },
    {
      title: "O Poder da Automação no Marketing Imobiliário",
      excerpt: "Descubra como automatizar processos pode revolucionar sua operação e aumentar as vendas.",
      date: "12 Mar 2024",
      category: "Automação",
      image: "/lovable-uploads/18d4131d-a5da-421a-9823-78cd9d9b35fe.png"
    },
    {
      title: "ROI em Marketing Imobiliário: Como Medir Resultados",
      excerpt: "Aprenda a calcular e otimizar o retorno sobre investimento das suas campanhas de marketing.",
      date: "10 Mar 2024",
      category: "Análise",
      image: "/lovable-uploads/26b5f8ef-bdb2-46e5-95ca-bce53bcf3dca.png"
    }
  ];

  const handleComingSoon = () => {
    alert('Em breve');
  };

  return (
    <section id="blog" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Blog & Insights
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Conteúdos exclusivos sobre marketing imobiliário, tendências do mercado e dicas práticas para alavancar seus resultados
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {blogPosts.map((post, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow bg-white border-gray-200">
              <img 
                src={post.image} 
                alt={post.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-blue-600 font-medium">{post.category}</span>
                  <div className="flex items-center text-gray-500 text-sm">
                    <Calendar size={16} className="mr-1" />
                    {post.date}
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">{post.title}</h3>
                <p className="text-gray-600 mb-4">{post.excerpt}</p>
                <Button variant="outline" className="group">
                  Ler mais
                  <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button 
            size="lg" 
            variant="outline" 
            className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
            onClick={handleComingSoon}
          >
            Ver Todos os Posts
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Blog;
