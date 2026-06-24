import { NextRequest, NextResponse } from 'next/server';
import { getAllSubscriptions, getSubscriptionsCount, cancelSubscriptionById } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');
    const status = searchParams.get('status') || undefined;

    const subscriptions = getAllSubscriptions(limit, offset, status);
    const total = getSubscriptionsCount(status);

    return NextResponse.json({ subscriptions, total });
  } catch (error) {
    console.error('Get subscriptions error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, subscription_id } = await request.json();
    if (action === 'cancel' && subscription_id) {
      cancelSubscriptionById(subscription_id);
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Subscriptions action error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
