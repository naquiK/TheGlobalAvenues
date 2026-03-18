import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Mail, MapPin, Phone, Send } from 'lucide-react';
import { formatAddress } from '../config';
import { useSettings } from '../context/SettingsContext';

export default function CollaboratePage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { siteConfig } = useSettings();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    window.setTimeout(() => {
      setIsSubmitted(true);
      window.setTimeout(() => {
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
        setIsSubmitted(false);
      }, 3000);
    }, 500);
  };

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
        <div className="mx-auto max-w-7xl text-center">
          <motion.h1
            className="mb-6 text-5xl font-bold text-balance md:text-6xl"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Let&apos;s Connect
          </motion.h1>
          <motion.p
            className="mx-auto max-w-3xl text-xl text-muted-foreground"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Reach out to us to begin your journey towards global education success.
          </motion.p>
        </div>
      </motion.section>

      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 lg:grid-cols-3">
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <form onSubmit={handleSubmit} className="rounded-2xl border border-border/50 bg-muted/30 p-8">
              <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <label className="mb-2 block text-sm font-medium text-foreground">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Your name"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.15 }}
                >
                  <label className="mb-2 block text-sm font-medium text-foreground">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="your@email.com"
                  />
                </motion.div>
              </div>

              <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <label className="mb-2 block text-sm font-medium text-foreground">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder={siteConfig.contact.phone[0]}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.25 }}
                >
                  <label className="mb-2 block text-sm font-medium text-foreground">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="How can we help?"
                  />
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mb-8"
              >
                <label className="mb-2 block text-sm font-medium text-foreground">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="6"
                  className="w-full resize-none rounded-lg border border-border bg-background px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Tell us about your educational goals..."
                />
              </motion.div>

              <motion.button
                type="submit"
                disabled={isSubmitted}
                className="w-full rounded-lg bg-gradient-to-r from-primary to-secondary py-3 font-semibold text-white transition-all duration-300 hover:shadow-lg disabled:opacity-50"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isSubmitted ? (
                  <span className="flex items-center justify-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Message Sent!
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Send className="h-5 w-5" />
                    Send Message
                  </span>
                )}
              </motion.button>
            </form>
          </motion.div>

          <motion.div
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div className="rounded-xl border border-primary/20 bg-primary/10 p-6" variants={itemVariants}>
              <div className="flex gap-4">
                <Mail className="mt-1 h-6 w-6 flex-shrink-0 text-primary" />
                <div>
                  <h4 className="mb-1 font-bold text-foreground">Email</h4>
                  <a href={`mailto:${siteConfig.contact.email.general}`} className="text-primary transition-colors hover:text-secondary">
                    {siteConfig.contact.email.general}
                  </a>
                </div>
              </div>
            </motion.div>

            <motion.div className="rounded-xl border border-secondary/20 bg-secondary/10 p-6" variants={itemVariants}>
              <div className="flex gap-4">
                <Phone className="mt-1 h-6 w-6 flex-shrink-0 text-secondary" />
                <div>
                  <h4 className="mb-1 font-bold text-foreground">Phone</h4>
                  <a
                    href={`tel:${siteConfig.contact.phone[0].replace(/\s+/g, '')}`}
                    className="text-secondary transition-colors hover:text-primary"
                  >
                    {siteConfig.contact.phone[0]}
                  </a>
                </div>
              </div>
            </motion.div>

            <motion.div className="rounded-xl border border-accent/20 bg-accent/10 p-6" variants={itemVariants}>
              <div className="flex gap-4">
                <MapPin className="mt-1 h-6 w-6 flex-shrink-0 text-accent" />
                <div>
                  <h4 className="mb-1 font-bold text-foreground">Address</h4>
                  <p className="text-sm text-muted-foreground">{formatAddress(siteConfig.contact.address)}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="bg-muted/30 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            className="mb-16 text-center"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="mb-4 text-4xl font-bold">Connect With The Right Team</h2>
            <p className="text-lg text-muted-foreground">
              Reach the team best suited to your query for faster support.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 gap-8 md:grid-cols-3"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {siteConfig.collaborateTeams.map((team) => (
              <motion.div
                key={team.title}
                className="rounded-xl border border-border/50 bg-background p-8 transition-all hover:border-primary/50"
                variants={itemVariants}
                whileHover={{ translateY: -8 }}
              >
                <h4 className="mb-4 text-xl font-bold text-foreground">{team.title}</h4>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <div className="flex gap-2">
                    <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                    <p>{formatAddress(siteConfig.contact.address)}</p>
                  </div>
                  <div className="flex gap-2">
                    <Phone className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                    <a href={`tel:${team.phone.replace(/\s+/g, '')}`} className="hover:text-primary">
                      {team.phone}
                    </a>
                  </div>
                  <div className="flex gap-2">
                    <Mail className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                    <a href={`mailto:${team.email}`} className="hover:text-primary">
                      {team.email}
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
