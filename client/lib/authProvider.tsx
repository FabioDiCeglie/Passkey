'use client';

import { createContext, useEffect, useState } from 'react';
import { checkSession } from './api';

type AuthState = {
  loggedIn: boolean;
  error: string | null;
  username: string | null;
};

export const AuthContext = createContext<AuthState>({
  loggedIn: false,
  error: null,
  username: null,
});

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [authState, setAuthState] = useState<AuthState>({
    loggedIn: false,
    error: null,
    username: null,
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await checkSession();
        if (response.loggedIn) {
          setAuthState({
            loggedIn: true,
            error: null,
            username: response.username as string,
          });
        } else {
          setAuthState({
            loggedIn: false,
            error: null,
            username: null,
          });
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        setAuthState({
          loggedIn: false,
          error: 'Error checking authentication',
          username: null,
        });
      }
    };

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        loggedIn: authState.loggedIn,
        error: authState.error,
        username: authState.username,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
