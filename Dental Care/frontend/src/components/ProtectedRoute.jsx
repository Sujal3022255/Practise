import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute component - Protects routes based on authentication and role
 * @param {React.ReactNode} children - The component to render if authorized
 * @param {string|string[]} requiredRole - Role(s) required to access the route
 * @param {string} redirectTo - Where to redirect if unauthorized (default: '/login')
 */
const ProtectedRoute = ({ children, requiredRole, redirectTo = '/login' }) => {
  const { isAuthenticated, hasRole, loading, user } = useAuth();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px',
        color: '#667eea',
        gap: '10px'
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  // Check role if required
  if (requiredRole) {
    // Support both single role and array of roles
    const hasRequiredRole = hasRole(requiredRole);
    
    if (!hasRequiredRole) {
      // Redirect based on current user's role
      const roleBasedRedirect = {
        'patient': '/',
        'dentist': '/dentist-dashboard',
        'admin': '/admin-dashboard'
      };
      
      return <Navigate to={roleBasedRedirect[user?.role] || redirectTo} replace />;
    }
  }

  // User is authenticated and has required role
  return children;
};

export default ProtectedRoute;
