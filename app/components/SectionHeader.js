/** Serif section header: bold title, one gray subtitle line, small gray date. */
export default function SectionHeader({ title, subtitle, date }) {
  return (
    <div className="mb-5 border-b border-rule pb-4">
      <h2 className="font-serif text-2xl font-bold text-ink">{title}</h2>
      {subtitle ? <p className="mt-1 text-sm text-ink-soft">{subtitle}</p> : null}
      {date ? <p className="mt-1 text-xs text-ink-faint">{date}</p> : null}
    </div>
  );
}
