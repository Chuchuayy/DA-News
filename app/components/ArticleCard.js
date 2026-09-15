import Link from 'next/link';
import CoverImage from './CoverImage';
import { formatDate, articleUrl, excerpt } from '../../lib/format';

/**
 * Landscape article card: cover image on the left, text on the right, rendered
 * as a full-width horizontal row. Used for the home "Latest Stories" list and
 * category listings.
 */
export default function ArticleCard({ article }) {
  if (!article) return null;

  const category = article.categories;
  const summary = excerpt(article.content, 180);

  return (
    <article className="group">
      <Link
        href={articleUrl(article)}
        className="flex w-full gap-4 overflow-hidden rounded-2xl border border-rule bg-white p-3 transition duration-300 group-hover:border-brand/40 group-hover:shadow-lift sm:gap-5 sm:p-4"
      >
        <div className="relative w-32 shrink-0 overflow-hidden rounded-xl bg-surface sm:w-48 md:w-64">
          <div className="aspect-[4/3] h-full w-full overflow-hidden">
            <CoverImage
              src={article.cover_image}
              alt={article.title}
              width={640}
              height={480}
              sizes="(max-width: 640px) 128px, (max-width: 768px) 192px, 256px"
              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            />
          </div>
          {category ? (
            <span className="pill pill-brand absolute left-2 top-2">{category.name}</span>
          ) : null}
        </div>

        <div className="flex min-w-0 flex-1 flex-col justify-center">
          <h3 className="line-clamp-2 text-base font-bold leading-snug text-ink transition group-hover:text-brand sm:text-lg">
            {article.title}
          </h3>
          <p className="mt-1 text-xs text-ink-soft">{formatDate(article.created_at)}</p>
          {summary ? (
            <p className="mt-2 hidden line-clamp-2 text-sm leading-relaxed text-ink-soft sm:block">
              {summary}
            </p>
          ) : null}
        </div>
      </Link>
    </article>
  );
}
