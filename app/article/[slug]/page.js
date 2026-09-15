import { redirect } from 'next/navigation';
import { getArticleBySlug } from '../../../lib/queries';

// Legacy `/article/{slug}` URLs permanently redirect to the canonical
// `/{category}/{slug}` path. Always evaluated at request time.
export const dynamic = 'force-dynamic';

export default async function LegacyArticleRedirect({ params }) {
  const { slug } = params;

  let article = null;
  try {
    const { data } = await getArticleBySlug(slug);
    article = data;
  } catch {
    article = null;
  }

  const categorySlug = article?.categories?.slug;
  if (categorySlug) {
    redirect(`/${categorySlug}/${slug}`);
  }

  // No category to build a canonical path from — send readers to the homepage.
  redirect('/');
}
