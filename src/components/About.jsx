import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const offerings = [
  {
    title: 'Choosing University/School',
    description: '350+ degree programs conducted in English from reputed partner universities.',
  },
  {
    title: 'Financial Support',
    description: 'Guidance on fund requirements and cost of living at your study destination.',
  },
  {
    title: 'Immigration/Arrival Support',
    description: 'Full assistance with embassy guidelines, accommodation, and practicalities.',
  },
  {
    title: 'Visa Process',
    description: 'Complete support with visa application, interview preparation, and documentation.',
  },
  {
    title: 'Acceptance within 72hrs',
    description: 'Simple and fast application process ensuring you do not miss enrollment deadlines.',
  },
  {
    title: 'Pre Departure Briefing',
    description: 'Key information and checklist to ensure smooth transition to your study destination.',
  },
];

const OfferingCard = ({ offering, index }) => {
  const [offeringRef, offeringIsVisible] = useScrollAnimation();

  return (
    <div
      ref={offeringRef}
      className={`rounded-xl border border-border bg-background p-6 transition-all duration-500 hover:border-primary hover:shadow-md ${
        offeringIsVisible ? 'animate-fade-in-up' : 'translate-y-[30px] opacity-0'
      }`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-2xl font-bold text-primary">
          {index + 1}
        </div>
        <div>
          <h4 className="mb-2 font-bold text-foreground">{offering.title}</h4>
          <p className="text-sm text-muted-foreground">{offering.description}</p>
        </div>
      </div>
    </div>
  );
};

export function About() {
  const [ref, isVisible] = useScrollAnimation();

  return (
    <section id="about" className="relative overflow-hidden px-4 py-20">
      <div className="absolute top-40 right-0 -z-10 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />

      <div className="mx-auto w-full max-w-7xl">
        <div
          ref={ref}
          className={`mb-16 grid grid-cols-1 items-start gap-12 transition-all duration-1000 lg:grid-cols-2 ${
            isVisible ? 'animate-fade-in-up' : 'translate-y-[30px] opacity-0'
          }`}
        >
          <div className="space-y-6">
            <div className="inline-block rounded-full bg-secondary/10 px-4 py-2 text-sm font-semibold text-secondary">
              About Us
            </div>
            <h2 className="text-4xl font-bold leading-tight text-foreground lg:text-5xl">
              Leading Student Recruitment Experts in South Asia
            </h2>
            <p className="text-lg leading-relaxed text-muted-foreground">
              The Global Avenues leverages its strong presence in South Asia and deep expertise in localized
              outreach to help you achieve your international student enrollment goals. We collaborate with
              higher education institutions, schools, and education service providers to create customized
              plans that enhance brand recognition and attract top-tier students.
            </p>
            <div className="pt-4">
              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-lg bg-secondary px-6 py-3 font-semibold text-secondary-foreground transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                Start Your Journey
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/20 to-secondary/20 blur-2xl" />
            <div className="relative space-y-6 rounded-3xl border border-border bg-background p-8">
              <h3 className="text-2xl font-bold text-foreground">Offering End To End Support</h3>
              <div className="space-y-4">
                {[
                  {
                    color: 'text-primary',
                    title: 'Comprehensive Support',
                    description: 'From university selection to post-arrival assistance',
                  },
                  {
                    color: 'text-secondary',
                    title: 'Expert Guidance',
                    description: 'Professional consultants with years of experience',
                  },
                  {
                    color: 'text-accent',
                    title: 'Fast Processing',
                    description: 'Acceptance within 72 hours of application',
                  },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-4">
                    <CheckCircle2 className={`mt-1 h-6 w-6 flex-shrink-0 ${item.color}`} />
                    <div>
                      <p className="font-semibold text-foreground">{item.title}</p>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="mb-8 text-center text-3xl font-bold text-foreground">Our Step-by-Step Support</h3>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {offerings.map((offering, index) => (
              <OfferingCard key={offering.title} offering={offering} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
