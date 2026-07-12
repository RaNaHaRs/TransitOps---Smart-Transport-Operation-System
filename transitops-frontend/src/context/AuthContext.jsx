import { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import * as authService from '@/services/authService';
import { ROLE_CONFIG } from '@/utils/roleConfig';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Rehydrate session on page load
  useEffect(() => {
    const stored = localStorage.getItem('transit_user');
    const expiry = localStorage.getItem('transit_expiry');
    
    if (stored) {
      if (expiry && Date.now() > parseInt(expiry, 10)) {
        // Session expired
        localStorage.removeItem('transit_user');
        localStorage.removeItem('transit_token');
        localStorage.removeItem('transit_expiry');
        toast.warning('Your session has expired. Please log in again.');
      } else {
        try {
          setUser(JSON.parse(stored));
        } catch {
          localStorage.removeItem('transit_user');
          localStorage.removeItem('transit_token');
          localStorage.removeItem('transit_expiry');
        }
      }
    }
    setLoading(false);
  }, []);

  async function login(email, password) {
    const { user: loggedIn, token } = await authService.login(email, password);
    localStorage.setItem('transit_token', token);
    localStorage.setItem('transit_user', JSON.stringify(loggedIn));
    
    // Set expiry to 7 days from now
    const expiryTime = Date.now() + 7 * 24 * 60 * 60 * 1000;
    localStorage.setItem('transit_expiry', expiryTime.toString());
    
    setUser(loggedIn);
    
    // Save to recent users
    try {
      const recentStr = localStorage.getItem('transit_recent_users');
      let recent = recentStr ? JSON.parse(recentStr) : [];
      // Remove if already exists to put at the front
      recent = recent.filter(u => u.email !== loggedIn.email);
      recent.unshift({ 
        id: loggedIn.id, 
        name: loggedIn.name, 
        email: loggedIn.email, 
        role: loggedIn.role,
        expiry: Date.now() + 7 * 24 * 60 * 60 * 1000 // 1 week expiry for quick login
      });
      // Keep up to 4 recent users
      if (recent.length > 4) recent = recent.slice(0, 4);
      localStorage.setItem('transit_recent_users', JSON.stringify(recent));
    } catch (e) {
      console.error('Failed to save recent user', e);
    }
    
    return loggedIn;
  }

  function logout() {
    localStorage.removeItem('transit_token');
    localStorage.removeItem('transit_user');
    localStorage.removeItem('transit_expiry');
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
