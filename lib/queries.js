import { supabase } from './supabaseClient';

// Shared column selection for article lists. Joins category + author profile
// so cards can render meta info without extra round-trips.
export const ARTICLE_LIST_FIELDS =
  'id, title, slug, content, cover_image, category_id, author_id, created_at, views, categories(id, name, slug), profiles(id, display_name, avatar_url)';

export const ARTICLE_DETAIL_FIELDS =
  'id, title, slug, content, cover_image, category_id, author_id, created_at, views, categories(id, name, slug), profiles(id, display_name, avatar_url)';

/* -------------------------------------------------------------------------- */
/*  Views-column resilience                                                    */
/* -------------------------------------------------------------------------- */

// The live database may not have the optional `views` column yet (the
// supabase/views.sql migration is not guaranteed to be applied). A missing
// column must NEVER blank the site, so every read tries WITH `views` first for
// forward compatibility and transparently retries WITHOUT it on failure.
const MISSING_COLUMN_CODE = '42703';

function isMissingViewsError(error) {
  if (!error) return false;
  // PostgREST returns 42703 (undefined_column) for a missing column.
  if (error.code === MISSING_COLUMN_CODE) return true;
  // Any error that explicitly mentions `views` is treated as the same case.
  const message = `${error.message || ''} ${error.details || ''} ${error.hint || ''}`;
  return /\bviews\b/i.test(message);
}

// Strip the optional `views` column from a PostgREST select string.
function stripViews(fields) {
  return fields
    .replace(/,\s*views\b/, '')
    .replace(/\bviews\s*,\s*/, '');
}

// Run a query builder with `views`; if it fails because the column is missing,
// retry the same query without `views` and return `error: null` (a missing
// optional column is not a page-level error).
async function queryWithViewsFallback(fields, buildQuery) {
  const first = await buildQuery(fields);
  if (!first.error || !isMissingViewsError(first.error)) {
    return first;
  }

  const fallback = await buildQuery(stripViews(fields));
  if (fallback.error) return fallback;
  return { ...fallback, error: null };
}

/* -------------------------------------------------------------------------- */
/*  Normalisation                                                              */
/* -------------------------------------------------------------------------- */

// Some legacy rows store category names/slugs with trailing whitespace, which
// would corrupt slug URLs (e.g. "/technology /story"). Trim them on read so the
// canonical `/{category}/{slug}` paths stay clean and matchable.
function normalizeCategory(category) {
  if (!category) return category;
  return {
    ...category,
    name: (category.name || '').trim(),
    slug: (category.slug || '').trim(),
  };
}

function normalizeArticle(article) {
  if (!article) return article;
  return {
    ...article,
    // Default a missing `views` (fallback path) to 0 so callers always have a
    // usable number.
    views: article.views ?? 0,
    categories: article.categories ? normalizeCategory(article.categories) : article.categories,
  };
}

/* -------------------------------------------------------------------------- */
/*  Articles                                                                   */
/* -------------------------------------------------------------------------- */

/**
 * Fetch a list of articles with optional filtering.
 * @param {Object} [options]
 * @param {number} [options.limit=12]
 * @param {number} [options.offset=0]
 * @param {string} [options.categoryId]
 * @param {string} [options.categorySlug]
 */
