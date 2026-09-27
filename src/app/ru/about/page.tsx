import type { Metadata } from 'next';
import SetRuLang from '@/components/SetRuLang';
import AboutContent from '@/app/about/AboutContent';
import JsonLd from '@/components/JsonLd';
import { organizationSchema, breadcrumbSchema } from '@/lib/schema';

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://careerpathsim.com';

export const metadata: Metadata = {
  title: 'О Career Path Simulator — AI-профориентация',
  description: 'AI-профориентация для студентов и молодых специалистов. Узнайте о нашей миссии и том, как Career Path Simulator помогает найти призвание.',
  alternates: {
    canonical: `${siteUrl}/ru/about`,
    languages: {
      en: `${siteUrl}/about`,
      ru: `${siteUrl}/ru/about`,
    },
  },
};

export default function RuAboutPage() {
  return (
    <>
      <JsonLd data={organizationSchema()} />
      <JsonLd data={breadcrumbSchema([
        { name: 'Главная', url: '/ru' },
        { name: 'О нас', url: '/ru/about' },
      ])} />
      <SetRuLang>
        <AboutContent />
      </SetRuLang>
    </>
  );
}
