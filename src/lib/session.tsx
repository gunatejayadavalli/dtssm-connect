
'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { User } from '@/lib/types';

interface Session {
  user: Partial<User> | null;
}

interface SessionContextValue {
  session: Session | null;
  isLoading: boolean;
}

const SessionContext = createContext<SessionContextValue | undefined>(undefined);

// Define a type for the response from /api/session
interface SessionApiResponse {
    user: Partial<User> | null;
}

async function getSession(): Promise<Session | null> {
  try {
    const res = await fetch('/api/session');
    if (!res.ok) {
        if (res.status === 401) {
            return null; // Not authenticated
        }
        throw new Error('Failed to fetch session');
    }
    const data: SessionApiResponse = await res.json();
    return data.user ? { user: data.user } : null;
  } catch (error) {
    console.error("Error fetching session:", error);
    return null;
  }
}

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      const sessionData = await getSession();
      setSession(sessionData);
      setIsLoading(false);
    };
    fetchSession();
  }, []);

  return (
    <SessionContext.Provider value={{ session, isLoading }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}
