import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { Response } from "../../types/server";
import { authOptions } from "./auth/[...nextauth]";
import redis from "../../utils/redis";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  // Check if user is logged in
  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user) {
    return res.status(500).json({
      error: "Unauthorized request",
      type: "unauthorized_access",
    });
  }

  const identifier = session.user.email;
  const window = 24 * 60 * 60 * 1000;
  const timestamp = Math.floor(Date.now() / window);
  const used: number =
    (await redis?.get(`@upstash/ratelimit:${identifier!}:${timestamp}`)) || 0;
  const remaining = 5 - used;

  const now = new Date();
  const reset = new Date();
  reset.setHours(20, 0, 0, 0);
  if (now > reset) reset.setDate(reset.getDate() + 1);

  return res.status(200).json({
    remaining: remaining,
    reset: reset.toLocaleString(),
    type: "success",
  });
}
