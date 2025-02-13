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

    try {
      // Check email verification first
      const verificationRes = await fetch(`${req.nextUrl.origin}/api/user/verification-status`, {
        headers: {
          cookie: req.headers.get('cookie') || '',
        },
      });

      const verificationData = await verificationRes.json();
      console.log('verificationData', verificationData);
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
  matcher: ['/dashboard/:path*', '/onboarding/:path*'],
};
