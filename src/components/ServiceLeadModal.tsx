import { useEffect, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { logError } from '@/lib/logger';

export interface ServicoSelecionado {
  /** Valor enviado no campo oculto (mesmos valores do formulário de contato). */
  valor: string;
  titulo: string;
}

interface Props {
  servico: ServicoSelecionado | null;
  onClose: () => void;
}

const TIPOS: [string, string][] = [
  ['corretor-autonomo', 'Corretor autônomo'],
  ['pequena-imobiliaria', 'Pequena imobiliária (2 a 10 corretores)'],
  ['media-imobiliaria', 'Média imobiliária (11 a 50 corretores)'],
  ['grande-imobiliaria', 'Grande imobiliária (50+ corretores)'],
  ['incorporadora', 'Incorporadora ou construtora'],
];

const vazio = { nome: '', email: '', telefone: '', tipo: '' };

const track = (event: string, data: Record<string, unknown>) => {
  const w = window as unknown as { dataLayer?: Record<string, unknown>[] };
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({ event, ...data });
};

/** Modal aberto pelos botões dos cards de serviço: nome, e-mail, telefone e tipo de empresa, com o serviço oculto. */
const ServiceLeadModal = ({ servico, onClose }: Props) => {
  const [form, setForm] = useState(vazio);
  const [erros, setErros] = useState<Record<string, string>>({});
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [falha, setFalha] = useState('');

  useEffect(() => {
    if (servico) {
      setEnviado(false);
      setFalha('');
      setErros({});
      track('service_lead_open', { servico: servico.valor });
    }
  }, [servico]);

  const set = (k: keyof typeof vazio, v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (erros[k]) setErros((e) => ({ ...e, [k]: '' }));
  };

  const validar = () => {
    const e: Record<string, string> = {};
    if (form.nome.trim().length < 2) e.nome = 'Informe o seu nome.';
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) e.email = 'Informe um e-mail válido.';
    if (form.telefone.replace(/\D/g, '').length < 10) e.telefone = 'Informe o telefone com DDD.';
    if (!form.tipo) e.tipo = 'Escolha o tipo de empresa.';
    setErros(e);
    return Object.keys(e).length === 0;
  };

  const enviar = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!servico || !validar()) return;
    setEnviando(true);
    setFalha('');
    try {
      const { error } = await supabase.functions.invoke('send-contact-email', {
        body: {
          form: 'servico_card',
          nome: form.nome.trim(),
          email: form.email.trim(),
          telefone: form.telefone.trim(),
          tipo_de_empresa: form.tipo,
          servico: servico.valor,
          comment: `Interesse em ${servico.titulo} (botão do card de serviços, página ${window.location.pathname}).`,
        },
      });
      if (error) throw error;
      track('service_lead_submit', { servico: servico.valor, tipo_de_empresa: form.tipo });
      setEnviado(true);
      setForm(vazio);
    } catch (e) {
      logError('service lead error:', e);
      setFalha('Não foi possível enviar agora. Verifique a conexão e tente de novo.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <Dialog open={!!servico} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        {enviado ? (
          <div className="text-center py-4">
            <CheckCircle2 className="mx-auto h-12 w-12 text-primary mb-4" aria-hidden="true" />
            <DialogTitle className="text-2xl mb-2">Recebemos seus dados</DialogTitle>
            <DialogDescription className="text-base">
              Entraremos em contato em breve para conversar sobre {servico?.titulo}.
            </DialogDescription>
            <Button className="mt-6 w-full" onClick={onClose}>
              Fechar
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl">{servico?.titulo}</DialogTitle>
              <DialogDescription>Deixe seus dados e entraremos em contato para entender a sua operação.</DialogDescription>
            </DialogHeader>
            <form onSubmit={enviar} noValidate className="space-y-4 mt-2">
              <input type="hidden" name="servico" value={servico?.valor ?? ''} />
              <div className="space-y-1.5">
                <Label htmlFor="sl-nome">Nome</Label>
                <Input id="sl-nome" autoComplete="name" value={form.nome} onChange={(e) => set('nome', e.target.value)} aria-invalid={!!erros.nome} />
                {erros.nome && <p className="text-sm text-destructive">{erros.nome}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="sl-email">E-mail</Label>
                <Input id="sl-email" type="email" autoComplete="email" value={form.email} onChange={(e) => set('email', e.target.value)} aria-invalid={!!erros.email} />
                {erros.email && <p className="text-sm text-destructive">{erros.email}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="sl-telefone">Telefone (WhatsApp)</Label>
                <Input id="sl-telefone" type="tel" autoComplete="tel" placeholder="(48) 99999-9999" value={form.telefone} onChange={(e) => set('telefone', e.target.value)} aria-invalid={!!erros.telefone} />
                {erros.telefone && <p className="text-sm text-destructive">{erros.telefone}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="sl-tipo">Tipo de empresa</Label>
                <select
                  id="sl-tipo"
                  value={form.tipo}
                  onChange={(e) => set('tipo', e.target.value)}
                  aria-invalid={!!erros.tipo}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">Escolha uma opção</option>
                  {TIPOS.map(([v, l]) => (
                    <option key={v} value={v}>
                      {l}
                    </option>
                  ))}
                </select>
                {erros.tipo && <p className="text-sm text-destructive">{erros.tipo}</p>}
              </div>
              {falha && <p className="text-sm text-destructive">{falha}</p>}
              <Button type="submit" className="w-full font-semibold" disabled={enviando}>
                {enviando ? 'Enviando...' : 'Quero conversar'}
              </Button>
              <p className="text-xs text-muted-foreground text-center">Seus dados ficam só com a OCA Digital. Não enviamos spam.</p>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ServiceLeadModal;
