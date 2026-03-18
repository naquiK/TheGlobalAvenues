const DEFAULT_API_BASE_URL = 'https://admin.theglobalavenues.com/public/api?route=';
const DEFAULT_MEDIA_BASE_URL = 'https://admin.theglobalavenues.com/public/';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL;
export const MEDIA_BASE_URL = import.meta.env.VITE_API_MEDIA_BASE_URL || DEFAULT_MEDIA_BASE_URL;

const joinUrl = (base, path) => {
  if (!base) return path;
  const trimmedBase = base.replace(/\/+$/, '');
  const trimmedPath = String(path || '').replace(/^\/+/, '');
  return `${trimmedBase}/${trimmedPath}`;
};

export const buildApiUrl = (route, slug) => {
  if (!route) {
    throw new Error('Route is required');
  }

  if (API_BASE_URL.includes('?route=')) {
    return `${API_BASE_URL}${route}${slug ? `/${slug}` : ''}`;
  }

  const normalized = API_BASE_URL.replace(/\/+$/, '');
  const routePath = slug ? `${route}/${slug}` : route;
  return `${normalized}/${routePath}`;
};

export const resolveMediaUrl = (path) => {
  if (!path) return '';
  if (/^https?:\/\//i.test(path)) return path;
  return joinUrl(MEDIA_BASE_URL, path);
};

export async function fetchJson(url, options = {}) {
  const response = await fetch(url, {
    headers: { Accept: 'application/json', ...(options.headers || {}) },
    ...options,
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(`Request failed (${response.status})`);
  }

  if (payload && payload.status === false) {
    throw new Error(payload.message || 'API error');
  }

  return payload && Object.prototype.hasOwnProperty.call(payload, 'data') ? payload.data : payload;
}
