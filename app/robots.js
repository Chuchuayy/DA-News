import { SITE_URL } from '../lib/seo';

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/login', '/account', '/app/'],
      },
      {
        // Google News crawler: full access to stories and section pages.
        userAgent: 'Googlebot-News',
        allow: '/',
        disallow: ['/admin', '/login', '/account', '/app/'],
      },
    ],
    sitemap: [`${SITE_URL}/sitemap.xml`, `${SITE_URL}/news-sitemap.xml`],
    host: SITE_URL,
  };
}
