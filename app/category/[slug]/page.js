import { notFound } from 'next/navigation';
import ArticleCard from '../../components/ArticleCard';
import { getArticles, getCategoryBySlug } from '../../../lib/queries';
import {
  SITE_NAME,
  SITE_URL,
  DEFAULT_OG_IMAGE,
  breadcrumbJsonLd,
  JsonLd,
} from '../../../lib/seo';

export const revalidate = 300;

export async function generateMetadata({ params }) {
  const { slug } = params;
  let category = null;
  let count = 0;

  try {
    category = await getCategoryBySlug(slug);
    const { data } = await getArticles({ categorySlug: slug, limit: 24 });
    count = (data || []).length;
  } catch {
    category = null;
  }

  const name = category?.name || 'Category';
  const title = `${name} News`;
  const description = `Latest ${name} news and analysis from ${SITE_NAME}. ${
    count > 0 ? `${count} recent ` : ''
  }stories covering ${name.toLowerCase()} across Asia and the world.`;
  const image = DEFAULT_OG_IMAGE;

  return {
    title,
    description,
    alternates: { canonical: `/category/${slug}` },
    openGraph: {
      type: 'website',
      url: `${SITE_URL}/category/${slug}`,
      siteName: SITE_NAME,
      locale: 'en_US',
      title: `${title} | ${SITE_NAME}`,
      description,
      images: [{ url: image, width: 1200, height: 630, alt: `${name} — ${SITE_NAME}` }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | ${SITE_NAME}`,
      description,
      images: [image],
    },
  };
}

export default async function CategoryPage({ params }) {
  const { slug } = params;

  let category = null;
  let articles = [];
  try {
    category = await getCategoryBySlug(slug);
    if (category) {
      const { data } = await getArticles({ categorySlug: slug, limit: 24 });
      articles = data || [];
    }
  } catch {
    category = null;
  }

  if (!category) notFound();

  const title = category.name;

  return (
    <div>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', url: '/' },
          { name: title, url: `/category/${slug}` },
        ])}
      />

      <div className="mb-6 border-b border-rule pb-4">
        <h1 className="font-serif text-2xl font-bold text-ink">{title}</h1>
        <p className="mt-1 text-sm text-ink-soft">{articles.length} articles</p>
      </div>

      {articles.length === 0 ? (
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
