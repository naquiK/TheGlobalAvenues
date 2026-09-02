import { useParams, useNavigate, Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  MapPin,
  Trophy,
  Star,
  Globe,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  CalendarDays,
  Clock3,
  Download,
  Eye,
  FileText,
  BadgeCheck,
  Building2,
  GraduationCap,
  Palette,
  Cpu,
  Briefcase,
  X,
} from 'lucide-react';
import { getPortfolioById, getPortfolios } from '../services/portfolioService';
import { getUniversityDetail } from '../services/contentApi';
import { resolveMediaUrl } from '../services/apiClient';
import useScrollIntentCelebration from '../hooks/useScrollIntentCelebration';
import BackNavButton from '../components/ui/BackNavButton';

import { DetailSkeleton } from '../components/ui/SkeletonLayouts';

import Seo from '../components/seo/Seo';
import { SITE_URL, trimDescription, toAbsoluteUrl } from '../seo/siteMeta';
import { SITE_CONFIG } from '../config';

const MJM_SUMMER_SCHOOL_HIGHLIGHT = {
  title: 'MJM France Summer School',
  city: 'Paris & Lille',
  dates: '15-26 June 2026',
  duration: 'Two weeks',
  fee: '2000Euro Per Student',
  age: '16 and above',
  classSize: '15-25 students',
  mode: 'On-campus & outdoor learning',
  hours: '36 hours from 10:00 to 18:00',
  pdf: '/universities/mjm-graphic-design/brochures/mjm-summer-school-france.pdf',
  pdfLow: '/universities/mjm-graphic-design/brochures/mjm-summer-school-france-low.pdf',
  featuredProgram: {
    title: 'Creative Summer School in France',
    fee: '2000Euro Per Student',
    deadline: 'Apply early for the June 2026 intake',
  },

  description:
    "Our Summer School in France is a two-week immersive programme combining artistic courses, cultural activities, and language learning. Designed for international students aged 16 and above, the programme blends MJM's 45 years of creative expertise with the unique cultural richness of France.",
  images: [
    {
      src: '/universities/mjm-graphic-design/summer-school/mjm-paris-welcome.jpg',
      alt: 'Welcome to Paris',
      caption: 'Welcome to Paris',
    },
    {
      src: '/universities/mjm-graphic-design/summer-school/mjm-lille-welcome.jpg',
      alt: 'Welcome to Lille',
      caption: 'Welcome to Lille',
    },
    {
      src: '/universities/mjm-graphic-design/summer-school/mjm-accommodation-residence.jpg',
      alt: 'Accommodation',
      caption: 'Accommodation',
    },
  ],
  included: [
    'Full English teaching and activities',
    'Accommodation',
    'Creative workshops (theory & practice)',
    'Cultural immersion programme',
    'Language classes (French or English / E-learning)',
    'Cultural visits',
    'Student support & supervision',
    'Certificate of completion',
    'Transfert town to town during the Summer School',
  ],
  tracks: [
    {
      title: 'Creative Foundations & Studio Practice courses',
      details: [
        'Drawing & Illustration',
        'Colour & Composition',
        'Perspective & Volume',
        'Creative Expression & Mixed Media',
      ],
    },
    {
      title: 'Guided Cultural Experiences Lille & Paris',
      details: [
        'Louvre Museum',
        "Musée d'Orsay",
        'Grand Palais',
        'Eiffel Tower',
      ],
    },
    {
      title: 'Outdoor Creative Labs',
      details: [
        'Sketching along the canal',
        'photo challenges',
        'café drawing',
        'visual journaling',
      ],
    },
  ],
};
const AVAILABLE_LOW_QUALITY_BROCHURES = new Set([
  '/universities/estonian-entrepreneurship-university-of-applied-sciences/brochures/euas-english-booklet-business-it-design-low.pdf',
  '/universities/mjm-graphic-design/brochures/mjm-paris-london-international-programmes-low.pdf',
  '/universities/mjm-graphic-design/brochures/mjm-international-master-interior-architecture-eco-design-management-low.pdf',
  '/universities/mjm-graphic-design/brochures/mjm-summer-school-france-low.pdf',
]);

const resolveLowQualityPdf = (file = '', explicitLow = '') => {
  const normalizedExplicit = String(explicitLow || '').trim();
  if (normalizedExplicit) return normalizedExplicit;

  const normalizedFile = String(file || '').trim();
  if (!normalizedFile) return '';
  if (!/\.pdf$/i.test(normalizedFile)) return '';

  const derived = normalizedFile.replace(/\.pdf$/i, '-low.pdf');
  return AVAILABLE_LOW_QUALITY_BROCHURES.has(derived) ? derived : '';
};

const getCompressedDownloadName = (downloadName = '') => {
  const normalizedName = String(downloadName || '').trim();
  return normalizedName ? normalizedName.replace(/\.pdf$/i, '-compressed.pdf') : true;
};

