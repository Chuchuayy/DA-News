import Image from 'next/image';
import { FALLBACK_COVER } from '../../lib/format';

// Only the Supabase Storage host is allow-listed for on-the-fly optimization
// (see next.config.js). Any other remote host is rendered as-is via
// `unoptimized` so external covers still work without widening the allow-list.
const OPTIMIZABLE_HOSTS = new Set(['femroomripuxyscdenwj.supabase.co', 'images.unsplash.com']);

function isOptimizable(src) {
  if (!src) return false;
  if (src.startsWith('/')) return true;
  try {
    return OPTIMIZABLE_HOSTS.has(new URL(src).hostname);
  } catch {
    return false;
  }
}

/**
 * Article cover image built on `next/image`.
 * - Always descriptive `alt` and explicit `width`/`height`.
 * - Non-hero images lazy-load; the hero passes `priority` for a fast LCP.
 * - Falls back to the bundled DA News cover when no image is available.
 */
export default function CoverImage({
  src,
  alt,
  width,
  height,
  className = '',
  sizes,
  priority = false,
}) {
  const source = src || FALLBACK_COVER;

  return (
    <Image
      src={source}
      alt={alt || 'DA News'}
      width={width}
      height={height}
      className={className}
      sizes={sizes}
      priority={priority}
      loading={priority ? undefined : 'lazy'}
      unoptimized={!isOptimizable(source)}
    />
  );
}
