'use client';

import { useState, useEffect } from 'react';
import { User, Mail, Bell, CreditCard, Shield, Loader2, CheckCircle } from 'lucide-react';
import ButtonAccount from '@/components/ButtonAccount';

type UserSettings = {
  firstName: string;
  lastName: string;
  email: string;
  notifications: {
    email: boolean;
    jobAlerts: boolean;
    marketing: boolean;
  };
};

export default function Settings() {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/user/settings');
      const data = await response.json();
      setSettings({
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        email: data.email || '',
        notifications: {
          email: data.notifications?.email ?? true,
          jobAlerts: data.notifications?.jobAlerts ?? true,
          marketing: data.notifications?.marketing ?? false,
        },
      });
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const response = await fetch('/api/user/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (!response.ok) throw new Error('Failed to update settings');

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className='animate-pulse space-y-6'>
        <div className='h-48 bg-gray-200 rounded-lg'></div>
        <div className='h-64 bg-gray-200 rounded-lg'></div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>Settings</h1>
          <p className='mt-1 text-sm text-gray-500'>Manage your account settings and preferences</p>
        </div>
        <button
          type='button'
          onClick={handleSubmit}
          disabled={isSaving}
          className='inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150'
        >
          {isSaving ? (
            <>
              <Loader2 className='animate-spin -ml-1 mr-2 h-5 w-5' />
              Saving...
            </>
          ) : (
            'Save Changes'
          )}
        </button>
      </div>

      {showSuccess && (
        <div className='rounded-lg bg-green-50 p-4'>
          <div className='flex'>
            <CheckCircle className='h-5 w-5 text-green-400 mr-2' />
            <div className='text-sm text-green-700'>Settings updated successfully</div>
          </div>
        </div>
      )}

      <div className='grid grid-cols-1 gap-6'>
        {/* Profile Settings */}
        <div className='bg-white shadow rounded-lg p-6'>
          <div className='flex items-center mb-6'>
            <User className='h-5 w-5 text-gray-400 mr-2' />
            <h2 className='text-lg font-semibold text-gray-900'>Profile Information</h2>
          </div>
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
            <div>
              <label className='block text-sm font-medium text-gray-700'>First Name</label>
              <input
                type='text'
                value={settings?.firstName}
                onChange={(e) => setSettings({ ...settings!, firstName: e.target.value })}
                className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700'>Last Name</label>
              <input
                type='text'
                value={settings?.lastName}
                onChange={(e) => setSettings({ ...settings!, lastName: e.target.value })}
                className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
              />
            </div>
          </div>
        </div>

        {/* Notification Preferences */}
        <div className='bg-white shadow rounded-lg p-6'>
          <div className='flex items-center mb-6'>
            <Bell className='h-5 w-5 text-gray-400 mr-2' />
            <h2 className='text-lg font-semibold text-gray-900'>Notification Preferences</h2>
          </div>
          <div className='space-y-4'>
            <div className='flex items-center justify-between'>
              <div>
                <h3 className='text-sm font-medium text-gray-900'>Email Notifications</h3>
                <p className='text-sm text-gray-500'>Receive updates about your applications</p>
              </div>
              <label className='relative inline-flex items-center cursor-pointer'>
                <input
                  type='checkbox'
                  checked={settings?.notifications.email}
                  onChange={(e) =>
                    setSettings({
                      ...settings!,
                      notifications: { ...settings!.notifications, email: e.target.checked },
                    })
                  }
                  className='sr-only peer'
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>

            <div className='flex items-center justify-between'>
              <div>
                <h3 className='text-sm font-medium text-gray-900'>Job Alerts</h3>
                <p className='text-sm text-gray-500'>Get notified about new matching jobs</p>
              </div>
              <label className='relative inline-flex items-center cursor-pointer'>
                <input
                  type='checkbox'
                  checked={settings?.notifications.jobAlerts}
                  onChange={(e) =>
                    setSettings({
                      ...settings!,
                      notifications: { ...settings!.notifications, jobAlerts: e.target.checked },
                    })
                  }
                  className='sr-only peer'
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Account Security */}
        <div className='bg-white shadow rounded-lg p-6'>
          <div className='flex items-center mb-6'>
            <Shield className='h-5 w-5 text-gray-400 mr-2' />
            <h2 className='text-lg font-semibold text-gray-900'>Security</h2>
          </div>
          <button className='inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50'>
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
}
