export const newsItems = [
  {
    id: 1,
    type: 'news',
    title: 'Partnership Expansion Across the UK',
    excerpt:
      'The Global Avenues expanded collaboration with leading UK institutions to strengthen recruitment quality in South Asia.',
    content:
      'The Global Avenues has expanded its collaboration portfolio with leading UK institutions, including multi-intake recruitment plans and in-market visibility initiatives. The engagement model focuses on qualified application pipelines, counselor enablement, and transparent reporting for admissions teams. This expansion supports institutional goals for sustainable growth, stronger conversion quality, and long-term regional presence.',
    image:
      'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1600&q=80',
    date: '2024-03-15',
    author: 'Neetu Verma Gupta',
    category: 'Partnership',
    featured: true,
    views: 2500,
    readTime: '5 min read',
  },
  {
    id: 2,
    type: 'blog',
    title: 'How Universities Can Improve Offer Conversion in India',
    excerpt:
      'A practical framework for institutions to improve application quality, decision speed, and final enrollment conversion.',
    content:
      'Offer conversion improves when institutions align market messaging, counselor enablement, and admissions SLAs. In this article, we break down a practical operating model used by our partner network: profile filtering, quality checks before submission, decision timeline governance, and conversion follow-up workflows. Universities using this structure typically see stronger predictability across intakes and better alignment between regional demand and institutional capacity.',
    thumbnail:
      'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&h=800&fit=crop&q=80',
    duration: '12:45',
    date: '2024-03-10',
    author: 'The Global Avenues',
    category: 'Growth Strategy',
    featured: true,
    views: 5800,
    readTime: '8 min read',
  },
];

export const getNewsItemById = (id) =>
  newsItems.find((item) => item.id === Number.parseInt(id, 10));

export const getFeaturedNewsItems = () => newsItems.filter((item) => item.featured);
