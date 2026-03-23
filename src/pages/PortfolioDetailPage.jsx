import { useParams, useNavigate, Link } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Trophy, Target, Users, Star, Globe, Zap, ChevronRight } from 'lucide-react';
import { getPortfolioById, getPortfolios } from '../services/portfolioService';
import { getUniversityDetail } from '../services/contentApi';
import { resolveMediaUrl } from '../services/apiClient';
import BackNavButton from '../components/ui/BackNavButton';

export default function PortfolioDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [portfolio, setPortfolio] = useState(null);
  const [allPortfolios, setAllPortfolios] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const mapUniversityToPortfolio = (data) => {
    if (!data || !data.university) return null;
    const university = data.university;
    const specializations = (data.specializations || [])
      .map((item) => item.title)
      .filter(Boolean);
    const highlights = (data.benefits || [])
      .map((item) => item.title)
      .filter(Boolean);
    const programs = data.programs || [];
    const experiences = (data.experiences || []).map((item) => ({
      name: item.student_name,
      program: item.program,
      quote: item.review,
      location: university.city || university.country,
      rating: Number(item.rating) || 5,
      photo: item.photo ? resolveMediaUrl(item.photo) : '',
    }));

    return {
      id: university.id,
      slug: university.slug,
      title: university.name,
      country: university.country,
      image: resolveMediaUrl(university.logo),
      description: university.description,
      programs: programs.length || undefined,
      details: {
        location: [university.city, university.country].filter(Boolean).join(', '),
        specializations,
        programs,
        studentTestimonials: experiences,
      },
      highlights,
    };
  };

  const mergePortfolioData = (base, override) => {
    if (!base) return override;
    if (!override) return base;
    return {
      ...base,
      ...override,
      image: override.image || base.image,
      highlights: override.highlights && override.highlights.length > 0 ? override.highlights : base.highlights,
      details: {
        ...(base.details || {}),
        ...(override.details || {}),
      },
    };
  };

  useEffect(() => {
    let isActive = true;
    const controller = new AbortController();

    const loadData = async () => {
      try {
        const localData = await getPortfolioById(id);
        const detailSlug = localData?.slug || id;
        let apiPortfolio = null;

        try {
          const apiData = await getUniversityDetail(detailSlug, { signal: controller.signal });
          apiPortfolio = mapUniversityToPortfolio(apiData);
        } catch (error) {
          if (error.name !== 'AbortError') {
            apiPortfolio = null;
          }
        }

        const merged = mergePortfolioData(localData, apiPortfolio);

        if (isActive) {
          setPortfolio(merged || apiPortfolio || localData);
          const all = await getPortfolios();
          setAllPortfolios(all.data || all);
        }
      } catch (error) {
        if (isActive) {
          console.error('Error loading portfolio:', error);
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isActive = false;
      controller.abort();
    };
  }, [id]);

  const metrics = useMemo(() => {
    if (!portfolio) {
      return {
        studentsPlaced: null,
        programs: null,
        successRate: null,
        visaSuccessRate: null,
      };
    }

    const programCount =
      portfolio.programs ??
      (Array.isArray(portfolio.details?.programs) ? portfolio.details.programs.length : undefined);

    return {
      studentsPlaced: portfolio.studentsPlaced,
      programs: programCount,
      successRate: portfolio.successRate,
      visaSuccessRate: portfolio.details?.visaSuccessRate,
    };
  }, [portfolio]);

  if (isLoading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-muted border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!portfolio) {
    return (
      <div className="pt-20 min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-4">Portfolio Not Found</h1>
        <BackNavButton label="Back to Portfolio" onClick={() => navigate('/portfolio')} />
      </div>
    );
  }

  // Get related portfolios
  const relatedPortfolios = allPortfolios
    .filter(p => p.id !== portfolio.id && p.category === portfolio.category)
    .slice(0, 3);

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
    <div className="pt-20 min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Back Button */}
      <motion.div
        className="sticky top-16 z-40 border-b border-border/70 bg-background/70 px-4 py-2 backdrop-blur-xl supports-[backdrop-filter]:bg-background/55 sm:px-6 lg:px-8"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="max-w-7xl mx-auto">
          <BackNavButton label="Back to Portfolio" onClick={() => navigate('/portfolio')} />
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Content */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Image Section */}
          <motion.div
            className="lg:col-span-2"
            variants={itemVariants}
          >
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20 h-96 sm:h-[500px]">
              <motion.img
                src={portfolio.image}
                alt={portfolio.partnerName || portfolio.title}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6 }}
              />

              {/* Achievement Badge */}
              <motion.div
                className="absolute top-6 left-6 px-4 py-2 bg-primary/95 text-primary-foreground rounded-lg font-bold"
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {portfolio.achievement}
              </motion.div>

              {/* Country Badge */}
              <motion.div
                className="absolute bottom-6 right-6 px-4 py-2 bg-accent/95 text-accent-foreground rounded-lg font-bold flex items-center gap-2"
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <MapPin className="w-4 h-4" />
                {portfolio.country}
              </motion.div>
            </div>
          </motion.div>

          {/* Info Cards */}
          <motion.div
            className="space-y-4"
            variants={itemVariants}
          >
            {/* University Title */}
            <div className="bg-gradient-to-br from-primary/10 to-secondary/10 backdrop-blur-sm border border-primary/30 rounded-xl p-6">
              <p className="text-muted-foreground text-sm font-medium mb-2">Institution</p>
              <h1 className="text-3xl font-bold text-foreground mb-2">{portfolio.title}</h1>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Globe className="w-4 h-4" />
                <span>{portfolio.country}</span>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              {/* Applications Managed */}
              <motion.div
                className="bg-primary/10 border border-primary/20 rounded-xl p-4"
                whileHover={{ translateY: -2 }}
              >
                <Users className="w-5 h-5 text-primary mb-2" />
                <p className="text-muted-foreground text-xs font-medium">Applications Managed</p>
                <p className="text-xl font-bold text-foreground">
                  {metrics.studentsPlaced ? `${metrics.studentsPlaced}+` : '—'}
                </p>
              </motion.div>

              {/* Programs */}
              <motion.div
                className="bg-secondary/10 border border-secondary/20 rounded-xl p-4"
                whileHover={{ translateY: -2 }}
              >
                <Target className="w-5 h-5 text-secondary mb-2" />
                <p className="text-muted-foreground text-xs font-medium">Programs</p>
                <p className="text-xl font-bold text-foreground">
                  {metrics.programs ?? '—'}
                </p>
              </motion.div>

              {/* Conversion Rate */}
              <motion.div
                className="bg-accent/10 border border-accent/20 rounded-xl p-4"
                whileHover={{ translateY: -2 }}
              >
                <Star className="w-5 h-5 text-accent mb-2" />
                <p className="text-muted-foreground text-xs font-medium">Conversion Rate</p>
                <p className="text-xl font-bold text-foreground">
                  {metrics.successRate ? `${metrics.successRate}%` : '—'}
                </p>
              </motion.div>

              {/* Offer Conversion */}
              <motion.div
                className="bg-green-500/10 border border-green-500/20 rounded-xl p-4"
                whileHover={{ translateY: -2 }}
              >
                <Zap className="w-5 h-5 text-green-500 mb-2" />
                <p className="text-muted-foreground text-xs font-medium">Offer Conversion</p>
                <p className="text-xl font-bold text-foreground">
                  {metrics.visaSuccessRate ? `${metrics.visaSuccessRate}%` : '—'}
                </p>
              </motion.div>
            </div>

            {/* Location & Ranking */}
            <motion.div
              className="bg-muted/40 border border-border/50 rounded-xl p-6"
              whileHover={{ translateY: -4 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    <p className="text-muted-foreground text-sm font-medium">Location</p>
                  </div>
                  <p className="text-lg font-bold text-foreground">{portfolio.details?.location}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Trophy className="w-4 h-4 text-secondary" />
                    <p className="text-muted-foreground text-sm font-medium">Ranking</p>
                  </div>
                  <p className="text-lg font-bold text-foreground">{portfolio.details?.ranking}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Description Section */}
        <motion.div
          className="bg-muted/20 border border-border/50 rounded-2xl p-8 mb-16"
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-foreground mb-6">About This University</h2>
          <p className="text-lg text-muted-foreground leading-relaxed mb-6">
            {portfolio.description}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-border/50">
            <div>
              <h4 className="font-bold text-foreground mb-2">Specializations</h4>
              <ul className="space-y-2">
                {portfolio.details?.specializations?.map((spec) => (
                  <li key={spec} className="text-muted-foreground flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    {spec}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-foreground mb-2">Program Information</h4>
              <div className="space-y-2 text-muted-foreground">
                <p><span className="font-semibold">Average Tuition:</span> {portfolio.details?.avgTuition}</p>
                <p><span className="font-semibold">Scholarships:</span> {portfolio.details?.scholarshipAvailable ? 'Available' : 'Not Available'}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Highlights Section */}
        {portfolio.highlights && portfolio.highlights.length > 0 && (
          <motion.div
            className="mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            <h3 className="text-2xl font-bold text-foreground mb-8">Why Choose {portfolio.title}?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {portfolio.highlights.map((highlight, index) => (
                <motion.div
                  key={index}
                  className="bg-gradient-to-br from-primary/5 to-secondary/5 border border-border/50 rounded-lg p-6 hover:border-primary/50 transition-colors"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  whileHover={{ translateY: -4 }}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                      <Star className="w-4 h-4 text-primary" />
                    </div>
                    <p className="text-foreground font-medium">{highlight}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Specializations Tags */}
        <motion.div
          className="mb-16"
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold text-foreground mb-4">Specializations</h3>
          <div className="flex flex-wrap gap-3">
            {portfolio.details?.specializations?.map((spec, index) => (
              <motion.div
                key={spec}
                className="px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-lg font-medium text-sm hover:bg-primary/20 transition-colors"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ scale: 1.05 }}
              >
                {spec}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Testimonials Section */}
        {portfolio.details?.studentTestimonials && portfolio.details.studentTestimonials.length > 0 && (
          <motion.div
            className="mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            <h3 className="text-2xl font-bold text-foreground mb-8">Partner Insights</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {portfolio.details.studentTestimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  className="bg-gradient-to-br from-background to-muted/20 border border-border/50 rounded-xl p-6 relative overflow-hidden group hover:border-primary/50 transition-colors"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ translateY: -4 }}
                >
                  <div className="absolute top-0 right-0 w-20 h-20 bg-primary/10 rounded-bl-3xl group-hover:bg-primary/20 transition-colors"></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-1 mb-3">
                      {Array.from({
                        length: Math.min(5, Math.max(1, Number(testimonial.rating) || 5)),
                      }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                      ))}
                    </div>
                    
                    <p className="text-foreground italic mb-4">"{testimonial.quote}"</p>
                    
                    <div className="border-t border-border/30 pt-4">
                      <p className="font-semibold text-foreground">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.program}</p>
                      <p className="text-xs text-muted-foreground">From {testimonial.location}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* CTA Section */}
        <motion.div
          className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/30 rounded-2xl p-8 mb-16 text-center"
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold text-foreground mb-4">Ready to Partner with {portfolio.title}?</h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Partner with us to strengthen your visibility and recruitment outcomes for institutions like {portfolio.title} across key markets.
          </p>
          <motion.button
            className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-secondary transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/collaborate')}
            type="button"
          >
            Connect with Our Advisors
          </motion.button>
        </motion.div>

        {/* Related Portfolios */}
        {relatedPortfolios.length > 0 && (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            <h3 className="text-3xl font-bold text-foreground mb-8">Other Universities in {portfolio.category}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPortfolios.map((related, index) => (
                <motion.div
                  key={related.id}
                  className="bg-muted/30 border border-border/50 rounded-xl overflow-hidden hover:border-primary/50 transition-colors group"
                  variants={itemVariants}
                  whileHover={{ translateY: -4 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="relative h-48 overflow-hidden">
                    <motion.img
                      src={related.image}
                      alt={related.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.4 }}
                    />
                  </div>
                  <div className="p-6">
                    <h4 className="text-lg font-bold text-foreground mb-2">{related.title}</h4>
                    <p className="text-primary font-semibold text-sm mb-1">{related.country}</p>
                    <p className="text-muted-foreground text-sm mb-4">{related.description}</p>
                    <Link
                      to={`/portfolio/${related.slug || related.id}`}
                      className="inline-flex items-center gap-2 text-primary hover:text-secondary text-sm font-semibold group/link"
                    >
                      View University
                      <ChevronRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
