// SKOLAE Group spotlight content for /portfolio/skolae-group.
// Every fact, image and logo here comes from the official SKOLAE or school website
// listed in each `source` field (checked October 2026). Re-verify fees and programme
// details against those pages before each intake cycle.

const SKOLAE_ASSET_BASE = '/universities/skolae-group';

export const skolaeGroup = {
  name: 'SKOLAE',
  logoWhite: `${SKOLAE_ASSET_BASE}/skolae-logo-white.svg`,
  heading: 'One network. Specialised French schools.',
  description:
    'SKOLAE brings together specialised schools in technology, luxury, fashion, design and digital creation. Students earn State-recognised professional certifications and build careers with support from 10,000 partner companies.',
  source: 'https://skolae.fr/le-groupe',
  stats: [
    { value: 19000, suffix: '+', label: 'Students each year' },
    { value: 37, label: 'Cities across France' },
    { value: 20, suffix: '+', label: 'Specialised schools' },
    { value: 10000, label: 'Partner companies' },
    { value: 43000, suffix: '+', label: 'Active alumni' },
  ],
  contact: {
    label: 'SKOLAE South Asia: partnerships & admissions',
    email: 'south.asia@skolae.fr',
    website: 'https://skolae-online.fr/groupe-skolae',
    websiteLabel: 'skolae-online.fr',
  },
};

