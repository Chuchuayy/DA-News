'use client';

import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '../../../lib/supabaseClient';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSignup(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error: signUpError } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (signUpError) {
      setError(signUpError.message);
    } else {
      setSuccess(true);
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
        {success ? (
          <div className="text-center">
            <h1 className="mb-2 text-lg font-bold text-ink">Periksa Email Anda</h1>
            <p className="text-sm text-ink-soft">
              Kami mengirim tautan konfirmasi ke{' '}
              <span className="font-semibold text-ink">{email}</span>. Silakan konfirmasi sebelum
              masuk.
            </p>
            <Link href="/login" className="btn-primary mt-6">
              Ke Halaman Masuk
            </Link>
          </div>
        ) : (
          <>
            <h1 className="mb-1 text-lg font-bold text-ink">Daftar</h1>
            <p className="mb-6 text-sm text-ink-soft">Buat akun untuk mengakses DA News.</p>

            <form onSubmit={handleSignup} className="space-y-4">
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
                  placeholder="Minimal 6 karakter"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="input"
                />
              </div>

              {error ? (
                <p className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                  {error}
                </p>
              ) : null}

              <button type="submit" disabled={loading} className="btn-primary w-full">
                {loading ? 'Memproses...' : 'Daftar'}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-ink-soft">
              Sudah punya akun?{' '}
              <Link href="/login" className="font-semibold text-primary hover:text-primary-dark">
                Masuk
              </Link>
            </p>
          </>
        )}
      </div>

      <p className="mt-6 text-center text-xs text-ink-soft">
        <Link href="/" className="hover:text-primary">
          &larr; Kembali ke Beranda
        </Link>
      </p>
    </div>
  );
}
