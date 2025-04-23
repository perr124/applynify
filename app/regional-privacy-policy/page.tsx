import Link from 'next/link';
import { getSEOTags } from '@/libs/seo';
import config from '@/config';

export const metadata = getSEOTags({
  title: `Regional Privacy Policy | ${config.appName}`,
  canonicalUrlRelative: '/regional-privacy-policy',
});

const RegionalPrivacyPolicy = () => {
  return (
    <main className='max-w-xl mx-auto'>
      <div className='p-5 pt-16'>
        <Link href='/' className='btn btn-ghost absolute top-4 left-4'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 20 20'
            fill='currentColor'
            className='w-5 h-5'
          >
            <path
              fillRule='evenodd'
              d='M15 10a.75.75 0 01-.75.75H7.612l2.158 1.96a.75.75 0 11-1.04 1.08l-3.5-3.25a.75.75 0 010-1.08l3.5-3.25a.75.75 0 111.04 1.08L7.612 9.25h6.638A.75.75 0 0115 10z'
              clipRule='evenodd'
            />
          </svg>{' '}
          Back
        </Link>
        <h1 className='text-3xl font-extrabold pb-6'>Applynify Regional Privacy Policy Addendum</h1>

        <div className='leading-relaxed space-y-4'>
          <p>Last Updated: April 1, 2025</p>

          <p>We may update this regional addendum periodically.</p>

          <p>
            This addendum complements the Applynify Privacy Policy and addresses additional
            requirements for users in the United States, Canada, and Australia. It should be read in
            conjunction with our main Privacy Policy and EU/UK Privacy Policy.
          </p>

          <h2 className='text-xl font-bold'>1. United States (including California residents)</h2>

          <h3 className='text-lg font-semibold'>Applicable Laws</h3>
          <p>
            California Consumer Privacy Act (CCPA) and California Privacy Rights Act (CPRA), as well
            as other state laws.
          </p>

          <h3 className='text-lg font-semibold'>1.1 Categories of Information Collected</h3>
          <p>We collect the following personal information when you interact with our services:</p>
          <ul className='list-disc pl-6 space-y-2'>
            <li>Identifiers (e.g. name, email address)</li>
            <li>Internet activity (e.g. browsing behaviours on our platform)</li>
            <li>Employment information (e.g. job preferences and CV data)</li>
          </ul>

          <h3 className='text-lg font-semibold'>1.2 Your Rights Under CCPA/CPRA</h3>
          <p>As a California resident, you have the right to:</p>
          <ul className='list-disc pl-6 space-y-2'>
            <li>Know what personal data we collect and how we use it</li>
            <li>Request access to or deletion of your personal information</li>
            <li>
              Opt-out of the sale or sharing of your personal data (Note: We do not sell personal
              data)
            </li>
            <li>Request correction of inaccurate data</li>
            <li>Limit the use of sensitive personal data (if applicable)</li>
          </ul>
          <p>
            To exercise any of these rights, please contact us at{' '}
            <a href='mailto:hello@applynify.com' className='text-blue-600 hover:underline'>
              hello@applynify.com
            </a>
            .
          </p>

          <h3 className='text-lg font-semibold'>1.3 Non-Discrimination</h3>
          <p>We do not discriminate against users who exercise their privacy rights.</p>

          <h2 className='text-xl font-bold'>2. Canada</h2>

          <h3 className='text-lg font-semibold'>Applicable Law</h3>
          <p>Personal Information Protection and Electronic Documents Act (PIPEDA)</p>

          <h3 className='text-lg font-semibold'>2.1 Your Rights Under Canadian Law</h3>
          <p>You have the right to:</p>
          <ul className='list-disc pl-6 space-y-2'>
            <li>Access your personal information</li>
            <li>Request corrections to inaccurate information</li>
            <li>Withdraw consent at any time (subject to legal or contractual restrictions)</li>
          </ul>
          <p>
            We collect your personal information with your consent and use it only for the purposes
            outlined in our main Privacy Policy. Data may be transferred and stored outside Canada
            with appropriate safeguards in place.
          </p>
          <p>
            To exercise your rights, please contact us at{' '}
            <a href='mailto:hello@applynify.com' className='text-blue-600 hover:underline'>
              hello@applynify.com
            </a>
            .
          </p>

          <h2 className='text-xl font-bold'>3. Australia</h2>

          <h3 className='text-lg font-semibold'>Applicable Law</h3>
          <p>Australian Privacy Act 1988 and Australian Privacy Principles (APPs)</p>

          <h3 className='text-lg font-semibold'>3.1 Your Rights Under Australian Law</h3>
          <p>You have the right to:</p>
          <ul className='list-disc pl-6 space-y-2'>
            <li>Know why we collect your personal information and how it will be used</li>
            <li>Access and correct your personal information</li>
            <li>Complain about a breach of the APPs</li>
          </ul>
          <p>
            We collect your personal data to provide and improve our services. Your data may be
            disclosed overseas, but only with appropriate protections.
          </p>
          <p>
            If you have any concerns, please contact us at{' '}
            <a href='mailto:hello@applynify.com' className='text-blue-600 hover:underline'>
              hello@applynify.com
            </a>
            . You may also contact the Office of the Australian Information Commissioner (OAIC) if
            you're unsatisfied with our response.
          </p>
        </div>
      </div>
    </main>
  );
};

export default RegionalPrivacyPolicy;
