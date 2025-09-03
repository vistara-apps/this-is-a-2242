import React, { Component } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import logger from '../utils/logger';

/**
 * ErrorBoundary Component
 * 
 * This component catches JavaScript errors anywhere in its child component tree,
 * logs those errors, and displays a fallback UI instead of crashing the whole app.
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }
  
  /**
   * Update state when an error occurs
   * @param {Error} error - The error that was thrown
   * @returns {Object} New state with error information
   */
  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }
  
  /**
   * Catch errors in any components below and re-render with error message
   * @param {Error} error - The error that was thrown
   * @param {Object} errorInfo - Component stack information
   */
  componentDidCatch(error, errorInfo) {
    // Log the error to the console and to our logging service
    logger.error('Uncaught error in component:', {
      error,
      componentStack: errorInfo.componentStack
    });
    
    this.setState({
      errorInfo
    });
    
    // You can also log the error to an error reporting service like Sentry
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }
  
  /**
   * Reset the error state
   */
  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };
  
  render() {
    const { hasError, error, errorInfo } = this.state;
    const { fallback, children } = this.props;
    
    // If there's an error, render the fallback UI or the default error view
    if (hasError) {
      // If a custom fallback is provided, use it
      if (fallback) {
        return fallback(error, errorInfo, this.handleReset);
      }
      
      // Default error UI
      return (
        <div className="p-6 bg-red-50 rounded-lg border border-red-200 text-center">
          <div className="flex justify-center mb-4">
            <AlertTriangle className="w-16 h-16 text-red-500" />
          </div>
          
          <h2 className="text-xl font-bold text-red-700 mb-2">Something went wrong</h2>
          
          <p className="text-red-600 mb-4">
            An error occurred while rendering this component.
          </p>
          
          {process.env.NODE_ENV !== 'production' && error && (
            <div className="mb-4 p-3 bg-red-100 rounded text-left overflow-auto max-h-40">
              <p className="font-mono text-sm text-red-800">{error.toString()}</p>
              {errorInfo && (
                <details className="mt-2">
                  <summary className="text-sm font-medium text-red-700 cursor-pointer">
                    Component Stack
                  </summary>
                  <pre className="mt-2 text-xs text-red-800 overflow-auto">
                    {errorInfo.componentStack}
                  </pre>
                </details>
              )}
            </div>
          )}
          
          <div className="flex justify-center space-x-4">
            <button
              onClick={this.handleReset}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </button>
            
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-steel-600 text-white rounded-md hover:bg-steel-700 transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    
    // If there's no error, render the children
    return children;
  }
}

export default ErrorBoundary;

