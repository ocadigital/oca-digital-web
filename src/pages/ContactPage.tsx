import { Helmet } from 'react-helmet';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Contact from '@/components/Contact';

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-background pt-24">
      <Helmet>
        <title>Contato | OCA Digital</title>
        <meta
          name="description"
          content="Fale com a OCA Digital: e-mail, WhatsApp e horário de atendimento para tirar dúvidas ou agendar uma consultoria gratuita."
        />
        <link rel="canonical" href="https://www.ocadigital.com.br/contact" />
        <meta property="og:title" content="Contato | OCA Digital" />
        <meta
          property="og:description"
          content="Fale com a OCA Digital: e-mail, WhatsApp e horário de atendimento para tirar dúvidas ou agendar uma consultoria gratuita."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.ocadigital.com.br/contact" />
      </Helmet>
      <Header />
      <Contact asPage />
      <Footer />
    </div>
  );
};

export default ContactPage;
