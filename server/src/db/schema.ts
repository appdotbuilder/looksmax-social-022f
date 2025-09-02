import { serial, text, pgTable, timestamp, integer, pgEnum, jsonb } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const postTypeEnum = pgEnum('post_type', ['general', 'before_after', 'progress', 'routine']);
export const routineTypeEnum = pgEnum('routine_type', ['skincare', 'workout', 'diet', 'other']);

// Users table
export const usersTable = pgTable('users', {
  id: serial('id').primaryKey(),
  username: text('username').notNull().unique(),
  email: text('email').notNull().unique(),
  profile_picture: text('profile_picture'), // Nullable by default
  bio: text('bio'), // Nullable by default
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Posts table
export const postsTable = pgTable('posts', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').references(() => usersTable.id).notNull(),
  content: text('content'), // Nullable by default
  image_url: text('image_url'), // Nullable by default
  post_type: postTypeEnum('post_type').default('general').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Before/After photos table
export const beforeAfterTable = pgTable('before_after', {
  id: serial('id').primaryKey(),
  post_id: integer('post_id').references(() => postsTable.id).notNull(),
  before_image_url: text('before_image_url').notNull(),
  after_image_url: text('after_image_url').notNull(),
  description: text('description'), // Nullable by default
  time_period: text('time_period'), // Nullable by default
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// Progress logs table
export const progressLogsTable = pgTable('progress_logs', {
  id: serial('id').primaryKey(),
  post_id: integer('post_id').references(() => postsTable.id).notNull(),
  activity_type: text('activity_type').notNull(),
  description: text('description').notNull(),
  metric_value: integer('metric_value'), // Nullable by default
  metric_unit: text('metric_unit'), // Nullable by default
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// Routines table
export const routinesTable = pgTable('routines', {
  id: serial('id').primaryKey(),
  post_id: integer('post_id').references(() => postsTable.id).notNull(),
  routine_type: routineTypeEnum('routine_type').notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  steps: jsonb('steps').notNull(), // JSON array of steps
  duration: text('duration'), // Nullable by default
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// Follows table
export const followsTable = pgTable('follows', {
  id: serial('id').primaryKey(),
  follower_id: integer('follower_id').references(() => usersTable.id).notNull(),
  following_id: integer('following_id').references(() => usersTable.id).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// Likes table
export const likesTable = pgTable('likes', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').references(() => usersTable.id).notNull(),
  post_id: integer('post_id').references(() => postsTable.id).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// Comments table
export const commentsTable = pgTable('comments', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').references(() => usersTable.id).notNull(),
  post_id: integer('post_id').references(() => postsTable.id).notNull(),
  content: text('content').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(usersTable, ({ many }) => ({
  posts: many(postsTable),
  comments: many(commentsTable),
  likes: many(likesTable),
  followers: many(followsTable, { relationName: 'followers' }),
  following: many(followsTable, { relationName: 'following' }),
}));

export const postsRelations = relations(postsTable, ({ one, many }) => ({
  user: one(usersTable, {
    fields: [postsTable.user_id],
    references: [usersTable.id],
  }),
  comments: many(commentsTable),
  likes: many(likesTable),
  beforeAfter: one(beforeAfterTable),
  progressLog: one(progressLogsTable),
  routine: one(routinesTable),
}));

export const beforeAfterRelations = relations(beforeAfterTable, ({ one }) => ({
  post: one(postsTable, {
    fields: [beforeAfterTable.post_id],
    references: [postsTable.id],
  }),
}));

export const progressLogsRelations = relations(progressLogsTable, ({ one }) => ({
  post: one(postsTable, {
    fields: [progressLogsTable.post_id],
    references: [postsTable.id],
  }),
}));

export const routinesRelations = relations(routinesTable, ({ one }) => ({
  post: one(postsTable, {
    fields: [routinesTable.post_id],
    references: [postsTable.id],
  }),
}));

export const followsRelations = relations(followsTable, ({ one }) => ({
  follower: one(usersTable, {
    fields: [followsTable.follower_id],
    references: [usersTable.id],
    relationName: 'followers',
  }),
  following: one(usersTable, {
    fields: [followsTable.following_id],
    references: [usersTable.id],
    relationName: 'following',
  }),
}));

export const likesRelations = relations(likesTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [likesTable.user_id],
    references: [usersTable.id],
  }),
  post: one(postsTable, {
    fields: [likesTable.post_id],
    references: [postsTable.id],
  }),
}));

export const commentsRelations = relations(commentsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [commentsTable.user_id],
    references: [usersTable.id],
  }),
  post: one(postsTable, {
    fields: [commentsTable.post_id],
    references: [postsTable.id],
  }),
}));

// TypeScript types for the table schemas
export type User = typeof usersTable.$inferSelect;
export type NewUser = typeof usersTable.$inferInsert;

export type Post = typeof postsTable.$inferSelect;
export type NewPost = typeof postsTable.$inferInsert;

export type BeforeAfter = typeof beforeAfterTable.$inferSelect;
export type NewBeforeAfter = typeof beforeAfterTable.$inferInsert;

export type ProgressLog = typeof progressLogsTable.$inferSelect;
export type NewProgressLog = typeof progressLogsTable.$inferInsert;

export type Routine = typeof routinesTable.$inferSelect;
export type NewRoutine = typeof routinesTable.$inferInsert;

export type Follow = typeof followsTable.$inferSelect;
export type NewFollow = typeof followsTable.$inferInsert;

export type Like = typeof likesTable.$inferSelect;
export type NewLike = typeof likesTable.$inferInsert;

export type Comment = typeof commentsTable.$inferSelect;
export type NewComment = typeof commentsTable.$inferInsert;

// Export all tables for relation queries
export const tables = {
  users: usersTable,
  posts: postsTable,
  beforeAfter: beforeAfterTable,
  progressLogs: progressLogsTable,
  routines: routinesTable,
  follows: followsTable,
  likes: likesTable,
  comments: commentsTable,
};