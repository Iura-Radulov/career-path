import type { Metadata } from 'next';
import TermsContent from './TermsContent';
import JsonLd from '@/components/JsonLd';
import { organizationSchema, breadcrumbSchema } from '@/lib/schema';

export const metadata: Metadata = {
  title: 'Terms of Service — Career Path Simulator',
  description: 'Terms of Service for Career Path Simulator, operated by PrepCraft LTD (Company No. 17249290).',
};

export default function TermsPage() {
  return (
    <>
      <JsonLd data={organizationSchema()} />
      <JsonLd data={breadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: 'Terms of Service', url: '/terms' },
      ])} />
      <TermsContent />
    </>
  );
}
