import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { SITE_CONFIG } from '../config';
import { getSettings } from '../services/contentApi';
import { resolveMediaUrl } from '../services/apiClient';

const SettingsContext = createContext({
  settings: null,
  siteConfig: SITE_CONFIG,
  isLoading: false,
  errorMessage: '',
});

const pickFirst = (source, keys) => {
  if (!source) return undefined;
  for (const key of keys) {
    const value = source[key];
    if (value !== undefined && value !== null && String(value).trim() !== '') {
      return value;
    }
  }
  return undefined;
};

const normalizeList = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === 'string') {
    return value
      .split(/[,|;]/)
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [value].filter(Boolean);
};

const normalizeNumberString = (value) => {
  if (value === undefined || value === null) return undefined;
  const raw = String(value).trim();
  return raw || undefined;
};

const buildSiteConfig = (settings) => {
  if (!settings) return SITE_CONFIG;
  const config = JSON.parse(JSON.stringify(SITE_CONFIG));

  const companyName = pickFirst(settings, ['site_name', 'company_name', 'name']);
  const companyTagline = pickFirst(settings, ['tagline', 'site_tagline', 'slogan']);
  const companyDescription = pickFirst(settings, ['description', 'site_description', 'about']);

  if (companyName) config.company.name = companyName;
  if (companyTagline) config.company.tagline = companyTagline;
  if (companyDescription) config.company.description = companyDescription;

  const logoLight = pickFirst(settings, [
    'logo_light',
    'logo',
    'site_logo',
    'logo_white',
  ]);
  const logoDark = pickFirst(settings, ['logo_dark', 'logo_dark_mode', 'logo_black']);

  if (logoLight) config.company.logo.lightSrc = resolveMediaUrl(logoLight);
  if (logoDark) config.company.logo.darkSrc = resolveMediaUrl(logoDark);

  const phones = normalizeList(
    pickFirst(settings, ['phones', 'phone', 'contact_phone', 'mobile'])
  );
  if (phones.length > 0) {
    config.contact.phone = phones;
  }

  const generalEmail = pickFirst(settings, [
    'email',
    'contact_email',
    'general_email',
    'site_email',
  ]);
  const admissionsEmail = pickFirst(settings, [
    'admissions_email',
    'admission_email',
  ]);
  const partnershipsEmail = pickFirst(settings, [
    'partnerships_email',
    'partners_email',
  ]);

  if (generalEmail) config.contact.email.general = generalEmail;
  if (admissionsEmail) config.contact.email.admissions = admissionsEmail;
  if (partnershipsEmail) config.contact.email.partnerships = partnershipsEmail;

  const addressLine = pickFirst(settings, [
    'address',
    'address_line1',
    'street',
    'office_address',
  ]);
  const city = pickFirst(settings, ['city']);
  const state = pickFirst(settings, ['state']);
  const country = pickFirst(settings, ['country']);
  const zipcode = pickFirst(settings, ['zipcode', 'zip', 'postal_code']);

  if (addressLine || city || state || country || zipcode) {
    config.contact.address = {
      street: addressLine || config.contact.address.street,
      city: city || config.contact.address.city,
      state: state || config.contact.address.state,
      country: country || config.contact.address.country,
      zipcode: zipcode || config.contact.address.zipcode,
    };
  }

  const socialMap = {
    facebook: ['facebook', 'facebook_url'],
    linkedin: ['linkedin', 'linkedin_url'],
    youtube: ['youtube', 'youtube_url'],
    instagram: ['instagram', 'instagram_url'],
    twitter: ['twitter', 'twitter_url', 'x', 'x_url'],
    whatsapp: ['whatsapp', 'whatsapp_url'],
  };

  Object.entries(socialMap).forEach(([key, keys]) => {
    const value = pickFirst(settings, keys);
    if (value) {
      config.social[key] = value;
    }
  });

  const studentsRecruited = normalizeNumberString(
    pickFirst(settings, ['students_recruited', 'students', 'students_placed'])
  );
  const partnerUniversities = normalizeNumberString(
    pickFirst(settings, ['partner_universities', 'universities'])
  );
  const countriesCovered = normalizeNumberString(
    pickFirst(settings, ['countries_covered', 'countries'])
  );
  const visaSuccessRate = normalizeNumberString(
    pickFirst(settings, ['visa_success_rate', 'visa_success'])
  );

  if (studentsRecruited) config.stats.studentsRecruited = studentsRecruited;
  if (partnerUniversities) config.stats.partnerUniversities = partnerUniversities;
  if (countriesCovered) config.stats.countriesCovered = countriesCovered;
  if (visaSuccessRate) config.stats.visaSuccessRate = visaSuccessRate;

  return config;
};

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    const loadSettings = async () => {
      setIsLoading(true);
      setErrorMessage('');
      try {
        const data = await getSettings({ signal: controller.signal });
        setSettings(data || null);
      } catch (error) {
        if (error.name !== 'AbortError') {
          setErrorMessage(error.message || 'Unable to load settings');
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();

    return () => controller.abort();
  }, []);

  const siteConfig = useMemo(() => buildSiteConfig(settings), [settings]);

  const value = useMemo(
    () => ({
      settings,
      siteConfig,
      isLoading,
      errorMessage,
    }),
    [settings, siteConfig, isLoading, errorMessage]
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export const useSettings = () => useContext(SettingsContext);
