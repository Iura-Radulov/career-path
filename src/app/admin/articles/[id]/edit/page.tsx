'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import AdminAuthGuard from '@/components/AdminAuthGuard';
import AdminSidebar from '@/components/AdminSidebar';
import HtmlEditor from '@/components/HtmlEditor';
import type { User, Article } from '@/lib/db';

const CATEGORIES = ['general', 'technology', 'health', 'creative', 'engineering', 'business', 'media', 'science', 'education'];

interface FormData {
  slug: string;
  title_en: string;
  title_ru: string;
  excerpt_en: string;
  excerpt_ru: string;
  content_en: string;
  content_ru: string;
  category: string;
  image_url: string;
  author: string;
  is_published: boolean;
  published_at: string;
}

function EditArticleContent({ user }: { user: User }) {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [form, setForm] = useState<FormData | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/api/admin/articles/${id}`)
      .then((r) => r.json())
      .then((a: Article) => {
        setForm({
          slug: a.slug,
          title_en: a.title_en,
          title_ru: a.title_ru,
          excerpt_en: a.excerpt_en || '',
          excerpt_ru: a.excerpt_ru || '',
          content_en: a.content_en,
          content_ru: a.content_ru,
          category: a.category,
          image_url: a.image_url || '',
          author: a.author || 'Career Path Simulator',
          is_published: a.is_published === 1,
          published_at: a.published_at ? a.published_at.replace(' ', 'T').slice(0, 16) : '',
        });
      });
  }, [id]);

  function set(key: keyof FormData, value: string | boolean) {
    setForm((prev) => prev ? { ...prev, [key]: value } : prev);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form) return;
    setSaving(true);
    setError('');
    try {
      const res = await fetch(`/api/admin/articles/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          is_published: form.is_published ? 1 : 0,
          published_at: form.published_at || null,
        }),
      });
      if (!res.ok) {
        const d = await res.json();
        setError(d.error || 'Ошибка сохранения');
        return;
      }
      router.push('/admin/articles');
    } catch {
      setError('Ошибка подключения');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm('Удалить статью? Это действие нельзя отменить.')) return;
    setDeleting(true);
    await fetch(`/api/admin/articles/${id}`, { method: 'DELETE' });
    router.push('/admin/articles');
  }

  if (!form) {
    return (
      <div className="flex min-h-screen bg-slate-950">
        <AdminSidebar username={user.username} />
        <main className="flex-1 md:ml-64 p-6 pt-16 md:pt-6 flex items-center justify-center">
          <div className="flex items-center gap-3 text-slate-400">
            <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            Загрузка...
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-950">
      <AdminSidebar username={user.username} />
      <main className="flex-1 md:ml-64 p-6 pt-16 md:pt-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <a href="/admin/articles" className="text-slate-400 hover:text-white text-sm">← Назад</a>
            <h1 className="text-2xl font-bold text-white">Редактировать статью</h1>
          </div>

          <form onSubmit={handleSubmit} className="bg-slate-800 rounded-xl p-6 space-y-4">
            {error && (
              <div className="bg-red-900/30 border border-red-700 text-red-400 rounded-lg px-4 py-3 text-sm">
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <Field label="Slug (URL)" required>
                <input className="input" type="text" required value={form.slug} onChange={(e) => set('slug', e.target.value)} />
              </Field>
              <Field label="Категория" required>
                <select className="input" value={form.category} onChange={(e) => set('category', e.target.value)}>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Заголовок EN" required>
                <input className="input" type="text" required value={form.title_en} onChange={(e) => set('title_en', e.target.value)} />
              </Field>
              <Field label="Заголовок RU" required>
                <input className="input" type="text" required value={form.title_ru} onChange={(e) => set('title_ru', e.target.value)} />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Описание EN (excerpt)">
                <textarea className="input resize-none h-20" value={form.excerpt_en} onChange={(e) => set('excerpt_en', e.target.value)} />
              </Field>
              <Field label="Описание RU (excerpt)">
                <textarea className="input resize-none h-20" value={form.excerpt_ru} onChange={(e) => set('excerpt_ru', e.target.value)} />
              </Field>
            </div>

            <HtmlEditor label="Контент EN" required value={form.content_en} onChange={(v) => set('content_en', v)} />

            <HtmlEditor label="Контент RU" required value={form.content_ru} onChange={(v) => set('content_ru', v)} />

            <div className="grid grid-cols-2 gap-4">
              <Field label="URL изображения">
                <input className="input" type="text" value={form.image_url} onChange={(e) => set('image_url', e.target.value)} />
              </Field>
              <Field label="Автор">
                <input className="input" type="text" value={form.author} onChange={(e) => set('author', e.target.value)} />
              </Field>
            </div>

            <Field label="Дата публикации">
              <input className="input" type="datetime-local" value={form.published_at} onChange={(e) => set('published_at', e.target.value)} />
            </Field>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox" className="w-4 h-4 accent-emerald-500"
                checked={form.is_published} onChange={(e) => set('is_published', e.target.checked)}
              />
              <span className="text-slate-300 text-sm">Опубликовать статью</span>
            </label>

            <div className="flex items-center justify-between pt-2">
              <div className="flex gap-3">
                <button
                  type="submit" disabled={saving}
                  className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-lg font-medium transition-colors"
                >
                  {saving ? 'Сохранение...' : 'Сохранить'}
                </button>
                <a href="/admin/articles" className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg font-medium transition-colors">
                  Отмена
                </a>
              </div>
              <button
                type="button" onClick={handleDelete} disabled={deleting}
                className="px-4 py-2 bg-red-900/50 hover:bg-red-800/70 text-red-400 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
              >
                {deleting ? 'Удаление...' : 'Удалить'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

function Field({ label, children, required }: { label: string; children: React.ReactNode; required?: boolean }) {
  return (
    <div className="space-y-1">
      <label className="block text-slate-300 text-sm font-medium">
        {label}{required && <span className="text-red-400 ml-1">*</span>}
      </label>
      {children}
    </div>
  );
}

export default function EditArticlePage() {
  return <AdminAuthGuard>{(user) => <EditArticleContent user={user} />}</AdminAuthGuard>;
}
