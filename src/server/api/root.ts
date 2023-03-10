import { createTRPCRouter } from "~/server/api/trpc";
import { replicateAPIRouter } from "./routers/generate";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  replicate: replicateAPIRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
