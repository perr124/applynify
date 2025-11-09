import Link from 'next/link';
import { getSEOTags } from '@/libs/seo';
import config from '@/config';

export const metadata = getSEOTags({
  title: `Terms of Service | ${config.appName}`,
  canonicalUrlRelative: '/tos',
});

const PrivacyPolicy = () => {
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
        <h1 className='text-3xl font-extrabold pb-6'>Terms of Service</h1>

        <div className='leading-relaxed space-y-4'>
          <p>Last Updated: November 1, 2025</p>

          <p>Welcome to Applynify!</p>

          <p>
            Our mission is to simplify and supercharge your job search process by doing the heavy
            lifting for you. We exist to make applying targeted and effective—setting individuals up
            with roles that actually match their skills and goals.
          </p>

          <h2 className='text-xl font-bold'>Introduction</h2>

          <p>
            By using Applynify, you agree to enter into a legally binding agreement ("Agreement" or
            "Contract") with Applynify ("we," "us," or "our"). If you do not agree to these terms,
            do not use our services. These Terms apply to your use of applynify.com ("Website") and
            any services provided through it. If you wish to terminate this Agreement at any time,
            you can request for your account to be closed by contacting{' '}
            <a href='mailto:hello@applynify.com' className='text-blue-600 hover:underline'>
              hello@applynify.com
            </a>{' '}
            and no longer accessing or using our services.
          </p>

          <h2 className='text-xl font-bold'>Obligations</h2>

          <h3 className='text-lg font-semibold'>Service Eligibility</h3>
          <p>
            To use our services, you must be at least 16 years old. In locations where legal
            regulations set a higher age requirement for using our services without parental
            consent, you must meet that minimum age requirement. We refuse our services to those
            under the required age of their jurisdiction.
          </p>

          <h3 className='text-lg font-semibold'>Your Account</h3>
          <p>
            You are responsible for maintaining the confidentiality of your login credentials and
            any activities that occur under your account. You are responsible for reporting any
            misuse of your account to{' '}
            <a href='mailto:hello@applynify.com' className='text-blue-600 hover:underline'>
              hello@applynify.com
            </a>
            .
          </p>

          <h2 className='text-xl font-bold'>Rights and Limits</h2>

          <h3 className='text-lg font-semibold'>3.1. License to Use Applynify</h3>
          <p>
            By using Applynify, you are granted a limited, non-exclusive, non-transferable, and
            revocable license to access and use our services for non-commercial purposes.
          </p>

          <h3 className='text-lg font-semibold'>3.2. Restrictions</h3>
          <p>You agree not to:</p>
          <ul className='list-disc pl-6 space-y-2'>
            <li>
              Resell, distribute, or exploit Applynify's services for commercial or personal gain.
            </li>
            <li>Reverse-engineer, modify, or create derivative works based on our platform.</li>
            <li>Use automated methods (such as bots or scrapers) to access our services.</li>
          </ul>

          <h2 className='text-xl font-bold'>4. Payments and Refunds</h2>

          <p>
            Any purchase of services at Applynify is an agreement of our{' '}
            <a href='http://localhost:3000/#pricing' className='text-blue-600 hover:underline'>
              pricing and payment terms
            </a>
            .
          </p>

          <p>
            By making a purchase, you agree to provide accurate payment information and authorize us
            to charge the applicable fees.
          </p>

          <p>
            Payments are processed securely through third-party payment processors. We do not store
            your payment details.
          </p>

          <p>
            If a payment is unsuccessful, we may suspend or terminate your access to paid services
            until the issue is resolved.
          </p>

          <p>
            We strive to provide a high-quality and personalized experience through Applynify. If
            you are not satisfied, refunds may be issued under the following conditions:
          </p>

          <ul className='list-disc pl-6 space-y-2'>
            <li>
              Before Service Begins: You are eligible for a full refund if you request one before we
              have begun the job application process on your behalf.
            </li>
            <li>
              No Suitable Job Matches: If we are unable to find suitable job opportunities that
              align with the criteria you provided, we will issue a refund.
            </li>
          </ul>

          <p>
            To request a refund, please contact us using the email address linked to your Applynify
            account at{' '}
            <a href='mailto:hello@applynify.com' className='text-blue-600 hover:underline'>
              hello@applynify.com
            </a>{' '}
            with your order details. Please note that:
          </p>

          <ul className='list-disc pl-6 space-y-2'>
            <li>Refunds are not available once the application process has started.</li>
            <li>Refunds are issued at our discretion and are limited to the conditions above.</li>
          </ul>

          <h2 className='text-xl font-bold'>5. Privacy Policy</h2>
          <p>
            We collect and use your data in accordance with our{' '}
            <a
              href='http://localhost:3000/privacy-policy'
              className='text-blue-600 hover:underline'
            >
              Privacy Policy
            </a>
            .
          </p>

          <h2 className='text-xl font-bold'>6. Termination</h2>
          <p>
            We may suspend or terminate your access to our services if you violate these Terms or
            misuse our platform.
          </p>

          <h2 className='text-xl font-bold'>7. Disclaimers and Liability Limitations</h2>
          <ul className='list-disc pl-6 space-y-2'>
            <li>Applynify is provided "as is" without warranties of any kind.</li>
            <li>We do not guarantee job placement or employment outcomes.</li>
            <li>
              To the maximum extent permitted by law, we are not liable for any indirect,
              incidental, or consequential damages arising from your use of Applynify.
            </li>
          </ul>

          <h2 className='text-xl font-bold'>8. Governing Law and Dispute Resolution</h2>
          <p>
            These Terms shall be governed by applicable laws, and your use of our services is also
            subject to{' '}
            <a href='/privacy-policy' className='text-blue-600 hover:underline'>
              our Privacy Policy.
            </a>
            , which includes region-specific information for users in the EU, UK, US, Canada, and
            Australia. By using our services, you agree to resolve any disputes in a fair and
            reasonable manner, including—where applicable—negotiation, mediation, arbitration, or
            legal proceedings in an appropriate and competent forum.
          </p>

          <h2 className='text-xl font-bold'>9. Changes to These Terms</h2>
          <p>
            We may update these Terms from time to time. If we make material changes, we will notify
            you via email or our{' '}
            <a href='https://applynify.com' className='text-blue-600 hover:underline'>
              Website
            </a>
            .
          </p>

          <h2 className='text-xl font-bold'>10. Contact Information</h2>
          <p>
            For any questions, please contact us at{' '}
            <a href='mailto:hello@applynify.com' className='text-blue-600 hover:underline'>
              hello@applynify.com
            </a>
            .
          </p>

          <p>Thank you for using Applynify!</p>
        </div>
      </div>
    </main>
  );
};

export default PrivacyPolicy;
