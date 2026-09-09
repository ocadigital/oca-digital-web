
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ProductsProps {
  /** Use when Products is rendered as its own page (not a homepage section) so it gets a real h1. */
  asPage?: boolean;
}

const Products = ({ asPage = false }: ProductsProps) => {
  const HeadingTag = asPage ? 'h1' : 'h2';

  const handleEmBreve = () => {
    alert('Em breve');
  };

  const handleAgendarDemo = () => {
    window.open('https://calendly.com/anderson-goncalves81/30min', '_blank');
  };

  return (
    <section id="produtos" className="py-20 bg-background section-separator">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <HeadingTag className="text-4xl font-bold text-foreground mb-4">
            Nossos Produtos
          </HeadingTag>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Soluções inovadoras para revolucionar sua operação imobiliária
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <Card className="p-8 card-elevated hover:-translate-y-2 border-2 border-primary/30 hover:border-primary/50">
            <div className="flex items-center justify-center mb-6">
              <img 
                src="/lovable-uploads/oca-one-icon.webp"
                alt="OCA One Icon"
                width={192}
                height={192}
                className="h-16 w-16 mr-4 bg-background rounded-lg p-2"
              />
              <h3 className="text-3xl font-bold text-foreground">OCA One</h3>
            </div>
            
            <p className="text-lg text-foreground mb-6">
              Uma plataforma imobiliária inteligente que centraliza os leads, automatiza a qualificação, 
              sugere imóveis em carteira e oferece inteligência de mercado, tudo via IA no WhatsApp.
            </p>

            <div className="space-y-4 mb-8">
              <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                <h4 className="font-bold text-primary mb-2">🤖 IA treinada com BANT no WhatsApp</h4>
                <p className="text-foreground">Atendimento automatizado e pré-qualificação inteligente</p>
              </div>
              
              <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                <h4 className="font-bold text-primary mb-2">📊 CRM com automação integrada</h4>
                <p className="text-foreground">Gestão completa sem custos extras de integrações</p>
              </div>
              
              <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                <h4 className="font-bold text-primary mb-2">🏠 Avaliação e captação inteligente</h4>
                <p className="text-foreground">Base no comportamento real do mercado</p>
              </div>
              
              <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                <h4 className="font-bold text-primary mb-2">📈 Inteligência de mercado</h4>
                <p className="text-foreground">Insights e análises para decisões estratégicas</p>
              </div>
            </div>

            <div className="text-center">
              <p className="text-foreground mb-6">Setup personalizado incluído</p>
              <Button size="lg" className="font-semibold" onClick={handleAgendarDemo}>
                Agendar Demo do OCA One
              </Button>
            </div>
          </Card>

          <Card className="p-8 card-elevated hover:-translate-y-2 hover:border-primary/40">
            <div className="flex items-center justify-center mb-6">
              <img 
                src="/lovable-uploads/equipe-oca-digital.webp"
                alt="OCA Base Icon"
                width={192}
                height={192}
                className="h-16 w-16 mr-4 bg-background rounded-lg p-2"
              />
              <h3 className="text-3xl font-bold text-foreground">OCA Base</h3>
            </div>

            <p className="text-lg text-foreground mb-6">
              Solução completa para pequenas imobiliárias e corretores autônomos com site profissional 
              e integração com os maiores portais do mercado.
            </p>

            <div className="space-y-4 mb-8">
              <div className="bg-secondary/50 p-4 rounded-lg border border-border">
                <h4 className="font-bold text-primary mb-2">🌐 Site profissional</h4>
                <p className="text-foreground">Design moderno e responsivo</p>
              </div>
              
              <div className="bg-secondary/50 p-4 rounded-lg border border-border">
                <h4 className="font-bold text-primary mb-2">🔗 Integração com portais</h4>
                <p className="text-foreground">Conecte-se aos maiores portais imobiliários</p>
              </div>
              
              <div className="bg-secondary/50 p-4 rounded-lg border border-border">
                <h4 className="font-bold text-primary mb-2">📋 Gestão de imóveis</h4>
                <p className="text-foreground">Cadastre e organize toda sua carteira</p>
              </div>
              
              <div className="bg-secondary/50 p-4 rounded-lg border border-border">
                <h4 className="font-bold text-primary mb-2">💰 Preço acessível</h4>
                <p className="text-foreground">Solução que cabe no seu orçamento</p>
              </div>
            </div>

            <div className="text-center">
              <p className="text-foreground mb-6">Planos flexíveis para seu negócio</p>
              <Button size="lg" variant="outline" className="font-semibold" onClick={handleAgendarDemo}>
                Agendar Demo do OCA Base
              </Button>
            </div>
          </Card>
        </div>

        <div className="mt-16">
          <Card className="p-8 card-elevated hover:-translate-y-2 border-2 border-primary/30 hover:border-primary/50">
            <div className="text-center">
              <h3 className="text-3xl font-bold text-foreground mb-4">
                📚 Curso para Corretores
              </h3>
              <p className="text-lg text-foreground mb-6">
                Treinamento completo de marketing imobiliário para corretores que querem acelerar suas vendas
              </p>
              <div className="flex items-center justify-center gap-8 mb-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">R$ 297</div>
                  <div className="text-muted-foreground">Acesso vitalício</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">+10h</div>
                  <div className="text-muted-foreground">De conteúdo</div>
                </div>
              </div>
              <Button 
                size="lg" 
                className="font-semibold"
                onClick={handleEmBreve}
              >
                Garantir Minha Vaga no Curso
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Products;
