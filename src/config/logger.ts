/**
 * =============================================================================
 * CONSOLE LOGGING CONFIGURATION
 * =============================================================================
 * Change `ENABLE_CONSOLE_LOGS` to `true` or `false` below:
 * - false: Suppresses all console output (console.log, info, warn, debug, etc.)
 * - true: Enables all console output
 * =============================================================================
 */
export const ENABLE_CONSOLE_LOGS = false;

/**
 * Set to `true` if you want `console.error` to still show in console
 * even when `ENABLE_CONSOLE_LOGS` is set to `false`.
 */
export const ALLOW_CONSOLE_ERRORS = false;

// Preserve original browser console functions
export const originalConsole = {
  log: console.log.bind(console),
  info: console.info.bind(console),
  warn: console.warn.bind(console),
  error: console.error.bind(console),
  debug: console.debug.bind(console),
  table: console.table ? console.table.bind(console) : console.log.bind(console),
  trace: console.trace ? console.trace.bind(console) : console.log.bind(console),
};

/**
 * Initialize console suppression.
 * When ENABLE_CONSOLE_LOGS is false, all console methods are replaced with no-op functions.
 */
export const initConsoleLogger = () => {
  if (typeof window === 'undefined') return;

  const isLocalStorageEnabled =
    typeof window.localStorage !== 'undefined' &&
    window.localStorage.getItem('ENABLE_CONSOLE_LOGS') === 'true';

  const isEnabled = ENABLE_CONSOLE_LOGS || isLocalStorageEnabled;

  if (!isEnabled) {
    const noop = () => {};
    window.console.log = noop;
    window.console.info = noop;
    window.console.debug = noop;
    window.console.warn = noop;
    window.console.table = noop;
    window.console.trace = noop;
    if (!ALLOW_CONSOLE_ERRORS) {
      window.console.error = noop;
    }
  } else {
    window.console.log = originalConsole.log;
    window.console.info = originalConsole.info;
    window.console.debug = originalConsole.debug;
    window.console.warn = originalConsole.warn;
    window.console.error = originalConsole.error;
    window.console.table = originalConsole.table;
    window.console.trace = originalConsole.trace;
  }

  // Developer convenience: allow toggling via DevTools console if needed
  (window as unknown as { __setConsoleLogs?: (enabled: boolean) => void }).__setConsoleLogs = (
    enabled: boolean,
  ) => {
    if (enabled) {
      window.localStorage?.setItem('ENABLE_CONSOLE_LOGS', 'true');
    } else {
      window.localStorage?.removeItem('ENABLE_CONSOLE_LOGS');
    }
    window.location.reload();
  };
};

/**
 * Safe logger utility that respects ENABLE_CONSOLE_LOGS.
 */
export const logger = {
  log: (...args: unknown[]) => {
    if (ENABLE_CONSOLE_LOGS) originalConsole.log(...args);
  },
  info: (...args: unknown[]) => {
    if (ENABLE_CONSOLE_LOGS) originalConsole.info(...args);
  },
  warn: (...args: unknown[]) => {
    if (ENABLE_CONSOLE_LOGS) originalConsole.warn(...args);
  },
  error: (...args: unknown[]) => {
    if (ENABLE_CONSOLE_LOGS || ALLOW_CONSOLE_ERRORS) originalConsole.error(...args);
  },
  debug: (...args: unknown[]) => {
    if (ENABLE_CONSOLE_LOGS) originalConsole.debug(...args);
  },
};

// Automatically apply configuration when imported
initConsoleLogger();
