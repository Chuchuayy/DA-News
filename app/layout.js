import Header from './components/Header';
import Footer from './components/Footer';
import './globals.css';

const SITE_NAME = 'DA News';
const TAGLINE = 'Dubirodum Asia News';

export const metadata = {
  metadataBase: new URL('https://dubirodum.asia'),
  title: {
    default: `${SITE_NAME} - ${TAGLINE}`,
    template: `%s | ${SITE_NAME}`,
  },
  description: `${TAGLINE} - Berita terkini dan terpercaya dari Asia: politik, ekonomi, teknologi, dan dunia.`,
  keywords: ['DA News', TAGLINE, 'berita Asia', 'berita terkini', 'dubirodum'],
  openGraph: {
    title: `${SITE_NAME} - ${TAGLINE}`,
    description: `${TAGLINE} - Berita terkini dan terpercaya dari Asia.`,
    siteName: SITE_NAME,
    type: 'website',
    locale: 'id_ID',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} - ${TAGLINE}`,
    description: `${TAGLINE} - Berita terkini dan terpercaya dari Asia.`,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-white font-sans text-ink antialiased">
        <Header />
        <main className="container-page py-6 sm:py-8">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
