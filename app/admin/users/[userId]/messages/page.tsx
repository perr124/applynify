'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { MessageSquare, Send, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';

interface Message {
  _id: string;
  from: 'admin' | 'user';
  content: string;
  read: boolean;
  createdAt: Date;
}

interface User {
  firstName: string;
  lastName: string;
  email: string;
}

export default function AdminUserMessagesPage() {
  const params = useParams<{ userId: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params?.userId) {
      fetchUserAndMessages();
    }
  }, [params?.userId]);

  const fetchUserAndMessages = async () => {
    if (!params?.userId) return;

    try {
      // Fetch user details
      const userResponse = await fetch(`/api/admin/users/${params.userId}`);
      const userData = await userResponse.json();
      setUser(userData);

      // Fetch messages
      const messagesResponse = await fetch(`/api/admin/users/${params.userId}/messages`);
      const messagesData = await messagesResponse.json();
      const fetchedMessages: Message[] = messagesData.messages || [];
      setMessages(fetchedMessages);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const markUserMessagesAsRead = async () => {
    if (!params?.userId) return;

    // Optimistically update UI
    setMessages((prevMessages) =>
      prevMessages.map((msg) => (msg.from === 'user' ? { ...msg, read: true } : msg))
    );

    try {
      // Send request to backend to mark messages as read
      const response = await fetch(`/api/admin/users/${params.userId}/messages/read`, {
        method: 'PATCH',
      });

      if (!response.ok) {
        console.error('Failed to mark user messages as read on server');
        // Revert optimistic update on failure
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.from === 'user' && msg.read // Only revert those we tried to change
              ? { ...msg, read: false }
              : msg
          )
        );
      }
      // No need to refetch on success because of optimistic update
    } catch (error) {
      console.error('Error marking user messages as read:', error);
      // Revert optimistic update on error
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.from === 'user' && msg.read // Only revert those we tried to change
            ? { ...msg, read: false }
            : msg
        )
      );
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !params?.userId) return;

    try {
      const response = await fetch(`/api/admin/users/${params.userId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: newMessage }),
      });

      if (response.ok) {
        setNewMessage('');
        // Mark user's messages as read after successfully sending a reply
        await markUserMessagesAsRead();
        // Refetch to get the new message from the admin and confirm read status
        fetchUserAndMessages();
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (loading) {
    return <div className='flex justify-center items-center h-64'>Loading...</div>;
  }

  if (!user || !params?.userId) {
    return <div className='p-4 text-red-500'>User not found</div>;
  }

  return (
    <div className='max-w-4xl mx-auto p-6'>
      <div className='flex items-center justify-between mb-6'>
        <div className='flex items-center gap-4'>
          <Link
            href={`/admin/users/${params.userId}`}
            className='text-gray-600 hover:text-gray-900'
          >
            <ArrowLeft className='h-6 w-6' />
          </Link>
          <div>
            <h1 className='text-2xl font-semibold'>Messages</h1>
            <p className='text-gray-600'>
              {user.firstName} {user.lastName} ({user.email})
            </p>
          </div>
        </div>
      </div>

      <div className='bg-white rounded-lg shadow-sm border border-gray-200'>
        <div className='divide-y divide-gray-200'>
          {messages.length === 0 ? (
            <div className='text-center text-gray-500 py-8'>No messages yet.</div>
          ) : (
            messages.map((message) => (
              <div
                key={message._id}
                className={`p-4 ${message.from === 'user' && !message.read ? 'bg-primary-50' : ''}`}
              >
                <div className='flex justify-between items-start mb-2'>
                  <div className='flex items-center gap-2'>
                    <span
                      className={`text-sm font-medium ${
                        message.from === 'admin' ? 'text-primary-600' : 'text-gray-600'
                      }`}
                    >
                      {message.from === 'admin' ? 'Admin' : user.firstName}
                    </span>
                    {message.from === 'user' && !message.read && (
                      <span className='bg-primary-600 text-white text-xs px-2 py-0.5 rounded-full'>
                        New
                      </span>
                    )}
                  </div>
                  <span className='text-xs text-gray-500'>
                    {format(new Date(message.createdAt), 'MMM d, yyyy h:mm a')}
                  </span>
                </div>
                <p className='text-gray-700'>{message.content}</p>
              </div>
            ))
          )}
        </div>

        <form onSubmit={sendMessage} className='border-t border-gray-200 p-4'>
          <div className='space-y-2'>
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder='Type your message...'
              className='w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 min-h-[100px]'
            />
            <div className='flex justify-end'>
              <button
                type='submit'
                className='bg-primary-600 text-white rounded-md px-4 py-2 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500'
              >
                <Send className='h-4 w-4 inline-block mr-2' />
                Send Message
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
