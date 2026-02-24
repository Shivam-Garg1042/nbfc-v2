import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, requiredRole = null, requiredRoles = null }) => {
  const { user, loading } = useAuth();

  

  if (loading) {
    // console.log('⏳ Still loading auth...');
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>;
  }

  if (!user) {
    // console.log('🚫 No user found, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  // Role-based access control
  if (Array.isArray(requiredRoles) && requiredRoles.length > 0) {
    if (!requiredRoles.includes(user.role)) {
      return <Navigate to="/unauthorized" replace />;
    }
  } else if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

 
  return children;
};

export default ProtectedRoute;