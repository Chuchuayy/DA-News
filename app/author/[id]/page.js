'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ArticleCard from '../../components/ArticleCard';
import { getArticles, getAuthorById } from '../../../lib/queries';

export default function AuthorPage() {
  const params = useParams();
  const id = params?.id;
  const [author, setAuthor] = useState(null);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    let active = true;

    const load = async () => {
      setLoading(true);
      try {
        const [{ data: profile }, { data: list }] = await Promise.all([
          getAuthorById(id),
          getArticles({ authorId: id, limit: 24 }),
        ]);
        if (!active) return;
        setAuthor(profile);
        setArticles(list || []);
      } catch (error) {
        console.error('Error loading author:', error);
      } finally {
        if (active) setLoading(false);
      }
    };

    load();
    return () => {
      active = false;
    };
  }, [id]);

  const name = author?.display_name || 'Redaksi DA News';

  return (
    <div>
      <header className="mb-8 flex items-center gap-4 border-b-2 border-primary pb-5">
        <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-primary-soft text-xl font-extrabold text-primary">
          {author?.avatar_url ? (
            <img src={author.avatar_url} alt={name} className="h-full w-full object-cover" />
          ) : (
            name.charAt(0).toUpperCase()
          )}
        </div>
        <div>
          <h1 className="text-xl font-extrabold text-ink">{name}</h1>
          <p className="text-sm text-ink-soft">
            {articles.length} artikel diterbitkan di DA News
          </p>
        </div>
      </header>

      {loading ? (
        <div className="py-16 text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-primary border-b-transparent" />
          <p className="text-sm text-ink-soft">Memuat artikel...</p>
        </div>
      ) : articles.length === 0 ? (
        <p className="py-12 text-center text-sm text-ink-soft">
          Penulis ini belum memiliki artikel.
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
