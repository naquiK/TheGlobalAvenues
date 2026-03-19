import { useState } from 'react';
import { Send } from 'lucide-react';
import useScrollAnimation from '../hooks/useScrollAnimation';
import { InteractiveGlobe } from './contact/InteractiveGlobe';

export function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const headingRef = useScrollAnimation({ y: 20, duration: 600 });
  const globeRef = useScrollAnimation({ x: -20, duration: 700 });
  const formRef = useScrollAnimation({ x: 20, duration: 700, delay: 150 });

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

  return (
    <section id="contact" className="relative overflow-hidden bg-transparent px-4 pb-0 pt-20">

      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <div
          ref={headingRef}
          className="mb-2 text-center"
        >
          <div className="section-kicker-classic mb-4">
            Get In Touch
          </div>
          <h2 className="section-title-classic mb-4">
            Ready to Start <span className="section-title-classic-accent">Your Journey?</span>
          </h2>
          <p className="section-subtitle-classic">
            Contact us today and let&apos;s discuss how we can help you achieve your international education goals.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1fr)_24.5rem] lg:items-center lg:gap-6 xl:gap-8">
          <div
            ref={globeRef}
            className="order-2 overflow-visible rounded-[24px] lg:order-1 lg:overflow-hidden lg:rounded-[28px] lg:pt-20"
          >
            <div className="mx-auto h-[320px] w-full max-w-[34rem] sm:h-[430px] sm:max-w-[42rem] lg:h-[620px] lg:max-w-[52rem]">
              <InteractiveGlobe />
            </div>
          </div>

          <div
            ref={formRef}
            className="order-1 mx-auto w-full max-w-[24.5rem] rounded-2xl border border-slate-200 bg-background/62 p-4 shadow-[0_24px_60px_rgba(13,10,26,0.22)] backdrop-blur-md dark:border-white/12 sm:p-5 lg:order-2 lg:mx-0 lg:mt-10 lg:justify-self-end lg:p-5"
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 transition-all placeholder:text-slate-500 focus:border-brand-purple/40 focus:outline-none focus:ring-1 focus:ring-brand-purple/40 dark:border-white/10 dark:bg-white/10 dark:text-white dark:placeholder:text-white/60"
                  placeholder="Aarav Mehta"
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
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 transition-all placeholder:text-slate-500 focus:border-brand-purple/40 focus:outline-none focus:ring-1 focus:ring-brand-purple/40 dark:border-white/10 dark:bg-white/10 dark:text-white dark:placeholder:text-white/60"
                  placeholder="aarav.mehta@example.com"
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
                  className="w-full resize-none rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 transition-all placeholder:text-slate-500 focus:border-brand-purple/40 focus:outline-none focus:ring-1 focus:ring-brand-purple/40 dark:border-white/10 dark:bg-white/10 dark:text-white dark:placeholder:text-white/60"
                  placeholder="I want guidance for studying abroad in Europe."
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
