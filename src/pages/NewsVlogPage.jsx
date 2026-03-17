import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Calendar, Flame, Play, User } from 'lucide-react';
import { getBlogList } from '../services/contentApi';
import { resolveMediaUrl } from '../services/apiClient';

const getCardImage = (item) => item.thumbnail || item.image;

export default function NewsVlogPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [newsItems, setNewsItems] = useState([]);
  const [categories, setCategories] = useState(['all']);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    const loadBlog = async () => {
      setIsLoading(true);
      setErrorMessage('');

      try {
        const data = await getBlogList({ signal: controller.signal });
        const mapped = (data || []).map((item) => ({
          id: item.id,
          slug: item.slug || String(item.id),
          type: 'blog',
          title: item.title,
          excerpt: item.excerpt || item.summary || 'Read the full story and insights from our team.',
          image: resolveMediaUrl(item.featured_image),
          thumbnail: resolveMediaUrl(item.featured_image),
          author: item.author || 'The Global Avenues',
          date: item.created_at,
          readTime: item.read_time || '5 min read',
          category: item.category || 'General',
          views: item.views ? Number(item.views) : 0,
        }));

        const uniqueCategories = Array.from(
          new Set(mapped.map((item) => item.category).filter(Boolean))
        );

        setNewsItems(mapped);
        setCategories(['all', ...uniqueCategories]);
      } catch (error) {
        if (error.name !== 'AbortError') {
          setErrorMessage(error.message || 'Unable to load news and blog content');
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadBlog();

    return () => controller.abort();
  }, []);

  const filteredItems = useMemo(() => {
    return newsItems.filter((item) => {
      const matchesTab = activeTab === 'all' || item.type === activeTab;
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      return matchesTab && matchesCategory;
    });
  }, [newsItems, activeTab, selectedCategory]);

  const featuredItems = useMemo(() => newsItems.slice(0, 2), [newsItems]);

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
    <div className="min-h-screen pt-16">
      <motion.section
        className="bg-gradient-to-b from-primary/5 to-background px-4 py-20 sm:px-6 lg:px-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="mx-auto max-w-7xl text-center">
          <motion.h1
            className="mb-6 text-5xl font-bold text-balance md:text-6xl"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            News & Blog
          </motion.h1>
          <motion.p
            className="mx-auto max-w-3xl text-xl text-muted-foreground"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Stay updated with the latest news, success stories, and expert guidance from The Global Avenues.
          </motion.p>
        </div>
      </motion.section>

      {featuredItems.length > 0 && (
        <section className="bg-muted/20 px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <motion.div
              className="mb-12"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="mb-4 flex items-center gap-2">
                <Flame className="h-5 w-5 text-accent" />
                <h2 className="text-2xl font-bold md:text-3xl">Featured Content</h2>
              </div>
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
                  className="group cursor-pointer overflow-hidden rounded-2xl border border-border bg-background transition-all duration-300 hover:border-primary/50 hover:shadow-xl"
                  variants={itemVariants}
                  whileHover={{ translateY: -8 }}
                  onClick={() => navigate(`/news/${item.slug}`)}
                >
                  <div className="relative h-64 overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20">
                    {item.type === 'blog' && (
                      <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/20">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/80 transition-transform group-hover:scale-110">
                          <Play className="ml-1 h-8 w-8 fill-white text-white" />
                        </div>
                      </div>
                    )}
                    <img
                      src={getCardImage(item)}
                      alt={item.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>

                  <div className="p-6">
                    <div className="mb-3 flex items-center gap-2">
                      <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                        {item.category}
                      </span>
                        {item.type === 'blog' && (
                          <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
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
                          {item.date ? new Date(item.date).toLocaleDateString() : '—'}
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

      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            className="mb-8"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="mb-4 text-sm font-semibold uppercase text-muted-foreground">Type</h3>
            <div className="flex flex-wrap gap-3">
              {['all', 'blog'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-lg px-4 py-2 font-medium transition-all duration-300 ${
                    activeTab === tab
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                  type="button"
                >
                  {tab === 'blog' ? 'Blog' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h3 className="mb-4 text-sm font-semibold uppercase text-muted-foreground">Category</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-all duration-300 ${
                    selectedCategory === category
                      ? 'bg-secondary text-secondary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                  type="button"
                >
                  {category === 'all' ? 'All' : category}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {isLoading && (
            <motion.div
              className="py-20 text-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-lg text-muted-foreground">Loading content...</p>
            </motion.div>
          )}

          {!isLoading && errorMessage && (
            <motion.div
              className="py-20 text-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="mb-2 text-2xl font-bold text-muted-foreground">Unable to load content</p>
              <p className="text-muted-foreground">{errorMessage}</p>
            </motion.div>
          )}

          {!isLoading && !errorMessage && (
            <>
              {filteredItems.length > 0 ? (
                <motion.div
                  className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  {filteredItems.map((item) => (
                    <motion.div
                      key={item.id}
                      className="group cursor-pointer overflow-hidden rounded-xl border border-border bg-background transition-all duration-300 hover:border-primary/50 hover:shadow-lg"
                      variants={itemVariants}
                      whileHover={{ translateY: -4 }}
                      onClick={() => navigate(`/news/${item.slug}`)}
                    >
                      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20">
                        {item.type === 'blog' && (
                          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/20 transition-colors group-hover:bg-black/40">
                            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent/80 transition-transform group-hover:scale-110">
                              <Play className="ml-1 h-6 w-6 fill-white text-white" />
                            </div>
                          </div>
                        )}
                        <img
                          src={getCardImage(item)}
                          alt={item.title}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>

                      <div className="p-6">
                        <div className="mb-2 flex items-center gap-2">
                          <span className="rounded bg-primary/10 px-2 py-1 text-xs font-semibold text-primary">
                            {item.category}
                          </span>
                          {item.type === 'blog' && (
                            <span className="text-xs text-muted-foreground">{item.readTime}</span>
                          )}
                        </div>

                        <h3 className="mb-2 line-clamp-2 text-lg font-bold transition-colors group-hover:text-primary">
                          {item.title}
                        </h3>
                        <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">{item.excerpt}</p>

                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{item.date ? new Date(item.date).toLocaleDateString() : '—'}</span>
                          {item.views ? <span>{item.views.toLocaleString()} views</span> : <span>&nbsp;</span>}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  className="py-20 text-center"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <p className="mb-4 text-2xl font-bold text-muted-foreground">No content found</p>
                  <p className="text-muted-foreground">Try adjusting your filters to find more content.</p>
                </motion.div>
              )}
            </>
          )}
        </div>
      </section>

      <section className="bg-gradient-to-r from-primary/10 to-secondary/10 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="mb-4 text-4xl font-bold">Stay Updated</h2>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
              Subscribe to our newsletter for the latest news, expert tips, and success stories from students around the world.
            </p>
            <button className="group mx-auto flex items-center gap-2 rounded-lg bg-primary px-8 py-3 font-semibold text-primary-foreground transition-all duration-300 hover:scale-105 hover:bg-secondary" type="button">
              Subscribe Now
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
