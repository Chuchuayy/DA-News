/** Strip HTML tags so rich-text content can be used as a plain summary. */
export function stripHtml(html = '') {
  return html
    .toString()
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Build a short summary from article HTML content.
 * @param {string} html
 * @param {number} [max=160]
 */
export function excerpt(html = '', max = 160) {
  const text = stripHtml(html);
  if (text.length <= max) return text;
  return `${text.slice(0, max).trimEnd()}…`;
}

/** Format an ISO date string for the reader-facing UI (English). */
export function formatDate(value) {
  if (!value) return '';
  try {
    return new Date(value).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return '';
  }
}

/** Fallback cover image used when an article has no cover_image. */
export const FALLBACK_COVER =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450"><rect width="100%" height="100%" fill="#F5F5F5"/><text x="50%" y="50%" font-family="Georgia, serif" font-size="34" fill="#00C8B8" text-anchor="middle" dominant-baseline="middle">DA News</text></svg>`
  );
