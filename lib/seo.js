import { excerpt } from './format';

/* -------------------------------------------------------------------------- */
/*  Site-wide SEO constants                                                    */
/* -------------------------------------------------------------------------- */

export const SITE_URL = 'https://dubirodum.asia';
export const SITE_NAME = 'DA News';
export const SITE_TAGLINE = 'Dubirodum Asia News';
export const SITE_TITLE = `${SITE_NAME} — ${SITE_TAGLINE}`;
export const SITE_DESCRIPTION =
  `${SITE_TAGLINE} — clear, original coverage of Asia and the world. ` +
  'Breaking news, analysis and reporting on technology, world affairs, politics, economy, lifestyle and sport.';
export const SITE_KEYWORDS = [
  'DA News',
  'Dubirodum Asia News',
  'Asia news',
  'world news',
  'breaking news',
  'technology',
  'politics',
  'economy',
  'lifestyle',
  'sport',
];
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-default.png`;
export const SITE_LOGO = `${SITE_URL}/favicon.svg`;

/** Turn any relative path into an absolute URL on the canonical domain. */
export function absoluteUrl(path = '/') {
  if (!path) return SITE_URL;
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

/**
 * Pick a shareable absolute image URL for OG/Twitter cards.
 * Data-URI covers are not shareable, so they fall back to the default card.
 */
export function shareImage(article) {
  const cover = article?.cover_image;
  if (cover && !cover.startsWith('data:')) return cover;
  return DEFAULT_OG_IMAGE;
}

/* -------------------------------------------------------------------------- */
/*  JSON-LD builders                                                           */
/* -------------------------------------------------------------------------- */

/** Site-wide NewsMediaOrganization schema. */
export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'NewsMediaOrganization',
    name: SITE_NAME,
    alternateName: SITE_TAGLINE,
    url: SITE_URL,
    logo: {
      '@type': 'ImageObject',
      url: SITE_LOGO,
      width: 512,
      height: 512,
    },
    email: 'newsroom@dubirodum.asia',
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'newsroom',
        email: 'newsroom@dubirodum.asia',
        availableLanguage: ['English'],
      },
    ],
  };
}

/** NewsArticle schema for a single story. */
export function newsArticleJsonLd(article = {}, url) {
  const canonical = absoluteUrl(url);
  const author = article.profiles || {};
  const category = article.categories || {};

  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
    headline: article.title || SITE_NAME,
    description: excerpt(article.content, 200) || SITE_DESCRIPTION,
    image: [shareImage(article)],
    datePublished: article.created_at || undefined,
    dateModified: article.created_at || undefined,
    author: [
      {
        '@type': 'Person',
        name: author.display_name || SITE_NAME,
        ...(author.avatar_url ? { image: author.avatar_url } : {}),
      },
    ],
    publisher: {
      '@type': 'NewsMediaOrganization',
      name: SITE_NAME,
      logo: { '@type': 'ImageObject', url: SITE_LOGO, width: 512, height: 512 },
    },
    articleSection: category.name || 'News',
    inLanguage: 'en',
    url: canonical,
    isAccessibleForFree: true,
  };
}

/** BreadcrumbList schema from an ordered list of `{ name, url }` items. */
export function breadcrumbJsonLd(items = []) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.url),
    })),
  };
}

/* -------------------------------------------------------------------------- */
/*  React helper                                                               */
/* -------------------------------------------------------------------------- */

/** Renders a JSON-LD `<script>` tag. Server components only. */
export function JsonLd({ data }) {
  return (
    <script
      type="application/ld+json"
      // Structured data is generated from trusted server-side values.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
