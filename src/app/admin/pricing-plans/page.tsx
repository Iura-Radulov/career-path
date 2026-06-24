'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminAuthGuard from '@/components/AdminAuthGuard';
import AdminSidebar from '@/components/AdminSidebar';
import type { User, PricingPlan } from '@/lib/db';

function PricingPlansContent({ user }: { user: User }) {
  const router = useRouter();
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);

  function load() {
    setLoading(true);
    fetch('/api/admin/pricing-plans')
      .then((r) => r.json())
      .then((data) => setPlans(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  async function handleDelete(id: number) {
    if (!confirm('Удалить тариф?')) return;
    setDeleting(id);
    await fetch(`/api/admin/pricing-plans/${id}`, { method: 'DELETE' });
    setDeleting(null);
    load();
  }

  return (
    <div className="flex min-h-screen bg-slate-950">
      <AdminSidebar username={user.username} />
      <main className="flex-1 md:ml-64 p-6 pt-16 md:pt-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-white">Тарифы</h1>
            <a
              href="/admin/pricing-plans/new"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium transition-colors"
            >
              + Новый тариф
            </a>
          </div>

          <div className="bg-slate-800 rounded-xl overflow-hidden">
            {loading ? (
              <div className="flex items-center gap-3 text-slate-400 px-6 py-12">
                <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                Загрузка...
              </div>
            ) : plans.length === 0 ? (
              <div className="px-6 py-12 text-slate-500 text-center">
                Нет тарифов.{' '}
                <a href="/admin/pricing-plans/new" className="text-emerald-400 hover:underline">Добавить первый</a>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-slate-400 border-b border-slate-700">
                      <th className="text-left px-4 py-3">ID</th>
                      <th className="text-left px-4 py-3">Название</th>
                      <th className="text-left px-4 py-3">Slug</th>
                      <th className="text-left px-4 py-3">Цена</th>
                      <th className="text-left px-4 py-3">Функции</th>
                      <th className="text-left px-4 py-3">Порядок</th>
                      <th className="text-left px-4 py-3">Статус</th>
                      <th className="text-left px-4 py-3">Действия</th>
                    </tr>
                  </thead>
                  <tbody>
                    {plans.map((p, i) => (
                      <tr
                        key={p.id}
                        className={`border-b border-slate-700/50 hover:bg-slate-700/50 transition-colors ${i % 2 === 1 ? 'bg-slate-800/50' : ''}`}
                      >
                        <td className="px-4 py-3 text-slate-500">{p.id}</td>
                        <td className="px-4 py-3">
                          <div className="text-slate-200 font-medium">{p.name}</div>
                          {p.is_popular === 1 && (
                            <span className="text-xs text-emerald-400">★ Popular</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-slate-400 font-mono text-xs">{p.slug}</td>
                        <td className="px-4 py-3 text-slate-300">{p.price}</td>
                        <td className="px-4 py-3 text-slate-400 text-xs">
                          {(() => {
                            try {
                              const parsed = JSON.parse(p.features);
                              if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
                                const enCount = Array.isArray(parsed.en) ? parsed.en.length : 0;
                                const ruCount = Array.isArray(parsed.ru) ? parsed.ru.length : 0;
                                return `${enCount} EN / ${ruCount} RU`;
                              }
                              if (Array.isArray(parsed)) return `${parsed.length} EN / 0 RU`;
                            } catch {}
                            return '—';
                          })()}
                        </td>
                        <td className="px-4 py-3 text-slate-400">{p.sort_order}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded text-xs ${p.is_active ? 'bg-emerald-900/50 text-emerald-400' : 'bg-slate-700 text-slate-500'}`}>
                            {p.is_active ? 'Активен' : 'Скрыт'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button
                              onClick={() => router.push(`/admin/pricing-plans/${p.id}/edit`)}
                              className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded text-xs transition-colors"
                            >
                              Изм.
                            </button>
                            <button
                              onClick={() => handleDelete(p.id)}
                              disabled={deleting === p.id}
                              className="px-3 py-1 bg-red-900/50 hover:bg-red-800/70 text-red-400 rounded text-xs transition-colors disabled:opacity-50"
                            >
                              Удал.
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function PricingPlansPage() {
  return <AdminAuthGuard>{(user) => <PricingPlansContent user={user} />}</AdminAuthGuard>;
}
