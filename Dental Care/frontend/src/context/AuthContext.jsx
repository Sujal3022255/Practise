import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (storedUser && token) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const login = (userData, token) => {
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    toast.success('Logged out successfully');
    navigate('/login');
  };

  /**
   * Check if user has a specific role
   * @param {string|string[]} role - Single role or array of roles to check
   * @returns {boolean} - True if user has the role
   */
  const hasRole = (role) => {
    if (!user || !user.role) return false;
    
    // Admin has access to everything
    if (user.role === 'admin') return true;
    
    // Check if role is an array
    if (Array.isArray(role)) {
      return role.includes(user.role);
    }
    
    // Check single role
    return user.role === role;
  };

  /**
   * Check if user is authenticated
   * @returns {boolean} - True if user is logged in
   */
  const isAuthenticated = () => {
    return !!user && !!localStorage.getItem('token');
  };

  /**
   * Check if current user is a patient
   * @returns {boolean}
   */
  const isPatient = () => hasRole('patient');

  /**
   * Check if current user is a dentist
   * @returns {boolean}
   */
  const isDentist = () => hasRole('dentist');

  /**
   * Check if current user is an admin
   * @returns {boolean}
   */
  const isAdmin = () => user?.role === 'admin';

  const value = {
    user,
    login,
    logout,
    hasRole,
    isAuthenticated,
    isPatient,
    isDentist,
    isAdmin,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
