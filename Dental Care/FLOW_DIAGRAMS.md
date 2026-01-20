# Authentication & Authorization Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        AUTHENTICATION FLOW                                   │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────┐                                                      ┌──────────┐
│          │  1. Register                                         │          │
│  Client  │────────────────────────────────────────────────────▶│  Server  │
│          │     POST /api/user/register                          │          │
│          │     { username, email, password, role }              │          │
│          │                                                       │          │
│          │◀────────────────────────────────────────────────────│          │
│          │  2. Registration Success                             │          │
│          │     { success: true, user: {...} }                   │          │
│          │                                                       │          │
│          │                                                       │          │
│          │  3. Login                                            │          │
│          │────────────────────────────────────────────────────▶│          │
│          │     POST /api/user/login                             │          │
│          │     { username, password }                           │          │
│          │                                                       │          │
│          │                                        ┌─────────────┤          │
│          │                                        │ Verify      │          │
│          │                                        │ Password    │          │
│          │                                        │ (bcrypt)    │          │
│          │                                        └─────────────┤          │
│          │                                        ┌─────────────┤          │
│          │                                        │ Generate    │          │
│          │                                        │ JWT Token   │          │
│          │                                        │ (7d expiry) │          │
│          │                                        └─────────────┤          │
│          │◀────────────────────────────────────────────────────│          │
│          │  4. Login Success                                    │          │
│          │     { token: "eyJhbG...", user: {...} }              │          │
│          │                                                       │          │
│  ┌───────┤                                                       │          │
│  │ Store │                                                       │          │
│  │ Token │                                                       │          │
│  │ Local │                                                       │          │
│  └───────┤                                                       │          │
│          │                                                       │          │
│          │  5. Access Protected Route                           │          │
│          │────────────────────────────────────────────────────▶│          │
│          │     GET /api/user/getAllUsers                        │          │
│          │     Authorization: Bearer eyJhbG...                  │          │
│          │                                                       │          │
│          │                                        ┌─────────────┤          │
│          │                                        │ authGuard   │          │
│          │                                        │ Verify JWT  │          │
│          │                                        │ Extract user│          │
│          │                                        └─────────────┤          │
│          │                                        ┌─────────────┤          │
│          │                                        │ roleGuard   │          │
│          │                                        │ Check role  │          │
│          │                                        │ = 'admin'   │          │
│          │                                        └─────────────┤          │
│          │◀────────────────────────────────────────────────────│          │
│          │  6. Protected Data                                   │          │
│          │     { users: [...] }                                 │          │
│          │                                                       │          │
└──────────┘                                                       └──────────┘
```

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        AUTHORIZATION LEVELS                                  │
└─────────────────────────────────────────────────────────────────────────────┘

                              ┌─────────────┐
                              │    ADMIN    │
                              │             │
                              │  Full       │
                              │  Access     │
                              └──────┬──────┘
                                     │
                        ┌────────────┴────────────┐
                        │                         │
                  ┌─────▼──────┐          ┌──────▼─────┐
                  │  DENTIST   │          │  PATIENT   │
                  │            │          │            │
                  │ Manage     │          │ View       │
                  │ Products   │          │ Appts      │
                  │ View Users │          │ Book       │
                  └────────────┘          └────────────┘

PERMISSIONS MATRIX:

┌─────────────────────────┬─────────┬──────────┬─────────┐
│ Action                  │ Patient │ Dentist  │  Admin  │
├─────────────────────────┼─────────┼──────────┼─────────┤
│ Register                │    ✓    │    ✓     │    ✓    │
│ Login                   │    ✓    │    ✓     │    ✓    │
│ View Products           │    ✓    │    ✓     │    ✓    │
│ Update Own Profile      │    ✓    │    ✓     │    ✓    │
├─────────────────────────┼─────────┼──────────┼─────────┤
│ View User Details       │    ✗    │    ✓     │    ✓    │
│ Add Product             │    ✗    │    ✓     │    ✓    │
│ Update Product          │    ✗    │    ✓     │    ✓    │
├─────────────────────────┼─────────┼──────────┼─────────┤
│ View All Users          │    ✗    │    ✗     │    ✓    │
│ Delete User             │    ✗    │    ✗     │    ✓    │
│ Delete Product          │    ✗    │    ✗     │    ✓    │
└─────────────────────────┴─────────┴──────────┴─────────┘
```

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        REQUEST/RESPONSE FLOW                                 │
└─────────────────────────────────────────────────────────────────────────────┘

