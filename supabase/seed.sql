-- DA News — seed data
-- Inserts the six public categories and a set of professional, Reuters-style
-- English dummy articles with real cover image URLs.
-- Safe to run multiple times: existing slugs are skipped.

-- ---------------------------------------------------------------------------
-- Categories
-- ---------------------------------------------------------------------------
insert into public.categories (name, slug)
select v.name, v.slug
from (
  values
    ('Technology', 'technology'),
    ('World',      'world'),
    ('Politics',   'politics'),
    ('Economy',    'economy'),
    ('Lifestyle',  'lifestyle'),
    ('Sports',     'sports')
) as v (name, slug)
where not exists (
  select 1 from public.categories c where c.slug = v.slug
);

-- ---------------------------------------------------------------------------
-- Articles
-- ---------------------------------------------------------------------------
insert into public.articles (title, slug, content, cover_image, category_id)
select v.title, v.slug, v.content, v.cover_image, c.id
from (
  values
    (
      'Chipmakers race to expand advanced packaging capacity across Asia',
      'chipmakers-race-to-expand-advanced-packaging-capacity',
      '<p>TAIPEI — Leading semiconductor manufacturers are accelerating investment in advanced packaging lines across East and Southeast Asia, as demand for high-bandwidth memory and AI accelerators continues to outpace supply.</p><p>Executives said new facilities in Taiwan, South Korea and Malaysia would come online over the next 18 months, easing a bottleneck that has slowed shipments of data-centre chips.</p><p>Analysts cautioned that the expansion carries risk, with capital spending rising faster than near-term demand and several governments competing for the same limited pool of engineering talent.</p>',
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=80',
      'technology'
    ),
    (
      'Regulators draft common rules for cross-border AI models',
      'regulators-draft-common-rules-for-cross-border-ai-models',
      '<p>SINGAPORE — Financial and data regulators from six economies have begun drafting a shared framework for auditing large artificial-intelligence models that operate across borders.</p><p>The proposal would require providers to document training data sources and to submit to periodic safety reviews, according to people familiar with the discussions.</p><p>Industry groups broadly welcomed the effort but warned that overlapping national rules could raise compliance costs for smaller developers.</p>',
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=80',
      'technology'
    ),
    (
      'Asian economies pledge faster grid upgrades at regional summit',
      'asian-economies-pledge-faster-grid-upgrades',
      '<p>BANGKOK — Ministers from a dozen Asian economies agreed on Thursday to accelerate the build-out of transmission networks needed to connect renewable power to fast-growing cities.</p><p>The joint statement set no binding targets but committed members to publish annual progress reports beginning next year.</p><p>Energy analysts said the pledge was welcome but that financing remained the central obstacle for smaller states.</p>',
      'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=1600&q=80',
      'world'
    ),
    (
      'Humanitarian convoys resume after ceasefire holds in border region',
      'humanitarian-convoys-resume-after-ceasefire',
      '<p>GENEVA — Aid agencies said relief convoys had resumed crossing into the affected border region after a fragile ceasefire held for a fourth consecutive day.</p><p>Officials estimated that tens of thousands of residents still lack reliable access to clean water and medical supplies.</p><p>Negotiators are expected to meet again next week to extend the truce and discuss the reopening of commercial routes.</p>',
      'https://images.unsplash.com/photo-1575320181282-9afab399332c?auto=format&fit=crop&w=1600&q=80',
      'world'
    ),
    (
      'Coalition talks begin after indecisive parliamentary election',
      'coalition-talks-begin-after-indecisive-election',
      '<p>MANILA — Party leaders opened coalition talks on Friday after an inconclusive parliamentary election left no bloc with a clear majority.</p><p>The largest parties are seeking support from independents and smaller regional groups, with negotiations expected to run for several weeks.</p><p>Business groups urged a swift resolution, warning that prolonged uncertainty could delay planned infrastructure spending.</p>',
      'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=1600&q=80',
      'politics'
    ),
    (
      'Lawmakers advance long-delayed data protection bill',
      'lawmakers-advance-data-protection-bill',
      '<p>JAKARTA — A parliamentary committee approved the main articles of a long-delayed data protection bill, clearing the way for a full vote later this year.</p><p>The draft would give citizens the right to request deletion of personal data and impose fines on companies that fail to report breaches.</p><p>Technology firms said they supported clearer rules but asked for a longer transition period.</p>',
      'https://images.unsplash.com/photo-1523995462485-3d171b5c8fa9?auto=format&fit=crop&w=1600&q=80',
      'politics'
    ),
    (
      'Regional currencies steady as central banks hold rates',
      'regional-currencies-steady-as-central-banks-hold-rates',
      '<p>HONG KONG — Most Asian currencies traded in a narrow range on Monday after several central banks left benchmark interest rates unchanged.</p><p>Policymakers signalled they would watch inflation data before deciding on further moves.</p><p>Bond yields were little changed, while regional equity markets closed modestly higher.</p>',
      'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1600&q=80',
      'economy'
    ),
    (
      'Exports rebound on stronger demand for electronics',
      'exports-rebound-on-stronger-electronics-demand',
      '<p>SEOUL — Exports rose more than expected last month, led by a rebound in shipments of semiconductors and consumer electronics.</p><p>The trade ministry said demand from North America and Europe had improved, offsetting softer sales to some regional markets.</p><p>Economists said the data pointed to a gradual recovery but cautioned that global demand remained uneven.</p>',
      'https://images.unsplash.com/photo-1521295121783-8a321d551ad2?auto=format&fit=crop&w=1600&q=80',
      'economy'
    ),
    (
      'Smaller cities lure remote workers with lower living costs',
      'smaller-cities-lure-remote-workers',
      '<p>CHIANG MAI — Secondary cities across the region are courting remote workers with co-working grants and simplified visas, hoping to revive local economies.</p><p>Officials say the programmes have drawn thousands of applicants in the past year.</p><p>Residents are divided, with some welcoming the new spending and others worried about rising rents.</p>',
      'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1600&q=80',
      'lifestyle'
    ),
    (
      'Street-food markets adapt to a new generation of diners',
      'street-food-markets-adapt-to-new-diners',
      '<p>BANGKOK — Long-established street-food markets are updating their menus and opening later as they compete for younger customers.</p><p>Vendors said delivery apps and social media had changed how people discover and order food.</p><p>City officials have meanwhile introduced new hygiene standards to keep the markets viable.</p>',
      'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1600&q=80',
      'lifestyle'
    ),
    (
      'Regional league title race tightens with three rounds to play',
      'regional-league-title-race-tightens',
      '<p>KUALA LUMPUR — The regional football title race narrowed to two clubs after the weekend round of matches, setting up a tense finish to the season.</p><p>The leaders dropped points at home, allowing the defending champions to close the gap to a single point.</p><p>Both sides face difficult away fixtures in the final three rounds.</p>',
      'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1600&q=80',
      'sports'
    ),
    (
      'Athletics federation unveils expanded continental calendar',
      'athletics-federation-unveils-expanded-calendar',
      '<p>TOKYO — The continental athletics federation announced an expanded calendar for next season, adding two new meets and raising prize money.</p><p>Officials said the changes were designed to give emerging athletes more opportunities to compete at a high level.</p><p>The season will open in March and conclude with a regional final in November.</p>',
      'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1600&q=80',
      'sports'
    )
) as v (title, slug, content, cover_image, category_slug)
join public.categories c on c.slug = v.category_slug
where not exists (
  select 1 from public.articles a where a.slug = v.slug
);
