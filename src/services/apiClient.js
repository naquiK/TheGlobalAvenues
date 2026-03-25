const DEFAULT_API_BASE_URL = 'https://admin.theglobalavenues.com/public/api?route=';
const DEFAULT_MEDIA_BASE_URL = 'https://admin.theglobalavenues.com/public/';
const DEFAULT_REQUEST_TIMEOUT_MS = 12000;

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

export const buildApiQueryUrl = (route, params = {}) => {
  if (!route) {
    throw new Error('Route is required');
  }

  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || String(value).trim() === '') return;
    queryParams.append(key, String(value));
  });
  const queryString = queryParams.toString();

  if (API_BASE_URL.includes('?route=')) {
    return queryString ? `${API_BASE_URL}${route}&${queryString}` : `${API_BASE_URL}${route}`;
  }

  const normalized = API_BASE_URL.replace(/\/+$/, '');
  return queryString ? `${normalized}/${route}?${queryString}` : `${normalized}/${route}`;
};

export const resolveMediaUrl = (path) => {
  if (!path) return '';
  if (/^https?:\/\//i.test(path)) return path;
  return joinUrl(MEDIA_BASE_URL, path);
};

const createRequestSignal = (externalSignal, timeoutMs) => {
  const controller = new AbortController();
  let timeoutId = null;
  let timedOut = false;
  let onExternalAbort = null;

  if (Number.isFinite(timeoutMs) && timeoutMs > 0) {
    timeoutId = globalThis.setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, timeoutMs);
  }

  if (externalSignal) {
    if (externalSignal.aborted) {
      controller.abort();
    } else {
      onExternalAbort = () => controller.abort();
      externalSignal.addEventListener('abort', onExternalAbort, { once: true });
    }
  }

  return {
    signal: controller.signal,
    didTimeout: () => timedOut,
    cleanup: () => {
      if (timeoutId) {
        globalThis.clearTimeout(timeoutId);
      }
      if (externalSignal && onExternalAbort) {
        externalSignal.removeEventListener('abort', onExternalAbort);
      }
    },
  };
};

export async function fetchJson(url, options = {}) {
  const {
    headers: optionHeaders = {},
    signal: externalSignal,
    timeoutMs = DEFAULT_REQUEST_TIMEOUT_MS,
    ...fetchOptions
  } = options;

  const requestControl = createRequestSignal(externalSignal, timeoutMs);
  let response;

  try {
    response = await fetch(url, {
      headers: { Accept: 'application/json', ...optionHeaders },
      ...fetchOptions,
      signal: requestControl.signal,
    });
  } catch (error) {
    requestControl.cleanup();
    if (requestControl.didTimeout()) {
      throw new Error(`Request timed out (${timeoutMs}ms)`);
    }
    throw error;
  }

  requestControl.cleanup();

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(`Request failed (${response.status})`);
  }

  if (payload === null) {
    throw new Error('Invalid API response');
  }

  if (payload && payload.status === false) {
    throw new Error(payload.message || 'API error');
  }

  return payload && Object.prototype.hasOwnProperty.call(payload, 'data') ? payload.data : payload;
}
