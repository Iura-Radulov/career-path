'use client';

import LandingNav from '@/components/LandingNav';
import Footer from '@/components/Footer';
import { useTranslation } from '@/lib/i18n';
import { MINI_APP_WEB_URL } from '@/lib/constants';

export default function AboutContent() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-slate-950">
      <LandingNav />

      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center px-4 py-40 pt-44 sm:py-56 sm:pt-60 text-center overflow-hidden">
        {/* Background image */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'url(/bg-about-compass.svg)',
            backgroundSize: 'cover',
          }}
        />
        {/* No overlay - full visibility */}
        {/* Radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(16,185,129,0.15) 0%, transparent 60%)',
          }}
        />
        <div className="relative z-10 max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            {t('about.title')}
          </h1>
          <p className="text-lg sm:text-xl text-slate-300 leading-relaxed">
            {t('about.subtitle')}
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 sm:py-40 px-4 bg-slate-900">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-xl">
              🎯
            </div>
            <h2 className="text-2xl font-bold text-white">{t('about.mission.title')}</h2>
          </div>
          <p className="text-slate-300 text-lg leading-relaxed">
            {t('about.mission.desc')}
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 sm:py-40 px-4 bg-slate-950">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-xl">
              ⚡
            </div>
            <h2 className="text-2xl font-bold text-white">{t('about.how.title')}</h2>
          </div>
          <p className="text-slate-300 text-lg leading-relaxed">
            {t('about.how.desc')}
          </p>
        </div>
      </section>

      {/* PrepCraft team */}
      <section className="py-20 sm:py-40 px-4 bg-slate-900">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-xl">
              🏢
            </div>
            <h2 className="text-2xl font-bold text-white">{t('about.team.title')}</h2>
          </div>
          <p className="text-slate-300 text-lg leading-relaxed">
            {t('about.team.desc')}
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 bg-slate-950 text-center">
        <div className="max-w-xl mx-auto">
          <a
            href={MINI_APP_WEB_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-white font-semibold text-lg transition-all duration-150 shadow-lg shadow-emerald-500/25"
          >
            {t('about.cta')}
            <span>→</span>
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
