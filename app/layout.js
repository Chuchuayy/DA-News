import Header from './components/Header';

export const metadata = {
  title: 'DA News- Dubirodum Asia News',
  description: 'Dubirodum Asia News.',
  openGraph: {
    title: 'DA News',
    description: 'Dubirodum Asia News.',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'system-ui, -apple-system, sans-serif', color: '#1a1a1a' }}>
        <Header />
        {children}
      </body>
    </html>
  );
}
