import type { Metadata } from 'next';
import PrivacyContent from './PrivacyContent';
import JsonLd from '@/components/JsonLd';
import { organizationSchema, breadcrumbSchema } from '@/lib/schema';

export const metadata: Metadata = {
  title: 'Privacy Policy — Career Path Simulator',
  description: 'Privacy Policy for Career Path Simulator by PrepCraft LTD. Learn how we collect, use, and protect your data.',
};

export default function PrivacyPage() {
  return (
    <>
      <JsonLd data={organizationSchema()} />
      <JsonLd data={breadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: 'Privacy Policy', url: '/privacy' },
      ])} />
      <PrivacyContent />
    </>
  );
}
