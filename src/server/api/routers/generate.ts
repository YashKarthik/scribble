import { z } from "zod";
import { env } from "~/env.mjs";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const Prediction = z.object({
  id: z.string().min(5),
  version: z.string().min(5),
  urls: z.object({
    get: z.string().url(),
    cancel: z.string().url(),
  }),
  created_at: z.string().transform(d => new Date(d)),
  started_at: z.string().transform(d => new Date(d)).nullable(),
  completed_at: z.string().transform(d => new Date(d)).nullable(),
  source: z.string().nullish(),
  status: z.enum(["succeeded", "starting", "processing", "failed"]),
  input: z.object({
    image: z.string(),
    prompt: z.string(),
  }),
  output: z.array(z.string().url()).nullable(),
  error: z.string().nullable(),
  logs: z.string().nullable(),
  metrics: z.object({
    predict_time: z.number().nullish(),
  }),
});

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
        predictionStatus: z.enum(["succeeded", "starting", "processing", "failed"]),
        predictionId: z.string().min(10),
        predictionOutput: z.string().url().nullable(),
      })
    )
    // @ts-expect-error Zod forgets error
    .query(async ({ input }) => {
      console.log("createPrediction init.")
      const res = await fetch("https://api.replicate.com/v1/predictions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Token " + env.REPLICATE_API_KEY,
        },
        body: JSON.stringify({
          version: "435061a1b5a4c1e26740464bf786efdfa9cb3a3ac488595a2de23e143fdb0117",
          input: {
            image: input.canvasUrl,
            prompt: input.textPrompt,
          }
        }),
      });
      if (!res.ok) return {
        predictionStatus: "failed",
        predictionId: "esathaethnoheunohutaeuhtohosehtohutaoehsuhoehth",
        predictionOutput: null
      }

      const prediction = Prediction.safeParse(await res.json());
      if (!prediction.success) {
        console.log("Unexpected object shape. [zod]");
        console.log(prediction.error);
        return {
          predictionStatus: "failed",
          predictionId: "esathaethnoheunohutaeuhtohosehtohutaoehsuhoehth",
          predictionOutput: null
        }
      }

      return {
        predictionId: prediction.data.id,
        predictionStatus: prediction.data.status,
        predictionOutput: prediction.data.output ? prediction.data.output[1] : null,
      };
    }),

  pollPrediction: publicProcedure
    .input(
      z.object({
        predictionId: z.string().min(10),
      })
    )
    .output(
      z.object({
        predictionStatus: z.enum(["succeeded", "starting", "processing", "failed"]),
        predictionOutput: z.string().url().nullable(),
      })
    )
    // @ts-expect-error Zod forgets error
    .query( async ({ input }) => {
      console.log("Polling prediction", input.predictionId);
      const res = await fetch(`https://api.replicate.com/v1/predictions/${input.predictionId}`, {
        method: "GET",
        headers: {
          "Authorization": "Token " + env.REPLICATE_API_KEY,
        },
      });
      if (!res.ok) return {
        predictionStatus: "failed",
        predictionId: input.predictionId,
        predictionOutput: null
      }

      const t: unknown = await res.json();
      console.log(t);

      const prediction = Prediction.safeParse(t);
      if (!prediction.success) {
        console.log("Unexpected object shape. [zod]");
        console.log(prediction.error);
        return {
          predictionStatus: "failed",
          predictionId: input.predictionId,
          predictionOutput: null
        }
      }

      return {
        predictionStatus: prediction.data.status,
        predictionOutput: prediction.data.output ? prediction.data.output[1] : null,
      }
    })
});
