import Link from 'next/link';

export default function Header() {
  return (
    <header style={{ borderBottom: '1px solid #eee' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: '900px',
        margin: '0 auto',
        padding: '1.25rem 1.5rem'
      }}>
        <Link href="/" style={{ textDecoration: 'none', color: '#000' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>DA News</h1>
        </Link>
        <nav style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <Link href="/" style={{ textDecoration: 'none', color: '#333', fontSize: '0.9rem' }}>Home</Link>
          <Link href="/about" style={{ textDecoration: 'none', color: '#333', fontSize: '0.9rem' }}>About</Link>
          <button aria-label="Search" style={{ background: 'none', border: 'none', fontSize: '1.1rem', cursor: 'pointer' }}>🔍</button>
        </nav>
      </div>
    </header>
  );
}
