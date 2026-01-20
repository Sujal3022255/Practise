# Authentication & Authorization System

## Overview
This dental care application implements a comprehensive role-based authentication and authorization system using JWT tokens.

## Roles
The system supports three user roles:
- **patient** - Default role for regular users
- **dentist** - Healthcare providers with extended access
- **admin** - Full system access

## Backend Implementation

### 1. User Model
**File:** `backend/models/UserModel.js`

The User model includes:
- `id`: Auto-incremented primary key
- `username`: Unique username
- `email`: Unique email with validation
- `password`: Hashed password (bcrypt)
- `role`: ENUM('patient', 'dentist', 'admin') - defaults to 'patient'
- `resetToken`: Token for password reset
- `resetTokenExpiry`: Expiry date for reset token

### 2. Authentication Middleware
**File:** `backend/helpers/authguard.js`

The `authGuard` middleware:
- Validates JWT token from Authorization header (Bearer token)
- Verifies token signature and expiration
- Attaches decoded user data to `req.user`
- Returns specific error messages for expired/invalid tokens

**Usage:**
```javascript
router.get('/protected-route', authGuard, controller);
```

### 3. Authorization Middleware
**File:** `backend/helpers/roleGuard.js`

The `roleGuard` middleware:
- Checks if authenticated user has required role(s)
- Supports multiple allowed roles
- Must be used after `authGuard`

**Usage:**
```javascript
// Single role
router.get('/admin-only', authGuard, roleGuard('admin'), controller);

// Multiple roles
router.get('/staff-only', authGuard, roleGuard('admin', 'dentist'), controller);
```

### 4. Protected Routes
**File:** `backend/routes/UserRoutes.js`

#### Public Routes (No Authentication)
- `POST /api/user/login` - User login
- `POST /api/user/register` - User registration
- `POST /api/user/forgot-password` - Request password reset
- `POST /api/user/reset-password` - Reset password with token

#### Authenticated Routes (Any logged-in user)
- `GET /api/user/register` - Get active users
- `PUT /api/user/updateUserById/:id` - Update user profile

#### Admin & Dentist Routes
- `GET /api/user/getUserById/:id` - Get user by ID (admin or dentist)

#### Admin Only Routes
- `GET /api/user/getAllUsers` - Get all users
- `DELETE /api/user/deleteUserById/:id` - Delete user

### 5. User Controller
**File:** `backend/controllers/UserController.js`

#### Registration
```javascript
POST /api/user/register
Body: { username, email, password, role }
```
- Validates input fields
- Checks for existing username/email
- Hashes password with bcrypt
- Creates user with specified role (defaults to 'patient')
- Returns user data without password

#### Login
```javascript
POST /api/user/login
Body: { username, password }
```
- Validates credentials
- Generates JWT token with user data (id, username, email, role)
- Token expires in 7 days
- Returns token and user data

## Frontend Implementation

### 1. Auth Context
**File:** `frontend/src/context/AuthContext.jsx`

Provides authentication state and methods throughout the app:

#### Available Methods:
- `login(userData, token)` - Store user data and token
- `logout()` - Clear user data and redirect to login
- `isAuthenticated()` - Check if user is logged in
- `hasRole(role)` - Check if user has specific role(s)
- `isPatient()` - Check if user is a patient
- `isDentist()` - Check if user is a dentist
- `isAdmin()` - Check if user is an admin

#### State:
- `user` - Current user object { id, username, email, role }
- `loading` - Loading state during initialization

**Usage:**
```javascript
import { useAuth } from '../context/AuthContext';

function MyComponent() {
  const { user, isAdmin, logout } = useAuth();
  
  if (isAdmin()) {
    // Show admin content
  }
}
```

### 2. Protected Route Component
**File:** `frontend/src/components/ProtectedRoute.jsx`

Protects routes based on authentication and role.

