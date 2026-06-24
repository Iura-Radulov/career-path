import { NextRequest, NextResponse } from 'next/server';
import { getUserByTelegramId, createUser } from '@/lib/db';
import { createSession } from '@/lib/auth';

interface LoginBody {
  telegram_id: number;
  username?: string;
  first_name?: string;
  language_code?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: LoginBody = await request.json();
    const { telegram_id, username, first_name, language_code } = body;

    if (!telegram_id) {
      return NextResponse.json({ error: 'telegram_id required' }, { status: 400 });
    }

    let user = getUserByTelegramId(telegram_id);
    if (!user) {
      user = createUser(telegram_id, username ?? null, first_name ?? null, language_code ?? 'en');
    }

    await createSession(user.id, telegram_id);

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
