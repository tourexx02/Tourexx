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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing authentication on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('adminToken');
    const storedAdmin = localStorage.getItem('adminData');

    if (storedToken && storedAdmin) {
      try {
        const adminData = JSON.parse(storedAdmin);
        setToken(storedToken);
        setAdmin(adminData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing stored admin data:', error);
        // Clear invalid data
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminData');
      }
    }
    setLoading(false);
  }, []);

  const login = (adminData, authToken) => {
    setAdmin(adminData);
    setToken(authToken);
    setIsAuthenticated(true);
    localStorage.setItem('adminToken', authToken);
    localStorage.setItem('adminData', JSON.stringify(adminData));
  };

  const logout = async () => {
    try {
      // Call logout API
      const apiBaseUrl = import.meta.env.VITE_SERVER_BASE_URL || 'http://localhost:8080/api';
      await fetch(`${apiBaseUrl}/admin/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      // Clear local state and storage regardless of API response
      setAdmin(null);
      setToken(null);
      setIsAuthenticated(false);
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminData');
    }
  };

  const value = {
    isAuthenticated,
    admin,
    token,
    loading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
