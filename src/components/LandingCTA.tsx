'use client';

import { useTranslation } from '@/lib/i18n';
import { MINI_APP_URL } from '@/lib/constants';
import CTABackground from './CTABackground';

export default function LandingCTA() {
  const { t } = useTranslation();

  return (
    <section className="relative py-24 px-4 bg-slate-900 overflow-hidden">
      <CTABackground />
      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <div
          className="rounded-3xl p-12"
          style={{
            background: 'linear-gradient(135deg, rgba(16,185,129,0.1) 0%, rgba(5,150,105,0.05) 100%)',
            border: '1px solid rgba(16,185,129,0.2)',
          }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">{t('cta.title')}</h2>
          <p className="text-slate-300 text-lg mb-10 leading-relaxed">{t('cta.subtitle')}</p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={MINI_APP_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-white font-semibold text-lg transition-all duration-150 shadow-lg shadow-emerald-500/25"
            >
              {t('cta.button')}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
