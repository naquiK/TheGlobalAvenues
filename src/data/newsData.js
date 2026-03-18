export const newsItems = [
  {
    id: 1,
    type: 'news',
    title: 'Partnership with Top UK Universities Announced',
    excerpt:
      'The Global Avenues partners with leading UK institutions to expand opportunities for South Asian students seeking quality education abroad.',
    content:
      'We are excited to announce our strategic partnerships with top UK universities including Edinburgh, Manchester, and Durham. These collaborations will provide students unprecedented access to world-class education and enhanced placement opportunities. Our commitment to facilitating quality education for South Asian students has led us to partner with some of the most prestigious institutions in the United Kingdom. Through these partnerships, we aim to create a seamless pathway for students aspiring to pursue higher education in the UK. Students will benefit from enhanced counseling, admission support, and placement assistance.',
    image:
      'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&h=800&fit=crop&q=80',
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
    title: 'Student Success Story: From India to Canada',
    excerpt:
      'Read how Priya transformed her dreams into reality with our comprehensive guidance and support through her Canadian education journey.',
    content:
      "In this exclusive blog post, Priya shares her incredible journey from applying to Canadian universities, getting accepted, and now thriving in her first year. She discusses the challenges she faced and how our team supported her every step of the way. Priya's journey is an inspiration to many aspiring students who dream of studying abroad. From her initial consultation with our team to receiving her acceptance letter, Priya shares the ups and downs of the process. Her story showcases the importance of proper guidance, timely application, and consistent support throughout the journey.",
    thumbnail:
      'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&h=800&fit=crop&q=80',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    duration: '12:45',
    date: '2024-03-10',
    author: 'The Global Avenues',
    category: 'Success Story',
    featured: true,
    views: 5800,
    readTime: '8 min read',
  },
  {
    id: 3,
    type: 'news',
    title: 'Australia Study Visa Updates 2024',
    excerpt:
      'Latest changes in Australian student visa requirements and how they impact South Asian applicants seeking to study in Australia.',
    content:
      'The Australian government has announced new changes to student visa processing. We break down what these changes mean for you and how to navigate them successfully. These new regulations aim to streamline the application process while maintaining strict security standards. International students applying to Australian universities should be aware of the updated requirements. Our experts have compiled a comprehensive guide to help you understand the implications and prepare your application accordingly.',
    image:
      'https://images.unsplash.com/photo-1498419043582-62c3f1f42b78?w=1200&h=800&fit=crop&q=80',
    date: '2024-03-08',
    author: 'Deepshikha Chauhan',
    category: 'Visa Updates',
    featured: false,
    views: 1800,
    readTime: '6 min read',
  },
  {
    id: 4,
    type: 'blog',
    title: 'IELTS Preparation Tips with Expert Trainer',
    excerpt:
      'Master IELTS exam strategies with our expert trainer. Learn proven techniques to maximize your band score.',
    content:
      "In this comprehensive blog post, our IELTS expert shares insider tips, common mistakes, and preparation strategies used by top scorers. Whether you're preparing for the first time or retaking the exam, these strategies will help you maximize your band score. Our expert covers all four sections of the IELTS exam: Listening, Reading, Writing, and Speaking. Learn practical techniques that have helped hundreds of students achieve their target scores.",
    thumbnail:
      'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&h=800&fit=crop&q=80',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    duration: '18:20',
    date: '2024-03-05',
    author: 'The Global Avenues',
    category: 'Exam Prep',
    featured: false,
    views: 3200,
    readTime: '10 min read',
  },
  {
    id: 5,
    type: 'news',
    title: 'New Scholarship Opportunities for 2024-25',
    excerpt:
      'Exciting scholarship programs launched by our partner universities for outstanding students from India.',
    content:
      'We are thrilled to announce multiple scholarship opportunities for the 2024-25 academic year. These scholarships cover tuition, living expenses, and more. Our partner universities have committed significant funding to support talented students from India. Applications are now open for various scholarship programs ranging from 50% to 100% tuition coverage. Early applications are encouraged as funding is limited and allocated on a first-come, first-served basis.',
    image:
      'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=1200&h=800&fit=crop&q=80',
    date: '2024-03-01',
    author: 'Naman Sharma',
    category: 'Scholarship',
    featured: false,
    views: 4200,
    readTime: '4 min read',
  },
  {
    id: 6,
    type: 'blog',
    title: 'Campus Life: A Day in the Life of an International Student',
    excerpt:
      'Follow Arjun as he shares his experience through a typical day at his university in the UK.',
    content:
      'Experience campus life through the eyes of Arjun, an international student thriving in his UK university. From early morning classes to late-night study sessions and weekend adventures, discover what life is really like as an international student. Arjun shares his experiences with university facilities, social life, and the support systems available to international students. His candid account provides valuable insights for students considering studying in the UK.',
    thumbnail:
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&h=800&fit=crop&q=80',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    duration: '15:30',
    date: '2024-02-25',
    author: 'The Global Avenues',
    category: 'Campus Life',
    featured: false,
    views: 2900,
    readTime: '7 min read',
  },
];

export const getNewsItemById = (id) =>
  newsItems.find((item) => item.id === Number.parseInt(id, 10));

export const getFeaturedNewsItems = () => newsItems.filter((item) => item.featured);
