// Example: How to use Authentication & Authorization in your React components

import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

// ============================================
// EXAMPLE 1: Login Component
// ============================================
export const LoginExample = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/user/login', formData);
      
      if (response.data.success) {
        // Store user data and token
        login(response.data.user, response.data.token);
        
        // Redirect based on role
        const { role } = response.data.user;
        if (role === 'admin') {
          navigate('/admin-dashboard');
        } else if (role === 'dentist') {
          navigate('/dentist-dashboard');
        } else {
          navigate('/');
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="text"
        placeholder="Username"
        value={formData.username}
        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
      />
      <input
        type="password"
        placeholder="Password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
      />
      {error && <div className="error">{error}</div>}
      <button type="submit">Login</button>
    </form>
  );
};

// ============================================
// EXAMPLE 2: Register Component with Role Selection
// ============================================
export const RegisterExample = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'patient' // Default role
  });

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/user/register', formData);
      
      if (response.data.success) {
        alert('Registration successful! Please login.');
        navigate('/login');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <input
        type="text"
        placeholder="Username"
        value={formData.username}
        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
      />
      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
      />
      <input
        type="password"
        placeholder="Password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
      />
      <select
        value={formData.role}
        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
      >
        <option value="patient">Patient</option>
        <option value="dentist">Dentist</option>
        {/* Admin accounts should be created by existing admins */}
      </select>
      <button type="submit">Register</button>
    </form>
  );
};

// ============================================
// EXAMPLE 3: Role-based Conditional Rendering
// ============================================
export const DashboardExample = () => {
  const { user, isAdmin, isDentist, isPatient } = useAuth();

  return (
    <div>
      <h1>Welcome, {user?.username}!</h1>
      <p>Role: {user?.role}</p>

      {/* Show admin panel only to admins */}
      {isAdmin() && (
        <div className="admin-panel">
          <h2>Admin Controls</h2>
          <button>Manage Users</button>
          <button>View All Appointments</button>
          <button>System Settings</button>
        </div>
      )}

      {/* Show dentist panel to both dentists and admins */}
      {(isDentist() || isAdmin()) && (
        <div className="dentist-panel">
          <h2>Dentist Tools</h2>
          <button>My Appointments</button>
          <button>Patient Records</button>
          <button>Manage Products</button>
        </div>
      )}

      {/* Show patient panel to all authenticated users */}
      {isPatient() && (
        <div className="patient-panel">
          <h2>My Dashboard</h2>
          <button>Book Appointment</button>
          <button>My Appointments</button>
          <button>Medical History</button>
        </div>
      )}
    </div>
  );
};

