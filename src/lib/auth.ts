import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { getUserByTelegramId, type User } from './db';

const COOKIE_NAME = 'admin_session';
const SESSION_DURATION = 60 * 60 * 24 * 7; // 7 days in seconds

export type SessionRole = 'admin' | 'user';

/**
 * Return the HMAC signing key.
 *
 * Deliberately FAILS CLOSED: there is no hardcoded fallback. A fallback secret
 * that lives in the repo lets anyone forge a session for any account — which is
 * exactly what happened with 'career-path-default-secret-change-in-production'.
 */
function getSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not set — refusing to use an insecure default secret');
  }
  return new TextEncoder().encode(secret);
}

export interface SessionPayload {
  userId: number;
  telegramId: number;
  role: SessionRole;
}

export async function createSession(
  userId: number,
  telegramId: number,
  role: SessionRole = 'user',
): Promise<void> {
  const token = await new SignJWT({ userId, telegramId, role })
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

/**
 * Resolve the session and the backing user.
 *
 * `requiredRole` lets callers demand admin. Note: the role is taken from the
 * signed token, so it cannot be escalated by editing the cookie.
 */
export async function getSession(requiredRole?: SessionRole): Promise<User | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;

    const { payload } = await jwtVerify(token, getSecret());
    const { telegramId, role } = payload as unknown as SessionPayload;
    if (!telegramId) return null;
    if (requiredRole && role !== requiredRole) return null;

    return getUserByTelegramId(telegramId);
  } catch {
    return null;
  }
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
