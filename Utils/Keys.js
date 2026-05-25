/**
 * Generate a random short ID for URL shortening
 * @param {number} length - Length of the short ID (default: 6)
 * @returns {string} Random alphanumeric string
 */
export const generateShortId = (length = 6) => {
  // Characters to use for generating short ID
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    result += chars.charAt(randomIndex);
  }
  
  console.log("Generated shortId:", result); // Debug log
  return result;
};

/**
 * Validate URL format
 * @param {string} url - URL to validate
 * @returns {boolean} True if valid URL
 */
export const isValidUrl = (url) => {
  if (!url) return false;
  try {
    // Must have http:// or https://
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return false;
    }
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Clean URL (remove trailing slashes)
 * @param {string} url - URL to clean
 * @returns {string} Cleaned URL
 */
export const cleanUrl = (url) => {
  if (!url) return url;
  // Remove trailing slash
  return url.replace(/\/$/, '');
};
