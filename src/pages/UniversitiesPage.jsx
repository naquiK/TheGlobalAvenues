import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Globe, Search, TrendingUp, Users } from 'lucide-react';
import { portfolioData } from '../data/portfolioData';
import { SITE_CONFIG } from '../config';

const countries = ['all', ...new Set(portfolioData.map((item) => item.country))];

export default function UniversitiesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('all');

  const filtered = portfolioData.filter((university) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      university.title.toLowerCase().includes(query) || university.country.toLowerCase().includes(query);
    const matchesCountry = selectedCountry === 'all' || university.country === selectedCountry;
    return matchesSearch && matchesCountry;
  });

  const stats = [
    { icon: Globe, label: 'Partner Universities', value: SITE_CONFIG.stats.partnerUniversities },
    { icon: Users, label: 'Students Recruited', value: SITE_CONFIG.stats.studentsRecruited },
    { icon: TrendingUp, label: 'Visa Success Rate', value: SITE_CONFIG.stats.visaSuccessRate },
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
    <div className="min-h-screen pt-16">
      <motion.section
        className="bg-gradient-to-b from-primary/5 to-background px-4 py-20 sm:px-6 lg:px-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="mx-auto max-w-7xl">
          <motion.div
            className="mb-12 text-center"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h1 className="mb-6 text-5xl font-bold text-balance md:text-6xl">Partner Universities</h1>
            <p className="mx-auto max-w-3xl text-xl text-muted-foreground">
              Explore our actual partner network and discover institution profiles across Europe, North America, and beyond.
            </p>
          </motion.div>

          <motion.div
            className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-3"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  className="rounded-xl border border-border/50 bg-muted/30 p-6 text-center"
                  variants={itemVariants}
                  whileHover={{ translateY: -4 }}
                  transition={{ duration: 0.3 }}
                >
                  <Icon className="mx-auto mb-3 h-8 w-8 text-primary" />
                  <p className="mb-2 text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                </motion.div>
              );
            })}
          </motion.div>

          <motion.div
            className="space-y-4"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search universities..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="w-full rounded-lg border border-border bg-background py-3 pl-12 pr-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="flex flex-wrap gap-3">
              {countries.map((country) => (
                <motion.button
                  key={country}
                  onClick={() => setSelectedCountry(country)}
                  className={`flex items-center gap-2 rounded-full px-6 py-2 font-medium capitalize transition-all duration-300 ${
                    selectedCountry === country
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-foreground hover:bg-muted/80'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                >
                  <Globe className="h-4 w-4" />
                  {country === 'all' ? 'All Countries' : country}
                </motion.button>
              ))}
            </div>

            <p className="text-sm text-muted-foreground">Showing {filtered.length} universities</p>
          </motion.div>
        </div>
      </motion.section>

      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {filtered.length > 0 ? (
            <motion.div
              className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {filtered.map((university) => (
                <motion.div
                  key={university.id}
                  className="group overflow-hidden rounded-2xl border border-border/50 bg-muted/30 transition-all hover:border-primary/50"
                  variants={itemVariants}
                  whileHover={{ translateY: -8 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20">
                    <motion.img
                      src={university.image}
                      alt={university.title}
                      className="h-full w-full object-cover"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.4 }}
                    />

                    <div className="absolute bottom-4 left-4 rounded-full bg-secondary/90 px-3 py-1 text-xs font-bold text-secondary-foreground">
                      {university.country}
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="mb-4 text-xl font-bold text-foreground">{university.title}</h3>

                    <div className="mb-6 grid grid-cols-3 gap-4">
                      <div className="rounded-lg bg-primary/10 p-4 text-center">
                        <p className="mb-1 text-2xl font-bold text-primary">{university.programs}</p>
                        <p className="text-xs text-muted-foreground">Programs</p>
                      </div>
                      <div className="rounded-lg bg-secondary/10 p-4 text-center">
                        <p className="mb-1 text-2xl font-bold text-secondary">{university.studentsPlaced}</p>
                        <p className="text-xs text-muted-foreground">Students</p>
                      </div>
                      <div className="rounded-lg bg-accent/10 p-4 text-center">
                        <p className="mb-1 text-2xl font-bold text-accent">{university.successRate}%</p>
                        <p className="text-xs text-muted-foreground">Success</p>
                      </div>
                    </div>

                    <Link
                      to={`/portfolio/${university.id}`}
                      className="inline-flex items-center gap-2 font-semibold text-primary transition-colors duration-300 hover:text-secondary"
                    >
                      View profile
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              className="py-20 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Search className="mx-auto mb-4 h-16 w-16 text-muted-foreground opacity-50" />
              <h3 className="mb-2 text-2xl font-bold text-foreground">No universities found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filter criteria.</p>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}
