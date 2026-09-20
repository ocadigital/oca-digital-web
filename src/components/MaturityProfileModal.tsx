import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { PROFILE_OPTIONS, type CompanyProfile } from '@/data/maturityTest';

interface Props {
  open: boolean;
  busy: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (profile: CompanyProfile) => void;
  onSkip: () => void;
}

type Option = readonly [string, string];

const Chip = ({ label, active, role, onClick }: { label: string; active: boolean; role: 'checkbox' | 'radio'; onClick: () => void }) => (
  <button
    type="button"
    role={role}
    aria-checked={active}
    onClick={onClick}
    className={`px-3 py-2 rounded-lg border text-sm text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
      active ? 'border-primary bg-primary/10 text-foreground font-medium' : 'border-border bg-card text-foreground hover:border-primary/60'
    }`}
  >
    {label}
  </button>
);

const Group = ({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) => (
  <fieldset className="space-y-2">
    <legend className="text-sm font-semibold text-foreground">
      {title}
      {hint && <span className="ml-2 font-normal text-muted-foreground">{hint}</span>}
    </legend>
    <div className="flex flex-wrap gap-2">{children}</div>
  </fieldset>
);

const toggle = (list: string[], v: string, max = Infinity) =>
  list.includes(v) ? list.filter((x) => x !== v) : list.length >= max ? list : [...list, v];

const MaturityProfileModal = ({ open, busy, onOpenChange, onSave, onSkip }: Props) => {
  const [profile, setProfile] = useState<CompanyProfile>({ segments: [], portfolio: [], size: null, revenue: null, regions: [] });
  const filled =
    profile.segments.length > 0 || profile.portfolio.length > 0 || profile.size || profile.revenue || profile.regions.length > 0;

  const multi = (key: 'segments' | 'portfolio' | 'regions', options: readonly Option[], max?: number) =>
    options.map(([v, l]) => (
      <Chip key={v} label={l} role="checkbox" active={profile[key].includes(v)} onClick={() => setProfile((p) => ({ ...p, [key]: toggle(p[key], v, max) }))} />
    ));

  const single = (key: 'size' | 'revenue', options: readonly Option[]) =>
    options.map(([v, l]) => (
      <Chip key={v} label={l} role="radio" active={profile[key] === v} onClick={() => setProfile((p) => ({ ...p, [key]: p[key] === v ? null : v }))} />
    ));

  return (
    <Dialog open={open} onOpenChange={(v) => !busy && onOpenChange(v)}>
      <DialogContent className="sm:max-w-2xl max-h-[92vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Personalize o seu PDF</DialogTitle>
          <DialogDescription>
            Conte um pouco sobre a sua operação e o diagnóstico sai com o seu perfil. É opcional, você pode pular e baixar direto.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-5">
          <Group title="Segmento de atuação" hint="até 3">
            {multi('segments', PROFILE_OPTIONS.segments, 3)}
          </Group>
          <Group title="Sua carteira é de" hint="marque todas que se aplicam">
            {multi('portfolio', PROFILE_OPTIONS.portfolio)}
          </Group>
          <Group title="Imóveis em carteira">{single('size', PROFILE_OPTIONS.size)}</Group>
          <Group title="Faturamento anual estimado">{single('revenue', PROFILE_OPTIONS.revenue)}</Group>
          <Group title="Região de atuação" hint="marque todas que se aplicam">
            {multi('regions', PROFILE_OPTIONS.regions)}
          </Group>
        </div>
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={onSkip} disabled={busy}>
            Pular e baixar
          </Button>
          <Button type="button" className="font-semibold" onClick={() => onSave(profile)} disabled={busy || !filled}>
            {busy ? 'Gerando PDF...' : 'Salvar e baixar o PDF'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MaturityProfileModal;
