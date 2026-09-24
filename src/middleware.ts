import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { DEMO_ADMIN_ACCESS_TOKEN, PermissionItem } from '@/utils/cookieConstants';

function parseCookies(cookieHeader: string | null): Map<string, string> {
  const cookieMap = new Map();
  if (cookieHeader) {
    cookieHeader.split(';').forEach(cookie => {
      const [name, value] = cookie.trim().split('=');
      if (name && value) cookieMap.set(name.trim(), value.trim());
    });
  }
  return cookieMap;
}

async function fetchPermissionsFromAPI(request: NextRequest): Promise<PermissionItem[]> {
  try {
    const host = request.headers.get('x-forwarded-host') || request.headers.get('host');
    const protocol = request.headers.get('x-forwarded-proto') || 'https';
    const apiUrl = `${protocol}://${host}/api/auth/get-permissions`;

    const headers: Record<string, string> = {
      Cookie: request.headers.get('cookie') || '',
      'Content-Type': 'application/json',
      'User-Agent': 'NextJS-Middleware-Internal',
      'X-Internal-Request': 'middleware',
      'X-Forwarded-For': request.headers.get('x-forwarded-for') || '',
      'X-Forwarded-Proto': protocol,
      'X-Forwarded-Host': host || '',
      Origin: `${protocol}://${host}`,
    };

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers,
      cache: 'no-store',
    });

    if (!response.ok) {
      return [];
    }
    const data = await response.json();
    if (data.success && data.permissions) return data.permissions;
    return [];
  } catch (err) {
    return [];
  }
}


function hasRoutePermission(pathname: string, permissions: PermissionItem[]): boolean {
  
  const normalize = (path: string) => (path || '').replace(/\/$/, '').toLowerCase();
  const normalizedPath = normalize(pathname);
  const isPublicRoute = ['/auth', '/not-permitted', '/404', '/not-found', '/favicon.ico','/logo', '/Logo', '/Asset', '/public']
    .some(route => normalizedPath.startsWith(normalize(route)));
  if (isPublicRoute || normalizedPath.startsWith('/_next') || normalizedPath.startsWith('/api')) return true;
 if(normalizedPath.startsWith('/topup') && localStorage.getItem('iswallet') === 'true') return true;
  const matchPermission = (perm: PermissionItem): boolean => {
    const permPath = normalize(perm.path || '');
    if (permPath && normalizedPath.startsWith(permPath)) return !!perm.canView;
    return (perm.children ?? []).some(matchPermission);
  };
  return permissions.some(matchPermission);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ✅ Prevent recursion for internal middleware calls
  if (request.headers.get('X-Internal-Request') === 'middleware') {
    return NextResponse.next();
  }

  // ✅ Skip permission checks for these APIs directly
  if (pathname.startsWith('/api/auth/get-permissions')) {
    return NextResponse.next();
  }

  const publicRoutes = [
    '/', '/auth', '/not-permitted', '/404', '/not-found', '/favicon.ico',
    '/logo', '/Logo', '/Asset', '/public', '/images',
    '/shop', '/products', '/collections', '/best-sellers', '/cart', '/checkout',
    '/wishlist', '/about', '/contact', '/faqs', '/guide', '/terms', '/privacy',
    '/shipping-returns',
  ];
  const isPublicRoute = publicRoutes.some(route => (route === '/' ? pathname === '/' : pathname.startsWith(route)));
  if (isPublicRoute || pathname.startsWith('/_next') || pathname.startsWith('/public')) {
    return NextResponse.next();
  }

  const cookies = request.headers.get('cookie');
  const cookieMap = parseCookies(cookies);

  // Basic authentication check - token validation and refresh handled by apiMiddleware
  const isAuthenticated = cookieMap.get('is_authenticated') === 'true';
  const hasAccessToken = !!cookieMap.get('access_token');
  const isValidAuth = isAuthenticated && hasAccessToken;

  // The temporary demo account has full access to the local CMS/storefront flow.
  if (
    process.env.NODE_ENV !== 'production' &&
    isValidAuth &&
    cookieMap.get('access_token') === DEMO_ADMIN_ACCESS_TOKEN
  ) {
    return NextResponse.next();
  }

  if (!isValidAuth && !pathname.startsWith('/auth') && !pathname.startsWith('/_next') && !pathname.startsWith('/api') && pathname !== '/favicon.ico') {
    const host = request.headers.get('x-forwarded-host') || request.headers.get('host');
    const protocol = request.headers.get('x-forwarded-proto') || 'https';
    const baseUrl = `${protocol}://${host}`;
    return NextResponse.redirect(new URL('/auth/login', baseUrl));
  }
  
  if (isValidAuth) {
    try {
      const permissions = await fetchPermissionsFromAPI(request);
      if (!hasRoutePermission(pathname, permissions)) {
        const host = request.headers.get('x-forwarded-host') || request.headers.get('host');
        const protocol = request.headers.get('x-forwarded-proto') || 'https';
        const baseUrl = `${protocol}://${host}`;
        return NextResponse.redirect(new URL('/not-permitted', baseUrl));
      }
    } catch (err) {
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|api/auth/get-permissions).*)'],
};
