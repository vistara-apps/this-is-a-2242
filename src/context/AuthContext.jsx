import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/authService';
import { useNotification } from './NotificationContext';
import logger from '../utils/logger';

// Create the auth context
const AuthContext = createContext();

/**
 * AuthProvider Component
 * 
 * This component provides authentication state and functions to the application.
 * It handles user login, registration, logout, and token management.
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const { success, error: showError } = useNotification();
  
  // Initialize auth state from localStorage
  useEffect(() => {
    const initAuth = async () => {
      try {
        setLoading(true);
        
        // Check if there's a token in localStorage
        const token = localStorage.getItem('token');
        
        if (token) {
          // Validate token and get user data
          const userData = await authService.validateToken(token);
          
          if (userData) {
            setUser(userData);
            setIsAuthenticated(true);
          } else {
            // Token is invalid, remove it
            localStorage.removeItem('token');
          }
        }
      } catch (err) {
        logger.error('Failed to initialize auth:', err);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };
    
    initAuth();
  }, []);
  
  /**
   * Log in a user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} User data
   */
  const login = async (email, password) => {
    try {
      setLoading(true);
      
      // Call login API
      const { token, user: userData } = await authService.login(email, password);
      
      // Save token to localStorage
      localStorage.setItem('token', token);
      
      // Update state
      setUser(userData);
      setIsAuthenticated(true);
      
      // Show success notification
      success('Logged in successfully');
      
      return userData;
    } catch (err) {
      logger.error('Login error:', err);
      showError(err.message || 'Failed to log in. Please check your credentials.');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} User data
   */
  const register = async (userData) => {
    try {
      setLoading(true);
      
      // Call register API
      const { token, user: newUser } = await authService.register(userData);
      
      // Save token to localStorage
      localStorage.setItem('token', token);
      
      // Update state
      setUser(newUser);
      setIsAuthenticated(true);
      
      // Show success notification
      success('Registered successfully');
      
      return newUser;
    } catch (err) {
      logger.error('Registration error:', err);
      showError(err.message || 'Failed to register. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Log out the current user
   */
  const logout = async () => {
    try {
      setLoading(true);
      
      // Call logout API
      await authService.logout();
      
      // Remove token from localStorage
      localStorage.removeItem('token');
      
      // Update state
      setUser(null);
      setIsAuthenticated(false);
      
      // Show success notification
      success('Logged out successfully');
    } catch (err) {
      logger.error('Logout error:', err);
      
      // Even if the API call fails, we still want to log out locally
      localStorage.removeItem('token');
      setUser(null);
      setIsAuthenticated(false);
      
      showError(err.message || 'Failed to log out. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Update the current user's profile
   * @param {Object} profileData - Updated profile data
   * @returns {Promise<Object>} Updated user data
   */
  const updateProfile = async (profileData) => {
    try {
      setLoading(true);
      
      // Call update profile API
      const updatedUser = await authService.updateProfile(profileData);
      
      // Update state
      setUser(updatedUser);
      
      // Show success notification
      success('Profile updated successfully');
      
      return updatedUser;
    } catch (err) {
      logger.error('Profile update error:', err);
      showError(err.message || 'Failed to update profile. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Change the current user's password
   * @param {string} currentPassword - Current password
   * @param {string} newPassword - New password
   * @returns {Promise<void>}
   */
  const changePassword = async (currentPassword, newPassword) => {
    try {
      setLoading(true);
      
      // Call change password API
      await authService.changePassword(currentPassword, newPassword);
      
      // Show success notification
      success('Password changed successfully');
    } catch (err) {
      logger.error('Password change error:', err);
      showError(err.message || 'Failed to change password. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Request a password reset
   * @param {string} email - User email
   * @returns {Promise<void>}
   */
  const forgotPassword = async (email) => {
    try {
      setLoading(true);
      
      // Call forgot password API
      await authService.forgotPassword(email);
      
      // Show success notification
      success('Password reset link sent to your email');
    } catch (err) {
      logger.error('Forgot password error:', err);
      showError(err.message || 'Failed to send password reset link. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Reset a password using a reset token
   * @param {string} token - Reset token
   * @param {string} newPassword - New password
   * @returns {Promise<void>}
   */
  const resetPassword = async (token, newPassword) => {
    try {
      setLoading(true);
      
      // Call reset password API
      await authService.resetPassword(token, newPassword);
      
      // Show success notification
      success('Password reset successfully');
    } catch (err) {
      logger.error('Reset password error:', err);
      showError(err.message || 'Failed to reset password. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Context value
  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    forgotPassword,
    resetPassword
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook to use the auth context
 * @returns {Object} Auth context value
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

export default AuthContext;

