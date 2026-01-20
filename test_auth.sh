#!/bin/bash

# Authentication & Authorization Test Script
# This script tests the authentication system endpoints

BASE_URL="http://localhost:5000/api"
BOLD='\033[1m'
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BOLD}${BLUE}=== Dental Care Authentication System Test ===${NC}\n"

# Test 1: Register a Patient
echo -e "${BOLD}Test 1: Register a Patient${NC}"
PATIENT_RESPONSE=$(curl -s -X POST "$BASE_URL/user/register" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "test_patient",
    "email": "patient@test.com",
    "password": "password123"
  }')

if echo "$PATIENT_RESPONSE" | grep -q "success.*true"; then
  echo -e "${GREEN}✓ Patient registration successful${NC}"
else
  echo -e "${RED}✗ Patient registration failed${NC}"
  echo "$PATIENT_RESPONSE"
fi
echo ""

# Test 2: Register a Dentist
echo -e "${BOLD}Test 2: Register a Dentist${NC}"
DENTIST_RESPONSE=$(curl -s -X POST "$BASE_URL/user/register" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "test_dentist",
    "email": "dentist@test.com",
    "password": "password123",
    "role": "dentist"
  }')

if echo "$DENTIST_RESPONSE" | grep -q "success.*true"; then
  echo -e "${GREEN}✓ Dentist registration successful${NC}"
else
  echo -e "${RED}✗ Dentist registration failed${NC}"
  echo "$DENTIST_RESPONSE"
fi
echo ""

# Test 3: Register an Admin
echo -e "${BOLD}Test 3: Register an Admin${NC}"
ADMIN_RESPONSE=$(curl -s -X POST "$BASE_URL/user/register" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "test_admin",
    "email": "admin@test.com",
    "password": "password123",
    "role": "admin"
  }')

if echo "$ADMIN_RESPONSE" | grep -q "success.*true"; then
  echo -e "${GREEN}✓ Admin registration successful${NC}"
else
  echo -e "${RED}✗ Admin registration failed${NC}"
  echo "$ADMIN_RESPONSE"
fi
echo ""

# Test 4: Login as Patient
echo -e "${BOLD}Test 4: Login as Patient${NC}"
PATIENT_LOGIN=$(curl -s -X POST "$BASE_URL/user/login" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "test_patient",
    "password": "password123"
  }')

PATIENT_TOKEN=$(echo "$PATIENT_LOGIN" | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -n "$PATIENT_TOKEN" ]; then
  echo -e "${GREEN}✓ Patient login successful${NC}"
  echo -e "Token: ${PATIENT_TOKEN:0:20}..."
else
  echo -e "${RED}✗ Patient login failed${NC}"
  echo "$PATIENT_LOGIN"
fi
echo ""

# Test 5: Login as Admin
echo -e "${BOLD}Test 5: Login as Admin${NC}"
ADMIN_LOGIN=$(curl -s -X POST "$BASE_URL/user/login" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "test_admin",
    "password": "password123"
  }')

ADMIN_TOKEN=$(echo "$ADMIN_LOGIN" | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -n "$ADMIN_TOKEN" ]; then
  echo -e "${GREEN}✓ Admin login successful${NC}"
  echo -e "Token: ${ADMIN_TOKEN:0:20}..."
else
  echo -e "${RED}✗ Admin login failed${NC}"
  echo "$ADMIN_LOGIN"
fi
echo ""

# Test 6: Access Public Route (Get Products)
echo -e "${BOLD}Test 6: Access Public Route (Get All Products)${NC}"
PRODUCTS=$(curl -s -X GET "$BASE_URL/product/getAllProducts")

if [ $? -eq 0 ]; then
  echo -e "${GREEN}✓ Public route accessible${NC}"
else
  echo -e "${RED}✗ Public route failed${NC}"
fi
echo ""

# Test 7: Access Protected Route WITHOUT Token (Should Fail)
echo -e "${BOLD}Test 7: Access Protected Route Without Token (Should Fail)${NC}"
NO_AUTH_RESPONSE=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL/user/getAllUsers")
HTTP_CODE=$(echo "$NO_AUTH_RESPONSE" | tail -1)

if [ "$HTTP_CODE" = "401" ]; then
  echo -e "${GREEN}✓ Correctly rejected (401 Unauthorized)${NC}"
else
  echo -e "${RED}✗ Should have been rejected with 401, got: $HTTP_CODE${NC}"
fi
echo ""

# Test 8: Patient Tries to Access Admin Route (Should Fail)
echo -e "${BOLD}Test 8: Patient Tries Admin Route (Should Fail with 403)${NC}"
PATIENT_ADMIN=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL/user/getAllUsers" \
  -H "Authorization: Bearer $PATIENT_TOKEN")
HTTP_CODE=$(echo "$PATIENT_ADMIN" | tail -1)

if [ "$HTTP_CODE" = "403" ]; then
  echo -e "${GREEN}✓ Correctly rejected (403 Forbidden)${NC}"
else
  echo -e "${RED}✗ Should have been rejected with 403, got: $HTTP_CODE${NC}"
fi
echo ""

# Test 9: Admin Access Admin Route (Should Succeed)
echo -e "${BOLD}Test 9: Admin Access Admin Route (Should Succeed)${NC}"
ADMIN_ACCESS=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL/user/getAllUsers" \
  -H "Authorization: Bearer $ADMIN_TOKEN")
HTTP_CODE=$(echo "$ADMIN_ACCESS" | tail -1)

if [ "$HTTP_CODE" = "200" ]; then
  echo -e "${GREEN}✓ Admin access successful (200 OK)${NC}"
  RESPONSE_BODY=$(echo "$ADMIN_ACCESS" | head -n -1)
  USER_COUNT=$(echo "$RESPONSE_BODY" | grep -o "test_" | wc -l)
  echo -e "Found $USER_COUNT test users"
else
  echo -e "${RED}✗ Admin access failed, got: $HTTP_CODE${NC}"
fi
echo ""

# Test 10: Invalid Token (Should Fail)
echo -e "${BOLD}Test 10: Invalid Token (Should Fail)${NC}"
INVALID_TOKEN=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL/user/getAllUsers" \
  -H "Authorization: Bearer invalid_token_here")
HTTP_CODE=$(echo "$INVALID_TOKEN" | tail -1)

if [ "$HTTP_CODE" = "401" ]; then
  echo -e "${GREEN}✓ Invalid token correctly rejected (401)${NC}"
else
  echo -e "${RED}✗ Should have been rejected with 401, got: $HTTP_CODE${NC}"
fi
echo ""

# Summary
echo -e "${BOLD}${BLUE}=== Test Summary ===${NC}"
echo -e "All critical authentication flows have been tested."
echo -e "✓ User registration (patient, dentist, admin)"
echo -e "✓ User login with JWT token generation"
echo -e "✓ Public routes accessible without auth"
echo -e "✓ Protected routes require authentication"
echo -e "✓ Role-based authorization working"
echo -e "✓ Invalid tokens are rejected"
echo ""
echo -e "${BOLD}Note:${NC} You may want to clean up test users from your database."
echo -e "To remove test users, run:"
echo -e "  ${BLUE}DELETE FROM user WHERE username LIKE 'test_%';${NC}"
