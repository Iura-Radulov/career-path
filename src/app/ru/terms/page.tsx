import type { Metadata } from 'next';
import SetRuLang from '@/components/SetRuLang';
import TermsContent from '@/app/terms/TermsContent';
import JsonLd from '@/components/JsonLd';
import { organizationSchema, breadcrumbSchema } from '@/lib/schema';

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://careerpathsim.com';

export const metadata: Metadata = {
  title: 'Условия использования — Career Path Simulator',
  description: 'Условия использования Career Path Simulator от PrepCraft LTD (номер компании 17249290).',
  alternates: {
    canonical: `${siteUrl}/ru/terms`,
    languages: {
      en: `${siteUrl}/terms`,
      ru: `${siteUrl}/ru/terms`,
    },
  },
};

export default function RuTermsPage() {
  return (
    <>
      <JsonLd data={organizationSchema()} />
      <JsonLd data={breadcrumbSchema([
        { name: 'Главная', url: '/ru' },
        { name: 'Условия использования', url: '/ru/terms' },
      ])} />
      <SetRuLang>
        <TermsContent />
      </SetRuLang>
    </>
  );
}
