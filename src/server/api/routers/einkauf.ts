import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

export const einkaufRouter = createTRPCRouter({
  get: publicProcedure
    .input(z.object({ mitarbeiterId: z.string().optional().nullish() }))
    .query(async ({ ctx, input }) => {
      if (input.mitarbeiterId) {
        return await ctx.db.einkauf.findUnique({
          where: {
            mitarbeiterId: input.mitarbeiterId
          }
        })
      }else {
        return await ctx.db.einkauf.findMany({
          orderBy: {Abgeschickt: "desc"},
          include: {
            Mitarbeiter: true
          }
        })
      }
      
    }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
