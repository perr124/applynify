'use client';

import { useSession, signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import config from '@/config';

const ButtonSignin = ({ text = 'Login', extraStyle }: { text?: string; extraStyle?: string }) => {
  const router = useRouter();
  const { data: session, status } = useSession();

  const handleClick = async () => {
    if (status === 'authenticated') {
      router.push(config.auth.callbackUrl);
    } else {
      try {
        // Use Google provider explicitly
        const result = await signIn('google', {
          callbackUrl: config.auth.callbackUrl,
          redirect: true,
        });

        console.log('Sign in result:', result);

        // Handle failed sign in
        if (result?.error) {
          console.error('Sign in error:', result.error);
        }
      } catch (error) {
        console.error('Sign in error:', error);
      }
    }
  };

  if (status === 'authenticated') {
    return (
      <Link href={config.auth.callbackUrl} className={`btn ${extraStyle || ''}`}>
        {session.user?.image ? (
          <img
            src={session.user?.image}
            alt={session.user?.name || 'Account'}
            className='w-6 h-6 rounded-full shrink-0'
            referrerPolicy='no-referrer'
            width={24}
            height={24}
          />
        ) : (
          <span className='w-6 h-6 bg-base-300 flex justify-center items-center rounded-full shrink-0'>
            {session.user?.name?.charAt(0) || session.user?.email?.charAt(0)}
          </span>
        )}
        {session.user?.name || session.user?.email || 'Account'}
      </Link>
    );
  }

  return (
    <Link href='/auth/signin' className={`btn ${extraStyle || ''}`}>
      {text}
    </Link>
  );
};

export default ButtonSignin;
