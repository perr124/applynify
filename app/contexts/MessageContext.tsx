'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface MessageContextType {
  hasUnreadMessages: boolean;
  setHasUnreadMessages: (status: boolean) => void;
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export function MessageProvider({ children }: { children: ReactNode }) {
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);

  return (
    <MessageContext.Provider value={{ hasUnreadMessages, setHasUnreadMessages }}>
      {children}
    </MessageContext.Provider>
  );
}

export function useMessageContext() {
  const context = useContext(MessageContext);
  if (context === undefined) {
    throw new Error('useMessageContext must be used within a MessageProvider');
  }
  return context;
}
