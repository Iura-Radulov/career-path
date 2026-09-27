import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(request: NextRequest) {
  const db = getDb();
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');

  let platforms;
  if (category) {
    const search = `"${category}"`;
    platforms = db
      .prepare("SELECT * FROM platforms WHERE is_active = 1 AND INSTR(category, ?) > 0 ORDER BY sort_order ASC, id ASC")
      .all(search);
  } else {
    platforms = db.prepare('SELECT * FROM platforms ORDER BY is_active DESC, sort_order ASC, id ASC').all();
  }
  return NextResponse.json({ platforms });
}

export async function POST(request: NextRequest) {
  const db = getDb();
  try {
    const body = await request.json();

    if (!body.slug || !body.name_ru) {
      return NextResponse.json({ detail: 'slug и name_ru обязательны' }, { status: 400 });
    }

    const slug = body.slug.toLowerCase().replace(/[^a-z0-9-]/g, '');
    const existing = db.prepare('SELECT id FROM platforms WHERE slug = ?').get(slug);
    if (existing) {
      return NextResponse.json({ detail: 'platform with this slug already exists' }, { status: 400 });
    }

    const platform = db.prepare(`
      INSERT INTO platforms (slug, name_ru, name_en, description_ru, description_en,
        logo_url, website_url, affiliate_url, commission_rate, category, is_active, sort_order)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      RETURNING *
    `).get(
      slug,
      body.name_ru || body.name_en,
      body.name_en || body.name_ru,
      body.description_ru || null,
      body.description_en || null,
      body.logo_url || null,
      body.website_url || null,
      body.affiliate_url || null,
      body.commission_rate || null,
      body.category || 'coding',
      body.is_active ?? 1,
      body.sort_order ?? 0,
    );

    return NextResponse.json(platform);
  } catch (e) {
    return NextResponse.json({ detail: String(e) }, { status: 500 });
  }
}