export async function getArticles(options = {}) {
  const { limit = 12, offset = 0, categoryId, categorySlug } = options;

  let resolvedCategoryId = categoryId || null;

  if (categorySlug) {
    // Resolve the category first so the filter matches by id.
    const category = await getCategoryBySlug(categorySlug);
    if (!category) return { data: [], count: 0, error: null };
    resolvedCategoryId = category.id;
  }

  const buildQuery = (fields) => {
    let query = supabase
      .from('articles')
      .select(fields, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (resolvedCategoryId) query = query.eq('category_id', resolvedCategoryId);
    return query;
  };

  const { data, count, error } = await queryWithViewsFallback(ARTICLE_LIST_FIELDS, buildQuery);
  return { data: (data || []).map(normalizeArticle), count: count || 0, error };
}

/**
 * Fetch a single article by its slug.
 * @param {string} slug
 */
export async function getArticleBySlug(slug) {
  const buildQuery = (fields) =>
    supabase.from('articles').select(fields).eq('slug', slug).maybeSingle();

  const { data, error } = await queryWithViewsFallback(ARTICLE_DETAIL_FIELDS, buildQuery);
  return { data: normalizeArticle(data), error };
}

/**
 * Fetch a single article by its category slug + article slug (canonical
 * `/{category}/{slug}` URL). Returns the fields required for JSON-LD schema:
 * title, slug, content, cover_image, created_at, category name+slug and the
 * author's display name + avatar.
 * @param {string} categorySlug
 * @param {string} slug
 */
export async function getArticleByCategoryAndSlug(categorySlug, slug) {
  if (!categorySlug || !slug) return { data: null, error: null };

  const category = await getCategoryBySlug(categorySlug);
  if (!category) return { data: null, error: null };

  const buildQuery = (fields) =>
    supabase
      .from('articles')
      .select(fields)
      .eq('slug', slug)
      .eq('category_id', category.id)
      .maybeSingle();

  const { data, error } = await queryWithViewsFallback(ARTICLE_DETAIL_FIELDS, buildQuery);
  return { data: normalizeArticle(data), error };
}

/**
 * Fetch the most-viewed articles for the Trending section.
 * Ordered by `views` descending, with `created_at` as a stable tiebreak.
 * Falls back to `created_at desc` only when the `views` column is missing, so
 * the section never blanks.
 * @param {number} [limit=6]
 */
export async function getTrendingArticles(limit = 6) {
  const withViews = await supabase
    .from('articles')
    .select(ARTICLE_LIST_FIELDS)
    .order('views', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(limit);

  if (!withViews.error || !isMissingViewsError(withViews.error)) {
    return { data: (withViews.data || []).map(normalizeArticle), error: withViews.error };
  }

  const fallback = await supabase
    .from('articles')
    .select(stripViews(ARTICLE_LIST_FIELDS))
    .order('created_at', { ascending: false })
    .limit(limit);

  return { data: (fallback.data || []).map(normalizeArticle), error: fallback.error || null };
}

/**
 * Increment the view counter for a single article. Best-effort: prefers the
 * atomic `increment_article_views` RPC (SECURITY DEFINER, see the views
 * migration) and silently falls back to a read+write if the RPC is missing.
 * Never throws so callers can fire-and-forget without breaking rendering.
 * @param {string} articleId
 */
export async function incrementArticleViews(articleId) {
  if (!articleId) return { error: null };

  try {
    const { error } = await supabase.rpc('increment_article_views', { article_id: articleId });
    if (!error) return { error: null };
  } catch {
    // fall through to the manual path
  }

  try {
    const { data } = await supabase
      .from('articles')
      .select('views')
      .eq('id', articleId)
      .maybeSingle();
    const next = (data?.views || 0) + 1;
    await supabase.from('articles').update({ views: next }).eq('id', articleId);
  } catch {
    // ignore — view tracking must never break the page
  }

  return { error: null };
}

/* -------------------------------------------------------------------------- */
/*  Categories                                                                 */
/* -------------------------------------------------------------------------- */

/** Fetch all categories ordered by name. */
export async function getCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('id, name, slug')
    .order('name', { ascending: true });

  return { data: (data || []).map(normalizeCategory), error };
}

/**
 * Fetch a single category by slug (whitespace/case tolerant).
 * @param {string} slug
 */
export async function getCategoryBySlug(slug) {
  if (!slug) return null;
  const target = slug.trim().toLowerCase();

  const { data, error } = await supabase.from('categories').select('id, name, slug');
  if (error || !data) return null;

  const match = data.find(
    (category) => (category.slug || '').trim().toLowerCase() === target
  );

  return normalizeCategory(match) || null;
}

/* -------------------------------------------------------------------------- */
/*  Search                                                                     */
/* -------------------------------------------------------------------------- */

/**
 * Inline search: match articles by title only (used by the header search bar).
 * @param {string} term
 * @param {number} [limit=20]
 */
export async function searchArticles(term, limit = 20) {
  if (!term || !term.trim()) return { data: [], error: null };

  const buildQuery = (fields) =>
    supabase
      .from('articles')
      .select(fields)
      .ilike('title', `%${term.trim()}%`)
      .order('created_at', { ascending: false })
      .limit(limit);

  const { data, error } = await queryWithViewsFallback(ARTICLE_LIST_FIELDS, buildQuery);
  return { data: (data || []).map(normalizeArticle), error };
}
