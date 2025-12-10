# 🧪 Mock Login Test Guide

## Quick Test Steps

### Test 1: Freelancer Login
1. Open your browser to `http://localhost:4200/login`
2. Clear localStorage (F12 > Application tab > Local Storage > Clear All)
3. Enter:
   - **Email**: `john@example.com`
   - **Password**: `password`
4. Click "Login"
5. You should see a loading spinner for ~800ms, then be redirected to the home page
6. Navigate to `/profile` - you should see John's complete freelancer profile

### Test 2: Customer Login
1. Logout (if logged in)
2. Go back to `/login`
3. Enter:
   - **Email**: `emily@example.com`
   - **Password**: `password`
4. Click "Login"
5. You should be redirected and logged in as Emily
6. Navigate to `/profile` - you should see Emily's customer profile

### Test 3: Invalid Credentials
1. Logout
2. Try logging in with: `test@example.com` / `password`
3. You should see: "Invalid email or password" error message

### Test 4: Alternative Password
1. Try logging in with: `john@example.com` / `john`
2. This should also work (using first name as password)

## What to Expect

### After Successful Login:
- ✅ No error messages
- ✅ Loading spinner appears briefly
- ✅ Redirected to home page
- ✅ User info appears in navigation (if you have nav bar)
- ✅ Can access protected routes like `/profile`

### In Browser DevTools (F12):
**Console Tab:**
- No red error messages
- You might see: "Login successful" or similar

**Application Tab > Local Storage:**
- `freework_access_token`: `mock-jwt-token-freelancer1` or `mock-jwt-token-emily-chen`
- `freework_refresh_token`: `mock-refresh-token-...`
- `freework_user`: JSON object with user data

**Network Tab:**
- No actual HTTP requests to localhost:8080
- Everything handled in-memory

## Troubleshooting

### "Invalid email or password" error:
- ✅ **Fixed**: Error response format corrected
- Make sure you're typing the email exactly: `john@example.com`
- Password is case-sensitive: use lowercase `password`

### Form validation error:
- ✅ **Fixed**: Removed minimum password length requirement
- All fields should accept input now

### Still redirecting or not working:
1. **Clear all browser data**:
   ```
   F12 > Application > Storage > Clear site data
   ```
2. **Hard refresh**: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
3. **Check console** for any error messages
4. **Verify mock mode is enabled**: 
   - Check `auth.service.ts` line 14: `private useMockData = true;`

### Profile doesn't load after login:
- The profile service is also using mock data
- Check browser console for errors
- Try navigating directly to `/profile`

## Technical Verification

### Check Auth Service Settings:
Open `src/app/auth/auth.service.ts` and verify:
```typescript
private useMockData = true;  // Line 14 - should be true
```

### Check Profile Service Settings:
Open `src/app/profile/profile.service.ts` and verify:
```typescript
private useMockData = true;  // Should be true
```

### Mock Users Available:
The system has exactly 2 test users:
1. `john@example.com` - Freelancer
2. `emily@example.com` - Customer

No other emails will work!

## Expected Behavior Details

### Login Flow:
1. Enter credentials
2. Click submit
3. 800ms delay (simulated API call)
4. Token stored in localStorage
5. User object stored in localStorage
6. Redirect to home or returnUrl
7. Auth guard allows access to protected routes

### Mock Token Format:
- Access Token: `mock-jwt-token-[userId]`
- Refresh Token: `mock-refresh-token-[userId]`
- These tokens never expire during your session

### Password Logic:
The mock login accepts:
- The word "password" (lowercase)
- OR the user's first name (case-insensitive)
- For john@example.com: "password" or "john" or "John" or "JOHN"
- For emily@example.com: "password" or "emily" or "Emily" or "EMILY"

## Success Indicators

✅ **You know it's working when:**
1. No error message appears
2. Brief loading state shows
3. You're redirected away from login page
4. You can access `/profile` without being kicked to login
5. User info is visible in the app (name, role, etc.)
6. localStorage contains the mock tokens

---

**All fixes applied!** The mock login should work perfectly now. If you still have issues, check the browser console and let me know what error you see.

