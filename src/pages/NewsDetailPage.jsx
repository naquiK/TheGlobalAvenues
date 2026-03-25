import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { Calendar, Clock, Eye, User } from 'lucide-react';
import { newsItems as fallbackNewsItems } from '../data/newsData';
import BackNavButton from '../components/ui/BackNavButton';

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
    .replace(/<[^>]*>/g, '')
    .trim();

const normalizeIdentity = (value) =>
  String(value || '')
    .toLowerCase()
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

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

const mapFallbackPost = (item) =>
  applyContentPolicy({
    id: item.id,
    slug: item.slug || normalizeIdentity(item.title) || String(item.id),
    type: item.type || 'blog',
    title: item.title || 'Untitled',
    excerpt: normalizeText(item.excerpt || item.summary || ''),
    content: normalizeText(item.content || item.body || item.description || item.excerpt || ''),
    image: sanitizeMediaUrl(item.image || item.thumbnail),
    thumbnail: sanitizeMediaUrl(item.thumbnail || item.image),
    author: item.author || 'The Global Avenues',
    date: item.date || '',
    readTime: item.readTime || '5 min read',
    category: item.category || 'General',
    views: item.views ? Number(item.views) : 0,
    videoUrl: sanitizeVideoUrl(item.videoUrl),
  });

const findFallbackPostBySlugOrId = (id) => {
  const raw = String(id || '').trim();
  const decoded = (() => {
    try {
      return decodeURIComponent(raw);
    } catch {
      return raw;
    }
  })();
  const normalizedTarget = normalizeIdentity(decoded.replace(/\/+$/g, ''));
  if (!normalizedTarget) return null;

  return fallbackNewsItems.find((item) => {
    const itemSlug = normalizeIdentity(item.slug || '');
    const itemTitle = normalizeIdentity(item.title || '');
    const itemId = String(item.id || '');

    if (itemId && itemId === decoded) return true;
    if (itemSlug && itemSlug === normalizedTarget) return true;
    if (itemTitle && itemTitle === normalizedTarget) return true;
    if (itemSlug && (itemSlug.includes(normalizedTarget) || normalizedTarget.includes(itemSlug))) {
      return true;
    }
    if (itemTitle && (itemTitle.includes(normalizedTarget) || normalizedTarget.includes(itemTitle))) {
      return true;
    }
    return false;
  });
};

const handleImageError = (event) => {
  const target = event.currentTarget;
  if (target.dataset.fallbackApplied === 'true') return;
  target.dataset.fallbackApplied = 'true';
  target.src = IMAGE_FALLBACK_URL;
};

export default function NewsDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const sourcePost = useMemo(() => findFallbackPostBySlugOrId(id), [id]);
  const newsItem = useMemo(() => (sourcePost ? mapFallbackPost(sourcePost) : null), [sourcePost]);

  const contentBlocks = useMemo(() => {
    if (!newsItem) return [];
    const content = newsItem.content || newsItem.excerpt;
    if (!content) return [];
    return content
      .split(/\n{2,}/)
      .map((block) => block.trim())
      .filter(Boolean);
  }, [newsItem]);

  if (!newsItem) {
    return (
      <motion.div
        className="flex min-h-screen flex-col items-center justify-center px-4 pt-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ duration: 0.4 }}>
          <h1 className="mb-4 text-4xl font-bold">Article Not Found</h1>
          <p className="mb-8 text-muted-foreground">The article you're looking for doesn't exist.</p>
          <BackNavButton label="Back to News & Blog" onClick={() => navigate('/news-blog')} />
        </motion.div>
      </motion.div>
    );
  }

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
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 pt-16">
      <motion.div
        className="sticky top-16 z-40 border-b border-border/70 bg-background/70 px-4 py-2 backdrop-blur-xl supports-[backdrop-filter]:bg-background/55 sm:px-6 lg:px-8"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="mx-auto max-w-4xl">
          <BackNavButton label="Back to News & Blog" onClick={() => navigate('/news-blog')} />
        </div>
      </motion.div>

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <motion.div className="space-y-8" variants={containerVariants} initial="hidden" animate="visible">
          <motion.div variants={itemVariants} className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                {newsItem.category}
              </span>
              <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
                {newsItem.type === 'blog' ? 'Blog Post' : 'News'}
              </span>
            </div>

            <h1 className="text-4xl font-bold leading-tight text-foreground sm:text-5xl">{newsItem.title}</h1>

            <div className="flex flex-wrap items-center gap-4 border-t border-border pt-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <User className="h-4 w-4" />
                <span className="text-sm">{newsItem.author}</span>
              </div>
              {newsItem.date && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">
                    {new Date(newsItem.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              )}
              {newsItem.readTime && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">{newsItem.readTime}</span>
                </div>
              )}
              {newsItem.views ? (
                <div className="ml-auto flex items-center gap-2 text-muted-foreground">
                  <Eye className="h-4 w-4" />
                  <span className="text-sm">{newsItem.views.toLocaleString()} views</span>
                </div>
              ) : (
                <div className="ml-auto" />
              )}
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="relative h-96 overflow-hidden rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20"
          >
            {newsItem.videoUrl && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/20">
                <motion.div
                  className="flex h-20 w-20 items-center justify-center rounded-full bg-accent/80"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg className="ml-1 h-8 w-8 fill-white text-white" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </motion.div>
              </div>
            )}
            {newsItem.image ? (
              <img
                src={getCardImage(newsItem)}
                alt={newsItem.title}
                loading="lazy"
                decoding="async"
                onError={handleImageError}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                No image available
              </div>
            )}
          </motion.div>

          <motion.div variants={itemVariants} className="max-w-none space-y-6">
            {newsItem.excerpt && <p className="text-xl leading-relaxed text-muted-foreground">{newsItem.excerpt}</p>}

            <div className="space-y-4 leading-relaxed text-foreground/90">
              {contentBlocks.length > 0 ? (
                contentBlocks.map((block, index) => <p key={index}>{block}</p>)
              ) : (
                <p>Content coming soon.</p>
              )}
            </div>

            {newsItem.type === 'blog' && newsItem.videoUrl && (
              <div className="relative w-full overflow-hidden rounded-xl bg-black/20 pt-[56.25%]">
                <iframe
                  className="absolute inset-0 h-full w-full"
                  src={newsItem.videoUrl}
                  title={newsItem.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}
          </motion.div>

        </motion.div>
      </div>
    </div>
  );
}
