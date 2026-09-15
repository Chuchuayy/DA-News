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

  async function handleGoogle() {
    setError('');
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    });
  }

  return (
    <div className="mx-auto max-w-md py-10">
      <div className="mb-6 text-center">
        <span className="text-3xl font-bold tracking-tight text-brand">DA</span>
        <p className="mt-1 text-xs font-medium uppercase tracking-[0.18em] text-ink-soft">
          Dubirodum Asia News
        </p>
      </div>

      <div className="rounded-2xl border border-rule p-6">
        <h1 className="mb-1 font-serif text-xl font-bold text-ink">Sign in</h1>
        <p className="mb-6 text-sm text-ink-soft">Sign in to comment and manage your account.</p>

        <button type="button" onClick={handleGoogle} className="btn-ghost w-full">
          Continue with Google
        </button>

        <div className="my-5 flex items-center gap-3 text-xs text-ink-faint">
          <span className="h-px flex-1 bg-rule" />
          or
          <span className="h-px flex-1 bg-rule" />
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="name@email.com"
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

          {error ? <p className="text-sm text-date">{error}</p> : null}

          <button type="submit" disabled={loading} className="btn-brand w-full">
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-soft">
          No account?{' '}
          <Link href="/app/signup" className="font-semibold text-brand hover:text-brand-dark">
            Create one
          </Link>
        </p>
      </div>

      <p className="mt-6 text-center text-xs text-ink-soft">
        <Link href="/" className="hover:text-brand">
          &larr; Back to home
        </Link>
      </p>
    </div>
  );
}
