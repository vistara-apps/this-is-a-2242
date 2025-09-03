/**
 * Error Handler Utility
 * 
 * This module provides functions for handling and formatting errors throughout the application.
 */

/**
 * Format an API error for display
 * @param {Error} error - The error object
 * @returns {Object} Formatted error object with message and details
 */
export const formatApiError = (error) => {
  // Default error message
  let message = 'An unexpected error occurred. Please try again.';
  let details = [];
  let statusCode = null;
  
  // Handle API error responses
  if (error.status) {
    statusCode = error.status;
    
    // Handle common HTTP status codes
    switch (error.status) {
      case 400:
        message = 'Invalid request. Please check your input and try again.';
        break;
      case 401:
        message = 'Authentication required. Please log in and try again.';
        break;
      case 403:
        message = 'You do not have permission to perform this action.';
        break;
      case 404:
        message = 'The requested resource was not found.';
        break;
      case 409:
        message = 'Conflict with current state. The resource might have been modified.';
        break;
      case 422:
        message = 'Validation failed. Please check your input.';
        break;
      case 429:
        message = 'Too many requests. Please try again later.';
        break;
      case 500:
        message = 'Server error. Please try again later.';
        break;
      default:
        if (error.status >= 500) {
          message = 'Server error. Please try again later.';
        } else if (error.status >= 400) {
          message = 'Request error. Please try again.';
        }
    }
    
    // Use error message from response if available
    if (error.data && error.data.message) {
      message = error.data.message;
    }
    
    // Extract validation errors if available
    if (error.data && error.data.errors) {
      if (Array.isArray(error.data.errors)) {
        details = error.data.errors;
      } else if (typeof error.data.errors === 'object') {
        // Convert object of errors to array
        details = Object.entries(error.data.errors).map(([field, message]) => 
          `${field}: ${message}`
        );
      }
    }
  } else if (error.message) {
    // Use error message if available
    message = error.message;
  }
  
  return {
    message,
    details,
    statusCode
  };
};

/**
 * Handle API errors and display notifications
 * @param {Error} error - The error object
 * @param {Function} notifyError - Function to display error notification
 * @param {Function} logout - Function to log out user (for auth errors)
 * @returns {Object} Formatted error object
 */
export const handleApiError = (error, notifyError, logout = null) => {
  const formattedError = formatApiError(error);
  
  // Display error notification
  if (notifyError) {
    notifyError(formattedError.message);
  }
  
  // Handle authentication errors
  if (formattedError.statusCode === 401 && logout) {
    logout();
  }
  
  return formattedError;
};

/**
 * Create a custom error with additional data
 * @param {string} message - Error message
 * @param {number} status - HTTP status code
 * @param {Object} data - Additional error data
 * @returns {Error} Custom error object
 */
export const createError = (message, status = null, data = null) => {
  const error = new Error(message);
  
  if (status) {
    error.status = status;
  }
  
  if (data) {
    error.data = data;
  }
  
  return error;
};

/**
 * Check if an error is a network error
 * @param {Error} error - The error to check
 * @returns {boolean} True if the error is a network error
 */
export const isNetworkError = (error) => {
  return (
    error.message === 'Network Error' ||
    error.message === 'Failed to fetch' ||
    error.message.includes('NetworkError') ||
    error.message.includes('network error')
  );
};

/**
 * Check if an error is an authentication error
 * @param {Error} error - The error to check
 * @returns {boolean} True if the error is an authentication error
 */
export const isAuthError = (error) => {
  return error.status === 401;
};

export default {
  formatApiError,
  handleApiError,
  createError,
  isNetworkError,
  isAuthError
};

