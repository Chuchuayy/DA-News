import { supabase } from './supabaseClient';

// Hard-coded allow-list for the newsroom backend. Only this account may enter
// the /admin dashboard; any other authenticated user is signed out immediately.
export const ADMIN_EMAIL = 'mortscorpuration@gmail.com';

/** Supabase Storage bucket that stores article cover images. */
export const COVER_BUCKET = 'covers';

/**
 * Whether the given Supabase user is the whitelisted admin.
 * @param {{ email?: string } | null | undefined} user
 */
export function isAdmin(user) {
  if (!user || !user.email) return false;
  return user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
}

/**
 * Start the Google OAuth flow used by the admin gate. The email whitelist is
 * still enforced after sign-in via `isAdmin` — Google only proves identity.
 * @param {string} redirectTo
 */
export async function signInWithGoogle(redirectTo) {
  return supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo },
  });
}

/** Slugify a title into a URL-safe slug. */
export function slugify(value = '') {
  return value
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/* -------------------------------------------------------------------------- */
/*  Articles CRUD                                                              */
/* -------------------------------------------------------------------------- */

/** List every article for the admin table (newest first). */
export async function listArticles() {
  const { data, error } = await supabase
    .from('articles')
    .select(
      'id, title, slug, content, cover_image, category_id, author_id, created_at, categories(id, name, slug)'
    )
    .order('created_at', { ascending: false });

  return { data: data || [], error };
}

/** Fetch a single article by id for editing. */
export async function getArticleById(id) {
  const { data, error } = await supabase
    .from('articles')
    .select(
      'id, title, slug, content, cover_image, category_id, author_id, created_at, categories(id, name, slug)'
    )
    .eq('id', id)
    .maybeSingle();

  return { data, error };
}

/**
 * Create a new article.
 * @param {Object} payload
 */
export async function createArticle(payload) {
  const { data, error } = await supabase
    .from('articles')
    .insert(payload)
    .select()
    .single();

  return { data, error };
}

/**
 * Update an existing article.
 * @param {string} id
 * @param {Object} payload
 */
export async function updateArticle(id, payload) {
  const { data, error } = await supabase
    .from('articles')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  return { data, error };
}

/** Delete an article by id. */
export async function deleteArticle(id) {
  const { error } = await supabase.from('articles').delete().eq('id', id);
  return { error };
}

/* -------------------------------------------------------------------------- */
/*  Storage (cover uploads)                                                    */
/* -------------------------------------------------------------------------- */

/**
 * Upload a cover image to the `covers` bucket and return its public URL.
 * @param {File} file
 * @returns {Promise<{ publicUrl?: string, error?: string }>}
 */
export async function uploadCover(file) {
  if (!file) return { error: 'No file selected.' };

  const ext = (file.name && file.name.split('.').pop()) || 'jpg';
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const { error } = await supabase.storage
    .from(COVER_BUCKET)
    .upload(path, file, { cacheControl: '3600', upsert: false, contentType: file.type });

  if (error) {
    // Surface a friendly hint when the bucket has not been created yet.
    const message = /bucket/i.test(error.message || '')
      ? `Storage bucket "${COVER_BUCKET}" was not found. Create a public bucket named "${COVER_BUCKET}" in Supabase Storage first.`
      : error.message;
    return { error: message };
  }

  const { data } = supabase.storage.from(COVER_BUCKET).getPublicUrl(path);
  return { publicUrl: data?.publicUrl };
}
