import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import 'dotenv/config';
import cors from 'cors';
import superjson from 'superjson';
import { z } from 'zod';

// Import schemas
import { 
  createUserInputSchema,
  updateUserInputSchema,
  createPostInputSchema,
  getUserPostsInputSchema,
  getFeedInputSchema,
  createBeforeAfterInputSchema,
  createProgressLogInputSchema,
  createRoutineInputSchema,
  createFollowInputSchema,
  createLikeInputSchema,
  createCommentInputSchema,
  updateCommentInputSchema
} from './schema';

// Import handlers
import { createUser } from './handlers/create_user';
import { updateUser } from './handlers/update_user';
import { getUser } from './handlers/get_user';
import { createPost } from './handlers/create_post';
import { getUserPosts } from './handlers/get_user_posts';
import { getFeed } from './handlers/get_feed';
import { createBeforeAfter } from './handlers/create_before_after';
import { createProgressLog } from './handlers/create_progress_log';
import { createRoutine } from './handlers/create_routine';
import { createFollow } from './handlers/create_follow';
import { unfollowUser } from './handlers/unfollow_user';
import { createLike } from './handlers/create_like';
import { unlikePost } from './handlers/unlike_post';
import { createComment } from './handlers/create_comment';
import { updateComment } from './handlers/update_comment';
import { deleteComment } from './handlers/delete_comment';
import { getPostComments } from './handlers/get_post_comments';

const t = initTRPC.create({
  transformer: superjson,
});

const publicProcedure = t.procedure;
const router = t.router;

const appRouter = router({
  // Health check
  healthcheck: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),

  // User management
  createUser: publicProcedure
    .input(createUserInputSchema)
    .mutation(({ input }) => createUser(input)),

  updateUser: publicProcedure
    .input(updateUserInputSchema)
    .mutation(({ input }) => updateUser(input)),

  getUser: publicProcedure
    .input(z.number())
    .query(({ input }) => getUser(input)),

  // Posts
  createPost: publicProcedure
    .input(createPostInputSchema)
    .mutation(({ input }) => createPost(input)),

  getUserPosts: publicProcedure
    .input(getUserPostsInputSchema)
    .query(({ input }) => getUserPosts(input)),

  getFeed: publicProcedure
    .input(getFeedInputSchema)
    .query(({ input }) => getFeed(input)),

  // Looksmaxxing specific features
  createBeforeAfter: publicProcedure
    .input(createBeforeAfterInputSchema)
    .mutation(({ input }) => createBeforeAfter(input)),

  createProgressLog: publicProcedure
    .input(createProgressLogInputSchema)
    .mutation(({ input }) => createProgressLog(input)),

  createRoutine: publicProcedure
    .input(createRoutineInputSchema)
    .mutation(({ input }) => createRoutine(input)),

  // Social features
  followUser: publicProcedure
    .input(createFollowInputSchema)
    .mutation(({ input }) => createFollow(input)),

  unfollowUser: publicProcedure
    .input(createFollowInputSchema)
    .mutation(({ input }) => unfollowUser(input)),

  likePost: publicProcedure
    .input(createLikeInputSchema)
    .mutation(({ input }) => createLike(input)),

  unlikePost: publicProcedure
    .input(createLikeInputSchema)
    .mutation(({ input }) => unlikePost(input)),

  // Comments
  createComment: publicProcedure
    .input(createCommentInputSchema)
    .mutation(({ input }) => createComment(input)),

  updateComment: publicProcedure
    .input(updateCommentInputSchema)
    .mutation(({ input }) => updateComment(input)),

  deleteComment: publicProcedure
    .input(z.number())
    .mutation(({ input }) => deleteComment(input)),

  getPostComments: publicProcedure
    .input(z.number())
    .query(({ input }) => getPostComments(input)),
});

export type AppRouter = typeof appRouter;

async function start() {
  const port = process.env['SERVER_PORT'] || 2022;
  const server = createHTTPServer({
    middleware: (req, res, next) => {
      cors()(req, res, next);
    },
    router: appRouter,
    createContext() {
      return {};
    },
  });
  server.listen(port);
  console.log(`TRPC server listening at port: ${port}`);
}

start();