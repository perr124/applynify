'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { MessageSquare, Send } from 'lucide-react';
import { format } from 'date-fns';
import Linkify from 'react-linkify';
import { useMessageContext } from '@/app/contexts/MessageContext';

interface Message {
  _id: string;
  from: 'admin' | 'user';
  content: string;
  read: boolean;
  createdAt: Date;
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

export default function MessagesPage() {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [newMessageContent, setNewMessageContent] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { setHasUnreadMessages } = useMessageContext();

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
      } else {
        // Update the global unread status
        setHasUnreadMessages(false);
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

    const tempId = `temp-${Date.now()}`;
    const optimisticMessage: Message = {
      _id: tempId,
      from: 'user',
      content: newMessageContent,
      read: true,
      createdAt: new Date(),
    };

    setMessages((prev) => [...prev, optimisticMessage]);
    const currentMessage = newMessageContent;
    setNewMessageContent('');

    try {
      await markAdminMessagesAsRead();

      const response = await fetch('/api/user/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: currentMessage }),
      });

      if (response.ok) {
        fetchMessages();
      } else {
        setMessages((prev) => prev.filter((msg) => msg._id !== tempId));
        setNewMessageContent(currentMessage);
        console.error('Failed to send message');
      }
    } catch (error) {
      setMessages((prev) => prev.filter((msg) => msg._id !== tempId));
      setNewMessageContent(currentMessage);
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className='flex flex-col h-[calc(100vh-100px)]'>
      <div className='p-4 border-b border-gray-200 bg-white'>
        <div className='flex items-center gap-2'>
          <MessageSquare className='h-6 w-6 text-gray-600' />
          <h1 className='text-xl font-semibold text-gray-800'>Messages from Admin</h1>
        </div>
      </div>

      <div className='flex-grow overflow-y-auto p-4 space-y-4 bg-gray-50'>
        {loading ? (
          <div className='flex justify-center items-center h-full'>Loading...</div>
        ) : messages.length === 0 ? (
          <div className='text-center text-gray-500 py-8'>No messages yet.</div>
        ) : (
          messages.map((message) => (
            <div
              key={message._id}
              className={`flex items-end gap-2 ${
                message.from === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.from === 'admin' && (
                <div className='flex items-center justify-center h-8 w-8 rounded-full bg-primary-500 text-white text-sm font-bold flex-shrink-0'>
                  A
                </div>
              )}

              <div
                className={`max-w-xs lg:max-w-md p-3 rounded-lg shadow-sm ${
                  message.from === 'user' ? 'bg-primary-600 text-white' : 'bg-white text-gray-800'
                }`}
              >
                <p className='text-sm whitespace-pre-wrap break-words overflow-wrap-anywhere'>
                  <Linkify componentDecorator={linkDecorator}>{message.content}</Linkify>
                </p>
                <div
                  className={`text-xs mt-1 ${
                    message.from === 'user' ? 'text-primary-100' : 'text-gray-500'
                  } ${message.from === 'user' ? 'text-right' : 'text-left'}`}
                >
                  {format(new Date(message.createdAt), 'MMM d, h:mm a')}
                  {message.from === 'admin' && !message.read && (
                    <span className='ml-2 text-xs font-bold text-red-600'>(Unread)</span>
                  )}
                </div>
              </div>

              {message.from === 'user' && (
                <div className='flex items-center justify-center h-8 w-8 rounded-full bg-gray-300 text-gray-700 text-sm font-bold flex-shrink-0'>
                  {(session?.user as { firstName?: string; name?: string })?.name
                    ?.charAt(0)
                    .toUpperCase() || 'U'}
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
            value={newMessageContent}
            onChange={(e) => setNewMessageContent(e.target.value)}
            placeholder='Type your message...'
            className='flex-grow rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none bg-gray-100'
            rows={1}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (newMessageContent.trim()) {
                  sendMessage(e);
                }
              }
            }}
          />
          <button
            type='submit'
            disabled={!newMessageContent.trim()}
            className='px-4 py-2 rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0'
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
