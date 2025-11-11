import { Link, useNavigate, useLocation } from "react-router-dom";
import { Home, BookOpen, Mail, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const NotFound = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navigateToSection = (sectionId: string) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/30 py-12 px-4">
      <Card className="card-elevated max-w-2xl w-full p-8 md:p-12 text-center">
        <div className="mb-8">
          <h1 className="text-8xl md:text-9xl font-bold text-primary mb-4">404</h1>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            Página não encontrada
          </h2>
          <p className="text-muted-foreground text-lg">
            Desculpe, a página que você está procurando não existe ou foi movida.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <Link to="/" className="group">
            <Button variant="default" size="lg" className="w-full gap-2">
              <Home className="w-5 h-5" />
              Página Inicial
            </Button>
          </Link>
          
          <Link to="/blog" className="group">
            <Button variant="outline" size="lg" className="w-full gap-2">
              <BookOpen className="w-5 h-5" />
              Blog
            </Button>
          </Link>
          
          <Button 
            variant="outline" 
            size="lg" 
            className="w-full gap-2"
            onClick={() => navigateToSection('servicos')}
          >
            <Search className="w-5 h-5" />
            Serviços
          </Button>
          
          <Button 
            variant="outline" 
            size="lg" 
            className="w-full gap-2"
            onClick={() => navigateToSection('contato')}
          >
            <Mail className="w-5 h-5" />
            Contato
          </Button>
        </div>

        <p className="text-sm text-muted-foreground">
          Precisa de ajuda? Entre em{" "}
          <button 
            onClick={() => navigateToSection('contato')}
            className="text-primary hover:underline font-medium"
          >
            contato conosco
          </button>
        </p>
      </Card>
    </div>
  );
};

export default NotFound;
