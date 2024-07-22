import {einkaufRouter} from "@/server/api/routers/einkauf"
import {mailRouter} from "@/server/api/routers/emails"
import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { mitarbeiterRouter } from "./routers/mitarbeiter";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  einkauf: einkaufRouter,
  mail: mailRouter,
  mitarbeiter: mitarbeiterRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
