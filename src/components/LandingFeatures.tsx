'use client';

import { Brain, MessageCircle, Map, DollarSign, Zap, Smartphone } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';

const icons = [Brain, MessageCircle, Map, DollarSign, Zap, Smartphone];
const featureKeys = ['quiz', 'roleplay', 'roadmap', 'salary', 'test', 'platform'];

export default function LandingFeatures() {
  const { t } = useTranslation();

  return (
    <section id="features" className="py-24 px-4 bg-slate-950">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">{t('features.title')}</h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">{t('features.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featureKeys.map((key, i) => {
            const Icon = icons[i];
            return (
              <div
                key={key}
                className="group p-6 rounded-2xl bg-slate-800/50 border border-slate-700/50 hover:border-emerald-500/30 hover:bg-slate-800 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4 group-hover:bg-emerald-500/20 transition-colors">
                  <Icon className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">
                  {t(`features.${key}.title`)}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {t(`features.${key}.desc`)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
