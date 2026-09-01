import {
  portfolioData,
  getPortfolioById as getLocalPortfolioById,
  getPortfolioBySlug as getLocalPortfolioBySlug,
  categories as localCategories,
} from '../data/portfolioData';
import { getPortfolioList } from './contentApi';
import { resolveMediaUrl } from './apiClient';

const cmsPortfolioCache = {
  loaded: false,
  data: [],
};

const portfolioCountryOrder = ['Austria', 'Estonia', 'France', 'Cyprus', 'USA'];
const canonicalKufsteinPortfolio = portfolioData.find((item) => item.slug === 'hok-kufstein-tirol');

const numericOrDefault = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const pickText = (item, keys, fallback = '') => {
  for (const key of keys) {
    const value = item?.[key];
    if (value !== undefined && value !== null && String(value).trim() !== '') {
      return String(value).trim();
    }
  }
  return fallback;
};

const getNormalizedText = (value = '') => String(value).trim().toLowerCase();

const isInternationalAmericanUniversity = (item = {}) => {
  const slug = getNormalizedText(item.slug);
  const title = getNormalizedText(item.title || item.name);
  return slug === 'international-american-university' || title === 'international american university';
};

const isKufsteinTirolPortfolio = (item = {}) => {
  const combined = [item.slug, item.title, item.name, item.website, item.url, item.link, item.city]
    .map(getNormalizedText)
    .join(' ');

  return combined.includes('kufstein');
};

export const sortPortfoliosForDisplay = (items = []) => {
  const normalizedCountryOrder = new Map(
    portfolioCountryOrder.map((country, index) => [country.toLowerCase(), index])
  );

  const getCountryRank = (item = {}) => {
    const country = getNormalizedText(item.country);
    return normalizedCountryOrder.has(country)
      ? normalizedCountryOrder.get(country)
      : portfolioCountryOrder.length + 1;
  };

  return [...items]
    .map((item, originalIndex) => ({ item, originalIndex }))
    .sort((a, b) => {
      const countryDiff = getCountryRank(a.item) - getCountryRank(b.item);
      if (countryDiff !== 0) {
        return countryDiff;
      }

      const aPriority = isInternationalAmericanUniversity(a.item) ? 0 : 1;
      const bPriority = isInternationalAmericanUniversity(b.item) ? 0 : 1;
      if (aPriority !== bPriority) {
        return aPriority - bPriority;
      }

      return a.originalIndex - b.originalIndex;
    })
    .map(({ item }) => item);
};

const mapCmsPortfolio = (item, index) => {
  if (canonicalKufsteinPortfolio && isKufsteinTirolPortfolio(item)) {
    return canonicalKufsteinPortfolio;
  }

  const title = pickText(item, ['name', 'title'], `University ${index + 1}`);
  const slug = pickText(item, ['slug'], '').toLowerCase();
  const country = pickText(item, ['country'], 'Global');
  const description = pickText(
    item,
    ['description', 'summary', 'short_description'],
    `Explore ${title} and discover global education opportunities.`
  );

  const tuitionText = pickText(item, ['avg_tuition', 'tuition_fee'], '');
  const visaRate = numericOrDefault(item.visa_success_rate, 0);

  const details = {
    location: [item.city, country].filter(Boolean).join(', ') || country,
    ranking: pickText(item, ['ranking'], 'Partner Institution'),
  };

  if (visaRate > 0) {
    details.visaSuccessRate = visaRate;
  }

  if (tuitionText) {
    details.avgTuition = tuitionText;
  }

  return {
    id: item.id || `cms-${index + 1}`,
    slug: slug || `university-${index + 1}`,
    title,
    category: pickText(item, ['category'], 'Partner University'),
    country,
    image: resolveMediaUrl(pickText(item, ['logo', 'image', 'featured_image'])),
    logo: resolveMediaUrl(pickText(item, ['logo'])),
    studentsPlaced: numericOrDefault(item.students_enrolled || item.students_placed, 0),
    programs: numericOrDefault(item.program_count || item.programs, 0),
    successRate: numericOrDefault(item.success_rate || item.visa_success_rate, 95),
    achievement: pickText(item, ['achievement'], 'Verified Partner'),
    contact: pickText(item, ['email', 'contact_email', 'contact'], ''),
    website: pickText(item, ['website', 'url', 'link'], ''),
    description,
    details,
    highlights: [],
  };
};

const mergePortfolioData = (basePortfolio, overridePortfolio) => {
  if (!basePortfolio) return overridePortfolio;
  if (!overridePortfolio) return basePortfolio;

  return {
    ...basePortfolio,
    ...overridePortfolio,
    image: overridePortfolio.image || basePortfolio.image,
    logo: overridePortfolio.logo || basePortfolio.logo,
    description: overridePortfolio.description || basePortfolio.description,
    category: overridePortfolio.category || basePortfolio.category,
    details: {
      ...(basePortfolio.details || {}),
      ...(overridePortfolio.details || {}),
    },
    highlights:
      overridePortfolio.highlights && overridePortfolio.highlights.length > 0
        ? overridePortfolio.highlights
        : basePortfolio.highlights,
  };
};

