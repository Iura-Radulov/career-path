import { NextResponse } from 'next/server';
import { getDbInfo } from '@/lib/db';

export async function GET() {
  try {
    const dbInfo = getDbInfo();
    return NextResponse.json({
      apiOk: true,
      dbSize: dbInfo.size,
      dbTables: dbInfo.tables,
      jwtSecretSet: !!process.env.JWT_SECRET,
      nodeEnv: process.env.NODE_ENV || 'development',
    });
  } catch (error) {
    console.error('Settings error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
