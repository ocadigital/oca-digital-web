
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { logError } from '@/lib/logger';
import { trackSiteEvent, useFormProgress } from '@/lib/formProgress';

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  companyType: string;
  service: string;
  message: string;
}

const ContactForm = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    companyType: '',
    service: '',
    message: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const progresso = useFormProgress('contato');

  useEffect(() => {
    trackSiteEvent('contato_visto');
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
    if (!formData.companyType) newErrors.companyType = 'Tipo de empresa é obrigatório';
    if (!formData.service) newErrors.service = 'Serviço de interesse é obrigatório';
    
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
          form: 'contact_form',
          nome: formData.name,
          email: formData.email,
          telefone: formData.phone,
          tipo_de_empresa: formData.companyType,
          servico: formData.service,
          comment: formData.message.trim() || '(sem mensagem)'
        }
      });

      if (error) {
        logError('Error:', error);
        throw error;
      }

      await progresso.concluir();

      toast({
        title: "Mensagem enviada com sucesso!",
        description: "Recebemos sua mensagem e entraremos em contato em breve.",
      });

      setFormData({
        name: '',
        email: '',
        phone: '',
        companyType: '',
        service: '',
        message: ''
      });
    } catch (error) {
      logError('Submit error:', error);
      toast({
        title: "Erro ao enviar",
        description: "Ocorreu um erro ao processar sua mensagem. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const next = { ...prev, [name]: value };
      progresso.registrar({
        nome: next.name, email: next.email, telefone: next.phone,
        tipo_empresa: next.companyType, servico: next.service, mensagem: next.message,
      });
      return next;
    });
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <Card className="p-8 card-elevated">
      <h3 className="text-2xl font-bold mb-6 text-foreground">Envie sua mensagem</h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <input
              type="text"
              name="name"
              placeholder="Nome"
              aria-label="Nome"
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
              placeholder="E-mail"
              aria-label="E-mail"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-card text-foreground placeholder-muted-foreground ${errors.email ? 'border-red-500' : 'border-border'}`}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <input
              type="tel"
              name="phone"
              placeholder="Telefone"
              aria-label="Telefone"
              value={formData.phone}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-card text-foreground placeholder-muted-foreground ${errors.phone ? 'border-red-500' : 'border-border'}`}
            />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
          </div>
          <div>
            <select 
              name="companyType"
              aria-label="Tipo de empresa"
              value={formData.companyType}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-card text-foreground ${errors.companyType ? 'border-red-500' : 'border-border'}`}
            >
              <option value="">Tipo de empresa</option>
              <option value="corretor-autonomo">Corretor Autônomo</option>
              <option value="pequena-imobiliaria">Pequena Imobiliária</option>
              <option value="media-imobiliaria">Média Imobiliária</option>
              <option value="grande-imobiliaria">Grande Imobiliária</option>
              <option value="incorporadora">Incorporadora</option>
            </select>
            {errors.companyType && <p className="text-red-500 text-sm mt-1">{errors.companyType}</p>}
          </div>
        </div>
        <div>
          <select 
            name="service"
            aria-label="Serviço de interesse"
            value={formData.service}
            onChange={handleChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-card text-foreground ${errors.service ? 'border-red-500' : 'border-border'}`}
          >
            <option value="">Serviço de interesse</option>
            <option value="web-sites">Web Sites</option>
            <option value="google-meta-gpt-ads">Anúncios no Google, Meta e IA (GPT Ads)</option>
            <option value="landing-page">Landing Pages</option>
            <option value="planejamento-marketing">Planejamento de Marketing</option>
            <option value="processos-automacao">Consultoria em Processos e Automação</option>
            <option value="crm">CRM</option>
            <option value="automacao-n8n">Automações e Integrações com n8n</option>
            <option value="lancamentos">Marketing para Lançamentos</option>
            <option value="outros">Outros</option>
          </select>
          {errors.service && <p className="text-red-500 text-sm mt-1">{errors.service}</p>}
        </div>
        <div>
          <textarea
            rows={4}
            name="message"
            placeholder="Conte sobre o seu desafio atual (opcional)"
            aria-label="Conte sobre o seu desafio atual (opcional)"
            value={formData.message}
            onChange={handleChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-card text-foreground placeholder-muted-foreground ${errors.message ? 'border-red-500' : 'border-border'}`}
          ></textarea>
          {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
        </div>
        <Button 
          type="submit" 
          className="w-full py-3 font-semibold"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Enviando...' : 'Enviar Mensagem'}
        </Button>
        <p className="text-xs text-muted-foreground text-center">
          Para retomarmos o contato, os dados que você preencher ficam salvos mesmo que não termine o envio.
          Veja a <a href="/politica-de-privacidade" className="underline hover:text-primary">política de privacidade</a>.
        </p>
      </form>
    </Card>
  );
};

export default ContactForm;
