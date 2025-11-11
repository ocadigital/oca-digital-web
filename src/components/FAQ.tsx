
import { Card } from '@/components/ui/card';
import { useState } from 'react';

const FAQ = () => {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(item => item !== index)
        : [...prev, index]
    );
  };

  const faqs = [
    {
      question: "Como funciona o processo de diagnóstico estratégico?",
      answer: "O diagnóstico estratégico é uma análise completa da sua operação atual. Avaliamos seu marketing digital, processos comerciais, ferramentas utilizadas e identificamos oportunidades de melhoria. O processo dura cerca de 1 semana e entregamos um relatório detalhado com plano de ação personalizado."
    },
    {
      question: "Qual a diferença entre OCA One e OCA Base?",
      answer: "OCA One é nossa plataforma inteligente com IA integrada no WhatsApp, CRM automatizado e inteligência de mercado. OCA Base é nossa solução para corretores autônomos e pequenas imobiliárias, focada em site profissional e integração com portais imobiliários."
    },
    {
      question: "Vocês trabalham apenas com imobiliárias de Florianópolis?",
      answer: "Não! Apesar de estarmos sediados em Florianópolis, SC, atendemos clientes em todo o Brasil. Nossos serviços são 100% digitais e oferecemos consultoria remota para qualquer região do país."
    },
    {
      question: "Quanto tempo leva para ver resultados?",
      answer: "Os primeiros resultados geralmente aparecem entre 30 a 60 dias, dependendo do serviço contratado. Para campanhas de mídia paga, os resultados são mais rápidos (7-15 dias). Já para SEO e automação, o prazo é de 60-90 dias para resultados consistentes."
    },
    {
      question: "Vocês oferecem suporte técnico?",
      answer: "Sim! Todos os nossos clientes têm acesso a suporte técnico durante o horário comercial (9h às 18h, segunda a sexta). Para clientes dos planos mais avançados, oferecemos suporte prioritário e consultoria mensal."
    },
    {
      question: "É possível cancelar os serviços a qualquer momento?",
      answer: "Sim, nossos contratos mensais podem ser cancelados com 30 dias de antecedência. Para serviços pontuais, seguimos o cronograma acordado. Não temos fidelidade obrigatória - nosso foco é entregar resultados que façam você querer continuar conosco."
    },
    {
      question: "Vocês trabalham com incorporadoras?",
      answer: "Sim! Temos grande experiência com lançamentos imobiliários e campanhas para incorporadoras. Oferecemos serviços especializados em pré-lançamento, lançamento e pós-venda de empreendimentos."
    },
    {
      question: "Como funciona a gestão de leads?",
      answer: "Centralizamos todos os seus leads em uma única plataforma, implementamos sistema de qualificação BANT, criamos automações para nutrição e distribuição inteligente para sua equipe comercial. Tudo com dashboard em tempo real para acompanhamento."
    }
  ];

  return (
    <section id="faq" className="py-20 bg-background section-separator">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Perguntas Frequentes
          </h2>
          <p className="text-xl text-muted-foreground">
            Tire suas dúvidas sobre nossos produtos e serviços
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <Card key={index} className="border border-border/50 hover:shadow-lg transition-all">
              <button
                onClick={() => toggleItem(index)}
                className="w-full p-6 text-left hover:bg-accent transition-colors"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-foreground pr-4">
                    {faq.question}
                  </h3>
                  <span className="text-primary text-xl flex-shrink-0">
                    {openItems.includes(index) ? '−' : '+'}
                  </span>
                </div>
              </button>
              
              {openItems.includes(index) && (
                <div className="px-6 pb-6">
                  <p className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            Não encontrou a resposta que procurava?
          </p>
          <a 
            href="#contato" 
            className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold"
          >
            Entre em Contato
          </a>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
