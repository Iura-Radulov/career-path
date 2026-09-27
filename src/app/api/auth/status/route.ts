import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

export async function GET() {
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ authenticated: false, user: null });
  }

  // Never ship credential material or payment identifiers to the client.
  const safe = { ...(user as unknown as Record<string, unknown>) };
  delete safe.password_hash;
  delete safe.stripe_customer_id;
  delete safe.stripe_subscription_id;

  return NextResponse.json({ authenticated: true, user: safe });
}
