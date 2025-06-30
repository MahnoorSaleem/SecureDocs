// middlewares/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/appError';
import config from '../config/config';

interface AuthPayload {
  id: string;
}

export interface AuthRequest extends Request {
  user?: { id: string };
}

export const isAuth = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AppError('Unauthorized: Token missing', 401);
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, config.JWT_SECRET!) as AuthPayload;
    req.user = { id: payload.id };
    next();
  } catch (err) {
    throw new AppError('Unauthorized: Invalid or expired token', 401);
  }
};
