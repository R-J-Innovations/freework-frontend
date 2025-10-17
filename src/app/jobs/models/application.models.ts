export interface JobApplication {
  id?: string;
  jobId: string;
  freelancerId: string;
  message: string;
  portfolioLink?: string;
  coverLetter: string;
  proposedRate?: number;
  estimatedDuration?: string;
  status: ApplicationStatus;
  appliedAt?: Date;
  updatedAt?: Date;
  freelancerName?: string;
  jobTitle?: string;
}

export enum ApplicationStatus {
  PENDING = 'Pending',
  ACCEPTED = 'Accepted',
  REJECTED = 'Rejected',
  WITHDRAWN = 'Withdrawn'
}

export interface CreateApplicationDto {
  jobId: string;
  message: string;
  portfolioLink?: string;
  coverLetter: string;
  proposedRate?: number;
  estimatedDuration?: string;
}

export interface ApplicationResponse {
  success: boolean;
  message: string;
  application?: JobApplication;
}

