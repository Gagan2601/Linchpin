import { z } from 'zod';

export const AIToolSchema = z.object({
  name: z.string(),
  categories: z.array(z.string()),
  description: z.string(),
  website: z.string().url(),
  logo_url: z.string().url(),
  release_year: z.number().int(),
  skill_level: z.string(),
  trending: z.boolean(),
  founders: z.array(z.string()),
  total_rating: z.number().nullable().optional(),
  reviews: z
    .array(
      z.object({
        _id: z.any().optional(),
        userId: z.any(),
        username: z.string(),
        designation: z.string(),
        rating: z.number().min(1).max(5),
        comment: z.string(),
      }),
    )
    .optional(),
  pricing: z.object({
    plan: z.string(),
    details: z.array(
      z.object({
        type: z.string(),
        features: z.string(),
      }),
    ),
  }),
});

export const BulkAIToolSchema = z.array(AIToolSchema);

// Add these new schemas for submissions
export const AIToolSubmissionSchema = z.object({
  toolData: AIToolSchema,
  submittedBy: z.string(), // This will be converted to ObjectId in service
  status: z.enum(['pending', 'approved', 'rejected']).optional(),
  reviewedBy: z.string().optional(), // This will be converted to ObjectId in service
  reviewedAt: z.date().optional(),
  rejectionReason: z.string().optional(),
});

export const SubmitAIToolDto = AIToolSchema;
export const RejectSubmissionDto = z.object({
  reason: z.string(),
});

export type AIToolInput = z.infer<typeof AIToolSchema>;
export type BulkAIToolInput = z.infer<typeof BulkAIToolSchema>;
export type AIToolSubmissionInput = z.infer<typeof AIToolSubmissionSchema>;
export type SubmitAIToolDto = z.infer<typeof SubmitAIToolDto>;
export type RejectSubmissionDto = z.infer<typeof RejectSubmissionDto>;
