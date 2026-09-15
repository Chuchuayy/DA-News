import Link from 'next/link';
import CoverImage from './CoverImage';
import { formatDate, articleUrl } from '../../lib/format';

/** Right-rail "New Article" widget listing the latest published articles. */
export default function NewArticleWidget({ articles = [] }) {
  if (!articles.length) return null;

  return (
    <section className="rounded-2xl border border-rule p-5">
      <h2 className="mb-4 font-serif text-lg font-bold text-ink">New Article</h2>
      <ul className="space-y-4">
        {articles.map((article) => (
          <li key={article.id} className="group flex gap-3">
            <Link href={articleUrl(article)} className="block w-16 shrink-0">
              <div className="aspect-square overflow-hidden rounded-xl bg-surface">
                <CoverImage
                  src={article.cover_image}
                  alt={article.title}
                  width={200}
                  height={200}
                  sizes="64px"
                  className="h-full w-full object-cover"
                />
              </div>
            </Link>
            <div className="min-w-0">
              <Link href={articleUrl(article)}>
                <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-ink transition group-hover:text-brand">
                  {article.title}
                </h3>
              </Link>
              <p className="mt-1 text-xs text-ink-soft">{formatDate(article.created_at)}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
