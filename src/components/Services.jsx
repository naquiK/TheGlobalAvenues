import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BarChart3,
  Briefcase,
  Building2,
  Handshake,
  Megaphone,
  Settings,
  Users,
  X,
} from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const services = [
  {
    icon: Building2,
    title: 'In-Country Representation',
    description:
      'Represent international educational institutions locally and establish their presence in the South Asian market.',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Megaphone,
    title: 'Marketing & Promotion',
    description:
      'Expert-driven international student recruitment with targeted marketing and promotion strategies.',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    icon: Users,
    title: 'Agent Management',
    description:
      'Develop targeted recruitment strategies and provide personalized counseling for prospective students.',
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    icon: BarChart3,
    title: 'Market Research & Analysis',
    description:
      'Conduct comprehensive market research to identify trends and provide strategic recommendations.',
    gradient: 'from-orange-500 to-red-500',
  },
  {
    icon: Settings,
    title: 'Administrative Services',
    description:
      'Assist with assessment, application, enrollment, visa, immigration, and student support services.',
    gradient: 'from-yellow-500 to-orange-500',
  },
  {
    icon: Handshake,
    title: 'Collaboration & Partnerships',
    description:
      'Enhance global reach through strategic collaboration and comprehensive student recruitment services.',
    gradient: 'from-indigo-500 to-blue-500',
  },
];

const endToEndSupport = [
  {
    title: 'Institutional Support',
    description: 'Complete strategic guidance for universities establishing presence in South Asia',
  },
  {
    title: 'Student Recruitment',
    description: 'Comprehensive student recruitment and admission processing',
  },
  {
    title: 'Visa & Immigration',
    description: 'Expert assistance with visa applications and immigration requirements',
  },
  {
    title: 'Career Guidance',
    description: 'Professional counseling and career path planning for students',
  },
  {
    title: 'Quality Assurance',
    description: 'Transparent processes with ICEF accreditation and industry standards',
  },
  {
    title: 'Continuous Support',
    description: 'Ongoing support throughout the entire student journey',
  },
];

