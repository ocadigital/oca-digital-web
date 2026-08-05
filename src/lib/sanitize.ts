import DOMPurify from 'dompurify';

/**
 * Sanitizes untrusted HTML (e.g. blog post content) before it is rendered
 * with dangerouslySetInnerHTML. Strips scripts, event handlers and other
 * XSS vectors while keeping normal rich-text markup.
 */
export const sanitizeHtml = (html: string): string =>
  DOMPurify.sanitize(html ?? '', {
    USE_PROFILES: { html: true },
    FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed', 'form', 'input'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'style', 'formaction'],
  });
