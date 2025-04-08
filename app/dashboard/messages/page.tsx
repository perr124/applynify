'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { MessageSquare, Send } from 'lucide-react';
import { format } from 'date-fns';

interface Message {
  from: 'admin' | 'user';
  content: string;
  read: boolean;
  createdAt: Date;
}

export default function MessagesPage() {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyContent, setReplyContent] = useState('');
  const [replyingTo, setReplyingTo] = useState<number | null>(null);

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

  const sendReply = async (e: React.FormEvent, index: number) => {
    e.preventDefault();
    if (!replyContent.trim()) return;

    try {
      const response = await fetch('/api/user/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: replyContent }),
      });

      if (response.ok) {
        setReplyContent('');
        setReplyingTo(null);
        fetchMessages();
      }
    } catch (error) {
      console.error('Error sending reply:', error);
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
            messages.map((message, index) => (
              <div key={index}>
                <div className={`p-4 ${!message.read ? 'bg-primary-50' : ''}`}>
                  <div className='flex justify-between items-start mb-2'>
                    <div className='flex items-center gap-2'>
                      <span
                        className={`text-sm font-medium ${
                          message.from === 'admin' ? 'text-primary-600' : 'text-gray-600'
                        }`}
                      >
                        {message.from === 'admin' ? 'Admin' : 'You'}
                      </span>
                      {!message.read && (
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

                  {message.from === 'admin' && (
                    <div className='mt-4'>
                      <button
                        onClick={() => setReplyingTo(replyingTo === index ? null : index)}
                        className='text-sm text-primary-600 hover:text-primary-700'
                      >
                        {replyingTo === index ? 'Cancel Reply' : 'Reply'}
                      </button>
                    </div>
                  )}
                </div>

                {replyingTo === index && (
                  <div className='bg-gray-50 p-4'>
                    <form onSubmit={(e) => sendReply(e, index)} className='space-y-2'>
                      <textarea
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        placeholder='Type your reply...'
                        className='w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 min-h-[100px]'
                      />
                      <div className='flex justify-end gap-2'>
                        <button
                          type='button'
                          onClick={() => {
                            setReplyingTo(null);
                            setReplyContent('');
                          }}
                          className='px-4 py-2 text-sm text-gray-600 hover:text-gray-700'
                        >
                          Cancel
                        </button>
                        <button
                          type='submit'
                          className='bg-primary-600 text-white rounded-md px-4 py-2 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500'
                        >
                          Send Reply
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
