
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleConsultoriaClick = () => {
    window.open('https://calendly.com/anderson-ocadigital/30min', '_blank');
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/">
              <img 
                src="/lovable-uploads/b55ec33f-e02c-4406-bee6-48e0cdab621c.png" 
                alt="OCA Digital" 
                className="h-12 w-auto"
              />
            </Link>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            <button onClick={() => scrollToSection('inicio')} className="text-gray-700 hover:text-blue-600 transition-colors">Início</button>
            <button onClick={() => scrollToSection('sobre')} className="text-gray-700 hover:text-blue-600 transition-colors">Sobre Nós</button>
            <button onClick={() => scrollToSection('servicos')} className="text-gray-700 hover:text-blue-600 transition-colors">Serviços</button>
            <button onClick={() => scrollToSection('produtos')} className="text-gray-700 hover:text-blue-600 transition-colors">Produtos</button>
            <Link to="/blog" className="text-gray-700 hover:text-blue-600 transition-colors">Blog</Link>
            <button onClick={() => scrollToSection('faq')} className="text-gray-700 hover:text-blue-600 transition-colors">FAQ</button>
            <button onClick={() => scrollToSection('contato')} className="text-gray-700 hover:text-blue-600 transition-colors">Contato</button>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <Button 
              variant="outline" 
              className="text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white"
              onClick={handleConsultoriaClick}
            >
              Consultoria Gratuita
            </Button>
          </div>

          <button
            className="md:hidden text-gray-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
              <button onClick={() => scrollToSection('inicio')} className="block px-3 py-2 text-gray-700 w-full text-left">Início</button>
              <button onClick={() => scrollToSection('sobre')} className="block px-3 py-2 text-gray-700 w-full text-left">Sobre Nós</button>
              <button onClick={() => scrollToSection('servicos')} className="block px-3 py-2 text-gray-700 w-full text-left">Serviços</button>
              <button onClick={() => scrollToSection('produtos')} className="block px-3 py-2 text-gray-700 w-full text-left">Produtos</button>
              <Link to="/blog" className="block px-3 py-2 text-gray-700" onClick={() => setIsMenuOpen(false)}>Blog</Link>
              <button onClick={() => scrollToSection('faq')} className="block px-3 py-2 text-gray-700 w-full text-left">FAQ</button>
              <button onClick={() => scrollToSection('contato')} className="block px-3 py-2 text-gray-700 w-full text-left">Contato</button>
              <div className="px-3 py-2">
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  onClick={handleConsultoriaClick}
                >
                  Consultoria Gratuita
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
