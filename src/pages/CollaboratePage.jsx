import { useMemo, useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Handshake,
  Mail,
  MapPin,
  Phone,
  Send,
  ShieldCheck,
  Users,
} from 'lucide-react';
import { formatAddress } from '../config';
import { useSettings } from '../context/SettingsContext';
import useScrollAnimation from '../hooks/useScrollAnimation';
import useLazySection from '../hooks/useLazySection';
import SectionSkeleton from '../components/ui/SectionSkeleton';

const inputClassName =
  'w-full rounded-xl border border-[#D8D2EE] bg-white/85 px-4 py-3 text-sm text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] outline-none transition-all duration-200 ease-out placeholder:text-muted-foreground/70 focus:border-primary/40 focus:ring-2 focus:ring-primary/20 dark:border-[#3B2C73] dark:bg-[#181231]/80 dark:shadow-none dark:placeholder:text-white/45';

const contactToneClasses = [
  'border-[#D8D1EE] bg-[linear-gradient(160deg,#FFFFFF_0%,#F7F4FF_100%)] dark:border-[#3A2D74] dark:bg-[linear-gradient(160deg,#17122E_0%,#120D25_100%)]',
  'border-[#D6DDF2] bg-[linear-gradient(160deg,#FFFFFF_0%,#F3F8FF_100%)] dark:border-[#2E4269] dark:bg-[linear-gradient(160deg,#121A2E_0%,#0F1427_100%)]',
  'border-[#E4D5EB] bg-[linear-gradient(160deg,#FFFFFF_0%,#FFF3F8_100%)] dark:border-[#543464] dark:bg-[linear-gradient(160deg,#21112A_0%,#1A1021_100%)]',
];

