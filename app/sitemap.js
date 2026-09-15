import { getArticles, getCategories } from '../lib/queries';
import { articleUrl } from '../lib/format';
import { SITE_URL } from '../lib/seo';

// Regenerate hourly; resilient to Supabase being unreachable at build time.
export const revalidate = 3600;

export default async function sitemap() {
  const now = new Date();

  const staticRoutes = [
    { url: SITE_URL, lastModified: now, changeFrequency: 'hourly', priority: 1 },
    { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${SITE_URL}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
  ];

  let articles = [];
  let categories = [];
  try {
    const [articlesResult, categoriesResult] = await Promise.all([
      getArticles({ limit: 1000 }),
      getCategories(),
    ]);
    articles = articlesResult.data || [];
    categories = categoriesResult.data || [];
  } catch {
    articles = [];
    categories = [];
  }

  const categoryRoutes = categories.map((category) => ({
    url: `${SITE_URL}/category/${category.slug}`,
    lastModified: now,
    changeFrequency: 'daily',
    priority: 0.7,
  }));

  const articleRoutes = articles.map((article) => ({
    url: `${SITE_URL}${articleUrl(article)}`,
    lastModified: article.created_at ? new Date(article.created_at) : now,
    changeFrequency: 'daily',
    priority: 0.8,
  }));

  return [...staticRoutes, ...categoryRoutes, ...articleRoutes];
}
