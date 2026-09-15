'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../../lib/supabaseClient';
import { ADMIN_EMAIL, isAdmin, listArticles } from '../../lib/admin';
import { formatDate, articleUrl } from '../../lib/format';
import ArticleForm from './components/ArticleForm';

export default function AdminPage() {
  const [checking, setChecking] = useState(true);
  const [user, setUser] = useState(null);

  // Login form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Dashboard state
  const [articles, setArticles] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const loadDashboard = useCallback(async () => {
    setDataLoading(true);
    const { data: list } = await listArticles();
    setArticles(list || []);
    setDataLoading(false);
  }, []);

  useEffect(() => {
    let active = true;

    const bootstrap = async () => {
      const { data } = await supabase.auth.getSession();
      const current = data?.session?.user || null;

      if (current && !isAdmin(current)) {
        // Non-whitelisted accounts are signed out immediately.
        await supabase.auth.signOut();
        if (active) {
          setUser(null);
          setAuthError('This account does not have access to the admin dashboard.');
        }
      } else if (active) {
        setUser(current);
      }
      if (active) setChecking(false);
    };

    bootstrap();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const next = session?.user || null;
      if (next && !isAdmin(next)) {
        await supabase.auth.signOut();
        setUser(null);
        setAuthError('This account does not have access to the admin dashboard.');
        return;
      }
      setUser(next);
    });

    return () => {
      active = false;
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (user && isAdmin(user)) loadDashboard();
  }, [user, loadDashboard]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setAuthLoading(false);
      setAuthError(error.message);
      return;
    }
    if (!isAdmin(data?.user)) {
      await supabase.auth.signOut();
      setAuthLoading(false);
      setAuthError('This account does not have access to the admin dashboard.');
      return;
    }
    setAuthLoading(false);
    setUser(data.user);
    setPassword('');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setArticles([]);
    setShowForm(false);
    setEditing(null);
  };

  const handleSaved = async () => {
    setShowForm(false);
    setEditing(null);
    await loadDashboard();
  };

  if (checking) {
    return (
      <div className="py-20 text-center">
        <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-brand border-b-transparent" />
        <p className="text-sm text-ink-soft">Checking session…</p>
      </div>
    );
  }

  /* ----------------------------- Login gate ----------------------------- */
  if (!user || !isAdmin(user)) {
    return (
      <div className="mx-auto max-w-md py-10">
        <div className="rounded-2xl border border-rule p-6">
          <h1 className="mb-1 font-serif text-xl font-bold text-ink">Admin Dashboard</h1>
          <p className="mb-6 text-sm text-ink-soft">
            Sign in with the newsroom account to manage articles.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="label" htmlFor="admin-email">
                Email
              </label>
              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@email.com"
                required
                className="input"
              />
            </div>
            <div>
              <label className="label" htmlFor="admin-password">
                Password
              </label>
              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="input"
              />
            </div>

            {authError ? <p className="text-sm text-date">{authError}</p> : null}

            <button type="submit" disabled={authLoading} className="btn-brand w-full">
              {authLoading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-ink-soft">
            Restricted to <span className="font-semibold text-ink">{ADMIN_EMAIL}</span>.
          </p>
        </div>
      </div>
    );
  }

  /* ----------------------------- Dashboard ----------------------------- */
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-rule pb-4">
        <div>
          <h1 className="font-serif text-xl font-bold text-ink">Admin Dashboard</h1>
          <p className="text-xs text-ink-soft">Signed in as {user.email}</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/" className="btn-ghost px-3 py-1.5 text-xs">
            View site
          </Link>
          <button onClick={handleLogout} className="btn-ghost px-3 py-1.5 text-xs">
            Sign out
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="font-serif text-lg font-bold text-ink">Articles</h2>
        <button
          onClick={() => {
            setEditing(null);
            setShowForm(true);
          }}
          className="btn-brand"
        >
          + New article
        </button>
      </div>

      {showForm || editing ? (
        <ArticleForm
          article={editing}
          user={user}
          onSaved={handleSaved}
          onCancel={() => {
            setShowForm(false);
            setEditing(null);
          }}
        />
      ) : null}

      <div className="overflow-x-auto rounded-2xl border border-rule">
        <table className="w-full min-w-[520px] border-collapse text-sm">
          <thead>
            <tr className="bg-surface text-left text-xs uppercase tracking-wide text-ink-soft">
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {dataLoading ? (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-ink-soft">
                  Loading articles…
                </td>
              </tr>
            ) : articles.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-ink-soft">
                  No articles yet. Start by adding a new article.
                </td>
              </tr>
            ) : (
              articles.map((article) => (
                <tr key={article.id} className="border-t border-rule">
                  <td className="px-4 py-3">
                    <Link
                      href={articleUrl(article)}
                      className="font-semibold text-ink hover:text-brand"
                    >
                      {article.title}
                    </Link>
                    <p className="text-xs text-ink-soft">/{article.slug}</p>
                  </td>
                  <td className="px-4 py-3 text-ink-soft">{formatDate(article.created_at)}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => {
                        setShowForm(false);
                        setEditing(article);
                      }}
                      className="font-semibold text-brand hover:text-brand-dark"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
