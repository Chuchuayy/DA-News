'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ArticleCard from '../../components/ArticleCard';
import { getArticles, getCategoryBySlug } from '../../../lib/queries';

export default function CategoryPage() {
  const params = useParams();
  const slug = params?.slug;
  const [category, setCategory] = useState(null);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    let active = true;

    const load = async () => {
      setLoading(true);
      try {
        const cat = await getCategoryBySlug(slug);
        if (!active) return;
        setCategory(cat);

        const { data } = await getArticles({ categorySlug: slug, limit: 24 });
        if (active) setArticles(data || []);
      } catch (error) {
        console.error('Error loading category:', error);
      } finally {
        if (active) setLoading(false);
      }
    };

    load();
    return () => {
      active = false;
    };
  }, [slug]);

  const title = category?.name || 'Category';

  return (
    <div>
      <div className="mb-6 border-b border-rule pb-4">
        <h1 className="font-serif text-2xl font-bold text-ink">{title}</h1>
        <p className="mt-1 text-sm text-ink-soft">{articles.length} articles</p>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-brand border-b-transparent" />
          <p className="text-sm text-ink-soft">Loading…</p>
        </div>
      ) : articles.length === 0 ? (
        <p className="py-12 text-center text-sm text-ink-soft">
          No articles published in this category yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}
