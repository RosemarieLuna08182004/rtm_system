import DOMPurify from 'dompurify';

/**
 * Cleans rich text (from the text editor or an import) before it is shown with
 * dangerouslySetInnerHTML. Keeps normal formatting (bold, lists, links, headings...)
 * and removes anything that could run code: <script>, <iframe>, event handlers such
 * as onclick, and javascript: links. Use it for every piece of stored HTML.
 */
export const sanitizeHtml = (html?: string | TrustedHTML | null): string =>
    html ? DOMPurify.sanitize(String(html), { USE_PROFILES: { html: true }, FORBID_TAGS: ['style', 'form', 'input', 'button'] }) : '';

// Links in stored content open in a new tab and can't control the admin page
DOMPurify.addHook('afterSanitizeAttributes', (node) => {
    if (node.tagName === 'A' && node.getAttribute('href')) {
        node.setAttribute('target', '_blank');
        node.setAttribute('rel', 'noopener noreferrer');
    }
});
