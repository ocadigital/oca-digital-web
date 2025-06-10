
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const ConsultationCard = () => {
  return (
    <Card className="p-6 bg-blue-50 border-blue-200">
      <h4 className="font-bold text-xl mb-4 text-blue-800">Consultoria Gratuita</h4>
      <p className="text-blue-700 mb-4">
        Agende uma conversa de 30 minutos para entender como podemos ajudar 
        sua imobiliária a crescer com marketing digital.
      </p>
      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold">
        Agendar Consultoria Gratuita
      </Button>
    </Card>
  );
};

export default ConsultationCard;
