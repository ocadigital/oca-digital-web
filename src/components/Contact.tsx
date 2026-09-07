
import ContactForm from './contact/ContactForm';
import ContactInfo from './contact/ContactInfo';
import ConsultationCard from './contact/ConsultationCard';

interface ContactProps {
  /** Use when Contact is rendered as its own page (not a homepage section) so it gets a real h1. */
  asPage?: boolean;
}

const Contact = ({ asPage = false }: ContactProps) => {
  const HeadingTag = asPage ? 'h1' : 'h2';

  return (
    <section id="contato" className="py-20 bg-secondary section-separator">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <HeadingTag className="text-4xl font-bold text-foreground mb-4">
            Entre em Contato
          </HeadingTag>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Pronto para transformar sua imobiliária? Vamos conversar sobre suas necessidades e objetivos.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <ContactForm />

          <div className="space-y-8">
            <ContactInfo />
            <ConsultationCard />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
