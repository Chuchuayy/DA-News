import Link from 'next/link';
import ArticleCard from './components/ArticleCard';
import SectionHeader from './components/SectionHeader';
import NewArticleWidget from './components/NewArticleWidget';
import CoverImage from './components/CoverImage';
import { getArticles } from '../lib/queries';
import { formatDate, articleUrl } from '../lib/format';
import {
  SITE_URL,
  SITE_NAME,
  SITE_TITLE,
  SITE_DESCRIPTION,
  DEFAULT_OG_IMAGE,
  shareImage,
} from '../lib/seo';

// Server-rendered above-the-fold HTML with ISR for a fast LCP.
export const revalidate = 60;

export async function generateMetadata() {
  let latest = null;
  try {
    const { data } = await getArticles({ limit: 1 });
    latest = data?.[0] || null;
  } catch {
    latest = null;
  }

  const title = latest ? latest.title : SITE_TITLE;
  const description = latest
    ? `${latest.title} — plus more Asia and world coverage from ${SITE_NAME}.`
    : SITE_DESCRIPTION;
  const image = latest ? shareImage(latest) : DEFAULT_OG_IMAGE;

  return {
    title: { absolute: latest ? `${title} | ${SITE_NAME}` : SITE_TITLE },
    description,
    alternates: { canonical: '/' },
    openGraph: {
      type: 'website',
      url: SITE_URL,
      siteName: SITE_NAME,
      locale: 'en_US',
      title,
      description,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}

export default async function HomePage() {
  let articles = [];
  try {
    const { data } = await getArticles({ limit: 24 });
    articles = data || [];
  } catch {
    articles = [];
  }

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const hero = articles[0];
  const grid = articles.slice(1, 9);
  const latest = articles.slice(0, 5);

  return (
    <div className="space-y-12">
      {/* Single page-level H1; the hero headline below stays an H2. */}
      <h1 className="sr-only">{`${SITE_NAME} — latest news from Asia and the world`}</h1>

      {/* HERO */}
      {hero ? (
        <Link href={articleUrl(hero)} className="group block">
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-surface md:aspect-[21/9]">
            <CoverImage
              src={hero.cover_image}
              alt={hero.title}
              width={1600}
              height={900}
              priority
              sizes="(max-width: 768px) 100vw, 1200px"
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
            <span className="pill pill-brand absolute left-4 top-4">
              {formatDate(hero.created_at)}
            </span>
            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
              <h2 className="line-clamp-3 max-w-3xl text-[28px] font-bold leading-tight text-white">
                {hero.title}
              </h2>
              <p className="mt-2 text-xs text-white/80">
                {hero.categories?.name ? `${hero.categories.name} · ` : ''}DA News
              </p>
            </div>
          </div>
        </Link>
      ) : (
        <section className="rounded-2xl border border-rule p-16 text-center">
          <h2 className="font-serif text-xl font-bold text-ink">No articles yet</h2>
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
