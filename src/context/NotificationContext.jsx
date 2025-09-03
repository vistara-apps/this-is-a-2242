import React, { createContext, useState, useContext, useCallback } from 'react';

// Create the notification context
const NotificationContext = createContext();

/**
 * NotificationProvider Component
 * 
 * This component provides a notification system to the application.
 * It handles success, error, info, and warning notifications.
 */
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  
  /**
   * Add a notification
   * @param {string} message - Notification message
   * @param {string} type - Notification type (success, error, info, warning)
   * @param {number} duration - Duration in milliseconds
   */
  const addNotification = useCallback((message, type = 'info', duration = 5000) => {
    const id = Date.now();
    
    setNotifications(prev => [
      ...prev,
      {
        id,
        message,
        type,
        duration
      }
    ]);
    
    // Auto-remove notification after duration
    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }
    
    return id;
  }, []);
  
  /**
   * Remove a notification
   * @param {number} id - Notification ID
   */
  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);
  
  /**
   * Show a success notification
   * @param {string} message - Notification message
   * @param {number} duration - Duration in milliseconds
   * @returns {number} Notification ID
   */
  const success = useCallback((message, duration = 5000) => {
    return addNotification(message, 'success', duration);
  }, [addNotification]);
  
  /**
   * Show an error notification
   * @param {string} message - Notification message
   * @param {number} duration - Duration in milliseconds
   * @returns {number} Notification ID
   */
  const error = useCallback((message, duration = 5000) => {
    return addNotification(message, 'error', duration);
  }, [addNotification]);
  
  /**
   * Show an info notification
   * @param {string} message - Notification message
   * @param {number} duration - Duration in milliseconds
   * @returns {number} Notification ID
   */
  const info = useCallback((message, duration = 5000) => {
    return addNotification(message, 'info', duration);
  }, [addNotification]);
  
  /**
   * Show a warning notification
   * @param {string} message - Notification message
   * @param {number} duration - Duration in milliseconds
   * @returns {number} Notification ID
   */
  const warning = useCallback((message, duration = 5000) => {
    return addNotification(message, 'warning', duration);
  }, [addNotification]);
  
  /**
   * Clear all notifications
   */
  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);
  
  // Context value
  const value = {
    notifications,
    addNotification,
    removeNotification,
    success,
    error,
    info,
    warning,
    clearAll
  };
  
  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

/**
 * Custom hook to use the notification context
 * @returns {Object} Notification context value
 */
export const useNotification = () => {
  const context = useContext(NotificationContext);
  
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  
  return context;
};

export default NotificationContext;

