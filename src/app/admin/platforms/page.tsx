'use client';

import { useEffect, useState } from 'react';
import AdminAuthGuard from '@/components/AdminAuthGuard';
import AdminSidebar from '@/components/AdminSidebar';
import type { User } from '@/lib/db';

interface Platform {
  id: number;
  slug: string;
  name_ru: string;
  name_en: string;
  description_ru: string | null;
  description_en: string | null;
  logo_url: string | null;
  website_url: string | null;
  affiliate_url: string | null;
  commission_rate: string | null;
  category: string;
  is_active: number;
  sort_order: number;
}

function PlatformsContent({ user }: { user: User }) {
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<Record<string, string | number>>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [selectedCats, setSelectedCats] = useState<string[]>([]);

  function load() {
    setLoading(true);
    fetch('/api/admin/platforms')
      .then(r => r.json())
      .then(data => setPlatforms(data.platforms || []))
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  function startEdit(p?: Platform) {
    if (p) {
      let cats: string[] = [];
      try { const parsed = JSON.parse(p.category); if (Array.isArray(parsed)) cats = parsed; } catch { cats = p.category ? [p.category] : []; }
      setSelectedCats(cats);
      setEditId(p.id);
      setForm({
        slug: p.slug,
        name_ru: p.name_ru,
        name_en: p.name_en,
        description_ru: p.description_ru || '',
        description_en: p.description_en || '',
        logo_url: p.logo_url || '',
        website_url: p.website_url || '',
        affiliate_url: p.affiliate_url || '',
        commission_rate: p.commission_rate || '',
        is_active: p.is_active,
        sort_order: p.sort_order,
      });
    } else {
      setSelectedCats([]);
      setEditId(0);
      setForm({
        slug: '',
        name_ru: '',
        name_en: '',
        description_ru: '',
        description_en: '',
        logo_url: '',
        website_url: '',
        affiliate_url: '',
        commission_rate: '',
        is_active: 1,
        sort_order: 0,
      });
    }
    setError('');
  }

  async function handleSave() {
    if (!(form as any).name_ru || !(form as any).slug) {
      setError('Название (RU) и slug обязательны');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const isNew = editId === 0;
      const body = { ...form, category: JSON.stringify(selectedCats) };
      const res = isNew
        ? await fetch('/api/admin/platforms', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
        : await fetch(`/api/admin/platforms/${editId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const data = await res.json();
      if (!res.ok) {
        setError(data.detail || 'Ошибка');
      } else {
        setEditId(null);
        load();
      }
    } catch {
      setError('Ошибка соединения');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    await fetch(`/api/admin/platforms/${id}`, { method: 'DELETE' });
    load();
  }

  function set<K extends string>(key: K, val: string | number) {
    setForm(prev => ({ ...prev, [key]: val }));
  }

  const professionCategories = [
    { value: 'technology', label: 'Технологии', emoji: '💻' },
    { value: 'creative', label: 'Креативность', emoji: '🎨' },
    { value: 'business', label: 'Бизнес', emoji: '📊' },
    { value: 'engineering', label: 'Инженерия', emoji: '🏗️' },
    { value: 'health', label: 'Здоровье', emoji: '🏥' },
    { value: 'science', label: 'Наука', emoji: '🔬' },
  ];

  return (
    <div className="flex min-h-screen bg-slate-950">
      <AdminSidebar username={user.username} />
      <main className="flex-1 md:ml-64 p-6 pt-16 md:pt-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-white">🛒 Платформы</h1>
            <button onClick={() => startEdit()} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium transition-colors">
              + Добавить
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-900/30 border border-red-700 text-red-400 text-sm">{error}</div>
          )}

          {/* Edit form */}
          {editId !== null && (
            <div className="mb-6 p-4 rounded-xl bg-slate-800 border border-slate-700 space-y-3">
              <h2 className="text-white font-semibold">{editId === 0 ? 'Новая платформа' : 'Редактировать'}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Slug</label>
                  <input value={form.slug as string} onChange={e => set('slug', e.target.value)} className="w-full px-3 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white text-sm" />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Комиссия</label>
                  <input value={form.commission_rate as string} onChange={e => set('commission_rate', e.target.value)} placeholder="10-20%" className="w-full px-3 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white text-sm" />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Название (RU)</label>
                  <input value={form.name_ru as string} onChange={e => set('name_ru', e.target.value)} className="w-full px-3 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white text-sm" />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Название (EN)</label>
                  <input value={form.name_en as string} onChange={e => set('name_en', e.target.value)} className="w-full px-3 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white text-sm" />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Описание (RU)</label>
                  <input value={form.description_ru as string} onChange={e => set('description_ru', e.target.value)} className="w-full px-3 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white text-sm" />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Описание (EN)</label>
                  <input value={form.description_en as string} onChange={e => set('description_en', e.target.value)} className="w-full px-3 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white text-sm" />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Сайт</label>
                  <input value={form.website_url as string} onChange={e => set('website_url', e.target.value)} placeholder="https://..." className="w-full px-3 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white text-sm" />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Аффилиат ссылка</label>
                  <input value={form.affiliate_url as string} onChange={e => set('affiliate_url', e.target.value)} placeholder="https://...?ref=..." className="w-full px-3 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white text-sm" />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Logo URL</label>
                  <div className="flex gap-2 items-center">
                    <input value={form.logo_url as string} onChange={e => set('logo_url', e.target.value)} placeholder="https://..." className="flex-1 px-3 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white text-sm" />
                    {form.logo_url && (
                      <img src={form.logo_url as string} alt="logo preview" className="w-8 h-8 rounded object-contain bg-slate-700 p-0.5" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                    )}
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs text-slate-400 block mb-2">Категории профессий (можно несколько)</label>
                  <div className="flex flex-wrap gap-2">
                    {professionCategories.map(c => {
                      const isSelected = selectedCats.includes(c.value);
                      return (
                        <button
                          key={c.value}
                          type="button"
                          onClick={() => {
                            setSelectedCats(prev =>
                              isSelected ? prev.filter(v => v !== c.value) : [...prev, c.value]
                            );
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                            isSelected
                              ? 'bg-emerald-600 text-white shadow-sm'
                              : 'bg-slate-700 text-slate-400 hover:bg-slate-600 border border-slate-600'
                          }`}
                        >
                          {c.emoji} {c.label}
                        </button>
                      );
                    })}
                  </div>
                  {selectedCats.length === 0 && (
                    <p className="text-xs text-red-400 mt-1">Выберите хотя бы одну категорию</p>
                  )}
                </div>
                <div className="flex items-center gap-4 pt-5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={(form.is_active as number) === 1} onChange={e => set('is_active', e.target.checked ? 1 : 0)} className="w-4 h-4 rounded" />
                    <span className="text-sm text-slate-300">Активна</span>
                  </label>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Порядок</label>
                    <input type="number" value={form.sort_order as number} onChange={e => set('sort_order', parseInt(e.target.value) || 0)} className="w-20 px-3 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white text-sm" />
                  </div>
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button onClick={handleSave} disabled={saving} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium disabled:opacity-50 transition-colors">
                  {saving ? '...' : '💾 Сохранить'}
                </button>
                <button onClick={() => setEditId(null)} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg text-sm transition-colors">
                  Отмена
                </button>
              </div>
            </div>
          )}

          {/* Table */}
          <div className="bg-slate-800 rounded-xl overflow-hidden">
            {loading ? (
              <div className="flex items-center gap-3 text-slate-400 px-6 py-12">
                <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                Загрузка...
              </div>
            ) : platforms.length === 0 ? (
              <div className="px-6 py-12 text-slate-500 text-center">
                Нет платформ.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-slate-400 border-b border-slate-700">
                      <th className="text-left px-4 py-3 w-10"></th>
                      <th className="text-left px-4 py-3">Название</th>
                      <th className="text-left px-4 py-3">Категория</th>
                      <th className="text-left px-4 py-3">Комиссия</th>
                      <th className="text-left px-4 py-3">Аффилиат ссылка</th>
                      <th className="text-left px-4 py-3">Статус</th>
                      <th className="text-left px-4 py-3">Действия</th>
                    </tr>
                  </thead>
                  <tbody>
                    {platforms.map((p, i) => (
                      <tr key={p.id} className={`border-b border-slate-700/50 hover:bg-slate-700/50 transition-colors ${i % 2 === 1 ? 'bg-slate-800/50' : ''}`}>
                        <td className="px-4 py-3">
                          {p.logo_url ? (
                            <img src={p.logo_url} alt={p.name_ru} className="w-7 h-7 rounded object-contain bg-slate-700/50 p-0.5" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                          ) : (
                            <div className="w-7 h-7 rounded bg-slate-700 flex items-center justify-center text-xs text-slate-400">{p.name_ru[0]}</div>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-slate-200 font-medium">{p.name_ru}</div>
                          <div className="text-slate-500 text-xs">{p.slug}</div>
                        </td>
                        <td className="px-4 py-3 text-slate-300">
                          {(() => {
                            try {
                              const cats = JSON.parse(p.category);
                              if (Array.isArray(cats)) {
                                return cats.map(c => {
                                  const found = professionCategories.find(pc => pc.value === c);
                                  return found ? `${found.emoji} ${found.label}` : c;
                                }).join(', ');
                              }
                            } catch {}
                            return p.category;
                          })()}
                        </td>
                        <td className="px-4 py-3 text-emerald-400 font-medium">{p.commission_rate || '—'}</td>
                        <td className="px-4 py-3 max-w-[200px] truncate">
                          {p.affiliate_url ? (
                            <a href={p.affiliate_url} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline text-xs">{p.affiliate_url}</a>
                          ) : (
                            <span className="text-slate-500">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded text-xs ${p.is_active ? 'bg-emerald-900/50 text-emerald-400' : 'bg-slate-700 text-slate-500'}`}>
                            {p.is_active ? 'Активна' : 'Скрыта'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button onClick={() => startEdit(p)} className="cursor-pointer px-3 py-2 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 text-sm font-medium transition-colors">✏️ Изменить</button>
                            <button onClick={() => handleDelete(p.id)} className="cursor-pointer px-3 py-2 rounded-lg bg-red-900/30 hover:bg-red-900/50 text-red-400 text-sm font-medium transition-colors">🗑️ Удалить</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <p className="text-slate-500 text-xs mt-3">{platforms.length} платформ(ы)</p>
        </div>
      </main>
    </div>
  );
}

export default function AdminPlatformsPage() {
  return (
    <AdminAuthGuard>
      {(user) => <PlatformsContent user={user} />}
    </AdminAuthGuard>
  );
}
