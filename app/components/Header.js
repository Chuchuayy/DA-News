'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';
import { getCategories, searchArticles } from '../../lib/queries';
import { articleUrl } from '../../lib/format';
import { isAdmin } from '../../lib/admin';
import { SITE_NAME } from '../../lib/seo';

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function Header() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [categories, setCategories] = useState([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    let active = true;
    getCategories()
      .then(({ data }) => {
        if (active) setCategories(data || []);
      })
      .catch(() => {});

    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (active) setUser(data?.session?.user || null);
      })
      .catch(() => {});

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      active = false;
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  // Focus the input as soon as the slide-down bar opens.
  useEffect(() => {
    if (searchOpen) inputRef.current?.focus();
  }, [searchOpen]);

  // Live title search, debounced.
  useEffect(() => {
    const term = query.trim();
    if (!term) {
      setResults([]);
      return undefined;
    }
    let active = true;
    const id = setTimeout(async () => {
      try {
        const { data } = await searchArticles(term, 8);
        if (active) setResults(data || []);
      } catch {
        if (active) setResults([]);
      }
    }, 220);
    return () => {
      active = false;
      clearTimeout(id);
    };
  }, [query]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setMenuOpen(false);
    router.push('/');
    router.refresh();
  };

  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    });
  };

  const closeAll = () => {
    setMenuOpen(false);
    setSearchOpen(false);
  };

  const adminUser = isAdmin(user);

  return (
    <header className="sticky top-0 z-50 border-b border-rule bg-white">
      <div className="container-page flex h-[60px] items-center justify-between">
        <Link href="/" onClick={closeAll} className="text-2xl font-bold tracking-tight text-brand">
          {SITE_NAME}
        </Link>

        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Search"
            onClick={() => {
              setMenuOpen(false);
              setSearchOpen((v) => !v);
            }}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-surface text-ink transition hover:text-brand"
          >
            <SearchIcon />
          </button>
          <button
            type="button"
            aria-label="Menu"
            onClick={() => {
              setSearchOpen(false);
              setMenuOpen(true);
            }}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-surface text-ink transition hover:text-brand"
          >
            <MenuIcon />
          </button>
        </div>
      </div>

      {/* Slide-down search bar */}
      <div
        className={`overflow-hidden border-t border-rule bg-white transition-all duration-300 ${
          searchOpen ? 'max-h-[70vh] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="container-page py-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const first = results[0];
              if (first) {
                router.push(articleUrl(first));
                closeAll();
              }
            }}
          >
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search articles by title…"
              className="input"
              aria-label="Search articles"
            />
          </form>

          {query.trim() && results.length > 0 ? (
            <ul className="mt-3 divide-y divide-rule">
              {results.map((item) => (
                <li key={item.id}>
                  <Link
                    href={articleUrl(item)}
                    onClick={closeAll}
                    className="block py-3 text-sm font-medium text-ink transition hover:text-brand"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          ) : query.trim() ? (
            <p className="mt-3 text-sm text-ink-soft">No articles found.</p>
          ) : null}
        </div>
      </div>

      {/* Right slide-in drawer */}
      <div
        className={`fixed inset-0 z-50 ${menuOpen ? '' : 'pointer-events-none'}`}
        aria-hidden={!menuOpen}
      >
        <div
          onClick={() => setMenuOpen(false)}
          className={`absolute inset-0 bg-black/30 transition-opacity duration-300 ${
            menuOpen ? 'opacity-100' : 'opacity-0'
          }`}
        />
        <aside
          className={`absolute right-0 top-0 flex h-full w-[300px] max-w-[85vw] flex-col bg-white shadow-lift transition-transform duration-300 ${
            menuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex h-[60px] items-center justify-between border-b border-rule px-5">
            <span className="text-lg font-bold text-brand">{SITE_NAME}</span>
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setMenuOpen(false)}
              className="text-2xl leading-none text-ink-soft hover:text-ink"
            >
              ×
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-5 py-5">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink-faint">
              Categories
            </p>
            <ul className="space-y-3">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/category/${cat.slug}`}
                    onClick={closeAll}
                    className="block text-base font-medium text-ink transition hover:text-brand"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="my-5 border-t border-rule" />

            <ul className="space-y-3">
              <li>
                <Link
                  href="/about"
                  onClick={closeAll}
                  className="block text-base font-medium text-ink transition hover:text-brand"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  onClick={closeAll}
                  className="block text-base font-medium text-ink transition hover:text-brand"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/account"
                  onClick={closeAll}
                  className="block text-base font-medium text-ink transition hover:text-brand"
                >
                  Account
                </Link>
              </li>
              {adminUser ? (
                <li>
                  <Link
                    href="/admin"
                    onClick={closeAll}
                    className="block text-base font-medium text-brand transition hover:text-brand-dark"
                  >
                    Admin
                  </Link>
                </li>
              ) : null}
            </ul>
          </nav>

          <div className="border-t border-rule px-5 py-5">
            {user ? (
              <div className="space-y-3">
                <p className="truncate text-sm text-ink-soft">{user.email}</p>
                <button type="button" onClick={handleSignOut} className="btn-ghost w-full">
                  Sign out
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <button type="button" onClick={handleGoogle} className="btn-brand w-full">
                  Continue with Google
                </button>
              </div>
            )}
          </div>
        </aside>
      </div>
    </header>
  );
}
