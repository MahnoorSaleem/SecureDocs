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
  const context = { ...req.logContext, apiName: '/register' };

  const { username, email, password } = req.body;

  logWithContext('info', 'register request', context, {
    request: {
      body: { username, email },
    },
    response: {
      message: 'register request',
    },
  });

  const user = await authService.registerUser(
    username,
    email,
    password,
    context,
  );

  logWithContext('info', 'User registered successfully', context, {
    request: {
      body: { username, email },
    },
    response: {
      statusCode: 201,
      message: 'User registered successfull',
      user,
    },
  });

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
    request: {
      params: req.params,
      body: { email },
    },
    response: {
      message: 'Login request received',
    },
  });

  const tokens = await authService.loginUser(email, password, context);
  logWithContext('info', 'Login successful', context, {
    request: {
      params: req.params,
      body: { email },
    },
    response: {
      statusCode: 200,
      message: 'Login request received',
      tokens,
    },
  });
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
      request: {
        userId: req.user?.id,
        params: req.params,
        body: req.body,
      },
      response: {
        statusCode: 401,
        message: 'Refresh token is required',
      },
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
      request: {
        userId: req.user?.id,
        params: req.params,
        body: req.body,
      },
      response: {
        statusCode: 403,
        message: 'Invalid or reused refresh token',
      },
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
    request: {
      userId: req.user?.id,
      params: req.params,
      body: req.body,
    },
    response: {
      statusCode: 200,
      message: 'Tokens Updated',
      tokens,
    },
  });
  sendResponse({
    res,
    message: 'Tokens Updated',
    data: tokens,
  });
};

export const logout = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.user?.id;
  const context = { ...req.logContext, apiName: '/logout' };
  logWithContext('info', 'logout request', context, {
    request: {
      userId: req.user?.id,
    },
    response: {
      message: 'logout request',
    },
  });

  if (!userId) {
    logWithContext('warn', 'Unauthorized', context, {
      request: {
        userId: req.user?.id,
        params: req.params,
        body: req.body,
      },
      response: {
        statusCode: 401,
        message: 'Unauthorized',
      },
    });
    return next(new AppError('Unauthorized', 401));
  }
  await redis.del(`refresh:${userId}`);
  logWithContext('info', 'Logged out successfully', context, {
    request: {
      userId: req.user?.id,
      params: req.params,
      body: req.body,
    },
    response: {
      statusCode: 200,
      message: 'Logged out successfully',
    },
  });
  sendResponse({ res, message: 'Logged out successfully' });
};
