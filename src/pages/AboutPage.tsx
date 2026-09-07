import { Helmet } from 'react-helmet';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import About from '@/components/About';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-background pt-24">
      <Helmet>
        <title>Sobre a OCA Digital | Marketing Imobiliário com IA</title>
        <meta
          name="description"
          content="Conheça a história, a metodologia e os pilares da OCA Digital, agência especialista em marketing imobiliário sediada em Florianópolis."
        />
        <link rel="canonical" href="https://www.ocadigital.com.br/about" />
        <meta property="og:title" content="Sobre a OCA Digital | Marketing Imobiliário com IA" />
        <meta
          property="og:description"
          content="Conheça a história, a metodologia e os pilares da OCA Digital, agência especialista em marketing imobiliário sediada em Florianópolis."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.ocadigital.com.br/about" />
      </Helmet>
      <Header />
      <About asPage />
      <Footer />
    </div>
  );
};

export default AboutPage;
