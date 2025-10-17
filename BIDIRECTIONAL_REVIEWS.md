# Bidirectional Reviews System

## Overview

The bidirectional review system ensures fair and balanced feedback by allowing both clients and freelancers to review each other after job completion.

## Key Features

- ✅ **Two-Way Reviews** - Both parties review each other
- ✅ **Simultaneous Submission** - Reviews submitted independently
- ✅ **Delayed Visibility** - Reviews shown after both submit
- ✅ **Fair Process** - Prevents review manipulation
- ✅ **Trust Building** - Creates balanced reputation system

## How It Works

### Step 1: Job Completion
- Client releases payment
- System triggers review prompts for both users
- Both receive email/notification to leave review

### Step 2: Independent Submission
- Client reviews freelancer (rating + comment)
- Freelancer reviews client (rating + comment)
- Neither can see the other's review yet
- Reviews are hidden until both submit

### Step 3: Visibility Rules

**Option A: Both Submit**
- As soon as both parties submit reviews
- Both reviews become visible immediately
- Added to both users' profiles

**Option B: Only One Submits**
- 7-day waiting period begins
- After 7 days, submitted review becomes visible
- Prevents "review blackmail"

**Option C: Neither Submits**
- After 14 days, opportunity closes
- No reviews added to profiles

## Why Bidirectional?

### Benefits

**For Freelancers:**
- Can warn others about difficult clients
- Build reputation beyond just receiving reviews
- Fair representation of work relationships

**For Clients:**
- Encourages professionalism from freelancers
- Shows client is credible and fair
- Builds trust with high-quality freelancers

**For Platform:**
- More accurate reputation system
- Reduces bias and manipulation
- Encourages good behavior from all parties

### Prevents Issues

1. **Review Blackmail**: "I'll leave you a bad review unless..."
2. **One-Sided Bias**: Only one party's perspective
3. **Unfair Ratings**: Balanced feedback from both sides
4. **Fake Reviews**: Mutual accountability

## Data Models

```typescript
interface BidirectionalReview {
  jobId: string;
  clientReview?: Review;      // Client's review of freelancer
  freelancerReview?: Review;  // Freelancer's review of client
  bothSubmitted: boolean;
  visibleAt: Date;            // When reviews become visible
  deadlineAt: Date;           // 7 days after job completion
}

interface ReviewPair {
  job: Job;
  clientToFreelancer: Review | null;
  freelancerToClient: Review | null;
  status: 'pending' | 'partial' | 'complete';
  daysRemaining: number;
}
```

## Usage Examples

### Check Review Status

```typescript
// Check if user needs to review
this.reviewService.getPendingReviews().subscribe(pending => {
  this.pendingReviewCount = pending.length;
  this.showReviewPrompts(pending);
});

// Get review pair for job
this.reviewService.getReviewPair(jobId).subscribe(pair => {
  this.hasReviewedClient = !!pair.freelancerToClient;
  this.hasReviewedFreelancer = !!pair.clientToFreelancer;
  this.canSeeReviews = pair.status === 'complete';
});
```

### Submit Review

```typescript
submitReview(jobId: string, revieweeId: string) {
  this.reviewService.createReview({
    jobId,
    revieweeId,
    rating: this.rating,
    comment: this.comment
  }).subscribe({
    next: (review) => {
      // Check if other party has also reviewed
      this.checkReviewVisibility(jobId);
    }
  });
}
```

### View Reviews

```typescript
// Only show reviews if both submitted or 7 days passed
getVisibleReviews(userId: string) {
  this.reviewService.getReviewsForUser(userId).subscribe(reviews => {
    this.visibleReviews = reviews.filter(r => r.isVisible);
  });
}
```

## UI Components

### Review Prompt Banner

```html
@if (pendingReviews.length > 0) {
  <div class="review-prompt">
    <mat-icon>rate_review</mat-icon>
    <span>
      You have {{ pendingReviews.length }} completed 
      {{ pendingReviews.length === 1 ? 'job' : 'jobs' }} to review
    </span>
    <button (click)="openReviewDialog()">Leave Reviews</button>
  </div>
}
```

