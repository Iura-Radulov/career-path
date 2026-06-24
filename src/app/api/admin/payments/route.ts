import { NextRequest, NextResponse } from 'next/server';
import { getAllPayments, getPaymentsCount } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    const payments = getAllPayments(limit, offset);
    const total = getPaymentsCount();

    return NextResponse.json({ payments, total });
  } catch (error) {
    console.error('Get payments error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
