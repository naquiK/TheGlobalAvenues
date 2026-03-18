import { buildApiUrl, fetchJson } from './apiClient';

export const getGallery = (options) => fetchJson(buildApiUrl('gallery'), options);

export const getBlogList = (options) => fetchJson(buildApiUrl('blog'), options);

export const getBlogDetail = (slug, options) => fetchJson(buildApiUrl('blog', slug), options);

export const getSettings = (options) => fetchJson(buildApiUrl('settings'), options);

export const getTestimonials = (options) => fetchJson(buildApiUrl('testimonials'), options);

export const getUniversityDetail = (slug, options) =>
  fetchJson(buildApiUrl('university', slug), options);
