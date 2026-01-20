# 🧪 Testing Guide - Dental Care Application

## Quick Test Checklist

### ✅ Test 1: Register → Login → Dashboard Flow

#### Step 1: Register as Admin
1. Go to: http://localhost:5173/Register
2. Fill in the form:
   - Full Name: `Admin User`
   - Email: `admin@dental.com`
   - Password: `admin123`
   - Confirm Password: `admin123`
3. Click "Register"
4. ✅ Should see: "User created successfully! Please login."
5. ✅ Should redirect to login page after 1 second

#### Step 2: Create Admin via API (Alternative)
```bash
curl -X POST http://localhost:5000/api/user/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "admin@dental.com",
    "password": "admin123",
    "role": "admin"
  }'
```

#### Step 3: Login
1. On login page: http://localhost:5173/Login
2. Enter:
   - Username: `Admin User` (the name you used during registration)
   - Password: `admin123`
3. Click "Login"
4. ✅ Should see: "Login successful!"
5. ✅ Should auto-redirect to `/admin` dashboard

---

### ✅ Test 2: Verify Admin Dashboard Access

1. After login, should be on: http://localhost:5173/admin
2. ✅ Should see sidebar with:
   - Dashboard
   - Users
   - Products
   - Analytics
   - Notifications
   - Settings
   - Logs
3. ✅ Click through each section - should load without errors

---

### ✅ Test 3: Test Different User Roles

#### Register Patient
```bash
curl -X POST http://localhost:5000/api/user/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "patient1",
    "email": "patient@dental.com",
    "password": "patient123"
  }'
```

#### Register Dentist
```bash
curl -X POST http://localhost:5000/api/user/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "dentist1",
    "email": "dentist@dental.com",
    "password": "dentist123",
    "role": "dentist"
  }'
```

#### Test Access Levels
1. Login as patient → ✅ Redirects to `/` (home)
2. Try to access `/admin` → ❌ Should redirect away
3. Login as dentist → ✅ Redirects to `/` (home)
4. Login as admin → ✅ Redirects to `/admin` (dashboard)

---

### ✅ Test 4: API Endpoint Testing

#### Get All Users (Admin Only)
```bash
# First, login to get token
TOKEN=$(curl -s -X POST http://localhost:5000/api/user/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' | \
  grep -o '"token":"[^"]*' | cut -d'"' -f4)

# Then use token to get users
curl -X GET http://localhost:5000/api/user/getAllUsers \
  -H "Authorization: Bearer $TOKEN"
```

#### Get All Products (Public)
```bash
curl -X GET http://localhost:5000/api/product/getAllProducts
```

#### Add Product (Admin/Dentist)
```bash
curl -X POST http://localhost:5000/api/product/addProduct \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Dental Chair",
    "price": 5000,
    "description": "Professional dental chair"
  }'
```

---

### ✅ Test 5: Security Testing

#### Test 1: Access Protected Route Without Token
```bash
curl -X GET http://localhost:5000/api/user/getAllUsers
# ❌ Should return 401 Unauthorized
```

#### Test 2: Patient Tries Admin Endpoint
```bash
# Get patient token
PATIENT_TOKEN=$(curl -s -X POST http://localhost:5000/api/user/login \
  -H "Content-Type: application/json" \
  -d '{"username":"patient1","password":"patient123"}' | \
  grep -o '"token":"[^"]*' | cut -d'"' -f4)

# Try admin endpoint
curl -X GET http://localhost:5000/api/user/getAllUsers \
  -H "Authorization: Bearer $PATIENT_TOKEN"
# ❌ Should return 403 Forbidden
```

#### Test 3: Invalid Token
```bash
curl -X GET http://localhost:5000/api/user/getAllUsers \
  -H "Authorization: Bearer invalid_token_123"
# ❌ Should return 401 Invalid token
```

---

## 🎯 Expected Results Summary

| Test | Expected Result | Pass/Fail |
|------|----------------|-----------|
| Register user | Success message + redirect to login | ✅ |
| Login with correct credentials | Success + redirect to dashboard | ✅ |
| Admin access /admin | Dashboard loads | ✅ |
| Patient access /admin | Redirected to home | ✅ |
| API without token | 401 Unauthorized | ✅ |
| API with wrong role | 403 Forbidden | ✅ |
| Get public products | Returns product list | ✅ |
| Password reset flow | Token generated + password updated | ✅ |

---

## 🐛 Common Issues & Solutions

### Issue: "Failed to create user"
**Solution:** Check if username/email already exists. Use unique values.

### Issue: "Invalid username or password"
**Solution:** 
- Make sure you're using the USERNAME (not email) to login
- Verify password is correct
- Check database to confirm user exists

### Issue: "CORS error"
**Solution:** 
- Backend server must be running
- Check CORS configuration in backend/index.js
- Restart backend server

### Issue: Can't access admin dashboard
**Solution:**
- Verify user role is 'admin' in database
- Check token is valid
- Clear browser cache/localStorage
- Re-login

### Issue: Token expired
**Solution:**
- Tokens expire after 7 days
- Login again to get new token
- Consider implementing refresh tokens

---

## 📝 Quick Reference

### Frontend URLs
- Home: http://localhost:5173/
- Login: http://localhost:5173/Login
- Register: http://localhost:5173/Register
- Admin: http://localhost:5173/admin

### Backend URLs
- Base: http://localhost:5000
- API: http://localhost:5000/api

### Default Test Credentials
```
Admin:
  username: admin
  password: admin123

Patient:
  username: patient1  
  password: patient123

Dentist:
  username: dentist1
  password: dentist123
```

---

## ✅ All Tests Passing Checklist

- [ ] Backend server running on port 5000
- [ ] Frontend server running on port 5173
- [ ] Database connected
- [ ] Can register new user
- [ ] Registration redirects to login
- [ ] Can login with username/password
- [ ] Login redirects based on role
- [ ] Admin can access /admin dashboard
- [ ] Patient cannot access /admin
- [ ] API endpoints respond correctly
- [ ] Protected routes require authentication
- [ ] Role-based authorization working
- [ ] Token automatically attached to requests
- [ ] Invalid tokens rejected
- [ ] No console errors

**If all checkboxes are checked: ✅ SYSTEM FULLY OPERATIONAL** 🎉
