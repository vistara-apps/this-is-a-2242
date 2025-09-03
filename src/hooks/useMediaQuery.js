import { useState, useEffect } from 'react';

/**
 * Custom hook for responsive design using media queries
 * @param {string} query - CSS media query string
 * @returns {boolean} True if the media query matches
 * 
 * @example
 * // Check if screen is at least medium size (768px)
 * const isMediumScreen = useMediaQuery('(min-width: 768px)');
 * 
 * // Check if user prefers dark mode
 * const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
 */
const useMediaQuery = (query) => {
  // Initialize with the current match state
  const getMatches = (query) => {
    // Check if window is defined (for SSR)
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false;
  };
  
  const [matches, setMatches] = useState(getMatches(query));
  
  // Update matches state when the media query changes
  useEffect(() => {
    // Check if window is defined (for SSR)
    if (typeof window === 'undefined') {
      return;
    }
    
    const mediaQuery = window.matchMedia(query);
    
    // Update the state with the current value
    const updateMatches = () => {
      setMatches(mediaQuery.matches);
    };
    
    // Listen for changes
    mediaQuery.addEventListener('change', updateMatches);
    
    // Initial check
    updateMatches();
    
    // Cleanup
    return () => {
      mediaQuery.removeEventListener('change', updateMatches);
    };
  }, [query]);
  
  return matches;
};

/**
 * Predefined media queries for common breakpoints
 */
export const breakpoints = {
  sm: '(min-width: 640px)',
  md: '(min-width: 768px)',
  lg: '(min-width: 1024px)',
  xl: '(min-width: 1280px)',
  '2xl': '(min-width: 1536px)',
  
  // Orientation
  portrait: '(orientation: portrait)',
  landscape: '(orientation: landscape)',
  
  // User preferences
  darkMode: '(prefers-color-scheme: dark)',
  lightMode: '(prefers-color-scheme: light)',
  reducedMotion: '(prefers-reduced-motion: reduce)',
  highContrast: '(prefers-contrast: more)'
};

/**
 * Custom hooks for common breakpoints
 */
export const useIsMobile = () => !useMediaQuery(breakpoints.md);
export const useIsTablet = () => useMediaQuery(breakpoints.md) && !useMediaQuery(breakpoints.lg);
export const useIsDesktop = () => useMediaQuery(breakpoints.lg);
export const useIsPortrait = () => useMediaQuery(breakpoints.portrait);
export const useIsLandscape = () => useMediaQuery(breakpoints.landscape);
export const usePrefersDarkMode = () => useMediaQuery(breakpoints.darkMode);
export const usePrefersReducedMotion = () => useMediaQuery(breakpoints.reducedMotion);
export const usePrefersHighContrast = () => useMediaQuery(breakpoints.highContrast);

export default useMediaQuery;

