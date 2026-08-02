
import { Helmet } from 'react-helmet';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Clients from '@/components/Clients';
import Services from '@/components/Services';
import About from '@/components/About';
import Products from '@/components/Products';
import Testimonials from '@/components/Testimonials';
import Blog from '@/components/Blog';
import FAQ from '@/components/FAQ';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <>
      <Helmet>
        <title>OCA Digital | Marketing Imobiliário com IA</title>
        <meta name="description" content="Marketing imobiliário com estratégia, dados e automação. Gere mais leads qualificados em Florianópolis e em todo o Brasil." />
        <meta name="keywords" content="marketing imobiliário, leads imobiliários, automação marketing, diagnóstico estratégico, CRM imobiliário, Florianópolis, Santa Catarina" />
        <meta name="author" content="OCA Digital" />
        <meta property="og:title" content="OCA Digital | Marketing Imobiliário com IA" />
        <meta property="og:description" content="Transforme sua imobiliária em uma máquina de conversão com marketing imobiliário orientado a dados." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://oca-digital-web.lovable.app/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="OCA Digital | Marketing Imobiliário com IA" />
        <meta name="twitter:description" content="Transforme sua imobiliária em uma máquina de conversão com marketing imobiliário orientado a dados." />
        <link rel="canonical" href="https://oca-digital-web.lovable.app/" />
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow" />
      </Helmet>
      <div className="min-h-screen">
        <Header />
        <main>
          <Hero />
          <Services />
          <About />
          <Products />
          <Testimonials />
          <Blog />
          <FAQ />
          <Contact />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
