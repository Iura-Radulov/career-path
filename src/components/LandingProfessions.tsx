'use client';

import { useTranslation } from '@/lib/i18n';
import Link from 'next/link';

const professions = [
  { emoji: '💻', key: 'dev', categoryKey: 'technology', slug: 'software-dev' },
  { emoji: '🏥', key: 'doctor', categoryKey: 'health', slug: 'doctor' },
  { emoji: '🎨', key: 'designer', categoryKey: 'creative', slug: 'designer' },
  { emoji: '⚙️', key: 'engineer', categoryKey: 'engineering', slug: 'engineer' },
  { emoji: '📊', key: 'marketer', categoryKey: 'business', slug: 'marketer' },
  { emoji: '👨‍💼', key: 'analyst', categoryKey: 'technology', slug: 'analyst' },
  { emoji: '⚡', key: 'energy', categoryKey: 'engineering', slug: 'energy' },
  { emoji: '🎬', key: 'creator', categoryKey: 'business', slug: 'creator' },
];

const categoryColors: Record<string, string> = {
  technology: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  health: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  creative: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  engineering: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  business: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
};

export default function LandingProfessions() {
  const { t } = useTranslation();

  return (
    <section id="professions" className="py-24 px-4 bg-slate-950">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">{t('professions.title')}</h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">{t('professions.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {professions.map(({ emoji, key, categoryKey, slug }) => (
            <div
              key={key}
              className="group p-5 rounded-2xl bg-slate-800/50 border border-slate-700/50 hover:border-emerald-500/30 hover:bg-slate-800 transition-all duration-300 flex flex-col"
            >
              <div className="text-4xl mb-3">{emoji}</div>
              <div className={`inline-flex self-start items-center px-2.5 py-0.5 rounded-full text-xs font-medium border mb-3 ${categoryColors[categoryKey]}`}>
                {t(`professions.${categoryKey}`)}
              </div>
              <h3 className="text-white font-semibold text-base mb-2">{t(`professions.${key}.name`)}</h3>
              <p className="text-slate-400 text-sm leading-relaxed flex-1">{t(`professions.${key}.desc`)}</p>
              <Link
                href={`/professions/${slug}`}
                className="mt-4 text-emerald-400 text-sm font-medium hover:text-emerald-300 transition-colors"
              >
                {t('professions.cta')}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
