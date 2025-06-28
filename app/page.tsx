import { Suspense } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Problem from '@/components/Problem';
import FeaturesAccordion from '@/components/FeaturesAccordion';
import Pricing from '@/components/Pricing';
import FAQ from '@/components/FAQ';
import CTA from '@/components/CTA';
import Footer from '@/components/Footer';
import WaitlistPage from './waitlist/page';

export default function Home() {
  // Check if waitlist mode is enabled via environment variable
  const isWaitlistMode = process.env.NEXT_PUBLIC_WAITLIST_MODE === 'true';

  // If waitlist mode is enabled, show the waitlist page
  if (isWaitlistMode) {
    return <WaitlistPage />;
  }

  // Otherwise, show the full site
  return (
    <>
      <Suspense>
        <Header />
      </Suspense>
      <main>
        <Hero />
        {/* <Problem /> */}
        {/* Worry about below later */}
        {/* <FeaturesAccordion /> */}
        <Pricing />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
