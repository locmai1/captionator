import { NextApiRequest } from "next";
import { OpenAIChatMessage } from "./openai";

export interface GenerateNextApiRequest extends NextApiRequest {
  body: {
    imageUrl: string;
  };
}

export interface RefreshNextApiRequest extends NextApiRequest {
  body: {
    context: OpenAIChatMessage[];
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
