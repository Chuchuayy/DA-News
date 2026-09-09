import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '../lib/supabaseClient';

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  });
}

export default async function HomePage() {
  const { data: articles } = await supabase
    .from('articles')
    .select('*, categories(name, slug)')
    .order('created_at', { ascending: false });

  const { data: categories } = await supabase
    .from('categories')
    .select('*');

  const hero = articles && articles[0];
  const rest = articles ? articles.slice(1) : [];

  return (
    <main style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 1.5rem' }}>

      {hero && (
        <section style={{ marginBottom: '3rem' }}>
          <Link href={`/article/${hero.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            {hero.cover_image && (
              <div style={{ position: 'relative', width: '100%', height: '400px', marginBottom: '1rem' }}>
                <Image
                  src={hero.cover_image}
                  alt={hero.title}
                  fill
                  style={{ objectFit: 'contain', borderRadius: '4px' }}
                  priority
                />
              </div>
            )}
            {hero.categories && (
              <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#c81d3b', textTransform: 'uppercase' }}>
                {hero.categories.name}
              </span>
            )}
            <h2 style={{ fontSize: '1.8rem', margin: '0.5rem 0' }}>{hero.title}</h2>
          </Link>
          <p style={{ color: '#999', fontSize: '0.85rem', margin: '0 0 0.75rem' }}>{formatDate(hero.created_at)}</p>
          <p style={{ color: '#555' }}>{hero.content.slice(0, 200)}...</p>
        </section>
      )}

      {categories && categories.length > 0 && (
        <section style={{ marginBottom: '3rem' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Browse by Category</h3>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                style={{
                  textDecoration: 'none', color: '#333', border: '1px solid #ddd',
                  borderRadius: '20px', padding: '0.5rem 1.2rem', fontSize: '0.9rem'
                }}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      {rest.length > 0 && (
        <section>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>More Stories</h3>
          {rest.map((article) => (
            <article key={article.id} style={{ marginBottom: '2rem', borderBottom: '1px solid #eee', paddingBottom: '1.5rem' }}>
              <Link href={`/article/${article.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <h2 style={{ fontSize: '1.2rem', margin: '0 0 0.3rem' }}>{article.title}</h2>
              </Link>
              <p style={{ color: '#999', fontSize: '0.8rem', margin: '0 0 0.5rem' }}>{formatDate(article.created_at)}</p>
              <p style={{ color: '#555' }}>{article.content.slice(0, 120)}...</p>
            </article>
          ))}
        </section>
      )}

    </main>
  );
  }
