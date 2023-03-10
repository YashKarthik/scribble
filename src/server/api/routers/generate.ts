import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const replicateAPIRouter = createTRPCRouter({
  createPrediction: publicProcedure
    .input(
      z.object({
        textPrompt: z.string(),
        canvasUrl: z.string().url(),
      })
    )
    .output(
      z.object({
        predictionStatus: z.enum(["succeeded", "starting", "processing", "failed", "cancelled"]),
        predictionId: z.string().min(10),
        predictionOutput: z.string().url().nullable(),
      })
    )
    .query(({ input }) => {
      console.log(input);
      return {
        predictionId: "esaotuhnaoetonthntahtneheo",
        predictionStatus: "starting",
        predictionOutput: null,
      };
    }),

  pollPredition: publicProcedure
    .input(
      z.object({
        predictionId: z.string().min(10),
      })
    )
    .output(
      z.object({
        predictionStatus: z.enum(["succeeded", "starting", "processing", "failed", "cancelled"]),
        predictionOutput: z.string().url().nullable(),
      })
    )
    .query(({ input }) => {
      console.log(input);

      return {
        predictionStatus: "succeeded",
        predictionOutput: "https://"
      }
    })
});
