'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import AdminAuthGuard from '@/components/AdminAuthGuard';
import AdminSidebar from '@/components/AdminSidebar';
import type { User, Profession } from '@/lib/db';

const CATEGORIES = ['Technology', 'Health', 'Engineering', 'Creative', 'Business', 'Media', 'Science', 'Education'];

interface FormData {
  slug: string;
  name_en: string;
  name_ru: string;
  emoji: string;
  category: string;
  description_short: string;
  description_full: string;
  background_image: string;
  entry_salary_eu: string;
  entry_salary_cis: string;
  growth_outlook: string;
  sort_order: string;
  is_active: boolean;
}

function EditProfessionContent({ user }: { user: User }) {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [form, setForm] = useState<FormData | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/api/admin/professions/${id}`)
      .then((r) => r.json())
      .then((p: Profession) => {
        setForm({
          slug: p.slug,
          name_en: p.name_en,
          name_ru: p.name_ru,
          emoji: p.emoji,
          category: p.category,
          description_short: p.description_short || '',
          description_full: p.description_full || '',
          background_image: p.background_image || '',
          entry_salary_eu: p.entry_salary_eu || '',
          entry_salary_cis: p.entry_salary_cis || '',
          growth_outlook: p.growth_outlook || '',
          sort_order: String(p.sort_order),
          is_active: p.is_active === 1,
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
      const res = await fetch(`/api/admin/professions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          sort_order: Number(form.sort_order),
          is_active: form.is_active ? 1 : 0,
        }),
      });
      if (!res.ok) {
        const d = await res.json();
        setError(d.error || 'Ошибка сохранения');
        return;
      }
      router.push('/admin/professions');
    } catch {
      setError('Ошибка подключения');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm('Удалить профессию? Это действие нельзя отменить.')) return;
    setDeleting(true);
    await fetch(`/api/admin/professions/${id}`, { method: 'DELETE' });
    router.push('/admin/professions');
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
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <a href="/admin/professions" className="text-slate-400 hover:text-white text-sm">← Назад</a>
            <h1 className="text-2xl font-bold text-white">Редактировать профессию</h1>
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
              <Field label="Эмодзи" required>
                <input className="input" type="text" required value={form.emoji} onChange={(e) => set('emoji', e.target.value)} />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Название EN" required>
                <input className="input" type="text" required value={form.name_en} onChange={(e) => set('name_en', e.target.value)} />
              </Field>
              <Field label="Название RU" required>
                <input className="input" type="text" required value={form.name_ru} onChange={(e) => set('name_ru', e.target.value)} />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Категория" required>
                <select className="input" value={form.category} onChange={(e) => set('category', e.target.value)}>
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </Field>
              <Field label="Порядок сортировки">
                <input className="input" type="number" value={form.sort_order} onChange={(e) => set('sort_order', e.target.value)} />
              </Field>
            </div>

            <Field label="Краткое описание">
              <textarea className="input resize-none h-20" value={form.description_short} onChange={(e) => set('description_short', e.target.value)} />
            </Field>

            <Field label="Полное описание">
              <textarea className="input resize-none h-32" value={form.description_full} onChange={(e) => set('description_full', e.target.value)} />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Зарплата в EU">
                <input className="input" type="text" value={form.entry_salary_eu} onChange={(e) => set('entry_salary_eu', e.target.value)} />
              </Field>
              <Field label="Зарплата в СНГ">
                <input className="input" type="text" value={form.entry_salary_cis} onChange={(e) => set('entry_salary_cis', e.target.value)} />
              </Field>
            </div>

            <Field label="Перспективы роста">
              <input className="input" type="text" value={form.growth_outlook} onChange={(e) => set('growth_outlook', e.target.value)} />
            </Field>

            {/* Background image */}
            <Field label="Фоновое изображение (URL)">
              <div className="space-y-2">
                <input
                  className="input" type="text"
                  value={form.background_image}
                  onChange={(e) => set('background_image', e.target.value)}
                  placeholder="/backgrounds/profession-name.png"
                />
                <div className="flex items-center gap-3">
                  <label className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg text-xs cursor-pointer transition-colors">
                    Загрузить файл
                    <input
                      type="file" accept="image/*" className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const fd = new FormData();
                        fd.append('file', file);
                        const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
                        const data = await res.json();
                        if (data.url) set('background_image', data.url);
                      }}
                    />
                  </label>
                  {form.background_image && (
                    <button
                      type="button"
                      onClick={() => set('background_image', '')}
                      className="px-3 py-1.5 bg-red-900/40 hover:bg-red-800/60 text-red-400 rounded-lg text-xs transition-colors"
                    >
                      Удалить
                    </button>
                  )}
                </div>
                {form.background_image && (
                  <img
                    src={form.background_image}
                    alt="Preview"
                    className="w-full h-32 object-cover rounded-lg border border-slate-700"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                )}
              </div>
            </Field>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox" className="w-4 h-4 accent-emerald-500"
                checked={form.is_active} onChange={(e) => set('is_active', e.target.checked)}
              />
              <span className="text-slate-300 text-sm">Активна (показывать на сайте)</span>
            </label>

            <div className="flex items-center justify-between pt-2">
              <div className="flex gap-3">
                <button
                  type="submit" disabled={saving}
                  className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-lg font-medium transition-colors"
                >
                  {saving ? 'Сохранение...' : 'Сохранить'}
                </button>
                <a href="/admin/professions" className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg font-medium transition-colors">
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

export default function EditProfessionPage() {
  return <AdminAuthGuard>{(user) => <EditProfessionContent user={user} />}</AdminAuthGuard>;
}
