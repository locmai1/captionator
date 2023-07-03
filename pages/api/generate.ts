import type { NextApiResponse } from "next";
import { HfInference } from "@huggingface/inference";
// import { Ratelimit } from "@upstash/ratelimit";
import { getServerSession } from "next-auth";
import { Response, GenerateNextApiRequest } from "../../types/server";
import { OpenAIChatMessage } from "../../types/OpenAI";
import { authOptions } from "./auth/[...nextauth]";
// import redis from "../../utils/redis";
import { ratelimit } from "../../utils/ratelimit";

// Rate limiter: 5 requests per day
// const env = parseInt(process.env.UPSTASH_REDIS_RATE_LIMIT || "");
// const limit = Number.isInteger(env) ? env : 0;
// const ratelimit = redis
//   ? new Ratelimit({
//       redis: redis,
//       limiter: Ratelimit.fixedWindow(limit, "1440 m"),
//       analytics: true,
//     })
//   : undefined;

export default async function handler(
  req: GenerateNextApiRequest,
  res: NextApiResponse<Response>
) {
  // Check if user is logged in
  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user) {
    res.status(500).json({
      error: "Unauthenticated request",
      type: "unauthorized_access",
    });
    return;
  }

  if (ratelimit) {
    const identifier = session.user.email;
    const result = await ratelimit.limit(identifier!);

    if (!result.success) {
      res.status(429).json({
        error: "Too many requests",
        type: "rate_limit",
      });
      return;
    }
  }

  const imageUrl = await fetch(req.body.imageUrl);
  const blob = await imageUrl.blob();

  const inference = new HfInference(process.env.HF_ACCESS_TOKEN);
  const descriptionResponse = await inference.imageToText({
    data: blob,
    model: "Salesforce/blip-image-captioning-large",
  });
  const description = descriptionResponse.generated_text;

  if (!description) {
    res.status(500).json({
      error: "Failed to generate description",
      type: "unknown",
    });
    return;
  }

  const context: OpenAIChatMessage[] = [
    {
      role: "user",
      content: `short ig caption: ${description}`,
    },
  ];

  // TODO: put the description into a context Message(role, content)
  // TODO: get caption, append into context variable
  // TODO: figure out how to handle context variable elegantly
  // TODO: set context as a response field, set field on frontend
  // TODO: build api/refresh route that takes in context as params
  // TODO: api/refresh response will generate new caption, append it to params, return params

  const captionResponse = await fetch(
    "https://api.openai.com/v1/chat/completions",
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      method: "POST",
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: context,
        temperature: 0.7,
        max_tokens: 30,
      }),
    }
  );
  const captionData = await captionResponse.json();

  if (captionData.error) {
    res.status(500).json({
      error: "Failed to generate caption",
      type: captionData.error.type,
    });
    return;
  }

  const caption = captionData.choices[0].message.content.replace(/"/g, "");
  context.push({
    role: "assistant",
    content: caption,
  });

  res.status(200).json({
    context: context,
    caption: caption,
    usage: captionData.usage.total_tokens,
    type: "success",
  });
  return;
}
