import { Instagram, Linkedin } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const Footer = () => {
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
    <footer className="bg-secondary text-foreground border-t-2 border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <img 
              src="/oca-logo-white.png" 
              alt="OCA Digital" 
              className="h-12 w-auto mb-4"
            />
            <p className="text-muted-foreground mb-4 max-w-md">
              Especialistas em marketing imobiliário que combinam estratégia, dados e automação 
              para transformar sua operação em uma máquina de conversão.
            </p>
            <div className="text-muted-foreground space-y-2">
              <div>📧 contato@ocadigital.com.br</div>
              <div>📱 (48) 99679-0700</div>
              <div>📍 Florianópolis, SC - Atendimento Nacional</div>
            </div>
            <div className="flex items-center space-x-4 mt-4">
              <a
                href="https://www.instagram.com/ocadigital"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram da OCA Digital"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Instagram size={24} aria-hidden="true" />
              </a>
              <a 
                href="https://www.linkedin.com/company/941540/" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="LinkedIn da OCA Digital"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Linkedin size={24} aria-hidden="true" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-bold mb-4 text-foreground">Serviços</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li><button onClick={() => navigateToSection('servicos')} className="hover:text-primary transition-colors">Google Ads e Meta Ads</button></li>
              <li><button onClick={() => navigateToSection('servicos')} className="hover:text-primary transition-colors">SDR - Pré-qualificação</button></li>
              <li><button onClick={() => navigateToSection('servicos')} className="hover:text-primary transition-colors">Automação de Marketing</button></li>
              <li><button onClick={() => navigateToSection('servicos')} className="hover:text-primary transition-colors">Lançamento Imobiliário</button></li>
              <li><button onClick={() => navigateToSection('servicos')} className="hover:text-primary transition-colors">Pacotes Mensais</button></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4 text-foreground">Produtos</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li><button onClick={() => navigateToSection('produtos')} className="hover:text-primary transition-colors">OCA One</button></li>
              <li><button onClick={() => navigateToSection('produtos')} className="hover:text-primary transition-colors">OCA Base</button></li>
              <li><button onClick={() => navigateToSection('produtos')} className="hover:text-primary transition-colors">Curso para Corretores</button></li>
              <li><button onClick={() => navigateToSection('contato')} className="hover:text-primary transition-colors">Consultoria Gratuita</button></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-muted-foreground text-sm">
              © 2024 OCA Digital. Todos os direitos reservados. - 27.010.924/0001-25 ANDERSON MARTINS GONCALVES 22015275800
            </div>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="/politica-de-privacidade" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                Política de Privacidade
              </a>
              <a href="/termos-de-uso" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                Termos de Uso
              </a>
              <a href="/admin/login" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                Admin
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
