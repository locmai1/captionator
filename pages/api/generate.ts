import type { NextApiRequest, NextApiResponse } from "next";
import { HfInference } from "@huggingface/inference";
import { Ratelimit } from "@upstash/ratelimit";
import requestIp from "request-ip";
import redis from "../../utils/redis";

type Data = {
  description?: string;
  caption?: string;
  usage?: Number;
  reset?: string;
  error?: string;
  type: string;
};
interface ExtendedNextApiRequest extends NextApiRequest {
  body: {
    imageUrl: string;
  };
}
// Rate limiter: 3 requests per day
const ratelimit = redis
  ? new Ratelimit({
      redis: redis,
      limiter: Ratelimit.fixedWindow(3, "1440 m"),
    })
  : undefined;

export default async function handler(
  req: ExtendedNextApiRequest,
  res: NextApiResponse<Data>
) {
  if (ratelimit) {
    const identifier = requestIp.getClientIp(req);
    const result = await ratelimit.limit(identifier!);
    const reset = new Date(result.reset).toLocaleString();

    if (!result.success) {
      res.status(429).json({
        error: "Too many requests",
        reset: reset,
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
        messages: [
          {
            role: "user",
            content: `short ig caption: ${description}`,
          },
        ],
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

  res.status(200).json({
    description: description,
    caption: captionData.choices[0].message.content.replace(/"/g, ""),
    usage: captionData.usage.total_tokens,
    type: "success",
  });
}
