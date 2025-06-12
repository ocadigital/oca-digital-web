
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">Política de Privacidade</h1>
            
            <p className="text-gray-600 mb-8">
              <strong>Última atualização:</strong> {new Date().toLocaleDateString('pt-BR')}
            </p>

            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Informações Gerais</h2>
                <p className="text-gray-700 mb-4">
                  A OCA Digital está comprometida em proteger a privacidade e os dados pessoais de nossos usuários. 
                  Esta Política de Privacidade descreve como coletamos, usamos, armazenamos e protegemos suas informações 
                  quando você utiliza nossos serviços.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Dados Coletados</h2>
                <p className="text-gray-700 mb-4">Coletamos os seguintes tipos de informações:</p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li><strong>Dados de Identificação:</strong> Nome, e-mail, telefone</li>
                  <li><strong>Dados Profissionais:</strong> Empresa, cargo, setor de atuação</li>
                  <li><strong>Dados de Navegação:</strong> Cookies, endereço IP, páginas visitadas</li>
                  <li><strong>Dados de Comunicação:</strong> Mensagens enviadas através de formulários</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Finalidade do Tratamento</h2>
                <p className="text-gray-700 mb-4">Utilizamos seus dados para:</p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Prestação de serviços de marketing digital</li>
                  <li>Comunicação sobre nossos produtos e serviços</li>
                  <li>Envio de materiais educativos e newsletters</li>
                  <li>Análise e melhoria de nossos serviços</li>
                  <li>Cumprimento de obrigações legais</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Base Legal</h2>
                <p className="text-gray-700 mb-4">
                  O tratamento de seus dados pessoais é realizado com base no consentimento, 
                  execução de contrato, legítimo interesse e cumprimento de obrigação legal, 
                  conforme a Lei Geral de Proteção de Dados (LGPD).
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Compartilhamento de Dados</h2>
                <p className="text-gray-700 mb-4">
                  Não vendemos, alugamos ou compartilhamos seus dados pessoais com terceiros, 
                  exceto nas seguintes situações:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Com seu consentimento expresso</li>
                  <li>Para cumprimento de obrigações legais</li>
                  <li>Com prestadores de serviços essenciais</li>
                  <li>Em caso de transferência de negócios</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Segurança dos Dados</h2>
                <p className="text-gray-700 mb-4">
                  Implementamos medidas técnicas e administrativas adequadas para proteger 
                  seus dados contra acesso não autorizado, alteração, divulgação ou destruição.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Seus Direitos</h2>
                <p className="text-gray-700 mb-4">Você tem o direito de:</p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Confirmar a existência de tratamento</li>
                  <li>Acessar seus dados</li>
                  <li>Corrigir dados incompletos ou inexatos</li>
                  <li>Solicitar a exclusão de dados</li>
                  <li>Revogar o consentimento</li>
                  <li>Obter informações sobre compartilhamento</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Retenção de Dados</h2>
                <p className="text-gray-700 mb-4">
                  Mantemos seus dados pelo tempo necessário para cumprir as finalidades para as quais 
                  foram coletados, respeitando os prazos legais aplicáveis.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Alterações</h2>
                <p className="text-gray-700 mb-4">
                  Esta Política pode ser atualizada periodicamente. Recomendamos que você 
                  revise regularmente esta página para se manter informado sobre nossas práticas.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Contato</h2>
                <p className="text-gray-700 mb-4">
                  Para exercer seus direitos ou esclarecer dúvidas sobre esta Política, 
                  entre em contato conosco:
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

export default PrivacyPolicy;
