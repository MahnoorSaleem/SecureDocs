// middlewares/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/appError';
import config from '../config/config';
import logger from '../utils/logger';

interface AuthPayload {
  id: string;
}

export interface AuthRequest extends Request {
  user?: { id: string };
}

export const isAuth = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    logger.warn('Unauthorized access attempt: Missing token', {
      requestId: req.id,
      ip: req.ip,
      path: req.originalUrl,
      method: req.method,
    });
    throw new AppError('Unauthorized: Token missing', 401);
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, config.JWT_SECRET!) as AuthPayload;
    req.user = { id: payload.id };
    logger.info('User authenticated successfully', {
      requestId: req.id,
      userId: payload.id,
      path: req.originalUrl,
      method: req.method,
      token
    });
    next();
  } catch (err) {
    logger.warn('Unauthorized access attempt: Invalid or expired token', {
      requestId: req.id,
      error: (err as Error).message,
      ip: req.ip,
      path: req.originalUrl,
      method: req.method,
    });
    throw new AppError('Unauthorized: Invalid or expired token', 401);
  }
};
