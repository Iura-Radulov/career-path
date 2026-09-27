import type { Metadata } from 'next';
import SetRuLang from '@/components/SetRuLang';
import ProfessionsContent from '@/app/professions/ProfessionsContent';
import JsonLd from '@/components/JsonLd';
import { organizationSchema, breadcrumbSchema } from '@/lib/schema';

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://careerpathsim.com';

export const metadata: Metadata = {
  title: '16 профессий — Career Path Simulator',
  description: 'Исследуй 16 профессий с AI-тестами совместимости, ролевыми играми и персональными планами развития. Найди свою идеальную карьеру.',
  alternates: {
    canonical: `${siteUrl}/ru/professions`,
    languages: {
      en: `${siteUrl}/professions`,
      ru: `${siteUrl}/ru/professions`,
    },
  },
};

export default function RuProfessionsPage() {
  return (
    <>
      <JsonLd data={organizationSchema()} />
      <JsonLd data={breadcrumbSchema([
        { name: 'Главная', url: '/ru' },
        { name: 'Профессии', url: '/ru/professions' },
      ])} />
      <SetRuLang>
        <ProfessionsContent />
      </SetRuLang>
    </>
  );
}
