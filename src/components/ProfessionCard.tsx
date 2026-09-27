'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from '@/lib/i18n';

interface ProfessionCardItem {
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

// Map DB slugs to i18n key prefixes for descriptions
const SLUG_TO_I18N: Record<string, string> = {
  'software-dev': 'dev',
  'doctor': 'doctor',
  'designer': 'designer',
  'engineer': 'engineer',
  'marketer': 'marketer',
  'data-scientist': 'analyst',
  'renewable-energy': 'energy',
  'content-creator': 'creator',
};

interface Props {
  profession: ProfessionCardItem;
  localePrefix?: string;
}

export default function ProfessionCard({ profession, localePrefix }: Props) {
  const pathname = usePathname();
  const prefix = localePrefix ?? (pathname.startsWith('/ru') ? '/ru' : '');
  const { t, uiLang } = useTranslation();

  const catLabel = (cat: string): string => {
    const key = cat.toLowerCase();
    return t(categoryLabels[key] || key);
  };

  return (
    <Link
      href={`${prefix}/professions/${profession.slug}`}
      className="flex flex-col gap-2 p-5 rounded-2xl bg-slate-800/50 border border-slate-700/50 hover:border-emerald-500/30 hover:bg-slate-800 transition-all duration-300 cursor-pointer group"
    >
      <div className="text-4xl">{profession.emoji}</div>

      <div className="flex items-center gap-2 mt-1">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-medium border ${categoryColors[profession.category?.toLowerCase()] || 'bg-slate-600/20 text-slate-400 border-slate-600/30'}`}>
          {catLabel(profession.category)}
        </span>
      </div>

      <h3 className="text-white font-semibold text-sm sm:text-base leading-tight mt-1">
        {uiLang === 'en' ? profession.name_en : profession.name_ru}
      </h3>

      <p className="text-slate-400 text-xs sm:text-sm leading-relaxed line-clamp-2 flex-1">
        {uiLang === 'en'
          ? (SLUG_TO_I18N[profession.slug]
              ? t(`professions.${SLUG_TO_I18N[profession.slug]}.desc`)
              : t(`professions.${profession.slug}.desc`)) || profession.description_short || profession.name_en
          : (profession.description_short || profession.name_en)}
      </p>

      <div className="flex items-center justify-between mt-auto">
        <span className="text-emerald-400 text-xs sm:text-sm font-medium group-hover:text-emerald-300 transition-colors">
          {t('professions.cta')}
          <span className="inline-block ml-1 group-hover:translate-x-1 transition-transform">→</span>
        </span>
        {profession.entry_salary_cis && (
          <span className="text-[10px] text-slate-500">💰 {profession.entry_salary_cis}</span>
        )}
      </div>
    </Link>
  );
}
