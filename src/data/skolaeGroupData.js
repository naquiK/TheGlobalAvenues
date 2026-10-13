// SKOLAE Group profile content for /portfolio/skolae-group.
// Facts, photos and logos come from the official SKOLAE and school websites
// (see ai/references/skolae-sources.md, last checked October 2026). Re-check fees
// and programme details against those pages before each intake.

const ASSETS = '/universities/skolae-group';

export const skolaeGroup = {
  name: 'SKOLAE Group',
  logoDark: `${ASSETS}/skolae-logo-dark.svg`,
  logoWhite: `${ASSETS}/skolae-logo-white.svg`,
  standfirst:
    'A family of about twenty specialised private schools across France. We work with five of them, in tech, luxury marketing, fashion, games and design.',
  hero: {
    src: `${ASSETS}/skolae-group-hero.jpg`,
    alt: 'Leather and fabric laid out on cutting tables in a bright fashion studio',
    caption: 'The fashion studio at MODART International, Paris.',
    credit: 'Photo: MODART International',
  },
  intro: [
    "SKOLAE isn't a single university. It's the group behind schools like ESGI, MODART International and EIML Paris, built from the GES and Eductive networks. Each school keeps its own name, campus and teaching style, and SKOLAE connects them through shared career services and roughly 10,000 partner companies.",
    "Most programmes lead to French State-recognised professional certifications: RNCP Level 6 for a Bachelor, Level 7 for a Mastère or MBA. Not every programme is taught in English. We've marked the ones that are, and we'll confirm the language for the rest before you apply.",
  ],
  glance: [
    { label: 'Schools in the group', value: '20+' },
    { label: 'Cities in France', value: '37' },
    { label: 'Students per year', value: '19,000+' },
    { label: 'Partner companies', value: '10,000' },
    { label: 'Active alumni', value: '43,000+' },
    { label: 'Certification levels', value: 'RNCP 6 & 7' },
    { label: 'Main intake', value: 'September' },
  ],
  glanceSource: 'Figures from skolae.fr, October 2026.',
  contact: {
    email: 'south.asia@skolae.fr',
    website: 'https://skolae-online.fr/groupe-skolae',
    websiteLabel: 'skolae-online.fr',
  },
  checkedNote:
    "Last checked in October 2026 against each school's official website. Fees and programme details change every year, so please confirm with us before you apply.",
};

