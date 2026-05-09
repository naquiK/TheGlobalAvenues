import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CheckCircle, BookOpen, Users, FileText, Zap, Target, BarChart3, Briefcase } from 'lucide-react';
import Seo from '../components/seo/Seo';
import LazySection from '../components/ui/LazySection';
import { CardGridSkeleton, ProcessSkeleton, TrackListSkeleton } from '../components/ui/SkeletonLayouts';
import { SITE_NAME, SITE_URL } from '../seo/siteMeta';

const FAQ_ITEMS = [
  {
    question: 'What services does The Global Avenues provide for universities?',
    answer:
      'We provide market-entry strategy, admissions operations support, brand enablement, recruitment partner network management, compliance support, and performance analytics.',
  },
  {
    question: 'How quickly can a university launch in a new market?',
    answer:
      'Timelines depend on your program portfolio and intake targets, but we typically begin execution immediately after discovery and strategy alignment.',
  },
  {
    question: 'Do you support admissions and documentation workflows?',
    answer:
      'Yes. We help institutions standardize application workflows, document quality checks, and follow-up processes for stronger conversion outcomes.',
  },
  {
    question: 'Can you help build recruitment partner networks in India and South Asia?',
    answer:
      'Yes. We support partner onboarding, quality filtering, channel governance, and performance tracking across target markets.',
  },
  {
    question: 'How do you measure results?',
    answer:
      'We track lead sources, conversion trends, intake outcomes, and partner performance through practical analytics and regular review cycles.',
  },
];

