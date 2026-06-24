import { NextRequest, NextResponse } from 'next/server';
import { getPricingPlanById, updatePricingPlan, deletePricingPlan, type PricingPlanData } from '@/lib/db';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const plan = getPricingPlanById(Number(id));
    if (!plan) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json(plan);
  } catch (error) {
    console.error('Get pricing plan error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body: Partial<PricingPlanData> = await request.json();
    const plan = updatePricingPlan(Number(id), body);
    if (!plan) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json(plan);
  } catch (error) {
    console.error('Update pricing plan error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    deletePricingPlan(Number(id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete pricing plan error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
