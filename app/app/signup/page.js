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
        <span className="text-3xl font-bold tracking-tight text-brand">DA</span>
        <p className="mt-1 text-xs font-medium uppercase tracking-[0.18em] text-ink-soft">
          Dubirodum Asia News
        </p>
      </div>

      <div className="rounded-2xl border border-rule p-6">
        {success ? (
          <div className="text-center">
            <h1 className="mb-2 font-serif text-xl font-bold text-ink">Check your email</h1>
            <p className="text-sm text-ink-soft">
              We sent a confirmation link to <span className="font-semibold text-ink">{email}</span>
              . Please confirm before signing in.
            </p>
            <Link href="/login" className="btn-brand mt-6">
              Go to sign in
            </Link>
          </div>
        ) : (
          <>
            <h1 className="mb-1 font-serif text-xl font-bold text-ink">Create account</h1>
            <p className="mb-6 text-sm text-ink-soft">Create an account to comment on DA News.</p>

            <form onSubmit={handleSignup} className="space-y-4">
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
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="input"
                />
              </div>

              {error ? <p className="text-sm text-date">{error}</p> : null}

              <button type="submit" disabled={loading} className="btn-brand w-full">
                {loading ? 'Creating…' : 'Create account'}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-ink-soft">
              Already have an account?{' '}
              <Link href="/login" className="font-semibold text-brand hover:text-brand-dark">
                Sign in
              </Link>
            </p>
          </>
        )}
      </div>

      <p className="mt-6 text-center text-xs text-ink-soft">
        <Link href="/" className="hover:text-brand">
          &larr; Back to home
        </Link>
      </p>
    </div>
  );
}
