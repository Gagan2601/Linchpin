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

export type AIToolInput = z.infer<typeof AIToolSchema>;
export type BulkAIToolInput = z.infer<typeof BulkAIToolSchema>;
