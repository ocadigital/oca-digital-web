
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const Blog = () => {
  const posts = [
    {
      title: "Como Gerar Mais Leads Qualificados para sua Imobiliária em 2024",
      excerpt: "Descubra as estratégias mais eficazes para atrair clientes que realmente querem comprar ou vender imóveis. Aprenda sobre SEO, campanhas pagas e automação de marketing.",
      image: "/lovable-uploads/26b5f8ef-bdb2-46e5-95ca-bce53bcf3dca.png",
      date: "15 de Janeiro, 2024",
      category: "Marketing Digital",
      readTime: "8 min"
    },
    {
      title: "O Guia Completo do CRM Imobiliário: Como Organizar seus Leads",
      excerpt: "Entenda como implementar um sistema de CRM eficiente que vai revolucionar seu atendimento e aumentar suas vendas. Dicas práticas e ferramentas recomendadas.",
      image: "/lovable-uploads/59b9e7e2-b0cd-4eba-9ab0-4502658f48db.png",
      date: "08 de Janeiro, 2024",
      category: "Gestão de Leads",
      readTime: "12 min"
    }
  ];

  const handleEmBreve = () => {
    alert('Em breve');
  };

  return (
    <section id="blog" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Blog OCA Digital
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Conteúdos exclusivos sobre marketing imobiliário, estratégias de vendas e tendências do mercado
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {posts.map((post, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow bg-white border-gray-200">
              <div className="aspect-video bg-gray-200 relative overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {post.category}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <span>{post.date}</span>
                  <span className="mx-2">•</span>
                  <span>{post.readTime} de leitura</span>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                  {post.title}
                </h3>
                
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                
                <Button variant="outline" className="text-blue-600 border-blue-600 hover:bg-blue-50">
                  Ler Mais
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button 
            size="lg" 
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
            onClick={handleEmBreve}
          >
            Ver Todos os Posts
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Blog;
