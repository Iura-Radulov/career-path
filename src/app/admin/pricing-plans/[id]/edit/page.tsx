'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import AdminAuthGuard from '@/components/AdminAuthGuard';
import AdminSidebar from '@/components/AdminSidebar';
import type { User, PricingPlan } from '@/lib/db';

interface FormData {
  slug: string;
  name: string;
  price: string;
  stars_price: string;
  stripe_price_id: string;
  currency: string;
  interval: string;
  featuresEn: string;
  featuresRu: string;
  sort_order: string;
  is_popular: boolean;
  is_active: boolean;
}

function EditPricingPlanContent({ user }: { user: User }) {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [form, setForm] = useState<FormData | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/api/admin/pricing-plans/${id}`)
      .then((r) => r.json())
      .then((p: PricingPlan) => {
        let featuresEn = '';
        let featuresRu = '';
        try {
          const parsed = JSON.parse(p.features);
          if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
            featuresEn = Array.isArray(parsed.en) ? parsed.en.join('\n') : '';
            featuresRu = Array.isArray(parsed.ru) ? parsed.ru.join('\n') : '';
          } else if (Array.isArray(parsed)) {
            featuresEn = parsed.join('\n');
          }
        } catch {
          featuresEn = p.features;
        }
        setForm({
          slug: p.slug,
          name: p.name,
          price: p.price,
          stars_price: p.stars_price || '',
          stripe_price_id: p.stripe_price_id || '',
          currency: p.currency,
          interval: p.interval,
          featuresEn,
          featuresRu,
          sort_order: String(p.sort_order),
          is_popular: p.is_popular === 1,
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
      const features = JSON.stringify({
        en: form.featuresEn.split('\n').map((s) => s.trim()).filter(Boolean),
        ru: form.featuresRu.split('\n').map((s) => s.trim()).filter(Boolean),
      });
      const res = await fetch(`/api/admin/pricing-plans/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: form.slug,
          name: form.name,
          price: form.price,
          currency: form.currency,
          interval: form.interval,
          features,
          stars_price: form.stars_price,
          stripe_price_id: form.stripe_price_id,
          sort_order: Number(form.sort_order),
          is_popular: form.is_popular ? 1 : 0,
          is_active: form.is_active ? 1 : 0,
        }),
      });
      if (!res.ok) {
        const d = await res.json();
        setError(d.error || 'Ошибка сохранения');
        return;
      }
      router.push('/admin/pricing-plans');
    } catch {
      setError('Ошибка подключения');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm('Удалить тариф? Это действие нельзя отменить.')) return;
    setDeleting(true);
    await fetch(`/api/admin/pricing-plans/${id}`, { method: 'DELETE' });
    router.push('/admin/pricing-plans');
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
            <a href="/admin/pricing-plans" className="text-slate-400 hover:text-white text-sm">← Назад</a>
            <h1 className="text-2xl font-bold text-white">Редактировать тариф</h1>
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
              <Field label="Название" required>
                <input className="input" type="text" required value={form.name} onChange={(e) => set('name', e.target.value)} />
              </Field>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <Field label="Цена" required>
                <input className="input" type="text" required value={form.price} onChange={(e) => set('price', e.target.value)} placeholder="$9.99" />
              </Field>
              <Field label="Stars Price">
                <input className="input" type="text" value={form.stars_price} onChange={(e) => set('stars_price', e.target.value)} placeholder="100" />
              </Field>
              <Field label="Stripe Price ID">
                <input className="input" type="text" value={form.stripe_price_id} onChange={(e) => set('stripe_price_id', e.target.value)} placeholder="price_xxx" />
              </Field>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <Field label="Валюта">
                <select className="input" value={form.currency} onChange={(e) => set('currency', e.target.value)}>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
              </Field>
              <Field label="Период">
                <select className="input" value={form.interval} onChange={(e) => set('interval', e.target.value)}>
                  <option value="month">month</option>
                  <option value="year">year</option>
                  <option value="one-time">one-time</option>
                </select>
              </Field>
              <Field label="Порядок сортировки">
                <input className="input" type="number" value={form.sort_order} onChange={(e) => set('sort_order', e.target.value)} />
              </Field>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Features (EN)</label>
              <textarea
                value={form.featuresEn}
                onChange={(e) => set('featuresEn', e.target.value)}
                rows={6}
                className="input w-full"
                placeholder={"One feature per line\n1 profession test\nAI compatibility score"}
              />
              <label className="block text-sm font-medium text-slate-300 mb-1 mt-4">Функции (RU)</label>
              <textarea
                value={form.featuresRu}
                onChange={(e) => set('featuresRu', e.target.value)}
                rows={6}
                className="input w-full"
                placeholder={"По одной функции на строку\nТест 1 профессии\nОценка совместимости AI"}
              />
            </div>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox" className="w-4 h-4 accent-emerald-500"
                checked={form.is_popular} onChange={(e) => set('is_popular', e.target.checked)}
              />
              <span className="text-slate-300 text-sm">Популярный (показывать значок)</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox" className="w-4 h-4 accent-emerald-500"
                checked={form.is_active} onChange={(e) => set('is_active', e.target.checked)}
              />
              <span className="text-slate-300 text-sm">Активен (показывать на сайте)</span>
            </label>

            <div className="flex items-center justify-between pt-2">
              <div className="flex gap-3">
                <button
                  type="submit" disabled={saving}
                  className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-lg font-medium transition-colors"
                >
                  {saving ? 'Сохранение...' : 'Сохранить'}
                </button>
                <a href="/admin/pricing-plans" className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg font-medium transition-colors">
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

export default function EditPricingPlanPage() {
  return <AdminAuthGuard>{(user) => <EditPricingPlanContent user={user} />}</AdminAuthGuard>;
}
