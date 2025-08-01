
import { Helmet } from 'react-helmet';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
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
        <title>OCA Digital - Marketing Imobiliário Especializado | Florianópolis SC</title>
        <meta name="description" content="Especialistas em marketing imobiliário que combinam estratégia, dados e automação para transformar sua operação em uma máquina de conversão. Atendimento em Florianópolis e todo Brasil." />
        <meta name="keywords" content="marketing imobiliário, leads imobiliários, automação marketing, diagnóstico estratégico, CRM imobiliário, Florianópolis, Santa Catarina" />
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <!-- Google Tag Manager -->
        <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','GTM-PNSF7DC');</script>
        <!-- End Google Tag Manager -->
      </Helmet>
      <div className="min-h-screen">
        <Header />
        <main>
          <!-- Google Tag Manager (noscript) -->
          <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-PNSF7DC"
          height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
          <!-- End Google Tag Manager (noscript) -->
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
