import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { getUserByTelegramId, type User } from './db';

const COOKIE_NAME = 'admin_session';
const SESSION_DURATION = 60 * 60 * 24 * 7; // 7 days in seconds

function getSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET || 'career-path-default-secret-change-in-production';
  return new TextEncoder().encode(secret);
}

export interface SessionPayload {
  userId: number;
  telegramId: number;
}

export async function createSession(userId: number, telegramId: number): Promise<void> {
  const token = await new SignJWT({ userId, telegramId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION}s`)
    .sign(getSecret());

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_DURATION,
    path: '/',
  });
}

export async function getSession(): Promise<User | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;

    const { payload } = await jwtVerify(token, getSecret());
    const { telegramId } = payload as unknown as SessionPayload;
    if (!telegramId) return null;

    return getUserByTelegramId(telegramId);
  } catch {
    return null;
  }
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
