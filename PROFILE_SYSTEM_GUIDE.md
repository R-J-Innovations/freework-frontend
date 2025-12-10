# Profile System Guide

## Overview
The profile system allows both freelancers and customers to view and update their profile information. Each user type has specific fields relevant to their role.

## Features

### For Freelancers:
- Basic information (name, email, phone, location)
- Professional details (title, hourly rate, availability)
- Skills and expertise
- Experience and education
- Portfolio showcase
- Certifications
- Languages with proficiency levels
- Social media links (LinkedIn, GitHub, Twitter, Website, Behance, Dribbble)
- Profile picture upload
- Rating and completed jobs count

### For Customers:
- Basic information (name, email, phone, location)
- Company information (name, size, industry, website)
- Bio/About section
- Social media links (LinkedIn, Twitter, Website)
- Profile picture upload
- Rating and jobs posted count
- Payment verification status

## File Structure

```
src/app/profile/
├── models/
│   └── profile.models.ts          # Type definitions for profiles
├── profile-view/
│   ├── profile-view.component.ts   # View profile component
│   ├── profile-view.component.html
│   └── profile-view.component.scss
├── profile-edit/
│   ├── profile-edit.component.ts   # Edit profile component
│   ├── profile-edit.component.html
│   └── profile-edit.component.scss
└── profile.service.ts              # Profile service for API calls
```

## Routes

The following routes have been added:

- `/profile` - View your own profile (requires authentication)
- `/profile/edit` - Edit your profile (requires authentication)
- `/profile/:userId` - View another user's profile (public)

## Usage

### Viewing Your Profile

1. Log in to the application
2. Navigate to `/profile` or click on your profile link in the navigation
3. View all your profile information organized by sections

### Editing Your Profile

1. From your profile page, click the "Edit Profile" button
2. Update any fields you want to change:
   - **Basic Information**: Name, phone, location
   - **Professional Info** (Freelancers): Title, hourly rate, skills, experience
   - **Company Info** (Customers): Company name, size, industry
   - **Bio**: Write about yourself (max 1000 characters)
   - **Social Links**: Add your professional social media profiles
   - **Languages** (Freelancers): Add languages you speak with proficiency levels
3. Click "Save Changes" to update your profile

### Uploading Profile Picture

1. In the edit profile page, click "Choose Photo"
2. Select an image (recommended: square image, at least 400x400px, max 5MB)
3. Click "Upload Photo" to save the new profile picture

## Data Models

### FreelancerProfile
```typescript
{
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  profilePicture?: string;
  bio?: string;
  location?: string;
  role: 'FREELANCER';
  title?: string;
  hourlyRate?: number;
  skills: string[];
  experience?: string;
  education?: string;
  portfolio?: PortfolioItem[];
  languages?: Language[];
  availability?: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'NOT_AVAILABLE';
  rating?: number;
  totalReviews?: number;
  completedJobs?: number;
  certifications?: Certification[];
  socialLinks?: SocialLinks;
  createdAt: string;
  updatedAt: string;
}
```

### CustomerProfile
```typescript
{
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  profilePicture?: string;
  bio?: string;
  location?: string;
  role: 'CUSTOMER';
  company?: string;
  companySize?: string;
  industry?: string;
  website?: string;
  rating?: number;
  totalReviews?: number;
  totalJobsPosted?: number;
  verifiedPayment?: boolean;
  socialLinks?: SocialLinks;
  createdAt: string;
  updatedAt: string;
}
```

## Mock Data

The profile service includes mock data for testing with two users:

### Freelancer (John Doe)
- **Email**: john@example.com
- **Password**: password or john
- **Role**: Freelancer
- Full profile with skills, portfolio, certifications

### Customer (Emily Chen)
- **Email**: emily@example.com
- **Password**: password or emily
- **Role**: Customer
- Full profile with company information

## API Integration

The ProfileService is ready for backend integration. To switch from mock to real API:

1. Set `useMockData = false` in `profile.service.ts`
2. Ensure your backend API has these endpoints:
   - `GET /api/profiles/me` - Get current user's profile
   - `GET /api/profiles/user/:userId` - Get profile by user ID
   - `PUT /api/profiles/me` - Update current user's profile
   - `POST /api/profiles/upload-picture` - Upload profile picture

## Service Methods

### ProfileService

```typescript
// Get current user's profile
getMyProfile(): Observable<Profile>

// Get profile by user ID
getProfileByUserId(userId: string): Observable<Profile>

// Update profile
updateProfile(updates: UpdateProfileRequest): Observable<Profile>

// Upload profile picture
uploadProfilePicture(file: File): Observable<{ url: string }>
```

## Styling

The profile components use a modern, responsive design with:
- Card-based layout
- Gradient header background
- Responsive grid system
- Mobile-friendly design (breakpoint at 768px)
- Smooth transitions and hover effects
- Professional color scheme using Tailwind-inspired colors

## Form Validation

The edit profile form includes validation for:
- Required fields (first name, last name)
- Email format (disabled, cannot be changed)
- Phone number format
- URL format for social links
- Character limits (bio: 1000 chars)
- Hourly rate minimum value (0)
- Image file type and size validation

## Future Enhancements

Potential features to add:
1. **Portfolio Management**: Full CRUD operations for portfolio items
2. **Certification Management**: Add/edit/delete certifications
3. **Profile Completion Progress**: Show percentage of completed profile
4. **Profile Visibility Settings**: Control what information is public
5. **Profile Export**: Download profile as PDF
6. **Profile Analytics**: View profile views and engagement
7. **Skill Endorsements**: Allow others to endorse skills
8. **Profile Verification**: Verify email, phone, and credentials

## Testing

To test the profile system:

1. **Login** as a freelancer:
   - Email: john@example.com
   - Password: password

2. **View Profile**: Navigate to `/profile`

3. **Edit Profile**: Click "Edit Profile" button

4. **Update Information**: Change any fields and save

5. **Test as Customer**: Logout and login as:
   - Email: emily@example.com
   - Password: password

6. **View Another Profile**: Navigate to `/profile/freelancer1` to view John's profile

## Troubleshooting

### Profile not loading
- Ensure you're logged in
- Check browser console for errors
- Verify the auth token is valid

### Changes not saving
- Check all required fields are filled
- Ensure form validation passes
- Check network tab for API errors

### Image upload fails
- Verify image is less than 5MB
- Ensure image format is valid (jpg, png, gif, webp)
- Check file input permissions

## Integration with Other Features

The profile system integrates with:
- **Authentication**: Uses AuthService for user context
- **Jobs**: Profile info displayed on job applications
- **Reviews**: Rating and review counts shown on profile
- **Messaging**: Profile links in chat interface
- **Payments**: Payment verification badge for customers

## Accessibility

The profile components include:
- Semantic HTML elements
- ARIA labels where needed
- Keyboard navigation support
- Screen reader friendly structure
- High contrast color scheme
- Focus indicators

## Performance

Optimizations included:
- Lazy loading of components via Angular routing
- Efficient form validation
- Image preview before upload
- Debounced auto-save (can be added)
- Minimal re-renders

## Security

Security considerations:
- Email field is disabled and cannot be changed in UI
- File upload validation (type and size)
- XSS protection through Angular's built-in sanitization
- CSRF protection via Angular's HttpClient
- Authentication guards on all routes

