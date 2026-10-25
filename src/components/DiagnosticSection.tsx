import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { logError } from '@/lib/logger';
import TermometroLead, { type ResultadoTermometro } from '@/components/TermometroLead';

/** Diagnóstico gratuito: antes ficava no hero, agora é uma seção abaixo dos serviços. */
const DiagnosticSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    companySize: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  // o que o visitante simulou no Termômetro vai junto no pedido de diagnóstico
  const [termometro, setTermometro] = useState<ResultadoTermometro | null>(null);
  const { toast } = useToast();

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
          comment: `Solicitação de diagnóstico gratuito através do formulário principal do site.${termometro ? `\n\n${termometro.resumo}` : ''}`
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
    <section id="diagnostico" className="py-20 bg-background section-separator">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-5">
            <span className="text-sm font-semibold tracking-wider uppercase text-primary">Diagnóstico gratuito</span>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground leading-tight">
              Lead que espera, esfria.
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Na sua imobiliária ninguém serve café frio para um cliente. No WhatsApp isso acontece todo dia: o lead
              chega, espera horas pela resposta e, quando o corretor responde, ele já conversou com outras duas imobiliárias.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              No diagnóstico medimos quanto tempo o seu atendimento leva, de onde vêm os seus leads e onde eles esfriam
              antes da visita. Em 20 minutos você sai com os primeiros passos para resolver. Sem compromisso.
            </p>
            <ul className="space-y-2 text-foreground">
              <li className="flex gap-2"><span className="text-primary">✓</span> Quanto tempo o seu time leva para responder</li>
              <li className="flex gap-2"><span className="text-primary">✓</span> De onde vêm os seus leads e quanto custam</li>
              <li className="flex gap-2"><span className="text-primary">✓</span> Onde o atendimento trava antes da visita</li>
            </ul>
          </div>
          <Card id="diagnostico-form" className="p-8 shadow-2xl border-2 border-primary/20 bg-card">
            <h3 className="text-2xl font-bold mb-6 text-center text-foreground">Quero meu diagnóstico</h3>
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
              {isSubmitting ? 'Enviando...' : 'Quero meu Diagnóstico Gratuito'}
            </Button>
          </form>
          <p className="text-xs text-muted-foreground text-center mt-4">
            Seus dados estão protegidos. Não fazemos spam.
          </p>
          </Card>
        </div>
        <div className="mt-12">
          <TermometroLead onResultado={setTermometro} />
        </div>
      </div>
    </section>
  );
};

export default DiagnosticSection;
