
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleConsultationClick = () => {
    window.open('https://calendly.com/anderson-ocadigital/30min', '_blank');
  };

  return (
    <header className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <img 
              src="/lovable-uploads/b55ec33f-e02c-4406-bee6-48e0cdab621c.png" 
              alt="OCA Digital" 
              className="h-12 w-auto"
            />
          </div>
          
          <nav className="hidden md:flex space-x-8">
            <a href="#inicio" className="text-gray-700 hover:text-blue-600 transition-colors">Início</a>
            <a href="#sobre" className="text-gray-700 hover:text-blue-600 transition-colors">Sobre Nós</a>
            <a href="#servicos" className="text-gray-700 hover:text-blue-600 transition-colors">Serviços</a>
            <a href="#produtos" className="text-gray-700 hover:text-blue-600 transition-colors">Produtos</a>
            <a href="#blog" className="text-gray-700 hover:text-blue-600 transition-colors">Blog</a>
            <a href="#faq" className="text-gray-700 hover:text-blue-600 transition-colors">FAQ</a>
            <a href="#contato" className="text-gray-700 hover:text-blue-600 transition-colors">Contato</a>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <Button 
              variant="outline" 
              className="text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white"
              onClick={handleConsultationClick}
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
              <a href="#inicio" className="block px-3 py-2 text-gray-700">Início</a>
              <a href="#sobre" className="block px-3 py-2 text-gray-700">Sobre Nós</a>
              <a href="#servicos" className="block px-3 py-2 text-gray-700">Serviços</a>
              <a href="#produtos" className="block px-3 py-2 text-gray-700">Produtos</a>
              <a href="#blog" className="block px-3 py-2 text-gray-700">Blog</a>
              <a href="#faq" className="block px-3 py-2 text-gray-700">FAQ</a>
              <a href="#contato" className="block px-3 py-2 text-gray-700">Contato</a>
              <div className="px-3 py-2">
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  onClick={handleConsultationClick}
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
