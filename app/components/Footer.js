'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getCategories } from '../../lib/queries';

export default function Footer() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    let active = true;
    getCategories()
      .then(({ data }) => {
        if (active) setCategories(data || []);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const year = new Date().getFullYear();

  return (
    <footer className="mt-12 border-t-4 border-primary bg-primary-dark text-blue-50">
      <div className="container-page grid grid-cols-1 gap-8 py-10 md:grid-cols-4">
        {/* Brand */}
        <div className="md:col-span-2">
          <div className="flex flex-col leading-none">
            <span className="text-2xl font-extrabold tracking-tight text-white">DA News</span>
            <span className="mt-1 text-[11px] font-medium uppercase tracking-[0.18em] text-blue-200">
              Dubirodum Asia News
            </span>
          </div>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-blue-100">
            DA News menghadirkan berita terkini dan terpercaya dari seluruh Asia — politik,
            ekonomi, teknologi, dan dunia — dengan penyajian yang cepat, akurat, dan mendalam.
          </p>
        </div>

        {/* Categories */}
        <div>
          <h3 className="mb-3 text-xs font-bold uppercase tracking-wide text-white">Kategori</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/" className="text-blue-100 hover:text-white">
                Home
              </Link>
            </li>
            {categories.map((cat) => (
              <li key={cat.id}>
                <Link href={`/category/${cat.slug}`} className="text-blue-100 hover:text-white">
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Subscribe / contact */}
        <div>
          <h3 className="mb-3 text-xs font-bold uppercase tracking-wide text-white">
            Berlangganan
          </h3>
          <p className="mb-3 text-sm text-blue-100">
            Dapatkan ringkasan berita terbaru langsung dari redaksi.
          </p>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex items-center overflow-hidden rounded bg-white"
          >
            <input
              type="email"
              required
              placeholder="Email Anda"
              aria-label="Email berlangganan"
              className="w-full px-3 py-2 text-sm text-ink outline-none"
            />
            <button
              type="submit"
              className="bg-primary px-3 py-2 text-sm font-semibold text-white hover:bg-primary-light"
            >
              Kirim
            </button>
          </form>
          <ul className="mt-4 space-y-1 text-sm text-blue-100">
            <li>Redaksi: redaksi@dubirodum.asia</li>
            <li>Iklan: ads@dubirodum.asia</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-blue-800">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-4 text-xs text-blue-200 sm:flex-row">
          <span>
            &copy; {year} DA News — Dubirodum Asia News. Seluruh hak cipta dilindungi.
          </span>
          <nav className="flex items-center gap-4">
            <Link href="/about" className="hover:text-white">
              Tentang Kami
            </Link>
            <Link href="/search" className="hover:text-white">
              Pencarian
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
