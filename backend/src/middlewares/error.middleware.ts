import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/appError';

export const globalErrorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const isProd = process.env.NODE_ENV === 'production';

  const statusCode = (err instanceof AppError && err.statusCode) || 500;
  const message = err.message || 'Something went wrong';

  // Log internal error details (for dev or logs)
  console.error('ERROR 💥', err);

  // Send generic error in production, detailed in dev
  res.status(statusCode).json({
    status: 'error',
    message: isProd ? 'Internal Server Error' : message,
    ...(isProd ? {} : { stack: err.stack }),
  });
};
