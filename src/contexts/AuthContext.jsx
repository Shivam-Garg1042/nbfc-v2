import React, { createContext, useContext, useState, useEffect } from 'react';
import ApiService from '../services/api';

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

  // Check if user is ChargeUp (admin/employee) - can see global filter
  const isChargeUpUser = user?.role === 'admin' || user?.role === 'employee';
  
  // Check authentication status on app load ONLY ONCE
  useEffect(() => {
    checkAuth();
  }, []); // Empty array = runs only once

  const checkAuth = async () => {
    try {
      setLoading(true);
      // console.log('🔍 Checking authentication status...');
      const response = await ApiService.checkAuth();
      // console.log('✅ Auth check response:', response);
      
      if (response.success) {
        // console.log('👤 User authenticated:', response.data);
        setUser(response.data);
      } else {
        // console.log('❌ Authentication failed:', response.error);
        setUser(null);
      }
    } catch (error) {
      // console.log('🚫 Not authenticated:', error.message);
      setUser(null);
    } finally {
      setLoading(false);
      // console.log('✨ Auth check complete');
    }
  };

  const login = async (email, password) => {
    try {
      // console.log('🔑 Attempting login for:', email);
      const response = await ApiService.login(email, password);
      // console.log('📋 Login response:', response);
      
      if (response.success) {
        // console.log('✅ Login successful, setting user:', response.data);
        setUser(response.data);
        return { success: true };
      } else {
        // console.log('❌ Login failed:', response.error);
        return { success: false, error: response.error || 'Login failed' };
      }
    } catch (error) {
      // console.error('🚨 Login error:', error);
      return { success: false, error: error.message || 'Unable to connect to server' };
    }
  };

  const logout = async () => {
    try {
      await ApiService.logout();
    } catch (error) {
      console.log('Logout error:', error);
    } finally {
      setUser(null);
    }
  };

  const value = {
    user,
    loading,
    isChargeUpUser,
    login,
    logout,
    checkAuth,
    // Helper functions for role checking
    isAdmin: () => user?.role === 'admin',
    isEmployee: () => user?.role === 'employee', 
    isNBFC: () => user?.role === 'nbfc',
    canViewGlobalFilter: () => isChargeUpUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};