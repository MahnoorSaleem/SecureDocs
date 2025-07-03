import jwt from 'jsonwebtoken';
import config from '../config/config';
import { AppError } from './appError';

export const generateAccessToken = (userId: string): string => {
  return jwt.sign({ id: userId }, config.JWT_SECRET!, { expiresIn: '1d' });
};

export const generateRefreshToken = (userId: string): string => {
  return jwt.sign({ id: userId }, config.JWT_REFRESH_SECRET!, { expiresIn: '7d' });
};

export const verifyRefreshToken = (token: string): { id: string } => {
  try {
    const decoded = jwt.verify(token, config.JWT_REFRESH_SECRET) as { id: string };
    return decoded;
  } catch (err) {
    throw new AppError('Invalid or expired refresh token', 403 );
  }
};
