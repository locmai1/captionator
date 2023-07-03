import type { NextApiResponse } from "next";
import { HfInference } from "@huggingface/inference";
import { getServerSession } from "next-auth";
import { Response, GenerateNextApiRequest } from "../../types/server";
import { OpenAIChatMessage } from "../../types/OpenAI";
import { authOptions } from "./auth/[...nextauth]";
import { ratelimit } from "../../utils/ratelimit";

export default async function handler(
  req: GenerateNextApiRequest,
  res: NextApiResponse<Response>
) {
  // Check if user is logged in
  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user) {
    return res.status(500).json({
      error: "Unauthenticated request",
      type: "unauthorized_access",
    });
  }

  if (ratelimit) {
    const identifier = session.user.email;
    const result = await ratelimit.limit(identifier!);

    if (!result.success) {
      return res.status(429).json({
        error: "Too many requests",
        type: "rate_limit",
      });
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
    return res.status(500).json({
      error: "Failed to generate description",
      type: "unknown",
    });
  }

  // Maintain context of captions
  const context: OpenAIChatMessage[] = [
    {
      role: "user",
      content: `short ig caption: ${description}`,
    },
  ];

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
    return res.status(500).json({
      error: "Failed to generate caption",
      type: captionData.error.type,
    });
  }

  const caption = captionData.choices[0].message.content.replace(/"/g, "");
  context.push({
    role: "assistant",
    content: caption,
  });

  return res.status(200).json({
    context: context,
    caption: caption,
    usage: captionData.usage.total_tokens,
    type: "success",
  });
}
