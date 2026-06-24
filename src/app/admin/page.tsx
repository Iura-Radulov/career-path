'use client';

import { useEffect, useState } from 'react';
import AdminAuthGuard from '@/components/AdminAuthGuard';
import AdminSidebar from '@/components/AdminSidebar';
import type { User, RecentAnalysis } from '@/lib/db';

interface Stats {
  totalUsers: number;
  newUsersThisWeek: number;
  totalAnalyses: number;
  totalQuizzes: number;
  avgQuizScore: number;
  totalProfessions: number;
}

function DashboardContent({ user }: { user: User }) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [analyses, setAnalyses] = useState<RecentAnalysis[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/stats').then((r) => r.json()),
      fetch('/api/admin/analyses').then((r) => r.json()),
    ])
      .then(([s, a]) => {
        setStats(s);
        setAnalyses(Array.isArray(a) ? a.slice(0, 10) : []);
      })
      .finally(() => setLoading(false));
  }, []);

  const statCards = stats
    ? [
        { label: 'Всего пользователей', value: stats.totalUsers, icon: '👥' },
        { label: 'Новых за неделю', value: stats.newUsersThisWeek, icon: '📈' },
        { label: 'Анализов карьеры', value: stats.totalAnalyses, icon: '🔍' },
        { label: 'Квизов пройдено', value: stats.totalQuizzes, icon: '🎯' },
      ]
    : [];

  return (
    <div className="flex min-h-screen bg-slate-950">
      <AdminSidebar username={user.username} />
      <main className="flex-1 md:ml-64 p-6 pt-16 md:pt-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-white mb-6">
            Добро пожаловать, {user.first_name || user.username || 'Администратор'}
          </h1>

          {loading ? (
            <div className="flex items-center gap-3 text-slate-400 py-12">
              <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
              Загрузка...
            </div>
          ) : (
            <>
              {/* Stats cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {statCards.map((card) => (
                  <div key={card.label} className="bg-slate-800 rounded-xl p-4">
                    <div className="text-2xl mb-2">{card.icon}</div>
                    <div className="text-2xl font-bold text-white">{card.value}</div>
                    <div className="text-slate-400 text-sm mt-1">{card.label}</div>
                  </div>
                ))}
              </div>

              {/* Quick links */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {[
                  { href: '/admin/professions', label: '💼 Управление профессиями', desc: `${stats?.totalProfessions ?? 0} профессий` },
                  { href: '/admin/users', label: '👥 Пользователи', desc: `${stats?.totalUsers ?? 0} зарегистрировано` },
                  { href: '/admin/analyses', label: '📈 Анализы карьеры', desc: `${stats?.totalAnalyses ?? 0} анализов` },
                ].map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="bg-slate-800 hover:bg-slate-700 rounded-xl p-4 transition-colors block"
                  >
                    <div className="text-white font-semibold">{link.label}</div>
                    <div className="text-slate-400 text-sm mt-1">{link.desc}</div>
                  </a>
                ))}
              </div>

              {/* Recent analyses */}
              <div className="bg-slate-800 rounded-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-700">
                  <h2 className="text-white font-semibold">Последние анализы</h2>
                </div>
                {analyses.length === 0 ? (
                  <div className="px-6 py-8 text-slate-500 text-center">Нет данных</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-slate-400 border-b border-slate-700">
                          <th className="text-left px-6 py-3">Пользователь</th>
                          <th className="text-left px-6 py-3">Роль</th>
                          <th className="text-left px-6 py-3">Уровень</th>
                          <th className="text-left px-6 py-3">Путей</th>
                          <th className="text-left px-6 py-3">Дата</th>
                        </tr>
                      </thead>
                      <tbody>
                        {analyses.map((a, i) => (
                          <tr
                            key={a.id}
                            className={`border-b border-slate-700/50 hover:bg-slate-700/50 transition-colors ${i % 2 === 0 ? '' : 'bg-slate-800/50'}`}
                          >
                            <td className="px-6 py-3 text-slate-200">
                              {a.username ? `@${a.username}` : a.first_name || `#${a.user_id}`}
                            </td>
                            <td className="px-6 py-3 text-slate-300">{a.current_role || '—'}</td>
                            <td className="px-6 py-3 text-slate-300">{a.level || '—'}</td>
                            <td className="px-6 py-3 text-slate-300">{a.career_paths_count}</td>
                            <td className="px-6 py-3 text-slate-400">
                              {new Date(a.created_at).toLocaleDateString('ru')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default function AdminPage() {
  return <AdminAuthGuard>{(user) => <DashboardContent user={user} />}</AdminAuthGuard>;
}
