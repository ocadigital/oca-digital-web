
import { Card } from '@/components/ui/card';
import { useState } from 'react';
import { Link } from 'react-router-dom';

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
      answer: "Analisamos a sua operação como ela é hoje, o marketing, o processo comercial e as ferramentas, e aponta onde estão as oportunidades. Leva cerca de 1 semana e você recebe um relatório com o plano de ação para a sua imobiliária."
    },
    {
      question: "Vocês trabalham apenas com imobiliárias de Florianópolis?",
      answer: "Não. A sede é em Florianópolis, mas atendemos o Brasil todo, porque o trabalho é digital e as reuniões podem ser online."
    },
    {
      question: "Quanto tempo leva para ver resultados?",
      answer: "Depende do serviço. Nos anúncios, os primeiros leads chegam já na primeira semana e o custo de cada lead cai até o 3º mês. No CRM, já no primeiro mês nenhum lead fica sem resposta e o atendimento fica mais rápido. No site, a busca orgânica começa a crescer a partir do 3º mês, porque o Google leva esse tempo para posicionar as páginas."
    },
    {
      question: "Vocês oferecem suporte técnico?",
      answer: "Sim. Todo cliente tem suporte em horário comercial, das 9h às 18h, de segunda a sexta, e quem tem acompanhamento mensal tem atendimento prioritário e uma reunião de consultoria por mês."
    },
    {
      question: "É possível cancelar os serviços a qualquer momento?",
      answer: "Sim. Os contratos mensais podem ser cancelados com 30 dias de aviso, sem fidelidade. Os serviços pontuais seguem o cronograma combinado."
    },
    {
      question: "Vocês trabalham com incorporadoras?",
      answer: "Sim. Fizemos, por exemplo, a captação do Sunclub Campeche, com 173 leads em 1 semana, e o site da VivaOn, com 4 empreendimentos no ar em 60 dias. Atendemos pré-lançamento, lançamento e pós-venda."
    },
    {
      question: "O que é o Modelo de Maturidade Imobiliária e como descubro o nível da minha imobiliária?",
      answer: "É um modelo de 5 níveis, do artesanal à IA, que a OCA Digital montou para a rotina de imobiliárias a partir dos modelos usados por empresas de tecnologia para medir a maturidade dos processos. Ele mostra em que estágio a operação está e o que trava a passagem para o próximo nível. Para descobrir o seu, faça o Teste de Maturidade Imobiliária em https://www.ocadigital.com.br/teste-maturidade: são 10 perguntas, leva menos de 3 minutos e o resultado traz o seu nível, a frente mais fraca da operação e o próximo passo, com PDF para baixar.",
      link: { to: "/teste-maturidade", label: "Fazer o teste de maturidade" }
    },
    {
      question: "Como funciona a gestão de leads?",
      answer: "Todos os leads vão para um lugar só. Montamos um roteiro de perguntas para separar quem tem orçamento e prazo de quem só está olhando, automatiza o acompanhamento de quem ainda não está pronto e distribui os contatos entre os corretores, e você acompanha tudo num painel em tempo real."
    }
  ];

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <section id="faq" className="py-20 bg-background section-separator">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Perguntas Frequentes
          </h2>
          <p className="text-xl text-muted-foreground">
            Tire suas dúvidas sobre como a OCA trabalha
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
                  {'link' in faq && faq.link && (
                    <Link
                      to={faq.link.to}
                      className="inline-flex items-center mt-4 text-primary font-semibold underline underline-offset-4 hover:text-primary/80"
                    >
                      {faq.link.label}
                    </Link>
                  )}
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
