import type { Metadata } from 'next';
import ProfessionsContent from './ProfessionsContent';
import JsonLd from '@/components/JsonLd';
import { organizationSchema, breadcrumbSchema } from '@/lib/schema';

export const metadata: Metadata = {
  title: 'Explore 8 Professions',
  description: 'Explore 8 professions with AI-powered compatibility tests, interactive roleplay, and personalized roadmaps. Find your ideal career.',
};

export default function ProfessionsPage() {
  return (
    <>
      <JsonLd data={organizationSchema()} />
      <JsonLd data={breadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: 'Professions', url: '/professions' },
      ])} />
      <ProfessionsContent />
    </>
  );
}
