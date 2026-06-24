import { NextRequest, NextResponse } from 'next/server';
import { getProfessionBySlug } from '@/lib/db';

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params;
    const profession = getProfessionBySlug(slug);
    if (!profession) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json(profession);
  } catch (error) {
    console.error('Get profession by slug error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