**Usage:**
```jsx
import ProtectedRoute from './components/ProtectedRoute';

// Protect route - any authenticated user
<Route path="/dashboard" element={
  <ProtectedRoute>
    <Dashboard />
  </ProtectedRoute>
} />

// Admin only route
<Route path="/admin" element={
  <ProtectedRoute requiredRole="admin">
    <AdminDashboard />
  </ProtectedRoute>
} />

// Multiple roles
<Route path="/staff" element={
  <ProtectedRoute requiredRole={['admin', 'dentist']}>
    <StaffDashboard />
  </ProtectedRoute>
} />
```

### 3. API Service
**File:** `frontend/src/services/api.js`

Configure API calls with JWT token:

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api'
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 errors (token expired)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

## Security Best Practices

### Backend
1. **Password Hashing**: Using bcrypt with salt rounds of 10
2. **JWT Secret**: Store in environment variable `JWT_SECRET`
3. **Token Expiration**: Tokens expire after 7 days
4. **Input Validation**: Validate all user inputs
5. **Role Validation**: Validate roles against allowed values
6. **Error Messages**: Don't expose sensitive information in errors

### Frontend
1. **Token Storage**: Store in localStorage (consider httpOnly cookies for production)
2. **Automatic Logout**: Clear tokens on 401 responses
3. **Role-based UI**: Hide/show elements based on user role
4. **Protected Routes**: Always validate on backend, frontend is for UX only

## Environment Variables

Create a `.env` file in the backend directory:

```env
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_TOKEN=your-super-secret-jwt-key-change-this-in-production
FRONTEND_URL=http://localhost:5173
```

## Testing the System

### 1. Register Users with Different Roles

**Patient (default):**
```bash
curl -X POST http://localhost:5000/api/user/register \
  -H "Content-Type: application/json" \
  -d '{"username":"patient1","email":"patient@test.com","password":"password123"}'
```

**Dentist:**
```bash
curl -X POST http://localhost:5000/api/user/register \
  -H "Content-Type: application/json" \
  -d '{"username":"dentist1","email":"dentist@test.com","password":"password123","role":"dentist"}'
```

**Admin:**
```bash
curl -X POST http://localhost:5000/api/user/register \
  -H "Content-Type: application/json" \
  -d '{"username":"admin1","email":"admin@test.com","password":"password123","role":"admin"}'
```

### 2. Login and Get Token

```bash
curl -X POST http://localhost:5000/api/user/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin1","password":"password123"}'
```

Response:
```json
{
  "success": true,
  "message": "Login successful.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "admin1",
    "email": "admin@test.com",
    "role": "admin"
  }
}
```

### 3. Access Protected Routes

```bash
# Get all users (admin only)
curl -X GET http://localhost:5000/api/user/getAllUsers \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Get user by ID (admin or dentist)
curl -X GET http://localhost:5000/api/user/getUserById/1 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Common Errors and Solutions

### 401 Unauthorized
- Token missing or invalid
- Token expired (re-login required)
- Wrong token format (must be "Bearer TOKEN")

### 403 Forbidden
- User doesn't have required role
- Admin trying to access dentist-specific route (or vice versa)

### 400 Bad Request
- Missing required fields
- Invalid credentials
- Username/email already exists

## Migration Notes

If you have existing users with old roles ('user', 'admin'), you need to update the database:

```sql
-- Update existing 'user' role to 'patient'
UPDATE user SET role = 'patient' WHERE role = 'user';

-- Verify changes
SELECT id, username, email, role FROM user;
```

Or restart with fresh tables by restarting the server (if sync is enabled).

## Future Enhancements

1. **Refresh Tokens**: Implement refresh token mechanism
2. **Email Verification**: Verify email on registration
3. **Two-Factor Authentication**: Add 2FA for sensitive accounts
4. **Session Management**: Track active sessions
5. **Audit Logging**: Log all authentication events
6. **Rate Limiting**: Prevent brute force attacks
7. **OAuth Integration**: Add social login (Google, Facebook)
8. **Role Permissions**: Fine-grained permission system
