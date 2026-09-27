import type { MetadataRoute } from 'next';
import { getPublishedArticles } from '@/lib/db';

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://careerpathsim.com';

const professionSlugs = [
  'software-dev', 'doctor', 'designer', 'engineer',
  'marketer', 'analyst', 'energy', 'creator',
];

const ruProfessionNames: Record<string, string> = {
  'software-dev': 'razrabotchik-po',
  'doctor': 'vrach',
  'designer': 'ux-ui-dizayner',
  'engineer': 'inzhener',
  'marketer': 'digital-marketolog',
  'analyst': 'analitik-data-scientist',
  'energy': 'viye-spetsialist',
  'creator': 'kontent-kriyeytor',
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = getPublishedArticles();

  const staticPages = [
    { path: '', priority: 1.0, changeFrequency: 'weekly' as const },
    { path: '/blog', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/about', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/professions', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/pricing', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/privacy', priority: 0.3, changeFrequency: 'yearly' as const },
    { path: '/terms', priority: 0.3, changeFrequency: 'yearly' as const },
  ];

  const ruStaticPages = [
    { path: '/ru', priority: 1.0, changeFrequency: 'weekly' as const },
    { path: '/ru/blog', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/ru/about', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/ru/professions', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/ru/pricing', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/ru/privacy', priority: 0.3, changeFrequency: 'yearly' as const },
    { path: '/ru/terms', priority: 0.3, changeFrequency: 'yearly' as const },
  ];

  const entries: MetadataRoute.Sitemap = [
    // English static pages
    ...staticPages.map(({ path, priority, changeFrequency }) => ({
      url: `${siteUrl}${path}`,
      lastModified: new Date(),
      changeFrequency,
      priority,
    })),
    // English profession pages
    ...professionSlugs.map((slug) => ({
      url: `${siteUrl}/professions/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
    // English blog article pages
    ...articles.map((article: { slug: string; updated_at?: string }) => ({
      url: `${siteUrl}/blog/${article.slug}`,
      lastModified: article.updated_at ? new Date(article.updated_at) : new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),

    // Russian static pages
    ...ruStaticPages.map(({ path, priority, changeFrequency }) => ({
      url: `${siteUrl}${path}`,
      lastModified: new Date(),
      changeFrequency,
      priority,
    })),
    // Russian profession pages
    ...professionSlugs.map((slug) => ({
      url: `${siteUrl}/ru/professions/${ruProfessionNames[slug] || slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
    // Russian blog article pages
    ...articles.map((article: { slug: string; updated_at?: string }) => ({
      url: `${siteUrl}/ru/blog/${article.slug}`,
      lastModified: article.updated_at ? new Date(article.updated_at) : new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ];

  return entries;
}
