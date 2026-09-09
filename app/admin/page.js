'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';

export default function AdminDashboard() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('id, title, slug, cover_image, created_at, categories(name)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setArticles(data || []);
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteArticle = async (id) => {
    if (!confirm('Delete this article?')) return;

    try {
      const { error } = await supabase.from('articles').delete().eq('id', id);
      if (error) throw error;
      
      setArticles(articles.filter(a => a.id !== id));
      alert('Article deleted!');
    } catch (error) {
      console.error('Error deleting article:', error);
      alert('Error deleting article');
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">📰 Dashboard</h1>
        <p className="text-gray-600">Manage your articles</p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading articles...</p>
        </div>
      ) : articles.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-600 mb-4">No articles yet. Create your first one!</p>
          <Link
            href="/admin/new"
            className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded transition"
          >
            Create Article
          </Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {articles.map((article) => (
            <div
              key={article.id}
              className="bg-white rounded-lg shadow hover:shadow-lg transition p-6 flex gap-6 items-start"
            >
              {/* Cover Image */}
              {article.cover_image && (
                <div className="w-32 h-24 flex-shrink-0 rounded overflow-hidden bg-gray-100">
                  <img
                    src={article.cover_image}
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Article Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded">
                    {article.categories?.name || 'Uncategorized'}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  {new Date(article.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>

                {/* Actions */}
                <div className="flex gap-2">
                  <Link
                    href={`/article/${article.slug}`}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1 px-4 rounded text-sm transition"
                  >
                    View
                  </Link>
                  <Link
                    href={`/admin/edit/${article.id}`}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-1 px-4 rounded text-sm transition"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => deleteArticle(article.id)}
                    className="bg-red-600 hover:bg-red-700 text-white font-semibold py-1 px-4 rounded text-sm transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
