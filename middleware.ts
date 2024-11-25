import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  async function middleware(req) {
    // Get the pathname
    const path = req.nextUrl.pathname;

    // Get token
    const token = req.nextauth.token;

    if (!token) {
      return NextResponse.redirect(new URL('/auth/signin', req.url));
    }

    // If trying to access dashboard, check if onboarding is completed
    if (path.startsWith('/dashboard')) {
      try {
        const res = await fetch(`${req.nextUrl.origin}/api/user/onboarding-status`, {
          headers: {
            cookie: req.headers.get('cookie') || '',
          },
        });

        const data = await res.json();
        if (!data.onboardingComplete) {
          return NextResponse.redirect(new URL('/onboarding', req.url));
        }
      } catch (error) {
        console.error('Error checking onboarding status:', error);
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ['/dashboard/:path*', '/onboarding/:path*'],
};
