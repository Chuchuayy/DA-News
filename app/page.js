'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ArticleCard from './components/ArticleCard';
import SectionHeader from './components/SectionHeader';
import NewArticleWidget from './components/NewArticleWidget';
import { getArticles } from '../lib/queries';
import { formatDate, FALLBACK_COVER } from '../lib/format';

export default function HomePage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [today, setToday] = useState('');

  useEffect(() => {
    setToday(
      new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    );

    let active = true;
    getArticles({ limit: 24 })
      .then(({ data }) => {
        if (active) setArticles(data || []);
      })
      .catch((error) => console.error('Error loading homepage:', error))
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-brand border-b-transparent" />
        <p className="text-sm text-ink-soft">Loading…</p>
      </div>
    );
  }

  const hero = articles[0];
  const grid = articles.slice(1, 9);
  const latest = articles.slice(0, 5);

  return (
    <div className="space-y-12">
      {/* HERO */}
      {hero ? (
        <Link href={`/article/${hero.slug}`} className="group block">
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-surface md:aspect-[21/9]">
            <img
              src={hero.cover_image || FALLBACK_COVER}
              alt={hero.title}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
            <span className="pill pill-brand absolute left-4 top-4">
              {formatDate(hero.created_at)}
            </span>
            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
              <h1 className="line-clamp-3 max-w-3xl text-[28px] font-bold leading-tight text-white">
                {hero.title}
              </h1>
              <p className="mt-2 text-xs text-white/80">
                {hero.categories?.name ? `${hero.categories.name} · ` : ''}DA News
              </p>
            </div>
          </div>
        </Link>
      ) : (
        <section className="rounded-2xl border border-rule p-16 text-center">
          <h1 className="font-serif text-xl font-bold text-ink">No articles yet</h1>
          <p className="mt-2 text-sm text-ink-soft">The newsroom has not published anything yet.</p>
        </section>
      )}

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
        {/* MAIN */}
        <div className="lg:col-span-8">
          <SectionHeader
            title="Latest Stories"
            subtitle="Original reporting from Asia and beyond."
            date={today}
          />
          {grid.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {grid.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          ) : (
            <p className="py-8 text-sm text-ink-soft">More stories will appear here soon.</p>
          )}
        </div>

        {/* SIDEBAR */}
        <aside className="lg:col-span-4">
          <NewArticleWidget articles={latest} />
        </aside>
      </div>
    </div>
  );
}
