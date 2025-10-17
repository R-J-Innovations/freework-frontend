# Mock Login Credentials

Use these credentials for testing the Freework platform with mock data.

## Client Accounts

### Client 1 - Tech Startup
- **Email**: `client1@freework.com`
- **Password**: `password123`
- **Name**: Alice Johnson
- **Role**: Client
- **Description**: Tech startup founder looking for developers

### Client 2 - Marketing Agency
- **Email**: `client2@freework.com`
- **Password**: `password123`
- **Name**: Bob Smith
- **Role**: Client
- **Description**: Marketing agency owner seeking designers

### Client 3 - E-commerce Business
- **Email**: `client3@freework.com`
- **Password**: `password123`
- **Name**: Carol Williams
- **Role**: Client
- **Description**: E-commerce business owner

## Freelancer Accounts

### Freelancer 1 - Full Stack Developer
- **Email**: `freelancer1@freework.com`
- **Password**: `password123`
- **Name**: David Brown
- **Role**: Freelancer
- **Skills**: JavaScript, TypeScript, Angular, Node.js, MongoDB
- **Hourly Rate**: $75/hour

### Freelancer 2 - UI/UX Designer
- **Email**: `freelancer2@freework.com`
- **Password**: `password123`
- **Name**: Emma Davis
- **Role**: Freelancer
- **Skills**: Figma, Adobe XD, UI Design, UX Research, Prototyping
- **Hourly Rate**: $60/hour

### Freelancer 3 - Content Writer
- **Email**: `freelancer3@freework.com`
- **Password**: `password123`
- **Name**: Frank Miller
- **Role**: Freelancer
- **Skills**: Content Writing, SEO, Copywriting, Blog Posts
- **Hourly Rate**: $45/hour

### Freelancer 4 - Backend Developer
- **Email**: `freelancer4@freework.com`
- **Password**: `password123`
- **Name**: Grace Lee
- **Role**: Freelancer
- **Skills**: Python, Django, PostgreSQL, AWS, Docker
- **Hourly Rate**: $80/hour

## Admin Account (Future)

### Admin
- **Email**: `admin@freework.com`
- **Password**: `admin123`
- **Name**: Admin User
- **Role**: Admin
- **Description**: Platform administrator

## Quick Test Scenarios

### Scenario 1: Post and Apply to Job
1. Login as `client1@freework.com`
2. Create a new job posting
3. Logout and login as `freelancer1@freework.com`
4. Apply to the job
5. Logout and login back as client1 to review applications

### Scenario 2: Messaging
1. Login as `client1@freework.com`
2. Navigate to messages
3. Start conversation with a freelancer
4. Login as that freelancer to reply

### Scenario 3: Payment Flow
1. Client accepts freelancer's application
2. Client initiates payment
3. Freelancer completes work
4. Client releases payment from escrow

### Scenario 4: Reviews
1. After job completion
2. Client reviews freelancer
3. Freelancer reviews client
4. Both reviews appear on profiles

## Notes

- All passwords are `password123` for easy testing
- Mock data is reset on server restart
- No actual payment processing occurs with Stripe test mode
- Messages are stored in-memory only
