import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { Calendar, Clock, Eye, User } from 'lucide-react';
import { getBlogDetail } from '../services/contentApi';
import { resolveMediaUrl } from '../services/apiClient';
import { newsItems as fallbackNewsItems } from '../data/newsData';
import BackNavButton from '../components/ui/BackNavButton';

const getCardImage = (item) => item.thumbnail || item.image;
const INVALID_MEDIA_VALUES = new Set(['', 'null', 'undefined', 'false', 'none', 'n/a', 'na', '#']);
const VIDEO_DISABLED_ARTICLE_KEY = 'how-universities-can-improve-offer-conversion-in-india';
const IMAGE_OVERRIDE_BY_ARTICLE = {
  'partnership-expansion-across-the-uk':
    'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1600&q=80',
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
  return resolveMediaUrl(raw);
};

const sanitizeVideoUrl = (value) => {
  const raw = String(value || '').trim();
  if (!raw || INVALID_MEDIA_VALUES.has(raw.toLowerCase())) return '';
  return raw;
};

const shouldDisableVideo = (item) => {
  const slugKey = normalizeIdentity(item?.slug);
  const titleKey = normalizeIdentity(item?.title);
  return slugKey === VIDEO_DISABLED_ARTICLE_KEY || titleKey === VIDEO_DISABLED_ARTICLE_KEY;
};

const applyVideoPolicy = (item) =>
  shouldDisableVideo(item) ? { ...item, videoUrl: '' } : item;

const applyImagePolicy = (item) => {
  const slugKey = normalizeIdentity(item?.slug);
  const titleKey = normalizeIdentity(item?.title);
  const overrideImage = IMAGE_OVERRIDE_BY_ARTICLE[slugKey] || IMAGE_OVERRIDE_BY_ARTICLE[titleKey];
  if (!overrideImage) return item;
  return { ...item, image: overrideImage, thumbnail: overrideImage };
};

const applyContentPolicy = (item) => applyVideoPolicy(applyImagePolicy(item));

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
  const target = normalizeIdentity(id);
  return fallbackNewsItems.find((item) => {
    const itemSlug = normalizeIdentity(item.slug || item.title || item.id);
    return itemSlug === target || String(item.id) === String(id);
  });
};

const getFallbackRelated = (source) =>
  fallbackNewsItems
    .filter((item) => item.id !== source?.id && item.category === source?.category)
    .slice(0, 4)
    .map((item) => ({
      id: item.id,
      slug: item.slug || normalizeIdentity(item.title) || String(item.id),
      title: item.title,
      category: item.category || 'General',
      date: item.date || null,
      image: sanitizeMediaUrl(item.image || item.thumbnail),
      thumbnail: sanitizeMediaUrl(item.thumbnail || item.image),
    }));

