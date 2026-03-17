import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Eye, MessageCircle, Share2, User } from 'lucide-react';
import { getBlogDetail } from '../services/contentApi';
import { resolveMediaUrl } from '../services/apiClient';

const getCardImage = (item) => item.thumbnail || item.image;

export default function NewsDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);
  const [newsItem, setNewsItem] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const normalizeText = (value) =>
    String(value || '')
      .replace(/<[^>]*>/g, '')
      .trim();

  useEffect(() => {
    if (!id) return;

    const controller = new AbortController();

    const loadPost = async () => {
      setIsLoading(true);
      setErrorMessage('');

      try {
        const data = await getBlogDetail(id, { signal: controller.signal });
        const post = data?.post || null;
        const related = data?.related || [];

        if (!post) {
          setNewsItem(null);
          setRelatedArticles([]);
          return;
        }

        const mappedPost = {
          id: post.id,
          slug: post.slug || String(post.id),
          type: 'blog',
          title: post.title,
          excerpt: normalizeText(post.excerpt || post.summary || ''),
          content: normalizeText(post.content || post.body || post.description || ''),
          image: resolveMediaUrl(post.featured_image),
          author: post.author || 'The Global Avenues',
          date: post.created_at,
          readTime: post.read_time || '5 min read',
          category: post.category || 'General',
          views: post.views ? Number(post.views) : 0,
        };

        const mappedRelated = related.map((item) => ({
          id: item.id,
          slug: item.slug || String(item.id),
          title: item.title,
          category: mappedPost.category,
          date: null,
          image: '',
        }));

        setNewsItem(mappedPost);
        setRelatedArticles(mappedRelated);
      } catch (error) {
        if (error.name !== 'AbortError') {
          setErrorMessage(error.message || 'Unable to load article');
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
            {errorMessage || (isLoading ? 'Fetching the latest article.' : 'The article you\'re looking for doesn\'t exist.')}
          </p>
          <button
            onClick={() => navigate('/news-blog')}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-primary-foreground transition-all duration-300 hover:bg-primary/90"
            type="button"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to News & Blog
          </button>
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
        className="sticky top-20 z-40 border-b border-border bg-background/80 px-4 py-4 backdrop-blur-md sm:px-6 lg:px-8"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="mx-auto max-w-4xl">
          <button
            onClick={() => navigate('/news-blog')}
            className="inline-flex items-center gap-2 font-medium text-primary transition-colors hover:text-secondary"
            type="button"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to News & Blog
          </button>
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
            {newsItem.type === 'blog' && (
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
              <img src={getCardImage(newsItem)} alt={newsItem.title} className="h-full w-full object-cover" />
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

          <motion.div variants={itemVariants} className="flex items-center gap-4 border-y border-border py-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setLiked((value) => !value)}
              className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 transition-all duration-300 ${
                liked ? 'bg-red-500/20 text-red-500' : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
              type="button"
            >
              <span className="text-sm font-medium">{liked ? 'Liked' : 'Like'}</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 rounded-lg bg-muted px-4 py-2 text-muted-foreground transition-all duration-300 hover:bg-muted/80"
              type="button"
            >
              <Share2 className="h-4 w-4" />
              <span className="text-sm font-medium">Share</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 rounded-lg bg-muted px-4 py-2 text-muted-foreground transition-all duration-300 hover:bg-muted/80"
              type="button"
            >
              <MessageCircle className="h-4 w-4" />
              <span className="text-sm font-medium">Comment</span>
            </motion.button>
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
