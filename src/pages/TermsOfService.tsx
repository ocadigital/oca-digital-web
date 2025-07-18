
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">Termos de Uso</h1>
            
            <p className="text-gray-600 mb-8">
              <strong>Última atualização:</strong> {new Date().toLocaleDateString('pt-BR')}
            </p>

            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Aceitação dos Termos</h2>
                <p className="text-gray-700 mb-4">
                  Ao acessar e usar os serviços da OCA Digital, você concorda em cumprir e estar 
                  vinculado aos termos e condições de uso descritos neste documento. Se você não 
                  concordar com qualquer parte destes termos, não deve usar nossos serviços.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Descrição dos Serviços</h2>
                <p className="text-gray-700 mb-4">
                  A OCA Digital oferece serviços de marketing digital especializado para o setor 
                  imobiliário, incluindo:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Consultoria em marketing digital</li>
                  <li>Gestão de campanhas publicitárias</li>
                  <li>Desenvolvimento e otimização de websites</li>
                  <li>Automação de marketing</li>
                  <li>Análise de dados e relatórios</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Elegibilidade</h2>
                <p className="text-gray-700 mb-4">
                  Nossos serviços são destinados a empresas e profissionais do setor imobiliário. 
                  Ao usar nossos serviços, você declara ter capacidade legal para celebrar contratos.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Responsabilidades do Usuário</h2>
                <p className="text-gray-700 mb-4">Você se compromete a:</p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Fornecer informações verdadeiras e atualizadas</li>
                  <li>Manter a confidencialidade de suas credenciais de acesso</li>
                  <li>Usar os serviços de forma legal e ética</li>
                  <li>Não interferir no funcionamento dos sistemas</li>
                  <li>Respeitar direitos de propriedade intelectual</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Propriedade Intelectual</h2>
                <p className="text-gray-700 mb-4">
                  Todo o conteúdo presente em nossos serviços, incluindo textos, imagens, logotipos, 
                  códigos e metodologias, são de propriedade da OCA Digital ou de seus licenciadores 
                  e estão protegidos por leis de direitos autorais.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Limitação de Responsabilidade</h2>
                <p className="text-gray-700 mb-4">
                  A OCA Digital não se responsabiliza por:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Danos indiretos ou consequenciais</li>
                  <li>Perda de dados ou lucros cessantes</li>
                  <li>Interrupções temporárias dos serviços</li>
                  <li>Ações de terceiros</li>
                  <li>Força maior ou caso fortuito</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Pagamentos e Cancelamentos</h2>
                <p className="text-gray-700 mb-4">
                  Os termos de pagamento e cancelamento são específicos para cada serviço contratado 
                  e serão definidos em contrato específico ou proposta comercial aceita pelo cliente.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Modificações dos Termos</h2>
                <p className="text-gray-700 mb-4">
                  Reservamo-nos o direito de modificar estes termos a qualquer momento. 
                  As alterações entrarão em vigor imediatamente após a publicação. 
                  O uso continuado dos serviços constitui aceitação dos novos termos.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Rescisão</h2>
                <p className="text-gray-700 mb-4">
                  Podemos rescindir ou suspender seu acesso aos serviços imediatamente, 
                  sem aviso prévio, por qualquer motivo, incluindo violação destes termos.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Lei Aplicável</h2>
                <p className="text-gray-700 mb-4">
                  Estes termos são regidos pelas leis brasileiras. Qualquer disputa será 
                  resolvida nos tribunais competentes do Brasil.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Contato</h2>
                <p className="text-gray-700 mb-4">
                  Para dúvidas sobre estes termos, entre em contato:
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700"><strong>E-mail:</strong> contato@ocadigital.com.br</p>
                  <p className="text-gray-700"><strong>Telefone:</strong> (11) 99999-9999</p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TermsOfService;
