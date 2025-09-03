import api from './api';
import { createError } from '../utils/errorHandler';

/**
 * Authentication Service
 * 
 * This service handles all authentication-related API calls.
 */
const authService = {
  /**
   * Log in a user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} Authentication data (token and user)
   */
  login: async (email, password) => {
    try {
      // In a real app, we would call the API
      // const response = await api.post('/auth/login', { email, password });
      // return response.data;
      
      // For now, we'll simulate a successful login
      if (email === 'user@example.com' && password === 'password123') {
        return {
          token: 'fake-jwt-token',
          user: {
            id: 1,
            email: 'user@example.com',
            firstName: 'John',
            lastName: 'Doe',
            role: 'user',
            department: 'Engineering',
            position: 'Software Engineer'
          }
        };
      }
      
      // Simulate an error for invalid credentials
      throw createError('Invalid email or password', 401);
    } catch (error) {
      throw error;
    }
  },
  
  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} Authentication data (token and user)
   */
  register: async (userData) => {
    try {
      // In a real app, we would call the API
      // const response = await api.post('/auth/register', userData);
      // return response.data;
      
      // For now, we'll simulate a successful registration
      return {
        token: 'fake-jwt-token',
        user: {
          id: 2,
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          role: 'user',
          department: userData.department || '',
          position: userData.position || ''
        }
      };
    } catch (error) {
      throw error;
    }
  },
  
  /**
   * Log out the current user
   * @returns {Promise<void>}
   */
  logout: async () => {
    try {
      // In a real app, we would call the API
      // await api.post('/auth/logout');
      
      // For now, we'll just simulate a successful logout
      return;
    } catch (error) {
      throw error;
    }
  },
  
  /**
   * Validate a JWT token
   * @param {string} token - JWT token
   * @returns {Promise<Object|null>} User data or null if token is invalid
   */
  validateToken: async (token) => {
    try {
      // In a real app, we would call the API
      // const response = await api.post('/auth/validate-token', { token });
      // return response.data.user;
      
      // For now, we'll simulate a valid token
      if (token === 'fake-jwt-token') {
        return {
          id: 1,
          email: 'user@example.com',
          firstName: 'John',
          lastName: 'Doe',
          role: 'user',
          department: 'Engineering',
          position: 'Software Engineer'
        };
      }
      
      return null;
    } catch (error) {
      return null;
    }
  },
  
  /**
   * Update the current user's profile
   * @param {Object} profileData - Updated profile data
   * @returns {Promise<Object>} Updated user data
   */
  updateProfile: async (profileData) => {
    try {
      // In a real app, we would call the API
      // const response = await api.put('/users/profile', profileData);
      // return response.data;
      
      // For now, we'll simulate a successful profile update
      return {
        id: 1,
        email: 'user@example.com',
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        role: 'user',
        department: profileData.department,
        position: profileData.position
      };
    } catch (error) {
      throw error;
    }
  },
  
  /**
   * Change the current user's password
   * @param {string} currentPassword - Current password
   * @param {string} newPassword - New password
   * @returns {Promise<void>}
   */
  changePassword: async (currentPassword, newPassword) => {
    try {
      // In a real app, we would call the API
      // await api.post('/auth/change-password', { currentPassword, newPassword });
      
      // For now, we'll simulate a successful password change
      if (currentPassword !== 'password123') {
        throw createError('Current password is incorrect', 400);
      }
      
      return;
    } catch (error) {
      throw error;
    }
  },
  
  /**
   * Request a password reset
   * @param {string} email - User email
   * @returns {Promise<void>}
   */
  forgotPassword: async (email) => {
    try {
      // In a real app, we would call the API
      // await api.post('/auth/forgot-password', { email });
      
      // For now, we'll simulate a successful password reset request
      return;
    } catch (error) {
      throw error;
    }
  },
  
  /**
   * Reset a password using a reset token
   * @param {string} token - Reset token
   * @param {string} newPassword - New password
   * @returns {Promise<void>}
   */
  resetPassword: async (token, newPassword) => {
    try {
      // In a real app, we would call the API
      // await api.post('/auth/reset-password', { token, newPassword });
      
      // For now, we'll simulate a successful password reset
      return;
    } catch (error) {
      throw error;
    }
  }
};

export default authService;

