'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import ArticleCard from '../components/ArticleCard';
import { searchArticles } from '../../lib/queries';

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;

    const load = async () => {
      if (!query.trim()) {
        setArticles([]);
        return;
      }
      setLoading(true);
      try {
        const { data } = await searchArticles(query);
        if (active) setArticles(data || []);
      } catch (error) {
        console.error('Error searching articles:', error);
      } finally {
        if (active) setLoading(false);
      }
    };

    load();
    return () => {
      active = false;
    };
  }, [query]);

  return (
    <div>
      <div className="section-bar">
        <h1 className="section-bar__title text-xl">Pencarian</h1>
        {query ? <span className="text-xs text-ink-soft">{articles.length} hasil</span> : null}
      </div>

      {!query.trim() ? (
        <p className="py-12 text-center text-sm text-ink-soft">
          Masukkan kata kunci untuk mencari berita.
        </p>
      ) : loading ? (
        <div className="py-16 text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-primary border-b-transparent" />
          <p className="text-sm text-ink-soft">Mencari berita...</p>
        </div>
      ) : articles.length === 0 ? (
        <p className="py-12 text-center text-sm text-ink-soft">
          Tidak ada berita yang cocok dengan &ldquo;{query}&rdquo;.
        </p>
      ) : (
        <>
          <p className="mb-6 text-sm text-ink-soft">
            Menampilkan hasil untuk <span className="font-semibold text-ink">{query}</span>
          </p>
          <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="py-16 text-center text-sm text-ink-soft">Memuat pencarian...</div>
      }
    >
      <SearchResults />
    </Suspense>
  );
}
