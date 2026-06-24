'use client';

import { useEffect, useState } from 'react';
import AdminAuthGuard from '@/components/AdminAuthGuard';
import AdminSidebar from '@/components/AdminSidebar';
import type { User, RecentAnalysis } from '@/lib/db';

const PAGE_SIZE = 20;

function AnalysesContent({ user }: { user: User }) {
  const [rows, setRows] = useState<RecentAnalysis[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [userIdFilter, setUserIdFilter] = useState<number | undefined>(undefined);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetch('/api/admin/users')
      .then((r) => r.json())
      .then((data) => setUsers(Array.isArray(data) ? data : []));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: String(PAGE_SIZE) });
    if (userIdFilter !== undefined) params.set('user_id', String(userIdFilter));
    fetch(`/api/admin/analyses?${params}`)
      .then((r) => r.json())
      .then((data) => {
        setRows(Array.isArray(data.rows) ? data.rows : []);
        setTotal(typeof data.total === 'number' ? data.total : 0);
      })
      .finally(() => setLoading(false));
  }, [page, userIdFilter]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="flex min-h-screen bg-slate-950">
      <AdminSidebar username={user.username} />
      <main className="flex-1 md:ml-64 p-6 pt-16 md:pt-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-white">Анализы карьеры</h1>
            <div className="text-slate-400 text-sm">{total} всего</div>
          </div>

          <div className="mb-4">
            <select
              value={userIdFilter ?? ''}
              onChange={(e) => {
                setUserIdFilter(e.target.value ? Number(e.target.value) : undefined);
                setPage(1);
              }}
              className="input w-full max-w-xs"
            >
              <option value="">Все пользователи</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.username ? `@${u.username}` : u.first_name || `#${u.id}`}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-slate-800 rounded-xl overflow-hidden">
            {loading ? (
              <div className="flex items-center gap-3 text-slate-400 px-6 py-12">
                <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                Загрузка...
              </div>
            ) : rows.length === 0 ? (
              <div className="px-6 py-12 text-slate-500 text-center">Нет анализов</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-slate-400 border-b border-slate-700">
                      <th className="text-left px-4 py-3">ID</th>
                      <th className="text-left px-4 py-3">Пользователь</th>
                      <th className="text-left px-4 py-3">Текущая роль</th>
                      <th className="text-left px-4 py-3">Уровень</th>
                      <th className="text-left px-4 py-3">Путей</th>
                      <th className="text-left px-4 py-3">Создан</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((a, i) => (
                      <tr
                        key={a.id}
                        className={`border-b border-slate-700/50 hover:bg-slate-700/50 transition-colors ${i % 2 === 1 ? 'bg-slate-800/50' : ''}`}
                      >
                        <td className="px-4 py-3 text-slate-400">{a.id}</td>
                        <td className="px-4 py-3">
                          <a
                            href={`/admin/users/${a.user_id}`}
                            className="text-emerald-400 hover:text-emerald-300"
                          >
                            {a.username ? `@${a.username}` : a.first_name || `#${a.user_id}`}
                          </a>
                        </td>
                        <td className="px-4 py-3 text-slate-300">{a.current_role || '—'}</td>
                        <td className="px-4 py-3 text-slate-300">{a.level || '—'}</td>
                        <td className="px-4 py-3 text-slate-300">{a.career_paths_count}</td>
                        <td className="px-4 py-3 text-slate-400">
                          {new Date(a.created_at).toLocaleDateString('ru')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-slate-700">
                <span className="text-slate-400 text-sm">{total} всего</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded text-sm disabled:opacity-40"
                  >←</button>
                  <span className="px-3 py-1 text-slate-400 text-sm">{page} / {totalPages}</span>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded text-sm disabled:opacity-40"
                  >→</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function AnalysesPage() {
  return <AdminAuthGuard>{(user) => <AnalysesContent user={user} />}</AdminAuthGuard>;
}
