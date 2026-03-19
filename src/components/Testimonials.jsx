import { useCallback, useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import useScrollAnimation from '../hooks/useScrollAnimation';
import { getTestimonials } from '../services/contentApi';
import { resolveMediaUrl } from '../services/apiClient';

const fallbackTestimonials = [
  {
    name: 'Vardha Kharbanda',
    location: 'New York',
    photo: 'https://i.pravatar.cc/160?img=47',
    content:
      'A truly professional team who extended support and trusted me throughout. I would like to express sincere gratitude to the whole team for all the support.',
    rating: 5,
  },
  {
    name: 'Pratibha Mittal',
    location: 'California',
    photo: 'https://i.pravatar.cc/160?img=32',
    content:
      "I am pleased with the service I've received. Their professionalism and ability exceeded my expectations. The team showed commendable customer service.",
    rating: 5,
  },
  {
    name: 'Anuj Garg',
    location: 'Indiana',
    photo: 'https://i.pravatar.cc/160?img=15',
    content:
      'My experience with them was extremely nice. They have a very friendly environment where I got to learn a lot.',
    rating: 5,
  },
  {
    name: 'Vibha Kokiloo',
    location: 'Dubai',
    photo: 'https://i.pravatar.cc/160?img=5',
    content:
      'Amazing team and great services! I would definitely recommend you to my friends who want to study abroad.',
    rating: 5,
  },
  {
    name: 'Rajat Chohda',
    location: 'Netherlands',
    photo: 'https://i.pravatar.cc/160?img=68',
    content:
      'Just loved the way they work. If you are looking for genuine consultants, please visit them.',
    rating: 5,
  },
  {
    name: 'Waseem Akram',
    location: 'France',
    photo: 'https://i.pravatar.cc/160?img=11',
    content:
      'Wonderful experience with The Global Avenues. Highly professional and best consulting for students who want to study in Europe. Very grateful!',
    rating: 5,
  },
].map((item, index) => ({
  id: `fallback-${index + 1}`,
  ...item,
}));

const LAYOUTS = [
  { key: 'two_big', minCount: 2 },
  { key: 'four_small', minCount: 4 },
];
const ROTATION_INTERVAL_MS = 5200;
const SLIDE_DURATION_MS = 1000;

const clampRating = (value) => {
  const num = Number(value);
  if (!Number.isFinite(num)) return 5;
  return Math.min(5, Math.max(1, Math.round(num)));
};

const firstValue = (source, keys) => {
  for (const key of keys) {
    const value = source?.[key];
    if (value !== undefined && value !== null && String(value).trim() !== '') {
      return value;
    }
  }
  return '';
};

const normalizeTestimonials = (rawTestimonials = []) =>
  rawTestimonials
    .map((item, index) => {
      const name = firstValue(item, ['name', 'author', 'client_name', 'student_name']);
      const location = firstValue(item, [
        'designation',
        'location',
        'city',
        'country',
        'program',
        'role',
      ]);
      const content = firstValue(item, ['message', 'content', 'quote', 'review', 'testimonial']);
      const photo = firstValue(item, ['photo', 'image', 'avatar', 'profile_image']);

      return {
        id: firstValue(item, ['id', 'slug']) || `${name || 'testimonial'}-${index}`,
        name: name || 'Student',
        location: location || 'Global Student',
        content,
        rating: clampRating(firstValue(item, ['rating', 'stars'])),
        photo: photo ? resolveMediaUrl(photo) : '',
      };
    })
    .filter((item) => item.content);

const getInitials = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('') || 'TG';

const trimText = (text = '', maxLength = 160) =>
  text.length > maxLength ? `${text.slice(0, maxLength).trim()}...` : text;

const getAvailableLayouts = (total) => LAYOUTS.filter((layout) => total >= layout.minCount);

const pickRandomLayout = (total, previous) => {
  const available = getAvailableLayouts(total);
  if (available.length === 0) return 'two_big';
  if (available.length === 1) return available[0].key;

  const pool = available.filter((layout) => layout.key !== previous);
  const candidates = pool.length > 0 ? pool : available;
  return candidates[Math.floor(Math.random() * candidates.length)].key;
};

const getInitialLayout = (total) => {
  const available = getAvailableLayouts(total);
  if (available.some((layout) => layout.key === 'two_big')) return 'two_big';
  return available[0]?.key || 'two_big';
};

const Avatar = ({ testimonial, size = 'h-10 w-10' }) => {
  if (testimonial.photo) {
    return (
      <img
        src={testimonial.photo}
        alt={testimonial.name}
        loading="lazy"
        decoding="async"
        className={`${size} rounded-full border border-white/30 object-cover dark:border-white/20`}
      />
    );
  }

  return (
    <div
      className={`${size} flex items-center justify-center rounded-full bg-brand-orange text-sm font-semibold text-white`}
    >
      {getInitials(testimonial.name)}
    </div>
  );
};

const RatingStars = ({ rating }) => (
  <div className="flex items-center gap-1.5">
    {Array.from({ length: rating }).map((_, index) => (
      <Star key={index} className="h-3.5 w-3.5 fill-brand-orange text-brand-orange" />
    ))}
  </div>
);

const TestimonialCard = ({ children, delay = 0, className, onMouseEnter, onMouseLeave }) => {
  const cardRef = useScrollAnimation({ delay, duration: 500, y: 24 });

  return (
    <article
      ref={cardRef}
      className={`${className} transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[rgba(232,82,26,0.3)] active:-translate-y-1 active:border-[rgba(232,82,26,0.3)]`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </article>
  );
};

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [layoutKey, setLayoutKey] = useState('two_big');
  const [nextIndex, setNextIndex] = useState(0);
  const [nextLayoutKey, setNextLayoutKey] = useState('two_big');
  const [isSliding, setIsSliding] = useState(false);
  const headingRef = useScrollAnimation({ y: 20, duration: 600 });
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [testimonials, setTestimonials] = useState(fallbackTestimonials);
  const [isLoading, setIsLoading] = useState(true);
  const [isUsingFallback, setIsUsingFallback] = useState(false);

  const totalTestimonials = testimonials.length;
  const activeDotIndex = isSliding ? nextIndex : currentIndex;

  const triggerSlide = useCallback((targetIndex, targetLayout) => {
    if (isSliding || totalTestimonials <= 1) return;

    setNextIndex(targetIndex);
    setNextLayoutKey(targetLayout);
    setIsSliding(true);
  }, [isSliding, totalTestimonials]);

  useEffect(() => {
    if (!isAutoPlay || totalTestimonials <= 1 || isSliding) return;

    const timer = setInterval(() => {
      const upcomingIndex = (currentIndex + 1) % totalTestimonials;
      const upcomingLayout = pickRandomLayout(totalTestimonials, layoutKey);
      triggerSlide(upcomingIndex, upcomingLayout);
    }, ROTATION_INTERVAL_MS);

    return () => clearInterval(timer);
  }, [isAutoPlay, totalTestimonials, isSliding, currentIndex, layoutKey, triggerSlide]);

  useEffect(() => {
    if (!isSliding) return undefined;

    const timer = setTimeout(() => {
      setCurrentIndex(nextIndex);
      setLayoutKey(nextLayoutKey);
      setIsSliding(false);
    }, SLIDE_DURATION_MS);

    return () => clearTimeout(timer);
  }, [isSliding, nextIndex, nextLayoutKey]);

  useEffect(() => {
    const controller = new AbortController();

    const loadTestimonials = async () => {
      setIsLoading(true);
      setIsUsingFallback(false);

      try {
        const data = await getTestimonials({ signal: controller.signal });
        const mapped = normalizeTestimonials(Array.isArray(data) ? data : []);

        if (mapped.length > 0) {
          setTestimonials(mapped);
          setCurrentIndex(0);
          const initialLayout = getInitialLayout(mapped.length);
          setLayoutKey(initialLayout);
          setNextIndex(0);
          setNextLayoutKey(initialLayout);
          setIsSliding(false);
        } else {
          setTestimonials(fallbackTestimonials);
          setCurrentIndex(0);
          const initialLayout = getInitialLayout(fallbackTestimonials.length);
          setLayoutKey(initialLayout);
          setNextIndex(0);
          setNextLayoutKey(initialLayout);
          setIsSliding(false);
          setIsUsingFallback(true);
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
          setTestimonials(fallbackTestimonials);
          setCurrentIndex(0);
          const initialLayout = getInitialLayout(fallbackTestimonials.length);
          setLayoutKey(initialLayout);
          setNextIndex(0);
          setNextLayoutKey(initialLayout);
          setIsSliding(false);
          setIsUsingFallback(true);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadTestimonials();

    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!getAvailableLayouts(totalTestimonials).some((layout) => layout.key === layoutKey)) {
      const initialLayout = getInitialLayout(totalTestimonials);
      setLayoutKey(initialLayout);
      setNextLayoutKey(initialLayout);
    }
  }, [layoutKey, totalTestimonials]);

  useEffect(() => {
    if (!getAvailableLayouts(totalTestimonials).some((layout) => layout.key === nextLayoutKey)) {
      setNextLayoutKey(getInitialLayout(totalTestimonials));
    }
  }, [nextLayoutKey, totalTestimonials]);

  const getByOffset = (baseIndex, offset) => {
    if (totalTestimonials === 0) return null;
    return testimonials[(baseIndex + offset) % totalTestimonials];
  };

  const getVisibleCards = (activeLayoutKey, baseIndex) =>
    activeLayoutKey === 'four_small'
      ? [0, 1, 2, 3].map((offset) => getByOffset(baseIndex, offset)).filter(Boolean)
      : [0, 1].map((offset) => getByOffset(baseIndex, offset)).filter(Boolean);

  const pauseAutoPlay = () => setIsAutoPlay(false);
  const resumeAutoPlay = () => setIsAutoPlay(true);

  const renderBigCard = (item, keyPrefix, tone = 'blue', index = 0) => (
    <TestimonialCard
      key={`${keyPrefix}-${item.id}`}
      delay={index * 120}
      className={
        tone === 'blue'
          ? 'relative min-h-[220px] overflow-hidden rounded-2xl border border-[#7E8CFF]/40 bg-gradient-to-br from-[#2E3FAE] via-[#3850C8] to-[#4361EE] p-5 shadow-[0_16px_34px_rgba(34,49,132,0.32)]'
          : 'min-h-[220px] rounded-2xl border border-[#D8D2EE] bg-white/92 p-5 shadow-[0_14px_30px_rgba(37,23,90,0.12)] dark:border-[#2B2354] dark:bg-[#17122E]/84 dark:shadow-[0_20px_40px_rgba(0,0,0,0.45)]'
      }
      onMouseEnter={pauseAutoPlay}
      onMouseLeave={resumeAutoPlay}
    >
      {tone === 'blue' && (
        <div className="pointer-events-none absolute -right-10 -top-8 h-28 w-28 rounded-full bg-white/12" />
      )}

      <RatingStars rating={item.rating} />
      <p className={`mt-3 text-base leading-relaxed ${tone === 'blue' ? 'text-white/95' : 'text-[#3B2E6E] dark:text-[#DDD6FF]'}`}>
        "{trimText(item.content, 120)}"
      </p>

      <div className="mt-4 flex items-center gap-2.5">
        <Avatar testimonial={item} size="h-9 w-9" />
        <div className="min-w-0">
          <p className={`truncate text-lg font-semibold ${tone === 'blue' ? 'text-white' : 'text-[#1D1340] dark:text-white'}`}>{item.name}</p>
          <p className={`truncate text-sm ${tone === 'blue' ? 'text-white/80' : 'text-[#6A5A9D] dark:text-[#B4A8E8]'}`}>{item.location}</p>
        </div>
      </div>
    </TestimonialCard>
  );

  const renderSmallCard = (item, keyPrefix, index = 0) => (
    <TestimonialCard
      key={`${keyPrefix}-${item.id}`}
      delay={index * 120}
      className="min-h-[220px] rounded-2xl border border-[#D8D2EE] bg-white/92 p-4 shadow-[0_14px_32px_rgba(37,23,90,0.12)] dark:border-[#2B2354] dark:bg-[#17122E]/84 dark:shadow-[0_20px_42px_rgba(0,0,0,0.45)]"
      onMouseEnter={pauseAutoPlay}
      onMouseLeave={resumeAutoPlay}
    >
      <RatingStars rating={item.rating} />
      <p className="mt-3 text-base leading-relaxed text-[#3B2E6E] dark:text-[#DDD6FF]">"{trimText(item.content, 85)}"</p>

      <div className="mt-4 flex items-center gap-2.5">
        <Avatar testimonial={item} size="h-9 w-9" />
        <div className="min-w-0">
          <p className="truncate text-lg font-semibold text-[#1D1340] dark:text-white">{item.name}</p>
          <p className="truncate text-sm text-[#6A5A9D] dark:text-[#B4A8E8]">{item.location}</p>
        </div>
      </div>
    </TestimonialCard>
  );

  const renderLayout = (activeLayoutKey, baseIndex, keyPrefix) => {
    const visibleCards = getVisibleCards(activeLayoutKey, baseIndex);

    if (activeLayoutKey === 'four_small') {
      return (
        <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
          {visibleCards.map((item, index) => renderSmallCard(item, `${keyPrefix}-${index}`, index))}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {visibleCards.map((item, index) =>
          renderBigCard(item, `${keyPrefix}-${index}`, index % 2 === 0 ? 'blue' : 'light', index)
        )}
      </div>
    );
  };

  return (
    <section
      id="testimonials"
      className="relative overflow-hidden bg-transparent px-4 py-20 sm:py-24 lg:py-28"
    >
      <div className="mx-auto w-full max-w-7xl">
        <div
          ref={headingRef}
          className="mb-12 text-center"
        >
          <div className="section-kicker-classic mb-4">
            Testimonials
          </div>
          <h2 className="section-title-classic mb-4">
            What Students Say <span className="section-title-classic-accent">About Us</span>
          </h2>
          <p className="section-subtitle-classic">
            Trusted voices from students and families we have guided across international admissions.
          </p>
        </div>

        {isLoading ? (
          <div className="rounded-3xl border border-border/70 bg-background/70 p-10 text-center text-muted-foreground">
            Loading testimonials...
          </div>
        ) : (
          <div className="mx-auto max-w-6xl overflow-hidden rounded-2xl">
            <div
              className={`flex ${
                isSliding
                  ? 'transition-transform ease-[cubic-bezier(0.22,1,0.36,1)]'
                  : 'transition-none'
              }`}
              style={{
                transform: `translateX(-${isSliding ? 100 : 0}%)`,
                transitionDuration: `${SLIDE_DURATION_MS}ms`,
              }}
            >
              <div className="w-full flex-shrink-0">{renderLayout(layoutKey, currentIndex, 'current')}</div>
              <div className="w-full flex-shrink-0">{renderLayout(nextLayoutKey, nextIndex, 'next')}</div>
            </div>

            {totalTestimonials > 1 && (
              <div className="mt-7 flex flex-wrap items-center justify-center gap-4">
                <div className="flex items-center gap-2.5">
                  {testimonials.map((testimonial, index) => (
                    <button
                      key={`${testimonial.id}-dot`}
                      onClick={() => {
                        if (index === activeDotIndex || isSliding) return;
                        triggerSlide(index, pickRandomLayout(totalTestimonials, layoutKey));
                      }}
                      className={`h-2.5 rounded-full transition-all ${
                        index === activeDotIndex
                          ? 'w-8 bg-brand-purple dark:bg-brand-orange'
                          : 'w-2.5 bg-brand-purple/25 hover:bg-brand-purple/45 dark:bg-white/25 dark:hover:bg-white/45'
                      }`}
                      style={{ transitionDuration: `${SLIDE_DURATION_MS}ms` }}
                      aria-label={`Show testimonial ${index + 1} of ${testimonials.length}`}
                      type="button"
                    />
                  ))}
                </div>

                <p className="text-sm font-medium text-[#5F4E95] dark:text-[#B8ADDD]">
                  {activeDotIndex + 1} / {testimonials.length}
                </p>
              </div>
            )}

            {isUsingFallback && (
              <p className="mt-5 text-center text-sm text-muted-foreground">
                Showing offline testimonials while API is unavailable.
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
