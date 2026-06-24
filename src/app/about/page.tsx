import type { Metadata } from 'next';
import AboutContent from './AboutContent';
import JsonLd from '@/components/JsonLd';
import { organizationSchema, breadcrumbSchema } from '@/lib/schema';

export const metadata: Metadata = {
  title: 'About Career Path Simulator',
  description: 'AI-powered career guidance for students and young professionals. Learn about our mission and how Career Path Simulator works.',
};

export default function AboutPage() {
  return (
    <>
      <JsonLd data={organizationSchema()} />
      <JsonLd data={breadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: 'About', url: '/about' },
      ])} />
      <AboutContent />
    </>
  );
}
