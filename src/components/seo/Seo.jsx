import { useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import {
  buildPageTitle,
  DEFAULT_DESCRIPTION,
  DEFAULT_IMAGE,
  DEFAULT_TITLE,
  SITE_NAME,
  toAbsoluteUrl,
  trimDescription,
} from '../../seo/siteMeta';

const removeMeta = (selector) => {
  const element = document.head.querySelector(selector);
  if (element) {
    element.remove();
  }
};

const setMetaTag = (attribute, key, content) => {
  const selector = `meta[${attribute}="${key}"]`;
  if (!content) {
    removeMeta(selector);
    return;
  }

  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
};

const setLinkTag = (rel, href) => {
  const selector = `link[rel="${rel}"]`;
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', rel);
    document.head.appendChild(element);
  }
  element.setAttribute('href', href);
};

const clearManagedJsonLd = () => {
  document.head
    .querySelectorAll('script[type="application/ld+json"][data-seo-managed="true"]')
    .forEach((node) => node.remove());
};

const normalizeJsonLd = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter(Boolean);
  return [value];
};

const normalizeCanonicalPath = (value) => {
  const raw = String(value || '').trim();
  const withoutHash = raw.split('#')[0] || '';
  const withoutQuery = withoutHash.split('?')[0] || '';
  if (!withoutQuery) return '/';
  const lower = withoutQuery.toLowerCase();
  const withLeadingSlash = lower.startsWith('/') ? lower : `/${lower}`;
  if (withLeadingSlash === '/') return '/';
  return withLeadingSlash.replace(/\/+$/, '');
};

export default function Seo({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  path,
  image = DEFAULT_IMAGE,
  type = 'website',
  keywords = [],
  noindex = false,
  publishedTime,
  modifiedTime,
  jsonLd,
}) {
  const location = useLocation();
  const canonicalPath = useMemo(() => {
    if (typeof path === 'string' && path.trim()) return normalizeCanonicalPath(path);
    return normalizeCanonicalPath(location.pathname || '/');
  }, [location.pathname, path]);

  useEffect(() => {
    if (typeof document === 'undefined') return;

    const pageTitle = buildPageTitle(title);
    const pageDescription = trimDescription(description || DEFAULT_DESCRIPTION, 170);
    const canonicalUrl = toAbsoluteUrl(canonicalPath);
    const imageUrl = toAbsoluteUrl(image || DEFAULT_IMAGE);
    const defaultPageSchema = {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: pageTitle,
      description: pageDescription,
      url: canonicalUrl,
      isPartOf: {
        '@type': 'WebSite',
        name: SITE_NAME,
      },
    };
    const robotsContent = noindex
      ? 'noindex, nofollow, max-image-preview:large'
      : 'index, follow, max-image-preview:large';
    const keywordList = Array.isArray(keywords)
      ? keywords
          .map((value) => String(value || '').trim())
          .filter(Boolean)
          .join(', ')
      : '';

    document.title = pageTitle;

    setMetaTag('name', 'description', pageDescription);
    setMetaTag('name', 'robots', robotsContent);
    setMetaTag('name', 'keywords', keywordList || null);
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:site', '@theglobalavenues');
    setMetaTag('name', 'twitter:creator', '@theglobalavenues');
    setMetaTag('name', 'twitter:title', pageTitle);
    setMetaTag('name', 'twitter:description', pageDescription);
    setMetaTag('name', 'twitter:image', imageUrl);
    setMetaTag('name', 'twitter:image:alt', pageTitle);
    setMetaTag('name', 'twitter:url', canonicalUrl);
    setMetaTag('property', 'og:type', type || 'website');
    setMetaTag('property', 'og:site_name', SITE_NAME);
    setMetaTag('property', 'og:locale', 'en_US');
    setMetaTag('property', 'og:title', pageTitle);
    setMetaTag('property', 'og:description', pageDescription);
    setMetaTag('property', 'og:url', canonicalUrl);
    setMetaTag('property', 'og:image', imageUrl);
    setMetaTag('property', 'og:image:width', '1280');
    setMetaTag('property', 'og:image:height', '720');
    setMetaTag('property', 'og:image:type', 'image/jpeg');
    setMetaTag('property', 'og:image:alt', pageTitle);
    setMetaTag(
      'property',
      'article:published_time',
      type === 'article' && publishedTime ? String(publishedTime) : null
    );
    setMetaTag(
      'property',
      'article:modified_time',
      type === 'article' && modifiedTime ? String(modifiedTime) : null
    );
    setMetaTag('property', 'og:updated_time', modifiedTime ? String(modifiedTime) : null);
    setLinkTag('canonical', canonicalUrl);

    clearManagedJsonLd();
    [defaultPageSchema, ...normalizeJsonLd(jsonLd)].forEach((schema) => {
      try {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.setAttribute('data-seo-managed', 'true');
        script.text = JSON.stringify(schema);
        document.head.appendChild(script);
      } catch {
        // Ignore malformed structured data objects.
      }
    });
  }, [
    canonicalPath,
    description,
    image,
    jsonLd,
    keywords,
    modifiedTime,
    noindex,
    publishedTime,
    title,
    type,
  ]);

  return null;
}
