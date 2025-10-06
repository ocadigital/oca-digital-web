
import ContactForm from './contact/ContactForm';
import ContactInfo from './contact/ContactInfo';
import ConsultationCard from './contact/ConsultationCard';

const Contact = () => {
  return (
    <section id="contato" className="py-20 bg-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Entre em Contato
          </h2>
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
