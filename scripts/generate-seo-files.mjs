import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { newsItems } from '../src/data/newsData.js';
import { portfolioData } from '../src/data/portfolioData.js';
import { educationPrograms } from '../src/data/educationProgramsData.js';
import { galleryCollections } from '../src/data/galleryCollectionsData.js';

const SITE_URL = String(globalThis.process?.env?.VITE_SITE_URL || 'https://theglobalavenues.com').replace(
  /\/+$/,
  ''
);
const TODAY = new Date().toISOString().slice(0, 10);
const LEVELS = ['undergraduate', 'postgraduate', 'doctorate'];

const xmlEscape = (value) =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');

const normalizePath = (value) => {
  const raw = String(value || '').trim();
  if (!raw) return '/';
  if (raw === '/') return raw;
  return raw.startsWith('/') ? raw : `/${raw}`;
};

const toAbsoluteUrl = (path) => `${SITE_URL}${normalizePath(path)}`;
const toAbsoluteImageUrl = (value) => {
  const raw = String(value || '').trim();
  if (!raw) return '';
  if (/^https?:\/\//i.test(raw)) return raw;
  if (raw.startsWith('/')) return `${SITE_URL}${raw}`;
  return '';
};

const baseEntries = [
  { path: '/', changefreq: 'weekly', priority: '1.0', lastmod: TODAY },
  { path: '/about', changefreq: 'monthly', priority: '0.8', lastmod: TODAY },
  { path: '/services', changefreq: 'weekly', priority: '0.8', lastmod: TODAY },
  { path: '/what-we-offer', changefreq: 'weekly', priority: '0.9', lastmod: TODAY },
  { path: '/universities', changefreq: 'weekly', priority: '0.8', lastmod: TODAY },
  { path: '/destinations', changefreq: 'weekly', priority: '0.8', lastmod: TODAY },
  { path: '/portfolio', changefreq: 'weekly', priority: '0.9', lastmod: TODAY },
  { path: '/gallery', changefreq: 'weekly', priority: '0.8', lastmod: TODAY },
  { path: '/partners', changefreq: 'monthly', priority: '0.7', lastmod: TODAY },
  { path: '/news-blog', changefreq: 'weekly', priority: '0.8', lastmod: TODAY },
  { path: '/collaborate', changefreq: 'monthly', priority: '0.8', lastmod: TODAY },
];

const programEntries = educationPrograms.flatMap((program) =>
  LEVELS.map((level) => ({
    path: `/education-program/${program.id}/${level}`,
    changefreq: 'monthly',
    priority: '0.7',
    lastmod: TODAY,
  }))
);

const newsEntries = newsItems
  .filter((item) => item?.slug)
  .map((item) => ({
    path: `/news/${item.slug}`,
    changefreq: 'monthly',
    priority: '0.7',
    lastmod: item.date || TODAY,
  }));

const galleryEntries = galleryCollections
  .filter((collection) => collection?.slug)
  .map((collection) => ({
    path: `/gallery/collection/${collection.slug}`,
    changefreq: 'monthly',
    priority: '0.7',
    lastmod: TODAY,
  }));

const portfolioEntries = portfolioData
  .filter((item) => item?.slug)
  .map((item) => ({
    path: `/portfolio/${item.slug}`,
    changefreq: 'monthly',
    priority: '0.8',
    lastmod: TODAY,
  }));

const uniqueEntries = Array.from(
  new Map(
    [...baseEntries, ...programEntries, ...newsEntries, ...galleryEntries, ...portfolioEntries].map(
      (entry) => [normalizePath(entry.path), { ...entry, path: normalizePath(entry.path) }]
    )
  ).values()
).sort((a, b) => a.path.localeCompare(b.path));

const imageMap = new Map();
const addImageEntry = (path, imageLoc, caption = '') => {
  const normalizedPath = normalizePath(path);
  const normalizedImageLoc = toAbsoluteImageUrl(imageLoc);
  if (!normalizedImageLoc) return;

  if (!imageMap.has(normalizedPath)) {
    imageMap.set(normalizedPath, []);
  }

  const existing = imageMap.get(normalizedPath);
  if (existing.some((item) => item.loc === normalizedImageLoc)) return;
  existing.push({
    loc: normalizedImageLoc,
    caption: String(caption || '').trim(),
  });
};

addImageEntry('/', '/videos/hero-poster.jpg', 'The Global Avenues');
addImageEntry('/about', '/team/neetu-verma-gupta.webp', 'The Global Avenues team');
addImageEntry('/services', '/videos/hero-poster.jpg', 'Education growth services');
addImageEntry('/portfolio', '/universities/icn-business-school-hero.png', 'Partner institutions');
addImageEntry('/news-blog', '/blogs/affordable-countries-study-abroad.jpg', 'News and blog');
addImageEntry('/gallery', '/gallery/collections/conferences/conference-events-2026/conference-cover-team-introduction.jpg', 'Gallery collections');
addImageEntry('/destinations', '/dest-hero-cinematic.jpg', 'Study abroad destinations');
addImageEntry('/destinations', '/dest-europe.jpg', 'Study destinations in Europe');
addImageEntry('/destinations', '/dest-northamerica.jpg', 'Study destinations in North America');
addImageEntry('/destinations', '/dest-middleeast.jpg', 'Study destinations in UAE');
addImageEntry('/destinations', '/dest-asia.jpg', 'Study destinations in Africa and South East Asia');

newsItems.forEach((item) => {
  if (!item?.slug) return;
  const articlePath = `/news/${item.slug}`;
  addImageEntry(articlePath, item.image, item.title);
  addImageEntry(articlePath, item.thumbnail, item.title);
});

portfolioData.forEach((item) => {
  if (!item?.slug) return;
  const profilePath = `/portfolio/${item.slug}`;
  addImageEntry(profilePath, item.image, item.title);
  addImageEntry(profilePath, item.logo, `${item.title} logo`);
});

galleryCollections.forEach((collection) => {
  if (!collection?.slug) return;
  const collectionPath = `/gallery/collection/${collection.slug}`;
  const photos = Array.isArray(collection.photos) ? collection.photos : [];
  photos.forEach((photo) => {
    addImageEntry(collectionPath, photo?.src, photo?.caption || collection.title);
    addImageEntry(collectionPath, photo?.thumbnail, photo?.caption || collection.title);
  });
});

const sitemapXml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...uniqueEntries.map(
    (entry) => `  <url>
    <loc>${xmlEscape(toAbsoluteUrl(entry.path))}</loc>
    <lastmod>${xmlEscape(entry.lastmod)}</lastmod>
    <changefreq>${xmlEscape(entry.changefreq)}</changefreq>
    <priority>${xmlEscape(entry.priority)}</priority>
  </url>`
  ),
  '</urlset>',
  '',
].join('\n');

