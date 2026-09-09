import Link from 'next/link';

export default function Home({ articles = [] }) {
  // Asumsi pembagian artikel dari Supabase:
  // article[0] = Hero / Featured Utama
  // article[1] = Sub-Featured
  // article[2..n] = List Berita Sampingan

  const featured = articles[0];
  const subFeatured = articles[1];
  const listArticles = articles.slice(2);

  return (
    <main className="max-w-md mx-auto px-4 py-4 space-y-6 bg-white min-h-screen text-gray-900 font-sans">
      
      {/* 1. HERO FEATURED ARTICLE (Image dengan Text Overlay) */}
      {featured && (
        <Link href={`/article/${featured.slug}`} className="block group">
          <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden shadow-sm">
            {/* Background Image */}
            <img 
              src={featured.cover_image || '/placeholder.jpg'} 
              alt={featured.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {/* Dark Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            
            {/* Content di atas gambar */}
            <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2 text-white">
              <span className="inline-block bg-teal-500/90 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                {featured.categories?.name || 'News'}
              </span>
              <h1 className="text-lg font-bold leading-snug line-clamp-3">
                {featured.title}
              </h1>
              <p className="text-[11px] text-gray-300">
                {new Date(featured.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </p>
            </div>
          </div>
        </Link>
      )}

      {/* 2. SUB-FEATURED ARTICLE (Teks saja) */}
      {subFeatured && (
        <Link href={`/article/${subFeatured.slug}`} className="block border-b border-gray-100 pb-4 space-y-1.5 group">
          <h2 className="text-base font-bold text-gray-900 leading-snug group-hover:text-teal-600 transition-colors">
            {subFeatured.title}
          </h2>
          <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
            {subFeatured.content}
          </p>
          <p className="text-[11px] text-gray-400 pt-1">
            {new Date(subFeatured.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </p>
        </Link>
      )}

      {/* 3. LIST ARTIKEL HORIZONTAL (Gambar Kiri, Teks Kanan) */}
      <div className="space-y-4 pt-2">
        {listArticles.map((item) => (
          <Link href={`/article/${item.slug}`} key={item.id} className="flex gap-3 items-start group">
            {/* Thumbnail Kiri */}
            <div className="relative w-28 h-24 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100">
              <img 
                src={item.cover_image || '/placeholder.jpg'} 
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute top-1.5 left-1.5 bg-teal-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                {item.categories?.name || 'News'}
              </span>
            </div>

            {/* Konten Kanan */}
            <div className="flex-1 min-w-0 space-y-1 py-0.5">
              <h3 className="text-xs font-bold text-gray-900 leading-snug line-clamp-3 group-hover:text-teal-600 transition-colors">
                {item.title}
              </h3>
              <p className="text-[10px] text-gray-400">
                {new Date(item.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </p>
            </div>
          </Link>
        ))}
      </div>

    </main>
  );
}
