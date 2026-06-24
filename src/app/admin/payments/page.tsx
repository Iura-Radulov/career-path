'use client';

import { useEffect, useState } from 'react';
import AdminAuthGuard from '@/components/AdminAuthGuard';
import AdminSidebar from '@/components/AdminSidebar';
import type { User, PaymentWithUser } from '@/lib/db';

function PaymentsContent({ user }: { user: User }) {
  const [payments, setPayments] = useState<PaymentWithUser[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const limit = 20;

  function load() {
    setLoading(true);
    const params = new URLSearchParams({ limit: String(limit), offset: String(page * limit) });
    fetch(`/api/admin/payments?${params}`)
      .then((r) => r.json())
      .then((data) => {
        setPayments(data.payments || []);
        setTotal(data.total || 0);
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, [page]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="flex min-h-screen bg-slate-950">
      <AdminSidebar username={user.username} />
      <main className="flex-1 md:ml-64 p-6 pt-16 md:pt-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-white">Оплаты</h1>
            <div className="text-slate-400 text-sm">{total} всего</div>
          </div>

          <div className="bg-slate-800 rounded-xl overflow-hidden">
            {loading ? (
              <div className="flex items-center gap-3 text-slate-400 px-6 py-12">
                <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                Загрузка...
              </div>
            ) : payments.length === 0 ? (
              <div className="px-6 py-12 text-slate-500 text-center">Нет платежей</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-slate-400 border-b border-slate-700">
                      <th className="text-left px-4 py-3">Пользователь</th>
                      <th className="text-left px-4 py-3">Тариф</th>
                      <th className="text-left px-4 py-3">Сумма</th>
                      <th className="text-left px-4 py-3">Статус</th>
                      <th className="text-left px-4 py-3">Метод</th>
                      <th className="text-left px-4 py-3">Дата</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((p, i) => (
                      <tr key={p.id} className={`border-b border-slate-700/50 hover:bg-slate-700/50 transition-colors ${i % 2 === 1 ? 'bg-slate-800/50' : ''}`}>
                        <td className="px-4 py-3 text-slate-200">{p.first_name || p.username || `#${p.user_id}`}</td>
                        <td className="px-4 py-3 text-slate-300">{p.plan_name || '—'}</td>
                        <td className="px-4 py-3 text-slate-200 font-mono text-xs">{p.amount} {p.currency}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded text-xs ${p.status === 'completed' ? 'bg-emerald-900/50 text-emerald-400' : 'bg-slate-700 text-slate-500'}`}>
                            {p.status === 'completed' ? 'Успешно' : p.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-400 text-xs">{p.payment_method}</td>
                        <td className="px-4 py-3 text-slate-400 text-xs">{p.paid_at ? new Date(p.paid_at).toLocaleDateString('ru') : '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

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

export default function PaymentsPage() {
  return <AdminAuthGuard>{(user) => <PaymentsContent user={user} />}</AdminAuthGuard>;
}
