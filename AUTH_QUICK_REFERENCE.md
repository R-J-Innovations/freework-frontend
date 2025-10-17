# Authentication Quick Reference

## Common Imports

```typescript
import { AuthService } from '@app/auth/auth.service';
import { User, LoginRequest, RegisterRequest } from '@app/auth/models';
```

## Login

```typescript
this.authService.login({ email, password }).subscribe({
  next: (response) => this.router.navigate(['/jobs']),
  error: (error) => this.handleError(error)
});
```

## Register

```typescript
this.authService.register({
  email,
  password,
  firstName,
  lastName,
  role: 'freelancer' // or 'client'
}).subscribe({
  next: (response) => this.router.navigate(['/jobs']),
  error: (error) => this.handleError(error)
});
```

## Logout

```typescript
this.authService.logout();
this.router.navigate(['/login']);
```

## Get Current User

```typescript
// Synchronous
const user = this.authService.currentUser();

// Observable
this.authService.currentUser$.subscribe(user => {
  console.log(user);
});
```

## Check Authentication

```typescript
const isLoggedIn = this.authService.isLoggedIn();
const isClient = this.authService.isClient();
const isFreelancer = this.authService.isFreelancer();
```

## Protect Routes

```typescript
// app.routes.ts
import { AuthGuard } from '@app/auth/auth.guard';

const routes: Routes = [
  {
    path: 'protected',
    component: ProtectedComponent,
    canActivate: [AuthGuard]
  }
];
```

## In Templates

```html
@if (authService.isLoggedIn()) {
  <button (click)="logout()">Logout</button>
  <p>Welcome, {{ authService.currentUser()?.firstName }}</p>
}

@if (authService.isClient()) {
  <a routerLink="/jobs/create">Post a Job</a>
}

@if (authService.isFreelancer()) {
  <a routerLink="/jobs">Browse Jobs</a>
}
```

## Form Example

```typescript
// Component
loginForm = new FormGroup({
  email: new FormControl('', [Validators.required, Validators.email]),
  password: new FormControl('', [Validators.required, Validators.minLength(8)])
});

onSubmit() {
  if (this.loginForm.valid) {
    this.authService.login(this.loginForm.value as LoginRequest).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (err) => this.errorMessage = err.error.message
    });
  }
}
```

```html
<!-- Template -->
<form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
  <input type="email" formControlName="email" placeholder="Email">
  <input type="password" formControlName="password" placeholder="Password">
  <button type="submit" [disabled]="!loginForm.valid">Login</button>
  @if (errorMessage) {
    <p class="error">{{ errorMessage }}</p>
  }
</form>
```
