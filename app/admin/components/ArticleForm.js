'use client';

import { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import { createArticle, deleteArticle, updateArticle, uploadCover, slugify } from '../../../lib/admin';

// Quill touches the DOM on import, so it is loaded client-side only.
const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
  loading: () => (
    <div className="rounded border border-rule bg-primary-soft px-3 py-10 text-center text-sm text-ink-soft">
      Memuat editor...
    </div>
  ),
});

const QUILL_MODULES = {
  toolbar: [
    [{ header: [2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['blockquote', 'link', 'image'],
    ['clean'],
  ],
};

const QUILL_FORMATS = [
  'header',
  'bold',
  'italic',
  'underline',
  'strike',
  'list',
  'blockquote',
  'link',
  'image',
];

export default function ArticleForm({ article = null, categories = [], user, onSaved, onCancel }) {
  const isEditing = Boolean(article?.id);

  const [title, setTitle] = useState(article?.title || '');
  const [slug, setSlug] = useState(article?.slug || '');
  const [slugTouched, setSlugTouched] = useState(Boolean(article?.slug));
  const [categoryId, setCategoryId] = useState(article?.category_id || '');
  const [coverUrl, setCoverUrl] = useState(article?.cover_image || '');
  const [content, setContent] = useState(article?.content || '');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  // Keep the slug in sync with the title until the user edits it manually.
  useEffect(() => {
    if (!slugTouched) setSlug(slugify(title));
  }, [title, slugTouched]);

  useEffect(() => {
    if (!categoryId && categories.length > 0) {
      setCategoryId(article?.category_id || categories[0].id);
    }
  }, [categories, categoryId, article]);

  const plainLength = useMemo(
    () => (content || '').replace(/<[^>]*>/g, '').trim().length,
    [content]
  );

  const handleCoverChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError('');
    setNotice('');
    setUploading(true);
    const { publicUrl, error: uploadError } = await uploadCover(file);
    setUploading(false);
    if (uploadError) {
      setError(uploadError);
      return;
    }
    setCoverUrl(publicUrl);
    setNotice('Cover berhasil diunggah.');
  };

  const buildPayload = () => ({
    title: title.trim(),
    slug: (slug || slugify(title)).trim(),
    content,
    cover_image: coverUrl || null,
    category_id: categoryId || null,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setNotice('');

    if (!title.trim()) {
      setError('Judul wajib diisi.');
      return;
    }
    if (plainLength === 0) {
      setError('Isi artikel tidak boleh kosong.');
      return;
    }

    setSaving(true);
    const payload = buildPayload();

    if (isEditing) {
      const { error: updateError } = await updateArticle(article.id, payload);
      setSaving(false);
      if (updateError) {
        setError(updateError.message);
        return;
      }
      setNotice('Artikel berhasil diperbarui.');
      onSaved?.();
    } else {
      const { error: createError } = await createArticle({
        ...payload,
        author_id: user?.id || null,
      });
      setSaving(false);
      if (createError) {
        setError(createError.message);
        return;
      }
      setNotice('Artikel berhasil diterbitkan.');
      setTitle('');
      setSlug('');
      setSlugTouched(false);
      setContent('');
      setCoverUrl('');
      onSaved?.();
    }
  };

  const handleDelete = async () => {
    if (!isEditing) return;
    if (!window.confirm('Hapus artikel ini secara permanen?')) return;
    setError('');
    setDeleting(true);
    const { error: deleteError } = await deleteArticle(article.id);
    setDeleting(false);
    if (deleteError) {
      setError(deleteError.message);
      return;
    }
    onSaved?.();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded border border-rule bg-white p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-ink">
          {isEditing ? 'Edit Artikel' : 'Artikel Baru'}
        </h2>
        {onCancel ? (
          <button type="button" onClick={onCancel} className="btn-ghost py-1 text-xs">
            Batal
          </button>
        ) : null}
      </div>

      <div>
        <label className="label" htmlFor="title">
          Judul
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Tulis judul berita..."
          className="input"
          required
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="slug">
            Slug URL
          </label>
          <input
            id="slug"
            type="text"
            value={slug}
            onChange={(e) => {
              setSlugTouched(true);
              setSlug(e.target.value);
            }}
            placeholder="slug-berita"
            className="input"
          />
        </div>
        <div>
          <label className="label" htmlFor="category">
            Kategori
          </label>
          <select
            id="category"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="input"
          >
            <option value="">— Pilih kategori —</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="label" htmlFor="cover">
          Cover
        </label>
        <div className="flex flex-wrap items-center gap-4">
          {coverUrl ? (
            <div className="h-20 w-32 overflow-hidden rounded border border-rule">
              <img src={coverUrl} alt="Cover" className="h-full w-full object-cover" />
            </div>
          ) : (
            <div className="flex h-20 w-32 items-center justify-center rounded border border-dashed border-rule text-xs text-ink-soft">
              Tanpa cover
            </div>
          )}
          <div className="space-y-1">
            <input
              id="cover"
              type="file"
              accept="image/*"
              onChange={handleCoverChange}
              disabled={uploading}
              className="text-sm"
            />
            <p className="text-xs text-ink-soft">
              {uploading
                ? 'Mengunggah...'
                : 'Diunggah ke Supabase Storage (bucket "covers").'}
            </p>
          </div>
        </div>
      </div>

      <div>
        <label className="label">Isi Artikel</label>
        <ReactQuill
          theme="snow"
          value={content}
          onChange={setContent}
          modules={QUILL_MODULES}
          formats={QUILL_FORMATS}
          placeholder="Tulis isi berita di sini..."
        />
      </div>

      {error ? (
        <p className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </p>
      ) : null}
      {notice ? (
        <p className="rounded border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
          {notice}
        </p>
      ) : null}

      <div className="flex items-center gap-3">
        <button type="submit" disabled={saving || uploading} className="btn-primary">
          {saving ? 'Menyimpan...' : isEditing ? 'Simpan Perubahan' : 'Terbitkan'}
        </button>
        {isEditing ? (
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="rounded border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
          >
            {deleting ? 'Menghapus...' : 'Hapus'}
          </button>
        ) : null}
      </div>
    </form>
  );
}
