// Generate random short code (TinyURL style)
export const generateShortCode = (length = 6) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};

// Validate URL format
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

// TinyURL style - clean URL (remove trailing slashes etc)
export const cleanUrl = (url) => {
    if (!url) return url;
    // Remove trailing slash
    return url.replace(/\/$/, '');
};