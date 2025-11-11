
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
    if (!formData.message.trim()) newErrors.message = 'Mensagem é obrigatória';
    
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
          comment: formData.message
        }
      });

      if (error) {
        console.error('Error:', error);
        throw error;
      }

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
      console.error('Submit error:', error);
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
    setFormData(prev => ({ ...prev, [name]: value }));
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
              value={formData.phone}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-card text-foreground placeholder-muted-foreground ${errors.phone ? 'border-red-500' : 'border-border'}`}
            />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
          </div>
          <div>
            <select 
              name="companyType"
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
            value={formData.service}
            onChange={handleChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-card text-foreground ${errors.service ? 'border-red-500' : 'border-border'}`}
          >
            <option value="">Serviço de interesse</option>
            <option value="diagnostico">Diagnóstico Estratégico</option>
            <option value="sdr">SDR - Núcleo de Pré-qualificação</option>
            <option value="automacao">Automação de Marketing</option>
            <option value="lancamento">Lançamento Imobiliário</option>
            <option value="oca-one">OCA One</option>
            <option value="oca-base">OCA Base</option>
            <option value="pacotes">Pacotes Mensais</option>
          </select>
          {errors.service && <p className="text-red-500 text-sm mt-1">{errors.service}</p>}
        </div>
        <div>
          <textarea
            rows={4}
            name="message"
            placeholder="Conte-nos sobre seu desafio atual..."
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
      </form>
    </Card>
  );
};

export default ContactForm;
