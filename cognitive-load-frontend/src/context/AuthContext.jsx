import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { mockData } from '../services/mockData';

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
        const userData = await authService.verifyToken(token);
        setUser(userData);
        setIsAuthenticated(true);
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
      // Demo accounts for testing
      const demoAccounts = {
        'student@demo.com': {
          id: 1,
          name: 'Demo Student',
          email: 'student@demo.com',
          role: 'student',
          avatar: '/images/profile-1.jpg'
        },
        'professor@demo.com': {
          id: 2,
          name: 'Dr. Demo Professor',
          email: 'professor@demo.com',
          role: 'professor',
          avatar: '/images/profile-2.jpeg'
        },
        'admin@demo.com': {
          id: 3,
          name: 'Demo Admin',
          email: 'admin@demo.com',
          role: 'admin',
          avatar: '/images/profile-3.jpg'
        }
      };

      // Check if it's a demo account
      if (demoAccounts[email] && password === 'demo123') {
        const userData = demoAccounts[email];
        const demoToken = `demo_token_${userData.role}_${Date.now()}`;
        
        // Add mock data to user object
        userData.mockData = mockData[userData.role];
        
        localStorage.setItem('token', demoToken);
        localStorage.setItem('demo_user', JSON.stringify(userData));
        setUser(userData);
        setIsAuthenticated(true);
        
        return userData;
      }

      // Regular API login for non-demo accounts
      const response = await authService.login(email, password);
      const { user: userData, token } = response;
      
      localStorage.setItem('token', token);
      setUser(userData);
      setIsAuthenticated(true);
      
      return userData;
    } catch (error) {
      throw error;
    }
  };

  const signup = async (userData) => {
    try {
      const response = await authService.signup(userData);
      const { user: newUser, token } = response;
      
      localStorage.setItem('token', token);
      setUser(newUser);
      setIsAuthenticated(true);
      
      return newUser;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('demo_user');
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