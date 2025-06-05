
import { ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const Hero = () => {
  return (
    <section id="inicio" className="pt-16 min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold text-white leading-tight">
                Transforme sua
                <span className="text-blue-400"> Imobiliária</span>
                <br />
                em uma Máquina de
                <span className="text-blue-400"> Conversão</span>
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed">
                Especialistas em marketing imobiliário que combinam estratégia, dados e automação 
                para gerar mais leads qualificados e impulsionar suas vendas.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-4">
                Baixar E-book Gratuito
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-4 border-gray-600 text-gray-300 hover:bg-gray-700">
                Agendar Consultoria
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-8 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">+200%</div>
                <div className="text-sm text-gray-400">Aumento em Leads</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">+150%</div>
                <div className="text-sm text-gray-400">ROI Médio</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">50+</div>
                <div className="text-sm text-gray-400">Clientes Ativos</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <Card className="p-8 bg-gray-800 shadow-2xl border-gray-700">
              <h3 className="text-2xl font-bold mb-6 text-center text-white">
                🎯 Diagnóstico Gratuito
              </h3>
              <form className="space-y-4">
                <input
                  type="text"
                  placeholder="Nome completo"
                  className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-700 text-white placeholder-gray-400"
                />
                <input
                  type="email"
                  placeholder="E-mail profissional"
                  className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-700 text-white placeholder-gray-400"
                />
                <input
                  type="tel"
                  placeholder="WhatsApp"
                  className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-700 text-white placeholder-gray-400"
                />
                <select className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-700 text-white">
                  <option>Tamanho da sua empresa</option>
                  <option>Corretor Autônomo</option>
                  <option>Pequena Imobiliária (2-10 corretores)</option>
                  <option>Média Imobiliária (11-50 corretores)</option>
                  <option>Grande Imobiliária (50+ corretores)</option>
                </select>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 py-3">
                  Receber Diagnóstico Gratuito
                </Button>
              </form>
              <p className="text-xs text-gray-400 text-center mt-4">
                Seus dados estão protegidos. Não fazemos spam.
              </p>
            </Card>
          </div>
        </div>

        <div className="text-center mt-16">
          <ArrowDown className="mx-auto text-gray-500 animate-bounce" size={32} />
        </div>
      </div>
    </section>
  );
};

export default Hero;
