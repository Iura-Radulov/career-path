'use client';

import { useEffect, useState } from 'react';

interface Platform {
  id: number;
  slug: string;
  name_ru: string;
  name_en: string;
  description_ru: string | null;
  description_en: string | null;
  logo_url: string | null;
  website_url: string | null;
  affiliate_url: string | null;
  commission_rate: string | null;
  category: string;
}

interface Props {
  locale?: 'ru' | 'en';
  limit?: number;
  /** Profession category to filter platforms (e.g. "technology", "creative") */
  professionCategory?: string;
}

export default function AffiliatePlatforms({ locale = 'ru', limit = 6, professionCategory }: Props) {
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const url = professionCategory
      ? `/api/admin/platforms?category=${professionCategory}`
      : '/api/admin/platforms';

    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        const list: Platform[] = data.platforms || [];
        setPlatforms(list.slice(0, limit));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [limit, professionCategory]);

  if (loading || platforms.length === 0) return null;

  return (
    <section className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/50">
      <h2 className="text-xl font-bold text-white mb-4">
        🎓 {locale === 'ru' ? 'Где учиться' : 'Where to learn'}
      </h2>
      <p className="text-slate-400 text-sm mb-4">
        {locale === 'ru'
          ? 'Рекомендуем начать с этих образовательных платформ:'
          : 'Start learning with these recommended platforms:'}
      </p>
      <div className="space-y-2.5">
        {platforms.map((p) => (
          <a
            key={p.id}
            href={p.affiliate_url || p.website_url || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-700/40 hover:border-emerald-600/40 hover:bg-slate-900/80 transition-all group"
          >
            {p.logo_url ? (
              <img src={p.logo_url} alt={p.name_ru} className="w-10 h-10 rounded-lg object-contain bg-slate-700/50 p-1.5 shrink-0" />
            ) : (
              <div className="w-10 h-10 rounded-lg bg-slate-700/50 flex items-center justify-center text-lg shrink-0 font-bold text-slate-300">
                {p.name_ru?.[0] || p.name_en?.[0] || '?'}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <div className="text-sm text-white font-medium group-hover:text-emerald-300 transition-colors truncate">
                {locale === 'ru' ? p.name_ru : p.name_en}
              </div>
              {p.description_ru && locale === 'ru' && (
                <div className="text-xs text-slate-400 truncate mt-0.5">{p.description_ru}</div>
              )}
              {p.description_en && locale !== 'ru' && (
                <div className="text-xs text-slate-400 truncate mt-0.5">{p.description_en}</div>
              )}
            </div>
            <div className="text-sm text-slate-500 group-hover:text-slate-400 shrink-0 transition-colors">→</div>
          </a>
        ))}
      </div>
    </section>
  );
}
