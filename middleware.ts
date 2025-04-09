import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  async function middleware(req) {
    const path = req.nextUrl.pathname;
    const token = req.nextauth.token;

    // Special handling for admin login page
    if (path === '/admin/login') {
      // If user is already logged in and is admin, redirect to admin dashboard
      if (token?.isAdmin) {
        return NextResponse.redirect(new URL('/admin', req.url));
      }
      return NextResponse.next();
    }

    // Check for admin routes
    if (path.startsWith('/admin')) {
      if (!token?.isAdmin) {
        return NextResponse.redirect(new URL('/admin/login', req.url));
      }
    }

    if (!token) {
      // Preserve the original URL as callbackUrl when redirecting to sign-in
      const callbackUrl = encodeURIComponent(req.nextUrl.pathname + req.nextUrl.search);
      return NextResponse.redirect(new URL(`/auth/signin?callbackUrl=${callbackUrl}`, req.url));
    }

    try {
      // Check email verification first
      const verificationRes = await fetch(`${req.nextUrl.origin}/api/user/verification-status`, {
        headers: {
          cookie: req.headers.get('cookie') || '',
        },
      });

      const verificationData = await verificationRes.json();
      if (!verificationData.emailVerified) {
        return NextResponse.redirect(new URL('/auth/verify-email', req.url));
      }

      // Get onboarding status
      const onboardingRes = await fetch(`${req.nextUrl.origin}/api/user/onboarding-status`, {
        headers: {
          cookie: req.headers.get('cookie') || '',
        },
      });

      const onboardingData = await onboardingRes.json();

      // Prevent access to onboarding if already completed and paid
      if (
        path.startsWith('/onboarding') &&
        onboardingData.onboardingComplete &&
        onboardingData.priceId
      ) {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }

      // Redirect to onboarding if not complete or no payment
      if (
        path.startsWith('/dashboard') &&
        (!onboardingData.onboardingComplete || !onboardingData.priceId)
      ) {
        return NextResponse.redirect(new URL('/onboarding', req.url));
      }
    } catch (error) {
      console.error('Error checking user status:', error);
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
  matcher: [
    '/dashboard/:path*',
    '/onboarding/:path*',
    '/admin',
    '/admin/users/:path*',
    '/admin/applications/:path*',
  ],
};