Frontend                  API Service              Backend                Database
   │                          │                        │                      │
   │  login(user, pass)       │                        │                      │
   ├─────────────────────────▶│                        │                      │
   │                          │  POST /login           │                      │
   │                          ├───────────────────────▶│                      │
   │                          │                        │  Find user           │
   │                          │                        ├─────────────────────▶│
   │                          │                        │◀─────────────────────┤
   │                          │                        │  Verify password     │
   │                          │                        │  Generate JWT        │
   │                          │◀───────────────────────┤                      │
   │◀─────────────────────────┤  { token, user }       │                      │
   │  Store in localStorage   │                        │                      │
   │                          │                        │                      │
   │  fetchUsers()            │                        │                      │
   ├─────────────────────────▶│                        │                      │
   │                          │  GET /getAllUsers      │                      │
   │                          │  Auth: Bearer TOKEN    │                      │
   │                          ├───────────────────────▶│                      │
   │                          │                        │ authGuard middleware │
   │                          │                        │ ├─ Verify JWT        │
   │                          │                        │ ├─ Check expiry      │
   │                          │                        │ └─ Extract user      │
   │                          │                        │                      │
   │                          │                        │ roleGuard middleware │
   │                          │                        │ ├─ Check role        │
   │                          │                        │ └─ Authorize         │
   │                          │                        │                      │
   │                          │                        │  Query all users     │
   │                          │                        ├─────────────────────▶│
   │                          │                        │◀─────────────────────┤
   │                          │◀───────────────────────┤  users data          │
   │◀─────────────────────────┤  { users: [...] }      │                      │
   │  Display users           │                        │                      │
   │                          │                        │                      │
```

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        ERROR HANDLING FLOW                                   │
└─────────────────────────────────────────────────────────────────────────────┘

Request with Token
       │
       ▼
┌──────────────┐
│  authGuard   │
└──────┬───────┘
       │
       ├─ No token? ────────────▶ 401 "Token missing"
       │
       ├─ Invalid token? ───────▶ 401 "Invalid token"
       │
       ├─ Expired token? ───────▶ 401 "Token expired"
       │
       └─ Valid token
              │
              ▼
       ┌──────────────┐
       │  roleGuard   │
       └──────┬───────┘
              │
              ├─ Wrong role? ───▶ 403 "Access denied"
              │
              └─ Correct role
                     │
                     ▼
              ┌──────────────┐
              │  Controller  │
              └──────┬───────┘
                     │
                     └─────────▶ 200 Success

Frontend Interceptor:
  401 Error ─▶ Clear localStorage ─▶ Redirect to /login
  403 Error ─▶ Show "Access Denied" message
```

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        JWT TOKEN STRUCTURE                                   │
└─────────────────────────────────────────────────────────────────────────────┘

JWT Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJhZG1pbiIsImVtYWlsIjoiYWRtaW5AZXhhbXBsZS5jb20iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE2MDk0NTkyMDAsImV4cCI6MTYxMDA2NDAwMH0.abc123def456

Decoded:

┌─────────────────┐
│     HEADER      │
├─────────────────┤
│ {               │
│   "alg": "HS256"│
│   "typ": "JWT"  │
│ }               │
└─────────────────┘

┌─────────────────────┐
│      PAYLOAD        │
├─────────────────────┤
│ {                   │
│   "id": 1,          │
│   "username": "...", │
│   "email": "...",   │
│   "role": "admin",  │
│   "iat": 1609459200,│ ← Issued at
│   "exp": 1610064000 │ ← Expires (7 days)
│ }                   │
└─────────────────────┘

┌─────────────────┐
│    SIGNATURE    │
├─────────────────┤
│ HMACSHA256(     │
│   base64Url(...),│
│   JWT_SECRET    │
│ )               │
└─────────────────┘
```

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        FRONTEND ROUTING FLOW                                 │
└─────────────────────────────────────────────────────────────────────────────┘

User Navigates to Protected Route
            │
            ▼
    ┌───────────────┐
    │ ProtectedRoute│
    │  Component    │
    └───────┬───────┘
            │
    Check isAuthenticated()
            │
            ├─ No? ──────────────▶ Redirect to /login
            │
            └─ Yes
                │
        Check requiredRole
                │
                ├─ No role required? ──▶ Render children
                │
                └─ Has role requirement
                        │
                Check hasRole(requiredRole)
                        │
                        ├─ No? ──▶ Redirect to role-specific dashboard
                        │           ├─ patient → /
                        │           ├─ dentist → /dentist-dashboard
                        │           └─ admin → /admin-dashboard
                        │
                        └─ Yes ──▶ Render children
```

---

**Legend:**
- ✓ = Allowed
- ✗ = Denied
- ─▶ = Flow direction
- │ = Decision path
