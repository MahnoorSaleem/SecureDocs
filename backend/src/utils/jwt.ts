import jwt from 'jsonwebtoken';
import config from '../config/config';
import { AppError } from './appError';
import logger from './logger';

export const generateAccessToken = (userId: string): string => {
  logger.info('generate access token', {userId})
  return jwt.sign({ id: userId }, config.JWT_SECRET!, { expiresIn: '1d' });
};

export const generateRefreshToken = (userId: string): string => {
  logger.info('generate refresh token', {userId})
  return jwt.sign({ id: userId }, config.JWT_REFRESH_SECRET!, { expiresIn: '7d' });
};

export const verifyRefreshToken = (token: string): { id: string } => {
  try {
    const decoded = jwt.verify(token, config.JWT_REFRESH_SECRET) as { id: string };
    return decoded;
  } catch (err) {
    logger.error('Invalid or expired refresh token', {token})
    throw new AppError('Invalid or expired refresh token', 403 );
  }
};
