import { createError } from '../utils/errorHandler';

/**
 * Base API Service
 * 
 * This service provides a wrapper around fetch for making API requests.
 * It handles authentication, error handling, and response parsing.
 */
const api = {
  /**
   * Base URL for API requests
   */
  baseUrl: 'https://api.conferenceroom.app/v1',
  
  /**
   * Get the authorization header
   * @returns {Object} Headers object with Authorization header
   */
  getAuthHeaders: () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  },
  
  /**
   * Make a request to the API
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Request options
   * @returns {Promise<Object>} Response data
   */
  request: async (endpoint, options = {}) => {
    const url = `${api.baseUrl}${endpoint}`;
    
    const headers = {
      'Content-Type': 'application/json',
      ...api.getAuthHeaders(),
      ...options.headers
    };
    
    const config = {
      ...options,
      headers
    };
    
    try {
      const response = await fetch(url, config);
      
      // Handle 401 Unauthorized
      if (response.status === 401) {
        // Clear token from localStorage
        localStorage.removeItem('token');
        
        throw createError('Your session has expired. Please log in again.', 401);
      }
      
      // Handle 403 Forbidden
      if (response.status === 403) {
        throw createError('You do not have permission to perform this action.', 403);
      }
      
      // Handle 404 Not Found
      if (response.status === 404) {
        throw createError('The requested resource was not found.', 404);
      }
      
      // Handle 429 Too Many Requests
      if (response.status === 429) {
        throw createError('Too many requests. Please try again later.', 429);
      }
      
      // Handle 500 Internal Server Error
      if (response.status >= 500) {
        throw createError('Server error. Please try again later.', response.status);
      }
      
      // Parse response
      const data = await response.json();
      
      // Handle API errors
      if (!response.ok) {
        throw createError(
          data.error?.message || 'An unexpected error occurred',
          response.status,
          data.error
        );
      }
      
      return data;
    } catch (error) {
      // Handle network errors
      if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
        throw createError('Network error. Please check your internet connection.', 0);
      }
      
      throw error;
    }
  },
  
  /**
   * Make a GET request
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Request options
   * @returns {Promise<Object>} Response data
   */
  get: (endpoint, options = {}) => {
    return api.request(endpoint, {
      method: 'GET',
      ...options
    });
  },
  
  /**
   * Make a POST request
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request body
   * @param {Object} options - Request options
   * @returns {Promise<Object>} Response data
   */
  post: (endpoint, data, options = {}) => {
    return api.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      ...options
    });
  },
  
  /**
   * Make a PUT request
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request body
   * @param {Object} options - Request options
   * @returns {Promise<Object>} Response data
   */
  put: (endpoint, data, options = {}) => {
    return api.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
      ...options
    });
  },
  
  /**
   * Make a PATCH request
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request body
   * @param {Object} options - Request options
   * @returns {Promise<Object>} Response data
   */
  patch: (endpoint, data, options = {}) => {
    return api.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
      ...options
    });
  },
  
  /**
   * Make a DELETE request
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Request options
   * @returns {Promise<Object>} Response data
   */
  delete: (endpoint, options = {}) => {
    return api.request(endpoint, {
      method: 'DELETE',
      ...options
    });
  }
};

export default api;