const imageEntries = Array.from(imageMap.entries()).filter(([, images]) => images.length > 0);
const imageSitemapXml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">',
  ...imageEntries.map(
    ([path, images]) => `  <url>
    <loc>${xmlEscape(toAbsoluteUrl(path))}</loc>
${images
  .map(
    (image) => `    <image:image>
      <image:loc>${xmlEscape(image.loc)}</image:loc>${
        image.caption ? `
      <image:caption>${xmlEscape(image.caption)}</image:caption>` : ''
      }
    </image:image>`
  )
  .join('\n')}
  </url>`
  ),
  '</urlset>',
  '',
].join('\n');

const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
Sitemap: ${SITE_URL}/sitemap-images.xml
`;

const publicDir = resolve(globalThis.process?.cwd?.() || '.', 'public');
mkdirSync(publicDir, { recursive: true });
writeFileSync(resolve(publicDir, 'sitemap.xml'), sitemapXml, 'utf8');
writeFileSync(resolve(publicDir, 'sitemap-images.xml'), imageSitemapXml, 'utf8');
writeFileSync(resolve(publicDir, 'robots.txt'), robotsTxt, 'utf8');

globalThis.console?.log?.(`[seo] Generated sitemap.xml with ${uniqueEntries.length} URLs.`);
globalThis.console?.log?.(`[seo] Generated sitemap-images.xml with ${imageEntries.length} URLs.`);
globalThis.console?.log?.('[seo] Generated robots.txt.');
