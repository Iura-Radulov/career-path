import { NextRequest, NextResponse } from 'next/server';
import { getRecentAnalysesPaginated, getAnalysesCount } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));
    const userIdParam = searchParams.get('user_id');
    const userId = userIdParam ? parseInt(userIdParam, 10) : undefined;
    const offset = (page - 1) * limit;

    const rows = getRecentAnalysesPaginated(limit, offset, userId);
    const total = getAnalysesCount(userId);

    return NextResponse.json({ rows, total, page, limit });
  } catch (error) {
    console.error('Get analyses error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
