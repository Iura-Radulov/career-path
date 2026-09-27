import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import Stripe from 'stripe';

function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error('STRIPE_SECRET_KEY not configured');
  return new Stripe(key);
}

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature') || '';
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

  let stripe: Stripe;
  try {
    stripe = getStripe();
  } catch {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error('Webhook signature verification:', err.message);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const db = getDb();

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = parseInt(session.metadata?.user_id || '0');
        const telegramId = parseInt(session.metadata?.telegram_id || '0');
        const planId = parseInt(session.metadata?.plan_id || '0');
        const subscriptionId = session.subscription as string;

        if (!planId) break;

        // Find user by telegram_id or user_id
        let user: Record<string, unknown> | undefined;
        if (telegramId) {
          user = db.prepare('SELECT id FROM users WHERE telegram_id = ?').get(telegramId) as Record<string, unknown> | undefined;
        }
        if (!user && userId) {
          user = db.prepare('SELECT id FROM users WHERE id = ?').get(userId) as Record<string, unknown> | undefined;
        }
        if (!user) {
          // Create user if doesn't exist
          const result = db.prepare("INSERT INTO users (telegram_id, role) VALUES (?, 'user')").run(telegramId || null) as Record<string, unknown>;
          user = { id: result.lastInsertRowid };
        }

        const actualUserId = user.id as number;
        const plan = db.prepare('SELECT * FROM pricing_plans WHERE id = ?').get(planId) as Record<string, unknown> | undefined;
        if (!plan) break;

        // Update user subscription status
        db.prepare(`
          UPDATE users SET
            stripe_subscription_id = ?,
            subscription_status = 'active',
            subscription_plan_id = ?,
            updated_at = datetime('now')
          WHERE id = ?
        `).run(subscriptionId || '', planId, actualUserId);

        // Calculate end date based on interval
        let endDate: string | null = null;
        if (plan.interval === 'month') {
          endDate = (db.prepare("SELECT datetime('now', '+1 month') as d").get() as { d: string }).d;
        } else if (plan.interval === 'year') {
          endDate = (db.prepare("SELECT datetime('now', '+1 year') as d").get() as { d: string }).d;
        }

        // Check for existing active subscription to extend
        const existingActive = db.prepare(
          "SELECT id, end_date FROM subscriptions WHERE user_id = ? AND status = 'active' AND end_date > datetime('now') ORDER BY end_date DESC LIMIT 1"
        ).get(actualUserId) as { id: number; end_date: string } | undefined;

        if (existingActive && endDate) {
          db.prepare(
            "UPDATE subscriptions SET end_date = datetime(end_date, '+1 month'), updated_at = datetime('now') WHERE id = ?"
          ).run(existingActive.id);
          // Also update users table
          const newEnd = (db.prepare("SELECT end_date FROM subscriptions WHERE id = ?").get(existingActive.id) as { end_date: string }).end_date;
          db.prepare("UPDATE users SET subscription_end_date = ?, subscription_plan_id = ?, updated_at = datetime('now') WHERE id = ?").run(newEnd, planId, actualUserId);
        } else {
          db.prepare(`
            INSERT INTO subscriptions (user_id, plan_id, stripe_subscription_id, status, start_date, end_date, created_at, updated_at)
            VALUES (?, ?, ?, 'active', datetime('now'), ?, datetime('now'), datetime('now'))
          `).run(actualUserId, planId, subscriptionId || '', endDate);
          // Also update users table
          db.prepare("UPDATE users SET subscription_start_date = datetime('now'), subscription_end_date = ?, subscription_plan_id = ?, updated_at = datetime('now') WHERE id = ?").run(endDate, planId, actualUserId);
        }

        // Record payment
        db.prepare(`
          INSERT INTO payments (user_id, plan_id, amount, currency, status, payment_method, payment_id, paid_at, created_at, updated_at)
          VALUES (?, ?, ?, 'USD', 'completed', 'stripe', ?, datetime('now'), datetime('now'), datetime('now'))
        `).run(actualUserId, planId, plan.price, session.payment_intent || session.id);

        console.log(`Subscription activated: user=${actualUserId}, plan=${planId}`);
        break;
      }

      case 'customer.subscription.deleted':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        const user = db.prepare('SELECT id FROM users WHERE stripe_customer_id = ?').get(customerId) as Record<string, unknown> | undefined;
        if (!user) break;

        if (subscription.status === 'canceled' || subscription.status === 'past_due' || subscription.status === 'unpaid') {
          db.prepare("UPDATE users SET subscription_status = 'free', stripe_subscription_id = NULL WHERE id = ?").run(user.id);
          db.prepare("UPDATE subscriptions SET status = 'cancelled' WHERE user_id = ? AND status = 'active'").run(user.id);
        } else if (subscription.status === 'active' && !subscription.cancel_at_period_end) {
          db.prepare("UPDATE users SET subscription_status = 'active' WHERE id = ?").run(user.id);
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        console.error(`Payment failed for customer ${invoice.customer}: ${invoice.amount_due}`);
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error('Webhook handler error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
