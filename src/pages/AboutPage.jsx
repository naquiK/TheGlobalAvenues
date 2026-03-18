import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Target, Zap, Globe, Heart, Award, CheckCircle, Lightbulb, Shield } from 'lucide-react';
import { SITE_CONFIG } from '../config';

export default function AboutPage() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://www-cdn.icef.com/scripts/iasbadgeid.js';
    script.async = true;
    script.defer = true;
    script.crossOrigin = 'anonymous';
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

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
    { number: SITE_CONFIG.stats.partnerUniversities, label: 'Partner Universities' },
    { number: SITE_CONFIG.stats.countriesCovered, label: 'Countries Covered' },
    { number: '15+', label: 'Active Channel Partners' },
    { number: SITE_CONFIG.stats.studentsRecruited, label: 'Students Recruited' },
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

      {/* Accreditation & Memberships Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <motion.div
            className="text-center mb-20"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-5xl font-bold mb-4 text-blue-600">Accreditation & Memberships</h2>
            <p className="text-muted-foreground text-lg">Industry Recognition & Professional Partnerships</p>
          </motion.div>

          {/* Accreditation Section */}
          <motion.div
            className="mb-20 pb-20 border-b border-border"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-3xl font-bold text-blue-600 mb-12 text-center">Accreditation</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
              {/* ICEF Badge */}
              <div className="flex justify-center md:justify-start">
                <div className="bg-white p-12 rounded-lg border border-border/50 inline-block">
                  <span id="iasBadge" data-account-id="5944" style={{transform: 'scale(1.5)', transformOrigin: 'top left'}}></span>
                </div>
              </div>

              {/* ICEF Description */}
              <motion.div
                className="flex flex-col justify-center"
                initial={{ x: 20, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <p className="text-muted-foreground leading-relaxed mb-4">
                  ICEF's industry-leading quality assurance processes are increasingly recognized worldwide as a benchmark for education agencies and industry stakeholders, allowing for the easy identification of accredited organisations.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  This recognition affirms that The Global Avenues has been thoroughly screened and accredited for its quality work, professional approach, and strong ethical standards in recruiting international students.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  It reinforces our credibility and commitment to excellence in guiding students towards global opportunities. With this accreditation, we continue to strengthen trust among our partners, students, and the wider education community.
                </p>
              </motion.div>
            </div>
          </motion.div>

          {/* Membership Section */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-3xl font-bold text-blue-600 mb-12 text-center">Membership</h3>

            {/* NET24 */}
            <div className="mb-16 pb-16 border-b border-border">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                {/* NET24 Description */}
                <motion.div
                  className="flex flex-col justify-center"
                  initial={{ x: -20, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <p className="text-muted-foreground leading-relaxed">
                    NET24 connects educational institutions with reputable student recruitment agencies through its advanced online platform (NET24Apply) and a series of impactful B2B events, including conferences and workshops. Their core aim is to enhance the enrollment of international students and support global student mobility by fostering efficient and reliable partnerships.
                  </p>
                </motion.div>

                {/* NET24 Logo */}
                <motion.div
                  className="flex justify-center md:justify-end"
                  initial={{ x: 20, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  <div className="bg-white p-12 rounded-lg border border-border/50 inline-block">
                    <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-GUrYXfZRVyPpqFswzm4YXvBmq13UKu.png" alt="NET24" className="h-32 w-auto object-contain" />
                  </div>
                </motion.div>
              </div>
            </div>

            {/* EAIE */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
              {/* EAIE Logo */}
              <motion.div
                className="flex justify-center md:justify-start"
                initial={{ x: -20, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="bg-white p-12 rounded-lg border border-border/50 inline-block">
                  <div className="w-64 h-28 flex items-center justify-center text-3xl font-bold text-green-600">EAIE</div>
                </div>
              </motion.div>

              {/* EAIE Description */}
              <motion.div
                className="flex flex-col justify-center"
                initial={{ x: 20, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <p className="text-muted-foreground leading-relaxed">
                  The European Association for International Education (EAIE) is a member-led, non-profit organization founded in 1989 that serves as a European center for expertise, networking, and resources in international higher education. The EAIE provides professionals with training, conferences, publications, and a platform for sharing knowledge to promote and advance responsible international education in Europe and beyond.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
