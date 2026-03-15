import { useState } from 'react';
import {
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  Youtube,
} from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { SITE_CONFIG, formatAddress } from '../config';

const socialIcons = {
  facebook: Facebook,
  linkedin: Linkedin,
  youtube: Youtube,
  instagram: Instagram,
  whatsapp: MessageCircle,
};

export function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [ref, isVisible] = useScrollAnimation();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
    setFormData({ name: '', email: '', message: '' });
    window.setTimeout(() => setSubmitted(false), 3000);
  };

  const visibleSocialLinks = Object.entries(SITE_CONFIG.social).filter(([, href]) => Boolean(href));

  return (
    <section id="contact" className="relative overflow-hidden bg-muted/30 px-4 py-20">
      <div className="absolute top-0 right-0 -z-10 h-96 w-96 rounded-full bg-secondary/10 blur-3xl" />
      <div className="absolute bottom-0 left-0 -z-10 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />

      <div className="mx-auto w-full max-w-7xl">
        <div
          ref={ref}
          className={`mb-16 text-center transition-all duration-1000 ${
            isVisible ? 'animate-fade-in-up' : 'translate-y-[30px] opacity-0'
          }`}
        >
          <div className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
            Get In Touch
          </div>
          <h2 className="mb-4 text-4xl font-bold text-foreground lg:text-5xl">Ready to Start Your Journey?</h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Contact us today and let&apos;s discuss how we can help you achieve your international education goals.
          </p>
        </div>

        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2">
          <div className="space-y-8">
            <div className="rounded-xl border border-border bg-background p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-md">
              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-primary/10 p-3">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="mb-2 font-bold text-foreground">Phone</h3>
                  {SITE_CONFIG.contact.phone.map((phone) => (
                    <p key={phone} className="text-muted-foreground">
                      {phone}
                    </p>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-background p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-md">
              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-secondary/10 p-3">
                  <Mail className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <h3 className="mb-2 font-bold text-foreground">Email</h3>
                  <p className="text-muted-foreground">{SITE_CONFIG.contact.email.general}</p>
                  <p className="text-muted-foreground">{SITE_CONFIG.contact.email.admissions}</p>
                  <p className="text-muted-foreground">{SITE_CONFIG.contact.email.partnerships}</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-background p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-md">
              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-accent/20 p-3">
                  <MapPin className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="mb-2 font-bold text-foreground">Address</h3>
                  <p className="text-muted-foreground">{formatAddress()}</p>
                </div>
              </div>
            </div>

            {visibleSocialLinks.length > 0 && (
              <div className="space-y-4">
                <p className="font-semibold text-foreground">Connect With Us</p>
                <div className="flex gap-4">
                  {visibleSocialLinks.map(([key, href]) => {
                    const Icon = socialIcons[key];
                    return (
                      <a
                        key={key}
                        href={href}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={key}
                        className="rounded-lg border border-border bg-background p-3 transition-all duration-300 hover:scale-110 hover:border-primary hover:bg-primary hover:text-primary-foreground"
                      >
                        <Icon className="h-5 w-5" />
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div
            className={`rounded-2xl border border-border bg-background p-8 transition-all duration-1000 ${
              isVisible ? 'animate-fade-in-right' : 'translate-x-[30px] opacity-0'
            }`}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-border bg-muted px-4 py-3 transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-border bg-muted px-4 py-3 transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  className="w-full resize-none rounded-lg border border-border bg-muted px-4 py-3 transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Tell us about your inquiry..."
                />
              </div>

              <button
                type="submit"
                className="group flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition-all duration-300 hover:scale-105 hover:bg-secondary"
              >
                Send Message
                <Send className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>

              {submitted && (
                <div className="animate-fade-in-up rounded-lg bg-green-100 p-4 text-center font-medium text-green-800">
                  Message sent successfully. We&apos;ll get back to you soon.
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
