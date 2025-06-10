
import { ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
        console.error('Error:', error);
        throw error;
      }

      toast({
        title: "Diagnóstico solicitado com sucesso!",
        description: "Entraremos em contato em breve através do e-mail ou WhatsApp informado.",
      });

      setFormData({ name: '', email: '', phone: '', companySize: '' });
    } catch (error) {
      console.error('Submit error:', error);
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
    <section id="inicio" className="pt-16 min-h-screen relative overflow-hidden">
      {/* Parallax Background */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white"
        style={{
          transform: `translateY(${scrollY * 0.5}px)`,
        }}
      />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Transforme sua
                <span className="text-blue-600"> Imobiliária</span>
                <br />
                em uma Máquina de
                <span className="text-blue-600"> Conversão</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Especialistas em marketing imobiliário que combinam estratégia, dados e automação 
                para gerar mais leads qualificados e impulsionar suas vendas.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-4">
                Baixar E-book Gratuito
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="text-lg px-8 py-4 border-blue-600 text-blue-600 hover:bg-blue-50"
                onClick={() => window.open('https://calendly.com/anderson-ocadigital/30min', '_blank')}
              >
                Agendar Consultoria
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-8 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">+200%</div>
                <div className="text-sm text-gray-500">Aumento em Leads</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">+150%</div>
                <div className="text-sm text-gray-500">ROI Médio</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">50+</div>
                <div className="text-sm text-gray-500">Clientes Ativos</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <Card className="p-8 bg-white shadow-2xl border-gray-200">
              <h3 className="text-2xl font-bold mb-6 text-center text-gray-900">
                🎯 Diagnóstico Gratuito
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <input
                    type="text"
                    name="name"
                    placeholder="Nome completo"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-400 ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>
                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="E-mail profissional"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-400 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>
                <div>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="WhatsApp"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-400 ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>
                <div>
                  <select 
                    name="companySize"
                    value={formData.companySize}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 ${errors.companySize ? 'border-red-500' : 'border-gray-300'}`}
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
                  className="w-full bg-blue-600 hover:bg-blue-700 py-3"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Enviando...' : 'Receber Diagnóstico Gratuito'}
                </Button>
              </form>
              <p className="text-xs text-gray-500 text-center mt-4">
                Seus dados estão protegidos. Não fazemos spam.
              </p>
            </Card>
          </div>
        </div>

        <div className="text-center mt-16">
          <ArrowDown className="mx-auto text-gray-400 animate-bounce" size={32} />
        </div>
      </div>
    </section>
  );
};

export default Hero;
