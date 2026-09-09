import Link from 'next/link';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 px-4 py-3">
      <div className="max-w-md mx-auto flex items-center justify-between">
        {/* Logo DA dengan warna Cyan/Teal */}
        <Link href="/" className="text-2xl font-black tracking-wider text-teal-500">
          DA
        </Link>

        {/* Icon Search & Menu */}
        <div className="flex items-center gap-4 text-gray-700">
          <button aria-label="Search" className="p-1 hover:text-teal-500 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          <button aria-label="Menu" className="p-1 hover:text-teal-500 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
