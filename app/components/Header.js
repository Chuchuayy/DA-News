'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';
import { getCategories } from '../../lib/queries';
import { isAdmin } from '../../lib/admin';

export default function Header() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [today, setToday] = useState('');

  useEffect(() => {
    // Date is resolved on the client to avoid SSR/client hydration mismatch.
    setToday(
      new Date().toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    );

    let active = true;
    getCategories()
      .then(({ data }) => {
        if (active) setCategories(data || []);
      })
      .catch(() => {});

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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const q = searchQuery.trim();
    router.push(q ? `/search?q=${encodeURIComponent(q)}` : '/search');
  };

  const adminUser = isAdmin(user);

  return (
    <header className="sticky top-0 z-50 border-b border-rule bg-white">
      {/* Utility strip */}
      <div className="bg-primary-dark text-white">
        <div className="container-page flex h-8 items-center justify-between text-[11px] sm:text-xs">
          <span className="truncate">
            <span className="font-semibold">Dubirodum Asia News</span>
            {today ? <span className="ml-2 hidden text-blue-100 sm:inline">{today}</span> : null}
          </span>
          <nav className="flex items-center gap-3">
            <Link href="/about" className="hover:text-blue-100">
              About
            </Link>
            {adminUser ? (
              <>
                <Link href="/admin" className="font-semibold text-amber-300 hover:text-amber-200">
                  Admin
                </Link>
                <button onClick={handleLogout} className="hover:text-blue-100">
                  Logout
                </button>
              </>
            ) : user ? (
              <button onClick={handleLogout} className="hover:text-blue-100">
                Logout
              </button>
            ) : (
              <Link href="/login" className="hover:text-blue-100">
                Login
              </Link>
            )}
          </nav>
        </div>
      </div>

      {/* Masthead */}
      <div className="container-page flex items-center justify-between gap-4 py-3 sm:py-4">
        <Link href="/" className="flex flex-col leading-none">
          <span className="text-2xl font-extrabold tracking-tight text-primary sm:text-3xl">
            DA News
          </span>
          <span className="mt-0.5 text-[11px] font-medium uppercase tracking-[0.18em] text-ink-soft">
            Dubirodum Asia News
          </span>
        </Link>

        <form onSubmit={handleSearch} className="relative hidden w-full max-w-xs sm:block">
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari berita..."
            className="input pr-10"
            aria-label="Cari berita"
          />
          <button
            type="submit"
            aria-label="Cari"
            className="absolute right-1 top-1/2 -translate-y-1/2 rounded bg-primary px-2 py-1 text-xs font-semibold text-white hover:bg-primary-dark"
          >
            Cari
          </button>
        </form>
      </div>

      {/* Category navigation */}
      <nav className="border-t border-rule bg-white">
        <div className="container-page flex items-center gap-4 overflow-x-auto py-2 text-sm">
          <Link
            href="/"
            className="whitespace-nowrap font-semibold text-ink transition hover:text-primary"
          >
            Home
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className="whitespace-nowrap font-medium text-ink-soft transition hover:text-primary"
            >
              {cat.name}
            </Link>
          ))}
          <form onSubmit={handleSearch} className="relative ml-auto sm:hidden">
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari..."
              className="input w-32 py-1 text-xs"
              aria-label="Cari berita"
            />
          </form>
        </div>
      </nav>
    </header>
  );
}
