import { Request, Response, NextFunction } from 'express';
import redis from '../config/redis';
import { sendResponse } from '../utils/sendReponse';
import config from '../config/config';

const RATE_LIMIT_WINDOW = config.RATE_LIMIT_WINDOW;
const MAX_REQUESTS = config.MAX_REQUESTS;

export const customRateLimiter = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const ip = req.ip;
    const redisKey = `rate-limit:${ip}`;

    const requestCount = await redis.incr(redisKey);
    if (requestCount === 1) {
      await redis.expire(redisKey, RATE_LIMIT_WINDOW);
    }

    if (requestCount > MAX_REQUESTS) {
      return sendResponse({
        res,
        statusCode: 429,
        message: 'Too many requests',
        data: {},
      });
    }
    next();
  } catch (error) {
    next(error);
  }
};
