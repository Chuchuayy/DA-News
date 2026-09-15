-- DA News — article view tracking
-- Adds a `views` counter to articles and a safe, atomic increment function
-- that anonymous readers may call (SECURITY DEFINER, so it bypasses the
-- row-level security that otherwise blocks public writes to `articles`).
-- Safe to run multiple times.

-- ---------------------------------------------------------------------------
-- Column
-- ---------------------------------------------------------------------------
alter table public.articles
  add column if not exists views integer not null default 0;

create index if not exists articles_views_idx on public.articles (views desc);

-- ---------------------------------------------------------------------------
-- Atomic increment RPC
-- ---------------------------------------------------------------------------
create or replace function public.increment_article_views(article_id uuid)
returns void
language sql
security definer
set search_path = public
as $$
  update public.articles
     set views = views + 1
   where id = article_id;
$$;

-- Allow the public site (anon) and signed-in users to bump the counter.
grant execute on function public.increment_article_views(uuid) to anon, authenticated;
