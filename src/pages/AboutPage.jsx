import { motion } from 'framer-motion';
import { Users, Target, Zap, Globe, Heart, Award, CheckCircle, Lightbulb, Shield } from 'lucide-react';

export default function AboutPage() {
  const values = [
    { icon: Target, title: 'Our Mission', description: 'Uphold integrity, transparency, motivation, and unwavering dedication, ensuring open communication and tailored services for every student.' },
    { icon: Globe, title: 'Our Vision', description: 'Consistently enhance our role as trusted partner for universities through strong relationships, collaborative efforts, and innovative strategies.' },
    { icon: Heart, title: 'Student Centric', description: 'Every decision guided by student success and long-term impact in the global education landscape.' },
    { icon: Shield, title: 'Quality Assurance', description: 'ICEF accredited organization with transparent processes and professional ethical standards.' },
  ];

  const team = [
    { 
      name: 'Neetu Verma Gupta', 
      role: 'Director', 
      image: '/team/neetu-verma-gupta.jpg',
      bio: 'Visionary leader with extensive experience in international education partnerships and institutional development'
    },
    { 
      name: 'Deepshikha Chauhan', 
      role: 'International Recruitment Head', 
      image: '/team/deepshikha-chauhan.jpg',
      bio: 'Strategic recruitment expert overseeing international student placements and university partnerships'
    },
    { 
      name: 'Bhawna', 
      role: 'International Recruitment', 
      image: '/team/bhawna.jpg',
      bio: 'Dedicated recruitment specialist focused on student counseling and placement success'
    },
    { 
      name: 'Shabana Azmi', 
      role: 'International Recruitment', 
      image: '/team/shabana-azmi.jpg',
      bio: 'Experienced recruitment professional with strong focus on student mobility and university relations'
    },
    { 
      name: 'Vaamika Sinha', 
      role: 'International Recruitment', 
      image: '/team/vaamika-sinha.jpg',
      bio: 'Passionate recruitment specialist committed to bridging educational opportunities for students'
    },
    { 
      name: 'Naman Sharma', 
      role: 'Marketing & Promotions', 
      image: '/team/naman-sharma.jpg',
      bio: 'Creative marketing professional driving brand presence and institutional visibility in key markets'
    },
    { 
      name: 'Ambar Johar', 
      role: 'Admissions Coordinator', 
      image: '/team/ambar-johar.jpg',
      bio: 'Efficient coordinator ensuring smooth application processing and student onboarding'
    },
    { 
      name: 'Suraj Kumar Soni', 
      role: 'Admissions Coordinator', 
      image: '/team/suraj-kumar-soni.jpg',
      bio: 'Dedicated professional managing admissions workflows and student documentation'
    },
  ];

  const stats = [
    { number: '1000+', label: 'Years of Experience' },
    { number: '210+', label: 'Partner Universities' },
    { number: '15+', label: 'Active Channel Partners' },
    { number: '3000k+', label: 'Students Recruited' },
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
            Empowering Global Education
          </motion.h1>
          <motion.p
            className="text-xl text-muted-foreground max-w-3xl mx-auto mb-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            The Global Avenues is a trusted name in the international education industry. We specialize in partnering with institutions seeking to establish and grow their presence in the Indian subcontinent, building their brand from the ground up and positioning them as recognized names in the region.
          </motion.p>
          <motion.p
            className="text-lg text-muted-foreground max-w-3xl mx-auto"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Our core mission is to create impactful collaborations that connect Indian institutions, students, and parents with leading global education opportunities. We facilitate student admissions, foster university partnerships, and drive student mobility with a strong emphasis on transparency, innovation, and long-term impact.
          </motion.p>
        </div>
      </motion.section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                variants={itemVariants}
              >
                <h3 className="text-4xl md:text-5xl font-bold text-primary mb-2">{stat.number}</h3>
                <p className="text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold mb-4">Our Core Values</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Everything we do is rooted in these fundamental principles
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={index}
                  className="bg-muted/30 border border-border/50 rounded-xl p-8 text-center hover:border-primary/50 transition-all"
                  variants={itemVariants}
                  whileHover={{ translateY: -8 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div
                    className="inline-block p-3 bg-primary/10 rounded-lg mb-4"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Icon className="w-6 h-6 text-primary" />
                  </motion.div>
                  <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold mb-4">Meet Our Team</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Expert professionals dedicated to your success
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {team.map((member, index) => (
              <motion.div
                key={index}
                className="bg-background border border-border/50 rounded-xl overflow-hidden hover:border-primary/50 transition-all hover:shadow-xl group"
                variants={itemVariants}
                whileHover={{ translateY: -8 }}
                transition={{ duration: 0.3 }}
              >
                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  <motion.img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.4 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="p-6 text-center">
                  <h4 className="text-lg font-bold text-foreground mb-1">{member.name}</h4>
                  <p className="text-primary font-semibold text-sm mb-3">{member.role}</p>
                  <p className="text-muted-foreground text-sm leading-relaxed">{member.bio}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Accreditation Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold mb-4">Accreditation & Memberships</h2>
            <p className="text-muted-foreground text-lg">Industry Recognition & Professional Partnerships</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* ICEF */}
            <motion.div
              className="bg-background border border-border rounded-xl p-8 hover:border-primary/50 transition-all"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-bold text-foreground mb-2">ICEF Accreditation</h4>
                  <p className="text-muted-foreground">ICEF's industry-leading quality assurance processes are recognized worldwide as a benchmark for education agencies. This accreditation affirms The Global Avenues has been thoroughly screened and accredited for its quality work, professional approach, and strong ethical standards in recruiting international students.</p>
                </div>
              </div>
            </motion.div>

            {/* NET24 & EAIE */}
            <motion.div
              className="bg-background border border-border rounded-xl p-8 hover:border-secondary/50 transition-all"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
                    <Lightbulb className="w-6 h-6 text-secondary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-foreground mb-1">NET24 Member</h4>
                    <p className="text-sm text-muted-foreground">Connects educational institutions with reputable student recruitment agencies through advanced platform and B2B events.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <Award className="w-6 h-6 text-accent" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-foreground mb-1">EAIE Member</h4>
                    <p className="text-sm text-muted-foreground">European Association for International Education - member-led, non-profit organization promoting international higher education.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
