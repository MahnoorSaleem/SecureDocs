import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/appError';
import config from '../config/config';
import logger from '../utils/logger';
import { AuthRequest } from './auth.middleware';

export const globalErrorHandler = (
  err: Error | AppError,
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const isProd = config.nodeEnv === 'production';

  const statusCode = (err instanceof AppError && err.statusCode) || 500;
  const message = err.message || 'Something went wrong';

  // Log internal error details (for dev or logs)
  console.error('ERROR 💥', err);
  logger.error('Unhandled Error', {
    message: err.message,
    stack: err.stack,
    method: req.method,
    url: req.originalUrl,
    userId: req.user?.id,
  });

  // Send generic error in production, detailed in dev
  res.status(statusCode).json({
    status: 'error',
    message: isProd ? 'Internal Server Error' : message,
    ...(isProd ? {} : { stack: err.stack }),
  });
};
