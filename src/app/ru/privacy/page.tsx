import type { Metadata } from 'next';
import SetRuLang from '@/components/SetRuLang';
import PrivacyContent from '@/app/privacy/PrivacyContent';
import JsonLd from '@/components/JsonLd';
import { organizationSchema, breadcrumbSchema } from '@/lib/schema';

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://careerpathsim.com';

export const metadata: Metadata = {
  title: 'Политика конфиденциальности — Career Path Simulator',
  description: 'Политика конфиденциальности Career Path Simulator от PrepCraft LTD. Узнайте, как мы собираем, используем и защищаем ваши данные.',
  alternates: {
    canonical: `${siteUrl}/ru/privacy`,
    languages: {
      en: `${siteUrl}/privacy`,
      ru: `${siteUrl}/ru/privacy`,
    },
  },
};

export default function RuPrivacyPage() {
  return (
    <>
      <JsonLd data={organizationSchema()} />
      <JsonLd data={breadcrumbSchema([
        { name: 'Главная', url: '/ru' },
        { name: 'Политика конфиденциальности', url: '/ru/privacy' },
      ])} />
      <SetRuLang>
        <PrivacyContent />
      </SetRuLang>
    </>
  );
}
