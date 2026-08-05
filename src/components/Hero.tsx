import { ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import EbookModal from '@/components/EbookModal';
import { logError } from '@/lib/logger';

const Hero = () => {
  const [scrollY, setScrollY] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    companySize: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEbookModalOpen, setIsEbookModalOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleEbookClick = () => {
    setIsEbookModalOpen(true);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = 'Nome é obrigatório';
    if (!formData.email.trim()) {
      newErrors.email = 'E-mail é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'E-mail inválido';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Telefone é obrigatório';
    if (!formData.companySize) newErrors.companySize = 'Tamanho da empresa é obrigatório';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke('send-contact-email', {
        body: {
          form: 'hero_diagnostic',
          nome: formData.name,
          email: formData.email,
          telefone: formData.phone,
          tipo_de_empresa: formData.companySize,
          comment: `Solicitação de diagnóstico gratuito através do formulário principal do site.`
        }
      });

      if (error) {
        logError('Error:', error);
        throw error;
      }

      toast({
        title: "Diagnóstico solicitado com sucesso!",
        description: "Entraremos em contato em breve através do e-mail ou WhatsApp informado.",
      });

      setFormData({ name: '', email: '', phone: '', companySize: '' });
    } catch (error) {
      logError('Submit error:', error);
      toast({
        title: "Erro ao enviar",
        description: "Ocorreu um erro ao processar sua solicitação. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <section id="inicio" className="pt-16 min-h-screen relative overflow-hidden bg-background">
      {/* Violet glow backdrop */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'var(--gradient-hero-glow)' }}
      />
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 80%, hsl(265 90% 45% / 0.25), transparent 40%), radial-gradient(circle at 80% 20%, hsl(250 95% 55% / 0.2), transparent 45%)',
          transform: `translateY(${scrollY * 0.3}px)`,
        }}
      />

      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight">
                Transforme sua
                <span className="text-primary"> Imobiliária</span>
                <br />
                em uma Máquina de
                <span className="text-primary"> Conversão</span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Especialistas em marketing imobiliário que combinam estratégia, dados e automação 
                para gerar mais leads qualificados e impulsionar suas vendas.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="text-lg px-8 py-4" onClick={handleEbookClick}>
                Baixar E-book Gratuito
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="text-lg px-8 py-4"
                onClick={() => window.open('https://calendly.com/anderson-ocadigital/30min', '_blank')}
              >
                Agendar Consultoria
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-8 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">+200%</div>
                <div className="text-sm text-muted-foreground">Aumento em Leads</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">+150%</div>
                <div className="text-sm text-muted-foreground">ROI Médio</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">+20</div>
                <div className="text-sm text-muted-foreground">Clientes</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <Card className="p-8 shadow-2xl border-2 border-primary/20 bg-card">
              <h3 className="text-2xl font-bold mb-6 text-center text-foreground">
                🎯 Diagnóstico Gratuito
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <input
                    type="text"
                    name="name"
                    placeholder="Nome completo"
                    aria-label="Nome completo"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-card text-foreground placeholder-muted-foreground ${errors.name ? 'border-red-500' : 'border-border'}`}
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>
                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="E-mail profissional"
                    aria-label="E-mail profissional"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-card text-foreground placeholder-muted-foreground ${errors.email ? 'border-red-500' : 'border-border'}`}
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>
                <div>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="WhatsApp"
                    aria-label="WhatsApp"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-card text-foreground placeholder-muted-foreground ${errors.phone ? 'border-red-500' : 'border-border'}`}
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>
                <div>
                  <select 
                    name="companySize"
                    aria-label="Tamanho da empresa"
                    value={formData.companySize}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-card text-foreground ${errors.companySize ? 'border-red-500' : 'border-border'}`}
                  >
                    <option value="">Tamanho da sua empresa</option>
                    <option value="corretor-autonomo">Corretor Autônomo</option>
                    <option value="pequena-imobiliaria">Pequena Imobiliária (2-10 corretores)</option>
                    <option value="media-imobiliaria">Média Imobiliária (11-50 corretores)</option>
                    <option value="grande-imobiliaria">Grande Imobiliária (50+ corretores)</option>
                  </select>
                  {errors.companySize && <p className="text-red-500 text-sm mt-1">{errors.companySize}</p>}
                </div>
                <Button 
                  type="submit" 
                  className="w-full py-3"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Enviando...' : 'Receber Diagnóstico Gratuito'}
                </Button>
              </form>
              <p className="text-xs text-muted-foreground text-center mt-4">
                Seus dados estão protegidos. Não fazemos spam.
              </p>
            </Card>
          </div>
        </div>

        <div className="text-center mt-16">
          <ArrowDown className="mx-auto text-muted-foreground animate-bounce" size={32} />
        </div>
      </div>

      <EbookModal 
        isOpen={isEbookModalOpen} 
        onClose={() => setIsEbookModalOpen(false)} 
      />
    </section>
  );
};

export default Hero;
