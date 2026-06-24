'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminAuthGuard from '@/components/AdminAuthGuard';
import AdminSidebar from '@/components/AdminSidebar';
import type { User } from '@/lib/db';

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

const EMPTY: FormData = {
  slug: '', name_en: '', name_ru: '', emoji: '', category: CATEGORIES[0],
  description_short: '', description_full: '', background_image: '',
  entry_salary_eu: '', entry_salary_cis: '',
  growth_outlook: '', sort_order: '0', is_active: true,
};

function NewProfessionContent({ user }: { user: User }) {
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
      const res = await fetch('/api/admin/professions', {
        method: 'POST',
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

  return (
    <div className="flex min-h-screen bg-slate-950">
      <AdminSidebar username={user.username} />
      <main className="flex-1 md:ml-64 p-6 pt-16 md:pt-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <a href="/admin/professions" className="text-slate-400 hover:text-white text-sm">← Назад</a>
            <h1 className="text-2xl font-bold text-white">Новая профессия</h1>
          </div>

          <form onSubmit={handleSubmit} className="bg-slate-800 rounded-xl p-6 space-y-4">
            {error && (
              <div className="bg-red-900/30 border border-red-700 text-red-400 rounded-lg px-4 py-3 text-sm">
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <Field label="Slug (URL)" required>
                <input
                  className="input" type="text" required value={form.slug}
                  onChange={(e) => set('slug', e.target.value)} placeholder="frontend-developer"
                />
              </Field>
              <Field label="Эмодзи" required>
                <input
                  className="input" type="text" required value={form.emoji}
                  onChange={(e) => set('emoji', e.target.value)} placeholder="💻"
                />
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
                <input className="input" type="text" value={form.entry_salary_eu} onChange={(e) => set('entry_salary_eu', e.target.value)} placeholder="€3,000–6,000" />
              </Field>
              <Field label="Зарплата в СНГ">
                <input className="input" type="text" value={form.entry_salary_cis} onChange={(e) => set('entry_salary_cis', e.target.value)} placeholder="$800–1,500" />
              </Field>
            </div>

            <Field label="Перспективы роста">
              <input className="input" type="text" value={form.growth_outlook} onChange={(e) => set('growth_outlook', e.target.value)} placeholder="Высокий спрос" />
            </Field>

            <Field label="Фоновое изображение (URL)">
              <div className="space-y-2">
                <input className="input" type="text" value={form.background_image} onChange={(e) => set('background_image', e.target.value)} placeholder="/backgrounds/profession-name.png" />
                <label className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg text-xs cursor-pointer transition-colors">
                  Загрузить
                  <input type="file" accept="image/*" className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const fd = new FormData(); fd.append('file', file);
                      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
                      const data = await res.json();
                      if (data.url) set('background_image', data.url);
                    }}
                  />
                </label>
                {form.background_image && (
                  <img src={form.background_image} alt="" className="w-full h-24 object-cover rounded-lg border border-slate-700"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
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

            <div className="flex gap-3 pt-2">
              <button
                type="submit" disabled={saving}
                className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-lg font-medium transition-colors"
              >
                {saving ? 'Сохранение...' : 'Создать'}
              </button>
              <a href="/admin/professions" className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg font-medium transition-colors">
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

export default function NewProfessionPage() {
  return <AdminAuthGuard>{(user) => <NewProfessionContent user={user} />}</AdminAuthGuard>;
}
