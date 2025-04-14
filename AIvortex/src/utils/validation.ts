import { z } from 'zod';

export const AskAINodeSchema = z.object({
  prompt: z.string().min(1, 'Prompt is required').max(500, 'Prompt must be 500 characters or less'),
  context: z.string().max(1000, 'Context must be 1000 characters or less').optional(),
  model: z.enum(['gemini-2.0-flash-thinking-exp-01-21', 'deepseek-r1'], {
    errorMap: () => ({ message: 'Invalid AI model selected' }),
  }),
});

export const CultureFitNodeSchema = z.object({
  companyValues: z
    .string()
    .min(10, 'Company values must be at least 10 characters')
    .max(2000, 'Company values must be 2000 characters or less'),
  weights: z.record(
    z.enum(['resourcefulness', 'optimism', 'excitement', 'reliability', 'teamwork']),
    z.number().min(1, 'Weight must be between 1 and 10').max(10, 'Weight must be between 1 and 10')
  ),
});


export const LinkedInNodeSchema = z.object({
  profileUrl: z
    .string()
    .url('Must be a valid URL')
    .regex(
      /^https:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+\/?$/,
      'Must be a valid LinkedIn profile URL (e.g., https://www.linkedin.com/in/username/)'
    ),
});


export const PDFNodeSchema = z.object({
  title: z.string().min(1, 'PDF title is required').max(100, 'PDF title must be 100 characters or less'),
  content: z
    .string()
    .max(5000, 'Content must be 5000 characters or less')
    .optional()
    .refine((val) => val !== undefined, 'Content cannot be undefined'),
});

export const TypeformNodeSchema = z.object({
  formId: z.string().min(1, 'Form ID is required').max(50, 'Form ID must be 50 characters or less'),
  apiKey: z.string().min(1, 'API Key is required').max(100, 'API Key must be 100 characters or less'),
});