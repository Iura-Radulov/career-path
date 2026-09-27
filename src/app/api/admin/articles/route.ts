import { NextRequest, NextResponse } from 'next/server';
import { getAllArticles, createArticle, type ArticleData } from '@/lib/db';

export async function GET() {
  try {
    const articles = getAllArticles();
    return NextResponse.json(articles);
  } catch (error) {
    console.error('Get articles error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: ArticleData = await request.json();
    const article = createArticle(body);
    return NextResponse.json(article, { status: 201 });
  } catch (error) {
    console.error('Create article error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
