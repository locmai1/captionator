import type { NextApiRequest, NextApiResponse } from "next";
import { HfInference } from "@huggingface/inference";

type Data = string;
interface ExtendedNextApiRequest extends NextApiRequest {
  body: {
    imageUrl: string;
  };
}

export default async function handler(
  req: ExtendedNextApiRequest,
  res: NextApiResponse<Data>
) {
  const imageUrl = await fetch(req.body.imageUrl);
  const blob = await imageUrl.blob();

  const inference = new HfInference(process.env.HF_ACCESS_TOKEN);
  const response = await inference.imageToText({
    data: blob,
    model: "Salesforce/blip-image-captioning-large",
  });
  const data = response.generated_text;

  res.status(200).json(data ? data : "Failed to caption photo");
}
