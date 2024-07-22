import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

export const mitarbeiterRouter = createTRPCRouter({
  get: publicProcedure
    .input(z.object({ id: z.string().optional().nullish() }))
    .query(async ({ ctx, input }) => {
      if (input.id) {
        return await ctx.db.mitarbeiter.findUnique({
          where: {
            id: input.id
          }
        })
      }else {
        return await ctx.db.mitarbeiter.findMany({
            orderBy: {
                Name: "asc"
            }
        })
      }
      
    }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
