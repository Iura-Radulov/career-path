'use client';

import { useEffect } from 'react';
import { useTranslation } from '@/lib/i18n';

export default function SetRuLang({ children }: { children: React.ReactNode }) {
  const { setUiLang } = useTranslation();

  useEffect(() => {
    setUiLang('ru');
  }, [setUiLang]);

  return <>{children}</>;
}
