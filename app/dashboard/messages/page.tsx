'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { MessageSquare, Send } from 'lucide-react';
import { format } from 'date-fns';

interface Message {
  _id: string;
  from: 'admin' | 'user';
  content: string;
  read: boolean;
  createdAt: Date;
}

export default function MessagesPage() {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [newMessageContent, setNewMessageContent] = useState('');

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/user/messages');
      const data = await response.json();
      setMessages(data.messages || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAdminMessagesAsRead = async () => {
    setMessages((prevMessages) =>
      prevMessages.map((msg) => (msg.from === 'admin' && !msg.read ? { ...msg, read: true } : msg))
    );

    try {
      const response = await fetch(`/api/user/messages/read`, {
        method: 'PATCH',
      });

      if (!response.ok) {
        console.error('Failed to mark admin messages as read on server');
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.from === 'admin' && msg.read ? { ...msg, read: false } : msg
          )
        );
      }
    } catch (error) {
      console.error('Error marking admin messages as read:', error);
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.from === 'admin' && msg.read ? { ...msg, read: false } : msg
        )
      );
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessageContent.trim()) return;

    try {
      await markAdminMessagesAsRead();

      const response = await fetch('/api/user/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: newMessageContent }),
      });

      if (response.ok) {
        setNewMessageContent('');
        fetchMessages();
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (loading) {
    return <div className='flex justify-center items-center h-64'>Loading...</div>;
  }

  return (
    <div className='max-w-4xl mx-auto p-6'>
      <div className='flex items-center gap-2 mb-6'>
        <MessageSquare className='h-6 w-6' />
        <h1 className='text-2xl font-semibold'>Messages</h1>
      </div>

      <div className='bg-white rounded-lg shadow-sm border border-gray-200'>
        <div className='divide-y divide-gray-200'>
          {messages.length === 0 ? (
            <div className='text-center text-gray-500 py-8'>No messages yet.</div>
          ) : (
            messages.map((message) => (
              <div key={message._id}>
                <div
                  className={`p-4 ${
                    message.from === 'admin' && !message.read ? 'bg-primary-50' : ''
                  }`}
                >
                  <div className='flex justify-between items-start mb-2'>
                    <div className='flex items-center gap-2'>
                      <span
                        className={`text-sm font-medium ${
                          message.from === 'admin' ? 'text-primary-600' : 'text-gray-600'
                        }`}
                      >
                        {message.from === 'admin' ? 'Admin' : 'You'}
                      </span>
                      {message.from === 'admin' && !message.read && (
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
              </div>
            ))
          )}
        </div>
        <form onSubmit={sendMessage} className='border-t border-gray-200 p-4'>
          <div className='space-y-2'>
            <textarea
              value={newMessageContent}
              onChange={(e) => setNewMessageContent(e.target.value)}
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
