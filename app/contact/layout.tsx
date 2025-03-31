import { Metadata } from 'next';
import ContactPage from './page';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with our team for any questions or support.',
};

export default function ContactLayout() {
  return <ContactPage />;
}
