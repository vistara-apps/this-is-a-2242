/**
 * User Model
 * 
 * This module provides functions for working with user data.
 */

/**
 * Validate a user
 * @param {Object} user - User data to validate
 * @returns {Object} Validation result
 */
export const validateUser = (user) => {
  const errors = [];
  
  // Required fields
  if (!user.email) {
    errors.push('Email is required');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
    errors.push('Email is invalid');
  }
  
  if (!user.firstName) {
    errors.push('First name is required');
  }
  
  if (!user.lastName) {
    errors.push('Last name is required');
  }
  
  // Password validation (for registration)
  if (user.password !== undefined) {
    if (!user.password) {
      errors.push('Password is required');
    } else if (user.password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    
    // Check password confirmation if provided
    if (user.confirmPassword !== undefined && user.password !== user.confirmPassword) {
      errors.push('Passwords do not match');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Get the full name of a user
 * @param {Object} user - User data
 * @returns {string} Full name
 */
export const getFullName = (user) => {
  if (!user) return '';
  
  return `${user.firstName} ${user.lastName}`;
};

/**
 * Get the initials of a user
 * @param {Object} user - User data
 * @returns {string} Initials
 */
export const getInitials = (user) => {
  if (!user) return '';
  
  return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
};

/**
 * Check if a user has a specific role
 * @param {Object} user - User data
 * @param {string} role - Role to check
 * @returns {boolean} True if the user has the role
 */
export const hasRole = (user, role) => {
  if (!user || !user.role) return false;
  
  return user.role === role;
};

/**
 * Check if a user is an admin
 * @param {Object} user - User data
 * @returns {boolean} True if the user is an admin
 */
export const isAdmin = (user) => {
  return hasRole(user, 'admin');
};

/**
 * Check if a user is a manager
 * @param {Object} user - User data
 * @returns {boolean} True if the user is a manager
 */
export const isManager = (user) => {
  return hasRole(user, 'manager');
};

/**
 * Format a user for display
 * @param {Object} user - User data
 * @returns {Object} Formatted user
 */
export const formatUser = (user) => {
  return {
    ...user,
    fullName: getFullName(user),
    initials: getInitials(user)
  };
};

/**
 * Filter users by criteria
 * @param {Array} users - List of users
 * @param {Object} criteria - Filter criteria
 * @returns {Array} Filtered users
 */
export const filterUsers = (users, criteria = {}) => {
  return users.filter(user => {
    // Filter by role
    if (criteria.role && user.role !== criteria.role) {
      return false;
    }
    
    // Filter by department
    if (criteria.department && user.department !== criteria.department) {
      return false;
    }
    
    // Filter by search term
    if (criteria.searchTerm) {
      const term = criteria.searchTerm.toLowerCase();
      const fullName = getFullName(user).toLowerCase();
      const email = user.email.toLowerCase();
      
      return fullName.includes(term) || email.includes(term);
    }
    
    return true;
  });
};

/**
 * Sort users by criteria
 * @param {Array} users - List of users
 * @param {string} sortBy - Sort field
 * @param {string} sortOrder - Sort order ('asc' or 'desc')
 * @returns {Array} Sorted users
 */
export const sortUsers = (users, sortBy = 'name', sortOrder = 'asc') => {
  return [...users].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'email':
        comparison = a.email.localeCompare(b.email);
        break;
      case 'department':
        comparison = (a.department || '').localeCompare(b.department || '');
        break;
      case 'role':
        comparison = (a.role || '').localeCompare(b.role || '');
        break;
      case 'name':
      default:
        const aName = getFullName(a);
        const bName = getFullName(b);
        comparison = aName.localeCompare(bName);
    }
    
    return sortOrder === 'desc' ? -comparison : comparison;
  });
};

export default {
  validateUser,
  getFullName,
  getInitials,
  hasRole,
  isAdmin,
  isManager,
  formatUser,
  filterUsers,
  sortUsers
};

