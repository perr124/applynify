import NextAuth from 'next-auth';
import type { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import EmailProvider from 'next-auth/providers/email';
import bcrypt from 'bcrypt';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import config from '@/config';
import connectMongo from './mongo';
import { randomBytes } from 'crypto';

interface NextAuthOptionsExtended extends NextAuthOptions {
  adapter?: any;
}

const getUsersCollection = async () => {
  const client = await connectMongo;
  if (!client) throw new Error('Failed to connect to MongoDB');
  return client.db().collection('users');
};

export const authOptions: NextAuthOptionsExtended = {
  // Set any random key in .env.local
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      // Follow the "Login with Google" tutorial to get your credentials
      clientId: process.env.GOOGLE_ID || '',
      clientSecret: process.env.GOOGLE_SECRET || '',
      async profile(profile) {
        return {
          id: profile.sub,
          name: profile.given_name ? profile.given_name : profile.name,
          email: profile.email,
          image: profile.picture,
          createdAt: new Date(),
        };
      },
    }),
    // Follow the "Login with Email" tutorial to set up your email server
    // Requires a MongoDB database. Set MONOGODB_URI env variable.
    ...(connectMongo
      ? [
          EmailProvider({
            server: process.env.EMAIL_SERVER,
            from: config.mailgun.fromNoReply,
          }),
        ]
      : []),
    // Credentials Provider for email/password login
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter an email and password');
        }

        const usersCollection = await getUsersCollection();

        // Find user and explicitly include password field
        const user = await usersCollection.findOne(
          { email: credentials.email },
          { projection: { password: 1, email: 1, name: 1 } }
        );

        if (!user) {
          throw new Error('No user found with this email');
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) {
          throw new Error('Invalid password');
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],
  // New users will be saved in Database (MongoDB Atlas). Each user (model) has some fields like name, email, image, etc..
  // Requires a MongoDB database. Set MONOGODB_URI env variable.
  // Learn more about the model type: https://next-auth.js.org/v3/adapters/models
  ...(connectMongo && { adapter: MongoDBAdapter(connectMongo) }),

  callbacks: {
    session: async ({ session, token }) => {
      if (session && session.user) {
        session.user.id = token.sub as string;
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt',
  },
  theme: {
    brandColor: config.colors.main,
    // Add you own logo below. Recommended size is rectangle (i.e. 200x50px) and show your logo + name.
    // It will be used in the login flow to display your logo. If you don't add it, it will look faded.
    // logo: `https://${config.domainName}/logoAndName.png`,
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
    // Add these if you create custom pages for them
    // signOut: '/auth/signout',
    // verifyRequest: '/auth/verify-request',
  },
};

export default NextAuth(authOptions);

// Add these helper functions to handle password reset
export async function generatePasswordResetToken(email: string) {
  const usersCollection = await getUsersCollection();
  const token = randomBytes(32).toString('hex');
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  await usersCollection.updateOne(
    { email },
    {
      $set: {
        resetPasswordToken: token,
        resetPasswordExpires: expires,
      },
    }
  );

  return token;
}

export async function resetPassword(token: string, newPassword: string) {
  const usersCollection = await getUsersCollection();
  const user = await usersCollection.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw new Error('Invalid or expired reset token');
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await usersCollection.updateOne(
    { _id: user._id },
    {
      $set: { password: hashedPassword },
      $unset: { resetPasswordToken: 1, resetPasswordExpires: 1 },
    }
  );
}
