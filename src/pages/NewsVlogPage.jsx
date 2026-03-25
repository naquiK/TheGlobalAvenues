import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Calendar, Flame, Newspaper, Play, Sparkles, User } from 'lucide-react';
import { newsItems as fallbackNewsItems } from '../data/newsData';

const getCardImage = (item) => item.thumbnail || item.image;
const INVALID_MEDIA_VALUES = new Set(['', 'null', 'undefined', 'false', 'none', 'n/a', 'na', '#']);
const IMAGE_FALLBACK_URL = '/videos/hero-poster.jpg';
const IMAGE_OVERRIDE_BY_ARTICLE = {
  'study-in-cyprus-opportunities-at-mesoyios-college-limassol':
    '/universities/mesoyios-college-hero.webp',
  'study-in-cyprus-mba-opportunities-at-kes-college-nicosia':
    '/universities/kes-college-nicosia-hero.jpg',
  'building-the-future-of-gaming-study-game-design-and-development-at-euas-estonia':
    'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1600&q=80',
};

const normalizeText = (value) =>
  String(value || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const normalizeIdentity = (value) =>
  normalizeText(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const normalizeType = (value) => {
  const text = String(value || '').trim().toLowerCase();
  if (!text) return 'blog';
  if (text.includes('news') || text.includes('update') || text.includes('press')) return 'news';
  if (
    text.includes('blog') ||
    text.includes('article') ||
    text.includes('vlog') ||
    text.includes('video')
  ) {
    return 'blog';
  }
  return 'blog';
};

const sanitizeMediaUrl = (value) => {
  const raw = String(value || '').trim();
  if (!raw || INVALID_MEDIA_VALUES.has(raw.toLowerCase())) return '';
  if (/^(https?:\/\/|data:|blob:)/i.test(raw)) return raw;
  if (raw.startsWith('/')) return raw;
  return '';
};

const sanitizeVideoUrl = (value) => {
  const raw = String(value || '').trim();
  if (!raw || INVALID_MEDIA_VALUES.has(raw.toLowerCase())) return '';
  return raw;
};

const applyImagePolicy = (item) => {
  const slugKey = normalizeIdentity(item?.slug);
  const titleKey = normalizeIdentity(item?.title);
  const overrideImage = IMAGE_OVERRIDE_BY_ARTICLE[slugKey] || IMAGE_OVERRIDE_BY_ARTICLE[titleKey];
  if (!overrideImage) return item;
  return { ...item, image: overrideImage, thumbnail: overrideImage };
};

const applyContentPolicy = (item) => applyImagePolicy(item);

const mapFallbackItem = (item) =>
  applyContentPolicy({
    id: item.id,
    slug: item.slug || normalizeIdentity(item.title) || String(item.id),
    type: normalizeType(item.type || 'blog'),
    title: item.title || 'Untitled',
    excerpt: normalizeText(item.excerpt || item.summary || ''),
    image: sanitizeMediaUrl(item.image || item.thumbnail),
    thumbnail: sanitizeMediaUrl(item.thumbnail || item.image),
    author: item.author || 'The Global Avenues',
    date: item.date || '',
    readTime: item.readTime || '5 min read',
    category: item.category || 'General',
    views: item.views ? Number(item.views) : 0,
    videoUrl: sanitizeVideoUrl(item.videoUrl),
  });

const parseDateValue = (value) => {
  const parsed = new Date(value || '');
  return Number.isNaN(parsed.getTime()) ? 0 : parsed.getTime();
};

const sortByNewest = (items) =>
  [...items].sort((a, b) => {
    const dateDiff = parseDateValue(b.date) - parseDateValue(a.date);
    if (dateDiff !== 0) return dateDiff;
    return Number(b.id || 0) - Number(a.id || 0);
  });

const handleImageError = (event) => {
  const target = event.currentTarget;
  if (target.dataset.fallbackApplied === 'true') return;
  target.dataset.fallbackApplied = 'true';
  target.src = IMAGE_FALLBACK_URL;
};

const formatDate = (value) => {
  if (!value) return '-';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return '-';
  return parsed.toLocaleDateString();
};

export default function NewsVlogPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');

  const newsItems = useMemo(
    () =>
      sortByNewest(
        fallbackNewsItems.map((item) => mapFallbackItem(item)).filter((item) => item.title && item.slug)
      ),
    []
  );

  const filteredItems = useMemo(
    () => newsItems.filter((item) => activeTab === 'all' || item.type === activeTab),
    [newsItems, activeTab]
  );

  const availableTabs = useMemo(() => {
    const tabSet = new Set(newsItems.map((item) => item.type).filter(Boolean));
    const dynamicTabs = ['news', 'blog'].filter((tab) => tabSet.has(tab));
    return ['all', ...dynamicTabs];
  }, [newsItems]);

  const featuredItems = useMemo(() => newsItems.slice(0, 2), [newsItems]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
  };

  useEffect(() => {
    if (!availableTabs.includes(activeTab)) {
      setActiveTab('all');
    }
  }, [availableTabs, activeTab]);

  const resetFilters = () => {
    setActiveTab('all');
  };

  return (
    <div className="min-h-screen bg-background pt-16">
      <motion.section
        className="relative overflow-hidden px-4 pb-14 pt-10 sm:px-6 lg:px-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.55 }}
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-64 bg-[radial-gradient(60%_100%_at_50%_0%,rgba(83,64,176,0.2),transparent)]" />
        <div className="mx-auto max-w-7xl rounded-[30px] border border-border/60 bg-gradient-to-br from-primary/10 via-background/95 to-accent/10 px-6 py-10 shadow-[0_24px_70px_rgba(18,14,40,0.18)] backdrop-blur-sm sm:px-8 sm:py-12 lg:px-12">
          <div className="mx-auto max-w-4xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary dark:border-white/20 dark:bg-white/10 dark:text-white">
              <Newspaper className="h-3.5 w-3.5" />
              Insights Hub
            </span>
            <motion.h1
              className="mt-5 text-4xl font-bold leading-tight text-foreground sm:text-5xl lg:text-6xl"
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.55, delay: 0.08 }}
            >
              News & Blog
              <span className="block bg-[linear-gradient(92deg,#2D1B69_0%,#5B45C6_40%,#8B63E5_60%,#E8521A_100%)] bg-clip-text text-transparent">
                Market Signals & Stories
              </span>
            </motion.h1>
            <motion.p
              className="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg"
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.55, delay: 0.16 }}
            >
              Stay updated with partnership news, recruitment intelligence, and strategic perspectives from
              The Global Avenues ecosystem.
            </motion.p>
            <div className="mt-7 flex flex-wrap justify-center gap-2.5">
              <span className="rounded-full border border-border bg-background/80 px-4 py-2 text-sm font-medium text-foreground">
                {newsItems.length} published updates
              </span>
              <span className="rounded-full border border-border bg-background/80 px-4 py-2 text-sm font-medium text-foreground">
                {Math.max(availableTabs.length - 1, 0)} content types
              </span>
            </div>
          </div>
        </div>
      </motion.section>

      {featuredItems.length > 0 && (
        <section className="px-4 pb-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl rounded-3xl border border-border/70 bg-muted/20 p-6 sm:p-8 lg:p-10">
            <motion.div
              className="mb-8"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
            >
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-accent">
                <Flame className="h-4 w-4 text-accent" />
                Featured Content
              </div>
              <h2 className="text-3xl font-bold text-foreground md:text-4xl">Highlights Worth Reading</h2>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 gap-8 md:grid-cols-2"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {featuredItems.map((item) => (
                <motion.div
                  key={item.id}
                  className="group cursor-pointer overflow-hidden rounded-2xl border border-border/70 bg-background/95 transition-all duration-300 hover:-translate-y-1 hover:border-primary/45 hover:shadow-[0_22px_50px_rgba(20,14,45,0.18)]"
                  variants={itemVariants}
                  whileHover={{ translateY: -8 }}
                  onClick={() => navigate(`/news/${item.slug}`)}
                >
                  <div className="relative h-64 overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20">
                    {item.videoUrl && (
                      <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/20">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/80 transition-transform group-hover:scale-110">
                          <Play className="ml-1 h-8 w-8 fill-white text-white" />
                        </div>
                      </div>
                    )}
                    {getCardImage(item) ? (
                      <img
                        src={getCardImage(item)}
                        alt={item.title}
                        loading="lazy"
                        decoding="async"
                        onError={handleImageError}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center px-5 text-center text-sm font-medium text-muted-foreground">
                        {item.title}
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <div className="mb-3 flex items-center gap-2">
                      <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                        {item.category}
                      </span>
                      {item.videoUrl && (
                        <span className="rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
                          {item.readTime}
                        </span>
                      )}
                    </div>

                    <h3 className="mb-3 line-clamp-2 text-xl font-bold transition-colors group-hover:text-primary">
                      {item.title}
                    </h3>
                    <p className="mb-4 line-clamp-2 text-muted-foreground">{item.excerpt}</p>

                    <div className="flex items-center justify-between border-t border-border pt-4">
                      <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDate(item.date)}
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {item.author}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-2xl border border-border/70 bg-background/70 p-6 shadow-sm backdrop-blur-sm">
          <motion.div
            className="mb-7"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <div className="mb-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5" />
              Filter by Type
            </div>
            <div className="flex flex-wrap gap-3">
              {availableTabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-full px-5 py-2 text-sm font-semibold transition-all duration-300 ${
                    activeTab === tab
                      ? 'bg-primary text-primary-foreground shadow-[0_10px_24px_rgba(45,27,105,0.22)]'
                      : 'border border-border bg-muted/70 text-foreground hover:border-primary/40 hover:bg-primary/10'
                  }`}
                  type="button"
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="px-4 pb-16 pt-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">Latest Updates</h2>
            <span className="rounded-full border border-border bg-background/80 px-4 py-1.5 text-sm font-medium text-muted-foreground">
              {filteredItems.length} results
            </span>
          </div>

          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="group cursor-pointer overflow-hidden rounded-2xl border border-border/70 bg-background transition-all duration-300 hover:-translate-y-1 hover:border-primary/45 hover:shadow-[0_18px_42px_rgba(20,14,45,0.18)]"
                  onClick={() => navigate(`/news/${item.slug}`)}
                >
                  <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20">
                    {item.videoUrl && (
                      <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/20 transition-colors group-hover:bg-black/40">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent/80 transition-transform group-hover:scale-110">
                          <Play className="ml-1 h-6 w-6 fill-white text-white" />
                        </div>
                      </div>
                    )}
                    {getCardImage(item) ? (
                      <img
                        src={getCardImage(item)}
                        alt={item.title}
                        loading="lazy"
                        decoding="async"
                        onError={handleImageError}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center px-5 text-center text-sm font-medium text-muted-foreground">
                        {item.title}
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <div className="mb-2 flex items-center gap-2">
                      <span className="rounded bg-primary/10 px-2 py-1 text-xs font-semibold text-primary">
                        {item.category}
                      </span>
                      {item.videoUrl && (
                        <span className="text-xs text-muted-foreground">{item.readTime}</span>
                      )}
                    </div>

                    <h3 className="mb-2 line-clamp-2 text-lg font-bold transition-colors group-hover:text-primary">
                      {item.title}
                    </h3>
                    <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">{item.excerpt}</p>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{formatDate(item.date)}</span>
                      {item.views ? <span>{item.views.toLocaleString()} views</span> : <span>&nbsp;</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <motion.div
              className="rounded-2xl border border-border/70 bg-muted/20 py-12 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.55 }}
            >
              <p className="mb-3 text-2xl font-bold text-foreground">No exact match for this filter</p>
              <p className="mb-6 text-muted-foreground">Try a different type filter.</p>
              {activeTab !== 'all' && (
                <button
                  onClick={resetFilters}
                  className="rounded-full border border-primary/35 bg-primary/10 px-5 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/20"
                  type="button"
                >
                  Reset Filters
                </button>
              )}
            </motion.div>
          )}
        </div>
      </section>

      <section className="px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            className="rounded-3xl border border-primary/20 bg-gradient-to-r from-primary/10 via-background to-secondary/10 px-6 py-12 shadow-[0_20px_50px_rgba(20,14,45,0.14)] sm:px-8"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">Stay Updated</h2>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
              Subscribe for partnership announcements, market intelligence, and international recruitment updates.
            </p>
            <button
              className="group mx-auto flex items-center gap-2 rounded-full bg-primary px-8 py-3 font-semibold text-primary-foreground transition-all duration-300 hover:scale-105 hover:bg-secondary"
              type="button"
            >
              Subscribe Now
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
