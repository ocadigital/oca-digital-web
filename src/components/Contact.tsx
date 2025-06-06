
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    companyType: '',
    service: '',
    message: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = 'Nome é obrigatório';
    if (!formData.email.trim()) {
      newErrors.email = 'E-mail é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'E-mail inválido';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Telefone é obrigatório';
    if (!formData.companyType) newErrors.companyType = 'Tipo de empresa é obrigatório';
    if (!formData.service) newErrors.service = 'Serviço de interesse é obrigatório';
    if (!formData.message.trim()) newErrors.message = 'Mensagem é obrigatória';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      alert('Formulário enviado com sucesso!');
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        companyType: '',
        service: '',
        message: ''
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <section id="contato" className="py-20 bg-gray-50">
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
          <Card className="p-8 bg-white border-gray-200">
            <h3 className="text-2xl font-bold mb-6 text-gray-900">Envie sua mensagem</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    name="name"
                    placeholder="Nome"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500 ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>
                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="E-mail"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Telefone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500 ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>
                <div>
                  <select 
                    name="companyType"
                    value={formData.companyType}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 ${errors.companyType ? 'border-red-500' : 'border-gray-300'}`}
                  >
                    <option value="">Tipo de empresa</option>
                    <option value="corretor-autonomo">Corretor Autônomo</option>
                    <option value="pequena-imobiliaria">Pequena Imobiliária</option>
                    <option value="media-imobiliaria">Média Imobiliária</option>
                    <option value="grande-imobiliaria">Grande Imobiliária</option>
                    <option value="incorporadora">Incorporadora</option>
                  </select>
                  {errors.companyType && <p className="text-red-500 text-sm mt-1">{errors.companyType}</p>}
                </div>
              </div>
              <div>
                <select 
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 ${errors.service ? 'border-red-500' : 'border-gray-300'}`}
                >
                  <option value="">Serviço de interesse</option>
                  <option value="diagnostico">Diagnóstico Estratégico</option>
                  <option value="sdr">SDR - Núcleo de Pré-qualificação</option>
                  <option value="automacao">Automação de Marketing</option>
                  <option value="lancamento">Lançamento Imobiliário</option>
                  <option value="oca-one">OCA One</option>
                  <option value="oca-base">OCA Base</option>
                  <option value="pacotes">Pacotes Mensais</option>
                </select>
                {errors.service && <p className="text-red-500 text-sm mt-1">{errors.service}</p>}
              </div>
              <div>
                <textarea
                  rows={4}
                  name="message"
                  placeholder="Conte-nos sobre seu desafio atual..."
                  value={formData.message}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500 ${errors.message ? 'border-red-500' : 'border-gray-300'}`}
                ></textarea>
                {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
              </div>
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 font-semibold">
                Enviar Mensagem
              </Button>
            </form>
          </Card>

          <div className="space-y-8">
            <Card className="p-6 bg-white border-gray-200">
              <h4 className="font-bold text-xl mb-4 text-gray-900">Informações de Contato</h4>
              <div className="space-y-4">
                <div>
                  <div className="font-semibold text-gray-800">📧 E-mail</div>
                  <div className="text-gray-600">contato@ocadigital.com.br</div>
                </div>
                <div>
                  <div className="font-semibold text-gray-800">📱 WhatsApp</div>
                  <div className="text-gray-600">(48) 99679-0700</div>
                </div>
                <div>
                  <div className="font-semibold text-gray-800">📍 Localização</div>
                  <div className="text-gray-600">Florianópolis, SC - Atendimento Nacional</div>
                </div>
                <div>
                  <div className="font-semibold text-gray-800">🕐 Horário de Atendimento</div>
                  <div className="text-gray-600">Segunda a Sexta: 9h às 18h</div>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-blue-50 border-blue-200">
              <h4 className="font-bold text-xl mb-4 text-blue-800">Consultoria Gratuita</h4>
              <p className="text-blue-700 mb-4">
                Agende uma conversa de 30 minutos para entender como podemos ajudar 
                sua imobiliária a crescer com marketing digital.
              </p>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold">
                Agendar Consultoria Gratuita
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
