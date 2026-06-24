'use client';

import { useEffect, useState } from 'react';
import AdminAuthGuard from '@/components/AdminAuthGuard';
import AdminSidebar from '@/components/AdminSidebar';
import type { User } from '@/lib/db';

interface Settings {
  apiOk: boolean;
  dbSize: number;
  dbTables: string[];
  jwtSecretSet: boolean;
  nodeEnv: string;
}

function SettingsContent({ user }: { user: User }) {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((r) => r.json())
      .then(setSettings)
      .catch(() => setSettings(null))
      .finally(() => setLoading(false));
  }, []);

  function formatBytes(bytes: number) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  return (
    <div className="flex min-h-screen bg-slate-950">
      <AdminSidebar username={user.username} />
      <main className="flex-1 md:ml-64 p-6 pt-16 md:pt-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold text-white mb-6">Настройки</h1>

          {loading ? (
            <div className="flex items-center gap-3 text-slate-400 py-12">
              <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
              Загрузка...
            </div>
          ) : (
            <div className="space-y-4">
              {/* Admin user info */}
              <Section title="Текущий администратор">
                <Row label="ID" value={String(user.id)} />
                <Row label="Telegram ID" value={String(user.telegram_id)} />
                <Row label="Username" value={user.username ? `@${user.username}` : '—'} />
                <Row label="Имя" value={user.first_name || '—'} />
                <Row label="Роль" value={user.role} highlight />
              </Section>

              {/* API status */}
              <Section title="Статус API">
                <Row
                  label="Backend"
                  value={settings?.apiOk ? 'Подключён' : 'Ошибка'}
                  ok={settings?.apiOk}
                />
              </Section>

              {/* DB info */}
              {settings && (
                <Section title="База данных">
                  <Row label="Размер" value={formatBytes(settings.dbSize)} />
                  <Row label="Таблицы" value={settings.dbTables.join(', ')} />
                </Section>
              )}

              {/* Env */}
              {settings && (
                <Section title="Окружение">
                  <Row label="NODE_ENV" value={settings.nodeEnv} />
                  <Row
                    label="JWT_SECRET"
                    value={settings.jwtSecretSet ? 'Установлен' : 'Не установлен (дефолтный)'}
                    ok={settings.jwtSecretSet}
                  />
                </Section>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-slate-800 rounded-xl overflow-hidden">
      <div className="px-6 py-3 border-b border-slate-700">
        <h2 className="text-white font-semibold text-sm">{title}</h2>
      </div>
      <div className="divide-y divide-slate-700/50">{children}</div>
    </div>
  );
}

function Row({ label, value, ok, highlight }: { label: string; value: string; ok?: boolean; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between px-6 py-3">
      <span className="text-slate-400 text-sm">{label}</span>
      <span className={`text-sm font-medium ${
        ok === true ? 'text-emerald-400' :
        ok === false ? 'text-red-400' :
        highlight ? 'text-purple-400' :
        'text-slate-200'
      }`}>
        {value}
      </span>
    </div>
  );
}

export default function SettingsPage() {
  return <AdminAuthGuard>{(user) => <SettingsContent user={user} />}</AdminAuthGuard>;
}
