import React, { createContext, useState, useContext, useEffect } from 'react';

// Create the accessibility context
const A11yContext = createContext();

/**
 * Accessibility Provider Component
 * 
 * This component provides accessibility features and settings to the application.
 * It handles high contrast mode, font size adjustments, and focus management.
 */
export const A11yProvider = ({ children }) => {
  // Load settings from localStorage
  const loadSetting = (key, defaultValue) => {
    const storedValue = localStorage.getItem(`a11y_${key}`);
    return storedValue !== null ? JSON.parse(storedValue) : defaultValue;
  };
  
  // State for accessibility settings
  const [highContrast, setHighContrast] = useState(loadSetting('highContrast', false));
  const [largeText, setLargeText] = useState(loadSetting('largeText', false));
  const [reducedMotion, setReducedMotion] = useState(loadSetting('reducedMotion', false));
  const [focusVisible, setFocusVisible] = useState(true);
  
  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem('a11y_highContrast', JSON.stringify(highContrast));
  }, [highContrast]);
  
  useEffect(() => {
    localStorage.setItem('a11y_largeText', JSON.stringify(largeText));
  }, [largeText]);
  
  useEffect(() => {
    localStorage.setItem('a11y_reducedMotion', JSON.stringify(reducedMotion));
  }, [reducedMotion]);
  
  // Check for system preferences
  useEffect(() => {
    // Check for prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (prefersReducedMotion.matches) {
      setReducedMotion(true);
    }
    
    // Check for prefers-contrast
    const prefersContrast = window.matchMedia('(prefers-contrast: more)');
    if (prefersContrast.matches) {
      setHighContrast(true);
    }
    
    // Listen for keyboard navigation to show focus outlines
    const handleKeyDown = (e) => {
      if (e.key === 'Tab') {
        setFocusVisible(true);
      }
    };
    
    const handleMouseDown = () => {
      setFocusVisible(false);
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('mousedown', handleMouseDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);
  
  // Apply accessibility classes to the document
  useEffect(() => {
    const classList = document.documentElement.classList;
    
    if (highContrast) {
      classList.add('high-contrast');
    } else {
      classList.remove('high-contrast');
    }
    
    if (largeText) {
      classList.add('large-text');
    } else {
      classList.remove('large-text');
    }
    
    if (reducedMotion) {
      classList.add('reduced-motion');
    } else {
      classList.remove('reduced-motion');
    }
    
    if (focusVisible) {
      classList.add('focus-visible');
    } else {
      classList.remove('focus-visible');
    }
  }, [highContrast, largeText, reducedMotion, focusVisible]);
  
  /**
   * Toggle high contrast mode
   */
  const toggleHighContrast = () => {
    setHighContrast(prev => !prev);
  };
  
  /**
   * Toggle large text mode
   */
  const toggleLargeText = () => {
    setLargeText(prev => !prev);
  };
  
  /**
   * Toggle reduced motion mode
   */
  const toggleReducedMotion = () => {
    setReducedMotion(prev => !prev);
  };
  
  /**
   * Reset all accessibility settings to defaults
   */
  const resetSettings = () => {
    setHighContrast(false);
    setLargeText(false);
    setReducedMotion(false);
  };
  
  // Context value
  const value = {
    highContrast,
    largeText,
    reducedMotion,
    focusVisible,
    toggleHighContrast,
    toggleLargeText,
    toggleReducedMotion,
    resetSettings
  };
  
  return (
    <A11yContext.Provider value={value}>
      {children}
    </A11yContext.Provider>
  );
};

/**
 * Custom hook to use the accessibility context
 * @returns {Object} Accessibility context value
 */
export const useA11y = () => {
  const context = useContext(A11yContext);
  
  if (!context) {
    throw new Error('useA11y must be used within an A11yProvider');
  }
  
  return context;
};

export default A11yContext;

