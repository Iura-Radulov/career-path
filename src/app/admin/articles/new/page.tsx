'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminAuthGuard from '@/components/AdminAuthGuard';
import AdminSidebar from '@/components/AdminSidebar';
import HtmlEditor from '@/components/HtmlEditor';
import type { User } from '@/lib/db';

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

const EMPTY: FormData = {
  slug: '', title_en: '', title_ru: '', excerpt_en: '', excerpt_ru: '',
  content_en: '', content_ru: '', category: 'general', image_url: '',
  author: 'Career Path Simulator', is_published: false, published_at: '',
};

function NewArticleContent({ user }: { user: User }) {
  const router = useRouter();
  const [form, setForm] = useState<FormData>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  function set(key: keyof FormData, value: string | boolean) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/admin/articles', {
        method: 'POST',
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

  return (
    <div className="flex min-h-screen bg-slate-950">
      <AdminSidebar username={user.username} />
      <main className="flex-1 md:ml-64 p-6 pt-16 md:pt-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <a href="/admin/articles" className="text-slate-400 hover:text-white text-sm">← Назад</a>
            <h1 className="text-2xl font-bold text-white">Новая статья</h1>
          </div>

          <form onSubmit={handleSubmit} className="bg-slate-800 rounded-xl p-6 space-y-4">
            {error && (
              <div className="bg-red-900/30 border border-red-700 text-red-400 rounded-lg px-4 py-3 text-sm">
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <Field label="Slug (URL)" required>
                <input className="input" type="text" required value={form.slug} onChange={(e) => set('slug', e.target.value)} placeholder="my-article-slug" />
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

            <HtmlEditor label="Контент EN" required value={form.content_en} onChange={(v) => set('content_en', v)} placeholder="Write article content using HTML tags..." />

            <HtmlEditor label="Контент RU" required value={form.content_ru} onChange={(v) => set('content_ru', v)} placeholder="Напишите содержание статьи с HTML тегами..." />

            <div className="grid grid-cols-2 gap-4">
              <Field label="URL изображения">
                <input className="input" type="text" value={form.image_url} onChange={(e) => set('image_url', e.target.value)} placeholder="https://..." />
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

            <div className="flex gap-3 pt-2">
              <button
                type="submit" disabled={saving}
                className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-lg font-medium transition-colors"
              >
                {saving ? 'Сохранение...' : 'Создать'}
              </button>
              <a href="/admin/articles" className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg font-medium transition-colors">
                Отмена
              </a>
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

export default function NewArticlePage() {
  return <AdminAuthGuard>{(user) => <NewArticleContent user={user} />}</AdminAuthGuard>;
}
