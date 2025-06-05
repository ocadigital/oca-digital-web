
const Footer = () => {
  return (
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <img 
              src="/lovable-uploads/59b9e7e2-b0cd-4eba-9ab0-4502658f48db.png" 
              alt="OCA Digital" 
              className="h-8 w-auto mb-4"
            />
            <p className="text-gray-400 mb-4 max-w-md">
              Especialistas em marketing imobiliário que combinam estratégia, dados e automação 
              para transformar sua operação em uma máquina de conversão.
            </p>
            <div className="text-gray-400">
              <div>📧 contato@ocadigital.com.br</div>
              <div>📱 (11) 99999-9999</div>
            </div>
          </div>

          <div>
            <h3 className="font-bold mb-4 text-white">Serviços</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#servicos" className="hover:text-blue-400 transition-colors">SDR - Pré-qualificação</a></li>
              <li><a href="#servicos" className="hover:text-blue-400 transition-colors">SEO Avançado</a></li>
              <li><a href="#servicos" className="hover:text-blue-400 transition-colors">Automação de Marketing</a></li>
              <li><a href="#servicos" className="hover:text-blue-400 transition-colors">Lançamentos</a></li>
              <li><a href="#servicos" className="hover:text-blue-400 transition-colors">Pacotes Mensais</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4 text-white">Produtos</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#produtos" className="hover:text-blue-400 transition-colors">OCA One</a></li>
              <li><a href="#produtos" className="hover:text-blue-400 transition-colors">OCA Base</a></li>
              <li><a href="#produtos" className="hover:text-blue-400 transition-colors">Curso para Corretores</a></li>
              <li><a href="#contato" className="hover:text-blue-400 transition-colors">Consultoria Gratuita</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-500 text-sm">
              © 2024 OCA Digital. Todos os direitos reservados.
            </div>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="/politica-privacidade" className="text-gray-500 hover:text-blue-400 transition-colors text-sm">
                Política de Privacidade
              </a>
              <a href="/termos-uso" className="text-gray-500 hover:text-blue-400 transition-colors text-sm">
                Termos de Uso
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
