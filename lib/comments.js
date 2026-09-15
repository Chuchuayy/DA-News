import { supabase } from './supabaseClient';

// Comments are stored in the `comments` table:
//   id, article_id, user_id, content, created_at
// Reading is public; posting requires an authenticated user (enforced by RLS).

const COMMENT_FIELDS = 'id, article_id, user_id, content, created_at';

/**
 * Fetch the comments for an article, newest last so the thread reads top-down.
 * @param {string} articleId
 */
export async function getComments(articleId) {
  if (!articleId) return { data: [], error: null };

  const { data, error } = await supabase
    .from('comments')
    .select(COMMENT_FIELDS)
    .eq('article_id', articleId)
    .order('created_at', { ascending: true });

  return { data: data || [], error };
}

/**
 * Post a comment. Requires an authenticated session (login enforced by RLS).
 * @param {string} articleId
 * @param {string} content
 */
export async function addComment(articleId, content) {
  const trimmed = (content || '').trim();
  if (!articleId) return { data: null, error: { message: 'Missing article.' } };
  if (!trimmed) return { data: null, error: { message: 'Comment cannot be empty.' } };

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { data: null, error: { message: 'Sign in to post a comment.' } };

  const { data, error } = await supabase
    .from('comments')
    .insert({ article_id: articleId, user_id: user.id, content: trimmed })
    .select(COMMENT_FIELDS)
    .single();

  return { data, error };
}

/**
 * Resolve display names/avatars for a set of user ids.
 * @param {string[]} userIds
 */
export async function getProfilesByIds(userIds = []) {
  const ids = [...new Set(userIds.filter(Boolean))];
  if (ids.length === 0) return { data: [], error: null };

  const { data, error } = await supabase
    .from('profiles')
    .select('id, display_name, avatar_url')
    .in('id', ids);

  return { data: data || [], error };
}
