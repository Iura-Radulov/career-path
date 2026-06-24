import { NextResponse } from 'next/server';
import { getUserStats, getQuizStats, getTotalAnalyses, getAllProfessions } from '@/lib/db';

export async function GET() {
  try {
    const userStats = getUserStats();
    const quizStats = getQuizStats();
    const totalAnalyses = getTotalAnalyses();
    const professions = getAllProfessions();

    return NextResponse.json({
      totalUsers: userStats.totalUsers,
      newUsersThisWeek: userStats.newUsersThisWeek,
      totalAnalyses,
      totalQuizzes: quizStats.totalQuizzes,
      avgQuizScore: quizStats.avgQuizScore,
      totalProfessions: professions.length,
    });
  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
