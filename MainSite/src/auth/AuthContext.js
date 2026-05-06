import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { API_BASE_URL } from '../config/apiConfig';
import { apiRequest } from '../api/apiClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const refreshSession = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiRequest('/api/auth/me', { method: 'GET' });
      setUser(response.user);
    } catch (_error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  const loginRedirect = useCallback((returnTo = '/dashboard') => {
    const loginUrl = new URL('/api/auth/login', API_BASE_URL);

    if (typeof returnTo === 'string' && returnTo.startsWith('/') && !returnTo.startsWith('//')) {
      loginUrl.searchParams.set('returnTo', returnTo);
    }

    window.location.assign(loginUrl.toString());
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiRequest('/api/auth/logout', { method: 'POST' });
    } catch (_error) {
      // Ignore network errors and still clear local state.
    }

    setUser(null);
    window.location.assign('/login');
  }, []);

  const value = useMemo(() => {
    const roles = user && Array.isArray(user.roles) ? user.roles : [];
    return {
      loading,
      user,
      roles,
      isAuthenticated: Boolean(user),
      refreshSession,
      loginRedirect,
      logout,
      hasAnyRole: (allowedRoles = []) => roles.some((role) => allowedRoles.includes(role))
    };
  }, [loading, user, refreshSession, loginRedirect, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}
