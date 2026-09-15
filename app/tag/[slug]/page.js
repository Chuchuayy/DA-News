'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ArticleCard from '../../components/ArticleCard';
import { getArticlesByTag } from '../../../lib/queries';

export default function TagPage() {
  const params = useParams();
  const slug = params?.slug;
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    let active = true;

    const load = async () => {
      setLoading(true);
      try {
        // Tag keywords are matched against article title/content.
        const term = decodeURIComponent(slug).replace(/-/g, ' ');
        const { data } = await getArticlesByTag(term);
        if (active) setArticles(data || []);
      } catch (error) {
        console.error('Error loading tag:', error);
      } finally {
        if (active) setLoading(false);
      }
    };

    load();
    return () => {
      active = false;
    };
  }, [slug]);

  const label = decodeURIComponent(slug || '').replace(/-/g, ' ');

  return (
    <div>
      <div className="section-bar">
        <h1 className="section-bar__title text-xl">
          Tag: <span className="capitalize">{label}</span>
        </h1>
        <span className="text-xs text-ink-soft">{articles.length} artikel</span>
      </div>

      {loading ? (
        <div className="py-16 text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-primary border-b-transparent" />
          <p className="text-sm text-ink-soft">Memuat berita...</p>
        </div>
      ) : articles.length === 0 ? (
        <p className="py-12 text-center text-sm text-ink-soft">
          Belum ada berita dengan tag ini.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}
