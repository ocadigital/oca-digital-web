import { Linkedin, Instagram, MessageCircle, ArrowUpRight } from 'lucide-react';
import { useNavigate, useLocation, Link } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const goTo = (id: string) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 100);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Floating WhatsApp */}
      <a
        href="https://wa.me/5548996790700"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-success flex items-center justify-center shadow-glow hover:scale-105 transition-transform"
        aria-label="WhatsApp"
      >
        <MessageCircle className="w-6 h-6 text-white" />
      </a>

      <footer className="relative border-t border-border/60 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-gradient-glow opacity-50 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
            <div className="md:col-span-5">
              <img
                src="/lovable-uploads/b55ec33f-e02c-4406-bee6-48e0cdab621c.png"
                alt="OCA Digital"
                className="h-10 w-auto mb-4"
              />
              <p className="text-muted-foreground text-sm leading-relaxed max-w-md mb-6">
                Plataforma SaaS de automação, IA e dashboards executivos.
                Organizamos, automatizamos e escalamos a operação inteira da sua empresa.
              </p>
              <div className="space-y-1.5 text-sm text-muted-foreground">
                <div>contato@ocadigital.com.br</div>
                <div>(48) 99679-0700 — Florianópolis, SC</div>
              </div>
              <div className="flex gap-2 mt-5">
                <a href="https://www.linkedin.com/company/941540/" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg glass flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                  <Linkedin size={16} />
                </a>
                <a href="#" className="w-9 h-9 rounded-lg glass flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                  <Instagram size={16} />
                </a>
              </div>
            </div>

            <div className="md:col-span-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground mb-3">Plataforma</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><button onClick={() => goTo('oca-one')} className="hover:text-foreground transition-colors">OCA ONE</button></li>
                <li><button onClick={() => goTo('automacao')} className="hover:text-foreground transition-colors">Automação IA</button></li>
                <li><button onClick={() => goTo('integracoes')} className="hover:text-foreground transition-colors">Integrações</button></li>
              </ul>
            </div>

            <div className="md:col-span-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground mb-3">Empresa</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><button onClick={() => goTo('cases')} className="hover:text-foreground transition-colors">Cases</button></li>
                <li><Link to="/blog" className="hover:text-foreground transition-colors">Blog</Link></li>
                <li><button onClick={() => goTo('diagnostico')} className="hover:text-foreground transition-colors">Diagnóstico</button></li>
              </ul>
            </div>

            <div className="md:col-span-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground mb-3">Tecnologias</h3>
              <div className="flex flex-wrap gap-1.5">
                {['Asaas', 'ClickUp', 'OpenAI', 'WhatsApp', 'N8N', 'Pipedrive', 'Sheets'].map((t) => (
                  <span key={t} className="text-[11px] px-2 py-1 rounded-md bg-secondary/60 text-muted-foreground border border-border/60">
                    {t}
                  </span>
                ))}
              </div>
              <a
                href="https://wa.me/5548996790700"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-1.5 text-sm text-primary hover:text-primary-glow transition-colors"
              >
                Falar no WhatsApp <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          <div className="pt-6 border-t border-border/60 flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="text-xs text-muted-foreground">
              © 2024 OCA Digital · 27.010.924/0001-25 — Todos os direitos reservados
            </div>
            <div className="flex gap-5 text-xs text-muted-foreground">
              <a href="/politica-de-privacidade" className="hover:text-foreground transition-colors">Política de Privacidade</a>
              <a href="/termos-de-uso" className="hover:text-foreground transition-colors">Termos de Uso</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
