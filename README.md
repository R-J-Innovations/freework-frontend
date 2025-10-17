# Freework - Freelance Job Platform

A modern Angular-based freelance job marketplace platform connecting clients with freelancers.

## Features

### Core Functionality
- ✅ **User Authentication** - Secure login/registration with JWT tokens
- ✅ **Job Management** - Create, edit, search, and manage job postings
- ✅ **Job Applications** - Apply to jobs and track application status
- ✅ **Real-time Messaging** - WebSocket-based chat system
- ✅ **Payment Integration** - Secure escrow payments via Stripe
- ✅ **Bidirectional Reviews** - Rate and review both clients and freelancers
- ✅ **Mock Data Support** - Complete mock services for development

## Tech Stack

- **Framework**: Angular 17+ (Standalone Components)
- **Language**: TypeScript
- **Styling**: SCSS with Angular Material
- **State Management**: RxJS
- **HTTP Client**: Angular HttpClient with Interceptors
- **Real-time**: WebSocket
- **Payment**: Stripe Integration
- **Authentication**: JWT tokens

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- Angular CLI 17+

### Installation

```bash
# Install dependencies
npm install

# Start development server
ng serve

# Navigate to http://localhost:4200
```

### Mock Login Credentials

See [MOCK_LOGIN_CREDENTIALS.md](MOCK_LOGIN_CREDENTIALS.md) for test accounts.

## Project Structure

```
src/app/
├── auth/              # Authentication module
├── jobs/              # Job management & applications
├── messaging/         # Real-time chat system
├── payments/          # Payment processing
└── reviews/           # Review & rating system
```

## Documentation

- [Authentication Guide](AUTHENTICATION_GUIDE.md)
- [Job Management Guide](JOB_MANAGEMENT_GUIDE.md)
- [Job Application Guide](JOB_APPLICATION_GUIDE.md)
- [Messaging System Guide](MESSAGING_SYSTEM_GUIDE.md)
- [Payment Integration Guide](PAYMENT_INTEGRATION_GUIDE.md)
- [Reviews System Guide](REVIEWS_SYSTEM_GUIDE.md)
- [Mock Data Guide](MOCK_DATA_GUIDE.md)

## Development

```bash
# Run tests
ng test

# Build for production
ng build --configuration production

# Lint
ng lint
```

## Environment Configuration

Create environment files for different configurations:

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  wsUrl: 'ws://localhost:3000',
  stripePublicKey: 'your_stripe_key'
};
```

## License

MIT License
