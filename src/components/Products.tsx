
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const Products = () => {
  return (
    <section id="produtos" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Nossos Produtos
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Soluções inovadoras para revolucionar sua operação imobiliária
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <Card className="p-8 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <div className="flex items-center justify-center mb-6">
              <img 
                src="/lovable-uploads/e79f7b11-3826-4bd5-ab00-59394cfadb26.png" 
                alt="OCA One Icon" 
                className="h-16 w-16 mr-4"
              />
              <h3 className="text-3xl font-bold text-gray-900">OCA One</h3>
            </div>
            
            <p className="text-lg text-gray-700 mb-6">
              Uma plataforma imobiliária inteligente que centraliza os leads, automatiza a qualificação, 
              sugere imóveis em carteira e oferece inteligência de mercado — tudo via IA no WhatsApp.
            </p>

            <div className="space-y-4 mb-8">
              <div className="bg-white p-4 rounded-lg border border-blue-200">
                <h4 className="font-bold text-blue-600 mb-2">🤖 IA treinada com BANT no WhatsApp</h4>
                <p className="text-gray-700">Atendimento automatizado e pré-qualificação inteligente</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-blue-200">
                <h4 className="font-bold text-blue-600 mb-2">📊 CRM com automação integrada</h4>
                <p className="text-gray-700">Gestão completa sem custos extras de integrações</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-blue-200">
                <h4 className="font-bold text-blue-600 mb-2">🏠 Avaliação e captação inteligente</h4>
                <p className="text-gray-700">Base no comportamento real do mercado</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-blue-200">
                <h4 className="font-bold text-blue-600 mb-2">📈 Inteligência de mercado</h4>
                <p className="text-gray-700">Insights e análises para decisões estratégicas</p>
              </div>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">A partir de R$ 497/mês</div>
              <p className="text-gray-700 mb-6">Setup personalizado incluído</p>
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold">
                Agendar Demo
              </Button>
            </div>
          </Card>

          <Card className="p-8 bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200">
            <div className="flex items-center justify-center mb-6">
              <img 
                src="/lovable-uploads/2bc2982a-cd57-40a2-900d-a5859cf5face.png" 
                alt="OCA Base Icon" 
                className="h-16 w-16 mr-4"
              />
              <h3 className="text-3xl font-bold text-gray-900">OCA Base</h3>
            </div>

            <p className="text-lg text-gray-700 mb-6">
              Solução completa para pequenas imobiliárias e corretores autônomos com site profissional 
              e integração com os maiores portais do mercado.
            </p>

            <div className="space-y-4 mb-8">
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h4 className="font-bold text-gray-800 mb-2">🌐 Site profissional</h4>
                <p className="text-gray-700">Design moderno e responsivo</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h4 className="font-bold text-gray-800 mb-2">🔗 Integração com portais</h4>
                <p className="text-gray-700">Conecte-se aos maiores portais imobiliários</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h4 className="font-bold text-gray-800 mb-2">📋 Gestão de imóveis</h4>
                <p className="text-gray-700">Cadastre e organize toda sua carteira</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h4 className="font-bold text-gray-800 mb-2">💰 Preço acessível</h4>
                <p className="text-gray-700">Solução que cabe no seu orçamento</p>
              </div>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-gray-700 mb-2">Consulte valores</div>
              <p className="text-gray-600 mb-6">Planos flexíveis para seu negócio</p>
              <Button size="lg" variant="outline" className="border-gray-400 text-gray-700 hover:bg-gray-100 font-semibold">
                Agendar Demo
              </Button>
            </div>
          </Card>
        </div>

        <div className="mt-16">
          <Card className="p-8 bg-gradient-to-r from-green-50 to-green-100 border-green-200">
            <div className="text-center">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                📚 Curso para Corretores
              </h3>
              <p className="text-lg text-gray-700 mb-6">
                Treinamento completo de marketing imobiliário para corretores que querem acelerar suas vendas
              </p>
              <div className="flex items-center justify-center gap-8 mb-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">R$ 297</div>
                  <div className="text-gray-600">Acesso vitalício</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">+10h</div>
                  <div className="text-gray-600">De conteúdo</div>
                </div>
              </div>
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white font-semibold">
                Inscrever-se no Curso
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Products;
