
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const ConsultationCard = () => {
  const handleConsultoriaClick = () => {
    window.open('https://calendly.com/anderson-ocadigital/30min', '_blank');
  };

  return (
    <Card className="p-6 bg-primary/5 border-primary/20 shadow-lg">
      <h4 className="font-bold text-xl mb-4 text-primary">Consultoria Gratuita</h4>
      <p className="text-foreground mb-4">
        Agende uma conversa de 30 minutos para entender como podemos ajudar 
        sua imobiliária a crescer com marketing digital.
      </p>
      <Button 
        className="w-full font-semibold"
        onClick={handleConsultoriaClick}
      >
        Agendar Consultoria Gratuita
      </Button>
    </Card>
  );
};

export default ConsultationCard;
