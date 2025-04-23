import Link from 'next/link';
import { getSEOTags } from '@/libs/seo';
import config from '@/config';

export const metadata = getSEOTags({
  title: `Privacy Policy | ${config.appName}`,
  canonicalUrlRelative: '/privacy-policy',
});

const PrivacyPolicy = () => {
  return (
    <main className='max-w-xl mx-auto'>
      <div className='p-5'>
        <Link href='/' className='btn btn-ghost'>
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
        <h1 className='text-3xl font-extrabold pb-6'>Privacy Policy</h1>

        <div className='leading-relaxed space-y-4'>
          <p>Last Updated: April 1, 2025</p>

          <p>
            Thank you for using Applynify ("we," "us," or "our"). This Privacy Policy explains how
            we collect, use, and protect your personal and non-personal information when you use our
            Website at{' '}
            <a href='https://applynify.com' className='text-blue-600 hover:underline'>
              https://applynify.com
            </a>{' '}
            ("Website").
          </p>

          <p>
            By accessing or using the{' '}
            <a href='https://applynify.com' className='text-blue-600 hover:underline'>
              Website
            </a>
            , you agree to the terms of this Privacy Policy. If you do not agree with these
            practices, please do not use the{' '}
            <a href='https://applynify.com' className='text-blue-600 hover:underline'>
              Website
            </a>
            .
          </p>

          <h2 className='text-xl font-bold'>1. Information We Collect</h2>

          <h3 className='text-lg font-semibold'>Personal Data</h3>
          <p>We collect the following personal information when you interact with our services:</p>

          <ul className='list-disc pl-6 space-y-2'>
            <li>Name: To personalize your experience and facilitate communication.</li>
            <li>Email: To send important updates, notifications, and support responses.</li>
            <li>
              Payment Information: To process transactions securely. We do not store your payment
              details—payments are handled by trusted third-party processors.
            </li>
          </ul>

          <h3 className='text-lg font-semibold'>Non-Personal Data</h3>
          <p>
            We may collect non-personal data through cookies and similar tracking technologies,
            including:
          </p>
          <ul className='list-disc pl-6 space-y-2'>
            <li>IP address</li>
            <li>Browser type and device information</li>
            <li>
              Usage data and interaction with our{' '}
              <a href='https://applynify.com' className='text-blue-600 hover:underline'>
                Website
              </a>
            </li>
          </ul>
          <p>
            This data helps us analyze trends, improve our services, and enhance user experience.
          </p>

          <h2 className='text-xl font-bold'>2. Purpose of Data Collection</h2>
          <p>We collect and use your personal data for the following purposes:</p>
          <ul className='list-disc pl-6 space-y-2'>
            <li>Processing transactions and providing our services</li>
            <li>Sending order confirmations and service-related updates</li>
            <li>Offering customer support and responding to inquiries</li>
            <li>Improving Website functionality and user experience</li>
          </ul>

          <h2 className='text-xl font-bold'>3. Data Sharing</h2>
          <p>We do not sell, trade, or rent your personal information. We only share your data:</p>
          <ul className='list-disc pl-6 space-y-2'>
            <li>With payment processors for secure transaction handling</li>
            <li>As required by law, to comply with legal obligations</li>
            <li>
              With service providers assisting in website operations under strict confidentiality
              agreements
            </li>
          </ul>

          <h2 className='text-xl font-bold'>4. Cookies and Tracking Technologies</h2>
          <p>
            We use cookies to enhance user experience and analyze traffic. You can modify your
            browser settings to manage cookie preferences, but some features of our{' '}
            <a href='https://applynify.com' className='text-blue-600 hover:underline'>
              Website
            </a>{' '}
            may not function properly without them.
          </p>

          <h2 className='text-xl font-bold'>5. Minor's Privacy</h2>
          <p>
            Applynify is not intended for individuals under the age of 16 ("Minors"). We do not
            knowingly collect personal information from Minors. If you believe a Minor has provided
            us with personal data, please contact us, and we will take necessary steps to remove the
            information.
          </p>

          <h2 className='text-xl font-bold'>6. Data Security</h2>
          <p>
            We implement industry-standard security measures to protect your personal information
            from unauthorized access, alteration, or disclosure. However, no online service is 100%
            secure, and we cannot guarantee absolute security.
          </p>

          <h2 className='text-xl font-bold'>7. Updates to the Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time to reflect changes in our practices
            or comply with legal requirements. Any updates will be posted on this page, and we may
            notify you via email of significant changes.
          </p>

          <h2 className='text-xl font-bold'>8. Contact Information</h2>
          <p>
            If you have any questions or concerns about this Privacy Policy, please contact us at{' '}
            <a href='mailto:hello@applynify.com' className='text-blue-600 hover:underline'>
              hello@applynify.com
            </a>
            .
          </p>

          <p>By using Applynify, you consent to the terms of this Privacy Policy.</p>
        </div>
      </div>
    </main>
  );
};

export default PrivacyPolicy;
