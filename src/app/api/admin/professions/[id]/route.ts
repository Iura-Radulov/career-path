import { NextRequest, NextResponse } from 'next/server';
import { getProfessionById, updateProfession, deleteProfession, type ProfessionData } from '@/lib/db';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const profession = getProfessionById(Number(id));
    if (!profession) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json(profession);
  } catch (error) {
    console.error('Get profession error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body: Partial<ProfessionData> = await request.json();
    const profession = updateProfession(Number(id), body);
    if (!profession) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json(profession);
  } catch (error) {
    console.error('Update profession error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    deleteProfession(Number(id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete profession error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
