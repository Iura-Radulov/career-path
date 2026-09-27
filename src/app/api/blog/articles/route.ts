import { NextRequest, NextResponse } from 'next/server';
import { getPublishedArticles, getArticlesByCategory, getArticleBySlug } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    const category = searchParams.get('category');
    const limit = searchParams.get('limit');

    if (slug) {
      const article = getArticleBySlug(slug);
      if (!article || !article.is_published) {
        return NextResponse.json(null);
      }
      return NextResponse.json(article);
    }

    let articles = category ? getArticlesByCategory(category) : getPublishedArticles();

    if (limit) {
      const n = parseInt(limit, 10);
      if (!isNaN(n) && n > 0) {
        articles = articles.slice(0, n);
      }
    }

    const public_articles = articles.map((a) => ({
      id: a.id,
      slug: a.slug,
      title_en: a.title_en,
      title_ru: a.title_ru,
      excerpt_en: a.excerpt_en,
      excerpt_ru: a.excerpt_ru,
      image_url: a.image_url,
      category: a.category,
      author: a.author,
      published_at: a.published_at,
    }));
    return NextResponse.json(public_articles);
  } catch (error) {
    console.error('Get public articles error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
