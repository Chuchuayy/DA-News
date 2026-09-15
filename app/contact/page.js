export const metadata = {
  title: 'Contact',
  description: 'Contact the DA News (Dubirodum Asia News) newsroom.',
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 border-b border-rule pb-4 font-serif text-2xl font-bold text-ink">
        Contact
      </h1>

      <div className="article-body">
        <p>We welcome tips, corrections and feedback from our readers.</p>

        <h2>Newsroom</h2>
        <p>
          <a href="mailto:newsroom@dubirodum.asia">newsroom@dubirodum.asia</a>
        </p>

        <h2>Advertising</h2>
        <p>
          <a href="mailto:ads@dubirodum.asia">ads@dubirodum.asia</a>
        </p>

        <h2>Postal</h2>
        <p>
          DA News — Dubirodum Asia News
          <br />
          Singapore
        </p>
      </div>
    </div>
  );
}
