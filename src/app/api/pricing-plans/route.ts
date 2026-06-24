import { NextResponse } from 'next/server';
import { getActivePricingPlans } from '@/lib/db';

export async function GET() {
  try {
    const plans = getActivePricingPlans();
    return NextResponse.json(plans);
  } catch (error) {
    console.error('Get active pricing plans error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
