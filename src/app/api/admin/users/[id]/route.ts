import { NextRequest, NextResponse } from 'next/server';
import { getUserById, getUserAnalyses, getUserQuizResults, deleteUser, getUserSubscriptionInfo } from '@/lib/db';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const user = getUserById(Number(id));
    if (!user) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    const analyses = getUserAnalyses(Number(id));
    const quizResults = getUserQuizResults(Number(id));
    const subscription = getUserSubscriptionInfo(Number(id));
    return NextResponse.json({ user, analyses, quizResults, analysesCount: analyses.length, subscription });
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    deleteUser(Number(id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete user error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
