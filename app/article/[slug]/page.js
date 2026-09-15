'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Comments from '../../components/Comments';
import { getArticleBySlug } from '../../../lib/queries';
import { formatDate, FALLBACK_COVER } from '../../../lib/format';

export default function ArticlePage() {
  const params = useParams();
  const slug = params?.slug;
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    let active = true;

    const load = async () => {
      setLoading(true);
      setNotFound(false);
      try {
        const { data } = await getArticleBySlug(slug);
        if (!active) return;
        if (!data) {
          setNotFound(true);
          return;
        }
        setArticle(data);
      } catch (error) {
        console.error('Error loading article:', error);
        if (active) setNotFound(true);
      } finally {
        if (active) setLoading(false);
      }
    };

    load();
    return () => {
      active = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-brand border-b-transparent" />
        <p className="text-sm text-ink-soft">Loading…</p>
      </div>
    );
  }

  if (notFound || !article) {
    return (
      <div className="py-20 text-center">
        <h1 className="font-serif text-2xl font-bold text-ink">Article not found</h1>
        <p className="mt-2 text-sm text-ink-soft">
          The story you are looking for may have been removed.
        </p>
        <Link href="/" className="btn-brand mt-6">
          Back to home
        </Link>
      </div>
    );
  }

  const category = article.categories;
  const author = article.profiles;
  // Admin stores plain text; seed/legacy rows may contain HTML. Support both.
  const body = article.content || '';
  const isHtml = /<\/?[a-z][\s\S]*>/i.test(body);

  return (
    <article className="mx-auto max-w-3xl">
      {category ? (
        <Link href={`/category/${category.slug}`} className="pill pill-brand">
          {category.name}
        </Link>
      ) : null}

      <h1 className="mt-4 font-serif text-3xl font-bold leading-tight text-ink sm:text-4xl">
        {article.title}
      </h1>

      <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
        <span className="font-medium text-ink">{author?.display_name || 'DA News'}</span>
        <span className="text-ink-faint">•</span>
        <span className="font-medium text-date">{formatDate(article.created_at)}</span>
      </div>

      <figure className="mt-7">
        <div className="aspect-[16/9] overflow-hidden rounded-2xl bg-surface">
          <img
            src={article.cover_image || FALLBACK_COVER}
            alt={article.title}
            className="h-full w-full object-cover"
          />
        </div>
      </figure>

      {/* Body: stored as HTML (seed/legacy) or plain text (admin textarea) */}
      {isHtml ? (
        <div className="article-body mt-8" dangerouslySetInnerHTML={{ __html: body }} />
      ) : (
        <div className="article-body mt-8 whitespace-pre-line">{body}</div>
      )}

      <Comments articleId={article.id} />
    </article>
  );
}
