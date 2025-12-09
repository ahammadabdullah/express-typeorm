export const logger = {
  /**
   * Log info messages
   */
  info: (message: string, data?: any) => {
    console.log(`[INFO] ${new Date().toISOString()} - ${message}`, data || "");
  },

  /**
   * Log error messages
   */
  error: (message: string, error?: any) => {
    console.error(
      `[ERROR] ${new Date().toISOString()} - ${message}`,
      error || ""
    );
  },

  /**
   * Log warning messages
   */
  warn: (message: string, data?: any) => {
    console.warn(`[WARN] ${new Date().toISOString()} - ${message}`, data || "");
  },

  /**
   * Log debug messages
   */
  debug: (message: string, data?: any) => {
    if (process.env.NODE_ENV === "development") {
      console.log(
        `[DEBUG] ${new Date().toISOString()} - ${message}`,
        data || ""
      );
    }
  },
};
