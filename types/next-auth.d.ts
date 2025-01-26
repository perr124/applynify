import NextAuth, { DefaultSession, DefaultUser } from 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's id. */
      id: string;
      onboardingComplete?: boolean;
    } & DefaultSession['user'];
  }

  interface User extends DefaultUser {
    onboardingComplete?: boolean;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    onboardingComplete?: boolean;
  }
}
