/**
 * Development-only logging helpers.
 * In production builds nothing is written to the console, so user data and
 * internal error details never leak through browser dev tools.
 */
export const logError = (...args: unknown[]) => {
  if (import.meta.env.DEV) {
    console.error(...args);
  }
};

export const logDebug = (...args: unknown[]) => {
  if (import.meta.env.DEV) {
    console.log(...args);
  }
};
