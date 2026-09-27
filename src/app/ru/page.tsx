'use client';

import { useEffect } from 'react';
import LandingHero from '@/components/LandingHero';
import LandingFeatures from '@/components/LandingFeatures';
import LandingHowItWorks from '@/components/LandingHowItWorks';
import LandingProfessions from '@/components/LandingProfessions';
import LandingCTA from '@/components/LandingCTA';
import Footer from '@/components/Footer';
import JsonLd from '@/components/JsonLd';
import { organizationSchema, webApplicationSchema, breadcrumbSchema } from '@/lib/schema';
import { useTranslation } from '@/lib/i18n';

function RuHomeContent() {
  const { setUiLang, t } = useTranslation();

  useEffect(() => {
    setUiLang('ru');
  }, [setUiLang]);

  return (
    <>
      <JsonLd data={organizationSchema()} />
      <JsonLd data={webApplicationSchema()} />
      <JsonLd
        data={breadcrumbSchema([
          { name: t('footer.home'), url: '/' },
        ])}
      />
      <LandingHero />
      <LandingFeatures />
      <LandingHowItWorks />
      <LandingProfessions />
      <LandingCTA />
      <Footer />
    </>
  );
}

export default function RuHomePage() {
  return <RuHomeContent />;
}
