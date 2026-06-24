import { NextRequest, NextResponse } from 'next/server';
import { getUserById, getAllPricingPlans, updateUserSubscriptionPlan } from '@/lib/db';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const userId = parseInt(id);
    const user = getUserById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { plan_id, end_date } = await request.json();

    if (plan_id !== null) {
      const plans = getAllPricingPlans();
      const plan = plans.find((p) => p.id === plan_id);
      if (!plan) {
        return NextResponse.json({ error: 'Plan not found' }, { status: 400 });
      }
    }

    updateUserSubscriptionPlan(userId, plan_id, end_date || undefined);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update user subscription error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