function BrochureDownloadMenu({
  file,
  lowQualityFile,
  downloadName,
  title,
  buttonClassName,
  menuClassName = '',
  menuPlacementClass = 'top-[calc(100%+0.5rem)]',
  wrapperClassName = 'min-w-0 flex-1 sm:flex-[1_1_8.25rem]',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handlePointerDown = (event) => {
      if (!wrapperRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleFocusIn = (event) => {
      if (!wrapperRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('focusin', handleFocusIn);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('focusin', handleFocusIn);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  if (!file) return null;

  if (!lowQualityFile) {
    return (
      <a
        href={file}
        download={downloadName || true}
        aria-label={`Download ${title} brochure`}
        className={buttonClassName}
      >
        <Download className="h-4 w-4" />
        Download
      </a>
    );
  }

  return (
    <div
      ref={wrapperRef}
      className={`group/download relative ${wrapperClassName}`}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        type="button"
        aria-label={`Choose download quality for ${title}`}
        aria-expanded={isOpen}
        className={buttonClassName}
        onClick={() => setIsOpen((previous) => !previous)}
      >
        <Download className="h-4 w-4" />
        Download
        <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen ? (
        <div
          className={`absolute left-0 right-0 ${menuPlacementClass} z-30 overflow-hidden rounded-xl border border-border/70 bg-background/95 p-1.5 shadow-[0_18px_38px_rgba(15,23,42,0.16)] backdrop-blur dark:border-white/15 dark:bg-[#0F172A]/96 ${menuClassName}`}
        >
          <p className="px-3 pb-1.5 pt-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Select Download Quality
          </p>
          <a
            href={file}
            download={downloadName || true}
            onClick={() => setIsOpen(false)}
            className="flex items-start gap-2 rounded-lg px-3 py-2 text-left transition-colors hover:bg-muted/70 focus:bg-muted/70 focus:outline-none"
          >
            <FileText className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
            <span className="min-w-0">
              <span className="block text-sm font-semibold text-foreground">Original Quality</span>
              <span className="block text-xs leading-snug text-muted-foreground">Full-resolution brochure</span>
            </span>
          </a>
          <a
            href={lowQualityFile}
            download={getCompressedDownloadName(downloadName)}
            onClick={() => setIsOpen(false)}
            className="flex items-start gap-2 rounded-lg px-3 py-2 text-left transition-colors hover:bg-muted/70 focus:bg-muted/70 focus:outline-none"
          >
            <Download className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
            <span className="min-w-0">
              <span className="block text-sm font-semibold text-foreground">Compressed Version</span>
              <span className="block text-xs leading-snug text-muted-foreground">Smaller file for faster download</span>
            </span>
          </a>
        </div>
      ) : null}
    </div>
  );
}

const MJM_TRACK_CARD_THEME_CLASSES = [
  'border-[#D9D0F7] bg-[linear-gradient(145deg,rgba(255,243,236,0.95)_0%,rgba(247,242,255,0.96)_52%,rgba(236,245,255,0.95)_100%)] dark:border-[#4D3E82] dark:bg-[linear-gradient(145deg,rgba(29,23,56,0.82)_0%,rgba(25,20,48,0.88)_52%,rgba(22,25,44,0.84)_100%)]',
  'border-[#D3E0FF] bg-[linear-gradient(145deg,rgba(239,249,255,0.95)_0%,rgba(247,242,255,0.95)_56%,rgba(255,242,226,0.94)_100%)] dark:border-[#42557F] dark:bg-[linear-gradient(145deg,rgba(20,33,46,0.78)_0%,rgba(28,22,56,0.86)_55%,rgba(40,27,30,0.74)_100%)]',
  'border-[#F2D4DC] bg-[linear-gradient(145deg,rgba(255,240,244,0.94)_0%,rgba(243,243,255,0.96)_52%,rgba(255,246,225,0.95)_100%)] dark:border-[#5A4574] dark:bg-[linear-gradient(145deg,rgba(39,23,44,0.76)_0%,rgba(28,24,58,0.86)_55%,rgba(44,29,24,0.74)_100%)]',
];
const CATALOG_THEME_CLASSES = {
  euas: {
    shell:
      'border-[#CFE5D7] bg-[linear-gradient(135deg,rgba(239,250,244,0.94)_0%,rgba(246,249,255,0.94)_56%,rgba(255,249,231,0.88)_100%)] dark:border-[#31594A] dark:bg-[linear-gradient(135deg,rgba(14,35,31,0.9)_0%,rgba(15,23,42,0.96)_56%,rgba(44,37,18,0.82)_100%)]',
    accent: 'bg-[#0F7B61] text-white',
    text: 'text-[#0F7B61] dark:text-[#7EE2BC]',
    button:
      'border-[#0F7B61]/25 text-[#0F7B61] hover:bg-[#0F7B61] hover:text-white dark:border-[#7EE2BC]/30 dark:text-[#7EE2BC] dark:hover:bg-[#7EE2BC] dark:hover:text-[#06251D]',
  },
  mjmLondon: {
    shell:
      'border-[#F5B9B2] bg-[linear-gradient(135deg,rgba(255,239,235,0.96)_0%,rgba(255,246,237,0.9)_45%,rgba(243,247,255,0.94)_100%)] dark:border-[#7C3B46] dark:bg-[linear-gradient(135deg,rgba(56,22,28,0.9)_0%,rgba(45,28,22,0.84)_45%,rgba(18,24,42,0.94)_100%)]',
    accent: 'bg-[#E8521A] text-white',
    text: 'text-[#E8521A] dark:text-[#FFB199]',
    button:
      'border-[#E8521A]/25 text-[#E8521A] hover:bg-[#E8521A] hover:text-white dark:border-[#FFB199]/35 dark:text-[#FFB199] dark:hover:bg-[#FFB199] dark:hover:text-[#35140F]',
  },
  mjmEco: {
    shell:
      'border-[#BFDCC9] bg-[linear-gradient(135deg,rgba(239,250,243,0.96)_0%,rgba(246,245,255,0.92)_52%,rgba(255,247,235,0.9)_100%)] dark:border-[#3A6550] dark:bg-[linear-gradient(135deg,rgba(16,42,32,0.9)_0%,rgba(25,22,48,0.92)_52%,rgba(45,31,18,0.82)_100%)]',
    accent: 'bg-[#2E7D58] text-white',
    text: 'text-[#2E7D58] dark:text-[#8BE3B2]',
    button:
      'border-[#2E7D58]/25 text-[#2E7D58] hover:bg-[#2E7D58] hover:text-white dark:border-[#8BE3B2]/35 dark:text-[#8BE3B2] dark:hover:bg-[#8BE3B2] dark:hover:text-[#082719]',
  },
  mjmSummer: {
    shell:
      'border-[#D9D0F7] bg-[linear-gradient(135deg,rgba(248,244,255,0.96)_0%,rgba(255,242,232,0.9)_54%,rgba(239,247,255,0.92)_100%)] dark:border-[#584489] dark:bg-[linear-gradient(135deg,rgba(30,21,58,0.92)_0%,rgba(49,28,23,0.82)_54%,rgba(18,27,45,0.9)_100%)]',
    accent: 'bg-primary text-primary-foreground',
    text: 'text-primary',
    button:
      'border-primary/25 text-primary hover:bg-primary hover:text-primary-foreground dark:border-primary/40',
  },
  sguMedicine: {
    shell:
      'border-[#BBD9E8] bg-[linear-gradient(135deg,rgba(239,250,255,0.96)_0%,rgba(248,246,255,0.93)_52%,rgba(255,247,237,0.9)_100%)] dark:border-[#315B70] dark:bg-[linear-gradient(135deg,rgba(13,36,48,0.9)_0%,rgba(22,20,47,0.94)_52%,rgba(45,29,18,0.82)_100%)]',
    accent: 'bg-[#0A6378] text-white',
    text: 'text-[#0A6378] dark:text-[#8BDCF0]',
    button:
      'border-[#0A6378]/25 text-[#0A6378] hover:bg-[#0A6378] hover:text-white dark:border-[#8BDCF0]/35 dark:text-[#8BDCF0] dark:hover:bg-[#8BDCF0] dark:hover:text-[#08242D]',
    cover:
      'bg-[linear-gradient(145deg,rgba(10,99,120,0.16)_0%,rgba(45,27,105,0.1)_56%,rgba(232,82,26,0.12)_100%)] text-[#0A6378] dark:text-[#8BDCF0]',
    coverBadge:
      'border-[#0A6378]/20 bg-white/78 text-[#0A6378] shadow-[0_12px_24px_rgba(10,99,120,0.14)] dark:border-[#8BDCF0]/25 dark:bg-white/10 dark:text-[#8BDCF0]',
  },
  sguVeterinary: {
    shell:
      'border-[#C6DFC7] bg-[linear-gradient(135deg,rgba(241,250,242,0.96)_0%,rgba(247,246,255,0.93)_52%,rgba(255,247,238,0.9)_100%)] dark:border-[#3D6544] dark:bg-[linear-gradient(135deg,rgba(16,42,26,0.9)_0%,rgba(23,20,48,0.94)_52%,rgba(45,29,18,0.82)_100%)]',
    accent: 'bg-[#33743D] text-white',
    text: 'text-[#33743D] dark:text-[#A6E7AC]',
    button:
      'border-[#33743D]/25 text-[#33743D] hover:bg-[#33743D] hover:text-white dark:border-[#A6E7AC]/35 dark:text-[#A6E7AC] dark:hover:bg-[#A6E7AC] dark:hover:text-[#0E2712]',
    cover:
      'bg-[linear-gradient(145deg,rgba(51,116,61,0.16)_0%,rgba(45,27,105,0.1)_56%,rgba(232,82,26,0.12)_100%)] text-[#33743D] dark:text-[#A6E7AC]',
    coverBadge:
      'border-[#33743D]/20 bg-white/78 text-[#33743D] shadow-[0_12px_24px_rgba(51,116,61,0.14)] dark:border-[#A6E7AC]/25 dark:bg-white/10 dark:text-[#A6E7AC]',
  },
  default: {
    shell:
      'border-border/60 bg-[linear-gradient(135deg,rgba(255,255,255,0.94)_0%,rgba(246,248,251,0.94)_100%)] dark:bg-[linear-gradient(135deg,rgba(17,24,39,0.9)_0%,rgba(15,23,42,0.96)_100%)]',
    accent: 'bg-primary text-primary-foreground',
    text: 'text-primary',
    button:
      'border-primary/25 text-primary hover:bg-primary hover:text-primary-foreground dark:border-primary/40',
  },
};
const ICN_PREMIUM_SPOTLIGHT = {
  subtitle: 'ICN Official Profile',
  heading: 'ICN Creative Business School',
  description:
    'ICN combines creativity, technology, and management through its #ArtTechnologyManagement approach, with study pathways across Europe.',
  officialFacts: [
    'Triple-accredited business school in France',
    'Main campuses in Nancy and Paris La Defense, with Berlin campus coming soon',
    'Founded in 1905',
  ],
  accreditations: ['AACSB', 'AMBA', 'EQUIS', 'CEFDG'],
  pillars: [
    {
      key: 'art',
      title: 'Art',
      description:
        'Design thinking and creative expression are integrated into management learning and problem solving.',
    },
    {
      key: 'technology',
      title: 'Technology',
      description:
        'Digital tools and innovation methods are embedded across business programs and project work.',
    },
    {
      key: 'management',
      title: 'Management',
      description:
        'Students build strategic, entrepreneurial, and leadership capabilities for global careers.',
    },
  ],
  campuses: [
    {
      name: 'Nancy Campus',
      image: '/universities/icn-campuses/nancy-320.jpg',
      detail:
        'Located close to the city center, the Artem campus spans 97,000 m2 and supports a vibrant student environment.',
    },
    {
      name: 'Paris La Defense Campus',
      image: '/universities/icn-campuses/paris-la-defense-320.jpg',
      detail:
        'In the heart of La Defense, the campus connects students with major corporate headquarters and decision hubs.',
    },
    {
      name: 'Berlin Campus',
      image: '/universities/icn-campuses/berlin-320.png',
      status: 'Coming Soon',
      detail:
        'Berlin campus is coming soon. The Alt-Moabit location near Berlin Hauptbahnhof is planned as a modern 2,000 m2 learning environment.',
    },
  ],
};
const ICN_PILLAR_ICON_MAP = {
  art: Palette,
  technology: Cpu,
  management: Briefcase,
};
const EIT_INNOENERGY_SPOTLIGHT = {
  subtitle: 'EIT InnoEnergy Profile',
  heading: 'EIT InnoEnergy',
  description:
    'A mobility-based European master ecosystem focused on sustainable energy, delivered through partner universities and an integrated admissions platform.',
  quickFacts: [
    '5 flagship master programmes',
    'Pan-European institution network',
    'Application and programme discovery through a single admissions ecosystem',
  ],
  programs: [
    "Master's in Renewable Energy",
    "Master's in Sustainable Energy Systems",
    "Master's in Smart Electrical Networks and Systems",
    "Master's in Nuclear Energy",
    "Master's in Advanced Energy Systems and AI",
  ],
  partnerLogos: [
    { name: 'Grenoble INP', logo: '/universities/eit-innoenergy/partners/grenoble-inp.png' },
    {
      name: 'Ecole des Ponts ParisTech',
      logo: '/universities/eit-innoenergy/partners/ecole-des-ponts-paristech.png',
    },
    { name: 'Tecnico Lisboa (IST)', logo: '/universities/eit-innoenergy/partners/tecnico-lisboa-ist.png' },
    { name: 'Universite Paris Saclay', logo: '/universities/eit-innoenergy/partners/universite-paris-saclay.png' },
    { name: 'UPC Barcelona Tech', logo: '/universities/eit-innoenergy/partners/upc-barcelona-tech.png' },
    { name: 'KTH', logo: '/universities/eit-innoenergy/partners/kth.png' },
    { name: 'Aalto University', logo: '/universities/eit-innoenergy/partners/aalto-university.png' },
    { name: 'ESADE', logo: '/universities/eit-innoenergy/partners/esade-business-school.png' },
    { name: 'KU Leuven', logo: '/universities/eit-innoenergy/partners/ku-leuven.png' },
    { name: 'PSL', logo: '/universities/eit-innoenergy/partners/psl-university.png' },
    { name: 'AGH UST', logo: '/universities/eit-innoenergy/partners/agh-ust.png' },
    { name: 'Ecole Polytechnique', logo: '/universities/eit-innoenergy/partners/ecole-polytechnique.png' },
    { name: 'UnternehmerTUM', logo: '/universities/eit-innoenergy/partners/unternehmertum.png' },
    {
      name: 'Politecnico di Torino',
      logo: '/universities/eit-innoenergy/partners/politecnico-di-torino.png',
    },
    { name: 'TU/e Eindhoven', logo: '/universities/eit-innoenergy/partners/tue-eindhoven.png' },
  ],
};

export default function PortfolioDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [portfolio, setPortfolio] = useState(null);
  const [allPortfolios, setAllPortfolios] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [loadError, setLoadError] = useState('');
  const [reloadToken, setReloadToken] = useState(0);
  const [activeCatalogDetails, setActiveCatalogDetails] = useState(null);

  const mjmSpotlightRef = useRef(null);
  const catalogDocumentsRef = useRef(null);

  const mapUniversityToPortfolio = (data) => {
    if (!data || !data.university) return null;
    const university = data.university;
    const specializations = (data.specializations || [])
      .map((item) => item.title)
      .filter(Boolean);
    const highlights = (data.benefits || [])
      .map((item) => item.title)
      .filter(Boolean);
    const programs = data.programs || [];
    const experiences = (data.experiences || []).map((item) => ({
      name: item.student_name,
      program: item.program,
      quote: item.review,
      location: university.city || university.country,
      rating: Number(item.rating) || 5,
      photo: item.photo ? resolveMediaUrl(item.photo) : '',
    }));

    const mappedDetails = {
      location: [university.city, university.country].filter(Boolean).join(', '),
    };

    if (specializations.length > 0) {
      mappedDetails.specializations = specializations;
    }

    if (programs.length > 0) {
      mappedDetails.programs = programs;
    }

    if (experiences.length > 0) {
      mappedDetails.studentTestimonials = experiences;
    }

    const mapped = {
      id: university.id,
      slug: university.slug,
      title: university.name,
      country: university.country,
      image: resolveMediaUrl(university.logo),
      logo: resolveMediaUrl(university.logo),
      description: university.description,
      programs: programs.length || undefined,
      details: mappedDetails,
    };

    if (highlights.length > 0) {
      mapped.highlights = highlights;
    }

    return mapped;
  };

  const mergePortfolioData = (base, override) => {
    if (!base) return override;
    if (!override) return base;
    return {
      ...base,
      ...override,
      image: override.image || base.image,
      logo: override.logo || base.logo,
      highlights: override.highlights && override.highlights.length > 0 ? override.highlights : base.highlights,
      details: {
        ...(base.details || {}),
        ...(override.details || {}),
      },
    };
  };

  useEffect(() => {
    let isActive = true;
    const controller = new AbortController();

    const loadData = async () => {
      setIsLoading(true);
      setLoadError('');
      try {
        const localData = await getPortfolioById(id);
        const detailSlug = localData?.slug || id;
        let apiPortfolio = null;

        try {
          const apiData = await getUniversityDetail(detailSlug, { signal: controller.signal });
          apiPortfolio = mapUniversityToPortfolio(apiData);
        } catch (error) {
          if (error.name !== 'AbortError') {
            apiPortfolio = null;
          }
        }

        const merged = mergePortfolioData(localData, apiPortfolio);

        if (isActive) {
          setPortfolio(merged || apiPortfolio || localData);
          const all = await getPortfolios();
          setAllPortfolios(all.data || all);
        }
      } catch (error) {
        if (isActive) {
          if (import.meta.env.DEV) {
            console.warn('Portfolio detail load used local fallback only.');
          }
          setLoadError('');
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isActive = false;
      controller.abort();
    };
  }, [id, reloadToken]);

  const normalizedSlug = String(portfolio?.slug || '').toLowerCase();
  const normalizedTitle = String(portfolio?.title || '').toLowerCase();
  const isMjmGraphicDesignProfile =
    normalizedSlug === 'mjm-graphic-design' || normalizedTitle.includes('mjm graphic design');
  const isMjmSummerSchoolCardEnabled = true;
  const isEuasProfile =
    normalizedSlug === 'estonian-entrepreneurship-university-of-applied-sciences' ||
    normalizedTitle.includes('estonian entrepreneurship university of applied sciences') ||
    normalizedTitle.includes('euas');
  const isIcnBusinessSchoolProfile =
    normalizedSlug === 'icn-business-school' || normalizedTitle.includes('icn business school');
  const isEpitechProfile =
    normalizedSlug === 'epitech' || normalizedTitle.includes('epitech');
  const isEitInnoenergyProfile =
    normalizedSlug === 'eit-innoenergy' ||
    normalizedTitle.includes('eit innoenergy') ||
    normalizedTitle.includes('innoenergy masters');
  const usesDarkLogoBadge = isIcnBusinessSchoolProfile || isEpitechProfile;
  const catalogDocuments = Array.isArray(portfolio?.details?.catalogs)
    ? portfolio.details.catalogs
        .map((item) => {
          if (!item || typeof item !== 'object') return null;
          const title = String(item.title || '').trim();
          const file = String(item.file || '').trim();

          if (!title || !file) return null;

          return {
            ...item,
            title,
            file,
            eyebrow: String(item.eyebrow || '').trim(),
            description: String(item.description || '').trim(),
            imageAlt: String(item.imageAlt || title).trim(),
            secondaryImageAlt: String(item.secondaryImageAlt || '').trim(),
          };
        })
        .filter(Boolean)
        .filter((item) => {
          if (!isMjmGraphicDesignProfile) return true;

          const title = String(item?.title || '').toLowerCase();
          const file = String(item?.file || '').toLowerCase();
          const isSummerSchoolDocument =
            title.includes('summer school') || file.includes('summer-school');

          return !isSummerSchoolDocument;
        })
    : [];

  useScrollIntentCelebration({
    enabled: isMjmGraphicDesignProfile,
    targetRef: mjmSpotlightRef,
  });

  useScrollIntentCelebration({
    enabled: isEuasProfile && catalogDocuments.length > 0,
    targetRef: catalogDocumentsRef,
  });

  useEffect(() => {
    if (!activeCatalogDetails || typeof document === 'undefined') return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setActiveCatalogDetails(null);
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleEscape);
    };
  }, [activeCatalogDetails]);

  if (isLoading) {
    return (
      <div className="pt-20 min-h-screen">
        <Seo
          title="Institution Profile"
          description="Loading institution profile and partnership details."
          path={`/portfolio/${id || ''}`}
        />
        <div className="w-12 h-12 border-4 border-muted border-t-primary rounded-full animate-spin" />

        <DetailSkeleton />

      </div>
    );
  }

  if (!portfolio) {
    return (
      <div className="pt-20 min-h-screen flex flex-col items-center justify-center">
        <Seo
          title="Portfolio Not Found"
          description="The requested institution profile could not be found."
          path={`/portfolio/${id || ''}`}
          noindex
        />
        <h1 className="text-4xl font-bold mb-4">Portfolio Not Found</h1>
        {loadError ? (
          <p className="mb-4 max-w-xl px-4 text-center text-muted-foreground">{loadError}</p>
        ) : null}
        {loadError ? (
          <button
            type="button"
            onClick={() => {
              setIsLoading(true);
              setReloadToken((prev) => prev + 1);
            }}
            className="mb-4 rounded-lg bg-primary px-5 py-2.5 font-semibold text-primary-foreground transition-colors hover:bg-secondary"
          >
            Retry
          </button>
        ) : null}
        <BackNavButton label="Back to Portfolio" onClick={() => navigate('/portfolio')} />
      </div>
    );
  }

  // Get related portfolios
  const relatedPortfolios = allPortfolios
    .filter(p => p.id !== portfolio.id && p.category === portfolio.category)
    .slice(0, 3);
  const recognitionLabel = 'Ranking';
  const tuitionLabel = 'Average Tuition';
  const intakeLabel = 'Intakes';
  const durationLabel = 'Typical Duration';
  const campusLabel = 'Campus';
  const specializationsTitle = 'Specializations';
  const programmeInfoTitle = 'Program Information';
  const hasScholarshipInfo = typeof portfolio.details?.scholarshipAvailable === 'boolean';
  const hasProgramsByLevel =
    Array.isArray(portfolio.details?.programsByLevel) && portfolio.details.programsByLevel.length > 0;
  const hasTuitionBreakdown =
    Array.isArray(portfolio.details?.tuitionBreakdown) && portfolio.details.tuitionBreakdown.length > 0;
  const portfolioPath = `/portfolio/${portfolio.slug || portfolio.id || id || ''}`;
  const portfolioDescription = trimDescription(
    portfolio.description ||
      `Explore ${portfolio.title} and discover institution profile details, programs, and partnership highlights.`,
    165
  );
  const portfolioSpecializations = Array.isArray(portfolio.details?.specializations)
    ? portfolio.details.specializations.filter(Boolean)
    : [];
  const seoKeywords = [
    'university profile',
    'study abroad advisor',
    'international student recruitment',
    'partner institution',
    portfolio.title,
    portfolio.country,
    ...portfolioSpecializations,
    ...catalogDocuments.map((catalog) => catalog.title).filter(Boolean),
  ].filter(Boolean);
  const tgaOrganizationSchema = {
    '@type': 'Organization',
    name: SITE_CONFIG.company.name,
    url: SITE_URL,
    logo: toAbsoluteUrl(SITE_CONFIG.company.logo.lightSrc),
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'Admissions and partnership enquiries',
        telephone: SITE_CONFIG.contact.phone?.[0],
        email: SITE_CONFIG.contact.email?.general,
        areaServed: ['IN', portfolio.country].filter(Boolean),
        availableLanguage: ['English', 'Hindi'],
      },
    ],
  };
  const portfolioProgramItems = portfolioSpecializations.map((program, index) => ({
    '@type': 'Offer',
    position: index + 1,
    itemOffered: {
      '@type': 'Course',
      name: program,
      provider: {
        '@type': 'EducationalOrganization',
        name: portfolio.title,
      },
    },
  }));
  const catalogDocumentSchema = catalogDocuments.map((catalog) => ({
    '@type': 'DigitalDocument',
    name: catalog.title,
    description: catalog.description || undefined,
    encodingFormat: 'application/pdf',
    url: toAbsoluteUrl(catalog.file),
    inLanguage: 'en',
    about: {
      '@type': 'EducationalOrganization',
      name: portfolio.title,
    },
  }));
  const catalogDocumentListSchema =
    catalogDocuments.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: `${portfolio.title} program documents`,
          itemListElement: catalogDocuments.map((catalog, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: catalog.title,
            url: toAbsoluteUrl(catalog.file),
            description: catalog.description || undefined,
          })),
        }
      : null;
  const portfolioSchema = [
    {
      '@context': 'https://schema.org',
      '@type': 'EducationalOrganization',
      name: portfolio.title,
      description: portfolioDescription,
      url: `${SITE_URL}${portfolioPath}`,
      image: toAbsoluteUrl(portfolio.image || portfolio.logo || '/videos/hero-poster.jpg'),
      logo: portfolio.logo ? toAbsoluteUrl(portfolio.logo) : undefined,
      address: portfolio.details?.location || portfolio.country || undefined,
      areaServed: portfolio.country || undefined,
      hasOfferCatalog: portfolioProgramItems.length
        ? {
            '@type': 'OfferCatalog',
            name: `${portfolio.title} program pathways`,
            itemListElement: portfolioProgramItems,
          }
        : undefined,
      subjectOf: catalogDocumentSchema.length ? catalogDocumentSchema : undefined,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: `${portfolio.title} | The Global Avenues`,
      description: portfolioDescription,
      url: `${SITE_URL}${portfolioPath}`,
      image: toAbsoluteUrl(portfolio.image || portfolio.logo || '/videos/hero-poster.jpg'),
      isPartOf: {
        '@type': 'WebSite',
        name: SITE_CONFIG.company.name,
        url: SITE_URL,
      },
      about: {
        '@type': 'EducationalOrganization',
        name: portfolio.title,
        address: portfolio.details?.location || portfolio.country || undefined,
      },
      provider: tgaOrganizationSchema,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: `${portfolio.title} study abroad guidance`,
      description: `Application guidance, document support, and student advisory for ${portfolio.title}.`,
      provider: tgaOrganizationSchema,
      areaServed: portfolio.country || undefined,
      serviceType: 'Study abroad admissions guidance',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: `${SITE_URL}/`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Portfolio',
          item: `${SITE_URL}/portfolio`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: portfolio.title,
          item: `${SITE_URL}${portfolioPath}`,
        },
      ],
    },
    ...(catalogDocumentListSchema ? [catalogDocumentListSchema] : []),
  ];

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
    <div className="pt-20 min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Seo
        title={portfolio.title}
        description={portfolioDescription}
        path={portfolioPath}
        image={portfolio.image || portfolio.logo || '/videos/hero-poster.jpg'}
        keywords={seoKeywords}
        jsonLd={portfolioSchema}
      />
      {/* Back Button */}
      <motion.div
        className="sticky top-16 z-40 border-b border-border/70 bg-background/70 px-4 py-2 backdrop-blur-xl supports-[backdrop-filter]:bg-background/55 sm:px-6 lg:px-8"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="max-w-7xl mx-auto">
          <BackNavButton label="Back to Portfolio" onClick={() => navigate('/portfolio')} />
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Content */}
        <motion.div
          className={`grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16 ${isIcnBusinessSchoolProfile ? 'lg:items-stretch' : ''}`}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Image Section */}
          <motion.div
            className="lg:col-span-2"
            variants={itemVariants}
          >
            <div
              className={`relative h-96 overflow-hidden rounded-2xl sm:h-[500px] ${
                isIcnBusinessSchoolProfile
                  ? 'border border-[#F59E0B]/35 bg-[radial-gradient(circle_at_25%_15%,rgba(245,158,11,0.26)_0%,rgba(14,23,47,0.08)_42%,rgba(9,13,30,0.58)_100%)] shadow-[0_30px_80px_rgba(16,20,41,0.24)] dark:border-[#F59E0B]/25 dark:bg-[radial-gradient(circle_at_25%_15%,rgba(245,158,11,0.2)_0%,rgba(17,24,39,0.7)_52%,rgba(2,6,23,0.92)_100%)]'
                  : 'bg-gradient-to-br from-primary/20 to-secondary/20'
              }`}
            >
              <motion.img
                src={portfolio.image}
                alt={portfolio.partnerName || portfolio.title}
                loading="lazy"
                decoding="async"
                className={`h-full w-full ${
                  isEpitechProfile ? 'object-contain bg-[#E5E5E5] p-6' : 'object-cover'
                }`}
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6 }}
              />
              {isIcnBusinessSchoolProfile && (
                <>
                  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(140deg,rgba(8,14,32,0.18)_0%,rgba(8,14,32,0.48)_38%,rgba(8,14,32,0.84)_100%)]" />
                  <div className="pointer-events-none absolute -left-20 -top-20 h-52 w-52 rounded-full bg-[#F59E0B]/30 blur-3xl" />
                  <div className="pointer-events-none absolute -bottom-16 right-16 h-44 w-44 rounded-full bg-[#FB923C]/22 blur-3xl" />
                </>
              )}

              {portfolio.logo && (
                <motion.div
                  className={`absolute top-6 right-6 rounded-xl p-2 shadow-lg ${
                    usesDarkLogoBadge
                      ? 'border border-white/30 bg-black/45 backdrop-blur-md'
                      : 'border border-white/35 bg-white/95'
                  }`}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.15 }}
                >
                  <img
                    src={portfolio.logo}
                    alt={`${portfolio.title} logo`}
                    loading="lazy"
                    decoding="async"
                    className={`h-10 w-auto object-contain ${
                      usesDarkLogoBadge
                        ? 'max-w-[10rem] brightness-110'
                        : isEitInnoenergyProfile
                          ? 'max-w-[11rem]'
                          : 'max-w-[8.5rem]'
                    }`}
                  />
                </motion.div>
              )}

              {/* Achievement Badge */}
              {portfolio.achievement && (
                <motion.div
                  className="absolute top-6 left-6 px-4 py-2 bg-primary/95 text-primary-foreground rounded-lg font-bold"
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  {portfolio.achievement}
                </motion.div>
              )}

              {isIcnBusinessSchoolProfile && (
                <motion.div
                  className="absolute bottom-6 left-6 flex flex-wrap gap-2"
                  initial={{ x: -12, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.45, delay: 0.2 }}
                >
                  <span className="inline-flex items-center gap-1 rounded-full border border-white/35 bg-black/45 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-white backdrop-blur-sm">
                    <BadgeCheck className="h-3.5 w-3.5 text-[#FCD34D]" />
                    Triple Accredited
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full border border-white/30 bg-black/40 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-white backdrop-blur-sm">
                    <Building2 className="h-3.5 w-3.5 text-[#FDBA74]" />
                    Nancy | Paris | Berlin
                  </span>
                </motion.div>
              )}

              {/* Country Badge */}
              <motion.div
                className="absolute bottom-6 right-6 px-4 py-2 bg-accent/95 text-accent-foreground rounded-lg font-bold flex items-center gap-2"
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <MapPin className="w-4 h-4" />
                {portfolio.country}
              </motion.div>
            </div>
          </motion.div>

          {/* Info Cards */}
          <motion.div
            className="space-y-4"
            variants={itemVariants}
          >
            {/* University Title */}
            <div
              className={`rounded-xl border p-6 backdrop-blur-sm ${
                isIcnBusinessSchoolProfile
                  ? 'border-[#F59E0B]/35 bg-[linear-gradient(145deg,rgba(255,247,230,0.94)_0%,rgba(255,236,209,0.9)_40%,rgba(255,255,255,0.95)_100%)] dark:border-[#F59E0B]/25 dark:bg-[linear-gradient(145deg,rgba(40,26,10,0.75)_0%,rgba(22,23,34,0.92)_56%,rgba(17,24,39,0.88)_100%)]'
                  : 'border-primary/30 bg-gradient-to-br from-primary/10 to-secondary/10'
              }`}
            >
              <p className="text-muted-foreground text-sm font-medium mb-2">Institution</p>
              <h1 className="text-3xl font-bold text-foreground mb-2">{portfolio.title}</h1>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Globe className="w-4 h-4" />
                <span>{portfolio.country}</span>
              </div>
              {isIcnBusinessSchoolProfile && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {ICN_PREMIUM_SPOTLIGHT.accreditations.map((badge) => (
                    <span
                      key={badge}
                      className="inline-flex items-center rounded-full border border-[#F59E0B]/40 bg-[#FFF4E5]/90 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.11em] text-[#9A4D00] dark:border-[#F59E0B]/35 dark:bg-white/10 dark:text-[#FCD34D]"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Location & Ranking */}
            <motion.div
              className={`rounded-xl border p-6 ${
                isIcnBusinessSchoolProfile
                  ? 'border-[#F59E0B]/25 bg-[linear-gradient(140deg,rgba(255,246,233,0.92)_0%,rgba(255,255,255,0.95)_100%)] dark:border-[#F59E0B]/20 dark:bg-[linear-gradient(140deg,rgba(31,27,20,0.8)_0%,rgba(16,21,34,0.9)_100%)]'
                  : 'border-border/50 bg-muted/40'
              }`}
              whileHover={{ translateY: -4 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    <p className="text-muted-foreground text-sm font-medium">Location</p>
                  </div>
                  <p className="text-lg font-bold text-foreground">{portfolio.details?.location}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Trophy className="w-4 h-4 text-secondary" />
                    <p className="text-muted-foreground text-sm font-medium">{recognitionLabel}</p>
                  </div>
                  <p className="text-lg font-bold text-foreground">{portfolio.details?.ranking}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Description Section */}
        <motion.div
          className={`rounded-2xl border p-8 mb-16 ${
            isIcnBusinessSchoolProfile
              ? 'border-[#F59E0B]/25 bg-[linear-gradient(145deg,rgba(255,250,242,0.94)_0%,rgba(255,242,222,0.86)_36%,rgba(255,255,255,0.95)_100%)] dark:border-[#F59E0B]/20 dark:bg-[linear-gradient(145deg,rgba(36,31,24,0.74)_0%,rgba(18,23,37,0.9)_56%,rgba(13,18,30,0.86)_100%)]'
              : 'border-border/50 bg-muted/20'
          }`}
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-foreground mb-6">
            {isIcnBusinessSchoolProfile
              ? 'Why ICN Business School Stands Out'
              : 'About This University'}
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed mb-6">
            {portfolio.description}
          </p>
          {isIcnBusinessSchoolProfile && (
            <div className="mb-6 flex flex-wrap gap-2.5">
              {ICN_PREMIUM_SPOTLIGHT.officialFacts.map((fact) => (
                <span
                  key={fact}
                  className="inline-flex items-center rounded-full border border-[#F59E0B]/35 bg-white/80 px-3 py-1 text-xs font-semibold text-[#9A4D00] dark:border-[#F59E0B]/30 dark:bg-white/10 dark:text-[#FCD34D]"
                >
                  {fact}
                </span>
              ))}
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-border/50">
            <div>
              <h4 className="font-bold text-foreground mb-2">{specializationsTitle}</h4>
              {hasProgramsByLevel ? (
                <div className="space-y-4">
                  {portfolio.details.programsByLevel.map((group) => (
                    <div key={group.level}>
                      <p className="text-sm font-semibold text-primary mb-1.5">{group.level}</p>
                      <ul className="space-y-2">
                        {group.items.map((item) => (
                          <li key={item} className="text-muted-foreground flex items-center gap-2">
                            <div className="w-2 h-2 bg-primary rounded-full"></div>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ) : (
                <ul className="space-y-2">
                  {portfolio.details?.specializations?.map((spec) => (
                    <li key={spec} className="text-muted-foreground flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      {spec}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div>
              <h4 className="font-bold text-foreground mb-2">{programmeInfoTitle}</h4>
              <div className="space-y-2 text-muted-foreground">
                {hasTuitionBreakdown ? (
                  <div>
                    <p className="font-semibold text-foreground mb-1.5">{tuitionLabel}</p>
                    <dl className="space-y-1.5 rounded-lg border border-border/50 bg-muted/20 p-3">
                      {portfolio.details.tuitionBreakdown.map((fee) => (
                        <div key={fee.label} className="flex items-baseline justify-between gap-4 text-sm">
                          <dt className="text-muted-foreground">{fee.label}</dt>
                          <dd className="font-semibold text-foreground text-right whitespace-nowrap">{fee.amount}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                ) : (
                  <p><span className="font-semibold">{tuitionLabel}:</span> {portfolio.details?.avgTuition}</p>
                )}
                {hasScholarshipInfo && (
                  <p>
                    <span className="font-semibold">Scholarships:</span>{' '}
                    {portfolio.details.scholarshipAvailable ? 'Available' : 'Not Available'}
                  </p>
                )}
                {portfolio.details?.intakeWindows && (
                  <p className="flex items-start gap-2">
                    <CalendarDays className="w-4 h-4 mt-0.5 text-primary" />
                    <span><span className="font-semibold">{intakeLabel}:</span> {portfolio.details.intakeWindows}</span>
                  </p>
                )}
                {portfolio.details?.programDuration && (
                  <p className="flex items-start gap-2">
                    <Clock3 className="w-4 h-4 mt-0.5 text-primary" />
                    <span><span className="font-semibold">{durationLabel}:</span> {portfolio.details.programDuration}</span>
                  </p>
                )}
                {Array.isArray(portfolio.details?.campusLocations) &&
                  portfolio.details.campusLocations.length > 0 && (
                    <p>
                      <span className="font-semibold">{campusLabel}:</span>{' '}
                      {portfolio.details.campusLocations.join(', ')}
                    </p>
                  )}
              </div>
            </div>
          </div>
        </motion.div>

        {isEitInnoenergyProfile && (
          <motion.div
            className="relative mb-16 overflow-hidden rounded-3xl border border-[#C8E2FF] bg-[linear-gradient(118deg,#EDF6FF_0%,#E8F3FF_32%,#F3FAFF_62%,#FFF4E8_100%)] p-6 shadow-[0_28px_70px_rgba(16,24,40,0.14)] dark:border-[#2D4B75] dark:bg-[linear-gradient(118deg,#16233A_0%,#132A42_38%,#10283D_68%,#2A1E19_100%)] sm:p-8"
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-sky-300/30 blur-3xl dark:bg-sky-400/20" />
            <div className="pointer-events-none absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-amber-300/25 blur-3xl dark:bg-amber-500/15" />

            <div className="relative z-10">
              <div className="mb-5 flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-300/70 bg-white/85 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-[#0B4D8F] shadow-[0_8px_20px_rgba(12,74,140,0.12)] dark:border-sky-300/35 dark:bg-white/10 dark:text-sky-200">
                  <BadgeCheck className="h-3.5 w-3.5" />
                  {EIT_INNOENERGY_SPOTLIGHT.subtitle}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-background/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-foreground">
                  <GraduationCap className="h-3.5 w-3.5" />
                  Sustainable Energy Masters
                </span>
              </div>

              <h3 className="text-3xl font-bold leading-tight text-foreground sm:text-4xl">
                {EIT_INNOENERGY_SPOTLIGHT.heading}
              </h3>
              <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground">
                {EIT_INNOENERGY_SPOTLIGHT.description}
              </p>

              <div className="mt-4 flex flex-wrap gap-2.5">
                {EIT_INNOENERGY_SPOTLIGHT.quickFacts.map((fact) => (
                  <span
                    key={fact}
                    className="inline-flex items-center rounded-full border border-sky-300/45 bg-white/85 px-3 py-1 text-xs font-semibold text-[#104E85] dark:border-sky-300/30 dark:bg-white/10 dark:text-sky-100"
                  >
                    {fact}
                  </span>
                ))}
              </div>

              <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[0.9fr_1.1fr]">
                <div className="rounded-2xl border border-sky-200/70 bg-white/80 p-5 shadow-[0_12px_28px_rgba(15,23,42,0.08)] dark:border-sky-300/20 dark:bg-white/5">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    Programmes
                  </p>
                  <div className="mt-3 space-y-2.5">
                    {EIT_INNOENERGY_SPOTLIGHT.programs.map((program, index) => (
                      <article
                        key={program}
                        className="rounded-xl border border-sky-100 bg-white/95 px-3 py-2.5 dark:border-sky-300/15 dark:bg-white/5"
                      >
                        <p className="text-sm font-semibold text-foreground">
                          {index + 1}. {program}
                        </p>
                      </article>
                    ))}
                  </div>
                  <div className="mt-5 rounded-xl border border-sky-200/80 bg-white/90 p-3.5 dark:border-sky-300/20 dark:bg-white/5">
                    <Link
                      to="/collaborate"
                      className="inline-flex items-center gap-2 rounded-xl bg-[linear-gradient(95deg,#0B4D8F_0%,#1D6FD0_52%,#F59E0B_100%)] px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:brightness-110"
                    >
                      Connect With Our Team
                    </Link>
                  </div>
                </div>

                <div className="rounded-2xl border border-sky-200/70 bg-[linear-gradient(140deg,rgba(255,255,255,0.92)_0%,rgba(240,248,255,0.95)_100%)] p-5 shadow-[0_16px_30px_rgba(15,23,42,0.08)] dark:border-sky-300/20 dark:bg-[linear-gradient(140deg,rgba(18,34,55,0.86)_0%,rgba(16,28,46,0.92)_100%)]">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4.5 w-4.5 text-primary" />
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      Partner Institutions
                    </p>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {EIT_INNOENERGY_SPOTLIGHT.partnerLogos.map((partner) => (
                      <article
                        key={partner.name}
                        className="flex h-20 items-center justify-center rounded-xl border border-sky-100 bg-white/95 p-2.5 transition-transform duration-200 hover:-translate-y-0.5 dark:border-sky-300/15 dark:bg-white/5"
                        title={partner.name}
                      >
                        <img
                          src={partner.logo}
                          alt={`${partner.name} logo`}
                          loading="lazy"
                          decoding="async"
                          className="max-h-10 w-auto object-contain"
                        />
                      </article>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {isIcnBusinessSchoolProfile && (
          <motion.div
            className="relative mb-16 overflow-hidden rounded-3xl border border-[#F59E0B]/35 bg-[linear-gradient(132deg,#FFF3E0_0%,#FFE3C2_35%,#F9FAFB_72%,#FFF7ED_100%)] p-6 shadow-[0_28px_70px_rgba(17,24,39,0.2)] dark:border-[#F59E0B]/20 dark:bg-[linear-gradient(132deg,#2D1E12_0%,#1C1E2C_42%,#111827_76%,#261A10_100%)] sm:p-8"
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div className="pointer-events-none absolute -left-20 -top-20 h-56 w-56 rounded-full bg-[#F59E0B]/28 blur-3xl" />
            <div className="pointer-events-none absolute -right-16 -bottom-16 h-56 w-56 rounded-full bg-[#FB923C]/22 blur-3xl" />

            <div className="relative z-10">
              <div className="mb-4 flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#F59E0B]/45 bg-white/80 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-[#9A4D00] shadow-[0_10px_22px_rgba(154,77,0,0.16)] dark:border-[#F59E0B]/35 dark:bg-white/10 dark:text-[#FCD34D]">
                  <BadgeCheck className="h-3.5 w-3.5" />
                  {ICN_PREMIUM_SPOTLIGHT.subtitle}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-background/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-foreground">
                  <GraduationCap className="h-3.5 w-3.5" />
                  ICN Signature Experience
                </span>
              </div>

              <h3 className="text-3xl font-bold leading-tight text-foreground sm:text-4xl">
                {ICN_PREMIUM_SPOTLIGHT.heading}
              </h3>
              <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground">
                {ICN_PREMIUM_SPOTLIGHT.description}
              </p>

              <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1.12fr_0.88fr]">
                <div className="space-y-3.5">
                  {ICN_PREMIUM_SPOTLIGHT.pillars.map((pillar) => {
                    const PillarIcon = ICN_PILLAR_ICON_MAP[pillar.key] || Star;
                    return (
                      <article
                        key={pillar.key}
                        className="rounded-2xl border border-[#F59E0B]/30 bg-[linear-gradient(145deg,rgba(255,255,255,0.85)_0%,rgba(255,246,232,0.86)_100%)] p-4 shadow-[0_14px_30px_rgba(20,24,40,0.08)] dark:border-[#F59E0B]/25 dark:bg-[linear-gradient(145deg,rgba(39,28,18,0.74)_0%,rgba(19,24,36,0.9)_100%)]"
                      >
                        <div className="flex items-start gap-3">
                          <span className="mt-0.5 inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border border-[#F59E0B]/35 bg-white/70 dark:bg-white/10">
                            <PillarIcon className="h-4.5 w-4.5 text-[#C2410C] dark:text-[#FDBA74]" />
                          </span>
                          <div>
                            <p className="text-base font-semibold text-foreground">{pillar.title}</p>
                            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{pillar.description}</p>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>

                <div className="rounded-2xl border border-[#F59E0B]/30 bg-[linear-gradient(145deg,rgba(255,249,236,0.9)_0%,rgba(255,255,255,0.95)_100%)] p-5 shadow-[0_16px_32px_rgba(20,24,40,0.08)] dark:border-[#F59E0B]/25 dark:bg-[linear-gradient(145deg,rgba(45,29,16,0.72)_0%,rgba(17,23,35,0.92)_100%)]">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    Trust Markers
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {ICN_PREMIUM_SPOTLIGHT.accreditations.map((badge) => (
                      <span
                        key={badge}
                        className="inline-flex items-center rounded-full border border-[#F59E0B]/35 bg-white px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#9A4D00] dark:border-[#F59E0B]/30 dark:bg-white/10 dark:text-[#FCD34D]"
                      >
                        {badge}
                      </span>
                    ))}
                  </div>

                  <div className="mt-5 space-y-2 text-sm text-muted-foreground">
                    <p className="flex items-start gap-2">
                      <Building2 className="mt-0.5 h-4 w-4 text-primary" />
                      <span>Main campuses are in Nancy and Paris La Defense, with Berlin campus coming soon.</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <BadgeCheck className="mt-0.5 h-4 w-4 text-primary" />
                      <span>Aligned with ICN&apos;s official positioning as a triple-accredited business school.</span>
                    </p>
                  </div>

                  <div className="mt-5">
                    <Link
                      to="/collaborate"
                      className="inline-flex items-center gap-2 rounded-xl bg-[linear-gradient(95deg,#9A3412_0%,#EA580C_55%,#F59E0B_100%)] px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:brightness-110"
                    >
                      Contact Our Team
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Campus Spotlight
                </p>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  {ICN_PREMIUM_SPOTLIGHT.campuses.map((campus, index) => (
                    <article
                      key={campus.name}
                      className="group overflow-hidden rounded-2xl border border-[#F59E0B]/30 bg-white/80 shadow-[0_14px_30px_rgba(16,24,40,0.08)] dark:border-[#F59E0B]/20 dark:bg-white/5"
                    >
                      <div className="relative h-44 overflow-hidden">
                        <img
                          src={campus.image}
                          alt={`${campus.name} at ICN Business School`}
                          loading="eager"
                          fetchPriority={index === 0 ? 'high' : 'auto'}
                          decoding="async"
                          width="320"
                          height="240"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0)_34%,rgba(15,23,42,0.7)_100%)]" />
                        {campus.status && (
                          <span className="absolute right-3 top-3 rounded-full border border-white/35 bg-black/55 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#FCD34D] backdrop-blur-sm">
                            {campus.status}
                          </span>
                        )}
                        <p className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-black/45 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                          <MapPin className="h-3.5 w-3.5 text-[#FDBA74]" />
                          {campus.name}
                        </p>
                      </div>
                      <div className="p-4">
                        <p className="text-sm leading-relaxed text-muted-foreground">{campus.detail}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {isMjmGraphicDesignProfile && isMjmSummerSchoolCardEnabled && (
          <motion.div
            ref={mjmSpotlightRef}
            className="relative mb-12 overflow-hidden rounded-2xl border border-[#D8D2E8] bg-[linear-gradient(132deg,#FFF7ED_0%,#F8FAFC_36%,#EEF6F3_72%,#FFF2E5_100%)] p-4 shadow-[0_22px_52px_rgba(17,24,39,0.14)] dark:border-[#374151] dark:bg-[linear-gradient(132deg,#171923_0%,#111827_45%,#16221F_100%)] sm:p-5 lg:p-6"
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div
              className="pointer-events-none absolute -left-12 -top-12 h-40 w-40 rounded-full bg-[#F59E0B]/15 blur-3xl dark:bg-[#F59E0B]/20"
              animate={{ scale: [1, 1.12, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              className="pointer-events-none absolute -bottom-14 -right-12 h-52 w-52 rounded-full bg-[#0F766E]/14 blur-3xl dark:bg-[#14B8A6]/18"
              animate={{ scale: [1.06, 1, 1.06], opacity: [0.62, 0.92, 0.62] }}
              transition={{ duration: 5.8, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
            />
            <div className="relative z-10">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex rounded-full border border-[#EF7C42]/35 bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#9A3412] dark:border-[#F59E0B]/25 dark:bg-white/10 dark:text-[#FED7AA]">
                    MJM Graphic Design
                  </span>
                  <span className="inline-flex rounded-full border border-[#0F766E]/25 bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#0F766E] dark:border-[#5EEAD4]/25 dark:bg-white/10 dark:text-[#99F6E4]">
                    France Summer School
                  </span>
                </div>
                <span className="summer-hot-blink-btn inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em]">
                  Limited Intake
                </span>
              </div>

              <div className="grid grid-cols-1 gap-5 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
                <motion.div className="space-y-3" whileHover={{ y: -3 }} transition={{ duration: 0.25 }}>
                  <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-white/70 bg-black/10 shadow-[0_14px_34px_rgba(15,23,42,0.16)] dark:border-white/10">
                    <img
                      src={MJM_SUMMER_SCHOOL_HIGHLIGHT.images[0].src}
                      alt={MJM_SUMMER_SCHOOL_HIGHLIGHT.images[0].alt}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition-transform duration-700 ease-out hover:scale-105"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0)_45%,rgba(15,23,42,0.62)_100%)]" />
                    <p className="absolute bottom-3 left-3 inline-flex rounded-full bg-black/45 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                      {MJM_SUMMER_SCHOOL_HIGHLIGHT.images[0].caption}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {MJM_SUMMER_SCHOOL_HIGHLIGHT.images.slice(1).map((image) => (
                      <div
                        key={image.src}
                        className="relative aspect-[4/3] overflow-hidden rounded-xl border border-white/70 bg-black/10 dark:border-white/10"
                      >
                        <img
                          src={image.src}
                          alt={image.alt}
                          loading="lazy"
                          decoding="async"
                          className="h-full w-full object-cover transition-transform duration-700 ease-out hover:scale-105"
                        />
                        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0)_48%,rgba(15,23,42,0.58)_100%)]" />
                        <p className="absolute bottom-2 left-2 rounded-full bg-black/45 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
                          {image.caption}
                        </p>
                      </div>
                    ))}
                  </div>
                </motion.div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    International Creative Immersion
                  </p>
                  <h3 className="mt-2 text-2xl font-bold leading-tight text-foreground sm:text-3xl">
                    {MJM_SUMMER_SCHOOL_HIGHLIGHT.title} | {MJM_SUMMER_SCHOOL_HIGHLIGHT.city}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                    {MJM_SUMMER_SCHOOL_HIGHLIGHT.description}
                  </p>


                  <div className="mt-6 rounded-2xl border border-[#D8CDEE] bg-[linear-gradient(145deg,rgba(255,255,255,0.82)_0%,rgba(247,243,255,0.88)_54%,rgba(255,236,224,0.82)_100%)] p-5 shadow-[0_14px_34px_rgba(25,18,53,0.08)] dark:border-[#443A6E] dark:bg-[linear-gradient(145deg,rgba(28,22,52,0.84)_0%,rgba(18,15,37,0.9)_54%,rgba(30,23,42,0.82)_100%)]">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      Featured Program
                    </p>
                    <h4 className="mt-2 text-2xl font-semibold text-foreground">
                      {MJM_SUMMER_SCHOOL_HIGHLIGHT.featuredProgram.title}
                    </h4>
                    <div className="mt-4 space-y-2.5 text-sm text-muted-foreground">
                      <div className="flex items-start gap-2.5">
                        <span className="font-semibold text-foreground">Course Fees:</span>
                        <span>{MJM_SUMMER_SCHOOL_HIGHLIGHT.featuredProgram.fee}</span>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <span className="font-semibold text-foreground">Deadline to Apply:</span>
                        <span>{MJM_SUMMER_SCHOOL_HIGHLIGHT.featuredProgram.deadline}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                    {[
                      {
                        label: 'Destinations',
                        value: MJM_SUMMER_SCHOOL_HIGHLIGHT.city,
                        icon: Globe,
                      },
                      {
                        label: 'Dates',
                        value: MJM_SUMMER_SCHOOL_HIGHLIGHT.dates,
                        icon: CalendarDays,
                      },
                      {
                        label: 'Duration',
                        value: MJM_SUMMER_SCHOOL_HIGHLIGHT.duration,
                        icon: Clock3,
                      },
                      {
                        label: 'Class Size',
                        value: MJM_SUMMER_SCHOOL_HIGHLIGHT.classSize,
                        icon: Trophy,
                      },
                      {
                        label: 'Minimum Age',
                        value: MJM_SUMMER_SCHOOL_HIGHLIGHT.age,
                        icon: Star,
                      },
                      {
                        label: 'Study Mode',
                        value: MJM_SUMMER_SCHOOL_HIGHLIGHT.mode,
                        icon: GraduationCap,
                      },
                      {
                        label: 'Programme Hours',
                        value: MJM_SUMMER_SCHOOL_HIGHLIGHT.hours,
                        icon: Clock3,
                      },
                      {
                        label: 'Tuition Package',
                        value: MJM_SUMMER_SCHOOL_HIGHLIGHT.fee,
                        icon: Briefcase,
                      },
                    ].map(({ label, value, icon: Icon }, index) => (
                      <motion.div
                        key={label}
                        className="rounded-lg border border-[#D8D2E8] bg-white/75 px-3 py-2.5 shadow-[0_10px_24px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-white/[0.07]"
                        whileHover={{ y: -3, scale: 1.01 }}
                        transition={{ duration: 0.2, delay: index * 0.03 }}
                      >
                        <dt className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                          <Icon className="h-3.5 w-3.5 text-[#0F766E] dark:text-[#5EEAD4]" />
                          {label}
                        </dt>
                        <dd className="mt-1 font-semibold text-foreground">{value}</dd>
                      </motion.div>
                    ))}
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2.5">
                    <BrochureDownloadMenu
                      file={MJM_SUMMER_SCHOOL_HIGHLIGHT.pdf}
                      lowQualityFile={MJM_SUMMER_SCHOOL_HIGHLIGHT.pdfLow}
                      title={MJM_SUMMER_SCHOOL_HIGHLIGHT.title}
                      wrapperClassName="relative min-w-[13rem]"
                      buttonClassName="group inline-flex items-center gap-2 rounded-lg border border-[#2D1B69]/25 bg-white/70 px-4 py-2 text-sm font-semibold text-[#2D1B69] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#F2EDFF] hover:shadow-[0_12px_24px_rgba(45,27,105,0.16)] dark:border-white/15 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
                    />
                    <a
                      href={MJM_SUMMER_SCHOOL_HIGHLIGHT.pdf}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-2 rounded-lg bg-[linear-gradient(92deg,#2D1B69_0%,#0F766E_54%,#E8521A_100%)] px-4 py-2 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:brightness-110 hover:shadow-[0_14px_32px_rgba(45,27,105,0.26)]"
                    >
                      View Brochure
                      <ExternalLink className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </a>

                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                  {MJM_SUMMER_SCHOOL_HIGHLIGHT.tracks.map((track, index) => (
                    <motion.article
                      key={track.title}
                      className={`rounded-xl border p-3.5 shadow-[0_12px_24px_rgba(16,12,40,0.08)] dark:shadow-[0_14px_28px_rgba(6,5,14,0.34)] ${MJM_TRACK_CARD_THEME_CLASSES[index % MJM_TRACK_CARD_THEME_CLASSES.length]}`}
                      whileHover={{ y: -4, scale: 1.01 }}
                      transition={{ duration: 0.2 }}
                    >
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        Program Overview
                      </p>
                      <h4 className="mt-1 text-base font-semibold leading-tight text-foreground">{track.title}</h4>
                      <div className="mt-3 space-y-1.5 text-sm text-muted-foreground">
                        {track.details.map((detail) => (
                          <p key={detail} className="flex items-start gap-2">
                            <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#E8521A]" />
                            <span>{detail}</span>
                          </p>
                        ))}
                      </div>
                    </motion.article>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {catalogDocuments.length > 0 && (
          <motion.div
            ref={catalogDocumentsRef}
            className="mb-14 overflow-hidden rounded-2xl border border-border/50 bg-background/70 p-5 shadow-[0_18px_44px_rgba(15,23,42,0.08)] backdrop-blur dark:bg-[#0F172A]/70 sm:p-6"
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Official Brochures
                </p>
                <h3 className="mt-1 flex items-center gap-2 text-2xl font-bold text-foreground">
                  <FileText className="h-5 w-5 text-primary" />
                  Program Documents
                </h3>
              </div>
            </div>
            <div
              className={`grid grid-cols-1 gap-4 ${
                catalogDocuments.length === 1 ? 'max-w-3xl' : 'xl:grid-cols-2'
              }`}
            >
              {catalogDocuments.map((catalog) => {
                const catalogTheme = CATALOG_THEME_CLASSES[catalog.theme] || CATALOG_THEME_CLASSES.default;
                const lowQualityPdf = resolveLowQualityPdf(catalog.file, catalog.fileLow);
                const hasCatalogImage = Boolean(catalog.image);
                const fallbackCoverClass =
                  catalogTheme.cover ||
                  'bg-[linear-gradient(145deg,rgba(45,27,105,0.12)_0%,rgba(232,82,26,0.1)_100%)] text-primary';
                const fallbackBadgeClass =
                  catalogTheme.coverBadge ||
                  'border-primary/20 bg-background/78 text-primary shadow-[0_12px_24px_rgba(45,27,105,0.12)]';

                return (
                  <article
                    key={`${catalog.title}-${catalog.file}`}
                    className={`group relative grid overflow-hidden rounded-2xl border shadow-[0_16px_36px_rgba(15,23,42,0.08)] transition-all hover:-translate-y-0.5 hover:shadow-[0_20px_44px_rgba(15,23,42,0.13)] ${
                      hasCatalogImage
                        ? 'md:grid-cols-[minmax(11rem,0.42fr)_minmax(0,0.58fr)]'
                        : 'md:grid-cols-[minmax(7.5rem,0.24fr)_minmax(0,1fr)]'
                    } ${catalogTheme.shell}`}
                  >
                    <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(90deg,currentColor_1px,transparent_1px),linear-gradient(180deg,currentColor_1px,transparent_1px)] [background-size:22px_22px]" />
                    {hasCatalogImage ? (
                      <div className="relative min-h-48 overflow-hidden bg-muted md:min-h-full md:min-w-44">
                        <img
                          src={catalog.image}
                          alt={catalog.imageAlt || catalog.title}
                          loading="lazy"
                          decoding="async"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0)_38%,rgba(15,23,42,0.58)_100%)]" />
                        {catalog.secondaryImage && (
                          <img
                            src={catalog.secondaryImage}
                            alt={catalog.secondaryImageAlt || ''}
                            loading="lazy"
                            decoding="async"
                            className="absolute right-3 top-3 h-16 w-16 rounded-xl border border-white/70 object-cover shadow-[0_10px_24px_rgba(15,23,42,0.28)] sm:h-20 sm:w-20"
                          />
                        )}
                        {catalog.eyebrow && (
                          <span className={`absolute bottom-3 left-3 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${catalogTheme.accent}`}>
                            {catalog.eyebrow}
                          </span>
                        )}
                      </div>
                    ) : (
                      <div
                        className={`relative flex min-h-36 flex-col justify-between overflow-hidden p-4 md:min-h-full ${fallbackCoverClass}`}
                      >
                        <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/38 blur-2xl dark:bg-white/8" />
                        <div className="pointer-events-none absolute -bottom-10 left-4 h-28 w-28 rounded-full bg-current/12 blur-2xl" />
                        <span
                          className={`relative inline-flex h-14 w-14 items-center justify-center rounded-2xl border ${fallbackBadgeClass}`}
                        >
                          <FileText className="h-7 w-7" />
                        </span>
                        <div className="relative mt-5 min-w-0">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] opacity-75">
                            {catalog.coverLabel || 'Official Brochure'}
                          </p>
                          <p className="mt-1 max-w-[10rem] break-words text-sm font-bold leading-snug text-foreground/90 dark:text-white/90">
                            {catalog.coverTitle || catalog.eyebrow || 'Program Catalog'}
                          </p>
                        </div>
                      </div>
                    )}
                    <div className="relative flex min-h-full min-w-0 flex-col p-4 sm:p-5">
                      {catalog.eyebrow && (
                        <p className={`text-xs font-semibold uppercase tracking-[0.16em] ${catalogTheme.text}`}>
                          {catalog.eyebrow}
                        </p>
                      )}
                      <h4 className="mt-2 text-lg font-bold leading-snug text-foreground break-words">
                        {catalog.title}
                      </h4>
                      {catalog.description && (
                        <p className="mt-3 break-words text-sm leading-relaxed text-muted-foreground">{catalog.description}</p>
                      )}
                      {Array.isArray(catalog.facts) && catalog.facts.length > 0 && (
                        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                          {catalog.facts.map((fact) => (
                            <span
                              key={fact}
                              className="min-w-0 rounded-lg border border-border/55 bg-background/62 px-3 py-2 text-xs font-medium leading-relaxed text-foreground/85 break-words dark:bg-background/20"
                            >
                              {fact}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="mt-5 flex flex-col gap-2 pt-1 sm:flex-row sm:flex-wrap">
                        {catalog.detailPanel && (
                          <button
                            type="button"
                            onClick={() => setActiveCatalogDetails(catalog)}
                            aria-label={`Open structured details for ${catalog.title}`}
                            className={`inline-flex min-w-0 flex-1 items-center justify-center gap-2 rounded-xl border bg-background/75 px-3 py-2 text-sm font-semibold transition-colors sm:flex-[1_1_8.25rem] ${catalogTheme.button}`}
                          >
                            <Building2 className="h-4 w-4" />
                            More Info
                          </button>
                        )}
                        <a
                          href={catalog.file}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`View ${catalog.title} brochure`}
                          className={`inline-flex min-w-0 flex-1 items-center justify-center gap-2 rounded-xl border bg-background/75 px-3 py-2 text-sm font-semibold transition-colors sm:flex-[1_1_8.25rem] ${catalogTheme.button}`}
                        >
                          <Eye className="h-4 w-4" />
                          View Brochure
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                        <BrochureDownloadMenu
                          file={catalog.file}
                          lowQualityFile={lowQualityPdf}
                          downloadName={catalog.downloadName}
                          title={catalog.title}
                          menuPlacementClass="bottom-[calc(100%+0.5rem)]"
                          buttonClassName={`inline-flex min-w-0 flex-1 items-center justify-center gap-2 rounded-xl border bg-background/75 px-3 py-2 text-sm font-semibold transition-colors sm:flex-[1_1_8.25rem] ${catalogTheme.button}`}
                        />
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </motion.div>
        )}

        {Array.isArray(portfolio.details?.documentsRequired) &&
          portfolio.details.documentsRequired.length > 0 && (
            <motion.div
              className="bg-muted/20 border border-border/50 rounded-2xl p-8 mb-16"
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold text-foreground mb-5 flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Admission Documents Snapshot
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {portfolio.details.documentsRequired.map((doc) => (
                  <div
                    key={doc}
                    className="rounded-lg border border-border/50 bg-background/70 px-4 py-3 text-sm text-muted-foreground"
                  >
                    {doc}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

        {/* Highlights Section */}
        {portfolio.highlights && portfolio.highlights.length > 0 && (
          <motion.div
            className="mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            <h3 className="text-2xl font-bold text-foreground mb-8">
              Why Choose {portfolio.title}?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {portfolio.highlights.map((highlight, index) => (
                <motion.div
                  key={index}
                  className="bg-gradient-to-br from-primary/5 to-secondary/5 border border-border/50 rounded-lg p-6 hover:border-primary/50 transition-colors"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  whileHover={{ translateY: -4 }}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                      <Star className="w-4 h-4 text-primary" />
                    </div>
                    <p className="text-foreground font-medium">{highlight}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Specializations Tags */}
        <motion.div
          className="mb-16"
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold text-foreground mb-4">{specializationsTitle}</h3>
          {hasProgramsByLevel ? (
            <div className="space-y-6">
              {portfolio.details.programsByLevel.map((group) => (
                <div key={group.level}>
                  <p className="text-sm font-semibold text-primary mb-3">{group.level}</p>
                  <div className="flex flex-wrap gap-3">
                    {group.items.map((item, index) => (
                      <motion.div
                        key={item}
                        className="px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-lg font-medium text-sm hover:bg-primary/20 transition-colors"
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        whileHover={{ scale: 1.05 }}
                      >
                        {item}
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-3">
              {portfolio.details?.specializations?.map((spec, index) => (
                <motion.div
                  key={spec}
                  className="px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-lg font-medium text-sm hover:bg-primary/20 transition-colors"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                >
                  {spec}
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Testimonials Section */}
        {portfolio.details?.studentTestimonials && portfolio.details.studentTestimonials.length > 0 && (
          <motion.div
            className="mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            <h3 className="text-2xl font-bold text-foreground mb-8">Partner Insights</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {portfolio.details.studentTestimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  className="bg-gradient-to-br from-background to-muted/20 border border-border/50 rounded-xl p-6 relative overflow-hidden group hover:border-primary/50 transition-colors"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ translateY: -4 }}
                >
                  <div className="absolute top-0 right-0 w-20 h-20 bg-primary/10 rounded-bl-3xl group-hover:bg-primary/20 transition-colors"></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-1 mb-3">
                      {Array.from({
                        length: Math.min(5, Math.max(1, Number(testimonial.rating) || 5)),
                      }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                      ))}
                    </div>
                    
                    <p className="text-foreground italic mb-4">"{testimonial.quote}"</p>
                    
                    <div className="border-t border-border/30 pt-4">
                      <p className="font-semibold text-foreground">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.program}</p>
                      <p className="text-xs text-muted-foreground">From {testimonial.location}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* CTA Section */}
        <motion.div
          className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/30 rounded-2xl p-8 mb-16 text-center"
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold text-foreground mb-4">
            Ready to Partner with {portfolio.title}?
          </h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Partner with us to strengthen your visibility and recruitment outcomes for institutions like {portfolio.title} across key markets.
          </p>
          <motion.button
            className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-secondary transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/collaborate')}
            type="button"
          >
            Connect with Our Advisors
          </motion.button>
        </motion.div>

        {/* Related Portfolios */}
        {relatedPortfolios.length > 0 && (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            <h3 className="text-3xl font-bold text-foreground mb-8">Other Universities in {portfolio.category}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPortfolios.map((related, index) => (
                <motion.div
                  key={related.id}
                  className="bg-muted/30 border border-border/50 rounded-xl overflow-hidden hover:border-primary/50 transition-colors group"
                  variants={itemVariants}
                  whileHover={{ translateY: -4 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="relative h-48 overflow-hidden">
                    <motion.img
                      src={related.image}
                      alt={related.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.4 }}
                    />
                  </div>
                  <div className="p-6">
                    <h4 className="text-lg font-bold text-foreground mb-2">{related.title}</h4>
                    <p className="text-primary font-semibold text-sm mb-1">{related.country}</p>
                    <p className="text-muted-foreground text-sm mb-4">{related.description}</p>
                    <Link
                      to={`/portfolio/${related.slug || related.id}`}
                      className="inline-flex items-center gap-2 text-primary hover:text-secondary text-sm font-semibold group/link"
                    >
                      View University
                      <ChevronRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {activeCatalogDetails?.detailPanel && (
        <div className="fixed inset-0 z-[90] flex items-end justify-center bg-slate-950/55 p-3 backdrop-blur-[2px] sm:items-center sm:p-6">
          <button
            type="button"
            aria-label="Close details panel"
            className="absolute inset-0 h-full w-full cursor-default"
            onClick={() => setActiveCatalogDetails(null)}
          />
          <div className="relative z-10 w-full max-w-4xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.35)] dark:border-slate-700 dark:bg-slate-900">
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 bg-[linear-gradient(120deg,rgba(15,123,97,0.1)_0%,rgba(59,130,246,0.1)_100%)] px-5 py-4 dark:border-slate-700 dark:bg-[linear-gradient(120deg,rgba(19,78,74,0.38)_0%,rgba(30,58,138,0.32)_100%)] sm:px-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#0F7B61] dark:text-[#7EE2BC]">
                  {activeCatalogDetails.eyebrow || 'Official Brochure'}
                </p>
                <h4 className="mt-1 text-lg font-bold text-slate-900 dark:text-slate-100 sm:text-xl">
                  {activeCatalogDetails.detailPanel.heading || activeCatalogDetails.title}
                </h4>
                {activeCatalogDetails.detailPanel.source && (
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                    {activeCatalogDetails.detailPanel.source}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setActiveCatalogDetails(null)}
                className="group inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 bg-white/85 text-slate-700 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:scale-[1.03] hover:border-[#0F7B61]/45 hover:bg-white hover:text-[#0F7B61] hover:shadow-[0_10px_22px_rgba(15,123,97,0.22)] active:translate-y-0 active:scale-95 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-[#7EE2BC]/50 dark:hover:bg-slate-700 dark:hover:text-[#7EE2BC]"
                aria-label="Close details panel"
              >
                <X className="h-4 w-4 transition-transform duration-200 ease-out group-hover:rotate-90 group-hover:scale-110 group-active:rotate-0 group-active:scale-95" />
              </button>
            </div>

            <div className="smooth-scroll-panel max-h-[78vh] overflow-y-auto px-5 py-5 sm:px-6">
              {Array.isArray(activeCatalogDetails.detailPanel.keyStats) &&
                activeCatalogDetails.detailPanel.keyStats.length > 0 && (
                  <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {activeCatalogDetails.detailPanel.keyStats.map((stat) => (
                      <div
                        key={`${stat.label}-${stat.value}`}
                        className="rounded-xl border border-slate-200 bg-[#F8FBFA] px-4 py-3 dark:border-slate-700 dark:bg-slate-800/70"
                      >
                        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-300">
                          {stat.label}
                        </p>
                        <p className="mt-1 text-sm font-semibold leading-relaxed text-slate-900 dark:text-slate-100">
                          {stat.value}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

              {Array.isArray(activeCatalogDetails.detailPanel.sections) &&
                activeCatalogDetails.detailPanel.sections.length > 0 && (
                  <div className="grid grid-cols-1 gap-3">
                    {activeCatalogDetails.detailPanel.sections.map((section) => (
                      <section
                        key={section.title}
                        className="rounded-xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-800/45"
                      >
                        <h5 className="text-sm font-bold text-slate-900 dark:text-slate-100">{section.title}</h5>
                        <ul className="mt-2 space-y-1.5">
                          {(section.points || []).map((point) => (
                            <li key={point} className="flex items-start gap-2 text-sm leading-relaxed text-slate-700 dark:text-slate-200">
                              <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#0F7B61] dark:bg-[#7EE2BC]" />
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                      </section>
                    ))}
                  </div>
                )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
