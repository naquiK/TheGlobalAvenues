import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { Building2, Megaphone, Users, BarChart3, Settings, Handshake, ArrowRight, Briefcase, X } from 'lucide-react';
import { useState } from 'react';

const services = [
  {
    icon: Building2,
    title: 'In-Country Representation',
    description: 'Represent international educational institutions locally and establish their presence in the South Asian market.',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Megaphone,
    title: 'Marketing & Promotion',
    description: 'Expert-driven international student recruitment with targeted marketing and promotion strategies.',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    icon: Users,
    title: 'Agent Management',
    description: 'Develop targeted recruitment strategies and provide personalized counseling for prospective students.',
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    icon: BarChart3,
    title: 'Market Research & Analysis',
    description: 'Conduct comprehensive market research to identify trends and provide strategic recommendations.',
    gradient: 'from-orange-500 to-red-500',
  },
  {
    icon: Settings,
    title: 'Administrative Services',
    description: 'Assist with assessment, application, enrollment, visa, immigration, and student support services.',
    gradient: 'from-yellow-500 to-orange-500',
  },
  {
    icon: Handshake,
    title: 'Collaboration & Partnerships',
    description: 'Enhance global reach through strategic collaboration and comprehensive student recruitment services.',
    gradient: 'from-indigo-500 to-blue-500',
  },
];

const endToEndSupport = [
  { title: 'Institutional Support', description: 'Complete strategic guidance for universities establishing presence in South Asia' },
  { title: 'Student Recruitment', description: 'Comprehensive student recruitment and admission processing' },
  { title: 'Visa & Immigration', description: 'Expert assistance with visa applications and immigration requirements' },
  { title: 'Career Guidance', description: 'Professional counseling and career path planning for students' },
  { title: 'Quality Assurance', description: 'Transparent processes with ICEF accreditation and industry standards' },
  { title: 'Continuous Support', description: 'Ongoing support throughout the entire student journey' },
];

const UniversitySolutionsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-background border border-border rounded-2xl max-w-lg w-full max-h-96 overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-primary to-secondary text-white px-8 py-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Comprehensive University Solutions</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6">
          <p className="text-lg text-muted-foreground leading-relaxed">
            Our comprehensive university solutions provide international educational institutions with complete support to establish and expand their presence in the South Asian market.
          </p>

          <div className="space-y-4">
            <h3 className="text-lg font-bold text-foreground">Key Benefits:</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold mt-1">•</span>
                <span>In-country representation and local market establishment</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold mt-1">•</span>
                <span>Expert-driven student recruitment and marketing strategies</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold mt-1">•</span>
                <span>Comprehensive market research and strategic analysis</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold mt-1">•</span>
                <span>Full administrative and student support services</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold mt-1">•</span>
                <span>Strategic partnerships and collaboration opportunities</span>
              </li>
            </ul>
            
          </div>

          <button onClick={onClose} className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-secondary transition-all duration-300">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const EducationalSolutionsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-background border border-border rounded-2xl max-w-lg w-full max-h-96 overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-accent to-primary text-white px-8 py-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Complete Educational Solutions</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6">
          <p className="text-lg text-muted-foreground leading-relaxed">
            From institutional representation to student success, we provide complete educational solutions at every stage of the international education journey.
          </p>

          <div className="space-y-4">
            <h3 className="text-lg font-bold text-foreground">Our Services Include:</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-3">
                <span className="text-accent font-bold mt-1">✓</span>
                <span>Institutional support and strategic guidance</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent font-bold mt-1">✓</span>
                <span>Comprehensive student recruitment</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent font-bold mt-1">✓</span>
                <span>Visa and immigration assistance</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent font-bold mt-1">✓</span>
                <span>Professional career guidance and counseling</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent font-bold mt-1">✓</span>
                <span>Quality assurance and ongoing student support</span>
              </li>
            </ul>
          </div>

          <button onClick={onClose} className="w-full px-6 py-3 bg-accent text-white rounded-lg font-semibold hover:bg-accent/90 transition-all duration-300">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const ServiceCardModal = ({ isOpen, onClose, service }) => {
  if (!isOpen || !service) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-background border border-border rounded-2xl max-w-lg w-full max-h-96 overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className={`sticky top-0 bg-gradient-to-r ${service.gradient} text-white px-8 py-6 flex justify-between items-center`}>
          <h2 className="text-2xl font-bold">{service.title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6">
          <p className="text-lg text-muted-foreground leading-relaxed">
            {service.description}
          </p>

          <div className="space-y-4">
            <h3 className="text-lg font-bold text-foreground">Key Features:</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold mt-1">•</span>
                <span>Expert professional guidance and support</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold mt-1">•</span>
                <span>Comprehensive service delivery</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold mt-1">•</span>
                <span>Tailored solutions for your needs</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold mt-1">•</span>
                <span>Quality assurance and transparency</span>
              </li>
            </ul>
          </div>

          <button onClick={onClose} className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-secondary transition-all duration-300">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const EndToEndModal = ({ isOpen, onClose, item }) => {
  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-background border border-border rounded-2xl max-w-lg w-full max-h-96 overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-accent to-accent/80 text-white px-8 py-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold">{item.title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6">
          <p className="text-lg text-muted-foreground leading-relaxed">
            {item.description}
          </p>

          <div className="space-y-4">
            <h3 className="text-lg font-bold text-foreground">What We Provide:</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-3">
                <span className="text-accent font-bold mt-1">✓</span>
                <span>Professional and experienced team support</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent font-bold mt-1">✓</span>
                <span>Comprehensive service coverage</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent font-bold mt-1">✓</span>
                <span>Quality assurance and best practices</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent font-bold mt-1">✓</span>
                <span>Ongoing support and updates</span>
              </li>
            </ul>
          </div>

          <button onClick={onClose} className="w-full px-6 py-3 bg-accent text-white rounded-lg font-semibold hover:bg-accent/90 transition-all duration-300">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export function Services() {
  // each section needs its own observer so the headers animate independently
  const [headerRef, headerIsVisible] = useScrollAnimation();
  const [endRef, endIsVisible] = useScrollAnimation();
  const [showUniversityModal, setShowUniversityModal] = useState(false);
  const [showEducationalModal, setShowEducationalModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedEndToEnd, setSelectedEndToEnd] = useState(null);

  const handleUniversityClick = () => {
    setShowUniversityModal(true);
  };

  const handleEducationalClick = () => {
    setShowEducationalModal(true);
  };

  const handleServiceCardClick = (service) => {
    setSelectedService(service);
  };

  const handleEndToEndClick = (item) => {
    setSelectedEndToEnd(item);
  };

  return (
    <section id="services" className="py-20 px-4 bg-muted/30 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-secondary/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl -z-10"></div>

      <div className="max-w-7xl mx-auto w-full">
        {/* Header */}
        <div
          ref={headerRef}
          className={`text-center mb-16 transition-all duration-1000 ${
            headerIsVisible ? 'animate-fade-in-up' : 'opacity-0 translate-y-[30px]'
          }`}
        >
          <div className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-4">
            🎯 What We Offer
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Comprehensive University Solutions
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We provide end-to-end support to help higher education institutions expand their reach and recruit top-tier international students.
          </p>
          <button
            onClick={handleUniversityClick}
            className="mt-6 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-secondary transition-all duration-300 font-medium text-sm"
          >
            Learn More
          </button>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {services.map((service, index) => {
            const Icon = service.icon;
            const [cardRef, cardIsVisible] = useScrollAnimation();

            return (
              <div
                key={index}
                ref={cardRef}
                onClick={() => handleServiceCardClick(service)}
                className={`group p-8 bg-background border border-border rounded-2xl hover:border-primary hover:shadow-lg transition-all duration-500 hover:-translate-y-2 cursor-pointer ${
                  cardIsVisible ? 'animate-fade-in-up' : 'opacity-0 translate-y-[30px]'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {/* Icon */}
                <div className={`inline-block p-4 bg-gradient-to-br ${service.gradient} rounded-xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                  {service.title}
                </h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {service.description}
                </p>

                {/* Link */}
                <div className="flex items-center text-primary font-semibold group-hover:gap-2 transition-all">
                  Learn more
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>

        {/* End-to-End Support Section */}
        <div className="mt-24 pt-20 border-t border-border">
          <div
            ref={endRef}
            className={`text-center mb-16 transition-all duration-1000 ${
              endIsVisible ? 'animate-fade-in-up' : 'opacity-0 translate-y-[30px]'
            }`}
          >
            <div className="inline-block px-4 py-2 bg-accent/10 text-accent rounded-full text-sm font-semibold mb-4">
              🌍 Offering End-to-End Support
            </div>
            <h3 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Complete Educational Solutions
            </h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From institutional representation to student success, we provide comprehensive support at every stage of the international education journey.
            </p>
     
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {endToEndSupport.map((item, index) => (
              <div
                key={index}
                onClick={() => handleEndToEndClick(item)}
                className="p-8 bg-gradient-to-br from-primary/5 to-secondary/5 border border-border rounded-2xl hover:border-accent hover:shadow-lg transition-all duration-500 hover:-translate-y-2 animate-fade-in-up cursor-pointer group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start gap-3 mb-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center group-hover:bg-accent/30 transition-colors">
                    <Briefcase className="w-5 h-5 text-accent" />
                  </div>
                </div>
                <h4 className="text-xl font-bold text-foreground mb-2 group-hover:text-accent transition-colors">{item.title}</h4>
                <p className="text-muted-foreground">{item.description}</p>
                  <div className="flex mt-10 items-center text-primary font-semibold group-hover:gap-2 transition-all">
                  Learn more
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
              
            ))}
          </div>
        </div>
      </div>

      {/* Modals */}
      <UniversitySolutionsModal isOpen={showUniversityModal} onClose={() => setShowUniversityModal(false)} />
      <EducationalSolutionsModal isOpen={showEducationalModal} onClose={() => setShowEducationalModal(false)} />
      <ServiceCardModal isOpen={selectedService !== null} onClose={() => setSelectedService(null)} service={selectedService} />
      <EndToEndModal isOpen={selectedEndToEnd !== null} onClose={() => setSelectedEndToEnd(null)} item={selectedEndToEnd} />
    </section>
  );
}
