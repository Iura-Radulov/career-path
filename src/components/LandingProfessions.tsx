'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from '@/lib/i18n';
import ProfessionCard from '@/components/ProfessionCard';

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

export default function LandingProfessions() {
  const { t } = useTranslation();
  const [professions, setProfessions] = useState<ProfessionItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/professions?home=1')
      .then(r => r.json())
      .then(data => setProfessions(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="professions" className="py-24 px-4 bg-slate-950">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">{t('professions.title')}</h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">{t('professions.subtitle')}</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {professions.map((prof) => (
              <ProfessionCard key={prof.id} profession={prof} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
