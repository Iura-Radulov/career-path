import { NextRequest, NextResponse } from 'next/server';
import { getAllPricingPlans, createPricingPlan, type PricingPlanData } from '@/lib/db';

export async function GET() {
  try {
    const plans = getAllPricingPlans();
    return NextResponse.json(plans);
  } catch (error) {
    console.error('Get pricing plans error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: PricingPlanData = await request.json();
    const plan = createPricingPlan(body);
    return NextResponse.json(plan, { status: 201 });
  } catch (error) {
    console.error('Create pricing plan error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
