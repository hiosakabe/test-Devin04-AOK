"use client";

import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { getAuthToken } from '../../utils/auth';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  isAuthenticated: boolean;
  user: any | null;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  token: null,
  login: async () => false,
  logout: () => {},
  loading: true,
});

export const useAuth = () => useContext(AuthContext);

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Check if user is authenticated on initial load
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Check if auth token exists in cookies
        const token = document.cookie
          .split('; ')
          .find(row => row.startsWith('auth_token='))
          ?.split('=')[1];

        if (token) {
          setIsAuthenticated(true);
          setToken(token);
          // In a real application, you would validate the token and get user details
          setUser({ email: 'user@example.com' }); // Placeholder
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const response = await getAuthToken("http://localhost:8000/token", email, password);
      
      if (response && response.access_token) {
        // Store token in cookie with 1-hour expiration (3600 seconds)
        document.cookie = `auth_token=${response.access_token}; path=/; max-age=3600`;
        setIsAuthenticated(true);
        setToken(response.access_token);
        setUser({ email }); // In a real app, you'd store user details
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    // Remove token from cookies
    document.cookie = 'auth_token=; path=/; max-age=0';
    setIsAuthenticated(false);
    setToken(null);
    setUser(null);
    router.push('/authentication/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
