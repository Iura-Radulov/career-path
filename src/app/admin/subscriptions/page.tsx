'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminAuthGuard from '@/components/AdminAuthGuard';
import AdminSidebar from '@/components/AdminSidebar';
import type { User, SubscriptionWithUser } from '@/lib/db';

function SubscriptionsContent({ user }: { user: User }) {
  const router = useRouter();
  const [subscriptions, setSubscriptions] = useState<SubscriptionWithUser[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [statusFilter, setStatusFilter] = useState('');
  const [cancelling, setCancelling] = useState<number | null>(null);
  const limit = 20;

  function load() {
    setLoading(true);
    const params = new URLSearchParams({ limit: String(limit), offset: String(page * limit) });
    if (statusFilter) params.set('status', statusFilter);
    fetch(`/api/admin/subscriptions?${params}`)
      .then((r) => r.json())
      .then((data) => {
        setSubscriptions(data.subscriptions || []);
        setTotal(data.total || 0);
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, [page, statusFilter]);

  async function handleCancel(id: number) {
    if (!confirm('Отменить подписку?')) return;
    setCancelling(id);
    await fetch('/api/admin/subscriptions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'cancel', subscription_id: id }),
    });
    setCancelling(null);
    load();
  }

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="flex min-h-screen bg-slate-950">
      <AdminSidebar username={user.username} />
      <main className="flex-1 md:ml-64 p-6 pt-16 md:pt-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-white">Подписки</h1>
            <div className="text-slate-400 text-sm">{total} всего</div>
          </div>

          {/* Filters */}
          <div className="flex gap-2 mb-4">
            {['', 'active', 'cancelled', 'expired'].map((s) => (
              <button
                key={s}
                onClick={() => { setStatusFilter(s); setPage(0); }}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  statusFilter === s
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                {s === '' ? 'Все' : s === 'active' ? 'Активные' : s === 'cancelled' ? 'Отменённые' : 'Истекшие'}
              </button>
            ))}
          </div>

          <div className="bg-slate-800 rounded-xl overflow-hidden">
            {loading ? (
              <div className="flex items-center gap-3 text-slate-400 px-6 py-12">
                <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                Загрузка...
              </div>
            ) : subscriptions.length === 0 ? (
              <div className="px-6 py-12 text-slate-500 text-center">Нет подписок</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-slate-400 border-b border-slate-700">
                      <th className="text-left px-4 py-3">Пользователь</th>
                      <th className="text-left px-4 py-3">Тариф</th>
                      <th className="text-left px-4 py-3">Статус</th>
                      <th className="text-left px-4 py-3">Начало</th>
                      <th className="text-left px-4 py-3">Окончание</th>
                      <th className="text-left px-4 py-3">Действия</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscriptions.map((s, i) => (
                      <tr key={s.id} className={`border-b border-slate-700/50 hover:bg-slate-700/50 transition-colors ${i % 2 === 1 ? 'bg-slate-800/50' : ''}`}>
                        <td className="px-4 py-3">
                          <span
                            className="text-slate-200 cursor-pointer hover:text-emerald-400"
                            onClick={() => router.push(`/admin/users/${s.user_id}`)}
                          >
                            {s.first_name || s.username || `#${s.user_id}`}
                          </span>
                          {s.username && <span className="text-slate-500 text-xs ml-1">@{s.username}</span>}
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-slate-200">{s.plan_name || '—'}</div>
                          <div className="text-slate-500 text-xs">{s.plan_price}</div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded text-xs ${
                            s.status === 'active' ? 'bg-emerald-900/50 text-emerald-400' :
                            s.status === 'cancelled' ? 'bg-red-900/50 text-red-400' :
                            'bg-slate-700 text-slate-500'
                          }`}>
                            {s.status === 'active' ? 'Активна' : s.status === 'cancelled' ? 'Отменена' : s.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-400 text-xs">{s.start_date ? new Date(s.start_date).toLocaleDateString('ru') : '—'}</td>
                        <td className="px-4 py-3 text-slate-400 text-xs">{s.end_date ? new Date(s.end_date).toLocaleDateString('ru') : '—'}</td>
                        <td className="px-4 py-3">
                          {s.status === 'active' && (
                            <button
                              onClick={() => handleCancel(s.id)}
                              disabled={cancelling === s.id}
                              className="px-3 py-1 bg-red-900/50 hover:bg-red-800/70 text-red-400 rounded text-xs transition-colors disabled:opacity-50"
                            >
                              {cancelling === s.id ? '...' : 'Отменить'}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-4">
              <button
                onClick={() => setPage(Math.max(0, page - 1))}
                disabled={page === 0}
                className="px-3 py-1 bg-slate-800 text-slate-400 rounded-lg text-sm hover:bg-slate-700 disabled:opacity-50"
              >
                ← Назад
              </button>
              <span className="text-slate-400 text-sm">{page + 1} / {totalPages}</span>
              <button
                onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                disabled={page >= totalPages - 1}
                className="px-3 py-1 bg-slate-800 text-slate-400 rounded-lg text-sm hover:bg-slate-700 disabled:opacity-50"
              >
                Вперед →
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default function SubscriptionsPage() {
  return <AdminAuthGuard>{(user) => <SubscriptionsContent user={user} />}</AdminAuthGuard>;
}
