import { NextRequest, NextResponse } from 'next/server';
import { getUserByUsername, updatePasswordHash } from '@/lib/db';
import { createSession } from '@/lib/auth';
import crypto from 'crypto';

interface LoginBody {
  username: string;
  password: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: LoginBody = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password required' }, { status: 400 });
    }

    const user = getUserByUsername(username);
    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    if (user.role !== 'admin') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Verify password
    if (!user.password_hash) {
      return NextResponse.json({ error: 'No password set for this account' }, { status: 401 });
    }

    const [salt, storedHash] = user.password_hash.split(':');
    const inputHash = crypto.scryptSync(password, salt, 64).toString('hex');

    if (inputHash !== storedHash) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    await createSession(user.id, user.telegram_id!, 'admin');

    return NextResponse.json({ success: true, user: { id: user.id, username: user.username, role: user.role } });
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
