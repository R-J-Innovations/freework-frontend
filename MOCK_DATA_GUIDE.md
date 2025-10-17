# Mock Data Guide

## Overview

The Freework platform includes comprehensive mock data services for development and testing without a backend server. All major features have corresponding mock implementations.

## Available Mock Services

### 1. Mock Authentication Service
**File**: `src/app/auth/mock-auth.service.ts`

**Features**:
- Login with test credentials
- User registration
- Token management (localStorage)
- Role-based access (client/freelancer)

**Mock Users**:
```typescript
// See MOCK_LOGIN_CREDENTIALS.md for complete list
{
  email: 'client1@freework.com',
  password: 'password123',
  role: 'client'
}
```

### 2. Mock Job Service
**File**: `src/app/jobs/mock-job.service.ts`

**Features**:
- Pre-populated job listings
- CRUD operations
- Job filtering and search
- Status management

**Sample Jobs**:
- Web Development projects
- Mobile App development
- UI/UX Design work
- Content Writing gigs
- Marketing campaigns

### 3. Mock Application Service
**File**: `src/app/jobs/mock-application.service.ts`

**Features**:
- Submit applications
- Track application status
- Application management
- Mock freelancer profiles

### 4. Mock Messaging Service
**File**: `src/app/messaging/mock-messaging.service.ts`

**Features**:
- Simulated real-time messaging
- Conversation management
- Message history
- Typing indicators (simulated)
- Unread counts

### 5. Mock Payment Service
**File**: `src/app/payments/mock-payment.service.ts`

**Features**:
- Simulated payment processing
- Escrow management
- Payment history
- Status tracking
- No actual Stripe calls

### 6. Mock Review Service
**File**: `src/app/reviews/mock-review.service.ts`

**Features**:
- Submit reviews
- Rating aggregation
- Review history
- Sample reviews for testing

## Using Mock Services

### Configuration

In `src/app/app.config.ts`:

```typescript
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

// Import mock services
import { MockAuthService } from './auth/mock-auth.service';
import { MockJobService } from './jobs/mock-job.service';
import { MockMessagingService } from './messaging/mock-messaging.service';
import { MockPaymentService } from './payments/mock-payment.service';
import { MockReviewService } from './reviews/mock-review.service';

// Import real services
import { AuthService } from './auth/auth.service';
import { JobService } from './jobs/job.service';
import { MessagingService } from './messaging/messaging.service';
import { PaymentService } from './payments/payment.service';
import { ReviewService } from './reviews/review.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    
    // Use mock services for development
    { provide: AuthService, useClass: MockAuthService },
    { provide: JobService, useClass: MockJobService },
    { provide: MessagingService, useClass: MockMessagingService },
    { provide: PaymentService, useClass: MockPaymentService },
    { provide: ReviewService, useClass: MockReviewService }
  ]
};
```

### Environment-Based Configuration

Better approach using environment files:

```typescript
// environment.ts
export const environment = {
  production: false,
  useMockServices: true,
  apiUrl: 'http://localhost:3000/api'
};

// app.config.ts
import { environment } from '@env/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    // ... other providers
    
    // Conditionally use mock services
    environment.useMockServices
      ? { provide: AuthService, useClass: MockAuthService }
      : AuthService,
    
    environment.useMockServices
      ? { provide: JobService, useClass: MockJobService }
      : JobService,
    
    // ... repeat for other services
  ]
};
```

## Mock Data Structure

### Mock Users

```typescript
const MOCK_USERS = [
  {
    id: '1',
    email: 'client1@freework.com',
    firstName: 'Alice',
    lastName: 'Johnson',
    role: 'client',
    bio: 'Tech startup founder'
  },
  {
    id: '2',
    email: 'freelancer1@freework.com',
    firstName: 'David',
    lastName: 'Brown',
    role: 'freelancer',
    skills: ['Angular', 'TypeScript', 'Node.js'],
    hourlyRate: 75
  }
  // ... more users
];
```

### Mock Jobs

```typescript
const MOCK_JOBS = [
  {
    id: 'job-1',
    title: 'Build E-commerce Website',
    description: 'Need a full-stack developer...',
    category: 'web-development',
    budget: 5000,
    budgetType: 'fixed',
    clientId: '1',
    status: 'open',
    skillsRequired: ['Angular', 'Node.js']
  }
  // ... more jobs
];
```

