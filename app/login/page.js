'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (signInError) {
      setError(signInError.message);
    } else {
      router.push('/');
      router.refresh();
    }
  }

  return (
    <div className="mx-auto max-w-md py-10">
      <div className="mb-6 text-center">
        <span className="text-2xl font-extrabold tracking-tight text-primary">DA News</span>
        <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.18em] text-ink-soft">
          Dubirodum Asia News
        </p>
      </div>

      <div className="rounded border border-rule bg-white p-6 shadow-card">
        <h1 className="mb-1 text-lg font-bold text-ink">Masuk</h1>
        <p className="mb-6 text-sm text-ink-soft">Masuk untuk mengelola berita DA News.</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="nama@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input"
            />
          </div>
          <div>
            <label className="label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input"
            />
          </div>

          {error ? (
            <p className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          ) : null}

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Memproses...' : 'Masuk'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-soft">
          Belum punya akun?{' '}
          <Link href="/app/signup" className="font-semibold text-primary hover:text-primary-dark">
            Daftar
          </Link>
        </p>
      </div>

      <p className="mt-6 text-center text-xs text-ink-soft">
        <Link href="/" className="hover:text-primary">
          &larr; Kembali ke Beranda
        </Link>
      </p>
    </div>
  );
}
