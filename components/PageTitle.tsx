'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import config from '@/config';

const pageTitles: Record<string, string> = {
  // Admin pages
  '/admin/overview': 'Overview',
  '/admin/orders': 'Orders',
  '/admin/users': 'All Users',
  '/admin/messages': 'Messages',

  // Dashboard pages
  '/dashboard': 'Dashboard',
  '/dashboard/applications': 'Applications',
  '/dashboard/messages': 'Messages',
  '/dashboard/resumes': 'Document Bank',
  '/dashboard/update-preferences': 'Update Preferences',
  '/dashboard/subscription': 'Subscription',
  '/dashboard/settings': 'Settings',
};

export default function PageTitle() {
  const pathname = usePathname();
  const [userName, setUserName] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    if (pathname) {
      let baseTitle = pageTitles[pathname] || 'Applynify';

      // Handle user-specific pages (both view and edit)
      if (pathname.startsWith('/admin/users/')) {
        const pathParts = pathname.split('/');
        const userId = pathParts[3];
        const isEditPage = pathParts.length === 4; // /admin/users/userId
        const isViewPage = pathParts.length === 5 && pathParts[4] === 'view'; // /admin/users/userId/view

        // Reset userName if we're viewing a different user
        if (userId !== currentUserId) {
          setUserName(null);
          setCurrentUserId(userId);
        }

        // Fetch user details if we don't have them yet
        if (!userName) {
          const fetchUserName = async () => {
            try {
              const response = await fetch(`/api/admin/users/${userId}`);
              if (response.ok) {
                const user = await response.json();
                setUserName(`${user.firstName} ${user.lastName}`);
                const pageType = isEditPage ? 'Edit User' : 'User Details';
                document.title = `${user.firstName} ${user.lastName} - ${pageType} | ${config.appName}`;
              }
            } catch (error) {
              console.error('Error fetching user details:', error);
            }
          };
          fetchUserName();
        } else {
          const pageType = isEditPage ? 'Edit User' : 'User Details';
          document.title = `${userName} - ${pageType} | ${config.appName}`;
        }
      } else {
        // Reset states when not on a user page
        setUserName(null);
        setCurrentUserId(null);
        document.title = `${baseTitle} | ${config.appName}`;
      }
    }
  }, [pathname, userName, currentUserId]);

  return null;
}
