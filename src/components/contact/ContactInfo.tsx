
import { Card } from '@/components/ui/card';

const ContactInfo = () => {
  return (
    <Card className="p-6 bg-white border-gray-200">
      <h4 className="font-bold text-xl mb-4 text-gray-900">Informações de Contato</h4>
      <div className="space-y-4">
        <div>
          <div className="font-semibold text-gray-800">📧 E-mail</div>
          <div className="text-gray-600">contato@ocadigital.com.br</div>
        </div>
        <div>
          <div className="font-semibold text-gray-800">📱 WhatsApp</div>
          <div className="text-gray-600">(48) 99679-0700</div>
        </div>
        <div>
          <div className="font-semibold text-gray-800">📍 Localização</div>
          <div className="text-gray-600">Florianópolis, SC - Atendimento Nacional</div>
        </div>
        <div>
          <div className="font-semibold text-gray-800">🕐 Horário de Atendimento</div>
          <div className="text-gray-600">Segunda a Sexta: 9h às 18h</div>
        </div>
      </div>
    </Card>
  );
};

export default ContactInfo;
