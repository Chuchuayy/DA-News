// Optional Node seed script for DA News.
//
// Usage:
//   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/seed.mjs
//
// Requires a service-role key so it can write past Row Level Security.
// The SQL alternative lives in `supabase/seed.sql` and can be pasted into the
// Supabase SQL editor.

import { createClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.');
  process.exit(1);
}

const supabase = createClient(url, key, { auth: { persistSession: false } });

const categories = [
  { name: 'Technology', slug: 'technology' },
  { name: 'World', slug: 'world' },
  { name: 'Politics', slug: 'politics' },
  { name: 'Economy', slug: 'economy' },
  { name: 'Lifestyle', slug: 'lifestyle' },
  { name: 'Sports', slug: 'sports' },
];

const img = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1600&q=80`;

const articles = [
  {
    title: 'Chipmakers race to expand advanced packaging capacity across Asia',
    slug: 'chipmakers-race-to-expand-advanced-packaging-capacity',
    category: 'technology',
    cover_image: img('1518770660439-4636190af475'),
    content:
      '<p>TAIPEI — Leading semiconductor manufacturers are accelerating investment in advanced packaging lines across East and Southeast Asia, as demand for high-bandwidth memory and AI accelerators continues to outpace supply.</p><p>Executives said new facilities in Taiwan, South Korea and Malaysia would come online over the next 18 months, easing a bottleneck that has slowed shipments of data-centre chips.</p><p>Analysts cautioned that the expansion carries risk, with capital spending rising faster than near-term demand.</p>',
  },
  {
    title: 'Regulators draft common rules for cross-border AI models',
    slug: 'regulators-draft-common-rules-for-cross-border-ai-models',
    category: 'technology',
    cover_image: img('1451187580459-43490279c0fa'),
    content:
      '<p>SINGAPORE — Financial and data regulators from six economies have begun drafting a shared framework for auditing large artificial-intelligence models that operate across borders.</p><p>The proposal would require providers to document training data sources and to submit to periodic safety reviews.</p>',
  },
  {
    title: 'Asian economies pledge faster grid upgrades at regional summit',
    slug: 'asian-economies-pledge-faster-grid-upgrades',
    category: 'world',
    cover_image: img('1526304640581-d334cdbbf45e'),
    content:
      '<p>BANGKOK — Ministers from a dozen Asian economies agreed on Thursday to accelerate the build-out of transmission networks needed to connect renewable power to fast-growing cities.</p><p>The joint statement set no binding targets but committed members to publish annual progress reports beginning next year.</p>',
  },
  {
    title: 'Humanitarian convoys resume after ceasefire holds in border region',
    slug: 'humanitarian-convoys-resume-after-ceasefire',
    category: 'world',
    cover_image: img('1575320181282-9afab399332c'),
    content:
      '<p>GENEVA — Aid agencies said relief convoys had resumed crossing into the affected border region after a fragile ceasefire held for a fourth consecutive day.</p><p>Negotiators are expected to meet again next week to extend the truce.</p>',
  },
  {
    title: 'Coalition talks begin after indecisive parliamentary election',
    slug: 'coalition-talks-begin-after-indecisive-election',
    category: 'politics',
    cover_image: img('1529107386315-e1a2ed48a620'),
    content:
      '<p>MANILA — Party leaders opened coalition talks on Friday after an inconclusive parliamentary election left no bloc with a clear majority.</p><p>Business groups urged a swift resolution, warning that prolonged uncertainty could delay planned infrastructure spending.</p>',
  },
  {
    title: 'Lawmakers advance long-delayed data protection bill',
    slug: 'lawmakers-advance-data-protection-bill',
    category: 'politics',
    cover_image: img('1523995462485-3d171b5c8fa9'),
    content:
      '<p>JAKARTA — A parliamentary committee approved the main articles of a long-delayed data protection bill, clearing the way for a full vote later this year.</p><p>Technology firms said they supported clearer rules but asked for a longer transition period.</p>',
  },
  {
    title: 'Regional currencies steady as central banks hold rates',
    slug: 'regional-currencies-steady-as-central-banks-hold-rates',
    category: 'economy',
    cover_image: img('1554224155-6726b3ff858f'),
    content:
      '<p>HONG KONG — Most Asian currencies traded in a narrow range on Monday after several central banks left benchmark interest rates unchanged.</p><p>Bond yields were little changed, while regional equity markets closed modestly higher.</p>',
  },
  {
    title: 'Exports rebound on stronger demand for electronics',
    slug: 'exports-rebound-on-stronger-electronics-demand',
    category: 'economy',
    cover_image: img('1521295121783-8a321d551ad2'),
    content:
      '<p>SEOUL — Exports rose more than expected last month, led by a rebound in shipments of semiconductors and consumer electronics.</p><p>Economists said the data pointed to a gradual recovery but cautioned that global demand remained uneven.</p>',
  },
  {
    title: 'Smaller cities lure remote workers with lower living costs',
    slug: 'smaller-cities-lure-remote-workers',
    category: 'lifestyle',
    cover_image: img('1499750310107-5fef28a66643'),
    content:
      '<p>CHIANG MAI — Secondary cities across the region are courting remote workers with co-working grants and simplified visas, hoping to revive local economies.</p><p>Residents are divided, with some welcoming the new spending and others worried about rising rents.</p>',
  },
  {
    title: 'Street-food markets adapt to a new generation of diners',
    slug: 'street-food-markets-adapt-to-new-diners',
    category: 'lifestyle',
    cover_image: img('1490645935967-10de6ba17061'),
    content:
      '<p>BANGKOK — Long-established street-food markets are updating their menus and opening later as they compete for younger customers.</p><p>City officials have introduced new hygiene standards to keep the markets viable.</p>',
  },
  {
    title: 'Regional league title race tightens with three rounds to play',
    slug: 'regional-league-title-race-tightens',
    category: 'sports',
    cover_image: img('1517649763962-0c623066013b'),
    content:
      '<p>KUALA LUMPUR — The regional football title race narrowed to two clubs after the weekend round of matches, setting up a tense finish to the season.</p><p>Both sides face difficult away fixtures in the final three rounds.</p>',
  },
  {
    title: 'Athletics federation unveils expanded continental calendar',
    slug: 'athletics-federation-unveils-expanded-calendar',
    category: 'sports',
    cover_image: img('1541872703-74c5e44368f9'),
    content:
      '<p>TOKYO — The continental athletics federation announced an expanded calendar for next season, adding two new meets and raising prize money.</p><p>The season will open in March and conclude with a regional final in November.</p>',
  },
];

async function main() {
  const { data: existingCats, error: catErr } = await supabase
    .from('categories')
    .select('id, slug');
  if (catErr) throw catErr;

  const known = new Set((existingCats || []).map((c) => c.slug));
  const missing = categories.filter((c) => !known.has(c.slug));
  if (missing.length > 0) {
    const { error } = await supabase.from('categories').insert(missing);
    if (error) throw error;
  }

  const { data: allCats, error: reloadErr } = await supabase
    .from('categories')
    .select('id, slug');
  if (reloadErr) throw reloadErr;
  const catMap = new Map((allCats || []).map((c) => [c.slug, c.id]));

  const { data: existingArticles, error: artErr } = await supabase
    .from('articles')
    .select('slug');
  if (artErr) throw artErr;
  const knownSlugs = new Set((existingArticles || []).map((a) => a.slug));

  const rows = articles
    .filter((a) => !knownSlugs.has(a.slug))
    .map((a) => ({
      title: a.title,
      slug: a.slug,
      content: a.content,
      cover_image: a.cover_image,
      category_id: catMap.get(a.category) || null,
    }));

  if (rows.length > 0) {
    const { error } = await supabase.from('articles').insert(rows);
    if (error) throw error;
  }

  console.log(`Seeded ${missing.length} categories and ${rows.length} articles.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
