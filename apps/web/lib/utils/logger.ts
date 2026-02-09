/**
 * Environment-gated logging utilities
 * 
 * Usage:
 * - Use devLog() for debug information only needed during development
 * - Use console.error() and console.warn() for production error tracking
 */

export const isDevelopment = process.env.NODE_ENV === 'development';

/**
 * Log debug information only in development environment
 * In production, these logs are suppressed
 */
export const devLog = (...args: unknown[]) => {
    if (isDevelopment) {
        console.log(...args);
    }
};

/**
 * Log debug errors only in development environment
 * For production errors, use console.error() directly
 */
export const devError = (...args: unknown[]) => {
    if (isDevelopment) {
        console.error(...args);
    }
};

/**
 * Log warnings only in development environment
 * For production warnings, use console.warn() directly
 */
export const devWarn = (...args: unknown[]) => {
    if (isDevelopment) {
        console.warn(...args);
    }
};
