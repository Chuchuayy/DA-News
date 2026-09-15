import Link from 'next/link';

export const metadata = {
  title: 'Tentang Kami',
  description:
    'DA News (Dubirodum Asia News) adalah portal berita independen yang menyajikan informasi terkini dari Asia.',
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="section-bar">
        <h1 className="section-bar__title text-xl">Tentang Kami</h1>
      </div>

      <div className="article-body">
        <p>
          <strong>DA News</strong> — <em>Dubirodum Asia News</em> — adalah portal berita
          independen yang menyajikan informasi terkini, akurat, dan mendalam dari kawasan Asia
          maupun dunia.
        </p>
        <p>
          Kami berkomitmen pada jurnalisme yang cepat dan dapat dipercaya: politik, ekonomi,
          teknologi, dan peristiwa dunia disajikan secara ringkas namun tetap tajam. Redaksi kami
          bekerja sepanjang hari untuk memastikan pembaca mendapatkan fakta terverifikasi.
        </p>

        <h2>Visi</h2>
        <p>
          Menjadi rujukan berita Asia yang paling terpercaya bagi pembaca di Indonesia dan
          sekitarnya.
        </p>

        <h2>Misi</h2>
        <ul>
          <li>Menyajikan berita yang akurat, berimbang, dan bebas dari kepentingan pihak tertentu.</li>
          <li>Menghadirkan konteks dan analisis yang membantu pembaca memahami peristiwa.</li>
          <li>Mengutamakan kecepatan tanpa mengorbankan ketepatan.</li>
        </ul>

        <h2>Kontak</h2>
        <p>
          Redaksi: <a href="mailto:redaksi@dubirodum.asia">redaksi@dubirodum.asia</a>
          <br />
          Iklan &amp; Kerja Sama: <a href="mailto:ads@dubirodum.asia">ads@dubirodum.asia</a>
        </p>
      </div>

      <Link href="/" className="btn-primary mt-8">
        Kembali ke Beranda
      </Link>
    </div>
  );
}
