'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import LandingNav from '@/components/LandingNav';
import Footer from '@/components/Footer';
import ProfessionCard from '@/components/ProfessionCard';
import { useTranslation } from '@/lib/i18n';
import { MINI_APP_WEB_URL } from '@/lib/constants';

interface ProfessionItem {
  id: number;
  slug: string;
  name_en: string;
  name_ru: string;
  emoji: string;
  category: string;
  description_short: string | null;
  entry_salary_cis: string | null;
  entry_salary_eu: string | null;
  growth_outlook: string | null;
}

export default function ProfessionsContent() {
  const { t } = useTranslation();
  const pathname = usePathname();
  const isRu = pathname.startsWith('/ru');
  const prefix = isRu ? '/ru' : '';
  const [professions, setProfessions] = useState<ProfessionItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/professions')
      .then(r => r.json())
      .then(data => setProfessions(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-slate-950">
      <LandingNav />

      {/* Hero */}
      <section className="relative px-4 py-40 pt-44 sm:py-56 sm:pt-60 text-center overflow-hidden">
        <div className="absolute inset-0" style={{ backgroundImage: 'url(/bg-professions-icons.svg)', backgroundSize: 'cover' }} />

        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(16,185,129,0.15) 0%, transparent 60%)' }} />
        <div className="relative z-10 max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            {t('professions.page.title')}
          </h1>
          <p className="text-lg sm:text-xl text-slate-300 leading-relaxed">
            {t('professions.page.subtitle')}
          </p>
        </div>
      </section>

      {/* Professions grid */}
      <section className="py-24 px-4 bg-slate-950">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {professions.map((prof) => (
                <ProfessionCard key={prof.id} profession={prof} localePrefix={prefix} />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
