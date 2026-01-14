import { createContext, useContext, useState, useEffect } from 'react';
import api from '../apis/api'
import { mockData } from '../services/mockData';
import { supabase } from '../config/supabase';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        // Check if it's a demo token
        if (token.startsWith('demo_token_')) {
          const demoUser = localStorage.getItem('demo_user');
          if (demoUser) {
            const userData = JSON.parse(demoUser);
            setUser(userData);
            setIsAuthenticated(true);
            return;
          }
        }

        // Regular token verification
        const userData = localStorage.getItem('user');
        if (userData) {
          setUser(JSON.parse(userData));
          setIsAuthenticated(true);
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('demo_user');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      // Regular API login
      const response = await api.login(email, password);
      const { user: userData } = response;
      setUser(userData);
      setIsAuthenticated(true);
      return userData;
    } catch (error) {
      throw error;
    }
  };

  const signup = async (email, password, name, role) => {
    try {
      const response = await api.signup(email, password, name, role);
      const { user: newUser } = response;
      // Don't auto-login after signup, user needs to verify email
      return newUser;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('demo_user');
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user')
    setUser(null);
    setIsAuthenticated(false);
  };
  

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    signup,
    logout,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};