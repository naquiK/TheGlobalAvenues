import { useMemo, useState } from 'react';
import {
  ArrowRight,
  Building2,
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
import { ProcessSkeleton } from '../components/ui/SkeletonLayouts';
import { submitContactForm } from '../services/contactFormService';
import Seo from '../components/seo/Seo';
import WorldMap from '../components/contact/WorldMap';
import { DEFAULT_OFFICE_ID, OFFICE_LOCATIONS } from '../data/officeLocations';

const inputClassName =
  'w-full rounded-xl border border-[#D8D2EE] bg-white/85 px-4 py-3 text-sm text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] outline-none transition-all duration-200 ease-out placeholder:text-muted-foreground/70 focus:border-primary/40 focus:ring-2 focus:ring-primary/20 dark:border-[#3B2C73] dark:bg-[#181231]/80 dark:shadow-none dark:placeholder:text-white/45';

const contactToneClasses = [
  'border-[#D8D1EE] bg-[linear-gradient(160deg,#FFFFFF_0%,#F7F4FF_100%)] dark:border-[#3A2D74] dark:bg-[linear-gradient(160deg,#17122E_0%,#120D25_100%)]',
  'border-[#D6DDF2] bg-[linear-gradient(160deg,#FFFFFF_0%,#F3F8FF_100%)] dark:border-[#2E4269] dark:bg-[linear-gradient(160deg,#121A2E_0%,#0F1427_100%)]',
  'border-[#E4D5EB] bg-[linear-gradient(160deg,#FFFFFF_0%,#FFF3F8_100%)] dark:border-[#543464] dark:bg-[linear-gradient(160deg,#21112A_0%,#1A1021_100%)]',
];

const officeCardToneClasses = [
  'border-[#D8D1EE] bg-[linear-gradient(160deg,rgba(255,255,255,0.96)_0%,rgba(247,244,255,0.92)_100%)] dark:border-[#3A2D74] dark:bg-[linear-gradient(160deg,rgba(23,18,46,0.96)_0%,rgba(18,13,37,0.92)_100%)]',
  'border-[#D6DDF2] bg-[linear-gradient(160deg,rgba(255,255,255,0.96)_0%,rgba(243,248,255,0.92)_100%)] dark:border-[#2E4269] dark:bg-[linear-gradient(160deg,rgba(18,26,46,0.96)_0%,rgba(15,20,39,0.92)_100%)]',
  'border-[#E4D5EB] bg-[linear-gradient(160deg,rgba(255,255,255,0.96)_0%,rgba(255,243,248,0.92)_100%)] dark:border-[#543464] dark:bg-[linear-gradient(160deg,rgba(33,17,42,0.96)_0%,rgba(26,16,33,0.92)_100%)]',
];

const EMAIL_CONTACTS = [
  { label: 'In-Country Representation', email: 'neetu@theglobalavenues.com' },
  { label: 'UNI Collaboration', email: 'connect@theglobalavenues.com' },
  { label: 'B2B Agent partnership', email: 'apply@theglobalavenues.com' },
  { label: 'Admissions', email: 'admissions@theglobalavenues.com' },
  { label: 'Job Opportunities', email: 'career@theglobalavenues.com' },
];

function formatPhoneHref(phone) {
  return phone.replace(/[^\d+]/g, '');
}

function buildGmailComposeHref(email) {
  return 'https://mail.google.com/mail/?view=cm&fs=1&to=' + encodeURIComponent(email);
}

function buildGoogleMapsHref(address) {
  return 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(address);
}

function GlobalAvenuesLogoMark({ className = '' }) {
  return (
    <span className={`inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-white/95 shadow-[0_4px_10px_rgba(20,14,45,0.16)] ${className}`} aria-hidden="true">
      <span className="relative h-3.5 w-3.5">
        <span className="absolute bottom-0 left-0 h-1.5 w-1.5 rounded-[1px] bg-brand-orange" />
        <span className="absolute left-1 top-1 h-1.5 w-1.5 rounded-[1px] border-2 border-brand-orange border-b-0 border-l-0" />
        <span className="absolute right-0 top-0 h-1.5 w-1.5 rounded-[1px] border-2 border-brand-orange border-b-0 border-l-0" />
      </span>
    </span>
  );
}

export default function CollaboratePage() {
  const { siteConfig } = useSettings();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [activeOfficeId, setActiveOfficeId] = useState(DEFAULT_OFFICE_ID);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('idle');
  const [submitMessage, setSubmitMessage] = useState('');

  const heroRef = useScrollAnimation({ y: 20, duration: 650 });
  const heroMetaRef = useScrollAnimation({ y: 20, duration: 650, delay: 120 });
  const officeMapRef = useScrollAnimation({ y: 24, duration: 700 });
  const officeRailRef = useScrollAnimation({ y: 24, duration: 700, delay: 120 });
  const formRef = useScrollAnimation({ x: -20, duration: 700 });
  const asideRef = useScrollAnimation({ x: 20, duration: 700, delay: 120 });
  const ctaRef = useScrollAnimation({ y: 22, duration: 650 });

  const { ref: flowRef, isVisible: flowVisible } = useLazySection();
  const { ref: teamsRef, isVisible: teamsVisible } = useLazySection();

  const primaryPhone = siteConfig.contact?.phone?.[0] || '+91 9319831133';
  const primaryPhoneHref = primaryPhone.replace(/\s+/g, '');
  const generalEmail = siteConfig.contact?.email?.general || 'connect@theglobalavenues.com';
  const whatsappLink = siteConfig.social?.whatsapp || '#';
  const fullAddress = formatAddress(siteConfig.contact?.address);
  const mapHref = buildGoogleMapsHref(fullAddress);
  const brandLogo = siteConfig.company.logo.lightSrc || '/logo-light.png';

  const highlightChips = useMemo(
    () => [
      `${siteConfig.stats.partnerUniversities} Exclusive Universities`,
      `${siteConfig.stats.studentsRecruited} Applications Managed`,
      `${siteConfig.stats.visaSuccessRate} Conversion Performance`,
    ],
    [siteConfig.stats]
  );

  const officeLocations = OFFICE_LOCATIONS;
  const activeOffice = useMemo(
    () => officeLocations.find((office) => office.id === activeOfficeId) || officeLocations[0],
    [activeOfficeId, officeLocations]
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
        href: buildGmailComposeHref(generalEmail),
        external: true,
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
        href: mapHref,
        external: true,
      },
    ],
    [fullAddress, generalEmail, mapHref, primaryPhone, primaryPhoneHref]
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setSubmitMessage('');

    try {
      await submitContactForm({
        formName: 'Collaborate Form',
        source: '/collaborate',
        fields: {
          Name: formData.name,
          Email: formData.email,
          Phone: formData.phone,
          Subject: formData.subject,
          Message: formData.message,
        },
      });

      setSubmitStatus('success');
      setSubmitMessage('Message sent.');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (error) {
      setSubmitStatus('error');
      setSubmitMessage('Message failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="collaborate-page-gradient min-h-screen pt-16 text-foreground">
      <Seo
        title="Collaborate With The Global Avenues — Partner for University Growth"
        description="Connect with The Global Avenues to scale your university's international student enrolment. Strategic partnerships, admissions operations, and market expansion support for institutions targeting India & South Asia."
        path="/collaborate"
        image="/videos/hero-poster.jpg"
        keywords={[
          'collaborate The Global Avenues',
          'university partnership India',
          'global education consulting',
          'international student recruitment partner',
          'university market expansion India',
          'admissions operations outsourcing',
          'education channel partner',
        ]}
      />
      <section className="collaborate-section-shell px-4 py-20 sm:px-6 lg:px-8">
        <div ref={heroRef} className="mx-auto max-w-5xl text-center">
          <div className="section-kicker-classic mb-5 inline-flex">Collaborate With Us</div>
          <h1 className="text-2xl font-bold leading-tight sm:text-5xl lg:text-5xl">
            {/* Build Global Education */}
            <span className="block bg-[linear-gradient(96deg,#2D1B69_0%,#5B45C6_45%,#E8521A_100%)] bg-clip-text text-transparent">
              Scale Your International Student Enrolment
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-lg">
            Collaborate with us to build effective recruitment pathways, strengthen admissions support, and grow your enrolment footprint across South Asia.
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

      {/* ── World Presence Section (QE-Group inspired) ── */}
      <section className="collaborate-section-shell px-4 pb-10 pt-2 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 text-center">
            <div className="section-kicker-classic mb-4 inline-flex">
              <GlobalAvenuesLogoMark className="mr-2" />
              Our Global Presence
            </div>
            <h2 className="text-xl font-bold leading-tight text-foreground sm:text-4xl">
              Where in the world are we?
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              Connect with our headquarters and regional desks for university representation, admissions, partnerships, and careers.
            </p>
          </div>

          {/* Map + Office Network */}
          <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(310px,360px)] xl:grid-cols-[minmax(0,1fr)_390px]">

            {/* Left: World Map */}
            <div ref={officeMapRef} className="flex min-w-0 flex-col gap-6">
              <WorldMap
                activeOfficeId={activeOfficeId}
                onOfficeChange={setActiveOfficeId}
              />

              <div className="hidden rounded-[28px] border border-[#D6DDF2] bg-white/84 p-4 shadow-[0_20px_60px_rgba(20,14,45,0.07)] backdrop-blur dark:border-white/10 dark:bg-[#120D25]/86 sm:p-5 lg:block">
                <div className="grid grid-cols-1 gap-5 xl:grid-cols-[280px_minmax(0,1fr)] xl:items-center">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#2D1B69_0%,#5B45C6_58%,#E8521A_100%)] shadow-sm">
                      <Mail className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-foreground">Direct Email Desks</h3>
                      <p className="text-xs text-muted-foreground">Route your inquiry to the right team</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {EMAIL_CONTACTS.map((item) => (
                      <a
                        key={item.email}
                        href={buildGmailComposeHref(item.email)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex min-w-0 items-center justify-between gap-3 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-primary/5 hover:shadow-sm dark:border-white/5 dark:bg-white/5 dark:hover:border-primary/30 dark:hover:bg-primary/10"
                      >
                        <span className="min-w-0 flex-1">
                          <span className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground transition-colors group-hover:text-primary/80">
                            {item.label}
                          </span>
                          <span className="mt-0.5 block truncate text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
                            {item.email}
                          </span>
                        </span>
                        <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-white text-muted-foreground shadow-sm transition-all group-hover:bg-primary group-hover:text-white dark:bg-[#1A1533] dark:text-white/70">
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:-rotate-45" />
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Quick-contact panel */}
            <div ref={officeRailRef} className="flex min-w-0 flex-col gap-5">
              <div className={`relative overflow-hidden rounded-[28px] border p-4 shadow-[0_24px_64px_rgba(16,12,40,0.1)] sm:p-5 ${officeCardToneClasses[officeLocations.findIndex((office) => office.id === activeOffice.id) % officeCardToneClasses.length]}`}>
                <div className="pointer-events-none absolute -right-14 -top-20 h-44 w-44 rounded-full bg-[radial-gradient(circle,rgba(91,69,198,0.16),transparent_68%)]" />
                <div className="pointer-events-none absolute -bottom-20 left-8 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(232,82,26,0.11),transparent_70%)]" />

                <div className="relative flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">Office Network</p>
                    <h3 className="mt-1 text-2xl font-bold text-foreground">Choose a regional desk</h3>
                  </div>
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl border border-primary/15 bg-white/78 text-primary shadow-sm dark:border-white/10 dark:bg-white/8">
                    <Building2 className="h-5 w-5" />
                  </div>
                </div>

                <div className="relative mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-1">
                  {officeLocations.map((office) => {
                    const isActive = office.id === activeOfficeId;
                    return (
                      <button
                        key={office.id}
                        type="button"
                        onMouseEnter={() => setActiveOfficeId(office.id)}
                        onFocus={() => setActiveOfficeId(office.id)}
                        onClick={() => setActiveOfficeId(office.id)}
                        aria-pressed={isActive}
                        className={`group min-w-0 rounded-2xl border px-4 py-3 text-left transition-all duration-300 ${
                          isActive
                            ? 'border-primary/30 bg-white shadow-[0_14px_28px_rgba(45,27,105,0.11)] dark:border-brand-orange-light/35 dark:bg-[linear-gradient(135deg,rgba(91,69,198,0.28)_0%,rgba(232,82,26,0.16)_100%)] dark:shadow-[0_14px_30px_rgba(0,0,0,0.28)]'
                            : 'border-white/60 bg-white/48 hover:border-primary/18 hover:bg-white/80 dark:border-white/8 dark:bg-white/5 dark:hover:bg-white/9'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <span className="min-w-0 flex-1 pr-2">
                            <span className="block text-[9px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                              {office.type}
                            </span>
                            <span className="mt-1 block whitespace-normal break-words text-sm font-semibold leading-tight text-foreground sm:text-base lg:text-sm">
                              {office.country}
                            </span>
                            <span className="mt-0.5 block whitespace-normal break-words text-xs leading-relaxed text-muted-foreground">
                              {office.title}
                            </span>
                          </span>
                          <span className={`mt-1 h-2.5 w-2.5 flex-shrink-0 rounded-full bg-gradient-to-r ${office.accentClass} ${isActive ? 'opacity-100' : 'opacity-45 group-hover:opacity-80'}`} />
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="relative mt-5 rounded-[22px] border border-white/70 bg-white/62 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] dark:border-white/10 dark:bg-white/7">
                  <div className="flex items-start gap-3">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-primary/15 bg-white shadow-sm dark:bg-white/90">
                      <img src={brandLogo} alt={siteConfig.company.logo.alt} className="h-8 w-8 object-contain" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">{activeOffice.type}</p>
                          <h4 className="mt-1 whitespace-normal break-words text-lg font-bold leading-tight text-foreground sm:text-xl">
                            {activeOffice.country}
                          </h4>
                          <p className="mt-1 whitespace-normal break-words text-sm leading-relaxed text-muted-foreground">
                            {activeOffice.title}
                          </p>
                        </div>
                        <span className={`mt-1 h-3 w-3 flex-shrink-0 rounded-full bg-gradient-to-r ${activeOffice.accentClass} shadow-[0_0_0_4px_rgba(255,255,255,0.7)] dark:shadow-[0_0_0_4px_rgba(255,255,255,0.08)]`} />
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 space-y-3">
                    <div className="flex items-start gap-3 rounded-2xl border border-white/70 bg-white/62 p-3 dark:border-white/10 dark:bg-white/7">
                      <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                      <p className="text-sm leading-relaxed text-muted-foreground">{activeOffice.address}</p>
                    </div>
                    {activeOffice.phones?.length ? (
                      <div className="flex items-start gap-3 rounded-2xl border border-white/70 bg-white/62 p-3 dark:border-white/10 dark:bg-white/7">
                        <Phone className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                        <div className="flex flex-wrap gap-2">
                          {activeOffice.phones.map((phone) => (
                            <a
                              key={phone}
                              href={`tel:${formatPhoneHref(phone)}`}
                              className="rounded-full border border-primary/10 bg-primary/5 px-3 py-1 text-xs font-semibold text-foreground transition-colors hover:border-primary/30 hover:text-primary dark:border-white/10 dark:bg-white/5"
                            >
                              {phone}
                            </a>
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>

              {/* Direct Email Desks card - Redesigned and Elevated */}
              <div className="hidden">
                {/* Subtle gradient glow */}
                <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(91,69,198,0.12),transparent_70%)]" />
                
                <div className="relative mb-6 flex items-center gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#2D1B69_0%,#5B45C6_100%)] shadow-sm">
                    <Mail className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground">Direct Email Desks</h3>
                    <p className="text-xs text-muted-foreground">Route your inquiry to the right team</p>
                  </div>
                </div>

                <div className="relative flex flex-col gap-3">
                  {EMAIL_CONTACTS.map((item) => (
                    <a
                      key={item.email}
                      href={buildGmailComposeHref(item.email)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between gap-3 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-primary/5 hover:shadow-sm dark:border-white/5 dark:bg-white/5 dark:hover:border-primary/30 dark:hover:bg-primary/10"
                    >
                      <div className="min-w-0 flex-1">
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground transition-colors group-hover:text-primary/80">
                          {item.label}
                        </span>
                        <span className="mt-0.5 block truncate text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
                          {item.email}
                        </span>
                      </div>
                      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-white text-muted-foreground shadow-sm transition-all group-hover:bg-primary group-hover:text-white dark:bg-[#1A1533] dark:text-white/70">
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:-rotate-45" />
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              {/* Improved Response time / Support badge */}
              <div className="hidden group items-center gap-4 rounded-[24px] border border-[#D8D1EF] bg-[linear-gradient(160deg,#FFFFFF_0%,#F8F5FF_56%,#FFF6F0_100%)] p-5 shadow-sm transition-all hover:shadow-md dark:border-[#3A2D74] dark:bg-[linear-gradient(160deg,#17122E_0%,#100B22_56%,#24120B_100%)]">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] ring-1 ring-black/5 transition-transform duration-300 group-hover:scale-105 dark:bg-white/5 dark:ring-white/10">
                  <Clock3 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-base font-bold text-foreground">Global Support Desk</p>
                  <p className="mt-0.5 text-xs font-medium text-muted-foreground">Monday to Saturday • 24hr response</p>
                </div>
              </div>
            </div>
          </div>

          {/* Office detail cards + network selector — below the map */}
          <div className="hidden">

            {/* Active office detail */}
            <div className={`rounded-[24px] border p-5 shadow-[0_20px_54px_rgba(16,12,40,0.1)] ${officeCardToneClasses[officeLocations.findIndex((office) => office.id === activeOffice.id) % officeCardToneClasses.length]}`}>
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-primary/15 bg-white shadow-[inset_0_1px_0_rgba(255,255,255,0.75)]">
                  <img src={brandLogo} alt={siteConfig.company.logo.alt} className="h-9 w-9 object-contain" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">{activeOffice.type}</p>
                      <h3 className="mt-0.5 text-xl font-bold leading-tight text-foreground">{activeOffice.country}</h3>
                      <p className="text-sm text-muted-foreground">{activeOffice.title}</p>
                    </div>
                    <span className={`h-3 w-3 rounded-full bg-gradient-to-r ${activeOffice.accentClass} shadow-sm`} />
                  </div>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="flex items-start gap-3 rounded-2xl border border-white/65 bg-white/58 p-3 dark:border-white/10 dark:bg-white/6">
                  <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                  <p className="text-sm leading-relaxed text-muted-foreground">{activeOffice.address}</p>
                </div>
                <div className="flex items-start gap-3 rounded-2xl border border-white/65 bg-white/58 p-3 dark:border-white/10 dark:bg-white/6">
                  <Phone className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                  <div className="flex flex-wrap gap-2">
                    {activeOffice.phones.map((phone) => (
                      <a
                        key={phone}
                        href={`tel:${formatPhoneHref(phone)}`}
                        className="block text-sm font-medium text-foreground transition-colors hover:text-primary"
                      >
                        {phone}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Office network selector */}
            <div className="rounded-[24px] border border-[#DCD6F0] bg-white/72 p-3 shadow-[0_16px_44px_rgba(16,12,40,0.07)] backdrop-blur dark:border-white/10 dark:bg-white/6">
              <p className="px-2 pb-2 pt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Office Network</p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:grid-cols-1">
                {officeLocations.map((office) => {
                  const isActive = office.id === activeOfficeId;
                  return (
                    <button
                      key={office.id}
                      type="button"
                      onMouseEnter={() => setActiveOfficeId(office.id)}
                      onFocus={() => setActiveOfficeId(office.id)}
                      onClick={() => setActiveOfficeId(office.id)}
                      className={`group rounded-2xl border px-4 py-3 text-left transition-all duration-300 ${
                        isActive
                          ? 'border-primary/25 bg-white shadow-[0_14px_28px_rgba(45,27,105,0.1)] dark:border-brand-orange-light/35 dark:bg-[linear-gradient(135deg,rgba(91,69,198,0.28)_0%,rgba(232,82,26,0.16)_100%)] dark:shadow-[0_14px_30px_rgba(0,0,0,0.28)]'
                          : 'border-transparent bg-white/50 hover:border-primary/18 hover:bg-white/80 dark:bg-white/5 dark:hover:bg-white/8'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <span>
                          <span className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                            {office.type}
                          </span>
                          <span className="mt-1 block text-base font-semibold text-foreground">{office.country}</span>
                          <span className="block text-xs text-muted-foreground">{office.title}</span>
                        </span>
                        <span className={`mt-1 h-2.5 w-2.5 rounded-full bg-gradient-to-r ${office.accentClass} ${isActive ? 'opacity-100' : 'opacity-45 group-hover:opacity-80'}`} />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-[28px] border border-[#D6DDF2] bg-white/84 p-4 shadow-[0_20px_60px_rgba(20,14,45,0.07)] backdrop-blur dark:border-white/10 dark:bg-[#120D25]/86 sm:p-5 lg:hidden">
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-[300px_minmax(0,1fr)] lg:items-center">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#2D1B69_0%,#5B45C6_58%,#E8521A_100%)] shadow-sm">
                  <Mail className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">Direct Email Desks</h3>
                  <p className="text-xs text-muted-foreground">Route your inquiry to the right team</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {EMAIL_CONTACTS.map((item) => (
                  <a
                    key={item.email}
                    href={buildGmailComposeHref(item.email)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex min-w-0 items-center justify-between gap-3 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-primary/5 hover:shadow-sm dark:border-white/5 dark:bg-white/5 dark:hover:border-primary/30 dark:hover:bg-primary/10"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground transition-colors group-hover:text-primary/80">
                        {item.label}
                      </span>
                      <span className="mt-0.5 block truncate text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
                        {item.email}
                      </span>
                    </span>
                    <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-white text-muted-foreground shadow-sm transition-all group-hover:bg-primary group-hover:text-white dark:bg-[#1A1533] dark:text-white/70">
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:-rotate-45" />
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>
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
                      required
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
                  disabled={isSubmitting}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[linear-gradient(92deg,#2D1B69_0%,#5B45C6_54%,#E8521A_100%)] px-5 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(45,27,105,0.35)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <Clock3 className="h-5 w-5 animate-pulse" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      Send Message
                    </>
                  )}
                </button>

                {submitStatus !== 'idle' && (
                  <div
                    className={`rounded-xl border px-4 py-3 text-sm font-medium ${
                      submitStatus === 'success'
                        ? 'border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-700/60 dark:bg-emerald-900/20 dark:text-emerald-200'
                        : 'border-red-300 bg-red-50 text-red-800 dark:border-red-700/60 dark:bg-red-900/20 dark:text-red-200'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {submitStatus === 'success' ? (
                        <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0" />
                      ) : (
                        <ShieldCheck className="mt-0.5 h-4 w-4 flex-shrink-0" />
                      )}
                      <p>{submitMessage}</p>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>

          <div ref={asideRef} className="space-y-4 lg:col-span-5">
            {contactCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.title}
                  className={`group rounded-2xl border p-5 shadow-[0_14px_34px_rgba(16,12,40,0.08)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_44px_rgba(16,12,40,0.12)] ${contactToneClasses[index]}`}
                >
                  <div className="flex items-start gap-4">
                    <div className="mt-0.5 flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary shadow-sm transition-transform duration-300 group-hover:scale-105">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">{card.title}</p>
                      {card.href ? (
                        <a
                          href={card.href}
                          target={card.external ? '_blank' : undefined}
                          rel={card.external ? 'noopener noreferrer' : undefined}
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
                        <a href={buildGmailComposeHref(team.email)} target="_blank" rel="noopener noreferrer" className="break-all hover:text-primary">
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
          <ProcessSkeleton count={3} />
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
          <ProcessSkeleton count={3} />
        )}
      </div>
    </div>
  );
}
