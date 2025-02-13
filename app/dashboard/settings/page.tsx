'use client';
import React from 'react';

import { useState, useEffect } from 'react';
import { User, Mail, Bell, CreditCard, Shield, Loader2, CheckCircle, X } from 'lucide-react';
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
  hasPasswordAuth: boolean;
};

export default function Settings() {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [hasPasswordAuth, setHasPasswordAuth] = useState(false);

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
        hasPasswordAuth: data.hasPasswordAuth,
      });
      setHasPasswordAuth(data.hasPasswordAuth);
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

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("New passwords don't match");
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters long');
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch('/api/user/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to change password');
      }

      // Reset form and close modal
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setIsPasswordModalOpen(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Password change error:', error);
      setPasswordError(error instanceof Error ? error.message : 'Failed to change password');
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
          className='inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-500 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150'
        >
          {isSaving ? (
            <>
              <Loader2 className='animate-spin -ml-1 mr-2 h-5 w-5' />
              Saving...
            </>
          ) : (
            'Update'
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
                className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700'>Last Name</label>
              <input
                type='text'
                value={settings?.lastName}
                onChange={(e) => setSettings({ ...settings!, lastName: e.target.value })}
                className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm'
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
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
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
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Account Security */}
        {hasPasswordAuth && (
          <div className='bg-white shadow rounded-lg p-6'>
            <div className='flex items-center mb-6'>
              <Shield className='h-5 w-5 text-gray-400 mr-2' />
              <h2 className='text-lg font-semibold text-gray-900'>Security</h2>
            </div>

            <button
              onClick={() => setIsPasswordModalOpen(true)}
              className='inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50'
            >
              Change Password
            </button>

            {/* Password Change Modal - only rendered if hasPasswordAuth is true */}
            {isPasswordModalOpen && hasPasswordAuth && (
              <div className='fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50'>
                <div className='relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white'>
                  <div className='flex justify-between items-center mb-4'>
                    <h3 className='text-lg font-medium'>Change Password</h3>
                    <button
                      onClick={() => setIsPasswordModalOpen(false)}
                      className='text-gray-400 hover:text-gray-500'
                    >
                      <X className='h-5 w-5' />
                    </button>
                  </div>

                  {passwordError && (
                    <div className='mb-4 p-2 bg-red-50 text-red-500 text-sm rounded'>
                      {passwordError}
                    </div>
                  )}

                  <form onSubmit={handlePasswordChange} className='space-y-4'>
                    <div>
                      <label className='block text-sm font-medium text-gray-700'>
                        Current Password
                      </label>
                      <input
                        type='password'
                        value={passwordForm.currentPassword}
                        onChange={(e) =>
                          setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                        }
                        className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm'
                        required
                      />
                    </div>

                    <div>
                      <label className='block text-sm font-medium text-gray-700'>
                        New Password
                      </label>
                      <input
                        type='password'
                        value={passwordForm.newPassword}
                        onChange={(e) =>
                          setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                        }
                        className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm'
                        required
                      />
                    </div>

                    <div>
                      <label className='block text-sm font-medium text-gray-700'>
                        Confirm New Password
                      </label>
                      <input
                        type='password'
                        value={passwordForm.confirmPassword}
                        onChange={(e) =>
                          setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                        }
                        className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm'
                        required
                      />
                    </div>

                    <div className='flex justify-end space-x-3 mt-4'>
                      <button
                        type='button'
                        onClick={() => setIsPasswordModalOpen(false)}
                        className='px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50'
                      >
                        Cancel
                      </button>
                      <button
                        type='submit'
                        disabled={isSaving}
                        className='inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-500 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50'
                      >
                        {isSaving ? (
                          <>
                            <Loader2 className='animate-spin -ml-1 mr-2 h-5 w-5' />
                            Saving...
                          </>
                        ) : (
                          'Change Password'
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
