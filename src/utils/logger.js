/**
 * Logger Utility
 *
 * Centralized logging with environment-based control.
 * In production, only errors are logged.
 * In development, all logs are visible.
 */

const isDevelopment = import.meta.env.DEV;

export const logger = {
  /**
   * Info logs - only in development
   */
  info: (...args) => {
    if (isDevelopment) {
      console.log(...args);
    }
  },

  /**
   * Warning logs - only in development
   */
  warn: (...args) => {
    if (isDevelopment) {
      console.warn(...args);
    }
  },

  /**
   * Error logs - always logged (even in production)
   */
  error: (...args) => {
    console.error(...args);
  },

  /**
   * Debug logs - only in development, with [DEBUG] prefix
   */
  debug: (...args) => {
    if (isDevelopment) {
      console.log('[DEBUG]', ...args);
    }
  },
};

export default logger;
