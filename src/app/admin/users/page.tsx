'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminAuthGuard from '@/components/AdminAuthGuard';
import AdminSidebar from '@/components/AdminSidebar';
import type { User } from '@/lib/db';

interface UserWithPlan extends User {
  plan_name: string | null;
  plan_slug: string | null;
  subscription_status: string | null;
}

function UsersContent({ user }: { user: User }) {
  const router = useRouter();
  const [users, setUsers] = useState<UserWithPlan[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/users')
      .then((r) => r.json())
      .then((data) => setUsers(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, []);

  const filtered = users.filter((u) =>
    !search || (u.username?.toLowerCase().includes(search.toLowerCase()) ||
      u.first_name?.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="flex min-h-screen bg-slate-950">
      <AdminSidebar username={user.username} />
      <main className="flex-1 md:ml-64 p-6 pt-16 md:pt-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-white">Пользователи</h1>
            <div className="text-slate-400 text-sm">{users.length} всего</div>
          </div>

          <div className="mb-4">
            <input
              type="text"
              placeholder="Поиск по имени или username..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input w-full max-w-sm"
            />
          </div>

          <div className="bg-slate-800 rounded-xl overflow-hidden">
            {loading ? (
              <div className="flex items-center gap-3 text-slate-400 px-6 py-12">
                <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                Загрузка...
              </div>
            ) : filtered.length === 0 ? (
              <div className="px-6 py-12 text-slate-500 text-center">Нет пользователей</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-slate-400 border-b border-slate-700">
                      <th className="text-left px-4 py-3">ID</th>
                      <th className="text-left px-4 py-3">Telegram ID</th>
                      <th className="text-left px-4 py-3">Username</th>
                      <th className="text-left px-4 py-3">Имя</th>
                      <th className="text-left px-4 py-3">Язык</th>
                      <th className="text-left px-4 py-3">Роль</th>
                      <th className="text-left px-4 py-3">Тариф</th>
                      <th className="text-left px-4 py-3">Создан</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((u, i) => (
                      <tr
                        key={u.id}
                        onClick={() => router.push(`/admin/users/${u.id}`)}
                        className={`border-b border-slate-700/50 hover:bg-slate-700/50 cursor-pointer transition-colors ${i % 2 === 1 ? 'bg-slate-800/50' : ''}`}
                      >
                        <td className="px-4 py-3 text-slate-400">{u.id}</td>
                        <td className="px-4 py-3 text-slate-300 font-mono text-xs">{u.telegram_id}</td>
                        <td className="px-4 py-3 text-slate-200">{u.username ? `@${u.username}` : '—'}</td>
                        <td className="px-4 py-3 text-slate-300">{u.first_name || '—'}</td>
                        <td className="px-4 py-3 text-slate-400 uppercase text-xs">{u.language_code}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded text-xs ${u.role === 'admin' ? 'bg-purple-900/50 text-purple-400' : 'bg-slate-700 text-slate-400'}`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded text-xs ${
                            u.plan_slug === 'premium'
                              ? 'bg-emerald-900/50 text-emerald-400 border border-emerald-700/50'
                              : 'bg-slate-700 text-slate-500'
                          }`}>
                            {u.plan_name || 'Free'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-400">
                          {new Date(u.created_at).toLocaleDateString('ru')}
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

export default function UsersPage() {
  return <AdminAuthGuard>{(user) => <UsersContent user={user} />}</AdminAuthGuard>;
}
