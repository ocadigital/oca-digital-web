import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle2 } from 'lucide-react';

interface EbookModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EbookModal = ({ isOpen, onClose }: EbookModalProps) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [priority, setPriority] = useState('');
  const [errors, setErrors] = useState<{ email?: string; whatsapp?: string; priority?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const formatWhatsApp = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    if (numbers.length <= 11) return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateWhatsApp = (phone: string) => {
    const numbers = phone.replace(/\D/g, '');
    return numbers.length === 11 || numbers.length === 10;
  };

  const handleStep1Continue = () => {
    const newErrors: { email?: string; whatsapp?: string } = {};

    if (!email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Email inválido';
    }

    if (!whatsapp.trim()) {
      newErrors.whatsapp = 'WhatsApp é obrigatório';
    } else if (!validateWhatsApp(whatsapp)) {
      newErrors.whatsapp = 'Número de telefone inválido';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setStep(2);
  };

  const handleSubmit = async () => {
    if (!priority) {
      setErrors({ priority: 'Por favor, selecione uma opção' });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('ebook_downloads')
        .insert({
          email: email.trim(),
          whatsapp: whatsapp.replace(/\D/g, ''),
          priority,
        });

      if (error) throw error;

      setIsSuccess(true);
      toast({
        title: 'Sucesso!',
        description: 'Confira seu email para receber o e-book.',
      });
    } catch (error) {
      console.error('Error saving ebook download:', error);
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao processar sua solicitação. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setStep(1);
    setEmail('');
    setWhatsapp('');
    setPriority('');
    setErrors({});
    setIsSuccess(false);
    setIsSubmitting(false);
    onClose();
  };

  const handleWhatsAppClick = () => {
    window.open('https://wa.me/5548996790700', '_blank');
  };

  if (isSuccess) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[500px]">
          <div className="text-center py-8">
            <CheckCircle2 className="w-16 h-16 text-primary mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Sucesso!
            </h3>
            <p className="text-muted-foreground mb-6">
              Confira o seu email e desfrute do seu material, caso queira tirar dúvidas, nos chame no WhatsApp agora mesmo.
            </p>
            <div className="space-y-3">
              <Button
                onClick={handleWhatsAppClick}
                className="w-full"
                size="lg"
              >
                Falar no WhatsApp
              </Button>
              <Button
                onClick={handleClose}
                variant="outline"
                className="w-full"
              >
                Fechar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            Baixar E-book Gratuito
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Passo {step} de 2
          </p>
        </DialogHeader>

        {step === 1 ? (
          <div className="space-y-6 py-4">
            <p className="text-foreground font-medium">
              Qual o seu melhor email e WhatsApp para receber o E-book?
            </p>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="digite o seu melhor email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors({ ...errors, email: undefined });
                }}
                className={errors.email ? 'border-destructive' : ''}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Nota: Enviaremos o ebook para este email.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="whatsapp">WhatsApp</Label>
              <Input
                id="whatsapp"
                type="tel"
                placeholder="o seu whats com DDD"
                value={whatsapp}
                onChange={(e) => {
                  const formatted = formatWhatsApp(e.target.value);
                  setWhatsapp(formatted);
                  if (errors.whatsapp) setErrors({ ...errors, whatsapp: undefined });
                }}
                maxLength={15}
                className={errors.whatsapp ? 'border-destructive' : ''}
              />
              {errors.whatsapp && (
                <p className="text-sm text-destructive">{errors.whatsapp}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Nota: Manteremos contato pelo WhatsApp para seguirmos com a sua evolução.
              </p>
            </div>

            <Button
              onClick={handleStep1Continue}
              className="w-full"
              size="lg"
            >
              Continuar
            </Button>
          </div>
        ) : (
          <div className="space-y-6 py-4">
            <p className="text-foreground font-medium">
              Qual é a principal prioridade do seu negócio nos próximos 6 meses?
            </p>

            <RadioGroup value={priority} onValueChange={setPriority}>
              <div className="space-y-3">
                <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-secondary/50 cursor-pointer">
                  <RadioGroupItem value="padronizar-processos" id="opt1" />
                  <Label htmlFor="opt1" className="cursor-pointer flex-1 font-normal">
                    Padronizar os processos para garantir qualidade e escala
                  </Label>
                </div>

                <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-secondary/50 cursor-pointer">
                  <RadioGroupItem value="novo-site" id="opt2" />
                  <Label htmlFor="opt2" className="cursor-pointer flex-1 font-normal">
                    Novo site integrado aos Portais com melhor custo/benefício
                  </Label>
                </div>

                <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-secondary/50 cursor-pointer">
                  <RadioGroupItem value="pre-qualificacao" id="opt3" />
                  <Label htmlFor="opt3" className="cursor-pointer flex-1 font-normal">
                    Pré-qualificação de Leads (SDR) c/ Automação e Lead Score
                  </Label>
                </div>

                <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-secondary/50 cursor-pointer">
                  <RadioGroupItem value="aumentar-leads" id="opt4" />
                  <Label htmlFor="opt4" className="cursor-pointer flex-1 font-normal">
                    Aumentar o número de Leads interessados
                  </Label>
                </div>

                <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-secondary/50 cursor-pointer">
                  <RadioGroupItem value="chatbot-whatsapp" id="opt5" />
                  <Label htmlFor="opt5" className="cursor-pointer flex-1 font-normal">
                    Implementar um chatbot integrado ao WhatsApp
                  </Label>
                </div>
              </div>
            </RadioGroup>

            {errors.priority && (
              <p className="text-sm text-destructive">{errors.priority}</p>
            )}

            <p className="text-xs text-muted-foreground">
              Nota: escolha uma das opções acima que descreve a maior dor do momento do seu negócio.
            </p>

            <div className="flex gap-3">
              <Button
                onClick={() => setStep(1)}
                variant="outline"
                className="flex-1"
              >
                Voltar
              </Button>
              <Button
                onClick={handleSubmit}
                className="flex-1"
                size="lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Enviando...' : 'Receber E-book'}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EbookModal;