### Review Status Indicator

```html
<div class="review-status">
  @if (reviewPair.status === 'pending') {
    <mat-icon>schedule</mat-icon>
    <p>Waiting for reviews from both parties</p>
  } @else if (reviewPair.status === 'partial') {
    <mat-icon>pending</mat-icon>
    <p>One review submitted. Reviews will be visible in {{ reviewPair.daysRemaining }} days or when both submit.</p>
  } @else {
    <mat-icon>check_circle</mat-icon>
    <p>Reviews complete</p>
  }
</div>
```

### Dual Review Display

```html
<div class="bidirectional-reviews">
  <div class="review-section client-review">
    <h3>Client's Review of Freelancer</h3>
    @if (reviewPair.clientToFreelancer) {
      <app-review-card [review]="reviewPair.clientToFreelancer"></app-review-card>
    } @else {
      <p class="pending">No review yet</p>
    }
  </div>

  <div class="review-section freelancer-review">
    <h3>Freelancer's Review of Client</h3>
    @if (reviewPair.freelancerToClient) {
      <app-review-card [review]="reviewPair.freelancerToClient"></app-review-card>
    } @else {
      <p class="pending">No review yet</p>
    }
  </div>
</div>
```

## API Endpoints

```
GET    /api/reviews/pending              - Get jobs awaiting review
GET    /api/reviews/pair/:jobId          - Get review pair for job
GET    /api/reviews/bidirectional/:jobId - Get both reviews (if visible)
POST   /api/reviews                      - Submit review
GET    /api/reviews/status/:jobId        - Check review status
```

## Best Practices

### For Implementation

1. **Email Reminders**: Send reminders at 3 days and 6 days
2. **Clear Messaging**: Explain why reviews are hidden
3. **Status Updates**: Show progress of review process
4. **Easy Access**: Prominent "Leave Review" buttons
5. **Fair Display**: Show both reviews side-by-side

### For Users

**Clients:**
- Review honestly but fairly
- Focus on work quality and communication
- Submit review promptly
- Don't try to leverage pending review

**Freelancers:**
- Review professionally
- Be honest about client experience
- Don't delay to "see what they said first"
- Focus on communication and respect

## Example Workflow

```typescript
// Complete job flow with reviews
export class JobCompletionFlow {
  
  completeJob(jobId: string) {
    // 1. Release payment
    this.paymentService.releasePayment(jobId).subscribe(() => {
      
      // 2. Trigger review prompts
      this.reviewService.triggerReviewPrompts(jobId).subscribe(() => {
        
        // 3. Show review dialog to current user
        this.openReviewDialog(jobId);
        
        // 4. Send email to other party
        // (handled by backend)
      });
    });
  }

  openReviewDialog(jobId: string) {
    this.dialog.open(ReviewDialogComponent, {
      data: { jobId },
      disableClose: false // Allow closing, just prompt
    }).afterClosed().subscribe(result => {
      if (result?.submitted) {
        this.checkBothReviewsComplete(jobId);
      }
    });
  }

  checkBothReviewsComplete(jobId: string) {
    this.reviewService.getReviewPair(jobId).subscribe(pair => {
      if (pair.status === 'complete') {
        this.showMessage('Both reviews are now visible!');
      } else {
        this.showMessage('Review submitted! It will be visible after the other party reviews or in 7 days.');
      }
    });
  }
}
```

## Configuration

```typescript
// Review timing configuration
export const REVIEW_CONFIG = {
  visibilityDelay: 7,        // Days to wait if only one reviews
  reviewDeadline: 14,        // Days until review opportunity expires
  reminderDays: [3, 6],      // Send reminders on these days
  autoCloseAfterDays: 30     // Close review period after this
};
```

## Related Documentation

- [Reviews System Guide](REVIEWS_SYSTEM_GUIDE.md) - Complete review features
- [Reviews Quick Start](REVIEWS_QUICK_START.md) - Quick implementation
- [Job Management Guide](JOB_MANAGEMENT_GUIDE.md) - Job completion triggers reviews
