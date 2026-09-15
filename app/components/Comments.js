'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../../lib/supabaseClient';
import { getComments, addComment, getProfilesByIds } from '../../lib/comments';
import { formatDate } from '../../lib/format';

/** Live Supabase comments: public list, login required to post. */
export default function Comments({ articleId }) {
  const [comments, setComments] = useState([]);
  const [profiles, setProfiles] = useState({});
  const [user, setUser] = useState(null);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    if (!articleId) return;
    setLoading(true);
    const { data } = await getComments(articleId);
    setComments(data || []);

    const ids = (data || []).map((c) => c.user_id);
    if (ids.length > 0) {
      const { data: people } = await getProfilesByIds(ids);
      const map = {};
      (people || []).forEach((p) => {
        map[p.id] = p;
      });
      setProfiles(map);
    }
    setLoading(false);
  }, [articleId]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (active) setUser(data?.session?.user || null);
    });
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });
    return () => {
      active = false;
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setPosting(true);
    const { error: postError } = await addComment(articleId, content);
    setPosting(false);
    if (postError) {
      setError(postError.message);
      return;
    }
    setContent('');
    await load();
  };

  return (
    <section className="mt-12 border-t border-rule pt-8">
      <h2 className="mb-5 font-serif text-xl font-bold text-ink">
        Comments {comments.length > 0 ? <span className="text-ink-faint">({comments.length})</span> : null}
      </h2>

      {user ? (
        <form onSubmit={handleSubmit} className="mb-8 space-y-3">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
            placeholder="Add a comment…"
            className="input resize-y"
            aria-label="Comment"
          />
          {error ? <p className="text-sm text-date">{error}</p> : null}
          <button type="submit" disabled={posting || !content.trim()} className="btn-brand">
            {posting ? 'Posting…' : 'Post comment'}
          </button>
        </form>
      ) : (
        <div className="mb-8 rounded-2xl border border-rule p-5">
          <p className="text-sm text-ink-soft">Sign in to join the discussion.</p>
          <Link href="/login" className="btn-brand mt-3">
            Sign in to comment
          </Link>
        </div>
      )}

      {loading ? (
        <p className="text-sm text-ink-soft">Loading comments…</p>
      ) : comments.length === 0 ? (
        <p className="text-sm text-ink-soft">No comments yet. Be the first to share your thoughts.</p>
      ) : (
        <ul className="space-y-5">
          {comments.map((comment) => {
            const profile = profiles[comment.user_id];
            const name = profile?.display_name || 'Reader';
            return (
              <li key={comment.id} className="flex gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-surface text-sm font-bold text-brand">
                  {profile?.avatar_url ? (
                    <img src={profile.avatar_url} alt={name} className="h-full w-full object-cover" />
                  ) : (
                    name.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-ink">
                    {name}
                    <span className="ml-2 text-xs font-normal text-ink-faint">
                      {formatDate(comment.created_at)}
                    </span>
                  </p>
                  <p className="mt-1 whitespace-pre-line text-sm text-ink-soft">{comment.content}</p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
