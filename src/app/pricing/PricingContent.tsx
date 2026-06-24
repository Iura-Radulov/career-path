'use client';

import { useEffect, useState } from 'react';
import LandingNav from '@/components/LandingNav';
import Footer from '@/components/Footer';
import { useTranslation } from '@/lib/i18n';
import { MINI_APP_WEB_URL } from '@/lib/constants';
import type { PricingPlan } from '@/lib/db';

function CheckIcon() {
  return (
    <svg className="w-5 h-5 text-emerald-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

export default function PricingContent() {
  const { t, uiLang } = useTranslation();
  const [plans, setPlans] = useState<PricingPlan[]>([]);

  useEffect(() => {
    fetch('/api/pricing-plans')
      .then((r) => r.json())
      .then((data) => setPlans(Array.isArray(data) ? data : []));
  }, []);

  return (
    <div className="min-h-screen bg-slate-950">
      <LandingNav />

      <section className="relative px-4 py-40 pt-44 sm:py-56 sm:pt-60 text-center overflow-hidden">
        {/* Background image */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'url(/bg-pricing-diamonds.svg)',
            backgroundSize: 'cover',
          }}
        />
        {/* Dark overlay for text readability */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(180deg, rgba(2,6,23,0.65) 0%, rgba(2,6,23,0.2) 50%, rgba(2,6,23,0.6) 100%)',
          }}
        />
        {/* Radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(16,185,129,0.15) 0%, transparent 60%)',
          }}
        />
        <div className="relative z-10 max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            {t('pricing.title')}
          </h1>
          <p className="text-lg sm:text-xl text-slate-300 leading-relaxed">
            {t('pricing.subtitle')}
          </p>
        </div>
      </section>

      <section className="py-24 px-4 bg-slate-950">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {plans.map((plan) => {
              const features = (() => {
                try {
                  const parsed = JSON.parse(plan.features);
                  if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
                    return (parsed[uiLang] || parsed.en || []) as string[];
                  }
                  if (Array.isArray(parsed)) return parsed as string[];
                } catch {}
                return [] as string[];
              })();

              const isPopular = plan.is_popular === 1;

              // For Premium/paid plan — button says "Subscribe" and opens Mini App
            if (plan.slug === 'premium') {
              return (
                <div key={plan.id} className="rounded-2xl border border-emerald-500/30 overflow-hidden flex flex-col">
                  <div
                    className="p-8 border-b border-emerald-500/20"
                    style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.15) 0%, rgba(16,185,129,0.05) 100%)' }}
                  >
                    <h2 className="text-xl font-bold text-white mb-2">{plan.name}</h2>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold text-white">{plan.price}</span>
                      <span className="text-slate-400">/{plan.interval}</span>
                    </div>
                  </div>
                  <div className="p-8 bg-slate-800/50 flex-1 flex flex-col">
                    <ul className="space-y-3 mb-8 flex-1">
                      {features.map((feature) => (
                        <li key={feature} className="flex items-center gap-3">
                          <CheckIcon />
                          <span className="text-slate-300 text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <a
                      href={`${MINI_APP_WEB_URL}/tariffs`}
                      target="_blank"
                      rel="noreferrer"
                      className="block text-center px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-white font-semibold transition-all duration-150 shadow-lg shadow-emerald-500/25"
                    >
                      Subscribe
                    </a>
                  </div>
                </div>
              );
            }

            // Free plan
            return (
              <div key={plan.id} className="rounded-2xl bg-slate-800/50 border border-slate-700/50 overflow-hidden flex flex-col">
                  <div className="p-8 border-b border-slate-700/50">
                    <h2 className="text-xl font-bold text-white mb-2">{plan.name}</h2>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold text-white">{plan.price}</span>
                      <span className="text-slate-400">/{plan.interval}</span>
                    </div>
                  </div>
                  <div className="p-8 flex-1 flex flex-col">
                    <ul className="space-y-3 mb-8 flex-1">
                      {features.map((feature) => (
                        <li key={feature} className="flex items-center gap-3">
                          <CheckIcon />
                          <span className="text-slate-300 text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <a
                      href={MINI_APP_WEB_URL}
                      target="_blank"
                      rel="noreferrer"
                      className="block text-center px-6 py-3 rounded-xl border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 font-semibold hover:bg-emerald-500/20 hover:border-emerald-400 transition-all"
                    >
                      {t('pricing.free.cta')}
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

          <p className="text-center text-slate-500 text-sm mt-8">
            {t('pricing.note')}
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
