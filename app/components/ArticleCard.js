import Link from 'next/link';
import { formatDate, FALLBACK_COVER } from '../../lib/format';

/** Minimal article card: image, teal category badge, 2-line title, date. */
export default function ArticleCard({ article }) {
  if (!article) return null;

  const category = article.categories;

  return (
    <article className="group">
      <Link href={`/article/${article.slug}`} className="block">
        <div className="relative overflow-hidden rounded-2xl bg-surface transition duration-300 group-hover:-translate-y-1 group-hover:shadow-lift">
          <div className="aspect-[16/10] w-full overflow-hidden">
            <img
              src={article.cover_image || FALLBACK_COVER}
              alt={article.title}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>
          {category ? (
            <span className="pill pill-brand absolute left-3 top-3">{category.name}</span>
          ) : null}
        </div>
        <h3 className="mt-3 line-clamp-2 text-base font-bold leading-snug text-ink transition group-hover:text-brand">
          {article.title}
        </h3>
      </Link>
      <p className="mt-1 text-xs text-ink-soft">{formatDate(article.created_at)}</p>
    </article>
  );
}
