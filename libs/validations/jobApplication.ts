import { z } from 'zod';

export const jobApplicationSchema = z.object({
  jobTitle: z.string().min(1, 'Job title is required'),
  companyName: z.string().min(1, 'Company name is required'),
  location: z.string().min(1, 'Location is required'),
  salary: z.string().optional(),
  jobType: z.enum(['remote', 'hybrid', 'on-site']),
  employmentType: z.enum(['full-time', 'contract', 'part-time']),
  jobLink: z.string().url('Must be a valid URL'),
});

export type JobApplicationFormData = z.infer<typeof jobApplicationSchema>;
