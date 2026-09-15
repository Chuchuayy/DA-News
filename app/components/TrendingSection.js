import Link from 'next/link';
import CoverImage from './CoverImage';
import { formatDate, articleUrl } from '../../lib/format';

/**
 * Full-width "Trending" section: the most-viewed articles, ranked. Server
 * component — receives an already-fetched list from the page.
 */
export default function TrendingSection({ articles = [] }) {
  if (!articles.length) return null;

  return (
    <section className="border-b border-rule pb-8">
      <div className="mb-5 flex items-baseline justify-between border-b border-rule pb-4">
        <h2 className="font-serif text-2xl font-bold text-ink">Trending</h2>
        <span className="text-xs font-semibold uppercase tracking-wide text-ink-faint">
          Most read
        </span>
      </div>

      <ol className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article, index) => (
          <li key={article.id} className="group flex items-start gap-4">
            <span className="w-6 shrink-0 font-serif text-2xl font-bold leading-none text-brand">
              {index + 1}
            </span>
            <Link href={articleUrl(article)} className="flex min-w-0 flex-1 items-start gap-3">
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-surface">
                <CoverImage
                  src={article.cover_image}
                  alt={article.title}
                  width={160}
                  height={160}
                  sizes="64px"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <h3 className="line-clamp-2 text-sm font-bold leading-snug text-ink transition group-hover:text-brand">
                  {article.title}
                </h3>
                <p className="mt-1 text-xs text-ink-soft">
                  {formatDate(article.created_at)}
                  {typeof article.views === 'number' ? ` · ${article.views} views` : ''}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}
