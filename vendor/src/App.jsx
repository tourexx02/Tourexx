import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './components/Login';
import CustomerQuery from './components/CustomerQuery';
import HotelOnboarding from './components/HotelOnboarding';
import RestaurantOnboarding from './components/RestaurantOnboarding';
import TransportOnboarding from './components/TransportOnboarding';
import TripOrganizerOnboarding from './components/TripOrganizerOnboarding';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2F4157] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Main App Component
const AppContent = () => {
  const { isAuthenticated, login } = useAuth();

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#2F4157',
            color: '#fff',
          },
          success: {
            iconTheme: {
              primary: '#10B981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: '#fff',
            },
          },
        }}
      />
      
      <Routes>
        {/* Login Route */}
        <Route 
          path="/login" 
          element={
            isAuthenticated ? (
              <Navigate to="/customer-query" replace />
            ) : (
              <Login onLogin={login} />
            )
          } 
        />
        
        {/* Protected Routes */}
        <Route path="/" element={<Navigate to="/customer-query" replace />} />
        <Route 
          path="/customer-query" 
          element={
            <ProtectedRoute>
              <Layout>
                <CustomerQuery />
              </Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/hotel-onboarding" 
          element={
            <ProtectedRoute>
              <Layout>
                <HotelOnboarding />
              </Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/restaurant-onboarding" 
          element={
            <ProtectedRoute>
              <Layout>
                <RestaurantOnboarding />
              </Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/transport-onboarding" 
          element={
            <ProtectedRoute>
              <Layout>
                <TransportOnboarding />
              </Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/trip-organizer-onboarding" 
          element={
            <ProtectedRoute>
              <Layout>
                <TripOrganizerOnboarding />
              </Layout>
            </ProtectedRoute>
          } 
        />
        
        {/* 404 Page */}
        <Route 
          path="*" 
          element={
            <ProtectedRoute>
              <Layout>
                <div className="flex items-center justify-center min-h-screen bg-gray-50">
                  <div className="text-center">
                    <h1 className="text-4xl font-bold text-[#2F4157] mb-4">404</h1>
                    <p className="text-gray-600 mb-4">Page not found</p>
                    <a
                      href="/customer-query"
                      className="bg-[#2F4157] text-white px-6 py-2 rounded-lg hover:bg-[#1e2d3d] transition-colors"
                    >
                      Go to Dashboard
                    </a>
                  </div>
                </div>
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
};

export default App;