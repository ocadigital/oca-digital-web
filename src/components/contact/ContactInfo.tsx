
import { Card } from '@/components/ui/card';
import { linkWhatsapp } from '@/lib/whatsapp';
import { trackSiteEvent } from '@/lib/formProgress';

const ContactInfo = () => {
  return (
    <Card className="p-6 card-elevated">
      <h4 className="font-bold text-xl mb-4 text-foreground">Informações de Contato</h4>
      <div className="space-y-4">
        <div>
          <div className="font-semibold text-foreground">📧 E-mail</div>
          <a href="mailto:anderson@ocadigital.com.br" className="text-primary underline-offset-4 hover:underline break-all">anderson@ocadigital.com.br</a>
        </div>
        <div>
          <div className="font-semibold text-foreground">📱 WhatsApp</div>
          <a
            href={linkWhatsapp('contato')}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackSiteEvent('whatsapp_clicado', { servico: 'contato' })}
            className="text-primary underline-offset-4 hover:underline"
          >
            (48) 99679-0700
          </a>
        </div>
        <div>
          <div className="font-semibold text-foreground">📍 Localização</div>
          <div className="text-muted-foreground">Florianópolis, SC (atendimento nacional)</div>
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
