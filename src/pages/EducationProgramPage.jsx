import { motion } from 'framer-motion';
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Award, Building2, Globe, Clock, BookOpen } from 'lucide-react';
import { getProgramById, getDegreeDetails } from '../data/educationProgramsData';

export default function EducationProgramPage() {
  const { programType, degreeLevel } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(degreeLevel || 'undergraduate');

  const program = getProgramById(programType);
  const currentDegree = getDegreeDetails(programType, `${programType}-${activeTab}`);

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

  if (!program) {
    return (
      <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">Program Not Found</h1>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const highlights = [
    { icon: Users, label: 'Partner Institutions', value: currentDegree?.institutions || 0 },
    { icon: Clock, label: 'Program Duration', value: currentDegree?.duration || 'Varies' },
    { icon: BookOpen, label: 'Enrolled Students', value: currentDegree?.students || 0 },
    { icon: Globe, label: 'Global Reach', value: '50+ Countries' },
  ];

  const requirements = [
    'Valid passport and documentation',
    'Academic transcripts and certificates',
    'English language proficiency (IELTS/TOEFL)',
    'Statement of purpose or motivation letter',
    'Recommendation letters from faculty',
    'Application fee (varies by institution)'
  ];

  const benefits = [
    'Access to world-class educational institutions',
    'Career guidance and placement assistance',
    'Visa processing support',
    'Pre-arrival accommodation services',
    'Scholarship opportunities',
    'Ongoing mentorship and support',
    'Alumni network worldwide',
    'Professional development workshops'
  ];

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/what-we-offer')}
          className="inline-flex items-center gap-2 px-4 py-2 text-primary hover:bg-primary/10 rounded-lg transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Programs
        </button>

        {/* Hero Section */}
        <motion.div
          className="text-center mb-16"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div
            className="inline-block px-4 py-2 rounded-full text-sm font-semibold mb-4"
            style={{ backgroundColor: `${program.color}20`, color: program.color }}
          >
            {program.icon} {program.name}
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-4">
            {program.name}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {program.description}
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          className="flex flex-wrap justify-center gap-3 mb-16"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {['undergraduate', 'postgraduate', 'doctorate'].map((level) => (
            <button
              key={level}
              onClick={() => {
                setActiveTab(level);
                navigate(`/education-program/${programType}/${level}`);
              }}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 capitalize ${
                activeTab === level
                  ? 'text-white shadow-lg'
                  : 'bg-muted text-foreground hover:bg-primary/10'
              }`}
              style={{
                backgroundColor: activeTab === level ? program.color : undefined
              }}
            >
              {level}
            </button>
          ))}
        </motion.div>

        {/* Content Section */}
        <motion.div
          key={activeTab}
          variants={tabVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Highlights */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {highlights.map((highlight, index) => {
              const Icon = highlight.icon;
              return (
                <motion.div
                  key={index}
                  className="bg-gradient-to-br from-primary/10 to-secondary/10 border border-border rounded-xl p-6 text-center hover:shadow-lg transition-shadow"
                  variants={itemVariants}
                  whileHover={{ translateY: -4 }}
                >
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4"
                    style={{ backgroundColor: `${program.color}20` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: program.color }} />
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{highlight.label}</p>
                  <p className="text-3xl font-bold" style={{ color: program.color }}>
                    {highlight.value}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Program Details */}
            <motion.div
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              className="space-y-8"
            >
              <div className="bg-card border border-border rounded-2xl p-8">
                <h2 className="text-3xl font-bold text-foreground mb-6">Program Overview</h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  {currentDegree?.description}
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1"
                      style={{ backgroundColor: `${program.color}20` }}
                    >
                      <Clock className="w-5 h-5" style={{ color: program.color }} />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Duration</p>
                      <p className="text-muted-foreground">{currentDegree?.duration}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1"
                      style={{ backgroundColor: `${program.color}20` }}
                    >
                      <Building2 className="w-5 h-5" style={{ color: program.color }} />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Partner Institutions</p>
                      <p className="text-muted-foreground">{currentDegree?.institutions}+ Universities</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Requirements */}
              <div className="bg-card border border-border rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-foreground mb-6">Eligibility Requirements</h3>
                <ul className="space-y-3">
                  {requirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-1"
                        style={{ backgroundColor: `${program.color}20` }}
                      >
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: program.color }}
                        />
                      </div>
                      <span className="text-muted-foreground">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* Benefits & CTA */}
            <motion.div
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              className="space-y-8"
            >
              <div className="bg-card border border-border rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-foreground mb-6">Program Benefits</h3>
                <ul className="space-y-3">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-1"
                        style={{ backgroundColor: `${program.color}20` }}
                      >
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: program.color }}
                        />
                      </div>
                      <span className="text-muted-foreground">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA Section */}
              <div
                className="rounded-2xl p-8 text-white"
                style={{ backgroundColor: program.color }}
              >
                <h3 className="text-2xl font-bold mb-4">Ready to Explore?</h3>
                <p className="mb-6 opacity-90">
                  Start your journey with us. Get personalized guidance and support for your application.
                </p>
                <button className="w-full bg-white text-foreground font-semibold py-3 rounded-lg hover:bg-gray-100 transition-colors">
                  Apply Now
                </button>
              </div>

              {/* Contact Info */}
              <div className="bg-muted border border-border rounded-2xl p-8">
                <h3 className="text-xl font-bold text-foreground mb-6">Need Help?</h3>
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    Our education counselors are ready to assist you with any questions about this program.
                  </p>
                  <button className="w-full px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold">
                    Get Free Consultation
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
