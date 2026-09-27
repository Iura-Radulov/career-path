'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

interface AdminSidebarProps {
  username?: string | null;
}

const navItems = [
  { href: '/admin', label: 'Главная', icon: '📊' },
  { href: '/admin/platforms', label: 'Платформы', icon: '🛒' },
  { href: '/admin/articles', label: 'Статьи', icon: '📝' },
  { href: '/admin/professions', label: 'Профессии', icon: '💼' },
  { href: '/admin/users', label: 'Пользователи', icon: '👥' },
  { href: '/admin/analyses', label: 'Анализы карьеры', icon: '📈' },
  { href: '/admin/quizzes', label: 'Тесты совместимости', icon: '🧩' },
  { href: '/admin/pricing-plans', label: 'Тарифы', icon: '💰' },
  { href: '/admin/subscriptions', label: 'Подписки', icon: '📋' },
  { href: '/admin/payments', label: 'Оплаты', icon: '💳' },
  { href: '/admin/settings', label: 'Настройки', icon: '⚙️' },
];

export default function AdminSidebar({ username }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  }

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-xl font-bold text-white">CareerPath</h1>
        <p className="text-slate-400 text-sm mt-1">Панель управления</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              isActive(item.href)
                ? 'bg-emerald-600 text-white'
                : 'text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <span>{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-700 space-y-2">
        <div className="text-slate-400 text-xs px-4">
          {username ? `@${username}` : 'Администратор'}
        </div>
        <Link
          href="/"
          onClick={() => setMobileOpen(false)}
          className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
        >
          ← На сайт
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm text-slate-400 hover:text-red-400 hover:bg-slate-700 transition-colors text-left"
        >
          🚪 Выйти
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile hamburger */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-slate-900 border-b border-slate-700 px-4 py-3 flex items-center gap-4">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-slate-300 hover:text-white"
          aria-label="Меню"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
        <span className="text-white font-semibold">CareerPath Admin</span>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/50"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <div
        className={`md:hidden fixed top-0 left-0 bottom-0 z-50 w-64 bg-slate-900 border-r border-slate-700 transform transition-transform ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <SidebarContent />
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 bg-slate-900 border-r border-slate-700">
        <SidebarContent />
      </div>
    </>
  );
}
