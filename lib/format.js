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

/** Format an ISO date string for the reader-facing UI. */
export function formatDate(value) {
  if (!value) return '';
  try {
    return new Date(value).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return '';
  }
}

/** Relative "x hours ago" style label used on list items. */
export function timeAgo(value) {
  if (!value) return '';
  const then = new Date(value).getTime();
  if (Number.isNaN(then)) return '';
  const diff = Date.now() - then;
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${Math.max(mins, 1)} menit lalu`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} jam lalu`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} hari lalu`;
  return formatDate(value);
}

/** Fallback cover image used when an article has no cover_image. */
export const FALLBACK_COVER =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360"><rect width="100%" height="100%" fill="#eff6ff"/><text x="50%" y="50%" font-family="Arial" font-size="28" fill="#2563eb" text-anchor="middle" dominant-baseline="middle">DA News</text></svg>`
  );
