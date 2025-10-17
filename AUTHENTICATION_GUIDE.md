# Authentication System Guide

## Overview

The Freework platform uses JWT (JSON Web Token) based authentication with role-based access control. Users can register as either clients (who post jobs) or freelancers (who apply to jobs).

## Features

- JWT token-based authentication
- Role-based authorization (Client/Freelancer)
- Auto-login with stored tokens
- Token refresh mechanism
- HTTP interceptor for automatic token injection
- Route guards for protected pages

## Architecture

### Components

1. **AuthService** (`auth.service.ts`) - Core authentication logic
2. **TokenInterceptor** (`token.interceptor.ts`) - Automatic token injection
3. **AuthGuard** (`auth.guard.ts`) - Route protection
4. **LoginComponent** - User login interface
5. **RegisterComponent** - New user registration

### Data Models

```typescript
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'client' | 'freelancer';
  profileImage?: string;
  bio?: string;
  skills?: string[];
  hourlyRate?: number;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'client' | 'freelancer';
}

interface AuthResponse {
  token: string;
  user: User;
}
```

## Usage

### Login

```typescript
// In component
constructor(private authService: AuthService, private router: Router) {}

login() {
  this.authService.login({
    email: 'user@example.com',
    password: 'password123'
  }).subscribe({
    next: (response) => {
      console.log('Login successful:', response.user);
      this.router.navigate(['/jobs']);
    },
    error: (error) => {
      console.error('Login failed:', error);
    }
  });
}
```

### Register

```typescript
register() {
  this.authService.register({
    email: 'newuser@example.com',
    password: 'password123',
    firstName: 'John',
    lastName: 'Doe',
    role: 'freelancer'
  }).subscribe({
    next: (response) => {
      console.log('Registration successful');
      this.router.navigate(['/jobs']);
    },
    error: (error) => {
      console.error('Registration failed:', error);
    }
  });
}
```

### Logout

```typescript
logout() {
  this.authService.logout();
  this.router.navigate(['/login']);
}
```

### Check Authentication Status

```typescript
// Check if user is logged in
const isLoggedIn = this.authService.isLoggedIn();

// Get current user
const currentUser = this.authService.currentUser();

// Get current user as observable
this.authService.currentUser$.subscribe(user => {
  if (user) {
    console.log('Current user:', user);
  }
});
```

### Route Protection

```typescript
// In app.routes.ts
const routes: Routes = [
  {
    path: 'jobs/create',
    component: JobFormComponent,
    canActivate: [AuthGuard]
  }
];
```

## Token Management

### Storage
- Tokens are stored in `localStorage` with key `auth_token`
- User data stored with key `current_user`

### Automatic Token Injection
The `TokenInterceptor` automatically adds the JWT token to all HTTP requests:

```typescript
Authorization: Bearer <token>
```

### Token Refresh
Tokens are automatically validated on app initialization. Expired tokens trigger automatic logout.

## Role-Based Access

### Client Role
- Can create and manage job postings
- Can view applications to their jobs
- Can initiate payments
- Can review freelancers

### Freelancer Role
- Can browse and apply to jobs
- Can manage their applications
- Can receive payments
- Can review clients

### Checking Roles

```typescript
// Check if current user is a client
if (this.authService.isClient()) {
  // Show client-specific features
}

// Check if current user is a freelancer
if (this.authService.isFreelancer()) {
  // Show freelancer-specific features
}
```

## Security Best Practices

1. **Password Requirements**: Minimum 8 characters (enforced in registration)
2. **Token Expiration**: Tokens expire after 24 hours
3. **Secure Storage**: Tokens stored in localStorage (consider httpOnly cookies for production)
4. **HTTPS Only**: Always use HTTPS in production
5. **Input Validation**: All inputs validated on both client and server

## API Endpoints

```
POST   /api/auth/login       - User login
POST   /api/auth/register    - User registration
POST   /api/auth/logout      - User logout
GET    /api/auth/me          - Get current user
PUT    /api/auth/profile     - Update user profile
POST   /api/auth/refresh     - Refresh token
```

## Error Handling

Common authentication errors:

- `401 Unauthorized` - Invalid credentials or expired token
- `403 Forbidden` - Insufficient permissions
- `409 Conflict` - Email already exists (registration)
- `422 Unprocessable Entity` - Validation errors

## Testing

Mock credentials available for testing. See [MOCK_LOGIN_CREDENTIALS.md](MOCK_LOGIN_CREDENTIALS.md).

## Quick Reference

See [AUTH_QUICK_REFERENCE.md](AUTH_QUICK_REFERENCE.md) for common code snippets.
