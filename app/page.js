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
        <Link href={`/article/${hero.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          <section style={{
            marginBottom: '2rem',
            border: '1px solid #eee',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
          }}>
            {hero.cover_image && (
              <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', background: '#f5f5f5' }}>
                <Image
                  src={hero.cover_image}
                  alt={hero.title}
                  fill
                  style={{ objectFit: 'cover' }}
                  priority
                />
              </div>
            )}
            <div style={{ padding: '1.25rem' }}>
              {hero.categories && (
                <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#c81d3b', textTransform: 'uppercase' }}>
                  {hero.categories.name}
                </span>
              )}
              <h2 style={{ fontSize: '1.6rem', margin: '0.5rem 0' }}>{hero.title}</h2>
              <p style={{ color: '#999', fontSize: '0.85rem', margin: '0 0 0.75rem' }}>{formatDate(hero.created_at)}</p>
              <p style={{ color: '#555', margin: 0 }}>{hero.content.slice(0, 200)}...</p>
            </div>
          </section>
        </Link>
      )}

      {categories && categories.length > 0 && (
        <section style={{ marginBottom: '2rem' }}>
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
          <div style={{ display: 'grid', gap: '1.25rem' }}>
            {rest.map((article) => (
              <Link key={article.id} href={`/article/${article.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <article style={{
                  border: '1px solid #eee',
                  borderRadius: '12px',
                  padding: '1.25rem',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
                }}>
                  <h2 style={{ fontSize: '1.2rem', margin: '0 0 0.3rem' }}>{article.title}</h2>
                  <p style={{ color: '#999', fontSize: '0.8rem', margin: '0 0 0.5rem' }}>{formatDate(article.created_at)}</p>
                  <p style={{ color: '#555', margin: 0 }}>{article.content.slice(0, 120)}...</p>
                </article>
              </Link>
            ))}
          </div>
        </section>
      )}

    </main>
  );
              }
