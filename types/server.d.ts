import { NextApiRequest } from "next";
import { OpenAIChatMessage } from "./OpenAI";

export interface ExtendedNextApiRequest extends NextApiRequest {
  body: {
    imageUrl: string;
  };
}

export interface Response {
  context?: OpenAIChatMessage[];
  remaining?: number;
  reset?: string;
  caption?: string;
  usage?: number;
  error?: string;
  type: string;
}
