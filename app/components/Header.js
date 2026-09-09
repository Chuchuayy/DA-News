'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

const categories = [
  { id: '54bfeb8a-47c1-4854-ac22-67660cee75f0', name: 'World', slug: 'world' },
  { id: '70eac60d-7488-47e8-8e6c-0795c6530f65', name: 'Technology', slug: 'technology' },
];

export default function Header() {
  const [user, setUser] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryOpen, setCategoryOpen] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data?.session?.user || null);
    };
    getUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    return () => authListener?.subscription?.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-500 text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Top Row - Logo & Auth */}
        <div className="flex items-center justify-between mb-4">
          <Link href="/" className="flex flex-col">
            <h1 className="text-2xl font-bold">DA News</h1>
            <p className="text-xs text-blue-100">Dubirodum Asia News</p>
          </Link>

          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-blue-600 font-bold">
                    {user.user_metadata?.display_name?.[0] || 'U'}
                  </div>
                  <span className="text-sm font-medium hidden sm:inline">{user.user_metadata?.display_name || 'User'}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm font-medium transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link href="/login" className="bg-white text-blue-600 px-4 py-1.5 rounded font-semibold text-sm hover:bg-gray-100 transition">
                  Login
                </Link>
                <Link href="/signup" className="border border-white text-white px-4 py-1.5 rounded font-semibold text-sm hover:bg-white/10 transition">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Row - Categories & Search */}
        <div className="flex items-center justify-between">
          {/* Categories */}
          <div className="flex gap-4">
            <Link href="/" className="text-sm font-medium hover:text-blue-100 transition">
              Home
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className="text-sm font-medium hover:text-blue-100 transition"
              >
                {cat.name}
              </Link>
            ))}
            {user && (
              <Link href="/admin" className="text-sm font-medium hover:text-blue-100 transition text-yellow-200">
                Admin
              </Link>
            )}
          </div>

          {/* Search Bar */}
          <div className="relative w-64">
            <input
              type="text"
              placeholder="Search news..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-1.5 rounded-full text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-300"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-900 font-bold">
              🔍
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
