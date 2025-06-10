
import { Card } from '@/components/ui/card';
import { Users, Target, TrendingUp, Award } from 'lucide-react';

const About = () => {
  return (
    <section id="sobre" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Sobre a OCA Digital
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Somos uma consultoria especializada em marketing imobiliário que nasceu da necessidade 
                do mercado de ter parceiros que realmente entendem as particularidades do setor.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Nosso nome vem da sigla OCA: <strong>O</strong>rganização de Processos, <strong>C</strong>aptação de Leads e <strong>A</strong>celeração de Vendas. 
                Três pilares fundamentais que norteiam toda nossa metodologia.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Combinamos estratégia de marketing digital, análise de dados e automação para 
                transformar imobiliárias em verdadeiras máquinas de conversão, gerando resultados 
                consistentes e escaláveis.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <Card className="p-6 text-center bg-blue-50 border-blue-200">
              <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <div className="text-2xl font-bold text-gray-900 mb-2">50+</div>
              <div className="text-gray-600">Clientes Ativos</div>
            </Card>
            
            <Card className="p-6 text-center bg-green-50 border-green-200">
              <Target className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <div className="text-2xl font-bold text-gray-900 mb-2">+200%</div>
              <div className="text-gray-600">Aumento em Leads</div>
            </Card>
            
            <Card className="p-6 text-center bg-purple-50 border-purple-200">
              <TrendingUp className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <div className="text-2xl font-bold text-gray-900 mb-2">+150%</div>
              <div className="text-gray-600">ROI Médio</div>
            </Card>
            
            <Card className="p-6 text-center bg-orange-50 border-orange-200">
              <Award className="h-12 w-12 text-orange-600 mx-auto mb-4" />
              <div className="text-2xl font-bold text-gray-900 mb-2">5+</div>
              <div className="text-gray-600">Anos de Experiência</div>
            </Card>
          </div>
        </div>

        <div className="mt-16">
          <h3 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Nossa Metodologia
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h4 className="text-xl font-bold mb-2 text-gray-900">Diagnóstico</h4>
              <p className="text-gray-600">
                Análise completa da sua operação atual para identificar oportunidades de melhoria
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">2</span>
              </div>
              <h4 className="text-xl font-bold mb-2 text-gray-900">Estratégia</h4>
              <p className="text-gray-600">
                Desenvolvimento de um plano personalizado baseado nos seus objetivos e orçamento
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">3</span>
              </div>
              <h4 className="text-xl font-bold mb-2 text-gray-900">Execução</h4>
              <p className="text-gray-600">
                Implementação das soluções com acompanhamento contínuo e otimização constante
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
