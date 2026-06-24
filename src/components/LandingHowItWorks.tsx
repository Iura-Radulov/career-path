'use client';

import { Search, ClipboardList, MessageSquare } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';

const steps = [
  { icon: Search, key: 'step1' },
  { icon: ClipboardList, key: 'step2' },
  { icon: MessageSquare, key: 'step3' },
];

export default function LandingHowItWorks() {
  const { t } = useTranslation();

  return (
    <section id="how" className="py-24 px-4 bg-slate-900">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">{t('how.title')}</h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">{t('how.subtitle')}</p>
        </div>

        <div className="relative">
          {/* Line between icon 1 and icon 2 */}
          <div
            className="hidden md:block absolute h-0.5 bg-gradient-to-r from-emerald-500/30 to-emerald-500/60 z-20"
            style={{
              top: '44px',
              left: 'calc(16.667% - 0.5rem + 40px)',
              width: 'calc(33.333% + 0.5rem - 80px)',
            }}
          />
          {/* Line between icon 2 and icon 3 */}
          <div
            className="hidden md:block absolute h-0.5 bg-gradient-to-r from-emerald-500/60 to-emerald-500/30 z-20"
            style={{
              top: '44px',
              left: 'calc(50% + 40px)',
              width: 'calc(33.333% + 0.5rem - 80px)',
            }}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6">
            {steps.map(({ icon: Icon, key }, i) => (
              <div key={key} className="flex flex-col items-center text-center bg-slate-900">
                <div className="relative mb-6">
                  <div className="w-20 h-20 rounded-2xl bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center">
                    <Icon className="w-8 h-8 text-emerald-400" />
                  </div>
                  <div className="absolute -top-3 -right-3 w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-sm">
                    {i + 1}
                  </div>
                </div>
                <h3 className="text-white font-semibold text-xl mb-3">{t(`how.${key}.title`)}</h3>
                <p className="text-slate-400 leading-relaxed">{t(`how.${key}.desc`)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
