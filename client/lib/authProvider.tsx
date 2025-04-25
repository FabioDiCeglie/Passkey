'use client';

import { createContext, useEffect, useState } from 'react';
import { checkSession } from './api';
import { useLocation,useNavigate } from 'react-router';

export  type AuthState = {
  error: string | null;
  username: string | null;
  loggedIn: boolean;
  isLoading: boolean;
};

export const AuthContext = createContext<AuthState & { setAuthState: React.Dispatch<React.SetStateAction<AuthState>> }>({
  loggedIn: false,
  error: null,
  username: null,
  isLoading: false,
  setAuthState: () => {},
});

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const [authState, setAuthState] = useState<AuthState>({
    error: null,
    username: null,
    isLoading: false,
    loggedIn: false,
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await checkSession();
        if (response.loggedIn) {
          setAuthState((prev) => ({
            ...prev,
            loggedIn: true,
            error: null,
            username: response.username as string,
          }));
        } else {
          setAuthState((prev) => ({
            ...prev,
            loggedIn: false,
            error: null,
            username: null,
          }));
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        setAuthState((prev) => ({
          ...prev,
          loggedIn: false,
          error: 'Error checking authentication',
          username: null,
        }));
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    if (!authState.loggedIn && location.pathname !== '/signup') {
      navigate('/login');
    } else if (authState.loggedIn && (location.pathname === '/signup' || location.pathname === '/login')) {
      navigate('/');
    }
  }, [authState.loggedIn]);

  return (
    <AuthContext.Provider
      value={{
        loggedIn: authState.loggedIn,
        error: authState.error,
        username: authState.username,
        isLoading: authState.isLoading,
        setAuthState: setAuthState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
