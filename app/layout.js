export const metadata = {
  title: 'DA News',
  description: 'Asia news, in English, for everyone.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
  }