export const skolaeSchools = [
  {
    key: 'esgi',
    name: 'ESGI',
    fullName: 'École Supérieure de Génie Informatique',
    focus: 'Computer science',
    logo: `${ASSETS}/schools/esgi.svg`,
    photo: `${ASSETS}/schools/covers/esgi.jpg`,
    photoAlt: 'Students walking down a corridor lined with project posters at ESGI',
    photoCredit: 'Photo: ESGI',
    facts: ['Founded 1983', '18 campuses', 'Apple and Cisco labs'],
    summary:
      "Three years of Bachelor's study, then a two-year Graduate Program. Everyone does two years of core computing before picking a major, so you're not locked in on day one.",
    goodFit: "you've studied PCM or computer science and want a hands-on tech degree in AI, security or cloud.",
    programs: [
      { title: 'Artificial Intelligence and Big Data', level: "Bachelor's + Graduate Program" },
      { title: 'IT Security', level: "Bachelor's + Graduate Program" },
      { title: 'Systems, Networks and Cloud Computing', level: "Bachelor's + Graduate Program" },
      { title: 'Software Architecture', level: "Bachelor's + Graduate Program" },
      { title: 'Virtual Reality and Video Games Engineering', level: "Bachelor's + Graduate Program" },
      { title: 'Blockchain Engineering', level: "Bachelor's + Graduate Program" },
    ],
    website: 'https://www.esgi.fr/international/program.html',
  },
  {
    key: 'eiml',
    name: 'EIML Paris',
    fullName: 'École Internationale de Marketing du Luxe',
    focus: 'Luxury marketing',
    logo: `${ASSETS}/schools/eiml.svg`,
    photo: `${ASSETS}/schools/covers/eiml.jpg`,
    photoAlt: 'EIML Paris students listening to a lecture',
    photoCredit: 'Photo: EIML Paris',
    facts: ['Fully in English', 'RNCP Levels 6 and 7', 'Semesters abroad'],
    summary:
      'The International Programs are taught entirely in English. Bachelor students spend semesters at Berkeley College in New York or Accademia del Lusso in Milan, then London College of Fashion and Florence University of the Arts.',
    goodFit: 'you want a business career with luxury brands and would rather study fully in English.',
    programs: [
      { title: 'Bachelor International Program', level: '3 years · about €9,300–10,020 a year', language: 'English' },
      {
        title: 'Mastère International Program',
        note: 'International Luxury Marketing Manager',
        level: '2 years · about €9,765–10,460 a year',
        language: 'English',
      },
      { title: 'MBA in Luxury Marketing', level: 'MBA' },
    ],
    website: 'https://en.eiml-paris.fr/',
  },
  {
    key: 'modart',
    name: 'MODART International',
    fullName: 'La Grande École de Mode',
    focus: 'Fashion',
    logo: `${ASSETS}/schools/modart.png`,
    photo: `${ASSETS}/schools/covers/modart.jpg`,
    photoAlt: 'Three models wearing pieces designed by MODART International students',
    photoCredit: 'Photo: MODART International',
    facts: ['Paris + 6 cities', 'Graduate runway show', 'Internships every year'],
    summary:
      'Pattern-cutting studios, internships in every year of study and a final collection shown on the runway. The fashion design Bachelor can be taken in French or English.',
    goodFit: 'you have a design portfolio (or want to build one) and want to study fashion in Paris.',
    programs: [
      { title: 'Bachelor in Fashion Design', note: 'Stylisme et Modélisme', level: '3 years', language: 'French or English' },
      { title: 'MBA Luxury Goods and Fashion Industries', level: '2 years · Paris', language: 'English track' },
      { title: 'Mastère Digital Fashion Designer', note: 'Style3D, Blender, Unreal', level: '2 years · Paris', language: 'French' },
      { title: 'Bachelor in Fashion Management', note: 'Management de la Mode', level: 'Bachelor' },
      { title: 'Bachelor in Fashion Communication', note: 'Communication de Mode', level: 'Bachelor' },
      { title: 'Mastère Art Direction & Collection Management', level: 'Mastère' },
    ],
    website: 'https://modart-paris.com/',
  },
  {
    key: 'ican',
    name: 'ICAN',
    fullName: "Institut de Création et d'Animation Numériques",
    focus: 'Games, animation and digital design',
    logo: `${ASSETS}/schools/ican.svg`,
    photo: `${ASSETS}/schools/covers/ican.jpg`,
    photoAlt: 'Two ICAN students working on laptops in a studio',
    photoCredit: 'Photo: ICAN',
    facts: ['6 campuses', 'Member of SNJV', 'Bac to Bac+5'],
    summary:
      "Teaching is built around projects in three areas: video games, animation, and web and digital. You'll leave with a portfolio, not only a transcript.",
    goodFit: 'you want to make games, interfaces or AI-driven design, and you learn best by building things.',
    programs: [
      { title: 'Game Design', level: 'Bachelor + Mastère' },
      { title: 'Game Programming', level: 'Bachelor + Mastère' },
      { title: 'UX/UI Design', level: 'Bachelor + Mastère' },
      { title: 'AI Design', note: 'IA Design', level: 'Bachelor + Mastère' },
      { title: 'Game Art', level: 'Bachelor + Mastère' },
      { title: 'Motion Design', level: 'Bachelor + Mastère' },
    ],
    website: 'https://www.ican-design.fr/',
  },
  {
    key: 'efet',
    name: 'EFET',
    fullName: 'EFET Créa and EFET Photo',
    focus: 'Graphic design, interiors and photography',
    logo: `${ASSETS}/schools/efet-crea.svg`,
    secondaryLogo: `${ASSETS}/schools/efet-photo.svg`,
    photo: `${ASSETS}/schools/covers/efet.jpg`,
    photoAlt: 'An EFET Photo student standing beside her photo series at the final jury',
    photoCredit: 'Photo: EFET Photo',
    facts: ['50+ years', 'CFAI-recognised Mastère', 'D&AD New Blood 2026'],
    summary:
      'About 70% of time on site is studio and project work. In 2026 alone, students picked up a D&AD New Blood Graphite Pencil and first prize at the Elite Design Awards.',
    goodFit: "you're drawn to branding, interiors or photography and want studio-heavy teaching.",
    programs: [
      { title: 'Bachelor in Graphic & Digital Design', note: 'Design Graphique et Numérique', level: 'Bachelor' },
      { title: 'Mastère Art Direction', note: 'Direction Artistique', level: 'Mastère' },
      { title: 'Interior Design & Architecture', level: 'Bachelor (L6) + Mastère (L7)' },
      { title: 'Bachelor in Photography', note: 'at EFET Photo', level: '3 years' },
      { title: 'Bachelor in Digital Photography & AI', level: 'Bachelor' },
    ],
    website: 'https://efet-crea.fr/',
  },
];

