import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { LEVELS, type Level, type TestResult } from '@/data/maturityTest';
import { logError } from '@/lib/logger';

const PAGE_URL = 'https://www.ocadigital.com.br/teste-maturidade';

const withUtm = (source: string, content?: string) => {
  const u = new URL(PAGE_URL);
  u.searchParams.set('utm_source', source);
  u.searchParams.set('utm_medium', 'share');
  u.searchParams.set('utm_campaign', 'teste-maturidade');
  if (content) u.searchParams.set('utm_content', content);
  return u.toString();
};

type Toast = (t: { title: string; description?: string; variant?: 'destructive' }) => void;

interface Props {
  result: TestResult;
  responseId: string | null;
  toast: Toast;
  track: (event: string, data?: Record<string, unknown>) => void;
}

/** Botões de compartilhar o resultado e de convidar o time para o teste. */
const MaturityShare = ({ result, responseId, toast, track }: Props) => {
  const level = result.level as Level;
  const info = LEVELS[level];
  const [busy, setBusy] = useState(false);
  const shareText = `Fiz o Teste de Maturidade Imobiliária da OCA Digital e a minha imobiliária está no Nível ${level} de 5 (${info.name}). Em qual nível está a sua?`;
  const inviteCode = `convite-${(responseId ?? 'sem-id').slice(0, 8)}`;
  const inviteUrl = withUtm('convite', inviteCode);
  const inviteText =
    'Fiz um teste de 3 minutos sobre como a nossa imobiliária funciona hoje. Quero ver se você enxerga a operação do mesmo jeito que eu. Faz e me conta o seu nível:';
  const canNativeShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function';

  const open = (url: string, method: string) => {
    track('maturity_share', { method, maturity_level: level });
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const copy = async (text: string, method: string) => {
    try {
      await navigator.clipboard.writeText(text);
      track('maturity_share', { method, maturity_level: level });
      toast({ title: 'Copiado', description: 'Cole onde quiser compartilhar.' });
    } catch {
      toast({ title: 'Não foi possível copiar', variant: 'destructive' });
    }
  };

  const nativeShare = async () => {
    try {
      await navigator.share({ title: 'Teste de Maturidade Imobiliária', text: shareText, url: withUtm('nativo') });
      track('maturity_share', { method: 'nativo', maturity_level: level });
    } catch {
      // a pessoa cancelou
    }
  };

  const storyImage = async () => {
    setBusy(true);
    try {
      const { renderShareCard } = await import('@/lib/maturityShareCard');
      const blob = await renderShareCard(result);
      const file = new File([blob], `meu-nivel-maturidade-${level}.png`, { type: 'image/png' });
      if (navigator.canShare?.({ files: [file] })) {
        try {
          await navigator.share({ files: [file], text: `${shareText} ${withUtm('stories')}` });
        } catch {
          // a pessoa cancelou o compartilhamento
        }
      } else {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = file.name;
        a.click();
        setTimeout(() => URL.revokeObjectURL(a.href), 2000);
      }
      track('maturity_share', { method: 'imagem_stories', maturity_level: level });
    } catch (e) {
      logError('share card error:', e);
      toast({ title: 'Não foi possível gerar a imagem', description: 'Tente novamente em instantes.', variant: 'destructive' });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-bold text-foreground">Compartilhe o seu nível</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          A imagem mostra o nível e o radar, sem o seu nome nem as suas respostas.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button onClick={storyImage} disabled={busy}>
            {busy ? 'Gerando imagem...' : 'Imagem para Stories'}
          </Button>
          <Button
            variant="outline"
            onClick={() => open(`https://wa.me/?text=${encodeURIComponent(`${shareText} ${withUtm('whatsapp')}`)}`, 'whatsapp')}
          >
            WhatsApp
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(withUtm('linkedin'))}`, 'linkedin')
            }
          >
            LinkedIn
          </Button>
          {canNativeShare ? (
            <Button variant="outline" onClick={nativeShare}>
              Mais opções
            </Button>
          ) : (
            <Button variant="outline" onClick={() => copy(`${shareText} ${withUtm('copiar')}`, 'copiar')}>
              Copiar texto
            </Button>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-primary/40 bg-primary/5 p-6">
        <h2 className="text-lg font-bold text-foreground">Seu time vê a imobiliária do mesmo jeito?</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Mande o teste para o seu sócio, gerente ou corretor de confiança e compare os níveis. Quando a resposta do dono e a do
          time não batem, ali costuma estar o gargalo.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button
            onClick={() => open(`https://wa.me/?text=${encodeURIComponent(`${inviteText} ${inviteUrl}`)}`, 'convite_whatsapp')}
          >
            Convidar pelo WhatsApp
          </Button>
          <Button variant="outline" onClick={() => copy(`${inviteText} ${inviteUrl}`, 'convite_copiar')}>
            Copiar convite
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MaturityShare;
