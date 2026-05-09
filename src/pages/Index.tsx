import { Helmet } from 'react-helmet';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Problems from '@/components/Problems';
import OcaOne from '@/components/OcaOne';
import Features from '@/components/Features';
import Dashboards from '@/components/Dashboards';
import Automations from '@/components/Automations';
import Integrations from '@/components/Integrations';
import Cases from '@/components/Cases';
import Diagnostic from '@/components/Diagnostic';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <>
      <Helmet>
        <title>OCA Digital — Plataforma de Automação, IA e Dashboards para Operação Empresarial</title>
        <meta name="description" content="Automatize cobranças, contratos, onboarding, atendimento e indicadores em um único ecossistema inteligente. CRM, dashboards executivos e IA para escalar sua operação." />
        <meta name="keywords" content="automação empresarial, IA para empresas, dashboards financeiros, CRM inteligente, automação de cobrança, integração Asaas, automação WhatsApp, gestão operacional, SaaS de automação, OCA ONE" />
        <meta name="author" content="OCA Digital" />
        <meta property="og:title" content="OCA Digital — Plataforma de Automação e IA" />
        <meta property="og:description" content="Plataforma SaaS para automatizar cobrança, CRM, contratos e indicadores. Integrações com Asaas, ClickUp, WhatsApp e mais." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ocadigital.com.br" />
        <link rel="canonical" href="https://ocadigital.com.br" />
        <meta name="robots" content="index, follow" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: 'OCA ONE',
          applicationCategory: 'BusinessApplication',
          operatingSystem: 'Web',
          description: 'Plataforma SaaS de automação, IA e dashboards executivos.',
          offers: { '@type': 'Offer', priceCurrency: 'BRL' },
        })}</script>
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          <Hero />
          <Problems />
          <OcaOne />
          <Features />
          <Dashboards />
          <Automations />
          <Integrations />
          <Cases />
          <Diagnostic />
          <Contact />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
