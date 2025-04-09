'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { MessageSquare, Send, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';
import Linkify from 'react-linkify';

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

// Linkify decorator to open links in new tab and style them
const linkDecorator = (href: string, text: string, key: number) => (
  <a
    href={href}
    key={key}
    target='_blank'
    rel='noopener noreferrer'
    className='text-blue-500 hover:underline'
  >
    {text}
  </a>
);

export default function AdminUserMessagesPage() {
  const params = useParams<{ userId: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (params?.userId) {
      fetchUserAndMessages();
    }
  }, [params?.userId]);

  useEffect(() => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }, [messages]);

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
    if (!params?.userId || !messages.some((msg) => msg.from === 'user' && !msg.read)) return;

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

    const tempId = `temp-${Date.now()}`;
    const optimisticMessage: Message = {
      _id: tempId,
      from: 'admin',
      content: newMessage,
      read: true,
      createdAt: new Date(),
    };

    // Optimistically add the message
    setMessages((prev) => [...prev, optimisticMessage]);
    const currentAdminMessage = newMessage;
    setNewMessage('');

    try {
      const response = await fetch(`/api/admin/users/${params.userId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: currentAdminMessage }),
      });

      if (response.ok) {
        // Mark user's messages as read after successfully sending a reply
        if (messages.some((msg) => msg.from === 'user' && !msg.read)) {
          await markUserMessagesAsRead();
        }
        // Refetch to get the actual message from the admin and confirm read status
        fetchUserAndMessages();
      } else {
        // If sending failed, remove the optimistic message
        setMessages((prev) => prev.filter((msg) => msg._id !== tempId));
        setNewMessage(currentAdminMessage);
        console.error('Failed to send admin message');
      }
    } catch (error) {
      // If sending failed, remove the optimistic message
      setMessages((prev) => prev.filter((msg) => msg._id !== tempId));
      setNewMessage(currentAdminMessage);
      console.error('Error sending admin message:', error);
    }
  };

  if (loading) {
    return <div className='flex justify-center items-center h-[calc(100vh-100px)]'>Loading...</div>;
  }

  if (!user || !params?.userId) {
    return (
      <div className='flex flex-col items-center justify-center h-[calc(100vh-100px)] p-4'>
        <p className='text-red-500 text-lg'>User not found or could not be loaded.</p>
        <Link href='/admin/users' className='mt-4 text-primary-600 hover:underline'>
          Back to Users
        </Link>
      </div>
    );
  }

  return (
    <div className='flex flex-col h-[calc(100vh-100px)]'>
      <div className='p-4 bg-white border-b border-gray-200'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <Link
              href={`/admin/users/${params.userId}`}
              className='text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100'
            >
              <ArrowLeft className='h-5 w-5' />
            </Link>
            <div>
              <h1 className='text-lg font-semibold text-gray-800'>
                {user.firstName} {user.lastName}
              </h1>
              <p className='text-sm text-gray-500'>{user.email}</p>
            </div>
          </div>
        </div>
      </div>

      <div className='flex-grow overflow-y-auto p-4 space-y-4 bg-gray-50'>
        {messages.length === 0 ? (
          <div className='text-center text-gray-500 py-8'>No messages yet.</div>
        ) : (
          messages.map((message) => (
            <div
              key={message._id}
              className={`flex items-end gap-2 ${
                message.from === 'admin' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.from === 'user' && (
                <div className='flex items-center justify-center h-8 w-8 rounded-full bg-gray-300 text-gray-700 text-sm font-bold flex-shrink-0'>
                  {user?.firstName?.charAt(0).toUpperCase() || 'U'}
                </div>
              )}

              <div
                className={`max-w-xs lg:max-w-md p-3 rounded-lg shadow-sm ${
                  message.from === 'admin' ? 'bg-primary-600 text-white' : 'bg-white text-gray-800'
                } ${
                  message.from === 'user' && !message.read
                    ? 'ring-2 ring-primary-300 ring-offset-1'
                    : ''
                }`}
              >
                <p className='text-sm whitespace-pre-wrap'>
                  <Linkify componentDecorator={linkDecorator}>{message.content}</Linkify>
                </p>
                <div
                  className={`text-xs mt-1 ${
                    message.from === 'admin' ? 'text-primary-100' : 'text-gray-500'
                  } ${message.from === 'admin' ? 'text-right' : 'text-left'}`}
                >
                  {format(new Date(message.createdAt), 'MMM d, h:mm a')}
                  {message.from === 'user' && !message.read && (
                    <span className='ml-2 text-xs font-bold text-red-600'>(Unread)</span>
                  )}
                </div>
              </div>

              {message.from === 'admin' && (
                <div className='order-last flex items-center justify-center h-8 w-8 rounded-full bg-blue-500 text-white text-sm font-bold flex-shrink-0'>
                  A
                </div>
              )}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} className='p-4 bg-white border-t border-gray-200'>
        <div className='flex items-center gap-3'>
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={`Reply to ${user.firstName}...`}
            className='flex-grow rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none bg-gray-100'
            rows={1}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (newMessage.trim()) {
                  sendMessage(e);
                }
              }
            }}
          />
          <button
            type='submit'
            disabled={!newMessage.trim()}
            className='px-4 py-2 rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0'
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
