# Job Management Guide

## Overview

The job management system allows clients to post jobs and manage applications, while freelancers can browse and apply to jobs. This is the core functionality of the Freework platform.

## Features

- **Job Creation** - Clients can create detailed job postings
- **Job Browsing** - Search and filter jobs by category, budget, skills
- **Job Details** - View comprehensive job information
- **Job Editing** - Update job details before accepting applications
- **Job Status Management** - Track job lifecycle (open, in-progress, completed, cancelled)
- **Application Management** - Review and manage applications
- **Active Jobs Dashboard** - Clients can view all their posted jobs

## Job Lifecycle

```
OPEN → IN_PROGRESS → COMPLETED
  ↓
CANCELLED
```

- **OPEN** - Job is posted and accepting applications
- **IN_PROGRESS** - Job has been awarded to a freelancer
- **COMPLETED** - Work is finished and payment released
- **CANCELLED** - Job was cancelled before completion

## Data Models

```typescript
interface Job {
  id: string;
  title: string;
  description: string;
  category: JobCategory;
  budget: number;
  budgetType: 'fixed' | 'hourly';
  duration: string;
  skillsRequired: string[];
  clientId: string;
  clientName: string;
  status: JobStatus;
  createdAt: Date;
  updatedAt: Date;
  applicationCount?: number;
  awardedFreelancerId?: string;
}

type JobStatus = 'open' | 'in-progress' | 'completed' | 'cancelled';

type JobCategory = 
  | 'web-development'
  | 'mobile-development'
  | 'design'
  | 'writing'
  | 'marketing'
  | 'data-science'
  | 'other';

interface CreateJobRequest {
  title: string;
  description: string;
  category: JobCategory;
  budget: number;
  budgetType: 'fixed' | 'hourly';
  duration: string;
  skillsRequired: string[];
}
```

## Usage

### Creating a Job (Client Only)

```typescript
import { JobService } from '@app/jobs/job.service';
import { CreateJobRequest } from '@app/jobs/models';

constructor(private jobService: JobService) {}

createJob() {
  const jobData: CreateJobRequest = {
    title: 'Build E-commerce Website',
    description: 'Need a full-stack developer to build...',
    category: 'web-development',
    budget: 5000,
    budgetType: 'fixed',
    duration: '2-3 months',
    skillsRequired: ['Angular', 'Node.js', 'MongoDB']
  };

  this.jobService.createJob(jobData).subscribe({
    next: (job) => {
      console.log('Job created:', job);
      this.router.navigate(['/jobs', job.id]);
    },
    error: (error) => console.error('Error creating job:', error)
  });
}
```

### Browsing Jobs

```typescript
// Get all open jobs
this.jobService.getJobs().subscribe(jobs => {
  this.jobs = jobs;
});

// Get jobs with filters
this.jobService.getJobs({
  category: 'web-development',
  minBudget: 1000,
  maxBudget: 5000,
  skills: ['Angular', 'TypeScript']
}).subscribe(jobs => {
  this.filteredJobs = jobs;
});

// Search jobs
this.jobService.searchJobs('angular developer').subscribe(jobs => {
  this.searchResults = jobs;
});
```

### Viewing Job Details

```typescript
// Get single job
this.jobService.getJob(jobId).subscribe(job => {
  this.job = job;
});
```

### Updating a Job (Client Only)

```typescript
this.jobService.updateJob(jobId, {
  title: 'Updated Title',
  budget: 6000
}).subscribe({
  next: (updatedJob) => console.log('Job updated:', updatedJob),
  error: (error) => console.error('Error updating job:', error)
});
```

### Deleting a Job (Client Only)

```typescript
this.jobService.deleteJob(jobId).subscribe({
  next: () => console.log('Job deleted'),
  error: (error) => console.error('Error deleting job:', error)
});
```

### Getting Client's Jobs

```typescript
// Get all jobs posted by current client
this.jobService.getMyJobs().subscribe(jobs => {
  this.myJobs = jobs;
});

// Get jobs by status
this.jobService.getMyJobs('open').subscribe(openJobs => {
  this.openJobs = openJobs;
});
```

### Changing Job Status

```typescript
// Award job to freelancer
this.jobService.updateJobStatus(jobId, 'in-progress', freelancerId).subscribe({
  next: () => console.log('Job awarded'),
  error: (error) => console.error('Error:', error)
});

// Complete job
this.jobService.updateJobStatus(jobId, 'completed').subscribe({
  next: () => console.log('Job completed'),
  error: (error) => console.error('Error:', error)
});

// Cancel job
this.jobService.updateJobStatus(jobId, 'cancelled').subscribe({
  next: () => console.log('Job cancelled'),
  error: (error) => console.error('Error:', error)
});
```

## Components

### JobListComponent
- Displays list of all available jobs
- Filtering and search functionality
- Pagination
- Click to view details

### JobDetailComponent
- Shows complete job information
- Application form for freelancers
- Application list for job owner
- Edit/delete options for clients

### JobFormComponent
- Create new job (clients only)
- Edit existing job (clients only)
- Form validation
- Skills selection

### MyActiveJobsComponent
- Dashboard for clients to manage their jobs
- View all posted jobs
- Quick status overview
- Access to applications

## API Endpoints

```
GET    /api/jobs              - Get all jobs (with optional filters)
POST   /api/jobs              - Create new job (client only)
GET    /api/jobs/:id          - Get single job
PUT    /api/jobs/:id          - Update job (client only)
DELETE /api/jobs/:id          - Delete job (client only)
GET    /api/jobs/my           - Get current client's jobs
PUT    /api/jobs/:id/status   - Update job status
GET    /api/jobs/search       - Search jobs
```

## Filtering Options

```typescript
interface JobFilters {
  category?: JobCategory;
  minBudget?: number;
  maxBudget?: number;
  budgetType?: 'fixed' | 'hourly';
  skills?: string[];
  status?: JobStatus;
}
```

## Validation Rules

- **Title**: Required, 10-100 characters
- **Description**: Required, minimum 50 characters
- **Budget**: Required, greater than 0
- **Category**: Required, must be valid category
- **Skills**: At least 1 skill required

## Security

- Only authenticated clients can create jobs
- Only job owner can edit/delete their jobs
- Only job owner can change job status
- Only job owner can view applications
- Freelancers can view all open jobs

## Best Practices

1. **Clear Titles**: Use descriptive titles that explain the job
2. **Detailed Descriptions**: Include requirements, deliverables, and timeline
3. **Realistic Budgets**: Set fair market rates
4. **Relevant Skills**: Tag jobs with accurate skills
5. **Timely Updates**: Keep job status current
6. **Communication**: Respond to applications promptly

## Common Workflows

### Client Workflow
1. Login as client
2. Navigate to "Post a Job"
3. Fill out job form
4. Submit and view job listing
5. Review applications as they come in
6. Award job to selected freelancer
7. Monitor progress
8. Complete job and release payment
9. Leave review

### Freelancer Workflow
1. Login as freelancer
2. Browse job listings
3. Filter by skills and budget
4. View job details
5. Submit application with proposal
6. Wait for client decision
7. If awarded, complete work
8. Receive payment
9. Leave review

## Related Documentation

- [Job Application Guide](JOB_APPLICATION_GUIDE.md) - How to apply to jobs
- [Payment Integration Guide](PAYMENT_INTEGRATION_GUIDE.md) - Payment processing
- [Reviews Guide](REVIEWS_SYSTEM_GUIDE.md) - Review system
