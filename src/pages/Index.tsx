
import { Helmet } from 'react-helmet';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import About from '@/components/About';
import Products from '@/components/Products';
import Testimonials from '@/components/Testimonials';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <>
      <Helmet>
        <title>OCA Digital - Marketing Imobiliário Especializado | Florianópolis SC</title>
        <meta name="description" content="Especialistas em marketing imobiliário que combinam estratégia, dados e automação para transformar sua operação em uma máquina de conversão. Atendimento em Florianópolis e todo Brasil." />
        <meta name="keywords" content="marketing imobiliário, leads imobiliários, automação marketing, SEO imobiliário, CRM imobiliário, Florianópolis, Santa Catarina" />
        <meta name="author" content="OCA Digital" />
        <meta property="og:title" content="OCA Digital - Marketing Imobiliário Especializado" />
        <meta property="og:description" content="Transforme sua imobiliária em uma máquina de conversão com nossa consultoria especializada em marketing imobiliário." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ocadigital.com.br" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="OCA Digital - Marketing Imobiliário Especializado" />
        <meta name="twitter:description" content="Especialistas em marketing imobiliário que combinam estratégia, dados e automação para transformar sua operação em uma máquina de conversão." />
        <link rel="canonical" href="https://ocadigital.com.br" />
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
          <Contact />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