### Mock Messages

```typescript
const MOCK_CONVERSATIONS = [
  {
    id: 'conv-1',
    participants: [
      { userId: '1', userName: 'Alice Johnson' },
      { userId: '2', userName: 'David Brown' }
    ],
    messages: [
      {
        id: 'msg-1',
        senderId: '1',
        content: 'Hi, I reviewed your application...',
        timestamp: new Date()
      }
    ]
  }
];
```

## Features of Mock Services

### Real-Time Simulation

Mock messaging service simulates real-time with RxJS:

```typescript
private messagesSubject = new BehaviorSubject<Message[]>([]);
messages$ = this.messagesSubject.asObservable();

sendMessage(message: SendMessageRequest): Observable<Message> {
  const newMessage = {
    id: this.generateId(),
    ...message,
    timestamp: new Date()
  };
  
  // Simulate delay
  return of(newMessage).pipe(delay(500));
}
```

### Persistent Storage

Mock services use localStorage for persistence:

```typescript
private saveToStorage(key: string, data: any): void {
  localStorage.setItem(key, JSON.stringify(data));
}

private loadFromStorage(key: string): any {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
}
```

### Data Relationships

Mock services maintain relationships:

```typescript
// Applications reference jobs and users
getApplicationsForJob(jobId: string): Observable<Application[]> {
  return of(
    this.applications
      .filter(app => app.jobId === jobId)
      .map(app => ({
        ...app,
        jobTitle: this.getJobTitle(app.jobId),
        freelancerName: this.getFreelancerName(app.freelancerId)
      }))
  );
}
```

## Testing with Mock Data

### Quick Test Scenarios

**Scenario 1: Complete Job Flow**
```typescript
describe('Job Flow', () => {
  it('should complete full job lifecycle', async () => {
    // 1. Login as client
    await login('client1@freework.com', 'password123');
    
    // 2. Create job
    const job = await createJob({ title: 'Test Job', ... });
    
    // 3. Login as freelancer
    await login('freelancer1@freework.com', 'password123');
    
    // 4. Apply to job
    await applyToJob(job.id);
    
    // 5. Login back as client
    await login('client1@freework.com', 'password123');
    
    // 6. Accept application
    await acceptApplication(application.id);
    
    // 7. Complete and pay
    await completeJob(job.id);
  });
});
```

### Resetting Mock Data

```typescript
// In mock service
resetData(): void {
  localStorage.clear();
  this.initializeMockData();
}

// In tests
beforeEach(() => {
  TestBed.configureTestingModule({
    providers: [
      { provide: JobService, useClass: MockJobService }
    ]
  });
  
  const mockService = TestBed.inject(JobService) as MockJobService;
  mockService.resetData();
});
```

## Switching Between Mock and Real Services

### Development Mode
```bash
# Use mock services
ng serve
```

### Production Mode
```bash
# Use real API
ng build --configuration production
```

### Manual Toggle
```typescript
// In component
constructor(
  @Inject(JobService) private jobService: JobService,
  @Optional() private mockJobService: MockJobService
) {
  // Use mock if available, otherwise real service
  this.service = mockJobService || jobService;
}
```

## Benefits of Mock Services

✅ **No Backend Required** - Develop frontend independently
✅ **Fast Development** - No network latency
✅ **Consistent Data** - Predictable test scenarios
✅ **Offline Development** - Work without internet
✅ **Easy Testing** - Controlled test data
✅ **Demo Ready** - Show features without backend

## Limitations

⚠️ **Data Persistence** - Only in localStorage
⚠️ **No Server Validation** - Client-side only
⚠️ **No Real WebSockets** - Simulated real-time
⚠️ **No Stripe Integration** - Simulated payments
⚠️ **Limited Complexity** - Simplified relationships

## Migration to Real Services

When backend is ready:

1. Update environment configuration
2. Remove mock service providers
3. Test with real API
4. Verify all endpoints
5. Update error handling

```typescript
// Change from
{ provide: JobService, useClass: MockJobService }

// To
JobService // Uses real HttpClient calls
```

## Related Documentation

- [Mock Login Credentials](MOCK_LOGIN_CREDENTIALS.md) - Test user accounts
- [Setup Complete](SETUP_COMPLETE.md) - Project setup guide
