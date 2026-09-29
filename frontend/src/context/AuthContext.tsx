import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../api';

interface User {
  id: string;
  username: string;
  fullName: string;
  email: string;
  phone?: string;
  role: string;
  verified: boolean;
  workerId?: string;
  profileComplete?: number;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (usernameOrEmail: string, password: string) => Promise<void>;
  loginAsDemo: (role: 'WORKER' | 'GOVERNMENT' | 'PROJECT_AGENCY' | 'TRAINING_ORGANIZATION' | 'ADMIN') => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('nirmaansetu_token');
    const storedUser = localStorage.getItem('nirmaansetu_user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('nirmaansetu_user');
      }
    }
    setIsLoading(false);
  }, []);

  // Listen for 401 events dispatched by the api.ts interceptor.
  // Using a custom event avoids window.location.href which would cause a
  // full page reload (and re-trigger the startup splash — strictly forbidden).
  useEffect(() => {
    const handleUnauthorized = () => {
      setUser(null);
      setToken(null);
      // Navigation to /login is handled by ProtectedRoute via isAuthenticated=false
    };
    window.addEventListener('nirmaansetu:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('nirmaansetu:unauthorized', handleUnauthorized);
  }, []);


  const login = useCallback(async (usernameOrEmail: string, password: string) => {
    const response = await authApi.login(usernameOrEmail, password);
    const data = response.data.data;
    setToken(data.token);
    setUser({
      id: data.id,
      username: data.username,
      fullName: data.fullName,
      email: data.email,
      role: data.role,
      verified: data.verified ?? false,
      workerId: data.workerId,
    });
    localStorage.setItem('nirmaansetu_token', data.token);
    localStorage.setItem('nirmaansetu_user', JSON.stringify(data));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    authApi.logout();
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const response = await authApi.me();
      const data = response.data.data;
      setUser(data);
      localStorage.setItem('nirmaansetu_user', JSON.stringify(data));
    } catch {
      logout();
    }
  }, [logout]);

  const loginAsDemo = useCallback(async (role: 'WORKER' | 'GOVERNMENT' | 'PROJECT_AGENCY' | 'TRAINING_ORGANIZATION' | 'ADMIN') => {
    const demoUsernames: Record<string, string> = {
      GOVERNMENT: 'govt.pune',
      PROJECT_AGENCY: 'agency.mhada',
      WORKER: 'ramesh.kumar',
      ADMIN: 'admin',
      TRAINING_ORGANIZATION: 'training.itiPune',
    };
    const username = demoUsernames[role] || 'admin';
    await login(username, 'NirmaanSetu@2024');
  }, [login]);

  return (
    <AuthContext.Provider value={{
      user, token, isLoading,
      isAuthenticated: !!user,
      login, loginAsDemo, logout, refreshUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
