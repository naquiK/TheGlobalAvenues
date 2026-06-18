import { educationPrograms } from './data/educationProgramsData';

const buildProgramPath = (programId, level = 'undergraduate') =>
  `/education-program/${programId}/${level}`;

export const SITE_CONFIG = {
  company: {
    name: 'The Global Avenues',
    shortName: 'TGA',
    description:
      'A growing team supporting international university representation, strategic market development, and enrollment operations.',
    tagline: 'Build Sustainable Enrolment With The Global Avenues',
    year: new Date().getFullYear(),
    logo: {
      lightSrc: '/logo-light.png',
      darkSrc: '/logo-light.png',
      alt: 'The Global Avenues logo',
    },
  },

  contact: {
    phone: ['+91 9319831133', '+91 9319831133', '+91 9971801133'],
    email: {
      general: 'connect@theglobalavenues.com',
      admissions: 'neetu@theglobalavenues.com',
      partnerships: 'connect@theglobalavenues.com',
    },
    address: {
      street: 'A 6, Block A, South Extension II',
      city: 'New Delhi',
      state: 'Delhi',
      country: 'India',
      zipcode: '110049',
    },
  },

  social: {
    facebook: 'https://www.facebook.com/TheGlobalAvenues/',
    linkedin: 'https://www.linkedin.com/company/the-global-avenues/posts/?feedView=all',
    youtube: 'https://www.youtube.com/channel/UCh9cYYFdhMLJx6BfSUNJfUw',
    instagram: 'https://www.instagram.com/theglobalavenues/',
    twitter: null,
    whatsapp: 'https://wa.me/919319831133',
  },

  quickWhatsappContacts: [
    {
      name: 'Neetu',
      role: 'Director',
      phone: '+91 93198 31133',
      whatsappNumber: '919319831133',
      avatar: '/team/neetu-verma-gupta.webp',
      prefilledMessage:
        'Hello Neetu, I would like to connect with The Global Avenues regarding a new enquiry.',
    },
    {
      name: 'Deepshikha',
      role: 'International Recruitment Head',
      phone: '+91 97178 01133',
      whatsappNumber: '919717801133',
      avatar: '/team/deepshikha-chauhan.webp',
      prefilledMessage:
        'Hello Deepshikha, I would like to connect with The Global Avenues regarding a new enquiry.',
    },
  ],

  stats: {
    studentsRecruited: '4000+',
    partnerUniversities: '15+',
    countriesCovered: '12+',
    visaSuccessRate: '86%',
  },

  navigation: {
    primary: [
      { label: 'Home', path: '/' },
      { label: 'Who We Are', path: '/about' },
      { label: 'Universities', path: '/universities' },
      { label: 'News & Blog', path: '/news-blog' },
      { label: 'Gallery', path: '/gallery' },
    ],
    offerings: [
      { label: 'All Services', path: '/what-we-offer' },
      ...educationPrograms.map((program) => ({
        label: program.name,
        path: buildProgramPath(program.id),
      })),
    ],
  },

  footerLinks: {
    Explore: [
      { label: 'Home', path: '/' },
      { label: 'Who We Are', path: '/about' },
      { label: 'Destinations', path: '/destinations' },
      { label: 'What We Offer', path: '/what-we-offer' },
      { label: 'Universities', path: '/universities' },
    ],
    Services: [
      { label: 'Market Entry Strategy', path: '/services' },
      { label: 'Channel Partnerships', path: '/services' },
      { label: 'Admissions Operations', path: '/services' },
      { label: 'Compliance Support', path: '/services' },
    ],
    Resources: [
      { label: 'Blog', path: '/news-blog' },
      { label: 'Gallery', path: '/gallery' },
      { label: 'Partners', path: '/partners' },
    ],
  },

  collaborateTeams: [
    {
      title: 'Institutional Partnerships',
      phone: '+91 9319831133',
      email: 'connect@theglobalavenues.com',
    },
    {
      title: 'Recruitment/Operations',
      phone: '+91 9319831133',
      email: 'neetu@theglobalavenues.com',
    },
    {
      title: 'Market Expansion',
      phone: '+91 9971801133',
      email: 'connect@theglobalavenues.com',
    },
  ],
};

export const formatAddress = (address = SITE_CONFIG.contact.address) => {
  if (!address) return '';
  if (typeof address === 'string') return address;

  const parts = [address.street, address.city, address.state].filter(Boolean).join(', ');
  const zip = address.zipcode ? ` ${address.zipcode}` : '';
  const country = address.country ? `, ${address.country}` : '';
  return `${parts}${zip}${country}`.replace(/^, /, '').trim();
};

export const portfolioMenuLabel = 'Our Portfolio';

export default SITE_CONFIG;
