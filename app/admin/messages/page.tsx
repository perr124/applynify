'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { MessageSquare, ArrowRight } from 'lucide-react';

interface Message {
  _id: string;
  from: 'admin' | 'user';
  content: string;
  read: boolean;
  createdAt: Date;
}

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  messages: Message[];
  hasUnreadMessages: boolean;
}

export default function AdminMessagesPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsersWithMessages();
  }, []);

  const fetchUsersWithMessages = async () => {
    try {
      const response = await fetch('/api/admin/users?withMessages=true');
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className='flex justify-center items-center h-[calc(100vh-100px)]'>Loading...</div>;
  }

  if (error) {
    return <div className='p-4 text-red-500'>{error}</div>;
  }

  // Filter users who have messages, with proper null checks
  const usersWithMessages =
    users?.filter(
      (user) => user?.messages && Array.isArray(user.messages) && user.messages.length > 0
    ) || [];
  {
    console.log(users, 'usdsds');
  }

  return (
    <div className='max-w-7xl mx-auto p-6'>
      <div className='mb-6'>
        <h1 className='text-2xl font-bold'>User Messages</h1>
        <p className='text-gray-600'>View and manage all user messages in one place</p>
      </div>

      {usersWithMessages.length === 0 ? (
        <div className='text-center py-12'>
          <MessageSquare className='mx-auto h-12 w-12 text-gray-400' />
          <h3 className='mt-2 text-sm font-medium text-gray-900'>No messages</h3>
          <p className='mt-1 text-sm text-gray-500'>No user messages have been sent yet.</p>
        </div>
      ) : (
        <div className='bg-white shadow rounded-lg overflow-hidden'>
          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-gray-50'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    User
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Last Message
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Unread
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Last Updated
                  </th>
                  <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {usersWithMessages.map((user) => {
                  const lastMessage = user.messages[user.messages.length - 1];
                  const unreadCount = user.messages.filter(
                    (msg) => msg.from === 'user' && !msg.read
                  ).length;

                  return (
                    <tr key={user._id} className={unreadCount > 0 ? 'bg-blue-50' : ''}>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <div className='flex items-center'>
                          <div className='flex-shrink-0 h-10 w-10'>
                            <div className='h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center'>
                              <span className='text-gray-600 font-medium'>
                                {user.firstName?.charAt(0) || ''}
                                {user.lastName?.charAt(0) || ''}
                              </span>
                            </div>
                          </div>
                          <div className='ml-4'>
                            <div className='text-sm font-medium text-gray-900'>
                              {user.firstName} {user.lastName}
                            </div>
                            <div className='text-sm text-gray-500'>{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className='px-6 py-4'>
                        <div className='text-sm text-gray-900 max-w-xs truncate'>
                          {lastMessage?.content || 'No message content'}
                        </div>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        {unreadCount > 0 ? (
                          <span className='px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800'>
                            {unreadCount} unread
                          </span>
                        ) : (
                          <span className='px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800'>
                            All read
                          </span>
                        )}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                        {lastMessage?.createdAt
                          ? format(new Date(lastMessage.createdAt), 'MMM d, h:mm a')
                          : 'N/A'}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                        <Link
                          // @ts-ignore
                          href={`/admin/users/${user.id}/messages`}
                          className='text-primary-600 hover:text-primary-900 inline-flex items-center'
                        >
                          View Messages
                          <ArrowRight className='ml-1 h-4 w-4' />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