export const skolaeCareerGuide = [
  { goal: 'Software, AI or data roles', schoolKey: 'esgi', programme: 'Artificial Intelligence and Big Data' },
  { goal: 'Cybersecurity', schoolKey: 'esgi', programme: 'IT Security' },
  { goal: 'Cloud and infrastructure', schoolKey: 'esgi', programme: 'Systems, Networks and Cloud Computing' },
  { goal: 'Marketing for luxury brands', schoolKey: 'eiml', programme: 'Bachelor or Mastère International Program' },
  { goal: 'Fashion design', schoolKey: 'modart', programme: 'Bachelor in Fashion Design' },
  { goal: '3D and digital fashion', schoolKey: 'modart', programme: 'Mastère Digital Fashion Designer' },
  { goal: 'Game design', schoolKey: 'ican', programme: 'Game Design' },
  { goal: 'UX/UI design', schoolKey: 'ican', programme: 'UX/UI Design' },
  { goal: 'Branding and art direction', schoolKey: 'efet', programme: 'Mastère Art Direction' },
  { goal: 'Interior design', schoolKey: 'efet', programme: 'Interior Design & Architecture' },
];

export const skolaeWorthKnowing = [
  {
    lead: 'Time abroad is built in.',
    text: 'Schools in the group send students on semester or year-long exchanges to 16 countries, including the UK, USA, Canada, Italy, Singapore and the UAE.',
  },
  {
    lead: 'Not sure what to study yet?',
    text: 'The one-year Design Project Program lets you try eight creative disciplines, one each month, before you choose one of six partner schools in the network.',
  },
];

// Route for non-EU students, as published by ESGI and SKOLAE.
export const skolaeApplicationSteps = [
  { title: 'Apply online', text: 'The whole admission process can be done from India. You never need to travel for it.' },
  {
    title: 'Test and interview',
    text: 'Most schools run a written test and an interview. For the English programmes, the interview is in English.',
  },
  {
    title: 'Confirm your place',
    text: 'Once you pay the tuition, the school finalises your registration and sends the documents you need for the visa.',
  },
  { title: 'Campus France', text: 'Complete the "Études en France" file to get the pre-approval the embassy asks for.' },
  { title: 'Student visa', text: 'Apply for the long-stay student visa (VLS-TS), then validate it online within 3 months of landing.' },
];

export const skolaeDeadlineNote =
  'At ESGI, non-EU students apply by 1 July for the September/October intake, or by 1 November for January where it runs. Other schools set their own dates, so ask us.';

export const skolaeOtherSchools = [
  'PPA Business School',
  'PPA Sport',
  'EFFICOM',
  'ESUPCOM',
  'ISFJ',
  'ESIS',
  'EFAB',
  'ECITV',
  'CFPJ',
  'École W',
  'ISA',
  'ENGDE',
  '2iAcademy',
];