export default function NewsDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [newsItem, setNewsItem] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(false);

  useEffect(() => {
    if (!id) return;

    const controller = new AbortController();

    const loadPost = async () => {
      setIsLoading(true);
      setErrorMessage(false);
      const fallbackBySlugOrId = findFallbackPostBySlugOrId(id);

      try {
        const data = await getBlogDetail(id, { signal: controller.signal });
        const post = data?.post || null;
        const related = data?.related || [];

        if (!post) {
          if (fallbackBySlugOrId) {
            const fallbackPost = mapFallbackPost(fallbackBySlugOrId);
            setNewsItem(fallbackPost);
            setRelatedArticles(getFallbackRelated(fallbackBySlugOrId));
          } else {
            setNewsItem(null);
            setRelatedArticles([]);
          }
          return;
        }

        const fallbackPost = fallbackBySlugOrId ? mapFallbackPost(fallbackBySlugOrId) : null;
        const mappedPost = applyContentPolicy({
          id: post.id,
          slug: post.slug || normalizeIdentity(post.title) || String(post.id),
          type: post.type || post.content_type || 'blog',
          title: post.title || fallbackPost?.title || 'Untitled',
          excerpt: normalizeText(post.excerpt || post.summary || fallbackPost?.excerpt || ''),
          content: normalizeText(post.content || post.body || post.description || fallbackPost?.content || ''),
          image: sanitizeMediaUrl(post.featured_image || post.image || post.thumbnail) || fallbackPost?.image || '',
          thumbnail:
            sanitizeMediaUrl(post.thumbnail || post.featured_image || post.image) ||
            fallbackPost?.thumbnail ||
            fallbackPost?.image ||
            '',
          author: post.author || fallbackPost?.author || 'The Global Avenues',
          date: post.created_at || post.date || fallbackPost?.date || '',
          readTime: post.read_time || post.readTime || fallbackPost?.readTime || '5 min read',
          category: post.category || fallbackPost?.category || 'General',
          views: post.views ? Number(post.views) : fallbackPost?.views || 0,
          videoUrl: sanitizeVideoUrl(post.video_url || post.videoUrl || post.video || fallbackPost?.videoUrl || ''),
        });

        const mappedRelated = related.map((item) =>
          applyImagePolicy({
            id: item.id,
            slug: item.slug || normalizeIdentity(item.title) || String(item.id),
            title: item.title,
            category: item.category || mappedPost.category,
            date: item.created_at || item.date || null,
            image: sanitizeMediaUrl(item.featured_image || item.image || item.thumbnail),
            thumbnail: sanitizeMediaUrl(item.thumbnail || item.featured_image || item.image),
          })
        );

        setNewsItem(mappedPost);
        setRelatedArticles(mappedRelated);
      } catch (error) {
        if (error.name !== 'AbortError') {
          if (fallbackBySlugOrId) {
            const fallbackPost = mapFallbackPost(fallbackBySlugOrId);
            setNewsItem(fallbackPost);
            setRelatedArticles(getFallbackRelated(fallbackBySlugOrId));
          } else {
            setErrorMessage(true);
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadPost();

    return () => controller.abort();
  }, [id]);

  const contentBlocks = useMemo(() => {
    if (!newsItem) return [];
    const content = newsItem.content || newsItem.excerpt;
    if (!content) return [];
    return content.split(/\n{2,}/).map((block) => block.trim()).filter(Boolean);
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
          <h1 className="mb-4 text-4xl font-bold">{isLoading ? 'Loading...' : 'Article Not Found'}</h1>
          <p className="mb-8 text-muted-foreground">
            {isLoading
              ? 'Fetching the latest article.'
              : errorMessage
                ? 'This article is unavailable right now.'
                : 'The article you\'re looking for doesn\'t exist.'}
          </p>
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
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                No image available
              </div>
            )}
          </motion.div>

          <motion.div variants={itemVariants} className="max-w-none space-y-6">
            {newsItem.excerpt && (
              <p className="text-xl leading-relaxed text-muted-foreground">{newsItem.excerpt}</p>
            )}

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

          {relatedArticles.length > 0 && (
            <motion.div variants={itemVariants} className="space-y-6">
              <h2 className="text-2xl font-bold">Related Articles</h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {relatedArticles.map((article, index) => (
                  <motion.div
                    key={article.id}
                    whileHover={{ translateY: -4 }}
                    onClick={() => navigate(`/news/${article.slug}`)}
                    className="group cursor-pointer overflow-hidden rounded-xl border border-border bg-background transition-all duration-300 hover:border-primary/50 hover:shadow-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <div className="relative h-40 overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20">
                      {article.image ? (
                        <img
                          src={getCardImage(article)}
                          alt={article.title}
                          loading="lazy"
                          decoding="async"
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                          No image
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <p className="mb-2 text-xs font-semibold text-primary">{article.category}</p>
                      <h3 className="line-clamp-2 font-bold transition-colors group-hover:text-primary">
                        {article.title}
                      </h3>
                      {article.date && (
                        <p className="mt-2 text-xs text-muted-foreground">
                          {new Date(article.date).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
