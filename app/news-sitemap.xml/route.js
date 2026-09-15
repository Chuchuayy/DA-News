import { getArticles } from '../../lib/queries';
import { articleUrl } from '../../lib/format';
import { SITE_URL, SITE_NAME } from '../../lib/seo';

// Google News sitemap: recent articles only. Refreshed frequently.
export const revalidate = 600;

function escapeXml(value = '') {
  return value
    .toString()
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  let articles = [];
  try {
    const { data } = await getArticles({ limit: 1000 });
    articles = data || [];
  } catch {
    articles = [];
  }

  // Google News accepts articles published in the last 48 hours (max 1000).
  const cutoff = Date.now() - 48 * 60 * 60 * 1000;
  let recent = articles.filter((article) => {
    const time = article.created_at ? new Date(article.created_at).getTime() : 0;
    return time >= cutoff;
  });

  // Fall back to the newest stories so the sitemap is never empty in quiet
  // publishing windows.
  if (recent.length === 0) recent = articles.slice(0, 20);

  const urls = recent
    .map((article) => {
      const loc = `${SITE_URL}${articleUrl(article)}`;
      const published = article.created_at
        ? new Date(article.created_at).toISOString()
        : new Date().toISOString();
      return `  <url>
    <loc>${escapeXml(loc)}</loc>
    <news:news>
      <news:publication>
        <news:name>${escapeXml(SITE_NAME)}</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${published}</news:publication_date>
      <news:title>${escapeXml(article.title || SITE_NAME)}</news:title>
    </news:news>
  </url>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${urls}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=1200',
    },
  });
}
