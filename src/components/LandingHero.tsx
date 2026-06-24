'use client';

import LandingNav from './LandingNav';
import HeroIllustration from './HeroIllustration';
import { useTranslation } from '@/lib/i18n';
import { MINI_APP_URL } from '@/lib/constants';

export default function LandingHero() {
  const { t } = useTranslation();

  return (
    <section
      className="relative flex flex-col items-center justify-center min-h-screen px-4 py-24 pt-28 text-center overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0f172a 0%, #020617 100%)' }}
    >
      <LandingNav />

      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(16,185,129,0.15) 0%, transparent 60%)',
        }}
      />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto w-full px-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-sm font-medium mb-8">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          {t('hero.badge')}
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center text-left">
          <div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight mb-6">
              {t('hero.title', { path: '' })}{' '}
              <span className="text-emerald-400">{t('hero.title_highlight')}</span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-300 max-w-xl leading-relaxed mb-10">
              {t('hero.subtitle')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href={MINI_APP_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-white font-semibold text-lg transition-all duration-150 shadow-lg shadow-emerald-500/25 w-full sm:w-auto"
              >
                {t('hero.cta_start')}
                <span>→</span>
              </a>
              <a
                href="/professions"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border-2 border-white/20 hover:border-white/50 active:scale-95 text-white font-semibold text-lg transition-all duration-150 w-full sm:w-auto"
              >
                {t('hero.cta_professions')}
              </a>
            </div>

            <p className="mt-6 text-slate-500 text-sm">{t('hero.footnote')}</p>
          </div>

          {/* Hero illustration - wider */}
          <div className="hidden lg:flex items-center justify-center">
            <HeroIllustration />
          </div>
        </div>
      </div>
    </section>
  );
}
