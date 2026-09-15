import { supabase } from './supabaseClient';

// Shared column selection for article lists. Joins category + author profile
// so cards can render meta info without extra round-trips.
export const ARTICLE_LIST_FIELDS =
  'id, title, slug, content, cover_image, category_id, author_id, created_at, categories(id, name, slug), profiles(id, display_name, avatar_url)';

export const ARTICLE_DETAIL_FIELDS =
  'id, title, slug, content, cover_image, category_id, author_id, created_at, categories(id, name, slug), profiles(id, display_name, avatar_url)';

/**
 * Fetch a list of articles with optional filtering.
 * @param {Object} [options]
 * @param {number} [options.limit=12]
 * @param {number} [options.offset=0]
 * @param {string} [options.categoryId]
 * @param {string} [options.authorId]
 * @param {string} [options.search]
 * @param {string} [options.categorySlug]
 */
export async function getArticles(options = {}) {
  const {
    limit = 12,
    offset = 0,
    categoryId,
    authorId,
    search,
    categorySlug,
  } = options;

  let query = supabase
    .from('articles')
    .select(ARTICLE_LIST_FIELDS, { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (categoryId) query = query.eq('category_id', categoryId);
  if (authorId) query = query.eq('author_id', authorId);
  if (search) {
    const term = `%${search}%`;
    query = query.or(`title.ilike.${term},content.ilike.${term}`);
  }

  if (categorySlug) {
    // Resolve the category first so the filter matches by id.
    const category = await getCategoryBySlug(categorySlug);
    if (!category) return { data: [], count: 0, error: null };
    query = query.eq('category_id', category.id);
  }

  const { data, count, error } = await query;
  return { data: data || [], count: count || 0, error };
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

  return { data, error };
}

/** Fetch all categories ordered by name. */
export async function getCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('id, name, slug')
    .order('name', { ascending: true });

  return { data: data || [], error };
}

/**
 * Fetch a single category by slug.
 * @param {string} slug
 */
export async function getCategoryBySlug(slug) {
  const { data, error } = await supabase
    .from('categories')
    .select('id, name, slug')
    .eq('slug', slug)
    .maybeSingle();

  if (error) return null;
  return data;
}

/**
 * Fetch a public author profile by id.
 * @param {string} id
 */
export async function getAuthorById(id) {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, display_name, avatar_url, created_at')
    .eq('id', id)
    .maybeSingle();

  return { data, error };
}

/**
 * Search articles by a free-text term (title + content).
 * @param {string} term
 * @param {Object} [options]
 * @param {number} [options.limit=24]
 */
export async function searchArticles(term, options = {}) {
  const { limit = 24 } = options;
  if (!term || !term.trim()) return { data: [], error: null };

  const value = `%${term.trim()}%`;
  const { data, error } = await supabase
    .from('articles')
    .select(ARTICLE_LIST_FIELDS)
    .or(`title.ilike.${value},content.ilike.${value}`)
    .order('created_at', { ascending: false })
    .limit(limit);

  return { data: data || [], error };
}

/**
 * Fetch articles related to a tag keyword. The schema has no tags table, so we
 * match against title/content as a lightweight fallback.
 * @param {string} tag
 * @param {number} [limit=24]
 */
export async function getArticlesByTag(tag, limit = 24) {
  return searchArticles(tag, { limit });
}

/** Fetch the latest articles excluding a set of ids (for sidebars). */
export async function getLatestArticles(limit = 6, excludeIds = []) {
  let query = supabase
    .from('articles')
    .select(ARTICLE_LIST_FIELDS)
    .order('created_at', { ascending: false })
    .limit(limit + excludeIds.length);

  const { data, error } = await query;
  const filtered = (data || []).filter((a) => !excludeIds.includes(a.id)).slice(0, limit);
  return { data: filtered, error };
}
