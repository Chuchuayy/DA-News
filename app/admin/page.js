'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../../lib/supabaseClient';
import { ADMIN_EMAIL, isAdmin, listArticles, listCategories } from '../../lib/admin';
import { formatDate } from '../../lib/format';
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
  const [categories, setCategories] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const loadDashboard = useCallback(async () => {
    setDataLoading(true);
    const [{ data: list }, { data: cats }] = await Promise.all([listArticles(), listCategories()]);
    setArticles(list || []);
    setCategories(cats || []);
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
          setAuthError('Akun ini tidak memiliki akses ke dashboard admin.');
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
        setAuthError('Akun ini tidak memiliki akses ke dashboard admin.');
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
      setAuthError('Akun ini tidak memiliki akses ke dashboard admin.');
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
      <div className="py-16 text-center">
        <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-primary border-b-transparent" />
        <p className="text-sm text-ink-soft">Memeriksa sesi...</p>
      </div>
    );
  }

  /* ----------------------------- Login gate ----------------------------- */
  if (!user || !isAdmin(user)) {
    return (
      <div className="mx-auto max-w-md py-10">
        <div className="rounded border border-rule bg-white p-6 shadow-card">
          <h1 className="mb-1 text-lg font-bold text-ink">Dashboard Admin</h1>
          <p className="mb-6 text-sm text-ink-soft">
            Masuk dengan akun redaksi untuk mengelola berita.
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
                placeholder="nama@email.com"
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

            {authError ? (
              <p className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                {authError}
              </p>
            ) : null}

            <button type="submit" disabled={authLoading} className="btn-primary w-full">
              {authLoading ? 'Memproses...' : 'Masuk'}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-ink-soft">
            Akses terbatas untuk <span className="font-semibold text-ink">{ADMIN_EMAIL}</span>.
          </p>
        </div>
      </div>
    );
  }

  /* ----------------------------- Dashboard ----------------------------- */
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-primary pb-3">
        <div>
          <h1 className="text-xl font-extrabold text-ink">Dashboard Admin</h1>
          <p className="text-xs text-ink-soft">Masuk sebagai {user.email}</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/" className="btn-ghost py-1.5 text-xs">
            Lihat Situs
          </Link>
          <button onClick={handleLogout} className="btn-ghost py-1.5 text-xs">
            Keluar
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="section-bar__title">Kelola Artikel</h2>
        <button
          onClick={() => {
            setEditing(null);
            setShowForm(true);
          }}
          className="btn-primary"
        >
          + Artikel Baru
        </button>
      </div>

      {showForm || editing ? (
        <ArticleForm
          article={editing}
          categories={categories}
          user={user}
          onSaved={handleSaved}
          onCancel={() => {
            setShowForm(false);
            setEditing(null);
          }}
        />
      ) : null}

      <div className="overflow-x-auto rounded border border-rule">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead>
            <tr className="bg-primary-soft text-left text-xs uppercase tracking-wide text-ink-soft">
              <th className="px-4 py-3">Judul</th>
              <th className="px-4 py-3">Kategori</th>
              <th className="px-4 py-3">Tanggal</th>
              <th className="px-4 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {dataLoading ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-ink-soft">
                  Memuat artikel...
                </td>
              </tr>
            ) : articles.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-ink-soft">
                  Belum ada artikel. Mulai dengan menambahkan artikel baru.
                </td>
              </tr>
            ) : (
              articles.map((article) => (
                <tr key={article.id} className="border-t border-rule">
                  <td className="px-4 py-3">
                    <Link
                      href={`/article/${article.slug}`}
                      className="font-semibold text-ink hover:text-primary"
                    >
                      {article.title}
                    </Link>
                    <p className="text-xs text-ink-soft">/{article.slug}</p>
                  </td>
                  <td className="px-4 py-3 text-ink-soft">
                    {article.categories?.name || '—'}
                  </td>
                  <td className="px-4 py-3 text-ink-soft">{formatDate(article.created_at)}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => {
                        setShowForm(false);
                        setEditing(article);
                      }}
                      className="font-semibold text-primary hover:text-primary-dark"
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
