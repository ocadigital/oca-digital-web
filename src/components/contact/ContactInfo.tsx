
import { Card } from '@/components/ui/card';

const ContactInfo = () => {
  return (
    <Card className="p-6 shadow-lg border-border/50 bg-card">
      <h4 className="font-bold text-xl mb-4 text-foreground">Informações de Contato</h4>
      <div className="space-y-4">
        <div>
          <div className="font-semibold text-foreground">📧 E-mail</div>
          <div className="text-muted-foreground">contato@ocadigital.com.br</div>
        </div>
        <div>
          <div className="font-semibold text-foreground">📱 WhatsApp</div>
          <div className="text-muted-foreground">(48) 99679-0700</div>
        </div>
        <div>
          <div className="font-semibold text-foreground">📍 Localização</div>
          <div className="text-muted-foreground">Florianópolis, SC - Atendimento Nacional</div>
        </div>
        <div>
          <div className="font-semibold text-foreground">🕐 Horário de Atendimento</div>
          <div className="text-muted-foreground">Segunda a Sexta: 9h às 18h</div>
        </div>
      </div>
    </Card>
  );
};

export default ContactInfo;
