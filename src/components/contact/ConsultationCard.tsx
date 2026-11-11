
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { abrirWhatsapp } from '@/lib/whatsapp';

const ConsultationCard = () => {
  const handleConsultoriaClick = () => {
    abrirWhatsapp('contato');
  };

  return (
    <Card className="p-6 bg-primary/10 border-primary/30 card-elevated">
      <h4 className="font-bold text-xl mb-4 text-primary">Consultoria Gratuita</h4>
      <p className="text-foreground mb-4">
        Chame no WhatsApp para uma conversa de 30 minutos sobre como podemos ajudar
        a sua imobiliária a crescer com marketing digital.
      </p>
      <Button 
        className="w-full font-semibold"
        onClick={handleConsultoriaClick}
      >
        Chamar no WhatsApp
      </Button>
    </Card>
  );
};

export default ConsultationCard;
