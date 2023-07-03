import { Ratelimit } from "@upstash/ratelimit";
import redis from "./redis";

const env = parseInt(process.env.UPSTASH_REDIS_RATE_LIMIT || "");
const limit = Number.isInteger(env) ? env : 0;

export const ratelimit = redis
  ? new Ratelimit({
      redis: redis,
      limiter: Ratelimit.fixedWindow(limit, "1440 m"),
      analytics: true,
    })
  : undefined;
