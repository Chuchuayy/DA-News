'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';

export default function AccountPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    let active = true;

    const load = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const current = session?.user || null;
      if (!active) return;
      setUser(current);

      if (current) {
        const { data } = await supabase
          .from('profiles')
          .select('id, display_name, avatar_url')
          .eq('id', current.id)
          .maybeSingle();
        if (active) setProfile(data);
      }
      if (active) setLoading(false);
    };

    load();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      active = false;
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    });
  };

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-brand border-b-transparent" />
        <p className="text-sm text-ink-soft">Loading…</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-md py-16 text-center">
        <h1 className="font-serif text-2xl font-bold text-ink">Account</h1>
        <p className="mt-2 text-sm text-ink-soft">Sign in with Google to view your profile.</p>
        <button type="button" onClick={handleGoogle} className="btn-brand mt-6">
          Continue with Google
        </button>
      </div>
    );
  }

  const name = profile?.display_name || user.email?.split('@')[0] || 'Reader';

  return (
    <div className="mx-auto max-w-md py-8">
      <h1 className="mb-6 border-b border-rule pb-4 font-serif text-2xl font-bold text-ink">
        Account
      </h1>

      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-surface text-xl font-bold text-brand">
          {profile?.avatar_url ? (
            <img src={profile.avatar_url} alt={name} className="h-full w-full object-cover" />
          ) : (
            name.charAt(0).toUpperCase()
          )}
        </div>
        <div className="min-w-0">
          <p className="truncate text-lg font-semibold text-ink">{name}</p>
          <p className="truncate text-sm text-ink-soft">{user.email}</p>
        </div>
      </div>

      <button type="button" onClick={handleSignOut} className="btn-ghost mt-8 w-full">
        Sign out
      </button>
    </div>
  );
}
