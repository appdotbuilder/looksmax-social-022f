import { z } from 'zod';

// User schema
export const userSchema = z.object({
  id: z.number(),
  username: z.string(),
  email: z.string().email(),
  profile_picture: z.string().nullable(),
  bio: z.string().nullable(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type User = z.infer<typeof userSchema>;

// Input schema for creating users
export const createUserInputSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.string().email(),
  profile_picture: z.string().nullable(),
  bio: z.string().max(500).nullable()
});

export type CreateUserInput = z.infer<typeof createUserInputSchema>;

// Input schema for updating users
export const updateUserInputSchema = z.object({
  id: z.number(),
  username: z.string().min(3).max(50).optional(),
  profile_picture: z.string().nullable().optional(),
  bio: z.string().max(500).nullable().optional()
});

export type UpdateUserInput = z.infer<typeof updateUserInputSchema>;

// Post schema
export const postSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  content: z.string().nullable(),
  image_url: z.string().nullable(),
  post_type: z.enum(['general', 'before_after', 'progress', 'routine']),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type Post = z.infer<typeof postSchema>;

// Input schema for creating posts
export const createPostInputSchema = z.object({
  user_id: z.number(),
  content: z.string().max(2000).nullable(),
  image_url: z.string().nullable(),
  post_type: z.enum(['general', 'before_after', 'progress', 'routine']).default('general')
});

export type CreatePostInput = z.infer<typeof createPostInputSchema>;

// Before/After photo schema
export const beforeAfterSchema = z.object({
  id: z.number(),
  post_id: z.number(),
  before_image_url: z.string(),
  after_image_url: z.string(),
  description: z.string().nullable(),
  time_period: z.string().nullable(), // e.g., "6 months", "1 year"
  created_at: z.coerce.date()
});

export type BeforeAfter = z.infer<typeof beforeAfterSchema>;

// Input schema for creating before/after photos
export const createBeforeAfterInputSchema = z.object({
  post_id: z.number(),
  before_image_url: z.string(),
  after_image_url: z.string(),
  description: z.string().max(1000).nullable(),
  time_period: z.string().max(100).nullable()
});

export type CreateBeforeAfterInput = z.infer<typeof createBeforeAfterInputSchema>;

// Progress log schema
export const progressLogSchema = z.object({
  id: z.number(),
  post_id: z.number(),
  activity_type: z.string(), // e.g., "skincare", "workout", "diet"
  description: z.string(),
  metric_value: z.number().nullable(), // e.g., weight, measurements
  metric_unit: z.string().nullable(), // e.g., "kg", "cm"
  created_at: z.coerce.date()
});

export type ProgressLog = z.infer<typeof progressLogSchema>;

// Input schema for creating progress logs
export const createProgressLogInputSchema = z.object({
  post_id: z.number(),
  activity_type: z.string().min(1).max(100),
  description: z.string().min(1).max(1000),
  metric_value: z.number().nullable(),
  metric_unit: z.string().max(20).nullable()
});

export type CreateProgressLogInput = z.infer<typeof createProgressLogInputSchema>;

// Routine schema
export const routineSchema = z.object({
  id: z.number(),
  post_id: z.number(),
  routine_type: z.enum(['skincare', 'workout', 'diet', 'other']),
  title: z.string(),
  description: z.string(),
  steps: z.array(z.string()), // JSON array of steps
  duration: z.string().nullable(), // e.g., "30 minutes", "daily"
  created_at: z.coerce.date()
});

export type Routine = z.infer<typeof routineSchema>;

// Input schema for creating routines
export const createRoutineInputSchema = z.object({
  post_id: z.number(),
  routine_type: z.enum(['skincare', 'workout', 'diet', 'other']),
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(2000),
  steps: z.array(z.string().min(1)),
  duration: z.string().max(100).nullable()
});

export type CreateRoutineInput = z.infer<typeof createRoutineInputSchema>;

// Follow schema
export const followSchema = z.object({
  id: z.number(),
  follower_id: z.number(),
  following_id: z.number(),
  created_at: z.coerce.date()
});

export type Follow = z.infer<typeof followSchema>;

// Input schema for following users
export const createFollowInputSchema = z.object({
  follower_id: z.number(),
  following_id: z.number()
});

export type CreateFollowInput = z.infer<typeof createFollowInputSchema>;

// Like schema
export const likeSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  post_id: z.number(),
  created_at: z.coerce.date()
});

export type Like = z.infer<typeof likeSchema>;

// Input schema for likes
export const createLikeInputSchema = z.object({
  user_id: z.number(),
  post_id: z.number()
});

export type CreateLikeInput = z.infer<typeof createLikeInputSchema>;

// Comment schema
export const commentSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  post_id: z.number(),
  content: z.string(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type Comment = z.infer<typeof commentSchema>;

// Input schema for creating comments
export const createCommentInputSchema = z.object({
  user_id: z.number(),
  post_id: z.number(),
  content: z.string().min(1).max(1000)
});

export type CreateCommentInput = z.infer<typeof createCommentInputSchema>;

// Input schema for updating comments
export const updateCommentInputSchema = z.object({
  id: z.number(),
  content: z.string().min(1).max(1000)
});

export type UpdateCommentInput = z.infer<typeof updateCommentInputSchema>;

// Feed query schema
export const getFeedInputSchema = z.object({
  user_id: z.number(),
  limit: z.number().int().min(1).max(100).default(20),
  offset: z.number().int().min(0).default(0)
});

export type GetFeedInput = z.infer<typeof getFeedInputSchema>;

// User posts query schema
export const getUserPostsInputSchema = z.object({
  user_id: z.number(),
  limit: z.number().int().min(1).max(100).default(20),
  offset: z.number().int().min(0).default(0)
});

export type GetUserPostsInput = z.infer<typeof getUserPostsInputSchema>;