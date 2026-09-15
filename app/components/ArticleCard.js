import Link from 'next/link';
import { excerpt, formatDate, FALLBACK_COVER } from '../../lib/format';

/**
 * Reusable article card. Variants:
 * - `default`: cover on top, headline + summary (grids)
 * - `horizontal`: thumbnail left, text right (lists)
 * - `compact`: small thumbnail, headline only (sidebars)
 */
export default function ArticleCard({ article, variant = 'default', showSummary = true }) {
  if (!article) return null;

  const href = `/article/${article.slug}`;
  const category = article.categories;
  const summary = excerpt(article.content, variant === 'compact' ? 90 : 150);

  if (variant === 'horizontal') {
    return (
      <article className="group flex gap-3">
        <Link href={href} className="block w-28 shrink-0 sm:w-36">
          <div className="aspect-[4/3] overflow-hidden rounded bg-primary-soft">
            <img
              src={article.cover_image || FALLBACK_COVER}
              alt={article.title}
              loading="lazy"
              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            />
          </div>
        </Link>
        <div className="min-w-0">
          {category ? (
            <Link href={`/category/${category.slug}`} className="kicker">
              {category.name}
            </Link>
          ) : null}
          <Link href={href}>
            <h3 className="card__title mt-1 line-clamp-2 text-headline-sm">{article.title}</h3>
          </Link>
          {showSummary && summary ? (
            <p className="card__summary mt-1 line-clamp-2 hidden sm:block">{summary}</p>
          ) : null}
          <p className="meta mt-1">{formatDate(article.created_at)}</p>
        </div>
      </article>
    );
  }

  if (variant === 'compact') {
    return (
      <article className="group flex gap-3">
        <span className="text-lg font-extrabold leading-none text-primary/30">•</span>
        <div className="min-w-0">
          <Link href={href}>
            <h3 className="card__title line-clamp-3 text-sm">{article.title}</h3>
          </Link>
          <p className="meta mt-1">{formatDate(article.created_at)}</p>
        </div>
      </article>
    );
  }

  return (
    <article className="card group">
      <Link href={href} className="block">
        <div className="aspect-[16/9] overflow-hidden rounded bg-primary-soft">
          <img
            src={article.cover_image || FALLBACK_COVER}
            alt={article.title}
            loading="lazy"
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        </div>
      </Link>
      <div className="pt-3">
        {category ? (
          <Link href={`/category/${category.slug}`} className="kicker">
            {category.name}
          </Link>
        ) : null}
        <Link href={href}>
          <h3 className="card__title mt-1 line-clamp-2 text-headline-md">{article.title}</h3>
        </Link>
        {showSummary && summary ? (
          <p className="card__summary mt-2 line-clamp-3">{summary}</p>
        ) : null}
        <p className="meta mt-2">{formatDate(article.created_at)}</p>
      </div>
    </article>
  );
}
