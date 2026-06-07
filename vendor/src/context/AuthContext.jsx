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
  const [vendor, setVendor] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing authentication on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('vendorToken');
    const storedVendor = localStorage.getItem('vendorData');

    if (storedToken && storedVendor) {
      try {
        const vendorData = JSON.parse(storedVendor);
        setToken(storedToken);
        setVendor(vendorData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing stored vendor data:', error);
        // Clear invalid data
        localStorage.removeItem('vendorToken');
        localStorage.removeItem('vendorData');
      }
    }
    setLoading(false);
  }, []);

  const login = (vendorData, authToken) => {
    setVendor(vendorData);
    setToken(authToken);
    setIsAuthenticated(true);
    localStorage.setItem('vendorToken', authToken);
    localStorage.setItem('vendorData', JSON.stringify(vendorData));
  };

  const logout = async () => {
    try {
      // No logout API needed for vendors, just clear local state
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local state and storage
      setVendor(null);
      setToken(null);
      setIsAuthenticated(false);
      localStorage.removeItem('vendorToken');
      localStorage.removeItem('vendorData');
    }
  };

  const value = {
    isAuthenticated,
    vendor,
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
