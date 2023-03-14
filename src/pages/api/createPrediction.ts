import type { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod';
import { env } from '~/env.mjs';

import { Prediction } from '~/server/api/routers/generate';

export type PredictionOutput = {
  predictionStatus: "succeeded"| "starting"| "processing"| "failed",
  predictionId: string;
  predictionOutput: string | null;
}

const CreatePredictionInput = z.object({
  textPrompt: z.string(),
  canvasUrl: z.string().url()
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PredictionOutput|{message: string}>
) {

  if (req.method != "POST") {
    return res.status(200).json({ message: "Ok"});
  }
  console.log("createPrediction init.");

  const input = CreatePredictionInput.safeParse(req.body);
  if (!input.success) {
    console.log("Unexpected INPUT object shape. [zod]");
    console.log(input.error);
    return res.status(400).json({
      predictionStatus: "failed",
      predictionId: "esathaethnoheunohutaeuhtohosehtohutaoehsuhoehth",
      predictionOutput: null
    });
  }

  const createPrediction = await fetch("https://api.replicate.com/v1/predictions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Token " + env.REPLICATE_API_KEY,
    },
    body: JSON.stringify({
      version: "435061a1b5a4c1e26740464bf786efdfa9cb3a3ac488595a2de23e143fdb0117",
      input: {
        image: input.data.canvasUrl,
        prompt: input.data.textPrompt,
      }
    }),
  });
  if (!createPrediction.ok) return res.status(500).json({
    predictionStatus: "failed",
    predictionId: "esathaethnoheunohutaeuhtohosehtohutaoehsuhoehth",
    predictionOutput: null
  });

  const prediction = Prediction.safeParse(await createPrediction.json());
  if (!prediction.success) {
    console.log("Unexpected Replicate response shape. [zod]");
    console.log(prediction.error);
    return res.status(500).json({
      predictionStatus: "failed",
      predictionId: "esathaethnoheunohutaeuhtohosehtohutaoehsuhoehth",
      predictionOutput: null
    });
  }

  return res.status(200).json({
    predictionId: prediction.data.id,
    predictionStatus: prediction.data.status,
    predictionOutput: prediction.data.output ? (prediction.data.output[1] ? prediction.data.output[1] : null) : null,
  });
}
