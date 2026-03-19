import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('pizzconnect_user');
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  });
  const [loading, setLoading] = useState(false);

  const persistUser = (u) => {
    setUser(u);
    if (u) localStorage.setItem('pizzconnect_user', JSON.stringify(u));
    else localStorage.removeItem('pizzconnect_user');
  };

  const register = async (data) => {
    setLoading(true);
    try {
      const res = await authAPI.register(data);
      persistUser(res.data.user);
      toast.success('Registered successfully! 🎉');
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed';
      toast.error(msg);
      return { success: false, message: msg };
    } finally { setLoading(false); }
  };

  const login = async (data) => {
    setLoading(true);
    try {
      const res = await authAPI.login(data);
      persistUser(res.data.user);
      toast.success(`Welcome back, ${res.data.user.name}! 🍕`);
      return { success: true, user: res.data.user };
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed';
      toast.error(msg);
      return { success: false };
    } finally { setLoading(false); }
  };

  const logout = async () => {
    try { await authAPI.logout(); } catch {}
    persistUser(null);
    toast.success('Logged out successfully');
  };

  const updateUser = (updates) => {
    const updated = { ...user, ...updates };
    persistUser(updated);
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
