import { Helmet } from 'react-helmet';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Products from '@/components/Products';

const ProdutosPage = () => {
  return (
    <div className="min-h-screen bg-background pt-24">
      <Helmet>
        <title>Produtos e Cursos | OCA Digital</title>
        <meta
          name="description"
          content="Conheça o OCA One, o OCA Base e o Curso para Corretores: soluções da OCA Digital para automatizar a captação de leads e profissionalizar sua operação imobiliária."
        />
        <link rel="canonical" href="https://www.ocadigital.com.br/produtos" />
        <meta property="og:title" content="Produtos e Cursos | OCA Digital" />
        <meta
          property="og:description"
          content="Conheça o OCA One, o OCA Base e o Curso para Corretores: soluções da OCA Digital para automatizar a captação de leads e profissionalizar sua operação imobiliária."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.ocadigital.com.br/produtos" />
      </Helmet>
      <Header />
      <Products asPage />
      <Footer />
    </div>
  );
};

export default ProdutosPage;
