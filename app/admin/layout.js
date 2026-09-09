'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';

export default function AdminLayout({ children }) {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          router.push('/login');
          return;
        }

        const { data: profile } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', session.user.id)
          .single();

        if (!profile?.is_admin) {
          router.push('/');
          return;
        }

        setUser(session.user);
        setIsAdmin(true);
        setLoading(false);
      } catch (error) {
        console.error('Error checking admin status:', error);
        router.push('/');
      }
    };

    checkAdmin();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-900 text-white p-6 fixed h-screen overflow-y-auto">
        <Link href="/admin" className="block mb-8">
          <h2 className="text-2xl font-bold">DA Admin</h2>
          <p className="text-xs text-blue-200">Control Panel</p>
        </Link>

        <nav className="space-y-4">
          <Link
            href="/admin"
            className="block px-4 py-2 rounded hover:bg-blue-800 transition font-medium"
          >
            📊 Dashboard
          </Link>
          <Link
            href="/admin/new"
            className="block px-4 py-2 rounded bg-green-600 hover:bg-green-700 transition font-medium"
          >
            ✏️ New Article
          </Link>
          <Link
            href="/"
            className="block px-4 py-2 rounded hover:bg-blue-800 transition font-medium"
          >
            🏠 Back to Home
          </Link>
        </nav>

        <div className="mt-8 pt-8 border-t border-blue-700">
          <p className="text-xs text-blue-300 mb-2">Logged in as:</p>
          <p className="text-sm font-medium truncate">{user?.user_metadata?.display_name || 'Admin'}</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        {children}
      </main>
    </div>
  );
}
