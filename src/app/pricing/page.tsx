import type { Metadata } from 'next';
import PricingContent from './PricingContent';
import JsonLd from '@/components/JsonLd';
import { organizationSchema, breadcrumbSchema } from '@/lib/schema';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Pricing — Career Path Simulator',
  description: 'Start free with 1 profession test. Upgrade to Premium for all 8 professions, unlimited AI roleplay, and personalized career roadmaps.',
};

export default function PricingPage() {
  return (
    <>
      <JsonLd data={organizationSchema()} />
      <JsonLd data={breadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: 'Pricing', url: '/pricing' },
      ])} />
      <PricingContent />
    </>
  );
}
