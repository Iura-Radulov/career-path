import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const db = getDb();
  try {
    const { id } = await params;
    const body = await request.json();
    const platformId = parseInt(id, 10);

    const existing = db.prepare('SELECT * FROM platforms WHERE id = ?').get(platformId) as Record<string, unknown> | undefined;
    if (!existing) {
      return NextResponse.json({ detail: 'Platform not found' }, { status: 404 });
    }

    const allowed = ['slug', 'name_ru', 'name_en', 'description_ru', 'description_en',
      'logo_url', 'website_url', 'affiliate_url', 'commission_rate', 'category', 'is_active', 'sort_order'];

    const updates: string[] = [];
    const values: unknown[] = [];
    for (const key of allowed) {
      if (body[key] !== undefined) {
        updates.push(`${key} = ?`);
        values.push(body[key]);
      }
    }

    if (updates.length === 0) {
      return NextResponse.json({ detail: 'No fields to update' }, { status: 400 });
    }

    updates.push("updated_at = datetime('now')");

    const platform = db.prepare(`UPDATE platforms SET ${updates.join(', ')} WHERE id = ? RETURNING *`)
      .get(...values, platformId);

    return NextResponse.json(platform);
  } catch (e) {
    return NextResponse.json({ detail: String(e) }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const db = getDb();
  try {
    const { id } = await params;
    const platformId = parseInt(id, 10);

    const existing = db.prepare('SELECT id FROM platforms WHERE id = ?').get(platformId);
    if (!existing) {
      return NextResponse.json({ detail: 'Platform not found' }, { status: 404 });
    }

    db.prepare("DELETE FROM platforms WHERE id = ?").run(platformId);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ detail: String(e) }, { status: 500 });
  }
}
