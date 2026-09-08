import { supabase } from '../lib/supabaseClient';

export default async function HomePage() {
  const { data: articles } = await supabase
    .from('articles')
    .select('*, categories(name, slug)')
    .order('created_at', { ascending: false });

  return (
    <main style={{ maxWidth: '700px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>DA News</h1>
        <p style={{ color: '#666', marginTop: '0.5rem' }}>Asia news, in English, for everyone.</p>
      </header>

      {(!articles || articles.length === 0) && (
        <p style={{ textAlign: 'center', color: '#999' }}>No articles yet.</p>
      )}

      {articles && articles.map((article) => (
        <article key={article.id} style={{ marginBottom: '2.5rem', borderBottom: '1px solid #eee', paddingBottom: '2rem' }}>
          {article.cover_image && (
            <img
              src={article.cover_image}
              alt={article.title}
              style={{ width: '100%', borderRadius: '4px', marginBottom: '1rem' }}
            />
          )}
          {article.categories && (
            <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#c81d3b', textTransform: 'uppercase' }}>
              {article.categories.name}
            </span>
          )}
          <h2 style={{ fontSize: '1.4rem', margin: '0.5rem 0' }}>{article.title}</h2>
          <p style={{ color: '#555' }}>{article.content.slice(0, 150)}...</p>
        </article>
      ))}
    </main>
  );
                  }
