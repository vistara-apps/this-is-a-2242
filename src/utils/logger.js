/**
 * Logger Utility
 * 
 * This module provides logging functions for the application.
 * It supports different log levels and can be configured to send logs to a server.
 */

// Log levels
export const LogLevel = {
  DEBUG: 'debug',
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error'
};

// Default configuration
const defaultConfig = {
  level: process.env.NODE_ENV === 'production' ? LogLevel.INFO : LogLevel.DEBUG,
  enableConsole: true,
  enableRemote: false,
  remoteUrl: null,
  appName: 'conference-room-app',
  version: '1.0.0'
};

// Current configuration
let config = { ...defaultConfig };

/**
 * Configure the logger
 * @param {Object} options - Configuration options
 */
export const configure = (options = {}) => {
  config = {
    ...config,
    ...options
  };
};

/**
 * Check if a log level should be logged
 * @param {string} level - The log level to check
 * @returns {boolean} True if the level should be logged
 */
const shouldLog = (level) => {
  const levels = Object.values(LogLevel);
  const configLevelIndex = levels.indexOf(config.level);
  const logLevelIndex = levels.indexOf(level);
  
  return logLevelIndex >= configLevelIndex;
};

/**
 * Format a log message
 * @param {string} level - Log level
 * @param {string} message - Log message
 * @param {Object} data - Additional log data
 * @returns {Object} Formatted log object
 */
const formatLog = (level, message, data = {}) => {
  return {
    timestamp: new Date().toISOString(),
    level,
    message,
    data,
    app: config.appName,
    version: config.version,
    environment: process.env.NODE_ENV || 'development'
  };
};

/**
 * Send a log to the console
 * @param {string} level - Log level
 * @param {string} message - Log message
 * @param {Object} data - Additional log data
 */
const consoleLog = (level, message, data = {}) => {
  if (!config.enableConsole || !shouldLog(level)) {
    return;
  }
  
  const formattedLog = formatLog(level, message, data);
  
  switch (level) {
    case LogLevel.DEBUG:
      console.debug(`[${formattedLog.timestamp}] [${level.toUpperCase()}] ${message}`, data);
      break;
    case LogLevel.INFO:
      console.info(`[${formattedLog.timestamp}] [${level.toUpperCase()}] ${message}`, data);
      break;
    case LogLevel.WARN:
      console.warn(`[${formattedLog.timestamp}] [${level.toUpperCase()}] ${message}`, data);
      break;
    case LogLevel.ERROR:
      console.error(`[${formattedLog.timestamp}] [${level.toUpperCase()}] ${message}`, data);
      break;
    default:
      console.log(`[${formattedLog.timestamp}] [${level.toUpperCase()}] ${message}`, data);
  }
};

/**
 * Send a log to a remote server
 * @param {string} level - Log level
 * @param {string} message - Log message
 * @param {Object} data - Additional log data
 */
const remoteLog = async (level, message, data = {}) => {
  if (!config.enableRemote || !config.remoteUrl || !shouldLog(level)) {
    return;
  }
  
  try {
    const formattedLog = formatLog(level, message, data);
    
    await fetch(config.remoteUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formattedLog)
    });
  } catch (error) {
    // Fallback to console if remote logging fails
    console.error('Failed to send log to remote server:', error);
  }
};

/**
 * Log a debug message
 * @param {string} message - Log message
 * @param {Object} data - Additional log data
 */
export const debug = (message, data = {}) => {
  consoleLog(LogLevel.DEBUG, message, data);
  remoteLog(LogLevel.DEBUG, message, data);
};

/**
 * Log an info message
 * @param {string} message - Log message
 * @param {Object} data - Additional log data
 */
export const info = (message, data = {}) => {
  consoleLog(LogLevel.INFO, message, data);
  remoteLog(LogLevel.INFO, message, data);
};

/**
 * Log a warning message
 * @param {string} message - Log message
 * @param {Object} data - Additional log data
 */
export const warn = (message, data = {}) => {
  consoleLog(LogLevel.WARN, message, data);
  remoteLog(LogLevel.WARN, message, data);
};

/**
 * Log an error message
 * @param {string} message - Log message
 * @param {Error|Object} error - Error object or additional data
 */
export const error = (message, error = {}) => {
  let errorData = {};
  
  if (error instanceof Error) {
    errorData = {
      name: error.name,
      message: error.message,
      stack: error.stack,
      ...error
    };
  } else {
    errorData = error;
  }
  
  consoleLog(LogLevel.ERROR, message, errorData);
  remoteLog(LogLevel.ERROR, message, errorData);
};

/**
 * Create a logger instance with a specific context
 * @param {string} context - Logger context (e.g., component name)
 * @returns {Object} Logger instance with context
 */
export const createLogger = (context) => {
  return {
    debug: (message, data = {}) => debug(`[${context}] ${message}`, data),
    info: (message, data = {}) => info(`[${context}] ${message}`, data),
    warn: (message, data = {}) => warn(`[${context}] ${message}`, data),
    error: (message, error = {}) => error(`[${context}] ${message}`, error)
  };
};

export default {
  LogLevel,
  configure,
  debug,
  info,
  warn,
  error,
  createLogger
};

