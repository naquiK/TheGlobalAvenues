import useScrollAnimation from '../../hooks/useScrollAnimation';

const trustItems = [
  { id: 1, label: 'ICN Business School', href: 'https://www.icn-artem.com/en/' },
  { id: 2, label: 'Benedictine University', href: 'https://ben.edu/' },
  { id: 3, label: 'Elmhurst University', href: 'https://www.elmhurst.edu/' },
  { id: 4, label: 'Mesoyios College', href: 'https://www.mesoyios.ac.cy/' },
  { id: 5, label: 'CEFAM International School', href: 'https://www.cefam.fr/en/' },
  { id: 6, label: 'KES College Nicosia', href: 'https://www.kescollege.ac.cy/en/' },
  { id: 7, label: 'International American University', href: 'https://iaula.edu/' },
  { id: 8, label: 'FH Kufstein Tirol', href: 'https://www.fh-kufstein.ac.at/en/Home' },
  { id: 9, label: 'EUAS', href: 'https://euas.eu/' },
  { id: 10, label: 'MJM Graphic Design', href: 'https://www.mjm-design.com/en' },
  { id: 11, label: 'EIT InnoEnergy', href: 'https://apply.innoenergy.com/' },
];

export default function UniversityTrustBar() {
  const sectionRef = useScrollAnimation({ delay: 0, duration: 500 });
  const marqueeItems = [...trustItems, ...trustItems];

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-transparent px-4 pb-10 pt-4 sm:px-6 sm:pb-10 sm:pt-5 lg:px-8"
    >

      <div className="mx-auto max-w-7xl">
        <p className="mx-auto mb-7 w-fit rounded-full border border-[#2D1B69]/15 bg-white/70 px-5 py-2.5 text-center text-[12px] font-semibold uppercase tracking-[0.28em] text-[#4F3F84] shadow-[0_8px_24px_rgba(45,27,105,0.08)] backdrop-blur-sm dark:border-white/15 dark:bg-white/[0.06] dark:text-white/80 dark:shadow-[0_10px_24px_rgba(4,2,20,0.42)]">
          Trusted by leading universities worldwide
        </p>

        <div
          className="overflow-hidden"
          style={{
            maskImage:
              'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
            WebkitMaskImage:
              'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
          }}
        >
          <div className="group flex w-max min-w-full gap-4 hover:[animation-play-state:paused] motion-safe:animate-[trustScroll_25s_linear_infinite]">
            {marqueeItems.map((item, index) => (
              <a
                key={`${item.id}-${index}`}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-9 min-w-[90px] flex-shrink-0 items-center justify-center rounded-[10px] border border-[#2D1B69]/14 bg-gradient-to-b from-white/96 to-[#F7F4FF]/96 px-4 text-[11px] text-[#3E316E] opacity-95 shadow-[0_2px_10px_rgba(45,27,105,0.05)] transition-[background-color,border-color,color,box-shadow] duration-200 hover:border-[#5340B0]/35 hover:bg-white hover:shadow-[0_8px_18px_rgba(83,64,176,0.14)] dark:border-white/20 dark:bg-gradient-to-b dark:from-white/[0.12] dark:to-white/[0.06] dark:text-white/90 dark:shadow-[0_10px_24px_rgba(4,2,20,0.46)] dark:hover:border-white/30 dark:hover:bg-white/[0.1] sm:h-12 sm:min-w-[120px]"
              >
                {/* TODO: replace with university <img> logo */}
                <span className="whitespace-nowrap font-medium tracking-[0.12em] text-current transition-colors duration-200 group-hover:text-[#2D1B69] dark:group-hover:text-white">
                  {item.label}
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes trustScroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}
