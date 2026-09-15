import { Playfair_Display, Inter } from 'next/font/google';
import Header from './components/Header';
import Footer from './components/Footer';
import './globals.css';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const SITE_NAME = 'DA News';
const TAGLINE = 'Dubirodum Asia News';

export const metadata = {
  metadataBase: new URL('https://dubirodum.asia'),
  title: {
    default: `${SITE_NAME} — ${TAGLINE}`,
    template: `%s | ${SITE_NAME}`,
  },
  description: `${TAGLINE} — clear, original coverage of Asia and the world.`,
  openGraph: {
    title: `${SITE_NAME} — ${TAGLINE}`,
    description: `${TAGLINE} — clear, original coverage of Asia and the world.`,
    siteName: SITE_NAME,
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} — ${TAGLINE}`,
    description: `${TAGLINE} — clear, original coverage of Asia and the world.`,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen bg-white font-sans text-ink antialiased">
        <Header />
        <main className="container-page py-8 sm:py-10">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
