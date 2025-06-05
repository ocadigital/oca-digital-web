
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const Contact = () => {
  return (
    <section id="contato" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Entre em Contato
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Pronto para transformar sua imobiliária? Vamos conversar sobre suas necessidades e objetivos.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <Card className="p-8">
            <h3 className="text-2xl font-bold mb-6">Envie sua mensagem</h3>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Nome"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="email"
                  placeholder="E-mail"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="tel"
                  placeholder="Telefone"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option>Tipo de empresa</option>
                  <option>Corretor Autônomo</option>
                  <option>Pequena Imobiliária</option>
                  <option>Média Imobiliária</option>
                  <option>Grande Imobiliária</option>
                  <option>Incorporadora</option>
                </select>
              </div>
              <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option>Serviço de interesse</option>
                <option>Diagnóstico Estratégico</option>
                <option>SDR - Núcleo de Pré-qualificação</option>
                <option>SEO Avançado</option>
                <option>Automação de Marketing</option>
                <option>Lançamento Imobiliário</option>
                <option>OCA One</option>
                <option>OCA Base</option>
                <option>Pacotes Mensais</option>
              </select>
              <textarea
                rows={4}
                placeholder="Conte-nos sobre seu desafio atual..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              ></textarea>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 py-3">
                Enviar Mensagem
              </Button>
            </form>
          </Card>

          <div className="space-y-8">
            <Card className="p-6">
              <h4 className="font-bold text-xl mb-4">Informações de Contato</h4>
              <div className="space-y-4">
                <div>
                  <div className="font-semibold">📧 E-mail</div>
                  <div className="text-gray-600">contato@ocadigital.com.br</div>
                </div>
                <div>
                  <div className="font-semibold">📱 WhatsApp</div>
                  <div className="text-gray-600">(11) 99999-9999</div>
                </div>
                <div>
                  <div className="font-semibold">📍 Localização</div>
                  <div className="text-gray-600">São Paulo, SP - Atendimento Nacional</div>
                </div>
                <div>
                  <div className="font-semibold">🕐 Horário de Atendimento</div>
                  <div className="text-gray-600">Segunda a Sexta: 9h às 18h</div>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-blue-50 border-blue-200">
              <h4 className="font-bold text-xl mb-4 text-blue-900">Consultoria Gratuita</h4>
              <p className="text-blue-800 mb-4">
                Agende uma conversa de 30 minutos para entender como podemos ajudar 
                sua imobiliária a crescer com marketing digital.
              </p>
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                Agendar Consultoria Gratuita
              </Button>
            </Card>

            <Card className="p-6 bg-green-50 border-green-200">
              <h4 className="font-bold text-xl mb-4 text-green-900">Diagnóstico Estratégico</h4>
              <p className="text-green-800 mb-4">
                Análise completa da sua operação atual com sugestões práticas 
                para melhorar seus resultados.
              </p>
              <div className="text-2xl font-bold text-green-600 mb-4">R$ 3.000</div>
              <Button variant="outline" className="w-full border-green-600 text-green-600 hover:bg-green-100">
                Contratar Diagnóstico
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
