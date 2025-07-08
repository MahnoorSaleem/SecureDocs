import { NextFunction, Request, Response } from 'express';
import * as authService from '../services/auth.service';
import { AppError } from '../utils/appError';
import { sendResponse } from '../utils/sendReponse';
import redis from '../config/redis';
import config from '../config/config';
import * as jwtUtils from '../utils/jwt';
import { AuthRequest } from '../middlewares/auth.middleware';
import logger from '../utils/logger';
import { logWithContext } from '../utils/contextualLogger';

export const register = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  const user = await authService.registerUser(username, email, password);
  sendResponse({
    res,
    statusCode: 201,
    message: 'User registered successfully',
    data: user,
  });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const context = { ...req.logContext, apiName: '/login' };

  logWithContext('info', 'Login request received', context, {
    requestBody: { email: req.body.email },
  });

  const tokens = await authService.loginUser(email, password, context);
  sendResponse({
    res,
    message: 'Login successful',
    data: { requestId: req.id, tokens },
  });
};

export const refreshToken = async (req: AuthRequest, res: Response) => {
  const context = { ...req.logContext, apiName: '/refresh-token' };
  const { refreshToken } = req.body;
  if (!refreshToken) {
    logWithContext('error', 'Refresh token is required', context, {
      requestBody: { refreshToken },
    });
    throw new AppError('Refresh token is required', 401);
  }

  // 1. Verify refresh token
  const payload = jwtUtils.verifyRefreshToken(refreshToken, context);
  const userId = payload.id;

  // 2. Fetch stored token from Redis
  const storedToken = await redis.get(`refresh:${userId}`);
  if (!storedToken || storedToken !== refreshToken) {
    logWithContext('error', 'Invalid or reused refresh token', context, {
      requestBody: { refreshToken,  userId: req.user?.id, },
    });
    throw new AppError('Invalid or reused refresh token', 403);
  }

  // 3. Rotate: generate new tokens
  const newAccessToken = jwtUtils.generateAccessToken(userId, context);
  const newRefreshToken = jwtUtils.generateRefreshToken(userId, context);

  // 4. Replace refresh token in Redis
  await redis.set(
    `refresh:${userId}`,
    newRefreshToken,
    'EX',
    config.JWT_REFRESH_TOKEN_EXPIRY,
  );
  const tokens = { accessToken: newAccessToken, refreshToken: newRefreshToken };
  logger.info('Invalid or reused refresh token', {
    ...context,
    userId: req.user?.id,
    responseBody: tokens,
  });
  sendResponse({
    res,
    message: 'Toekns Updated',
    data: tokens,
  });
};

export const logout = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.user?.id;
  if (!userId) {
    logger.warn('Unauthorized', {
      requestId: req.id,
      method: req.method,
      url: req.originalUrl,
      userId: req.user?.id,
    });
    return next(new AppError('Unauthorized', 401));
  }
  await redis.del(`refresh:${userId}`);
  sendResponse({ res, message: 'Logged out successfully' });
};
