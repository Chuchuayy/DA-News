import { supabase } from './supabaseClient';

// Shared column selection for article lists. Joins category + author profile
// so cards can render meta info without extra round-trips.
export const ARTICLE_LIST_FIELDS =
  'id, title, slug, content, cover_image, category_id, author_id, created_at, categories(id, name, slug), profiles(id, display_name, avatar_url)';

export const ARTICLE_DETAIL_FIELDS =
  'id, title, slug, content, cover_image, category_id, author_id, created_at, categories(id, name, slug), profiles(id, display_name, avatar_url)';

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

  let query = supabase
    .from('articles')
    .select(ARTICLE_LIST_FIELDS, { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (categoryId) query = query.eq('category_id', categoryId);

  if (categorySlug) {
    // Resolve the category first so the filter matches by id.
    const category = await getCategoryBySlug(categorySlug);
    if (!category) return { data: [], count: 0, error: null };
    query = query.eq('category_id', category.id);
  }

  const { data, count, error } = await query;
  return { data: (data || []).map(normalizeArticle), count: count || 0, error };
}

/**
 * Fetch a single article by its slug.
 * @param {string} slug
 */
export async function getArticleBySlug(slug) {
  const { data, error } = await supabase
    .from('articles')
    .select(ARTICLE_DETAIL_FIELDS)
    .eq('slug', slug)
    .maybeSingle();

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

  const { data, error } = await supabase
    .from('articles')
    .select(ARTICLE_DETAIL_FIELDS)
    .eq('slug', slug)
    .eq('category_id', category.id)
    .maybeSingle();

  return { data: normalizeArticle(data), error };
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

  const { data, error } = await supabase
    .from('articles')
    .select(ARTICLE_LIST_FIELDS)
    .ilike('title', `%${term.trim()}%`)
    .order('created_at', { ascending: false })
    .limit(limit);

  return { data: (data || []).map(normalizeArticle), error };
}
