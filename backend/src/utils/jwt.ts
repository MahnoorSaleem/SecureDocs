import jwt from 'jsonwebtoken';
import config from '../config/config';
import { AppError } from './appError';
import logger from './logger';
import { LogContext } from '../interfaces/logContext.interface';
import { logWithContext } from './contextualLogger';

export const generateAccessToken = (
  userId: string,
  context: LogContext,
): string => {
  logWithContext('info', 'generate access toke', context, {
    requestBody: { userId },
  });
  return jwt.sign({ id: userId }, config.JWT_SECRET!, { expiresIn: '1d' });
};

export const generateRefreshToken = (
  userId: string,
  context: LogContext,
): string => {
  logWithContext('info', 'generate refresh token', context, {
    requestBody: { userId },
  });
  return jwt.sign({ id: userId }, config.JWT_REFRESH_SECRET!, {
    expiresIn: '7d',
  });
};

export const verifyRefreshToken = (token: string, context: LogContext): { id: string } => {
  try {
    const decoded = jwt.verify(token, config.JWT_REFRESH_SECRET) as {
      id: string;
    };
    return decoded;
  } catch (err) {
    logger.error('Invalid or expired refresh token', { token });
    logWithContext('error', 'Invalid or expired refresh token', context, {
      error: err,
    });
    throw new AppError('Invalid or expired refresh token', 403);
  }
};
