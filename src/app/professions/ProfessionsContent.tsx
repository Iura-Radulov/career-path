'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import LandingNav from '@/components/LandingNav';
import Footer from '@/components/Footer';
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
  background_image: string | null;
  entry_salary_eu: string | null;
  entry_salary_cis: string | null;
  growth_outlook: string | null;
  is_active: number;
}

const categoryColors: Record<string, string> = {
  technology: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  health: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  creative: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  engineering: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  business: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  media: 'bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/20',
  science: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
  education: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
};

const categoryLabels: Record<string, string> = {
  technology: 'professions.technology',
  health: 'professions.health',
  creative: 'professions.creative',
  engineering: 'professions.engineering',
  business: 'professions.business',
  media: 'professions.media',
  science: 'professions.science',
  education: 'professions.education',
};

const catLabel = (cat: string): string => {
    const key = cat.toLowerCase();
    const label = t(categoryLabels[key] || key);
    return label;
  };

export default function ProfessionsContent() {
  const { t } = useTranslation();
  const [professions, setProfessions] = useState<ProfessionItem[]>([]);
  const [loading, setLoading] = useState(true);

const catLabel = (cat: string): string => {
    const key = cat.toLowerCase();
    const label = t(categoryLabels[key] || key);
    return label;
  };

  useEffect(() => {
    fetch('/api/admin/professions')
      .then(r => r.json())
      .then(data => setProfessions(Array.isArray(data) ? data.filter((p: ProfessionItem) => p.is_active !== 0) : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-slate-950">
      <LandingNav />

      {/* Hero */}
      <section className="relative px-4 py-40 pt-44 sm:py-56 sm:pt-60 text-center overflow-hidden">
        <div className="absolute inset-0" style={{ backgroundImage: 'url(/bg-professions-icons.svg)', backgroundSize: 'cover' }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(2,6,23,0.65) 0%, rgba(2,6,23,0.2) 50%, rgba(2,6,23,0.6) 100%)' }} />
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {professions.map((prof) => (
                <Link
                  key={prof.id}
                  href={`/professions/${prof.slug}`}
                  className="flex flex-col gap-2 p-6 rounded-2xl bg-slate-800/50 border border-slate-700/50 hover:border-emerald-600/50 hover:bg-slate-800 transition-all cursor-pointer"
                >
                  <div className="text-4xl">{prof.emoji}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${categoryColors[prof.category] || 'bg-slate-600/20 text-slate-400 border-slate-600/30'}`}>
                      {catLabel(prof.category)}
                    </span>
                    {prof.entry_salary_cis && (
                      <span className="text-[10px] text-slate-500">💰 {prof.entry_salary_cis}</span>
                    )}
                  </div>
                  <h3 className="text-white font-semibold text-sm leading-tight mt-1">
                    {prof.name_ru}
                  </h3>
                  <p className="text-slate-400 text-xs leading-relaxed line-clamp-2 flex-1">
                    {prof.description_short || prof.name_en}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-emerald-400 text-xs font-medium">{t('professions.cta')}</span>
                    {prof.entry_salary_eu && (
                      <span className="text-slate-600 text-[10px]">{prof.entry_salary_eu}</span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