const uniquePortfoliosBySlug = (items = []) =>
  Array.from(new Map(items.map((item) => [item.slug, item])).values());

const fetchCmsPortfolios = async () => {
  if (cmsPortfolioCache.loaded) {
    return cmsPortfolioCache.data;
  }

  try {
    const data = await getPortfolioList({ timeoutMs: 2500 });
    const mapped = (Array.isArray(data) ? data : [])
      .map(mapCmsPortfolio)
      .filter((item) => item.slug && item.title);

    cmsPortfolioCache.loaded = true;
    cmsPortfolioCache.data = uniquePortfoliosBySlug(mapped);
    return cmsPortfolioCache.data;
  } catch (error) {
    cmsPortfolioCache.loaded = true;
    cmsPortfolioCache.data = [];
    return [];
  }
};

const getUnifiedPortfolios = async () => {
  const cmsPortfolios = await fetchCmsPortfolios();

  if (cmsPortfolios.length === 0) {
    return portfolioData;
  }

  const localBySlug = new Map(portfolioData.map((item) => [item.slug, item]));
  const merged = cmsPortfolios.map((cmsItem) =>
    mergePortfolioData(localBySlug.get(cmsItem.slug), cmsItem)
  );

  const existingSlugs = new Set(merged.map((item) => item.slug));
  const remainingLocal = portfolioData.filter((item) => !existingSlugs.has(item.slug));

  return [...merged, ...remainingLocal];
};

export const getFeaturedPortfolios = async (limit = null) => {
  const portfolios = sortPortfoliosForDisplay(await getUnifiedPortfolios());

  if (!Number.isFinite(limit) || limit <= 0) {
    return portfolios;
  }

  return portfolios.slice(0, limit);
};

export const getPortfolios = async (filters = {}, page = 1, pageSize = 12) => {
  const portfolios = await getUnifiedPortfolios();
  let filtered = portfolios;

  if (filters.category && filters.category !== 'All') {
    filtered = filtered.filter((item) => item.category === filters.category);
  }

  if (filters.country && filters.country !== 'All') {
    filtered = filtered.filter((item) => item.country === filters.country);
  }

  if (filters.search && String(filters.search).trim()) {
    const query = String(filters.search).toLowerCase();
    filtered = filtered.filter(
      (item) =>
        item.title.toLowerCase().includes(query) ||
        item.country.toLowerCase().includes(query) ||
        String(item.description || '')
          .toLowerCase()
          .includes(query)
    );
  }

  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  return {
    data: filtered.slice(start, end),
    total: filtered.length,
    page,
    pageSize,
    totalPages: Math.ceil(filtered.length / pageSize),
  };
};

export const getPortfolioById = async (id) => {
  const unified = await getUnifiedPortfolios();
  const numericId = Number.parseInt(id, 10);

  const found = Number.isNaN(numericId)
    ? unified.find((item) => item.slug === id)
    : unified.find((item) => Number(item.id) === numericId || item.slug === String(id));

  if (found) return found;

  const localFallback = Number.isNaN(numericId) ? getLocalPortfolioBySlug(id) : getLocalPortfolioById(id);
  if (localFallback) return localFallback;

  throw new Error('Portfolio not found');
};

export const getPortfolioBySlug = async (slug) => getPortfolioById(slug);

export const getPortfoliosByCategory = async (category) => {
  const unified = await getUnifiedPortfolios();
  if (!category || category === 'All') return unified;
  return unified.filter((item) => item.category === category);
};

export const searchPortfolios = async (query) => {
  const unified = await getUnifiedPortfolios();
  const searchTerm = String(query || '').trim().toLowerCase();
  if (!searchTerm) return unified;

  return unified.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm) ||
      item.country.toLowerCase().includes(searchTerm) ||
      String(item.description || '')
        .toLowerCase()
        .includes(searchTerm)
  );
};

export const getCategories = async () => {
  const unified = await getUnifiedPortfolios();
  const dynamicCategories = Array.from(
    new Set(unified.map((item) => item.category).filter(Boolean))
  );
  const mergedCategories = ['All', ...dynamicCategories];
  const localOnly = localCategories.filter((item) => !mergedCategories.includes(item));
  return [...mergedCategories, ...localOnly];
};

export const getPortfolioStats = async () => {
  const unified = await getUnifiedPortfolios();
  const totalStudents = unified.reduce((sum, item) => sum + numericOrDefault(item.studentsPlaced), 0);
  const totalPrograms = unified.reduce((sum, item) => sum + numericOrDefault(item.programs), 0);
  const avgSuccessRate =
    unified.length > 0
      ? Math.round(
          unified.reduce((sum, item) => sum + numericOrDefault(item.successRate), 0) / unified.length
        )
      : 0;

  return {
    totalUniversities: unified.length,
    totalStudents,
    totalPrograms,
    avgSuccessRate,
    countries: Array.from(new Set(unified.map((item) => item.country).filter(Boolean))),
  };
};

export default {
  getFeaturedPortfolios,
  getPortfolios,
  getPortfolioById,
  getPortfolioBySlug,
  getPortfoliosByCategory,
  searchPortfolios,
  getCategories,
  getPortfolioStats,
};
