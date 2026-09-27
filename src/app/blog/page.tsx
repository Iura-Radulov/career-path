import type { Metadata } from 'next';
import BlogContent from './BlogListView';
import JsonLd from '@/components/JsonLd';
import { breadcrumbSchema } from '@/lib/schema';

export const metadata: Metadata = {
  title: 'Blog — Career Path Simulator',
  description: 'Articles about career choices, professional growth, and industry insights.',
};

export default function BlogPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: 'Blog', url: '/blog' },
      ])} />
      <BlogContent />
    </>
  );
}
