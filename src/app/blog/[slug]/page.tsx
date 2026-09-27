import type { Metadata } from 'next';
import BlogArticleContent from './BlogArticleView';
import { getArticleBySlug } from '@/lib/db';
import JsonLd from '@/components/JsonLd';
import { breadcrumbSchema, articleSchema } from '@/lib/schema';

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://careerpathsim.com';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (article && article.is_published) {
    return { title: `${article.title_en} — Career Path Simulator` };
  }
  return { title: 'Blog — Career Path Simulator' };
}

export default async function BlogArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  return (
    <>
      {article && article.is_published && (
        <>
          <JsonLd data={breadcrumbSchema([
            { name: 'Home', url: '/' },
            { name: 'Blog', url: '/blog' },
            { name: article.title_en, url: `/blog/${slug}` },
          ])} />
          <JsonLd data={articleSchema({
            headline: article.title_en,
            description: article.excerpt_en || '',
            author: article.author,
            datePublished: article.published_at || article.created_at,
            dateModified: article.updated_at,
            image: article.image_url,
            url: `${siteUrl}/blog/${slug}`,
          })} />
        </>
      )}
      <BlogArticleContent slug={slug} />
    </>
  );
}
