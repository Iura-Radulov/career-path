import { getDb } from '@/lib/db';

export async function GET() {
  try {
    const db = getDb();
    const users = db.prepare(`
      SELECT u.*,
             p.name as plan_name, p.slug as plan_slug,
             u.subscription_status
      FROM users u
      LEFT JOIN pricing_plans p ON p.id = u.subscription_plan_id
      ORDER BY u.created_at DESC
    `).all();
    return Response.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