// ============================================
// EXAMPLE 4: Making Authenticated API Calls
// ============================================
export const UserManagementExample = () => {
  const [users, setUsers] = useState([]);
  const { isAdmin } = useAuth();

  useEffect(() => {
    if (isAdmin()) {
      fetchUsers();
    }
  }, []);

  const fetchUsers = async () => {
    try {
      // Token is automatically added by api interceptor
      const response = await api.get('/user/getAllUsers');
      setUsers(response.data.user);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    }
  };

  const deleteUser = async (userId) => {
    try {
      await api.delete(`/user/deleteUserById/${userId}`);
      fetchUsers(); // Refresh list
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete user');
    }
  };

  if (!isAdmin()) {
    return <div>Access Denied</div>;
  }

  return (
    <div>
      <h2>User Management</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <button onClick={() => deleteUser(user.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// ============================================
// EXAMPLE 5: Product Management (Admin/Dentist)
// ============================================
export const ProductManagementExample = () => {
  const { hasRole } = useAuth();
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', price: '' });

  // Check if user can manage products
  const canManageProducts = hasRole(['admin', 'dentist']);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      // Public route - no auth required
      const response = await api.get('/product/getAllProducts');
      setProducts(response.data.products);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    }
  };

  const addProduct = async (e) => {
    e.preventDefault();
    try {
      // Protected route - requires admin or dentist role
      await api.post('/product/addProduct', newProduct);
      fetchProducts();
      setNewProduct({ name: '', price: '' });
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add product');
    }
  };

  const deleteProduct = async (productId) => {
    try {
      // Admin only route
      await api.delete(`/product/deleteProduct/${productId}`);
      fetchProducts();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete product');
    }
  };

  return (
    <div>
      <h2>Products</h2>
      
      {/* Add product form - only for admin/dentist */}
      {canManageProducts && (
        <form onSubmit={addProduct}>
          <input
            type="text"
            placeholder="Product Name"
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
          />
          <input
            type="number"
            placeholder="Price"
            value={newProduct.price}
            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
          />
          <button type="submit">Add Product</button>
        </form>
      )}

      {/* Product list */}
      <ul>
        {products.map(product => (
          <li key={product.id}>
            {product.name} - ${product.price}
            {canManageProducts && (
              <button onClick={() => deleteProduct(product.id)}>Delete</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

// ============================================
// EXAMPLE 6: Using ProtectedRoute in App.jsx
// ============================================
export const AppRoutingExample = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginExample />} />
      <Route path="/register" element={<RegisterExample />} />
      <Route path="/" element={<Home />} />

      {/* Protected routes - any authenticated user */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <DashboardExample />
        </ProtectedRoute>
      } />

      {/* Admin only routes */}
      <Route path="/admin-dashboard" element={
        <ProtectedRoute requiredRole="admin">
          <AdminDashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/user-management" element={
        <ProtectedRoute requiredRole="admin">
          <UserManagementExample />
        </ProtectedRoute>
      } />

      {/* Dentist and Admin routes */}
      <Route path="/dentist-dashboard" element={
        <ProtectedRoute requiredRole={['admin', 'dentist']}>
          <DentistDashboard />
        </ProtectedRoute>
      } />

      <Route path="/product-management" element={
        <ProtectedRoute requiredRole={['admin', 'dentist']}>
          <ProductManagementExample />
        </ProtectedRoute>
      } />

      {/* Patient routes */}
      <Route path="/appointments" element={
        <ProtectedRoute requiredRole="patient">
          <PatientAppointments />
        </ProtectedRoute>
      } />
    </Routes>
  );
};

// ============================================
// EXAMPLE 7: Header with Role-based Navigation
// ============================================
export const HeaderExample = () => {
  const { user, isAuthenticated, isAdmin, isDentist, logout } = useAuth();

  return (
    <header>
      <nav>
        <a href="/">Home</a>
        
        {!isAuthenticated() ? (
          <>
            <a href="/login">Login</a>
            <a href="/register">Register</a>
          </>
        ) : (
          <>
            <span>Welcome, {user?.username}</span>
            <a href="/dashboard">Dashboard</a>
            
            {isAdmin() && (
              <>
                <a href="/admin-dashboard">Admin Panel</a>
                <a href="/user-management">Manage Users</a>
              </>
            )}
            
            {(isAdmin() || isDentist()) && (
              <>
                <a href="/product-management">Manage Products</a>
                <a href="/dentist-dashboard">Dentist Panel</a>
              </>
            )}
            
            <button onClick={logout}>Logout</button>
          </>
        )}
      </nav>
    </header>
  );
};

// ============================================
// EXAMPLE 8: Forgot Password Flow
// ============================================
export const ForgotPasswordExample = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/user/forgot-password', { email });
      setMessage(response.data.message);
      // In development, the reset link will be in the response
      console.log('Reset link:', response.data.resetLink);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error sending reset email');
    }
  };

  return (
    <form onSubmit={handleForgotPassword}>
      <h2>Forgot Password</h2>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button type="submit">Send Reset Link</button>
      {message && <p>{message}</p>}
    </form>
  );
};

export const ResetPasswordExample = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ token: '', newPassword: '' });

  useEffect(() => {
    // Get token from URL query params
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      setFormData({ ...formData, token });
    }
  }, []);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/user/reset-password', formData);
      alert(response.data.message);
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.message || 'Error resetting password');
    }
  };

  return (
    <form onSubmit={handleResetPassword}>
      <h2>Reset Password</h2>
      <input
        type="password"
        placeholder="New Password"
        value={formData.newPassword}
        onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
      />
      <button type="submit">Reset Password</button>
    </form>
  );
};
