import { NextFunction, Request, Response } from 'express';
import * as authService from '../services/auth.service';
import { AppError } from '../utils/appError';
import { sendResponse } from '../utils/sendReponse';
import redis from '../config/redis';
import config from '../config/config';
import * as jwtUtils from '../utils/jwt';
import { AuthRequest } from '../middlewares/auth.middleware';

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
    const tokens = await authService.loginUser(email, password);
    sendResponse({
        res,
        message: 'Login successful',
        data: tokens,
      });
};

export const refreshToken = async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      throw new AppError('Refresh token is required', 401);
    }

    // 1. Verify refresh token
    const payload = jwtUtils.verifyRefreshToken(refreshToken);
    const userId = payload.id;

    // 2. Fetch stored token from Redis
    const storedToken = await redis.get(`refresh:${userId}`);
    if (!storedToken || storedToken !== refreshToken) {
      throw new AppError('Invalid or reused refresh token', 403);
    }

    // 3. Rotate: generate new tokens
    const newAccessToken = jwtUtils.generateAccessToken(userId);
    const newRefreshToken = jwtUtils.generateRefreshToken(userId);

    // 4. Replace refresh token in Redis
    await redis.set(
      `refresh:${userId}`,
      newRefreshToken,
      'EX',
      config.JWT_REFRESH_TOKEN_EXPIRY
    );
    const tokens = {accessToken: newAccessToken,
    refreshToken: newRefreshToken}
    sendResponse({
      res,
      message: 'Toekns Updated',
      data: tokens
      
    });
};


export const logout = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    if (!userId) {
      return next(new AppError('Unauthorized', 401));
    }
    await redis.del(`refresh:${userId}`);
    sendResponse({res,  message: 'Logged out successfully' });
};


