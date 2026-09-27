import type { Metadata } from 'next';
import SetRuLang from '@/components/SetRuLang';
import BlogContent from '@/app/blog/BlogListView';
import JsonLd from '@/components/JsonLd';
import { organizationSchema, breadcrumbSchema } from '@/lib/schema';

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://careerpathsim.com';

export const metadata: Metadata = {
  title: 'Блог о карьере — Career Path Simulator',
  description: 'Статьи о выборе профессии, профессиональном росте и инсайтах из индустрии.',
  alternates: {
    canonical: `${siteUrl}/ru/blog`,
    languages: { en: `${siteUrl}/blog`, ru: `${siteUrl}/ru/blog` },
  },
};

export default function RuBlogPage() {
  // force-rebuild v4
  return (
    <>
      <JsonLd data={organizationSchema()} />
      <JsonLd data={breadcrumbSchema([{ name: 'Главная', url: '/ru' }, { name: 'Блог', url: '/ru/blog' }])} />
      <SetRuLang>
        <BlogContent />
      </SetRuLang>
    </>
  );
}
