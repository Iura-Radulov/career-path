'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import AdminAuthGuard from '@/components/AdminAuthGuard';
import AdminSidebar from '@/components/AdminSidebar';
import type { User, UserCareerProfile, QuizResult, UserSubscriptionInfo, PricingPlan } from '@/lib/db';

interface UserDetail {
  user: User;
  analyses: UserCareerProfile[];
  quizResults: QuizResult[];
  analysesCount: number;
  subscription: UserSubscriptionInfo | null;
}

function UserDetailContent({ currentUser }: { currentUser: User }) {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [data, setData] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);
  const [savingPlan, setSavingPlan] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch(`/api/admin/users/${id}`).then((r) => r.json()),
      fetch('/api/admin/pricing-plans').then((r) => r.json()),
    ]).then(([userData, plansData]) => {
      setData(userData);
      const allPlans = Array.isArray(plansData) ? plansData : [];
      setPlans(allPlans);
      if (userData.subscription?.plan) {
        setSelectedPlanId(userData.subscription.plan.id);
      }
    }).finally(() => setLoading(false));
  }, [id]);

  async function handleDelete() {
    if (!confirm('Удалить пользователя и все его данные?')) return;
    setDeleting(true);
    await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
    router.push('/admin/users');
  }

  async function handleChangePlan() {
    setSavingPlan(true);
    await fetch(`/api/admin/users/${id}/subscription`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan_id: selectedPlanId }),
    });
    setSavingPlan(false);
    // reload
    const userData = await fetch(`/api/admin/users/${id}`).then((r) => r.json());
    setData(userData);
  }

  async function handleRemoveSubscription() {
    if (!confirm('Удалить подписку пользователя?')) return;
    setSavingPlan(true);
    await fetch(`/api/admin/users/${id}/subscription`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan_id: null }),
    });
    setSavingPlan(false);
    const userData = await fetch(`/api/admin/users/${id}`).then((r) => r.json());
    setData(userData);
  }

  return (
    <div className="flex min-h-screen bg-slate-950">
      <AdminSidebar username={currentUser.username} />
      <main className="flex-1 md:ml-64 p-6 pt-16 md:pt-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <a href="/admin/users" className="text-slate-400 hover:text-white text-sm">← Назад</a>
            <h1 className="text-2xl font-bold text-white">Пользователь #{id}</h1>
          </div>

          {loading ? (
            <div className="flex items-center gap-3 text-slate-400 py-12">
              <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
              Загрузка...
            </div>
          ) : !data ? (
            <div className="text-slate-500 text-center py-12">Пользователь не найден</div>
          ) : (
            <div className="space-y-6">
              {/* User info card */}
              <div className="bg-slate-800 rounded-xl p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="text-xl font-semibold text-white">
                      {data.user.first_name || 'Без имени'}
                    </div>
                    {data.user.username && (
                      <div className="text-slate-400">@{data.user.username}</div>
                    )}
                    <div className="flex flex-wrap gap-4 text-sm text-slate-400 mt-4">
                      <span>Telegram ID: <span className="text-slate-200 font-mono">{data.user.telegram_id}</span></span>
                      <span>Язык: <span className="text-slate-200 uppercase">{data.user.language_code}</span></span>
                      <span>Роль: <span className={data.user.role === 'admin' ? 'text-purple-400' : 'text-slate-200'}>{data.user.role}</span></span>
                      <span>Зарегистрирован: <span className="text-slate-200">{new Date(data.user.created_at).toLocaleString('ru')}</span></span>
                    </div>
                  </div>
                  <button
                    onClick={handleDelete} disabled={deleting}
                    className="px-4 py-2 bg-red-900/50 hover:bg-red-800/70 text-red-400 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                  >
                    {deleting ? 'Удаление...' : 'Удалить'}
                  </button>
                </div>
              </div>

              {/* Subscription block */}
              <div className="bg-slate-800 rounded-xl p-6">
                <h2 className="text-white font-semibold mb-4">📋 Подписка</h2>
                {data.subscription ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 text-sm">Тариф:</span>
                      <span className="text-white font-medium">{data.subscription.plan?.name}</span>
                      <span className="text-slate-500 text-xs">{data.subscription.plan?.price}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 text-sm">Статус:</span>
                      <span className={`px-2 py-0.5 rounded text-xs ${
                        data.subscription.status === 'active' ? 'bg-emerald-900/50 text-emerald-400' : 'bg-slate-700 text-slate-500'
                      }`}>
                        {data.subscription.status === 'active' ? 'Активна' : data.subscription.status}
                      </span>
                    </div>
                    {data.subscription.start_date && (
                      <div className="text-slate-400 text-sm">Начало: <span className="text-slate-300">{new Date(data.subscription.start_date).toLocaleDateString('ru')}</span></div>
                    )}
                    {data.subscription.end_date && (
                      <div className="text-slate-400 text-sm">Окончание: <span className="text-slate-300">{new Date(data.subscription.end_date).toLocaleDateString('ru')}</span></div>
                    )}
                    <div className="text-slate-400 text-sm">
                      Автопродление: <span className={data.subscription.auto_renew ? 'text-emerald-400' : 'text-slate-500'}>{data.subscription.auto_renew ? 'Включено' : 'Отключено'}</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-slate-500 text-sm">Нет активной подписки</p>
                )}

                <div className="mt-4 pt-4 border-t border-slate-700">
                  <label className="text-slate-400 text-sm block mb-2">Изменить тариф:</label>
                  <div className="flex gap-2">
                    <select
                      value={selectedPlanId ?? ''}
                      onChange={(e) => setSelectedPlanId(e.target.value ? parseInt(e.target.value) : null)}
                      className="bg-slate-700 text-white rounded-lg px-3 py-2 text-sm border border-slate-600 flex-1 max-w-xs"
                    >
                      <option value="">Нет (снять подписку)</option>
                      {plans.filter((p) => p.is_active).map((p) => (
                        <option key={p.id} value={p.id}>{p.name} — {p.price}</option>
                      ))}
                    </select>
                    <button
                      onClick={selectedPlanId ? handleChangePlan : handleRemoveSubscription}
                      disabled={savingPlan}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                    >
                      {savingPlan ? '...' : 'Сохранить'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Analyses */}
              <div className="bg-slate-800 rounded-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-700">
                  <h2 className="text-white font-semibold">Анализы карьеры ({data.analysesCount})</h2>
                </div>
                {data.analyses.length === 0 ? (
                  <div className="px-6 py-8 text-slate-500 text-center">Нет анализов</div>
                ) : (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-slate-400 border-b border-slate-700">
                        <th className="text-left px-6 py-3">Роль</th>
                        <th className="text-left px-6 py-3">Уровень</th>
                        <th className="text-left px-6 py-3">Опыт</th>
                        <th className="text-left px-6 py-3">Дата</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.analyses.map((a) => (
                        <tr key={a.id} className="border-b border-slate-700/50">
                          <td className="px-6 py-3 text-slate-300">{a.current_role || '—'}</td>
                          <td className="px-6 py-3 text-slate-300">{a.level || '—'}</td>
                          <td className="px-6 py-3 text-slate-300">{a.experience || '—'}</td>
                          <td className="px-6 py-3 text-slate-400">{new Date(a.created_at).toLocaleString('ru')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Quiz results */}
              <div className="bg-slate-800 rounded-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-700">
                  <h2 className="text-white font-semibold">Результаты квизов ({data.quizResults.length})</h2>
                </div>
                {data.quizResults.length === 0 ? (
                  <div className="px-6 py-8 text-slate-500 text-center">Нет результатов</div>
                ) : (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-slate-400 border-b border-slate-700">
                        <th className="text-left px-6 py-3">Профессия</th>
                        <th className="text-left px-6 py-3">Счёт</th>
                        <th className="text-left px-6 py-3">Дата</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.quizResults.map((q) => (
                        <tr key={q.id} className="border-b border-slate-700/50">
                          <td className="px-6 py-3 text-slate-300">{q.profession_slug}</td>
                          <td className="px-6 py-3 text-slate-300">{q.score ?? '—'}</td>
                          <td className="px-6 py-3 text-slate-400">{new Date(q.created_at).toLocaleString('ru')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default function UserDetailPage() {
  return <AdminAuthGuard>{(user) => <UserDetailContent currentUser={user} />}</AdminAuthGuard>;
}