export const skolaeSchools = [
  {
    key: 'esgi',
    shortName: 'ESGI',
    railLabel: 'Computer science',
    name: 'ESGI',
    fullName: 'École Supérieure de Génie Informatique',
    focus: 'Computer Science & Engineering',
    logo: `${SKOLAE_ASSET_BASE}/schools/esgi.svg`,
    cover: `${SKOLAE_ASSET_BASE}/schools/covers/esgi.jpg`,
    coverAlt: 'Students walking through the ESGI campus in Paris',
    facts: ['Founded in 1983', '18 campuses across France', 'Apple & Cisco labs'],
    summary:
      "A three-year Bachelor's Program followed by a two-year Graduate Program. Students choose their major after two years of core computing.",
    programs: [
      { title: 'Artificial Intelligence and Big Data', level: "Bachelor's & Graduate Program", inDemand: true },
      { title: 'IT Security', level: "Bachelor's & Graduate Program", inDemand: true },
      { title: 'Systems, Networks and Cloud Computing', level: "Bachelor's & Graduate Program", inDemand: true },
      { title: 'Software Architecture', level: "Bachelor's & Graduate Program" },
      { title: 'Virtual Reality and Video Games Engineering', level: "Bachelor's & Graduate Program" },
      { title: 'Blockchain Engineering', level: "Bachelor's & Graduate Program" },
    ],
    website: 'https://www.esgi.fr/international/program.html',
    source: 'https://www.esgi.fr/international/program.html',
  },
  {
    key: 'eiml',
    shortName: 'EIML',
    railLabel: 'Luxury marketing',
    name: 'EIML Paris',
    fullName: 'École Internationale de Marketing du Luxe',
    focus: 'Luxury Marketing & Management',
    logo: `${SKOLAE_ASSET_BASE}/schools/eiml.svg`,
    cover: `${SKOLAE_ASSET_BASE}/schools/covers/eiml.jpg`,
    coverAlt: 'EIML Paris students attending a lecture',
    facts: ['Fully taught in English', 'RNCP Levels 6 & 7', 'New York · Milan · London · Florence'],
    summary:
      'International Programs taught entirely in English, with semesters at Berkeley College (New York) or Accademia del Lusso (Milan), London College of Fashion and Florence University of the Arts.',
    programs: [
      {
        title: 'Bachelor International Program',
        officialName: 'Marketing & communications project manager (RNCP Level 6)',
        level: '3 years · approx. EUR 9,300-10,020 per year',
        english: true,
        inDemand: true,
      },
      {
        title: 'Mastère International Program',
        officialName: 'International Luxury Marketing Manager (RNCP Level 7)',
        level: '2 years · approx. EUR 9,765-10,460 per year · optional dual degree at UC Riverside',
        english: true,
        inDemand: true,
      },
      { title: 'MBA in Luxury Marketing', level: 'MBA' },
    ],
    website: 'https://en.eiml-paris.fr/',
    source: 'https://en.eiml-paris.fr/bachelor-international-program/',
  },
  {
    key: 'modart',
    shortName: 'MODART',
    railLabel: 'Fashion',
    name: 'MODART International',
    fullName: 'La Grande École de Mode · Paris',
    focus: 'Fashion Design & Luxury',
    logo: `${SKOLAE_ASSET_BASE}/schools/modart.png`,
    cover: `${SKOLAE_ASSET_BASE}/schools/covers/modart.jpg`,
    coverAlt: 'Looks created by MODART International students',
    facts: ['Paris + 6 campuses', 'State-recognised Levels 6 & 7', 'Annual graduate runway show'],
    summary:
      'Bachelor, Mastère and MBA programmes from Bac to Bac+5, with styling and pattern-making studios, industry internships every year and a final collection shown on the runway.',
    programs: [
      {
        title: 'Bachelor in Fashion Design',
        officialName: 'Bachelor Stylisme et Modélisme',
        level: '3 years · taught in French or English',
        english: true,
      },
      {
        title: 'MBA Luxury Goods and Fashion Industries',
        level: '2 years · English track · Paris · RNCP Level 6 then 7',
        english: true,
        inDemand: true,
      },
      {
        title: 'Mastère Digital Fashion Designer',
        level: '2 years · Paris · RNCP Level 7 · Style3D, Blender, Unreal',
        inDemand: true,
      },
      { title: 'Bachelor in Fashion Management', officialName: 'Bachelor Management de la Mode', level: 'Bachelor' },
      { title: 'Bachelor in Fashion Communication', officialName: 'Bachelor Communication de Mode', level: 'Bachelor' },
      {
        title: 'Mastère Art Direction & Collection Management',
        officialName: 'Mastère Direction artistique et Management de collection',
        level: 'Mastère',
      },
    ],
    website: 'https://modart-paris.com/',
    source: 'https://modart-paris.com/formations/mba-luxury-goods-fashion-industries/',
  },
  {
    key: 'ican',
    shortName: 'ICAN',
    railLabel: 'Games & digital design',
    name: 'ICAN',
    fullName: "Institut de Création et d'Animation Numériques",
    focus: 'Games, Animation, Web & AI Design',
    logo: `${SKOLAE_ASSET_BASE}/schools/ican.svg`,
    cover: `${SKOLAE_ASSET_BASE}/schools/covers/ican.jpg`,
    coverAlt: 'ICAN students working on digital design projects',
    facts: ['6 campuses incl. Paris', 'SNJV video game industry member', 'Bac to Bac+5'],
    summary:
      'Project-based training in three hubs (video games, animation, and web & digital) leading to State-recognised Level 6 and 7 certifications.',
    programs: [
      { title: 'Game Design', level: 'Bachelor & Mastère', inDemand: true },
      { title: 'Game Programming', level: 'Bachelor & Mastère' },
      { title: 'UX/UI Design', level: 'Bachelor · Mastère UX Design / UI Design', inDemand: true },
      { title: 'AI Design', officialName: 'Bachelor & Mastère IA Design', level: 'Bachelor & Mastère', inDemand: true },
      { title: 'Game Art', level: 'Bachelor & Mastère' },
      { title: 'Motion Design', level: 'Bachelor & Mastère' },
    ],
    website: 'https://www.ican-design.fr/',
    source: 'https://www.ican-design.fr/',
  },
  {
    key: 'efet',
    shortName: 'EFET',
    railLabel: 'Graphic & interior design',
    name: 'EFET',
    fullName: 'EFET Créa & EFET Photo',
    focus: 'Graphic Design, Interiors & Photography',
    logo: `${SKOLAE_ASSET_BASE}/schools/efet-crea.svg`,
    secondaryLogo: `${SKOLAE_ASSET_BASE}/schools/efet-photo.svg`,
    cover: `${SKOLAE_ASSET_BASE}/schools/covers/efet.jpg`,
    coverAlt: 'An EFET Photo student presenting her photography series to the jury',
    facts: ['50+ years of creative training', 'CFAI-recognised interior design Mastère', 'D&AD New Blood 2026 Graphite Pencil'],
    summary:
      'Creative schools for visual communication, interior architecture and photography, built around studio and project work. At EFET Photo, around 70% of time on site is hands-on practice.',
    programs: [
      {
        title: 'Bachelor in Graphic & Digital Design',
        officialName: 'Bachelor Design Graphique et Numérique',
        level: 'Bachelor',
      },
      {
        title: 'Mastère Art Direction',
        officialName: 'Mastère Direction Artistique',
        level: 'Mastère',
        inDemand: true,
      },
      {
        title: 'Interior Design & Architecture',
        officialName: "Design et Architecture d'Intérieur",
        level: 'Bachelor (Level 6) & Mastère (Level 7)',
        inDemand: true,
      },
      { title: 'Bachelor in Photography', officialName: 'Bachelor Photographie · EFET Photo', level: '3 years' },
      {
        title: 'Bachelor in Digital Photography & AI',
        officialName: 'Bachelor Photographie Numérique & IA',
        level: 'Bachelor',
        inDemand: true,
      },
    ],
    website: 'https://efet-crea.fr/',
    source: 'https://efet-crea.fr/',
  },
];

