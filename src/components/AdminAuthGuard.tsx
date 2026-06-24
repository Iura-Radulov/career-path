'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { User } from '@/lib/db';

interface AuthState {
  loading: boolean;
  authenticated: boolean;
  user: User | null;
}

interface AdminAuthGuardProps {
  children: (user: User) => React.ReactNode;
}

export default function AdminAuthGuard({ children }: AdminAuthGuardProps) {
  const router = useRouter();
  const [state, setState] = useState<AuthState>({ loading: true, authenticated: false, user: null });

  useEffect(() => {
    fetch('/api/auth/status')
      .then((res) => res.json())
      .then((data) => {
        setState({ loading: false, authenticated: data.authenticated, user: data.user });
        if (!data.authenticated) {
          router.push('/admin/login');
        }
      })
      .catch(() => {
        setState({ loading: false, authenticated: false, user: null });
        router.push('/admin/login');
      });
  }, [router]);

  if (state.loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950">
        <div className="flex items-center gap-3 text-slate-400">
          <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <span>Проверка авторизации...</span>
        </div>
      </div>
    );
  }

  if (!state.authenticated || !state.user) {
    return null;
  }

  if (state.user.role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950">
        <div className="text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold text-white mb-2">Доступ запрещён</h1>
          <p className="text-slate-400 mb-6">У вас нет прав администратора</p>
          <a href="/" className="text-emerald-400 hover:text-emerald-300">← На сайт</a>
        </div>
      </div>
    );
  }

  return <>{children(state.user)}</>;
}
