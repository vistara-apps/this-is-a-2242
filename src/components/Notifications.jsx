import React from 'react';
import { useNotification } from '../context/NotificationContext';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

/**
 * Notifications Component
 * 
 * This component displays notifications from the NotificationContext.
 * It renders a stack of notification alerts with different styles based on type.
 */
const Notifications = () => {
  const { notifications, removeNotification } = useNotification();
  
  // If there are no notifications, don't render anything
  if (notifications.length === 0) {
    return null;
  }
  
  /**
   * Get icon based on notification type
   * @param {string} type - Notification type
   * @returns {JSX.Element} Icon component
   */
  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5" />;
      case 'error':
        return <AlertCircle className="w-5 h-5" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5" />;
      case 'info':
      default:
        return <Info className="w-5 h-5" />;
    }
  };
  
  /**
   * Get styles based on notification type
   * @param {string} type - Notification type
   * @returns {Object} Style classes
   */
  const getStyles = (type) => {
    switch (type) {
      case 'success':
        return {
          container: 'bg-green-50 border-green-500 text-green-800',
          icon: 'text-green-500',
          closeButton: 'text-green-500 hover:bg-green-100'
        };
      case 'error':
        return {
          container: 'bg-red-50 border-red-500 text-red-800',
          icon: 'text-red-500',
          closeButton: 'text-red-500 hover:bg-red-100'
        };
      case 'warning':
        return {
          container: 'bg-yellow-50 border-yellow-500 text-yellow-800',
          icon: 'text-yellow-500',
          closeButton: 'text-yellow-500 hover:bg-yellow-100'
        };
      case 'info':
      default:
        return {
          container: 'bg-blue-50 border-blue-500 text-blue-800',
          icon: 'text-blue-500',
          closeButton: 'text-blue-500 hover:bg-blue-100'
        };
    }
  };
  
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md">
      {notifications.map(notification => {
        const styles = getStyles(notification.type);
        
        return (
          <div
            key={notification.id}
            className={`flex items-start p-3 rounded-lg shadow-md border-l-4 ${styles.container} animate-fade-in`}
            role="alert"
          >
            <div className={`mr-3 ${styles.icon}`}>
              {getIcon(notification.type)}
            </div>
            
            <div className="flex-1 mr-2">
              <p className="text-sm font-medium">{notification.message}</p>
            </div>
            
            <button
              onClick={() => removeNotification(notification.id)}
              className={`p-1 rounded-full ${styles.closeButton}`}
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default Notifications;

