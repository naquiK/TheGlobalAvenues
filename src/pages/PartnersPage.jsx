import { motion } from 'framer-motion';
import { useState } from 'react';
import { Users, Award, Building2, Globe, CheckCircle } from 'lucide-react';
import { industryPartners, schoolCounsellors, educationAgents, universities } from '../data/partnersData';

export default function PartnersPage() {
  const [activeTab, setActiveTab] = useState('universities');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const tabVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <motion.div
          className="text-center mb-16"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-4">
            🤝 Strategic Collaborations
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-4">
            Our Partnership Ecosystem
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Collaborate with The Global Avenues and access a network of 210+ universities, industry experts, and education professionals worldwide
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          className="flex flex-wrap justify-center gap-3 mb-16"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {[
            { id: 'universities', label: 'Universities', icon: Globe },
            { id: 'industry', label: 'Industry Partners', icon: Building2 },
            { id: 'counsellors', label: 'School Counsellors', icon: Users },
            { id: 'agents', label: 'Education Agents', icon: Award },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-primary text-primary-foreground shadow-lg'
                    : 'bg-muted text-foreground hover:bg-primary/10'
                }`}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
              </button>
            );
          })}
        </motion.div>

        {/* Content Sections */}
        <motion.div
          key={activeTab}
          variants={tabVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Universities Tab */}
          {activeTab === 'universities' && (
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-12">
              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {universities.stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    className="bg-gradient-to-br from-primary/10 to-secondary/10 border border-border rounded-xl p-6 text-center hover:shadow-lg transition-shadow"
                    variants={itemVariants}
                    whileHover={{ translateY: -4 }}
                  >
                    <h3 className="text-4xl font-bold text-primary mb-2">{stat.number}</h3>
                    <p className="text-muted-foreground font-medium">{stat.label}</p>
                  </motion.div>
                ))}
              </div>

              {/* Regions Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {universities.regions.map((region, index) => (
                  <motion.div
                    key={index}
                    className="bg-background border border-border rounded-xl p-8 hover:border-primary/50 transition-all hover:shadow-lg"
                    variants={itemVariants}
                    whileHover={{ translateY: -4 }}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Globe className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-foreground mb-1">{region.region}</h3>
                        <p className="text-muted-foreground mb-3">{region.description}</p>
                        <p className="text-lg font-semibold text-primary">{region.count} Universities</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Industry Partners Tab */}
          {activeTab === 'industry' && (
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {industryPartners.partners.map((partner, index) => (
                <motion.div
                  key={partner.id}
                  className="bg-background border border-border rounded-xl overflow-hidden hover:border-primary/50 transition-all group"
                  variants={itemVariants}
                  whileHover={{ translateY: -8 }}
                >
                  <div className="relative h-48 overflow-hidden">
                    <motion.img
                      src={partner.image}
                      alt={partner.name}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.4 }}
                    />
                  </div>
                  <div className="p-6">
                    <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs rounded-full font-semibold mb-3">
                      {partner.category}
                    </span>
                    <h3 className="text-xl font-bold text-foreground mb-2">{partner.name}</h3>
                    <p className="text-muted-foreground">{partner.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* School Counsellors Tab */}
          {activeTab === 'counsellors' && (
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
              <motion.p className="text-lg text-muted-foreground text-center mb-12" variants={itemVariants}>
                We are focused on attracting top talent from South Asia through strategic partnerships and collaborations with education counselors.
              </motion.p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {schoolCounsellors.services.map((service, index) => (
                  <motion.div
                    key={service.id}
                    className="bg-gradient-to-br from-primary/5 to-secondary/5 border border-border rounded-xl p-6 hover:border-primary/50 transition-all hover:shadow-lg"
                    variants={itemVariants}
                    whileHover={{ translateY: -4 }}
                  >
                    <div className="text-4xl mb-4">{service.icon}</div>
                    <h3 className="text-xl font-bold text-foreground mb-2">{service.title}</h3>
                    <p className="text-muted-foreground">{service.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Education Agents Tab */}
          {activeTab === 'agents' && (
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
              <motion.p className="text-lg text-muted-foreground text-center mb-12" variants={itemVariants}>
                Join our network of successful education agents and access comprehensive support, competitive commissions, and exclusive opportunities.
              </motion.p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {educationAgents.benefits.map((benefit, index) => (
                  <motion.div
                    key={benefit.id}
                    className="bg-background border border-border rounded-xl p-6 hover:border-primary/50 transition-all hover:shadow-lg flex gap-4"
                    variants={itemVariants}
                    whileHover={{ translateY: -4 }}
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-foreground mb-1">{benefit.title}</h3>
                      <p className="text-muted-foreground text-sm">{benefit.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* CTA Section */}
              <motion.div
                className="mt-12 bg-gradient-to-r from-primary to-secondary text-white rounded-xl p-8 md:p-12 text-center"
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
              >
                <h3 className="text-3xl font-bold mb-4">Ready to Partner With Us?</h3>
                <p className="text-lg text-white/90 mb-6">Join our growing network of education agents and expand your business opportunities globally.</p>
                <button className="px-8 py-3 bg-white text-primary font-bold rounded-lg hover:bg-gray-100 transition-colors">
                  Get in Touch
                </button>
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
