# DA NEWS — PROJECT REFERENCE

## Domain & Hosting
- **Domain:** `dubirodum.asia`
- **Hosting:** EdgeOne Pages, project name `da-news`
- **Stable deployment URL:** `da-news.edgeone.dev`
- **Repo GitHub:** `Chuchuayy/DA-News`

## Supabase
- **Project URL:** `https://femroomripuxyscdenwj.supabase.co`
- **Publishable key:** `sb_publishable_k59gKAKcmMCm3_ZRWV0TTA_qPzAL0c6`
- **Admin user ID (is_admin=true):** `1dab5e38-49d8-4766-8abe-7c829b27e67b`

## Struktur Tabel Database
- `profiles`: id, display_name, avatar_url, is_admin, created_at
- `categories`: id, name, slug
- `articles`: id, title, slug, content, cover_image, category_id, author_id, created_at
- `comments`: id, article_id, user_id, content, created_at
- RLS aktif di semua tabel

## Kategori yang Sudah Ada
- World (id: `54bfeb8a-47c1-4854-ac22-67660cee75f0`)
- Technology (id: `70eac60d-7488-47e8-8e6c-0795c6530f65`)

## Desain
- **Warna:** Biru & Putih (profesional, minimalis)
- **Framework:** Next.js 14 + Tailwind CSS
- **Style:** Media portal modern
- **Layout Homepage:** Featured trending + grid artikel kecil
