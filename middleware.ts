import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow homepage, API routes, Next.js internals, and static files
  if (
    pathname === '/' ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.match(/\.(.*)$/)
  ) {
    return NextResponse.next();
  }

  // Redirect all other routes to homepage
  return NextResponse.redirect(new URL('/', request.url));
}

export const config = {
  matcher: '/:path*',
};
