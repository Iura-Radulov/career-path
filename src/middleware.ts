import { NextResponse, NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const RU_LOCALES = [
  'ru', 'ru-RU', 'ru-UA', 'ru-KZ', 'ru-BY', 'ru-UZ',
  'be', 'uk', 'kk', 'ky', 'uz', 'tg', 'tk',
  'be-BY', 'uk-UA', 'kk-KZ', 'ky-KG', 'uz-UZ', 'tg-TJ',
];

const COOKIE_NAME = 'user_locale';

// ── Admin session guard ───────────────────────────────────────────────────────
const ADMIN_COOKIE = 'admin_session';
const ADMIN_LOGIN_PATH = '/admin/login';

/**
 * Verify the admin session cookie.
 *
 * Middleware runs on the Edge runtime and cannot touch SQLite, so this checks
 * the signed token only — requiring the `role: 'admin'` claim, which is set
 * exclusively by /api/auth/admin-login after a password check against a user
 * whose DB role is 'admin'. The Telegram login path always issues role 'user',
 * so a normal (or forged) user session can never reach the admin surface.
 */
async function hasAdminSession(request: NextRequest): Promise<boolean> {
  const secret = process.env.JWT_SECRET;
  if (!secret) return false; // fail closed
  const token = request.cookies.get(ADMIN_COOKIE)?.value;
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
    return (payload as { role?: string }).role === 'admin';
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── Admin surface: require a valid admin session ───────────────────────────
  const isAdminApi = pathname === '/api/admin' || pathname.startsWith('/api/admin/');
  const isAdminPage =
    (pathname === '/admin' || pathname.startsWith('/admin/')) && pathname !== ADMIN_LOGIN_PATH;

  if (isAdminApi || isAdminPage) {
    if (!(await hasAdminSession(request))) {
      if (isAdminApi) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      return NextResponse.redirect(new URL(ADMIN_LOGIN_PATH, request.url));
    }
    return NextResponse.next();
  }

  // Skip non-page routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/icon') ||
    pathname.startsWith('/apple-icon') ||
    pathname.startsWith('/logo') ||
    pathname.match(/\.(ico|svg|png|jpg|jpeg|gif|webp|woff2?|css|js)$/)
  ) {
    return NextResponse.next();
  }

  // If already on a locale path, just remember it
  if (pathname === '/ru' || pathname.startsWith('/ru/')) {
    const response = NextResponse.next();
    response.cookies.set(COOKIE_NAME, 'ru', {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
      sameSite: 'lax',
    });
    return response;
  }

  // If on English path, remember it
  if (pathname === '/' || pathname.startsWith('/en') || pathname.startsWith('/en/')) {
    const response = NextResponse.next();
    response.cookies.set(COOKIE_NAME, 'en', {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
      sameSite: 'lax',
    });
    return response;
  }

  // Root path (/): check Accept-Language for redirect
  const acceptLang = request.headers.get('Accept-Language') || '';
  const cookiePref = request.cookies.get(COOKIE_NAME)?.value;

  // If user has a saved preference, respect it
  if (cookiePref === 'en') {
    return NextResponse.next();
  }
  if (cookiePref === 'ru') {
    return NextResponse.redirect(new URL('/ru', request.url));
  }

  // No cookie: detect from Accept-Language header
  const prefersRussian = RU_LOCALES.some((locale) =>
    acceptLang.toLowerCase().startsWith(locale.toLowerCase()) ||
    acceptLang.toLowerCase().includes(locale.toLowerCase())
  );

  if (prefersRussian) {
    const url = new URL('/ru', request.url);
    url.search = request.nextUrl.search;
    const response = NextResponse.redirect(url);
    response.cookies.set(COOKIE_NAME, 'ru', {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
      sameSite: 'lax',
    });
    return response;
  }

  // Save English preference
  const response = NextResponse.next();
  response.cookies.set(COOKIE_NAME, 'en', {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
  });
  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image).*)'],
};
