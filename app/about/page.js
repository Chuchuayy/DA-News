export const metadata = {
  title: 'About Us',
  description:
    'DA News (Dubirodum Asia News) is an independent newsroom covering Asia and the world.',
  alternates: { canonical: '/about' },
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 border-b border-rule pb-4 font-serif text-2xl font-bold text-ink">
        About Us
      </h1>

      <div className="article-body">
        <p>
          <strong>DA News</strong> — <em>Dubirodum Asia News</em> — is an independent newsroom
          publishing clear, original coverage of Asia and the wider world.
        </p>
        <p>
          We focus on technology, world affairs, politics, economy, lifestyle and sport, keeping
          our pages deliberately uncluttered so the reporting stays front and centre.
        </p>

        <h2>What we do</h2>
        <p>
          Every story is written for readers who want the essentials quickly: a sharp headline, a
          straightforward account, and enough context to understand why it matters.
        </p>

        <h2>Get in touch</h2>
        <p>
          For editorial enquiries, visit our <a href="/contact">contact page</a>.
        </p>
      </div>
    </div>
  );
}
