// Portfolio Service - Backend Ready Architecture
// This service layer allows easy migration to API calls in the future
// Change API_BASE_URL and USE_MOCK_DATA to switch between mock data and real backend

import { portfolioData, getPortfolioById as getMockPortfolioById, categories } from '../data/portfolioData';

// API Configuration - Change this to your backend URL when ready
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const USE_MOCK_DATA = true; // Set to false when backend is ready

/**
 * Get featured portfolios (used on home page)
 * @param {number} limit - Number of portfolios to fetch
 * @returns {Promise<Array>}
 */
export const getFeaturedPortfolios = async (limit = 6) => {
  try {
    if (USE_MOCK_DATA) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(portfolioData.slice(0, limit));
        }, 300);
      });
    }

    const response = await fetch(`${API_BASE_URL}/portfolios/featured?limit=${limit}`);
    if (!response.ok) throw new Error('Failed to fetch featured portfolios');
    return await response.json();
  } catch (error) {
    console.error('Error fetching featured portfolios:', error);
    return portfolioData.slice(0, limit);
  }
};

/**
 * Get all portfolios with optional filters
 * @param {Object} filters - Filter options (category, country, etc.)
 * @param {number} page - Pagination page
 * @param {number} pageSize - Items per page
 * @returns {Promise<Object>}
 */
export const getPortfolios = async (filters = {}, page = 1, pageSize = 12) => {
  try {
    if (USE_MOCK_DATA) {
      return new Promise((resolve) => {
        setTimeout(() => {
          let filtered = portfolioData;
          if (filters.category && filters.category !== 'All') {
            filtered = filtered.filter(p => p.category === filters.category);
          }
          const start = (page - 1) * pageSize;
          const end = start + pageSize;
          resolve({
            data: filtered.slice(start, end),
            total: filtered.length,
            page,
            pageSize,
            totalPages: Math.ceil(filtered.length / pageSize)
          });
        }, 300);
      });
    }

    const queryParams = new URLSearchParams();
    queryParams.append('page', page);
    queryParams.append('pageSize', pageSize);
    Object.keys(filters).forEach(key => {
      if (filters[key]) queryParams.append(key, filters[key]);
    });

    const response = await fetch(`${API_BASE_URL}/portfolios?${queryParams}`);
    if (!response.ok) throw new Error('Failed to fetch portfolios');
    return await response.json();
  } catch (error) {
    console.error('Error fetching portfolios:', error);
    return {
      data: portfolioData,
      total: portfolioData.length,
      page,
      pageSize,
      totalPages: Math.ceil(portfolioData.length / pageSize)
    };
  }
};

/**
 * Get portfolio detail by ID
 * @param {number|string} id - Portfolio ID
 * @returns {Promise<Object>}
 */
export const getPortfolioById = async (id) => {
  try {
    if (USE_MOCK_DATA) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const portfolio = getMockPortfolioById(id);
          if (portfolio) {
            resolve(portfolio);
          } else {
            reject(new Error('Portfolio not found'));
          }
        }, 300);
      });
    }

    const response = await fetch(`${API_BASE_URL}/portfolios/${id}`);
    if (!response.ok) throw new Error('Portfolio not found');
    return await response.json();
  } catch (error) {
    console.error('Error fetching portfolio detail:', error);
    const portfolio = getMockPortfolioById(id);
    if (!portfolio) throw error;
    return portfolio;
  }
};

/**
 * Get portfolios by category
 * @param {string} category - Category name
 * @returns {Promise<Array>}
 */
export const getPortfoliosByCategory = async (category) => {
  try {
    if (USE_MOCK_DATA) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(portfolioData.filter(p => p.category === category));
        }, 300);
      });
    }

    const response = await fetch(`${API_BASE_URL}/portfolios/category/${category}`);
    if (!response.ok) throw new Error('Failed to fetch portfolios by category');
    return await response.json();
  } catch (error) {
    console.error('Error fetching portfolios by category:', error);
    return portfolioData.filter(p => p.category === category);
  }
};

/**
 * Search portfolios
 * @param {string} query - Search query
 * @returns {Promise<Array>}
 */
export const searchPortfolios = async (query) => {
  try {
    if (USE_MOCK_DATA) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const results = portfolioData.filter(p =>
            p.title.toLowerCase().includes(query.toLowerCase()) ||
            p.country.toLowerCase().includes(query.toLowerCase()) ||
            p.description.toLowerCase().includes(query.toLowerCase())
          );
          resolve(results);
        }, 300);
      });
    }

    const response = await fetch(`${API_BASE_URL}/portfolios/search?q=${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error('Search failed');
    return await response.json();
  } catch (error) {
    console.error('Error searching portfolios:', error);
    return portfolioData.filter(p =>
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      p.country.toLowerCase().includes(query.toLowerCase())
    );
  }
};

/**
 * Get portfolio filters/categories
 * @returns {Promise<Array>}
 */
export const getCategories = async () => {
  try {
    if (USE_MOCK_DATA) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(categories);
        }, 200);
      });
    }

    const response = await fetch(`${API_BASE_URL}/portfolios/filters`);
    if (!response.ok) throw new Error('Failed to fetch filters');
    return await response.json();
  } catch (error) {
    console.error('Error fetching filters:', error);
    return categories;
  }
};

/**
 * Get portfolio statistics
 * @returns {Promise<Object>}
 */
export const getPortfolioStats = async () => {
  try {
    if (USE_MOCK_DATA) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const totalStudents = portfolioData.reduce((sum, p) => sum + p.studentsPlaced, 0);
          const totalPrograms = portfolioData.reduce((sum, p) => sum + p.programs, 0);
          const avgSuccess = Math.round(
            portfolioData.reduce((sum, p) => sum + p.successRate, 0) / portfolioData.length
          );
          resolve({
            totalUniversities: portfolioData.length,
            totalStudents,
            totalPrograms,
            avgSuccessRate: avgSuccess,
            countries: [...new Set(portfolioData.map(p => p.country))]
          });
        }, 300);
      });
    }

    const response = await fetch(`${API_BASE_URL}/portfolios/stats`);
    if (!response.ok) throw new Error('Failed to fetch stats');
    return await response.json();
  } catch (error) {
    console.error('Error fetching stats:', error);
    const totalStudents = portfolioData.reduce((sum, p) => sum + p.studentsPlaced, 0);
    const totalPrograms = portfolioData.reduce((sum, p) => sum + p.programs, 0);
    const avgSuccess = Math.round(
      portfolioData.reduce((sum, p) => sum + p.successRate, 0) / portfolioData.length
    );
    return {
      totalUniversities: portfolioData.length,
      totalStudents,
      totalPrograms,
      avgSuccessRate: avgSuccess,
      countries: [...new Set(portfolioData.map(p => p.country))]
    };
  }
};

export default {
  getFeaturedPortfolios,
  getPortfolios,
  getPortfolioById,
  getPortfoliosByCategory,
  searchPortfolios,
  getCategories,
  getPortfolioStats
};
