# 🔐 Authentication Quick Reference

## Roles
```javascript
'patient'  // Default role for users
'dentist'  // Healthcare providers
'admin'    // Full system access
```

## Backend Middleware

### authGuard - Verify JWT Token
```javascript
const authGuard = require('../helpers/authguard');
router.get('/protected', authGuard, controller);
```

### roleGuard - Check User Role
```javascript
const roleGuard = require('../helpers/roleGuard');

// Single role
router.get('/admin-only', authGuard, roleGuard('admin'), controller);

// Multiple roles
router.get('/staff', authGuard, roleGuard('admin', 'dentist'), controller);
```

## Frontend Hooks

### useAuth() Hook
```javascript
import { useAuth } from '../context/AuthContext';

const {
  user,              // Current user object
  login,             // login(userData, token)
  logout,            // Clear auth and redirect
  isAuthenticated,   // Check if logged in
  hasRole,           // hasRole('admin') or hasRole(['admin', 'dentist'])
  isPatient,         // Check if patient
  isDentist,         // Check if dentist
  isAdmin,           // Check if admin
  loading            // Loading state
} = useAuth();
```

## Protected Routes

### Single Role
```jsx
<Route path="/admin" element={
  <ProtectedRoute requiredRole="admin">
    <AdminDashboard />
  </ProtectedRoute>
} />
```

### Multiple Roles
```jsx
<Route path="/staff" element={
  <ProtectedRoute requiredRole={['admin', 'dentist']}>
    <StaffPanel />
  </ProtectedRoute>
} />
```

### Any Authenticated User
```jsx
<Route path="/dashboard" element={
  <ProtectedRoute>
    <Dashboard />
  </ProtectedRoute>
} />
```

## API Calls

### Import
```javascript
import { 
  loginUserApi,
  getAllUsersApi,
  createProductApi 
} from '../services/api';
```

### Usage (Token Auto-Attached)
```javascript
// Login
const response = await loginUserApi({ username, password });
login(response.data.user, response.data.token);

// Protected call
const users = await getAllUsersApi();

// With data
const product = await createProductApi({ name, price });
```

## Conditional Rendering

```jsx
const { isAdmin, isDentist, hasRole } = useAuth();

// Single role
{isAdmin() && <AdminPanel />}

// Multiple roles
{(isAdmin() || isDentist()) && <StaffTools />}

// Using hasRole
{hasRole(['admin', 'dentist']) && <ManageProducts />}
```

## API Endpoints

### Public
- `POST /api/user/login`
- `POST /api/user/register`
- `POST /api/user/forgot-password`
- `POST /api/user/reset-password`
- `GET /api/product/getAllProducts`
- `GET /api/product/getProduct/:id`

### Authenticated (Any)
- `PUT /api/user/updateUserById/:id`

### Admin Only
- `GET /api/user/getAllUsers`
- `DELETE /api/user/deleteUserById/:id`
- `DELETE /api/product/deleteProduct/:id`

### Admin + Dentist
- `GET /api/user/getUserById/:id`
- `POST /api/product/addProduct`
- `PUT /api/product/updateProduct/:id`

## Registration with Role

```javascript
const formData = {
  username: 'user123',
  email: 'user@example.com',
  password: 'password123',
  role: 'dentist' // optional, defaults to 'patient'
};
await createUserApi(formData);
```

## Error Handling

### Backend Response Codes
- `200` - Success
- `400` - Bad request (validation error)
- `401` - Unauthorized (not logged in / token expired)
- `403` - Forbidden (insufficient role)
- `404` - Not found
- `500` - Server error

### Frontend Auto-Handling
- 401 → Auto logout and redirect to login
- Token automatically attached to all requests
- No manual token management needed

## Environment Variables

### Backend `.env`
```env
JWT_SECRET=your-secret-key-here
JWT_TOKEN=your-secret-key-here
FRONTEND_URL=http://localhost:5173
```

### Frontend `.env`
```env
VITE_API_BASE_URL=http://localhost:5000
```

## Common Patterns

### Login Flow
```javascript
const handleLogin = async (formData) => {
  const response = await loginUserApi(formData);
  login(response.data.user, response.data.token);
  
  // Redirect based on role
  if (isAdmin()) navigate('/admin-dashboard');
  else if (isDentist()) navigate('/dentist-dashboard');
  else navigate('/');
};
```

### Logout
```javascript
const { logout } = useAuth();
<button onClick={logout}>Logout</button>
```

### Check Permission Before Action
```javascript
const deleteProduct = async (id) => {
  if (!isAdmin()) {
    alert('Admin access required');
    return;
  }
  await deleteProductByIdApi(id);
};
```

### Navigation Based on Role
```javascript
const { user, isAdmin, isDentist } = useAuth();

<nav>
  {isAdmin() && <Link to="/admin">Admin</Link>}
  {(isAdmin() || isDentist()) && <Link to="/products">Products</Link>}
  <Link to="/dashboard">Dashboard</Link>
</nav>
```

---

**📖 Full Documentation:** See `AUTHENTICATION_GUIDE.md`  
**💡 Examples:** See `frontend/AUTHENTICATION_EXAMPLES.jsx`  
**📋 Summary:** See `IMPLEMENTATION_SUMMARY.md`