export const skolaePathways = [
  { field: 'AI & Big Data', schoolKey: 'esgi' },
  { field: 'Cybersecurity', schoolKey: 'esgi' },
  { field: 'Cloud Computing', schoolKey: 'esgi' },
  { field: 'Luxury Brand Management', schoolKey: 'eiml' },
  { field: 'Digital Fashion Design', schoolKey: 'modart' },
  { field: 'Game Design & UX/UI', schoolKey: 'ican' },
  { field: 'AI Design', schoolKey: 'ican' },
  { field: 'Art Direction & Interiors', schoolKey: 'efet' },
];

export const skolaeHighlights = [
  {
    key: 'global',
    title: 'Global classroom',
    description:
      'Semester or year-abroad options with partner institutions in 16 countries, including the UK, USA, Italy, Canada, Singapore and the UAE.',
  },
  {
    key: 'design-project',
    title: 'Design Project Program',
    description:
      'A one-year creative foundation exploring 8 disciplines, one each month, before specialising at one of six partner schools in the network.',
  },
];

// Other schools in the group, grouped by field. Focus lines come from each school's
// official website (checked October 2026).
export const skolaeOtherSchools = [
  {
    key: 'business',
    title: 'Business & management',
    schools: [
      { name: 'PPA Business School', focus: 'Business school, Bac to Bac+5', website: 'https://www.ppa.fr/' },
      { name: 'PPA Sport', focus: 'Sports business school', website: 'https://www.ppa-sport.fr/' },
      { name: 'EFFICOM', focus: 'Business, HR, design and IT', website: 'https://www.efficom.fr/' },
      { name: 'ENGDE', focus: 'Accounting and management', website: 'https://www.engde.fr/' },
      { name: 'EFAB', focus: 'Real estate careers', website: 'https://www.efab.fr/' },
    ],
  },
  {
    key: 'media',
    title: 'Communication & journalism',
    schools: [
      { name: "ESUPCOM'", focus: 'Communication', website: 'https://www.esupcom.com/' },
      { name: 'ISFJ', focus: 'Journalism and media', website: 'https://www.isfj.fr/' },
      { name: 'École W', focus: 'Journalism, communication and fiction', website: 'https://www.ecolew.com/' },
      { name: 'CFPJ', focus: 'Journalism', website: 'https://www.cfpj-ecole.fr/' },
    ],
  },
  {
    key: 'film',
    title: 'Film, audiovisual & digital',
    schools: [
      { name: 'ESIS', focus: 'Cinema, sound, music and VFX', website: 'https://www.esis-paris.fr/' },
      { name: 'ISA', focus: 'Audiovisual production', website: 'https://isa-paris.com/' },
      { name: 'ECITV', focus: 'Digital and audiovisual', website: 'https://www.ecitv.fr/' },
      { name: '2iAcademy', focus: 'Digital and IT careers', website: 'https://2iacademy.com/' },
    ],
  },
];