export default function ServicesPage() {
  const services = [
    {
      icon: Target,
      title: 'Market Entry Strategy',
      description: 'Position your institution in the right markets with data-backed planning and execution roadmaps.',
      features: ['Market Assessment', 'Competitor Benchmarking', 'Channel Mapping', 'Launch Timeline'],
    },
    {
      icon: FileText,
      title: 'Admissions Operations',
      description: 'Streamline your admission pipeline with structured documentation and process governance support.',
      features: ['Application Workflow Design', 'SOP Templates', 'Documentation Standards', 'SLA Management'],
    },
    {
      icon: BookOpen,
      title: 'Brand Enablement',
      description: 'Deliver consistent institution messaging across counselor, agent, and event channels.',
      features: ['Brand Playbooks', 'Campaign Assets', 'Regional Messaging', 'Positioning Workshops'],
    },
    {
      icon: Users,
      title: 'Recruitment Partner Network',
      description: 'Expand your reach through vetted counselors and agency channels aligned to your goals.',
      features: ['Partner Onboarding', 'Quality Filtering', 'Performance Reviews', 'Network Expansion'],
    },
    {
      icon: Briefcase,
      title: 'Regional Representation',
      description: 'Build sustained institutional visibility in India through on-ground representation support.',
      features: ['In-Market Presence', 'Institution Briefings', 'Stakeholder Meetings', 'Pipeline Oversight'],
    },
    {
      icon: Zap,
      title: 'Compliance Support',
      description: 'Maintain process consistency, reporting discipline, and ethical recruitment standards.',
      features: ['Compliance Checklists', 'Policy Alignment', 'Risk Controls', 'Documentation Audits'],
    },
    {
      icon: BarChart3,
      title: 'Performance Analytics',
      description: 'Track demand, conversion, and channel quality through practical reporting dashboards.',
      features: ['Lead Source Insights', 'Conversion Metrics', 'Country-Wise Trends', 'Action Dashboards'],
    },
    {
      icon: CheckCircle,
      title: 'Partnership Success Management',
      description: 'Continuous engagement to optimize outcomes and scale long-term collaboration value.',
      features: ['Quarterly Reviews', 'Growth Planning', 'Operational Support', 'Continuous Optimization'],
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };
  const servicesSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'International Education Consulting',
    provider: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: `${SITE_URL}/`,
    },
    areaServed: ['India', 'South Asia', 'Global'],
    url: `${SITE_URL}/services`,
    name: 'Education Growth Services',
    description:
      'Market entry strategy, admissions operations, partner network management, and recruitment growth services for universities.',
  };
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_ITEMS.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'Services', item: `${SITE_URL}/services` },
    ],
  };

  return (
    <div className="pt-16 min-h-screen">
      <Seo
        title="Education Growth Services — Market Entry, Admissions & Recruitment"
        description="Discover The Global Avenues services: market entry strategy, admissions operations, brand enablement, recruitment partner network, compliance support, and performance analytics for universities."
        path="/services"
        image="/videos/hero-poster.jpg"
        keywords={[
          'education consulting services',
          'admissions operations support',
          'market entry strategy India',
          'university recruitment services',
          'brand enablement education',
          'recruitment partner management',
          'performance analytics education',
        ]}
        jsonLd={[servicesSchema, faqSchema, breadcrumbSchema]}
      />
      {/* Hero Section */}
      <motion.section
        className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-primary/5 to-background"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1
            className="text-5xl md:text-6xl font-bold mb-6 text-balance"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Our Services
          </motion.h1>
          <motion.p
            className="text-xl text-muted-foreground max-w-3xl mx-auto"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Comprehensive B2B services designed to help universities build market presence, strengthen recruitment quality, and scale international enrollment.
          </motion.p>
        </div>
      </motion.section>

      {/* Services Grid */}
      <LazySection fallback={<CardGridSkeleton count={8} columns="md:grid-cols-2 lg:grid-cols-4" />}>
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={index}
                  className="bg-muted/30 border border-border/50 rounded-xl p-8 hover:border-primary/50 transition-all"
                  variants={itemVariants}
                  whileHover={{ translateY: -8, borderColor: 'var(--primary)' }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Icon */}
                  <motion.div
                    className="inline-block p-3 bg-primary/10 rounded-lg mb-6"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Icon className="w-6 h-6 text-primary" />
                  </motion.div>

                  {/* Title & Description */}
                  <h3 className="text-xl font-bold mb-3 text-foreground">{service.title}</h3>
                  <p className="text-muted-foreground mb-6 text-sm">{service.description}</p>

                  {/* Features */}
                  <div className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <motion.div
                        key={idx}
                        className="flex items-center gap-2 text-sm text-muted-foreground"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1 }}
                      >
                        <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                        <span>{feature}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>
      </LazySection>

      {/* Process Section */}
      <LazySection fallback={<ProcessSkeleton count={4} />}>
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold mb-4">How We Work</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              A structured operating model built for institutional growth
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              { step: 1, title: 'Discovery', description: 'Align institutional goals and market priorities' },
              { step: 2, title: 'Strategy', description: 'Design a regional growth roadmap' },
              { step: 3, title: 'Execution', description: 'Activate channels and optimize campaigns' },
              { step: 4, title: 'Scale', description: 'Expand impact with measurable outcomes' },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="relative"
                variants={itemVariants}
              >
                <div className="bg-background border border-border/50 rounded-xl p-8 text-center h-full">
                  <motion.div
                    className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4"
                    whileHover={{ scale: 1.2 }}
                    transition={{ duration: 0.3 }}
                  >
                    {item.step}
                  </motion.div>
                  <h4 className="text-lg font-bold text-foreground mb-2">{item.title}</h4>
                  <p className="text-muted-foreground text-sm">{item.description}</p>
                </div>

                {/* Connector Line */}
                {index < 3 && (
                  <motion.div
                    className="hidden md:block absolute top-1/2 -right-4 w-8 h-1 bg-gradient-to-r from-primary to-transparent"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                  />
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      </LazySection>

      <LazySection fallback={<TrackListSkeleton count={5} />}>
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <motion.div
            className="mb-10 text-center"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
          >
            <h2 className="text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground text-lg">
              Clear answers for institutions evaluating our market expansion and admissions support services.
            </p>
          </motion.div>

          <div className="space-y-4">
            {FAQ_ITEMS.map((item, index) => (
              <motion.details
                key={item.question}
                className="rounded-2xl border border-border/70 bg-background/80 p-5 shadow-sm"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: index * 0.05 }}
              >
                <summary className="cursor-pointer text-left text-lg font-semibold text-foreground">
                  {item.question}
                </summary>
                <p className="mt-3 text-muted-foreground">{item.answer}</p>
              </motion.details>
            ))}
          </div>

          <motion.p
            className="mt-8 text-center text-muted-foreground"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: 0.2 }}
          >
            Need a custom plan? Visit <Link to="/what-we-offer" className="text-primary font-semibold">What We Offer</Link>{' '}
            or start directly from <Link to="/collaborate" className="text-primary font-semibold">Collaborate</Link>.
          </motion.p>
        </div>
      </section>
      </LazySection>

      {/* Package Section */}
      {/* <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold mb-4">Service Packages</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Choose the package that suits your needs
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              {
                name: 'Basic',
                price: 'INR 15,000',
                description: 'Perfect for self-motivated students',
                services: ['University Selection', 'Application Review', 'Essay Feedback', 'Email Support'],
              },
              {
                name: 'Premium',
                price: 'INR 45,000',
                description: 'Most popular choice',
                services: ['All Basic Services', 'Test Preparation', 'Interview Coaching', 'Visa Assistance', 'Phone Support'],
                featured: true,
              },
              {
                name: 'Elite',
                price: 'INR 99,000',
                description: 'Complete end-to-end support',
                services: ['All Premium Services', 'Career Counseling', 'Financial Planning', 'Post-Admission Support', '24/7 Support'],
              },
            ].map((pkg, index) => (
              <motion.div
                key={index}
                className={`rounded-xl p-8 border transition-all ${
                  pkg.featured
                    ? 'bg-gradient-to-b from-primary/10 to-transparent border-primary/50 ring-2 ring-primary/20'
                    : 'bg-muted/30 border-border/50 hover:border-primary/50'
                }`}
                variants={itemVariants}
                whileHover={{ translateY: -8 }}
                transition={{ duration: 0.3 }}
              >
                {pkg.featured && (
                  <div className="inline-block px-3 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full mb-4">
                    Most Popular
                  </div>
                )}

                <h3 className="text-2xl font-bold text-foreground mb-2">{pkg.name}</h3>
                <p className="text-muted-foreground text-sm mb-6">{pkg.description}</p>
                <div className="mb-8">
                  <span className="text-4xl font-bold text-primary">{pkg.price}</span>
                  <span className="text-muted-foreground ml-2">one-time</span>
                </div>

                <div className="space-y-3 mb-8">
                  {pkg.services.map((service, idx) => (
                    <motion.div
                      key={idx}
                      className="flex items-center gap-2 text-sm text-muted-foreground"
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                      <span>{service}</span>
                    </motion.div>
                  ))}
                </div>

                <motion.button
                  className={`w-full py-2 rounded-lg font-semibold transition-all ${
                    pkg.featured
                      ? 'bg-primary text-primary-foreground hover:bg-secondary'
                      : 'bg-muted text-foreground hover:bg-muted/80'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Choose Plan
                </motion.button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section> */}
    </div>
  );
}
