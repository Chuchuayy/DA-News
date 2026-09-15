import Link from 'next/link';
import { timeAgo } from '../../lib/format';

/** Ranked list item used in popular / latest sidebars. */
export default function ArticleListItem({ article, rank, showRank = true }) {
  if (!article) return null;

  return (
    <article className="group flex gap-3 border-b border-rule pb-3 last:border-0 last:pb-0">
      {showRank ? (
        <span className="w-6 shrink-0 text-xl font-extrabold leading-none text-primary/30">
          {rank}
        </span>
      ) : null}
      <div className="min-w-0">
        <Link href={`/article/${article.slug}`}>
          <h3 className="card__title line-clamp-3 text-sm">{article.title}</h3>
        </Link>
        <p className="meta mt-1">{timeAgo(article.created_at)}</p>
      </div>
    </article>
  );
}
