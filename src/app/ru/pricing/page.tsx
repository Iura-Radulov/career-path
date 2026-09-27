import type { Metadata } from 'next';
import SetRuLang from '@/components/SetRuLang';
import PricingContent from '@/app/pricing/PricingContent';
import JsonLd from '@/components/JsonLd';
import { organizationSchema, breadcrumbSchema } from '@/lib/schema';

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://careerpathsim.com';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Тарифы — Career Path Simulator',
  description: 'Начни бесплатно с тестом одной профессии. Перейди на Премиум для доступа ко всем 8 профессиям, неограниченным AI-ролевым играм и персональным планам развития.',
  alternates: {
    canonical: `${siteUrl}/ru/pricing`,
    languages: {
      en: `${siteUrl}/pricing`,
      ru: `${siteUrl}/ru/pricing`,
    },
  },
};

export default function RuPricingPage() {
  return (
    <>
      <JsonLd data={organizationSchema()} />
      <JsonLd data={breadcrumbSchema([
        { name: 'Главная', url: '/ru' },
        { name: 'Тарифы', url: '/ru/pricing' },
      ])} />
      <SetRuLang>
        <PricingContent />
      </SetRuLang>
    </>
  );
}
