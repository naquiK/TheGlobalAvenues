import { motion } from 'framer-motion';
import { CheckCircle, BookOpen, Users, FileText, Zap, Target, BarChart3, Briefcase } from 'lucide-react';

export default function ServicesPage() {
  const services = [
    {
      icon: Target,
      title: 'University Selection',
      description: 'Get expert guidance on choosing the right universities based on your profile, goals, and preferences.',
      features: ['Profile Assessment', 'University Ranking Analysis', 'Requirement Matching', 'Timeline Planning'],
    },
    {
      icon: FileText,
      title: 'Application Support',
      description: 'Comprehensive assistance with application forms, essays, and documentation.',
      features: ['Essay Coaching', 'Application Review', 'Document Preparation', 'Deadline Management'],
    },
    {
      icon: BookOpen,
      title: 'Test Preparation',
      description: 'Specialized coaching for standardized tests with proven strategies and techniques.',
      features: ['GMAT Coaching', 'GRE Coaching', 'IELTS Coaching', 'SAT/ACT Preparation'],
    },
    {
      icon: Users,
      title: 'Interview Coaching',
      description: 'Mock interviews and personalized coaching to ace your university interviews.',
      features: ['Mock Interviews', 'Confidence Building', 'Scenario Practice', 'Feedback Sessions'],
    },
    {
      icon: Briefcase,
      title: 'Career Counseling',
      description: 'Guidance on career paths, internships, and post-graduation opportunities.',
      features: ['Career Mapping', 'Internship Guidance', 'Professional Networking', 'Job Placement'],
    },
    {
      icon: Zap,
      title: 'Visa Assistance',
      description: 'Complete support with visa applications and documentation requirements.',
      features: ['Document Checklist', 'Application Support', 'Interview Prep', 'Travel Planning'],
    },
    {
      icon: BarChart3,
      title: 'Financial Planning',
      description: 'Assistance with scholarship searches and financial aid options.',
      features: ['Scholarship Search', 'Funding Options', 'Financial Aid Guidance', 'Cost Planning'],
    },
    {
      icon: CheckCircle,
      title: 'Post-Admission Support',
      description: 'Ongoing support even after admission to ensure smooth transition.',
      features: ['Housing Assistance', 'Pre-Departure Guidance', 'Alumni Network', 'Continuous Support'],
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

  return (
    <div className="pt-16 min-h-screen">
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
            Comprehensive education consulting services designed to guide you through every step of your international education journey.
          </motion.p>
        </div>
      </motion.section>

      {/* Services Grid */}
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

      {/* Process Section */}
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
              A structured approach to ensure your success at every step
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
              { step: 1, title: 'Assessment', description: 'Evaluate your profile and goals' },
              { step: 2, title: 'Planning', description: 'Create personalized roadmap' },
              { step: 3, title: 'Execution', description: 'Support throughout the process' },
              { step: 4, title: 'Success', description: 'Achieve your dream university' },
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
