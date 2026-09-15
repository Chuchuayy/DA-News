'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ArticleCard from './components/ArticleCard';
import ArticleListItem from './components/ArticleListItem';
import { getArticles, getCategories } from '../lib/queries';
import { excerpt, formatDate, FALLBACK_COVER } from '../lib/format';

export default function HomePage() {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const [{ data: list }, { data: cats }] = await Promise.all([
          getArticles({ limit: 30 }),
          getCategories(),
        ]);
        if (!active) return;
        setArticles(list || []);
        setCategories(cats || []);

        // Build a per-category block for each known category.
        const blocks = await Promise.all(
          (cats || []).map(async (cat) => {
            const { data } = await getArticles({ categorySlug: cat.slug, limit: 4 });
            return { category: cat, articles: data || [] };
          })
        );
        if (active) setSections(blocks.filter((b) => b.articles.length > 0));
      } catch (error) {
        console.error('Error loading homepage:', error);
      } finally {
        if (active) setLoading(false);
      }
    };

    load();
    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="py-16 text-center">
        <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-primary border-b-transparent" />
        <p className="text-sm text-ink-soft">Memuat berita...</p>
      </div>
    );
  }

  const hero = articles[0];
  const sideFeatured = articles.slice(1, 4);
  const mainReports = articles.slice(4, 8);
  const popular = articles.slice(0, 5);
  const latest = articles.slice(0, 6);

  return (
    <div className="space-y-10">
      {/* HERO */}
      {hero ? (
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Link href={`/article/${hero.slug}`} className="group block lg:col-span-2">
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded">
              <img
                src={hero.cover_image || FALLBACK_COVER}
                alt={hero.title}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
                {hero.categories ? (
                  <span className="inline-block rounded-sm bg-primary px-2 py-0.5 text-kicker font-bold uppercase text-white">
                    {hero.categories.name}
                  </span>
                ) : null}
                <h1 className="mt-3 text-2xl font-extrabold leading-tight text-white sm:text-4xl">
                  {hero.title}
                </h1>
                <p className="mt-2 hidden max-w-2xl text-sm text-gray-200 sm:line-clamp-2">
                  {excerpt(hero.content, 180)}
                </p>
                <p className="mt-2 text-xs text-gray-300">{formatDate(hero.created_at)}</p>
              </div>
            </div>
          </Link>

          <div className="flex flex-col divide-y divide-rule">
            {sideFeatured.map((article) => (
              <div key={article.id} className="py-3 first:pt-0 last:pb-0">
                <ArticleCard article={article} variant="horizontal" />
              </div>
            ))}
          </div>
        </section>
      ) : (
        <section className="rounded border border-rule bg-primary-soft p-10 text-center">
          <h1 className="text-xl font-bold text-ink">Belum ada artikel</h1>
          <p className="mt-2 text-sm text-ink-soft">
            Redaksi belum menerbitkan berita. Silakan kembali lagi nanti.
          </p>
        </section>
      )}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* MAIN COLUMN */}
        <div className="space-y-10 lg:col-span-8">
          {/* Laporan utama */}
          {mainReports.length > 0 ? (
            <section>
              <div className="section-bar">
                <h2 className="section-bar__title">Laporan Utama</h2>
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {mainReports.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            </section>
          ) : null}

          {/* Category blocks */}
          {sections.map((block) => (
            <section key={block.category.id}>
              <div className="section-bar">
                <h2 className="section-bar__title">{block.category.name}</h2>
                <Link href={`/category/${block.category.slug}`} className="section-bar__more">
                  Lihat semua
                </Link>
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <ArticleCard article={block.articles[0]} showSummary={false} />
                <div className="flex flex-col divide-y divide-rule">
                  {block.articles.slice(1).map((article) => (
                    <div key={article.id} className="py-3 first:pt-0 last:pb-0">
                      <ArticleCard article={article} variant="horizontal" showSummary={false} />
                    </div>
                  ))}
                </div>
              </div>
            </section>
          ))}
        </div>

        {/* SIDEBAR */}
        <aside className="space-y-8 lg:col-span-4">
          <section className="rounded border border-rule p-4">
            <div className="section-bar">
              <h2 className="section-bar__title text-base">Terpopuler</h2>
            </div>
            <div className="space-y-3">
              {popular.map((article, index) => (
                <ArticleListItem key={article.id} article={article} rank={index + 1} />
              ))}
            </div>
          </section>

          <section className="rounded border border-rule p-4">
            <div className="section-bar">
              <h2 className="section-bar__title text-base">Terbaru</h2>
            </div>
            <div className="space-y-3">
              {latest.map((article, index) => (
                <ArticleListItem
                  key={article.id}
                  article={article}
                  rank={index + 1}
                  showRank={false}
                />
              ))}
            </div>
          </section>

          {categories.length > 0 ? (
            <section className="rounded border border-rule p-4">
              <div className="section-bar">
                <h2 className="section-bar__title text-base">Kategori</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/category/${cat.slug}`}
                    className="rounded-full border border-rule px-3 py-1 text-xs font-medium text-ink-soft transition hover:border-primary hover:text-primary"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </section>
          ) : null}
        </aside>
      </div>
    </div>
  );
}