export default function CollaboratePage() {
  const { siteConfig } = useSettings();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const heroRef = useScrollAnimation({ y: 20, duration: 650 });
  const heroMetaRef = useScrollAnimation({ y: 20, duration: 650, delay: 120 });
  const formRef = useScrollAnimation({ x: -20, duration: 700 });
  const asideRef = useScrollAnimation({ x: 20, duration: 700, delay: 120 });
  const ctaRef = useScrollAnimation({ y: 22, duration: 650 });

  const { ref: flowRef, isVisible: flowVisible } = useLazySection();
  const { ref: teamsRef, isVisible: teamsVisible } = useLazySection();

  const primaryPhone = siteConfig.contact?.phone?.[0] || '+91 11 4680 1133';
  const primaryPhoneHref = primaryPhone.replace(/\s+/g, '');
  const generalEmail = siteConfig.contact?.email?.general || 'connect@theglobalavenues.com';
  const whatsappLink = siteConfig.social?.whatsapp || '#';
  const fullAddress = formatAddress(siteConfig.contact?.address);

  const highlightChips = useMemo(
    () => [
      `${siteConfig.stats.partnerUniversities} University Links`,
      `${siteConfig.stats.studentsRecruited} Applications Managed`,
      `${siteConfig.stats.visaSuccessRate} Conversion Performance`,
    ],
    [siteConfig.stats]
  );

  const collaborationFlow = useMemo(
    () => [
      {
        icon: Handshake,
        title: 'Discovery Call',
        description:
          'We understand your institution goals, target markets, and enrollment priorities in detail.',
      },
      {
        icon: ShieldCheck,
        title: 'Custom Plan',
        description:
          'Our team prepares a focused partnership strategy with channels, milestones, and transparent reporting.',
      },
      {
        icon: Users,
        title: 'Execution & Growth',
        description:
          'We activate campaigns, manage institution pipelines, and optimize continuously for stronger enrollment outcomes.',
      },
    ],
    []
  );

  const contactCards = useMemo(
    () => [
      {
        icon: Mail,
        title: 'Email',
        value: generalEmail,
        href: `mailto:${generalEmail}`,
      },
      {
        icon: Phone,
        title: 'Phone',
        value: primaryPhone,
        href: `tel:${primaryPhoneHref}`,
      },
      {
        icon: MapPin,
        title: 'Address',
        value: fullAddress,
        href: null,
      },
    ],
    [fullAddress, generalEmail, primaryPhone, primaryPhoneHref]
  );

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
      }, 2800);
    }, 450);
  };

  return (
    <div className="collaborate-page-gradient min-h-screen pt-16 text-foreground">
      <section className="collaborate-section-shell px-4 py-20 sm:px-6 lg:px-8">
        <div ref={heroRef} className="mx-auto max-w-5xl text-center">
          <div className="section-kicker-classic mb-5 inline-flex">Collaborate With Us</div>
          <h1 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            Build Global Education
            <span className="block bg-[linear-gradient(96deg,#2D1B69_0%,#5B45C6_45%,#E8521A_100%)] bg-clip-text text-transparent">
              Partnerships That Scale
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Reach our collaboration desk to discuss university representation, market expansion, admissions operations, and
            long-term institutional growth across India and beyond.
          </p>
        </div>

        <div ref={heroMetaRef} className="mx-auto mt-8 flex max-w-5xl flex-wrap items-center justify-center gap-3">
          {highlightChips.map((chip) => (
            <span
              key={chip}
              className="rounded-full border border-border/60 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground dark:bg-white/5"
            >
              {chip}
            </span>
          ))}
        </div>
      </section>

      <section className="collaborate-section-shell px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 lg:grid-cols-12">
          <div ref={formRef} className="lg:col-span-7">
            <div className="rounded-[30px] border border-[#DDD6F1] bg-[linear-gradient(160deg,#FFFFFF_0%,#F9F7FF_55%,#F4F8FF_100%)] p-6 shadow-[0_28px_80px_rgba(20,14,45,0.12)] dark:border-[#332761] dark:bg-[linear-gradient(160deg,#130F26_0%,#0F0B1F_58%,#171131_100%)] sm:p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-foreground sm:text-3xl">Start A Conversation</h2>
                <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                  Share your goals and our partnership team will reach out with a tailored roadmap.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="collab-name" className="mb-2 block text-sm font-semibold text-foreground">
                      Full Name
                    </label>
                    <input
                      id="collab-name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className={inputClassName}
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label htmlFor="collab-email" className="mb-2 block text-sm font-semibold text-foreground">
                      Email
                    </label>
                    <input
                      id="collab-email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className={inputClassName}
                      placeholder="name@institution.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="collab-phone" className="mb-2 block text-sm font-semibold text-foreground">
                      Phone
                    </label>
                    <input
                      id="collab-phone"
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={inputClassName}
                      placeholder={primaryPhone}
                    />
                  </div>
                  <div>
                    <label htmlFor="collab-subject" className="mb-2 block text-sm font-semibold text-foreground">
                      Subject
                    </label>
                    <input
                      id="collab-subject"
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className={inputClassName}
                      placeholder="Partnership enquiry"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="collab-message" className="mb-2 block text-sm font-semibold text-foreground">
                    Message
                  </label>
                  <textarea
                    id="collab-message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className={`${inputClassName} min-h-[150px] resize-y`}
                    placeholder="Tell us about your institution, goals, and preferred timeline."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitted}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[linear-gradient(92deg,#2D1B69_0%,#5B45C6_54%,#E8521A_100%)] px-5 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(45,27,105,0.35)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitted ? (
                    <>
                      <CheckCircle2 className="h-5 w-5" />
                      Message Sent
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          <div ref={asideRef} className="space-y-5 lg:col-span-5">
            <div className="rounded-3xl border border-[#D8D1EF] bg-[linear-gradient(160deg,#FFFFFF_0%,#F8F5FF_55%,#FFF4EC_100%)] p-6 shadow-[0_20px_60px_rgba(16,12,40,0.1)] dark:border-[#3A2D74] dark:bg-[linear-gradient(160deg,#17122E_0%,#100B22_55%,#24120B_100%)]">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">Response Window</p>
              <div className="mt-3 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
                  <Clock3 className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xl font-semibold text-foreground">Within 24 Hours</p>
                  <p className="text-sm text-muted-foreground">Monday to Saturday support desk</p>
                </div>
              </div>
            </div>

            {contactCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.title}
                  className={`rounded-2xl border p-5 shadow-[0_14px_34px_rgba(16,12,40,0.08)] ${contactToneClasses[index]}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">{card.title}</p>
                      {card.href ? (
                        <a
                          href={card.href}
                          className="mt-1 inline-block text-base font-semibold text-foreground transition-colors duration-200 hover:text-primary"
                        >
                          {card.value}
                        </a>
                      ) : (
                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{card.value}</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <div ref={teamsRef}>
        {teamsVisible ? (
          <section className="collaborate-section-shell px-4 py-16 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
              <div className="text-center">
                <div className="section-kicker-classic mb-4 inline-flex">Connect Faster</div>
                <h2 className="text-3xl font-bold text-foreground sm:text-4xl">Talk to the right team directly</h2>
              </div>

              <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
                {siteConfig.collaborateTeams.map((team, index) => (
                  <div
                    key={team.title}
                    className={`rounded-2xl border p-6 shadow-[0_16px_42px_rgba(16,12,40,0.09)] ${contactToneClasses[index % contactToneClasses.length]}`}
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">Team</p>
                    <h3 className="mt-2 text-2xl font-semibold text-foreground">{team.title}</h3>
                    <div className="mt-6 space-y-3 text-sm text-muted-foreground">
                      <div className="flex items-start gap-2.5">
                        <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                        <p className="leading-relaxed">{fullAddress}</p>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <Phone className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                        <a href={`tel:${team.phone.replace(/\s+/g, '')}`} className="hover:text-primary">
                          {team.phone}
                        </a>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <Mail className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                        <a href={`mailto:${team.email}`} className="break-all hover:text-primary">
                          {team.email}
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ) : (
          <SectionSkeleton height="h-[460px]" />
        )}
      </div>

      <section className="collaborate-section-shell px-4 pb-20 pt-8 sm:px-6 lg:px-8">
        <div ref={ctaRef} className="mx-auto max-w-7xl">
          <div className="rounded-[32px] border border-[#DACFF0] bg-[linear-gradient(108deg,#FFFFFF_0%,#F9F6FF_46%,#FEF0E7_100%)] p-7 shadow-[0_24px_60px_rgba(20,14,45,0.12)] dark:border-[#3A2D73] dark:bg-[linear-gradient(108deg,#1A1333_0%,#120D24_52%,#2A1409_100%)] sm:p-10">
            <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-[1fr_auto]">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">Preferred Channel</p>
                <h3 className="mt-2 text-2xl font-bold text-foreground sm:text-3xl">
                  Need immediate guidance on a collaboration request?
                </h3>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                  Message our team on WhatsApp for quick coordination and we will route your request to the right
                  desk instantly.
                </p>
              </div>
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[linear-gradient(92deg,#2D1B69_0%,#5B45C6_55%,#E8521A_100%)] px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(45,27,105,0.35)]"
              >
                Open WhatsApp
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <div ref={flowRef}>
        {flowVisible ? (
          <section className="collaborate-section-shell px-4 py-16 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
              <div className="text-center">
                <div className="section-kicker-classic mb-4 inline-flex">How We Collaborate</div>
                <h2 className="text-3xl font-bold text-foreground sm:text-4xl">A clear process. Predictable outcomes.</h2>
              </div>

              <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
                {collaborationFlow.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <div
                      key={step.title}
                      className="rounded-2xl border border-[#D8D0EF] bg-white/85 p-6 shadow-[0_18px_44px_rgba(16,12,40,0.08)] dark:border-[#32265F] dark:bg-[#120D25]/85"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
                          <Icon className="h-5 w-5" />
                        </div>
                        <span className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                          0{index + 1}
                        </span>
                      </div>
                      <h3 className="mt-5 text-xl font-semibold text-foreground">{step.title}</h3>
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        ) : (
          <SectionSkeleton height="h-[420px]" />
        )}
      </div>
    </div>
  );
}
