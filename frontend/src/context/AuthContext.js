import React, { createContext, useContext, useState, useEffect } from 'react';

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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('AuthProvider - checking existing auth');
    // Check if user is logged in on app start
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    console.log('AuthProvider - token:', token, 'userData:', userData);
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        console.log('AuthProvider - parsed user:', parsedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
    console.log('AuthProvider - initialization complete');
  }, []);

  const login = async (email, password) => {
    console.log('AuthProvider - login attempt:', email);
    try {
      // Mock login - replace with actual API call
      const mockUser = {
        id: 1,
        name: email === 'admin@company.com' ? 'Admin User' : 'John Doe',
        email: email,
        role: email === 'admin@company.com' ? 'ADMIN' : 'EMPLOYEE',
        department: 'IT'
      };
      
      const mockToken = 'mock-jwt-token-' + Date.now();
      
      console.log('AuthProvider - setting user data:', mockUser);
      
      localStorage.setItem('token', mockToken);
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      setUser(mockUser);
      setIsAuthenticated(true);
      
      console.log('AuthProvider - login successful');
      return { success: true };
    } catch (error) {
      console.error('AuthProvider - login error:', error);
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    console.log('AuthProvider - logout');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout
  };

  console.log('AuthProvider - current state:', { user, isAuthenticated, loading });

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
