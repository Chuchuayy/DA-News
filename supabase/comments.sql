-- DA News — comments table + Row Level Security
-- Run this in the Supabase SQL editor if the `comments` table does not exist yet.
-- Schema: comments (id, article_id, user_id, content, created_at)

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  article_id uuid not null references public.articles (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  content text not null,
  created_at timestamptz not null default now()
);

create index if not exists comments_article_id_idx on public.comments (article_id);

alter table public.comments enable row level security;

-- Anyone (including anonymous readers) can read comments.
drop policy if exists "Comments are viewable by everyone" on public.comments;
create policy "Comments are viewable by everyone"
  on public.comments
  for select
  using (true);

-- Only authenticated users may post, and only as themselves.
drop policy if exists "Authenticated users can insert comments" on public.comments;
create policy "Authenticated users can insert comments"
  on public.comments
  for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Users may remove their own comments.
drop policy if exists "Users can delete their own comments" on public.comments;
create policy "Users can delete their own comments"
  on public.comments
  for delete
  to authenticated
  using (auth.uid() = user_id);
