import { NextRequest, NextResponse } from 'next/server';
import { getAllProfessions, getHomePageProfessions, createProfession, type ProfessionData } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const homeOnly = searchParams.get('home') === '1';
    const professions = homeOnly ? getHomePageProfessions() : getAllProfessions();
    return NextResponse.json(professions);
  } catch (error) {
    console.error('Get professions error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: ProfessionData = await request.json();
    const profession = createProfession(body);
    return NextResponse.json(profession, { status: 201 });
  } catch (error) {
    console.error('Create profession error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
