import { educationPrograms } from './data/educationProgramsData';

const buildProgramPath = (programId, level = 'undergraduate') =>
  `/education-program/${programId}/${level}`;

export const SITE_CONFIG = {
  company: {
    name: 'The Global Avenues',
    shortName: 'TGA',
    description:
      'Your trusted partner for international student recruitment and global education opportunities.',
    tagline: 'Unlock Your Potential With The Global Avenues',
    year: new Date().getFullYear(),
    logo: {
      lightSrc: '/logo-light.png',
      darkSrc: '/logo-light.png',
      alt: 'The Global Avenues logo',
    },
  },

  contact: {
    phone: ['+91 11 4680 1133', '+91 93198 31133', '+91 97178 01133'],
    email: {
      general: 'connect@theglobalavenues.com',
      admissions: 'admissions@theglobalavenues.com',
      partnerships: 'partnerships@theglobalavenues.com',
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
    facebook: null,
    linkedin: null,
    youtube: null,
    instagram: null,
    whatsapp: 'https://wa.me/919319831133',
  },

  stats: {
    studentsRecruited: '3000+',
    partnerUniversities: '210+',
    countriesCovered: '50+',
    visaSuccessRate: '98%',
  },

  navigation: {
    primary: [
      { label: 'Home', path: '/' },
      { label: 'Who We Are', path: '/about' },
      { label: 'News & Blog', path: '/news-blog' },
      { label: 'Gallery', path: '/gallery' },
    ],
    offerings: [
      { label: 'All Programs', path: '/what-we-offer' },
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
      { label: 'What We Offer', path: '/what-we-offer' },
      { label: 'Universities', path: '/universities' },
    ],
    Services: [
      { label: 'Explore Pathways', path: '/services' },
      { label: 'Student Guidance', path: '/services' },
      { label: 'University Recruitment', path: '/services' },
      { label: 'Visa Assistance', path: '/services' },
    ],
    Resources: [
      { label: 'Blog', path: '/news-blog' },
      { label: 'Gallery', path: '/gallery' },
      { label: 'Partners', path: '/partners' },
    ],
  },

  collaborateTeams: [
    {
      title: 'General Enquiries',
      phone: '+91 11 4680 1133',
      email: 'connect@theglobalavenues.com',
    },
    {
      title: 'Admissions Support',
      phone: '+91 93198 31133',
      email: 'admissions@theglobalavenues.com',
    },
    {
      title: 'Partnerships',
      phone: '+91 97178 01133',
      email: 'partnerships@theglobalavenues.com',
    },
  ],
};

export const formatAddress = (address = SITE_CONFIG.contact.address) =>
  `${address.street}, ${address.city}, ${address.state} ${address.zipcode}, ${address.country}`;

export const portfolioMenuLabel = 'Our Portfolio';

export default SITE_CONFIG;
