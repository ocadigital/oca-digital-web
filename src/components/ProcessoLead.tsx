import VideoLoop from '@/components/VideoLoop';

const etapas = [
  { titulo: 'Captação', texto: 'Anúncios, site e portais trazem o contato.' },
  { titulo: 'CRM', texto: 'Todos os leads num lugar só, com a origem de cada um.' },
  { titulo: 'Enriquecimento', texto: 'Dados do LinkedIn completam o perfil de quem chegou.' },
  { titulo: 'Qualificação', texto: 'Uma nota automática mostra quem está mais perto de comprar.' },
  { titulo: 'Atendimento', texto: 'O robô no WhatsApp responde na hora, com fotos, planta e valores do imóvel.' },
  { titulo: 'Visita', texto: 'O corretor recebe o lead pronto, com a visita marcada.' },
];

/** Seção "Como funciona": o caminho do lead em 6 etapas (vídeo no computador, lista no celular). */
const ProcessoLead = () => (
  <section id="como-funciona" className="py-20 bg-background section-separator">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12 max-w-3xl mx-auto">
        <p className="text-sm font-semibold tracking-widest uppercase text-primary mb-2">Como funciona</p>
        <h2 className="text-4xl font-bold text-foreground mb-4 text-balance">Do primeiro clique à visita agendada</h2>
        <p className="text-xl text-muted-foreground">
          É assim que o lead anda quando a OCA organiza a operação. Cada etapa fica registrada no CRM, então você sabe onde
          está cada contato e quanto tempo ele levou para virar visita.
        </p>
      </div>

      <div className="hidden md:block">
        <VideoLoop
          base="/motion/processo-lead-v1"
          width={1600}
          height={700}
          pausaMs={3000}
          label="Animação do processo: captação no Instagram, Google, portais e WhatsApp, CRM com todos os leads, enriquecimento com dados do LinkedIn, lead score, atendimento automático no WhatsApp com detalhes do imóvel e visita agendada."
          className="w-full aspect-[16/7] rounded-2xl border-2 border-primary/20 shadow-2xl"
        />
        <p className="text-xs text-muted-foreground text-center mt-3">Exemplo ilustrativo.</p>
      </div>

      <ol className="md:hidden space-y-4">
        {etapas.map((e, i) => (
          <li key={e.titulo} className="flex gap-4 rounded-xl border border-border bg-card p-4">
            <span className="shrink-0 w-9 h-9 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center">
              {i + 1}
            </span>
            <div>
              <p className="font-semibold text-foreground">{e.titulo}</p>
              <p className="text-muted-foreground text-sm">{e.texto}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  </section>
);

export default ProcessoLead;
