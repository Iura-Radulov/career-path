'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminAuthGuard from '@/components/AdminAuthGuard';
import AdminSidebar from '@/components/AdminSidebar';
import type { User, Profession } from '@/lib/db';

const PAGE_SIZE = 20;

function ProfessionsContent({ user }: { user: User }) {
  const router = useRouter();
  const [professions, setProfessions] = useState<Profession[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [deleting, setDeleting] = useState<number | null>(null);

  function load() {
    setLoading(true);
    fetch('/api/admin/professions')
      .then((r) => r.json())
      .then((data) => setProfessions(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  async function handleDelete(id: number) {
    if (!confirm('Удалить профессию?')) return;
    setDeleting(id);
    await fetch(`/api/admin/professions/${id}`, { method: 'DELETE' });
    setDeleting(null);
    load();
  }

  const total = professions.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const paginated = professions.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="flex min-h-screen bg-slate-950">
      <AdminSidebar username={user.username} />
      <main className="flex-1 md:ml-64 p-6 pt-16 md:pt-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-white">Профессии</h1>
            <a
              href="/admin/professions/new"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium transition-colors"
            >
              + Добавить
            </a>
          </div>

          <div className="bg-slate-800 rounded-xl overflow-hidden">
            {loading ? (
              <div className="flex items-center gap-3 text-slate-400 px-6 py-12">
                <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                Загрузка...
              </div>
            ) : paginated.length === 0 ? (
              <div className="px-6 py-12 text-slate-500 text-center">
                Нет профессий.{' '}
                <a href="/admin/professions/new" className="text-emerald-400 hover:underline">Добавить первую</a>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-slate-400 border-b border-slate-700">
                      <th className="text-left px-4 py-3">Эмодзи</th>
                      <th className="text-left px-4 py-3">Название RU / EN</th>
                      <th className="text-left px-4 py-3">Категория</th>
                      <th className="text-left px-4 py-3">Зарплата EU</th>
                      <th className="text-left px-4 py-3">Зарплата CIS</th>
                      <th className="text-left px-4 py-3">Порядок</th>
                      <th className="text-left px-4 py-3">Статус</th>
                      <th className="text-left px-4 py-3">Действия</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginated.map((p, i) => (
                      <tr
                        key={p.id}
                        className={`border-b border-slate-700/50 hover:bg-slate-700/50 transition-colors ${i % 2 === 1 ? 'bg-slate-800/50' : ''}`}
                      >
                        <td className="px-4 py-3 text-2xl">{p.emoji}</td>
                        <td className="px-4 py-3">
                          <div className="text-slate-200 font-medium">{p.name_ru}</div>
                          <div className="text-slate-500 text-xs">{p.name_en}</div>
                        </td>
                        <td className="px-4 py-3 text-slate-300">{p.category}</td>
                        <td className="px-4 py-3 text-slate-300">{p.entry_salary_eu || '—'}</td>
                        <td className="px-4 py-3 text-slate-300">{p.entry_salary_cis || '—'}</td>
                        <td className="px-4 py-3 text-slate-400">{p.sort_order}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded text-xs ${p.is_active ? 'bg-emerald-900/50 text-emerald-400' : 'bg-slate-700 text-slate-500'}`}>
                            {p.is_active ? 'Активна' : 'Скрыта'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button
                              onClick={() => router.push(`/admin/professions/${p.id}/edit`)}
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

            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-slate-700">
                <span className="text-slate-400 text-sm">{total} профессий</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded text-sm disabled:opacity-40"
                  >
                    ←
                  </button>
                  <span className="px-3 py-1 text-slate-400 text-sm">
                    {page} / {totalPages}
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded text-sm disabled:opacity-40"
                  >
                    →
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function ProfessionsPage() {
  return <AdminAuthGuard>{(user) => <ProfessionsContent user={user} />}</AdminAuthGuard>;
}
