'use client';

import { useEffect, useState } from 'react';
import { createArticle, deleteArticle, updateArticle, uploadCover, slugify } from '../../../lib/admin';

/**
 * Minimal article form: Title, plain-text Content, and a Cover image upload.
 * Category selection and the rich-text editor were intentionally removed so the
 * public site stays minimal; the slug is generated automatically from the title.
 */
export default function ArticleForm({ article = null, user, onSaved, onCancel }) {
  const isEditing = Boolean(article?.id);

  const [title, setTitle] = useState(article?.title || '');
  const [slug, setSlug] = useState(article?.slug || '');
  const [content, setContent] = useState(article?.content || '');
  const [coverUrl, setCoverUrl] = useState(article?.cover_image || '');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  // Keep the slug in sync with the title.
  useEffect(() => {
    setSlug(slugify(title));
  }, [title]);

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
    setNotice('Cover uploaded.');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setNotice('');

    if (!title.trim()) {
      setError('Title is required.');
      return;
    }
    if (!content.trim()) {
      setError('Content cannot be empty.');
      return;
    }

    setSaving(true);
    const payload = {
      title: title.trim(),
      slug: (slug || slugify(title)).trim(),
      content: content.trim(),
      cover_image: coverUrl || null,
    };

    if (isEditing) {
      const { error: updateError } = await updateArticle(article.id, payload);
      setSaving(false);
      if (updateError) {
        setError(updateError.message);
        return;
      }
      setNotice('Article updated.');
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
      setTitle('');
      setSlug('');
      setContent('');
      setCoverUrl('');
      setNotice('Article published.');
      onSaved?.();
    }
  };

  const handleDelete = async () => {
    if (!isEditing) return;
    if (!window.confirm('Delete this article permanently?')) return;
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
    <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-rule p-5">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-lg font-bold text-ink">
          {isEditing ? 'Edit Article' : 'New Article'}
        </h2>
        {onCancel ? (
          <button type="button" onClick={onCancel} className="btn-ghost px-3 py-1 text-xs">
            Cancel
          </button>
        ) : null}
      </div>

      <div>
        <label className="label" htmlFor="title">
          Title
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Write a headline…"
          className="input"
          required
        />
      </div>

      <div>
        <label className="label" htmlFor="cover">
          Cover image
        </label>
        <div className="flex flex-wrap items-center gap-4">
          {coverUrl ? (
            <div className="h-20 w-32 overflow-hidden rounded-xl border border-rule">
              <img src={coverUrl} alt="Cover" className="h-full w-full object-cover" />
            </div>
          ) : (
            <div className="flex h-20 w-32 items-center justify-center rounded-xl border border-dashed border-rule text-xs text-ink-soft">
              No cover
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
              {uploading ? 'Uploading…' : 'Uploaded to Supabase Storage (bucket "covers").'}
            </p>
          </div>
        </div>
      </div>

      <div>
        <label className="label" htmlFor="content">
          Content
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={14}
          placeholder="Write the story…"
          className="input resize-y font-sans leading-relaxed"
        />
      </div>

      {error ? <p className="text-sm text-date">{error}</p> : null}
      {notice ? <p className="text-sm text-brand">{notice}</p> : null}

      <div className="flex items-center gap-3">
        <button type="submit" disabled={saving || uploading} className="btn-brand">
          {saving ? 'Saving…' : isEditing ? 'Save changes' : 'Publish'}
        </button>
        {isEditing ? (
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="rounded-full border border-date px-5 py-2.5 text-sm font-semibold text-date transition hover:bg-date/5"
          >
            {deleting ? 'Deleting…' : 'Delete'}
          </button>
        ) : null}
      </div>
    </form>
  );
}