const ModalShell = ({ title, accentClass, isOpen, onClose, children }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="max-h-96 w-full max-w-lg overflow-y-auto rounded-2xl border border-border bg-background shadow-2xl"
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
      >
        <div className={`sticky top-0 flex items-center justify-between px-8 py-6 text-white ${accentClass}`}>
          <h2 className="text-2xl font-bold">{title}</h2>
          <button onClick={onClose} className="rounded-lg p-2 transition-colors hover:bg-white/20" type="button">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6 p-8">
          {children}
          <button
            onClick={onClose}
            className="w-full rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition-all duration-300 hover:bg-secondary"
            type="button"
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const UniversitySolutionsModal = ({ isOpen, onClose }) => (
  <ModalShell
    title="Comprehensive University Solutions"
    accentClass="bg-gradient-to-r from-primary to-secondary"
    isOpen={isOpen}
    onClose={onClose}
  >
    <p className="text-lg leading-relaxed text-muted-foreground">
      Our comprehensive university solutions provide international educational institutions with complete
      support to establish and expand their presence in the South Asian market.
    </p>

    <div className="space-y-4">
      <h3 className="text-lg font-bold text-foreground">Key Benefits</h3>
      <ul className="space-y-2 text-muted-foreground">
        {[
          'In-country representation and local market establishment',
          'Expert-driven student recruitment and marketing strategies',
          'Comprehensive market research and strategic analysis',
          'Full administrative and student support services',
          'Strategic partnerships and collaboration opportunities',
        ].map((item) => (
          <li key={item} className="flex items-start gap-3">
            <span className="mt-1 font-bold text-primary">*</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  </ModalShell>
);

const ServiceCardModal = ({ isOpen, onClose, service }) => {
  if (!isOpen || !service) {
    return null;
  }

  return (
    <ModalShell
      title={service.title}
      accentClass={`bg-gradient-to-r ${service.gradient}`}
      isOpen={isOpen}
      onClose={onClose}
    >
      <p className="text-lg leading-relaxed text-muted-foreground">{service.description}</p>

      <div className="space-y-4">
        <h3 className="text-lg font-bold text-foreground">Key Features</h3>
        <ul className="space-y-2 text-muted-foreground">
          {[
            'Expert professional guidance and support',
            'Comprehensive service delivery',
            'Tailored solutions for your needs',
            'Quality assurance and transparency',
          ].map((item) => (
            <li key={item} className="flex items-start gap-3">
              <span className="mt-1 font-bold text-primary">*</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </ModalShell>
  );
};

const EndToEndModal = ({ isOpen, onClose, item }) => {
  if (!isOpen || !item) {
    return null;
  }

  return (
    <ModalShell
      title={item.title}
      accentClass="bg-gradient-to-r from-accent to-accent/80"
      isOpen={isOpen}
      onClose={onClose}
    >
      <p className="text-lg leading-relaxed text-muted-foreground">{item.description}</p>

      <div className="space-y-4">
        <h3 className="text-lg font-bold text-foreground">What We Provide</h3>
        <ul className="space-y-2 text-muted-foreground">
          {[
            'Professional and experienced team support',
            'Comprehensive service coverage',
            'Quality assurance and best practices',
            'Ongoing support and updates',
          ].map((benefit) => (
            <li key={benefit} className="flex items-start gap-3">
              <span className="mt-1 font-bold text-accent">+</span>
              <span>{benefit}</span>
            </li>
          ))}
        </ul>
      </div>
    </ModalShell>
  );
};

const ServiceGridCard = ({ service, index, onClick }) => {
  const [cardRef, cardIsVisible] = useScrollAnimation();
  const Icon = service.icon;

  return (
    <div
      ref={cardRef}
      onClick={() => onClick(service)}
      className={`group cursor-pointer rounded-2xl border border-border bg-background p-8 transition-all duration-500 hover:-translate-y-2 hover:border-primary hover:shadow-lg ${
        cardIsVisible ? 'animate-fade-in-up' : 'translate-y-[30px] opacity-0'
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div
        className={`mb-6 inline-block rounded-xl bg-gradient-to-br p-4 transition-transform duration-300 group-hover:scale-110 ${service.gradient}`}
      >
        <Icon className="h-6 w-6 text-white" />
      </div>

      <h3 className="mb-3 text-xl font-bold text-foreground transition-colors group-hover:text-primary">
        {service.title}
      </h3>
      <p className="mb-6 leading-relaxed text-muted-foreground">{service.description}</p>

      <div className="flex items-center font-semibold text-primary transition-all group-hover:gap-2">
        Learn more
        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-2" />
      </div>
    </div>
  );
};

export function Services() {
  const [headerRef, headerIsVisible] = useScrollAnimation();
  const [endRef, endIsVisible] = useScrollAnimation();
  const [showUniversityModal, setShowUniversityModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedEndToEnd, setSelectedEndToEnd] = useState(null);

  return (
    <section id="services" className="relative overflow-hidden bg-muted/30 px-4 py-20">
      <div className="absolute -top-40 -right-40 -z-10 h-80 w-80 rounded-full bg-secondary/10 blur-3xl" />
      <div className="absolute -bottom-40 -left-40 -z-10 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />

      <div className="mx-auto w-full max-w-7xl">
        <div
          ref={headerRef}
          className={`mb-16 grid grid-cols-1 items-center gap-8 transition-all duration-1000 lg:grid-cols-2 ${
            headerIsVisible ? 'animate-fade-in-up' : 'translate-y-[30px] opacity-0'
          }`}
        >
          <div className="text-center lg:text-left">
            <div className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
              What We Offer
            </div>
            <h2 className="mb-4 text-4xl font-bold text-foreground lg:text-5xl">
              Comprehensive University Solutions
            </h2>
            <p className="mb-6 text-lg text-muted-foreground">
              We provide end-to-end support to help higher education institutions expand their reach and recruit top-tier international students.
            </p>
            <button
              onClick={() => setShowUniversityModal(true)}
              className="rounded-lg bg-primary px-6 py-2 text-sm font-medium text-primary-foreground transition-all duration-300 hover:bg-secondary"
              type="button"
            >
              Learn More
            </button>
          </div>

          <div className="hidden overflow-hidden rounded-2xl shadow-lg lg:block">
            <img
              src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=500&fit=crop&q=80"
              alt="Educational services"
              className="h-96 w-full object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>
        </div>

        <div className="mb-20 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <ServiceGridCard
              key={service.title}
              service={service}
              index={index}
              onClick={setSelectedService}
            />
          ))}
        </div>

        <div className="mt-24 border-t border-border pt-20">
          <div
            ref={endRef}
            className={`mb-16 text-center transition-all duration-1000 ${
              endIsVisible ? 'animate-fade-in-up' : 'translate-y-[30px] opacity-0'
            }`}
          >
            <div className="mb-4 inline-block rounded-full bg-accent/10 px-4 py-2 text-sm font-semibold text-accent">
              Offering End-to-End Support
            </div>
            <h3 className="mb-4 text-4xl font-bold text-foreground lg:text-5xl">
              Complete Educational Solutions
            </h3>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              From institutional representation to student success, we provide comprehensive support at every stage of the international education journey.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {endToEndSupport.map((item, index) => (
              <div
                key={item.title}
                onClick={() => setSelectedEndToEnd(item)}
                className="group cursor-pointer rounded-2xl border border-border bg-gradient-to-br from-primary/5 to-secondary/5 p-8 transition-all duration-500 hover:-translate-y-2 hover:border-accent hover:shadow-lg"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="mb-4 flex items-start gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-accent/20 transition-colors group-hover:bg-accent/30">
                    <Briefcase className="h-5 w-5 text-accent" />
                  </div>
                </div>
                <h4 className="mb-2 text-xl font-bold text-foreground transition-colors group-hover:text-accent">
                  {item.title}
                </h4>
                <p className="text-muted-foreground">{item.description}</p>
                <div className="mt-10 flex items-center font-semibold text-primary transition-all group-hover:gap-2">
                  Learn more
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <UniversitySolutionsModal
        isOpen={showUniversityModal}
        onClose={() => setShowUniversityModal(false)}
      />
      <ServiceCardModal
        isOpen={selectedService !== null}
        onClose={() => setSelectedService(null)}
        service={selectedService}
      />
      <EndToEndModal
        isOpen={selectedEndToEnd !== null}
        onClose={() => setSelectedEndToEnd(null)}
        item={selectedEndToEnd}
      />
    </section>
  );
}
