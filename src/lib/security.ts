import DOMPurify from 'dompurify';

/**
 * Security utilities for input sanitization and XSS prevention.
 */

/**
 * Sanitizes HTML content to prevent XSS attacks.
 * @param dirty - The raw HTML string to sanitize
 * @returns Sanitized HTML string safe for rendering
 */
export function sanitizeHTML(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'span', 'div'],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'class'],
    ADD_ATTR: ['target'],
    FORCE_BODY: true,
  });
}

/**
 * Sanitizes text content by escaping HTML entities.
 * @param text - The raw text to sanitize
 * @returns Sanitized text safe for display
 */
export function sanitizeText(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Validates and sanitizes a wallet address.
 * @param address - The wallet address to validate
 * @returns Sanitized address or null if invalid
 */
export function sanitizeWalletAddress(address: string): string | null {
  const trimmed = address.trim();
  // Basic Ethereum address validation (0x + 40 hex chars)
  const ethRegex = /^0x[a-fA-F0-9]{40}$/;
  if (ethRegex.test(trimmed)) {
    return trimmed.toLowerCase();
  }
  return null;
}

/**
 * Sanitizes URL to prevent javascript: protocol attacks.
 * @param url - The URL to sanitize
 * @returns Sanitized URL or empty string if invalid
 */
export function sanitizeURL(url: string): string {
  try {
    const parsed = new URL(url);
    if (parsed.protocol === 'javascript:') {
      return '';
    }
    return parsed.href;
  } catch {
    return '';
  }
}

/**
 * Escapes special characters for safe JSON parsing.
 * @param str - The string to escape
 * @returns Escaped string
 */
export function escapeJSON(str: string): string {
  return str.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\t/g, '\\t');
}

/**
 * Creates a CSRF token placeholder (to be implemented with backend).
 * In production, this should fetch from HTTP-only cookie or server endpoint.
 */
export function getCSRFToken(): string | null {
  // In production, fetch from secure HTTP-only cookie
  // For now, return null as placeholder
  return null;
}

/**
 * Sets CSRF token header for fetch requests.
 * @param headers - Existing headers object
 * @returns Headers with CSRF token added
 */
export function withCSRF(headers: Record<string, string> = {}): Record<string, string> {
  const token = getCSRFToken();
  if (token) {
    return { ...headers, 'X-CSRF-Token': token };
  }
  return headers;
}

export default {
  sanitizeHTML,
  sanitizeText,
  sanitizeWalletAddress,
  sanitizeURL,
  escapeJSON,
  getCSRFToken,
  withCSRF,
};
