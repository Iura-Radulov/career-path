'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminAuthGuard from '@/components/AdminAuthGuard';
import AdminSidebar from '@/components/AdminSidebar';
import type { User, Article } from '@/lib/db';

const PAGE_SIZE = 20;

function ArticlesContent({ user }: { user: User }) {
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [deleting, setDeleting] = useState<number | null>(null);

  function load() {
    setLoading(true);
    fetch('/api/admin/articles')
      .then((r) => r.json())
      .then((data) => setArticles(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  async function handleDelete(id: number) {
    if (!confirm('Удалить статью?')) return;
    setDeleting(id);
    await fetch(`/api/admin/articles/${id}`, { method: 'DELETE' });
    setDeleting(null);
    load();
  }

  const total = articles.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const paginated = articles.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="flex min-h-screen bg-slate-950">
      <AdminSidebar username={user.username} />
      <main className="flex-1 md:ml-64 p-6 pt-16 md:pt-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-white">Статьи</h1>
            <a
              href="/admin/articles/new"
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
                Нет статей.{' '}
                <a href="/admin/articles/new" className="text-emerald-400 hover:underline">Добавить первую</a>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-slate-400 border-b border-slate-700">
                      <th className="text-left px-4 py-3">Фото</th>
                      <th className="text-left px-4 py-3">Заголовок RU / EN</th>
                      <th className="text-left px-4 py-3">Категория</th>
                      <th className="text-left px-4 py-3">Статус</th>
                      <th className="text-left px-4 py-3">Дата</th>
                      <th className="text-left px-4 py-3">Действия</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginated.map((a, i) => (
                      <tr
                        key={a.id}
                        className={`border-b border-slate-700/50 hover:bg-slate-700/50 transition-colors cursor-pointer ${i % 2 === 1 ? 'bg-slate-800/50' : ''}`}
                        onClick={() => router.push(`/admin/articles/${a.id}/edit`)}
                      >
                        <td className="px-4 py-3">
                          {a.image_url ? (
                            <img
                              src={a.image_url}
                              alt=""
                              className="w-14 h-10 object-cover rounded"
                              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                            />
                          ) : (
                            <div className="w-14 h-10 bg-slate-700 rounded flex items-center justify-center text-slate-500 text-xs">—</div>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-slate-200 font-medium line-clamp-1">{a.title_ru}</div>
                          <div className="text-slate-500 text-xs line-clamp-1">{a.title_en}</div>
                        </td>
                        <td className="px-4 py-3 text-slate-300">{a.category}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded text-xs ${a.is_published ? 'bg-emerald-900/50 text-emerald-400' : 'bg-slate-700 text-slate-500'}`}>
                            {a.is_published ? 'Опубликована' : 'Черновик'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-400 text-xs">
                          {a.published_at ? new Date(a.published_at).toLocaleDateString('ru') : new Date(a.created_at).toLocaleDateString('ru')}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => router.push(`/admin/articles/${a.id}/edit`)}
                              className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded text-xs transition-colors"
                            >
                              Изм.
                            </button>
                            <button
                              onClick={() => handleDelete(a.id)}
                              disabled={deleting === a.id}
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
                <span className="text-slate-400 text-sm">{total} статей</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded text-sm disabled:opacity-40"
                  >
                    ←
                  </button>
                  <span className="px-3 py-1 text-slate-400 text-sm">{page} / {totalPages}</span>
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

export default function ArticlesPage() {
  return <AdminAuthGuard>{(user) => <ArticlesContent user={user} />}</AdminAuthGuard>;
}
