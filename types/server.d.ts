import { NextApiRequest } from "next";

export interface ExtendedNextApiRequest extends NextApiRequest {
  body: {
    imageUrl: string;
  };
}

export interface Response {
  description?: string;
  remaining?: number;
  reset?: string;
  caption?: string;
  usage?: number;
  error?: string;
  type: string;
}
