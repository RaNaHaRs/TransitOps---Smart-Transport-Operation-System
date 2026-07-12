import { createContext, useContext, useEffect, useState } from 'react';
import * as authService from '@/services/authService';
import { ROLE_CONFIG } from '@/utils/roleConfig';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Rehydrate session on page load
  useEffect(() => {
    const stored = localStorage.getItem('transit_user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem('transit_user');
        localStorage.removeItem('transit_token');
      }
    }
    setLoading(false);
  }, []);

  async function login(email, password) {
    const { user: loggedIn, token } = await authService.login(email, password);
    localStorage.setItem('transit_token', token);
    localStorage.setItem('transit_user', JSON.stringify(loggedIn));
    setUser(loggedIn);
    return loggedIn;
  }

  function logout() {
    localStorage.removeItem('transit_token');
    localStorage.removeItem('transit_user');
    setUser(null);
  }

  const isAuthenticated = !!user;
  const role = user?.role || null;
  const dashboardPath = role ? ROLE_CONFIG[role]?.dashboard : '/login';

  return (
    <AuthContext.Provider value={{ user, role, isAuthenticated, loading, login, logout, dashboardPath }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
