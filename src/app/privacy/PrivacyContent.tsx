'use client';

import LandingNav from '@/components/LandingNav';
import Footer from '@/components/Footer';
import { useTranslation } from '@/lib/i18n';

export default function PrivacyContent() {
  const { t } = useTranslation();

  const sections = [
    { titleKey: 'privacy.info.title', descKey: 'privacy.info.desc' },
    { titleKey: 'privacy.use.title', descKey: 'privacy.use.desc' },
    { titleKey: 'privacy.storage.title', descKey: 'privacy.storage.desc' },
    { titleKey: 'privacy.contact.title', descKey: 'privacy.contact.desc' },
  ];

  return (
    <div className="min-h-screen bg-slate-950">
      <LandingNav />

      <main className="pt-28 pb-24 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">{t('privacy.title')}</h1>
          <p className="text-slate-500 text-sm mb-8">{t('privacy.last_updated')}</p>

          <p className="text-slate-300 leading-relaxed mb-10">{t('privacy.intro')}</p>

          <div className="space-y-10">
            {sections.map(({ titleKey, descKey }) => (
              <section key={titleKey}>
                <h2 className="text-xl font-bold text-white mt-8 mb-3">{t(titleKey)}</h2>
                <p className="text-slate-300 leading-relaxed">{t(descKey)}</p>
              </section>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
