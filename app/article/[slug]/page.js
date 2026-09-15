'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import ArticleCard from '../../components/ArticleCard';
import { getArticleBySlug, getArticles } from '../../../lib/queries';
import { formatDate, FALLBACK_COVER } from '../../../lib/format';

export default function ArticlePage() {
  const params = useParams();
  const slug = params?.slug;
  const [article, setArticle] = useState(null);
  const [related, setRelated] = useState([]);
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

        if (data.category_id) {
          const { data: rel } = await getArticles({ limit: 4, categoryId: data.category_id });
          if (active) setRelated((rel || []).filter((a) => a.id !== data.id).slice(0, 3));
        }
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
      <div className="py-16 text-center">
        <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-primary border-b-transparent" />
        <p className="text-sm text-ink-soft">Memuat artikel...</p>
      </div>
    );
  }

  if (notFound || !article) {
    return (
      <div className="py-16 text-center">
        <h1 className="text-2xl font-extrabold text-ink">Artikel tidak ditemukan</h1>
        <p className="mt-2 text-sm text-ink-soft">
          Berita yang Anda cari mungkin telah dihapus atau dipindahkan.
        </p>
        <Link href="/" className="btn-primary mt-6">
          Kembali ke Beranda
        </Link>
      </div>
    );
  }

  const category = article.categories;
  const author = article.profiles;

  return (
    <article className="mx-auto max-w-3xl">
      <nav className="mb-4 flex items-center gap-2 text-xs text-ink-soft">
        <Link href="/" className="hover:text-primary">
          Home
        </Link>
        {category ? (
          <>
            <span>/</span>
            <Link href={`/category/${category.slug}`} className="hover:text-primary">
              {category.name}
            </Link>
          </>
        ) : null}
      </nav>

      {category ? (
        <Link href={`/category/${category.slug}`} className="kicker">
          {category.name}
        </Link>
      ) : null}

      <h1 className="mt-2 text-3xl font-extrabold leading-tight text-ink sm:text-4xl">
        {article.title}
      </h1>

      <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 border-y border-rule py-3 text-xs text-ink-soft">
        {author ? (
          <Link href={`/author/${author.id}`} className="font-semibold text-ink hover:text-primary">
            {author.display_name || 'Redaksi DA News'}
          </Link>
        ) : (
          <span className="font-semibold text-ink">Redaksi DA News</span>
        )}
        <span>•</span>
        <span>{formatDate(article.created_at)}</span>
      </div>

      {article.cover_image ? (
        <figure className="mt-6">
          <div className="aspect-[16/9] overflow-hidden rounded bg-primary-soft">
            <img
              src={article.cover_image || FALLBACK_COVER}
              alt={article.title}
              className="h-full w-full object-cover"
            />
          </div>
        </figure>
      ) : null}

      {/* Rich-text body stored as HTML in `articles.content` */}
      <div
        className="article-body mt-8"
        dangerouslySetInnerHTML={{ __html: article.content || '' }}
      />

      {related.length > 0 ? (
        <section className="mt-12">
          <div className="section-bar">
            <h2 className="section-bar__title">Berita Terkait</h2>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {related.map((item) => (
              <ArticleCard key={item.id} article={item} showSummary={false} />
            ))}
          </div>
        </section>
      ) : null}
    </article>
  );
}
