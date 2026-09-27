import type { Metadata } from 'next';
import SetRuLang from '@/components/SetRuLang';
import BlogArticleContent from '@/app/blog/[slug]/BlogArticleView';
import JsonLd from '@/components/JsonLd';
import { organizationSchema, breadcrumbSchema, articleSchema } from '@/lib/schema';
import { getArticleBySlug } from '@/lib/db';

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://careerpathsim.com';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  const ruTitle = article?.title_ru || `Статья: ${slug}`;
  return {
    title: `${ruTitle} — Career Path Simulator`,
    description: article?.excerpt_ru || 'Читайте статьи о карьере и профессиональном росте.',
    alternates: {
      canonical: `${siteUrl}/ru/blog/${slug}`,
      languages: { en: `${siteUrl}/blog/${slug}`, ru: `${siteUrl}/ru/blog/${slug}` },
    },
  };
}

export default async function RuBlogArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  return (
    <>
      <JsonLd data={organizationSchema()} />
      <JsonLd data={breadcrumbSchema([
        { name: 'Главная', url: '/ru' },
        { name: 'Блог', url: '/ru/blog' },
        { name: article?.title_ru || slug, url: `/ru/blog/${slug}` },
      ])} />
      {article && article.is_published && (
        <JsonLd data={articleSchema({
          headline: article.title_ru,
          description: article.excerpt_ru || '',
          author: article.author,
          datePublished: article.published_at || article.created_at,
          dateModified: article.updated_at,
          image: article.image_url,
          url: `${siteUrl}/ru/blog/${slug}`,
        })} />
      )}
      <SetRuLang>
        <BlogArticleContent slug={slug} />
      </SetRuLang>
    </>
  );
}
