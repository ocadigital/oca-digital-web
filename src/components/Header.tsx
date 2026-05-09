import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const NAV = [
  { id: 'solucoes', label: 'Soluções' },
  { id: 'oca-one', label: 'OCA ONE' },
  { id: 'automacao', label: 'Automação IA' },
  { id: 'integracoes', label: 'Integrações' },
  { id: 'cases', label: 'Cases' },
  { id: 'diagnostico', label: 'Diagnóstico' },
  { id: 'contato', label: 'Contato' },
];

const Header = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const goTo = (id: string) => {
    setOpen(false);
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 100);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const cta = () => window.open('https://calendly.com/anderson-ocadigital/30min', '_blank');

  return (
    <header
      className={cn(
        'fixed top-0 inset-x-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-background/70 backdrop-blur-xl border-b border-border/60'
          : 'bg-transparent border-b border-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <img
              src="/lovable-uploads/b55ec33f-e02c-4406-bee6-48e0cdab621c.png"
              alt="OCA Digital"
              className="h-9 w-auto"
            />
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {NAV.map((n) => (
              <button
                key={n.id}
                onClick={() => goTo(n.id)}
                className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-md"
              >
                {n.label}
              </button>
            ))}
            <Link
              to="/blog"
              className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-md"
            >
              Blog
            </Link>
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={() => goTo('diagnostico')}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Entrar
            </button>
            <Button
              onClick={cta}
              className="bg-gradient-primary text-white shadow-glow hover:opacity-90 transition-opacity"
            >
              <Sparkles className="w-4 h-4" />
              Agendar Diagnóstico
            </Button>
          </div>

          <button
            className="lg:hidden text-foreground p-2"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {open && (
          <div className="lg:hidden pb-4 animate-fade-in">
            <div className="flex flex-col gap-1 pt-2 border-t border-border">
              {NAV.map((n) => (
                <button
                  key={n.id}
                  onClick={() => goTo(n.id)}
                  className="px-3 py-2.5 text-left text-sm text-muted-foreground hover:text-foreground hover:bg-secondary rounded-md"
                >
                  {n.label}
                </button>
              ))}
              <Link
                to="/blog"
                className="px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary rounded-md"
                onClick={() => setOpen(false)}
              >
                Blog
              </Link>
              <Button onClick={cta} className="bg-gradient-primary text-white mt-2">
                <Sparkles className="w-4 h-4" />
                Agendar Diagnóstico
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
