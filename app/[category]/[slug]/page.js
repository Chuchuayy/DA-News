import Link from 'next/link';
import { notFound } from 'next/navigation';
import Comments from '../../components/Comments';
import CoverImage from '../../components/CoverImage';
import { getArticleByCategoryAndSlug, incrementArticleViews } from '../../../lib/queries';
import { formatDate, articleUrl, excerpt } from '../../../lib/format';
import {
  SITE_NAME,
  SITE_DESCRIPTION,
  shareImage,
  newsArticleJsonLd,
  breadcrumbJsonLd,
  JsonLd,
} from '../../../lib/seo';

export const revalidate = 300;

export async function generateMetadata({ params }) {
  const { category, slug } = params;

  let article = null;
  try {
    const { data } = await getArticleByCategoryAndSlug(category, slug);
    article = data;
  } catch {
    article = null;
  }

  if (!article) {
    return {
      title: 'Article not found',
      robots: { index: false, follow: true },
    };
  }

  const description = excerpt(article.content, 160) || SITE_DESCRIPTION;
  const url = articleUrl(article);
  const image = shareImage(article);

  return {
    title: article.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      url,
      siteName: SITE_NAME,
      locale: 'en_US',
      title: article.title,
      description,
      images: [{ url: image, width: 1200, height: 630, alt: article.title }],
      publishedTime: article.created_at,
      authors: [article.profiles?.display_name || SITE_NAME],
      section: article.categories?.name,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description,
      images: [image],
    },
  };
}

export default async function ArticlePage({ params }) {
  const { category, slug } = params;

  let article = null;
  try {
    const { data } = await getArticleByCategoryAndSlug(category, slug);
    article = data;
  } catch {
    article = null;
  }

  if (!article) notFound();

  // Fire-and-forget view counter. Never awaited and never allowed to break
  // rendering — incrementArticleViews swallows its own errors.
  incrementArticleViews(article.id).catch(() => {});

  const cat = article.categories;
  const author = article.profiles;
  // Admin stores plain text; seed/legacy rows may contain HTML. Support both.
  const body = article.content || '';
  const isHtml = /<\/?[a-z][\s\S]*>/i.test(body);
  const canonical = articleUrl(article);

  return (
    <article className="mx-auto max-w-3xl">
      <JsonLd data={newsArticleJsonLd(article, canonical)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', url: '/' },
          ...(cat ? [{ name: cat.name, url: `/category/${cat.slug}` }] : []),
          { name: article.title, url: canonical },
        ])}
      />

      {cat ? (
        <Link href={`/category/${cat.slug}`} className="pill pill-brand">
          {cat.name}
        </Link>
      ) : null}

      <h1 className="mt-4 font-serif text-3xl font-bold leading-tight text-ink sm:text-4xl">
        {article.title}
      </h1>

      <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
        <span className="font-medium text-ink">{author?.display_name || 'DA News'}</span>
        <span className="text-ink-faint">•</span>
        <span className="font-medium text-date">{formatDate(article.created_at)}</span>
      </div>

      <figure className="mt-7">
        <div className="aspect-[16/9] overflow-hidden rounded-2xl bg-surface">
          <CoverImage
            src={article.cover_image}
            alt={article.title}
            width={1200}
            height={675}
            priority
            sizes="(max-width: 768px) 100vw, 768px"
            className="h-full w-full object-cover"
          />
        </div>
      </figure>

      {/* Body: stored as HTML (seed/legacy) or plain text (admin textarea) */}
      {isHtml ? (
        <div className="article-body mt-8" dangerouslySetInnerHTML={{ __html: body }} />
      ) : (
        <div className="article-body mt-8 whitespace-pre-line">{body}</div>
      )}

      <Comments articleId={article.id} />
    </article>
  );
}
