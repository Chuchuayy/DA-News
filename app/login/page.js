'use client';

import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '../../lib/supabaseClient';
import { SITE_NAME } from '../../lib/seo';

export default function LoginPage() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleGoogle() {
    setError('');
    setLoading(true);
    const { error: signInError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    });
    if (signInError) {
      setLoading(false);
      setError(signInError.message);
    }
  }

  return (
    <div className="mx-auto max-w-md py-10">
      <div className="mb-6 text-center">
        <span className="text-3xl font-bold tracking-tight text-brand">{SITE_NAME}</span>
        <p className="mt-1 text-xs font-medium uppercase tracking-[0.18em] text-ink-soft">
          Dubirodum Asia News
        </p>
      </div>

      <div className="rounded-2xl border border-rule p-6">
        <h1 className="mb-1 font-serif text-xl font-bold text-ink">Sign in</h1>
        <p className="mb-6 text-sm text-ink-soft">Sign in to comment and manage your account.</p>

        <button type="button" onClick={handleGoogle} disabled={loading} className="btn-brand w-full">
          {loading ? 'Redirecting…' : 'Continue with Google'}
        </button>

        {error ? <p className="mt-4 text-sm text-date">{error}</p> : null}
      </div>

      <p className="mt-6 text-center text-xs text-ink-soft">
        <Link href="/" className="hover:text-brand">
          &larr; Back to home
        </Link>
      </p>
    </div>
  );
}
