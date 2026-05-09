import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const questions = [
  { id: 'crm', q: 'Você tem um CRM centralizando seus clientes?' },
  { id: 'cobranca', q: 'Suas cobranças são automatizadas?' },
  { id: 'dashboards', q: 'Você acompanha indicadores em dashboards?' },
  { id: 'integracoes', q: 'Suas ferramentas conversam entre si?' },
  { id: 'ia', q: 'Usa IA para tarefas operacionais?' },
];

const Diagnostic = () => {
  const { toast } = useToast();
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);

  const answeredCount = Object.keys(answers).length;
  const yesCount = Object.values(answers).filter(Boolean).length;

  const computedScore = Math.round((yesCount / questions.length) * 100);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (answeredCount < questions.length) {
      toast({ title: 'Responda todas as perguntas', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      await supabase.from('leads_websiteoca').insert({
        nome: name, email, tipo_de_empresa: company || null,
        form: 'diagnostic',
        comment: `Score: ${computedScore}% | ${JSON.stringify(answers)}`,
      });
      setScore(computedScore);
      setSubmitted(true);
    } catch (err) {
      toast({ title: 'Erro ao enviar', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const scoreLabel = score >= 80 ? 'Maturidade alta' : score >= 50 ? 'Em evolução' : score >= 25 ? 'Início da jornada' : 'Operação manual';
  const scoreColor = score >= 80 ? 'text-success' : score >= 50 ? 'text-neon-cyan' : score >= 25 ? 'text-warning' : 'text-destructive';

  return (
    <section id="diagnostico" className="relative py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-mesh opacity-60 pointer-events-none" />
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs font-medium text-muted-foreground mb-4">
            <Sparkles className="w-3 h-3 text-primary" />
            Diagnóstico gratuito
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            Descubra o nível de
            <br className="hidden md:block" /> <span className="text-gradient">automação da sua empresa</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            5 perguntas rápidas. Receba seu score e recomendações personalizadas.
          </p>
        </div>

        <div className="glass-strong rounded-2xl p-6 md:p-10 shadow-elevated">
          {!submitted ? (
            <form onSubmit={submit} className="space-y-8">
              <div className="space-y-3">
                {questions.map((q, i) => (
                  <div
                    key={q.id}
                    className="flex items-center justify-between gap-4 p-4 rounded-xl bg-card/60 border border-border/60"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center text-xs font-semibold text-muted-foreground">
                        {i + 1}
                      </div>
                      <span className="text-sm md:text-base">{q.q}</span>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      {[
                        { v: true, l: 'Sim' },
                        { v: false, l: 'Não' },
                      ].map((opt) => (
                        <button
                          key={opt.l}
                          type="button"
                          onClick={() => setAnswers({ ...answers, [q.id]: opt.v })}
                          className={`text-xs font-medium px-4 py-1.5 rounded-md border transition-all ${
                            answers[q.id] === opt.v
                              ? 'bg-primary text-primary-foreground border-primary shadow-glow'
                              : 'bg-secondary/40 border-border text-muted-foreground hover:text-foreground'
                          }`}
                        >
                          {opt.l}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Input placeholder="Seu nome" value={name} onChange={(e) => setName(e.target.value)} required className="bg-card/60 border-border/60 h-11" />
                <Input type="email" placeholder="Email corporativo" value={email} onChange={(e) => setEmail(e.target.value)} required className="bg-card/60 border-border/60 h-11" />
                <Input placeholder="Empresa" value={company} onChange={(e) => setCompany(e.target.value)} className="bg-card/60 border-border/60 h-11" />
              </div>

              <Button
                type="submit"
                disabled={loading}
                size="lg"
                className="w-full bg-gradient-primary text-white shadow-glow hover:opacity-90 h-12"
              >
                {loading ? 'Enviando...' : (
                  <>
                    Ver meu score de automação
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </form>
          ) : (
            <div className="text-center py-6">
              <CheckCircle2 className="w-12 h-12 text-success mx-auto mb-4" />
              <div className="text-sm text-muted-foreground mb-2">Seu score de automação</div>
              <div className="text-7xl md:text-8xl font-bold text-gradient mb-2">{score}%</div>
              <div className={`text-lg font-semibold ${scoreColor} mb-6`}>{scoreLabel}</div>
              <p className="text-muted-foreground max-w-xl mx-auto mb-6">
                Identificamos oportunidades claras para automatizar sua operação. Vamos conversar
                e mostrar como a OCA ONE pode acelerar sua empresa.
              </p>
              <Button
                size="lg"
                onClick={() => window.open('https://calendly.com/anderson-ocadigital/30min', '_blank')}
                className="bg-gradient-primary text-white shadow-glow hover:opacity-90 h-12 px-8"
              >
                Agendar demonstração
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Diagnostic;
